import { NextRequest, NextResponse } from 'next/server';
import { registerMemberAccount, getUserByEmail } from '@/lib/serverUserStore';
import { grantWelcomeBonusServer } from '@/lib/learningPointsServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, ageRange, password } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกอีเมลที่ถูกต้อง' }, { status: 400 });
    }

    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, message: 'รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร' }, { status: 400 });
    }

    const result = registerMemberAccount({
      name: name || '',
      email,
      phone: phone || '',
      ageRange: ageRange || '18-25 ปี',
      password,
    });

    if (!result.success || !result.user) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    // Award Welcome Bonus of 500 Points (Atomic, Idempotent, Supabase + Points History synced)
    const bonusResult = await grantWelcomeBonusServer(result.user.email, result.user.id);
    const updatedUser = getUserByEmail(result.user.email) || {
      ...result.user,
      points: bonusResult.currentBalance
    };

    return NextResponse.json({
      success: true,
      message: result.message,
      user: updatedUser,
      welcomeBonus: {
        points: bonusResult.pointsEarned,
        isNewMemberWelcome: true,
        message: 'ยินดีต้อนรับสมาชิกใหม่! คุณได้รับคะแนนต้อนรับ 500 แต้ม'
      }
    });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
