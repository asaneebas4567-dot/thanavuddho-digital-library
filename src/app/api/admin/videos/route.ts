import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllVideoKnowledge, 
  saveVideoKnowledgeItem, 
  deleteVideoKnowledgeItem,
  getUnansweredQueries,
  resolveUnansweredQuery,
  deleteUnansweredQuery
} from '@/data/videoKnowledgeDatabase';
import { VideoKnowledgeItem } from '@/types';

function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function extractTikTokId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/(?:video\/|v\/|embed\/v2\/|embed\/)(\d+)/);
  if (match && match[1]) return match[1];
  const digits = url.match(/\/(\d{15,25})/);
  if (digits && digits[1]) return digits[1];
  return null;
}

export async function GET() {
  try {
    const videos = getAllVideoKnowledge();
    const unansweredQueries = getUnansweredQueries();

    return NextResponse.json({
      success: true,
      videos,
      unansweredQueries
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const action = body.action || 'add';

    if (action === 'add' || action === 'update') {
      const { video } = body;
      if (!video || (!video.url && !video.title)) {
        return NextResponse.json({ success: false, error: 'กรุณาระบุลิงก์วิดีโอหรือชื่อวิดีโอ' }, { status: 400 });
      }

      const rawUrl = (video.url || '').trim();
      const isTikTok = video.platform === 'tiktok' || rawUrl.includes('tiktok.com');
      let tiktokId = isTikTok ? (video.tiktokId || extractTikTokId(rawUrl) || undefined) : undefined;
      const platform = isTikTok ? 'tiktok' : 'youtube';

      let autoTitle = (video.title || '').trim();
      let autoThumbnail = video.thumbnail || '';
      let autoAuthor = video.channelName || '';
      let autoHandle = video.channelHandle || '';

      // If TikTok URL is provided, enrich metadata from TikTok oEmbed
      if (isTikTok && rawUrl) {
        try {
          const oembedRes = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(rawUrl)}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            next: { revalidate: 3600 }
          });
          if (oembedRes.ok) {
            const oembedData = await oembedRes.json();
            if (!autoTitle && oembedData.title) {
              autoTitle = oembedData.title.trim();
            }
            if (!autoThumbnail && oembedData.thumbnail_url) {
              autoThumbnail = oembedData.thumbnail_url;
            }
            if (!autoAuthor && oembedData.author_name) {
              autoAuthor = `${oembedData.author_name} (@${oembedData.embed_product_id || 'thanavuddhostory'})`;
            }
            if (!autoHandle && oembedData.author_url) {
              const handleMatch = oembedData.author_url.match(/@([a-zA-Z0-9._]+)/);
              if (handleMatch) autoHandle = `@${handleMatch[1]}`;
            }
            if (!tiktokId && oembedData.embed_product_id && /^\d+$/.test(oembedData.embed_product_id)) {
              tiktokId = oembedData.embed_product_id;
            }
          }
        } catch (e) {
          console.warn('TikTok oEmbed lookup failed:', e);
        }
      }

      if (!autoTitle) {
        if (isTikTok) {
          autoTitle = 'คลิปธรรมะสั้นสอนใจ | TikTok @thanavuddhostory';
        } else {
          autoTitle = 'คลิปธรรมบรรยาย พระครูปลัดสุวัฒนโพธิคุณ';
        }
      }

      let youtubeId = video.youtubeId;
      if (!isTikTok && !youtubeId && rawUrl) {
        youtubeId = extractYouTubeId(rawUrl) || '';
      }

      const id = video.id || `vid-${Date.now()}`;
      const url = rawUrl || (isTikTok ? (tiktokId ? `https://www.tiktok.com/@thanavuddhostory/video/${tiktokId}` : 'https://www.tiktok.com/@thanavuddhostory') : (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : ''));
      
      const thumbnail = autoThumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : (isTikTok ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600' : '/images/books/book-placeholder.jpg'));

      const newItem: VideoKnowledgeItem = {
        id,
        platform,
        youtubeId: youtubeId || (isTikTok ? 'tiktok' : 'custom'),
        tiktokId: tiktokId || (isTikTok ? 'thanavuddhostory' : undefined),
        title: autoTitle,
        url,
        thumbnail,
        channelName: autoAuthor || (isTikTok ? 'Thanavuddho Story (TikTok @thanavuddhostory)' : 'Thanavuddho Story (พระครูปลัดสุวัฒนโพธิคุณ)'),
        channelHandle: autoHandle || (isTikTok ? '@thanavuddhostory' : '@ThanavuddhoStory'),
        description: video.description || (isTikTok ? 'คลิปสั้นธรรมะข้อคิดเตือนใจจากช่อง TikTok @thanavuddhostory' : ''),
        transcript: video.transcript || undefined,
        transcriptSegments: Array.isArray(video.transcriptSegments) ? video.transcriptSegments : undefined,
        hasVerifiedTranscript: !!video.hasVerifiedTranscript,
        startSeconds: video.startSeconds ? Number(video.startSeconds) : undefined,
        startFormatted: video.startFormatted || undefined,
        tags: Array.isArray(video.tags) ? video.tags : (video.tags ? String(video.tags).split(',').map((t: string) => t.trim()) : (isTikTok ? ['TikTok', 'คลิปติ๊กต๊อก', 'thanavuddhostory', 'ธรรมะรอบตัว'] : [])),
        keywords: Array.isArray(video.keywords) ? video.keywords : (video.keywords ? String(video.keywords).split(',').map((k: string) => k.trim()) : []),
        publishedDate: video.publishedDate || new Date().toISOString().split('T')[0],
        status: video.status || 'published',
        isOfficialChannel: video.isOfficialChannel !== false,
        recommendCount: video.recommendCount || 0
      };

      const saved = saveVideoKnowledgeItem(newItem);
      return NextResponse.json({ success: true, video: saved });
    }

    if (action === 'delete') {
      const { id } = body;
      if (!id) {
        return NextResponse.json({ success: false, error: 'กรุณาระบุ ID วิดีโอที่ต้องการลบ' }, { status: 400 });
      }
      const success = deleteVideoKnowledgeItem(id);
      return NextResponse.json({ success });
    }

    if (action === 'resolve_query') {
      const { id } = body;
      const success = resolveUnansweredQuery(id);
      return NextResponse.json({ success });
    }

    if (action === 'delete_query') {
      const { id } = body;
      const success = deleteUnansweredQuery(id);
      return NextResponse.json({ success });
    }

    return NextResponse.json({ success: false, error: 'ไม่พบคำสั่งที่ระบุ' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

