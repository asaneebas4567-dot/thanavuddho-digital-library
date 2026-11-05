import { NextRequest, NextResponse } from 'next/server';
import { upsertGoogleUser } from '@/lib/serverUserStore';
import { GoogleJwtPayload } from '@/types/auth';

function parseJwt(token: string): GoogleJwtPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('Failed to parse JWT token:', err);
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { credential, clientId } = body;

    if (!credential) {
      return NextResponse.json(
        { success: false, message: 'ไม่พบ Credential โทเค็นจาก Google' },
        { status: 400 }
      );
    }

    // Parse Google JWT ID Token
    const payload = parseJwt(credential);

    if (!payload || !payload.email) {
      return NextResponse.json(
        { success: false, message: 'โทเค็นของ Google ไม่ถูกต้องหรือหมดอายุ' },
        { status: 400 }
      );
    }

    // Verify issuer is Google
    if (payload.iss && !payload.iss.includes('accounts.google.com')) {
      return NextResponse.json(
        { success: false, message: 'ผู้ให้บริการโทเค็นไม่ใช่ Google Account' },
        { status: 400 }
      );
    }

    // Upsert into persistent server store
    const userSession = upsertGoogleUser(payload);

    return NextResponse.json({
      success: true,
      message: 'เข้าสู่ระบบด้วย Google สำเร็จเรียบร้อย',
      user: userSession,
    });
  } catch (error: any) {
    console.error('Google Auth Verify Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'เกิดข้อผิดพลาดในการตรวจสอบบัญชี Google' },
      { status: 500 }
    );
  }
}
