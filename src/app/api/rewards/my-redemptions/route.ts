import { NextRequest, NextResponse } from 'next/server';
import { getUserRedemptions } from '@/lib/learningPointsServer';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมล' }, { status: 400 });
  }

  const redemptions = getUserRedemptions(email);
  return NextResponse.json({
    success: true,
    redemptions
  });
}

