import { NextRequest, NextResponse } from 'next/server';
import { pingListeningSession } from '@/lib/serverPodcastStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, podcastId, sourceType, deltaSeconds } = body;

    if (!email || !podcastId) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const result = pingListeningSession({
      userEmail: email,
      podcastId,
      sourceType: sourceType === 'mp3' ? 'mp3' : 'youtube',
      deltaSeconds: Number(deltaSeconds) || 15
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

