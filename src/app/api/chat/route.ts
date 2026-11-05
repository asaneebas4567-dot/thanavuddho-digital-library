import { NextRequest, NextResponse } from 'next/server';
import { synthesizeGroundedDhammaAnswer } from '@/lib/dhammaSynthesisEngine';
import { ChatMessage } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const query = (body.query || body.message || '').trim();
    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];

    if (!query) {
      return NextResponse.json({ 
        error: 'กรุณาระบุข้อความคำถาม',
        answerText: 'เจริญพร กรุณาระบุคำถามหรือหัวข้อธรรมะที่ท่านสนใจ',
        citations: [],
        evidenceLevel: 'unverified_or_no_evidence',
        evidenceBadgeText: '⚪ ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ'
      }, { status: 400 });
    }

    const result = await synthesizeGroundedDhammaAnswer(query, history);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Chat API Handler Error:', error);
    return NextResponse.json({
      error: 'ระบบขัดข้องชั่วคราวในการประมวลผลคำตอบ',
      answerText: 'ขออภัย เกิดข้อผิดพลาดชั่วคราวในระบบ กรุณาลองใหม่อีกครั้งในภายหลัง',
      citations: [],
      evidenceLevel: 'unverified_or_no_evidence',
      evidenceBadgeText: '⚪ ข้อผิดพลาดทางระบบ'
    }, { status: 500 });
  }
}
