import { NextRequest, NextResponse } from 'next/server';
import { 
  getBookReadingProgress, 
  saveBookReadingProgress, 
  toggleBookmark, 
  getUserReadingHistory 
} from '@/lib/serverBookProgressStore';

// GET: /api/books/progress?email=...&bookId=... OR /api/books/progress?email=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const bookId = searchParams.get('bookId');

    if (!email) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุอีเมล' }, { status: 400 });
    }

    if (bookId) {
      const progress = getBookReadingProgress(email, bookId);
      return NextResponse.json({
        success: true,
        progress: progress || {
          user_email: email,
          book_id: bookId,
          current_page: 1,
          total_pages: 1,
          progress_percent: 0,
          bookmarks: [],
          is_finished: false,
          last_read_at: new Date().toISOString(),
          first_read_at: new Date().toISOString()
        }
      });
    }

    // Return full reading history
    const history = getUserReadingHistory(email);
    return NextResponse.json({
      success: true,
      history,
      total_books_read: history.length,
      finished_count: history.filter(h => h.is_finished).length
    });

  } catch (err: any) {
    console.error('Book Progress GET API Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// POST: Save or update reading progress
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, userId, bookId, bookTitle, bookCover, currentPage, totalPages, bookmarks } = body;

    if (!email || !bookId) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุ email และ bookId' }, { status: 400 });
    }

    const saved = saveBookReadingProgress({
      userEmail: email,
      userId,
      bookId,
      bookTitle,
      bookCover,
      currentPage: Number(currentPage) || 1,
      totalPages: Number(totalPages) || 1,
      bookmarks: Array.isArray(bookmarks) ? bookmarks : undefined
    });

    return NextResponse.json({
      success: true,
      progress: saved,
      message: 'บันทึกตำแหน่งการอ่านเรียบร้อยแล้ว'
    });

  } catch (err: any) {
    console.error('Book Progress POST API Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// PATCH: Toggle bookmark on a specific page
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, bookId, pageNumber, bookTitle, bookCover, totalPages } = body;

    if (!email || !bookId || pageNumber === undefined) {
      return NextResponse.json({ success: false, message: 'ข้อมูลไม่ครบถ้วน' }, { status: 400 });
    }

    const result = toggleBookmark(
      email,
      bookId,
      Number(pageNumber),
      bookTitle,
      bookCover,
      Number(totalPages) || 100
    );

    return NextResponse.json({
      success: true,
      bookmarked: result.bookmarked,
      bookmarks: result.bookmarks,
      message: result.bookmarked ? `คั่นหน้าที่ ${pageNumber} เรียบร้อยแล้ว` : `นำที่คั่นหน้าที่ ${pageNumber} ออกแล้ว`
    });

  } catch (err: any) {
    console.error('Book Progress Bookmark API Error:', err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
