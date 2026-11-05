import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUserLoansAndPoints } from '@/lib/serverUserStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมล' }, { status: 400 });
  }

  const user = getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ success: false, message: 'ไม่พบข้อมูลผู้ใช้' }, { status: 404 });
  }

  return NextResponse.json({ success: true, user });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, loans, pointsDelta } = body;

    if (!email) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมล' }, { status: 400 });
    }

    const updated = updateUserLoansAndPoints(email, loans || [], pointsDelta);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'ไม่พบผู้ใช้ในระบบ' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
