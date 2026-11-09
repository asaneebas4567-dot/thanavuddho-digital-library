import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getCustomBooks, saveCustomBooks, normalizeText } from '@/lib/serverBookStore';
import { Book } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SCRIPTS_DIR = path.join(process.cwd(), 'scripts');
const DECODED_DRIVE_FILE = path.join(SCRIPTS_DIR, 'gdrive_files_decoded.json');
const COVERS_DIR = path.join(process.cwd(), 'public', 'images', 'books');

interface DriveDecodedItem {
  fileId: string;
  fileName: string;
  reader_url?: string;
  source_url?: string;
}

// Helper: Clean filename to Thai readable title
function cleanTitleFromFilename(fileName: string): string {
  return fileName
    .replace(/\.pdf$/i, '')
    .replace(/^[0-9]+[_\-\s\.]*/, '')
    .replace(/[_\-]+/g, ' ')
    .trim();
}

// Helper: Match cover image from public/images/books/
function matchCoverImage(fileName: string, title: string, availableCovers: string[]): string {
  const normTitle = title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');

  // Exact or contains match with file name in /images/books/
  for (const c of availableCovers) {
    const normCover = c.toLowerCase().replace(/\.[^.]+$/, '').replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
    if (normTitle && normCover && (normTitle.includes(normCover) || normCover.includes(normTitle))) {
      return `/images/books/${c}`;
    }
  }

  // Smart overrides based on known files
  if (fileName.includes('1147')) return '/images/books/yoo-nai-lok-mai-yang-mai-pen-rok.png';
  if (fileName.includes('123.')) return '/images/books/lom-hai-jai-khao-ok.jpg';
  if (fileName.includes('124.')) return '/images/books/mongkol-124.jpg';
  if (fileName.includes('1505')) return '/images/books/yoo-sook-nai-yook-digital.jpg';
  if (fileName.includes('Love myself')) return '/images/books/love-myself-rak-nai-tua-ton.jpg';
  if (fileName.includes('secret of love')) return '/images/books/secret-of-love-rak-look-yang-rai.png';
  if (fileName.includes('The lover')) return '/images/books/the-lover-rak-pen-ja-hen-jai.png';
  if (fileName.includes('ข้อคิดรอบตัว')) return '/images/books/kho-khit-rop-tua.jpg';
  if (fileName.includes('ทำใจให้พร้อมบวก')) return '/images/books/tam-jai-hai-prom-buak.jpg';
  if (fileName.includes('รักเเท้')) return '/images/books/rak-thae-mai-dai-mee-khae-nai-niyai.jpg';
  if (fileName.includes('ศาสตร์เเห่งสมาธิ')) return '/images/books/the-science-of-meditation.jpg';
  if (fileName.includes('เขาก็สุข')) return '/images/books/khao-kor-sook-rao-kor-sook.jpg';
  if (fileName.includes('เปิดพรมเเดน')) return '/images/books/perd-promdan.jpg';
  if (fileName.includes('เพราะไม่รู้สินะ')) return '/images/books/phro-mai-roo-roo-than-cheewit.jpg';

  return '/images/books/book-placeholder.jpg';
}

// Helper: Estimate page count based on title/file
function estimatePageCount(fileName: string, title: string): number {
  if (fileName.includes('มงคลชีวิต')) return 220;
  if (fileName.includes('พระไตรปิฎก')) return 350;
  if (fileName.includes('1483')) return 160;
  if (fileName.includes('HOPE')) return 72;
  if (fileName.includes('ทันโลก')) return 140;
  if (fileName.includes('สมาธิ')) return 120;
  return 96;
}

// Helper: Suggest category
function suggestCategory(title: string): string {
  if (title.includes('มงคลชีวิต') || title.includes('124')) return 'c1';
  if (title.includes('สมาธิ') || title.includes('พระไตรปิฎก') || title.includes('ลมหายใจ')) return 'c3';
  if (title.includes('รัก') || title.includes('ครอบครัว') || title.includes('โลก') || title.includes('ลูก')) return 'c4';
  return 'c2';
}

// GET: Returns detected drive files list and current import status
export async function GET() {
  try {
    const customBooks = getCustomBooks();
    
    // Read available covers
    let availableCovers: string[] = [];
    if (fs.existsSync(COVERS_DIR)) {
      availableCovers = fs.readdirSync(COVERS_DIR);
    }

    // Read decoded Drive files
    let driveFiles: DriveDecodedItem[] = [];
    if (fs.existsSync(DECODED_DRIVE_FILE)) {
      const raw = fs.readFileSync(DECODED_DRIVE_FILE, 'utf-8');
      driveFiles = JSON.parse(raw);
    }

    // Map of already imported file IDs & titles
    const importedFileIds = new Set<string>();
    const importedTitles = new Set<string>();

    customBooks.forEach(b => {
      const fid = (b as any).drive_file_id || (b.pdf_url && b.pdf_url.match(/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]);
      if (fid) importedFileIds.add(fid);
      importedTitles.add(normalizeText(b.title));
    });

    // Categorize Drive files into pending vs already imported
    const pendingFiles = driveFiles.filter(d => !importedFileIds.has(d.fileId)).map(d => {
      const title = cleanTitleFromFilename(d.fileName);
      const isTitleDup = importedTitles.has(normalizeText(title));
      const cover = matchCoverImage(d.fileName, title, availableCovers);
      const pageCount = estimatePageCount(d.fileName, title);
      const categoryId = suggestCategory(title);

      const slug = title
        .toLowerCase()
        .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `drive_${d.fileId.substring(0, 8)}`;

      return {
        id: `book_${slug}`,
        fileId: d.fileId,
        fileName: d.fileName,
        title,
        author: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
        author_id: 'author_001',
        category_id: categoryId,
        page_count: pageCount,
        publication_year: 2567,
        cover_image: cover,
        pdf_url: `https://drive.google.com/file/d/${d.fileId}/preview`,
        reader_url: `https://drive.google.com/file/d/${d.fileId}/preview`,
        source_url: `https://drive.google.com/file/d/${d.fileId}/view`,
        drive_file_id: d.fileId,
        publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
        is_copyright: true,
        copyright_status: 'approved',
        copyright_notice: 'หนังสือลิขสิทธิ์',
        featured: false,
        status: 'published',
        isTitleDup
      };
    });

    const alreadyImported = customBooks.filter(b => {
      return (b as any).drive_file_id || (b.pdf_url && b.pdf_url.includes('drive.google.com'));
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalDriveFiles: driveFiles.length,
        alreadyImportedCount: alreadyImported.length,
        pendingCount: pendingFiles.length,
        totalLibraryBooks: customBooks.length
      },
      pendingFiles,
      alreadyImported
    });
  } catch (err: any) {
    console.error('Error fetching drive files:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// POST: Batch Import or Upsert Google Drive Books
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { books, singleBook } = body;

    const booksToImport: any[] = Array.isArray(books) 
      ? books 
      : (singleBook ? [singleBook] : []);

    if (booksToImport.length === 0) {
      return NextResponse.json({ success: false, error: 'ไม่พบข้อมูลหนังสือที่ต้องการนำเข้า' }, { status: 400 });
    }

    const currentBooks = getCustomBooks();
    let importedCount = 0;
    let updatedCount = 0;

    for (const item of booksToImport) {
      if (!item.title || !item.pdf_url) continue;

      const cleanTitle = (item.title || '').trim();
      let fileId = item.drive_file_id || item.fileId || '';
      
      // Auto-extract fileId if not provided
      if (!fileId && item.pdf_url) {
        const m = item.pdf_url.match(/file\/d\/([a-zA-Z0-9_-]+)/);
        if (m) fileId = m[1];
      }

      // Generate reader preview URL
      let previewUrl = item.pdf_url.trim();
      if (fileId) {
        previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
      } else if (previewUrl.includes('/view')) {
        previewUrl = previewUrl.replace(/\/view.*$/, '/preview');
      }

      const viewUrl = fileId 
        ? `https://drive.google.com/file/d/${fileId}/view` 
        : (item.source_url || previewUrl);

      // Determine ID
      let bookId = item.id;
      if (!bookId) {
        const slug = cleanTitle
          .toLowerCase()
          .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || `drive_${Date.now()}`;
        bookId = `book_${slug}`;
      }

      const coverUrl = (item.cover_image || item.cover || '/images/books/book-placeholder.jpg').trim();
      const pageCount = Number(item.page_count || item.pages) || 80;
      const categoryId = item.category_id || 'c2';

      const bookRecord: Book = {
        id: bookId,
        title: cleanTitle,
        author: (item.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)').trim(),
        author_id: item.author_id || 'author_001',
        description: (item.description || `หนังสือธรรมะคำสอนอันทรงคุณค่า "${cleanTitle}" โดย พระครูปลัดสุวัฒนโพธิคุณ`).trim(),
        cover_image: coverUrl,
        cover: coverUrl,
        content_type: 'book',
        category_id: categoryId,
        category_ids: [categoryId],
        tags: Array.isArray(item.tags) 
          ? item.tags 
          : [cleanTitle, 'หนังสือธรรมะ', 'หนังสือลิขสิทธิ์', 'Google Drive'],
        publication_year: Number(item.publication_year) || 2567,
        page_count: pageCount,
        pages: pageCount,
        language: 'th',
        pdf_url: previewUrl,
        reader_url: previewUrl,
        source_url: viewUrl,
        copyright_status: 'approved',
        is_copyright: true,
        copyright_notice: 'หนังสือลิขสิทธิ์',
        publisher: (item.publisher || 'มูลนิธิธรรมะคุ้มครองโลก').trim(),
        verified: true,
        featured: Boolean(item.featured),
        status: item.status || 'published',
        is_finished: item.status !== 'draft',
        view_count: item.view_count || 0,
        read_count: item.read_count || 0,
        like_count: item.like_count || 0,
        ...(fileId ? { drive_file_id: fileId } : {})
      };

      // Upsert into list
      const existingIdx = currentBooks.findIndex(b => 
        b.id === bookRecord.id || 
        ((b as any).drive_file_id && fileId && (b as any).drive_file_id === fileId) ||
        normalizeText(b.title) === normalizeText(cleanTitle)
      );

      if (existingIdx >= 0) {
        currentBooks[existingIdx] = { ...currentBooks[existingIdx], ...bookRecord };
        updatedCount++;
      } else {
        currentBooks.push(bookRecord);
        importedCount++;
      }
    }

    saveCustomBooks(currentBooks);

    return NextResponse.json({
      success: true,
      message: `บันทึกข้อมูลเรียบร้อย (เพิ่มใหม่ ${importedCount} เล่ม, อัปเดต ${updatedCount} เล่ม)`,
      stats: {
        importedCount,
        updatedCount,
        totalCustomBooks: currentBooks.length
      }
    });
  } catch (err: any) {
    console.error('Batch import error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

