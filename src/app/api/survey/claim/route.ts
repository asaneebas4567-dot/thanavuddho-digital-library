import { NextRequest, NextResponse } from 'next/server';
import { claimSurveyRewardForUser, checkUserSurveyRewardStatus } from '@/lib/serverSurveyStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมล' }, { status: 400 });
    }

    const status = checkUserSurveyRewardStatus(email);
    return NextResponse.json({
      success: true,
      ...status
    });
  } catch (err: any) {
    console.error('Error checking survey reward status:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมลผู้ใช้งาน' }, { status: 400 });
    }

    const result = claimSurveyRewardForUser(email);

    return NextResponse.json(result, {
      status: result.success ? 200 : (result.alreadyAwarded ? 409 : 400)
    });
  } catch (err: any) {
    console.error('Error claiming survey reward:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
