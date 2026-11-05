import { NextRequest, NextResponse } from 'next/server';
import { registerMemberAccount } from '@/lib/serverUserStore';

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

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      user: result.user
    });

  } catch (error: any) {
    console.error('Registration API Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
