import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { checkDuplicateBook, upsertCustomBook, getAllCombinedBooks } from '@/lib/serverBookStore';
import { Book } from '@/types';

// GET: Check duplicate or list custom books
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || '';
  const isbn = searchParams.get('isbn') || '';

  if (title || isbn) {
    const check = checkDuplicateBook(title, isbn);
    return NextResponse.json({ success: true, ...check });
  }

  const all = getAllCombinedBooks();
  return NextResponse.json({ success: true, count: all.length, books: all });
}

// POST: Import new PDF book with auto-extracted cover and duplicate guard
export async function POST(req: NextRequest) {
  try {
    // Security check: Block unauthorized public uploads
    const authHeader = req.headers.get('authorization') || req.headers.get('x-admin-key');
    const validKeys = ['thanavuddho-admin-2568', 'admin2568', 'admin69', 'thanavuddho2026', '69001'];
    const cleanKey = (authHeader || '').replace(/^Bearer\s+/i, '').trim();
    if (!validKeys.includes(cleanKey) && !authHeader?.includes('thanavuddho')) {
      return NextResponse.json({
        success: false,
        message: 'ระบบปิดรับการอัปโหลดไฟล์จากบุคคลภายนอกเพื่อความปลอดภัย เฉพาะผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น'
      }, { status: 403 });
    }

    const formData = await req.formData();
    const pdfFile = formData.get('pdf') as File | null;
    const coverDataUrl = formData.get('coverDataUrl') as string | null;
    const title = (formData.get('title') as string || '').trim();
    const author = (formData.get('author') as string || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)').trim();
    const description = (formData.get('description') as string || '').trim();
    const year = parseInt(formData.get('year') as string || '2567', 10);
    const pageCount = parseInt(formData.get('pageCount') as string || '0', 10);
    const isbn = (formData.get('isbn') as string || '').trim();
    const publisher = (formData.get('publisher') as string || 'มูลนิธิธรรมะคุ้มครองโลก').trim();
    const category_id = (formData.get('category_id') as string || 'cat_001').trim();
    const tagsRaw = formData.get('tags') as string || '';
    const forceOverwrite = formData.get('forceOverwrite') === 'true';

    if (!title) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุชื่อหนังสือ' }, { status: 400 });
    }

    // 1. Check duplicate
    const duplicateCheck = checkDuplicateBook(title, isbn);
    if (duplicateCheck.isDuplicate && !forceOverwrite) {
      return NextResponse.json({
        success: false,
        isDuplicate: true,
        reason: duplicateCheck.reason,
        matchedBook: duplicateCheck.matchedBook,
        message: `ตรวจพบหนังสือซ้ำ: ${duplicateCheck.reason}`,
      }, { status: 409 });
    }

    // 2. Prepare slug and paths
    const slug = title
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `book-${Date.now()}`;
    const bookId = `book_${slug}`;

    const pdfDir = path.join(process.cwd(), 'public', 'books', 'pdf');
    const imageDir = path.join(process.cwd(), 'public', 'images', 'books');
    fs.mkdirSync(pdfDir, { recursive: true });
    fs.mkdirSync(imageDir, { recursive: true });

    let pdfUrl = `/books/pdf/${slug}.pdf`;
    let coverUrl = `/images/books/${slug}.jpg`;

    // Save PDF file if uploaded
    if (pdfFile && typeof pdfFile.arrayBuffer === 'function') {
      const pdfBytes = await pdfFile.arrayBuffer();
      const pdfPath = path.join(pdfDir, `${slug}.pdf`);
      fs.writeFileSync(pdfPath, Buffer.from(pdfBytes));
    }

    // Save cover if provided as dataUrl
    if (coverDataUrl && coverDataUrl.startsWith('data:image')) {
      const base64Data = coverDataUrl.replace(/^data:image\/\w+;base64,/, '');
      const coverPath = path.join(imageDir, `${slug}.jpg`);
      fs.writeFileSync(coverPath, Buffer.from(base64Data, 'base64'));
    } else if (!fs.existsSync(path.join(imageDir, `${slug}.jpg`))) {
      coverUrl = '/images/books/book-placeholder.jpg';
    }

    const tags = tagsRaw
      ? tagsRaw.split(',').map(t => t.trim()).filter(Boolean)
      : [title, 'หนังสือธรรมะ', 'หนังสือลิขสิทธิ์'];

    // 3. Create Book Record with PROMINENT COPYRIGHT STAMP
    const newBook: Book = {
      id: bookId,
      title,
      author_id: 'author_001',
      description: description || `หนังสือธรรมะคำสอนอันทรงคุณค่า "${title}" โดย ${author}`,
      cover_image: coverUrl,
      cover: coverUrl,
      content_type: 'book',
      category_ids: [category_id],
      category_id: category_id,
      tags: Array.from(new Set([...tags, 'หนังสือลิขสิทธิ์'])),
      publication_year: year,
      page_count: pageCount || 1,
      pages: pageCount || 1,
      language: 'th',
      pdf_url: pdfUrl,
      reader_url: `/reader/${bookId}`,
      source_url: pdfUrl,
      copyright_status: 'approved',
      is_copyright: true, // Marked as copyright
      copyright_notice: 'หนังสือลิขสิทธิ์',
      isbn: isbn || undefined,
      publisher: publisher || 'มูลนิธิธรรมะคุ้มครองโลก',
      verified: true,
      featured: true,
      view_count: 0,
      read_count: 0,
      like_count: 0,
      is_finished: true,
    };

    upsertCustomBook(newBook);

    return NextResponse.json({
      success: true,
      message: 'นำเข้าหนังสือ PDF และสกัดหน้าปกสำเร็จเรียบร้อย',
      book: newBook,
    });
  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
