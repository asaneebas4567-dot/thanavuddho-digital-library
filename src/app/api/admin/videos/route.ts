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
      if (!video || !video.title) {
        return NextResponse.json({ success: false, error: 'กรุณาระบุชื่อวิดีโอ' }, { status: 400 });
      }

      let youtubeId = video.youtubeId;
      if (!youtubeId && video.url) {
        youtubeId = extractYouTubeId(video.url) || '';
      }

      const id = video.id || `vid-${Date.now()}`;
      const url = video.url || (youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : '');
      const thumbnail = video.thumbnail || (youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : '/images/books/book-placeholder.jpg');

      const newItem: VideoKnowledgeItem = {
        id,
        youtubeId: youtubeId || 'custom',
        title: video.title.trim(),
        url,
        thumbnail,
        channelName: video.channelName || 'Thanavuddho Story (พระครูปลัดสุวัฒนโพธิคุณ)',
        channelHandle: video.channelHandle || '@ThanavuddhoStory',
        description: video.description || '',
        transcript: video.transcript || undefined,
        transcriptSegments: Array.isArray(video.transcriptSegments) ? video.transcriptSegments : undefined,
        hasVerifiedTranscript: !!video.hasVerifiedTranscript,
        startSeconds: video.startSeconds ? Number(video.startSeconds) : undefined,
        startFormatted: video.startFormatted || undefined,
        tags: Array.isArray(video.tags) ? video.tags : (video.tags ? String(video.tags).split(',').map((t: string) => t.trim()) : []),
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

