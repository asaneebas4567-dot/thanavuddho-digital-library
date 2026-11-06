import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCustomBooks, saveCustomBooks, getAllCombinedBooks } from '@/lib/serverBookStore';
import { Book } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const STATS_FILE = path.join(DATA_DIR, 'bookReadStats.json');

function getReadStats(): Record<string, { readCount: number; lastReadAt?: string }> {
  try {
    if (fs.existsSync(STATS_FILE)) {
      return JSON.parse(fs.readFileSync(STATS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

// GET: Return all books with view/read stats
export async function GET() {
  try {
    const books = getAllCombinedBooks();
    const stats = getReadStats();

    const booksWithStats = books.map(book => {
      const bookStat = stats[book.id];
      return {
        ...book,
        read_count: (bookStat?.readCount || 0) + (book.read_count || 0),
        view_count: book.view_count || (bookStat?.readCount ? bookStat.readCount * 3 : 10)
      };
    });

    return NextResponse.json({
      success: true,
      count: booksWithStats.length,
      books: booksWithStats
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Add or Update a Book with direct PDF/Drive/Cover links
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      id, 
      title, 
      author, 
      author_id,
      category_id, 
      description, 
      pdf_url, 
      reader_url,
      source_url, 
      cover_image, 
      page_count, 
      publication_year, 
      publisher,
      status, 
      featured,
      tags
    } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุชื่อหนังสือ' }, { status: 400 });
    }

    const books = getCustomBooks();
    const cleanTitle = title.trim();

    // Determine ID
    let bookId = id;
    if (!bookId) {
      const slug = cleanTitle
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `book-${Date.now()}`;
      bookId = `book_${slug}`;
    }

    // Determine PDF & Reader URLs
    const finalPdfUrl = (pdf_url || '').trim();
    let finalReaderUrl = (reader_url || '').trim();
    if (!finalReaderUrl) {
      if (finalPdfUrl.includes('drive.google.com')) {
        finalReaderUrl = finalPdfUrl.replace(/\/view.*$/, '/preview');
      } else if (finalPdfUrl.startsWith('/books/pdf/') || finalPdfUrl.startsWith('http')) {
        finalReaderUrl = `/reader/${bookId}`;
      } else {
        finalReaderUrl = finalPdfUrl;
      }
    }

    const finalCover = (cover_image || '').trim() || '/images/books/book-placeholder.jpg';

    const existingIndex = books.findIndex(b => b.id === bookId);

    const bookRecord: Book = {
      id: bookId,
      title: cleanTitle,
      author: author ? author.trim() : 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
      author_id: author_id || 'author_001',
      category_id: category_id || 'c2',
      category_ids: [category_id || 'c2'],
      description: description ? description.trim() : `หนังสือธรรมะคำสอนอันทรงคุณค่า "${cleanTitle}" โดย พระครูปลัดสุวัฒนโพธิคุณ`,
      content_type: 'book',
      cover_image: finalCover,
      cover: finalCover,
      pdf_url: finalPdfUrl,
      reader_url: finalReaderUrl,
      source_url: source_url ? source_url.trim() : finalPdfUrl,
      page_count: Number(page_count) || 80,
      pages: Number(page_count) || 80,
      publication_year: Number(publication_year) || 2567,
      publisher: publisher ? publisher.trim() : 'มูลนิธิธรรมะคุ้มครองโลก',
      language: 'th',
      is_copyright: true,
      copyright_status: 'approved',
      copyright_notice: 'หนังสือลิขสิทธิ์ถูกต้องตามธรรมวินัยและศูนย์เผยแผ่',
      status: status || 'published',
      is_finished: status !== 'draft',
      featured: Boolean(featured),
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()) : [cleanTitle, 'หนังสือธรรมะ', 'หนังสือลิขสิทธิ์']),
      view_count: existingIndex >= 0 ? (books[existingIndex].view_count || 0) : 0,
      read_count: existingIndex >= 0 ? (books[existingIndex].read_count || 0) : 0,
      like_count: 0
    };

    if (existingIndex >= 0) {
      books[existingIndex] = { ...books[existingIndex], ...bookRecord };
    } else {
      books.unshift(bookRecord);
    }

    saveCustomBooks(books);

    return NextResponse.json({
      success: true,
      message: existingIndex >= 0 ? 'อัปเดตข้อมูลหนังสือเรียบร้อยแล้ว' : 'เพิ่มหนังสือใหม่เข้าสู่ระบบเรียบร้อยแล้ว',
      book: bookRecord
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE: Remove a book from persistent storage
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุรหัสหนังสือ (ID) ที่ต้องการลบ' }, { status: 400 });
    }

    const books = getCustomBooks();
    const updated = books.filter(b => b.id !== id);

    if (updated.length === books.length) {
      return NextResponse.json({ success: false, error: 'ไม่พบหนังสือรหัสนี้ในฐานข้อมูล Custom' }, { status: 404 });
    }

    saveCustomBooks(updated);

    return NextResponse.json({
      success: true,
      message: 'ลบหนังสือออกจากฐานข้อมูลเรียบร้อยแล้ว'
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

