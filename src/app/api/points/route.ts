import { NextRequest, NextResponse } from 'next/server';
import { 
  processEarnPoints, 
  getUserPointsHistory, 
  getUserDailyActivity, 
  getUserMediaProgress,
  EarnEventParams 
} from '@/lib/learningPointsServer';
import { getUserByEmail } from '@/lib/serverUserStore';
import { UserSession } from '@/types/auth';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมล' }, { status: 400 });
  }

  let foundUser = getUserByEmail(email);
  const activeUser: UserSession = foundUser || {
    id: `usr_${Date.now()}`,
    memberCardId: `GUEST-${Math.floor(1000 + Math.random() * 9000)}`,
    email: email.toLowerCase(),
    name: email.startsWith('guest_') ? 'ผู้ศึกษาธรรม' : email.split('@')[0],
    picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(email)}`,
    email_verified: false,
    points: 0,
    loans: [],
    boundType: 'email',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString()
  };

  const daily = getUserDailyActivity(email);
  const history = getUserPointsHistory(email).slice(0, 20); // Top 20 recent
  const videoProgress = getUserMediaProgress(email, 'video');
  const audioProgress = getUserMediaProgress(email, 'audio');

  return NextResponse.json({
    success: true,
    user: {
      id: activeUser.id,
      name: activeUser.name,
      email: activeUser.email,
      points: activeUser.points,
      picture: activeUser.picture
    },
    today: {
      ...daily,
      dailyLearningCap: 100,
      remainingDailyQuota: Math.max(0, 100 - (daily.dailyLearningPoints || 0)),
      isDailyCapReached: (daily.dailyLearningPoints || 0) >= 100
    },
    recentHistory: history,
    videoProgress,
    audioProgress
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      type, 
      sourceId, 
      chapterIndex, 
      chapterTitle, 
      chapterPageCount, 
      durationSeconds 
    } = body;

    if (!email || !type) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const result = processEarnPoints({
      userEmail: email,
      type,
      sourceId,
      chapterIndex,
      chapterTitle,
      chapterPageCount,
      durationSeconds
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
