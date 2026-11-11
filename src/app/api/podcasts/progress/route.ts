import { NextRequest, NextResponse } from 'next/server';
import { getListeningProgress, saveListeningProgress } from '@/lib/serverPodcastStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const podcastId = searchParams.get('podcastId');

    if (!email || !podcastId) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุ email และ podcastId' }, { status: 400 });
    }

    const progress = getListeningProgress(email, podcastId);
    return NextResponse.json({
      success: true,
      progress: progress || {
        user_email: email,
        podcast_id: podcastId,
        current_position_seconds: 0,
        duration_seconds: 0,
        completed_status: false
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, userId, podcastId, currentPositionSeconds, durationSeconds } = body;

    if (!email || !podcastId) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const saved = saveListeningProgress(
      email,
      userId || email,
      podcastId,
      Number(currentPositionSeconds) || 0,
      Number(durationSeconds) || 0
    );

    return NextResponse.json({
      success: true,
      progress: saved
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

