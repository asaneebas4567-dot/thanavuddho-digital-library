import { NextRequest, NextResponse } from 'next/server';
import { getBookReadStats, recordBookRead } from '@/lib/serverBookStore';

// GET: Returns real read stats map { [bookId]: count }
export async function GET(req: NextRequest) {
  try {
    const rawStats = getBookReadStats();
    const stats: Record<string, number> = {};
    for (const [id, item] of Object.entries(rawStats)) {
      stats[id] = item.readCount;
    }
    return NextResponse.json({ success: true, stats, rawStats });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Record a user reading a book (called when a reader opens the book)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookId, userEmail, userName } = body;

    if (!bookId) {
      return NextResponse.json({ success: false, message: 'bookId is required' }, { status: 400 });
    }

    const result = recordBookRead(bookId, userEmail, userName);
    return NextResponse.json({
      success: true,
      bookId,
      readCount: result.readCount,
      message: 'บันทึกการเปิดอ่านจริงเรียบร้อยแล้ว'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
