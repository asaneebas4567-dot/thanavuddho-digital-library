import { NextRequest, NextResponse } from 'next/server';
import { getAllPodcasts, savePodcasts } from '@/lib/serverPodcastStore';
import { parseYouTubeUrl, formatDuration } from '@/lib/youtubeUtils';
import { PodcastItem } from '@/types/podcast';

export async function GET() {
  try {
    const podcasts = getAllPodcasts();
    return NextResponse.json({ success: true, count: podcasts.length, podcasts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      id, 
      title, 
      host, 
      description, 
      cover_image, 
      source_type, 
      youtube_url, 
      audio_file_path,
      audio_url, 
      duration_seconds, 
      duration_formatted,
      category_id, 
      category_name,
      is_published, 
      book_id,
      order 
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุชื่อรายการ Podcast / ตอน' }, { status: 400 });
    }

    const podSourceType = source_type === 'mp3' ? 'mp3' : 'youtube';
    let parsedVideoId: string | undefined = undefined;
    let computedCover = cover_image?.trim() || '';
    let secDuration = Number(duration_seconds) || 900;

    if (podSourceType === 'youtube') {
      const ytInfo = parseYouTubeUrl(youtube_url || '');
      if (!ytInfo.isValid && !id) {
        return NextResponse.json({ 
          success: false, 
          error: 'ลิงก์ YouTube ไม่ถูกต้อง กรุณาระบุ URL วิดีโอ YouTube ที่ถูกต้อง' 
        }, { status: 400 });
      }
      parsedVideoId = ytInfo.videoId || undefined;
      if (!computedCover && ytInfo.thumbnailUrl) {
        computedCover = ytInfo.thumbnailUrl;
      }
    } else {
      // MP3
      if (!audio_url && !audio_file_path) {
        return NextResponse.json({ 
          success: false, 
          error: 'กรุณาระบุที่อยู่ไฟล์เสียง MP3 หรืออัปโหลดไฟล์เสียง' 
        }, { status: 400 });
      }
      if (!computedCover) {
        computedCover = '/images/books/tam-jai-hai-prom-buak.jpg';
      }
    }

    const podcasts = getAllPodcasts();
    const podId = id || `pod-${Date.now()}`;
    const cleanTitle = title.trim();

    const record: PodcastItem = {
      id: podId,
      title: cleanTitle,
      description: description ? description.trim() : '',
      host: host ? host.trim() : 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
      cover_image: computedCover,
      source_type: podSourceType,
      youtube_url: podSourceType === 'youtube' ? (youtube_url || '') : undefined,
      youtube_video_id: parsedVideoId,
      audio_file_path: podSourceType === 'mp3' ? (audio_file_path || '') : undefined,
      audio_url: podSourceType === 'mp3' ? (audio_url || audio_file_path || '') : undefined,
      duration_seconds: secDuration,
      duration_formatted: duration_formatted || formatDuration(secDuration),
      category_id: category_id || 'cat_mind',
      category_name: category_name || 'พัฒนาจิตใจ & คิดบวก',
      is_published: is_published !== false,
      published_at: new Date().toLocaleDateString('th-TH'),
      book_id: book_id || undefined,
      order: Number(order) || (podcasts.length + 1)
    };

    const idx = podcasts.findIndex(p => p.id === podId);
    if (idx >= 0) {
      podcasts[idx] = { ...podcasts[idx], ...record };
    } else {
      podcasts.push(record);
    }

    savePodcasts(podcasts);

    return NextResponse.json({
      success: true,
      message: idx >= 0 ? 'อัปเดตข้อมูล Podcast เรียบร้อยแล้ว' : 'เพิ่ม Podcast ใหม่เข้าสู่ระบบเรียบร้อยแล้ว',
      podcast: record
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุ ID Podcast ที่ต้องการลบ' }, { status: 400 });
    }

    const podcasts = getAllPodcasts();
    const updated = podcasts.filter(p => p.id !== id);
    savePodcasts(updated);

    return NextResponse.json({ success: true, message: 'ลบ Podcast เรียบร้อยแล้ว' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
