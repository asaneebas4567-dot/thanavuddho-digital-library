import { NextRequest, NextResponse } from 'next/server';
import { redeemReward } from '@/lib/learningPointsServer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      email, 
      rewardId, 
      recipientName, 
      recipientPhone, 
      shippingAddress, 
      note 
    } = body;

    if (!email || !rewardId || !recipientName || !recipientPhone || !shippingAddress) {
      return NextResponse.json({ 
        success: false, 
        message: 'กรุณากรอกข้อมูลชื่อผู้รับ เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน' 
      }, { status: 400 });
    }

    const result = redeemReward({
      userEmail: email,
      rewardId,
      recipientName,
      recipientPhone,
      shippingAddress,
      note
    });

    if (!result.success) {
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

