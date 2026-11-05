import { NextRequest, NextResponse } from 'next/server';
import { authenticateMember } from '@/lib/serverUserStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !identifier.trim()) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกอีเมลหรือเบอร์โทรศัพท์' }, { status: 400 });
    }

    if (!password) {
      return NextResponse.json({ success: false, message: 'กรุณากรอกรหัสผ่าน' }, { status: 400 });
    }

    const result = authenticateMember(identifier.trim(), password);

    if (!result.success) {
      return NextResponse.json({ success: false, message: result.message }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      user: result.user
    });

  } catch (error: any) {
    console.error('Login API Error:', error);
    return NextResponse.json(
      { success: false, message: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองใหม่อีกครั้ง' },
      { status: 500 }
    );
  }
}
