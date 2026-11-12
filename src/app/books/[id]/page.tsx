import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { 
  ChevronLeft, 
  BookOpen, 
  Heart, 
  Share2, 
  Star,
  CheckCircle2,
  FileCheck,
  Bookmark,
  Award,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { books as mockBooks, authors, categories } from '@/lib/mock-data';
import { books as dbBooks, author as dbAuthor, categories as dbCategories } from '@/data/mockData';
import { getAllCombinedBooks, getBookReadStats } from '@/lib/serverBookStore';
import persistentBooks from '@/data/persistentBooks.json';
import BorrowButton from '@/components/common/BorrowButton';
import BookLoanAction from '@/components/books/BookLoanAction';
import { getBookCustomContent } from '@/data/bookCustomData';

function resolveBook(rawId: string): any {
  if (!rawId) return null;
  const decodedId = decodeURIComponent(rawId).trim();
  const trimmedRaw = rawId.trim();

  // Legacy ID mapping for placeholder IDs
  const LEGACY_ID_MAP: Record<string, string> = {
    'book_001': 'book_มงคลชีวิตฉบับทางก้าวหน้า-1',
    'book_002': 'pubhtml5_84240339',
    'book_003': 'book_tam_jai_hai_prom_buak',
    'book_004': 'book_ทันโลกทันธรรม1',
    'book_005': 'book_khao_kor_sook_rao_kor_sook',
    'book_006': 'book_ข้อคิดรอบตัว',
  };
  const effectiveId = LEGACY_ID_MAP[trimmedRaw] || LEGACY_ID_MAP[decodedId] || decodedId;
  const cleanId = effectiveId.replace(/^book_/, '');

  const customList = (persistentBooks as any[]) || [];
  let combinedList: any[] = [];
  try {
    combinedList = getAllCombinedBooks() || [];
  } catch {
    combinedList = [];
  }
  const allPool: any[] = [...customList, ...combinedList, ...dbBooks, ...mockBooks];

  // 1. Direct ID match
  let found = allPool.find(b => b.id === effectiveId || b.id === trimmedRaw);
  if (found) return found;

  // 2. Prefix match (with or without 'book_')
  found = allPool.find(b => b.id.replace(/^book_/, '') === cleanId || b.id === `book_${cleanId}`);
  if (found) return found;

  // 3. Exact Title match
  found = allPool.find(b => b.title === decodedId || b.title === cleanId);
  if (found) return found;

  // 4. Substring / Includes Title match
  found = allPool.find(b => b.title && (b.title.includes(cleanId) || cleanId.includes(b.title)));
  if (found) return found;

  // 5. Alphanumeric + Thai normalized match
  const normId = cleanId.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
  if (normId.length >= 2) {
    found = allPool.find(b => {
      const bNorm = ((b.id || '') + ' ' + (b.title || '')).toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
      return bNorm.includes(normId) || normId.includes(bNorm);
    });
    if (found) return found;
  }

  // 6. Fallback: Return first authentic book rather than 404
  return allPool[0] || null;
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const foundBook = resolveBook(id);
  
  if (!foundBook) {
    notFound();
  }

  const rawCover = foundBook.cover_image || foundBook.cover || '';
  const initialCover = rawCover.startsWith('http://online.pubhtml5.com')
    ? rawCover.replace('http://', 'https://')
    : (rawCover || '/images/books/book-placeholder.jpg');
  const secureCover = initialCover ? encodeURI(decodeURI(initialCover)) : '/images/books/book-placeholder.jpg';

  const book: any = {
    ...foundBook,
    category_id: foundBook.category_id || foundBook.category_ids?.[0] || 'cat_001',
    cover: secureCover,
    pages: foundBook.pages || foundBook.page_count || 1,
    tags: foundBook.tags && foundBook.tags.length > 0 ? foundBook.tags : ['ธรรมะ', 'คำสอน'],
    read_count: foundBook.read_count ?? foundBook.view_count ?? 0,
  };
  const isDbBook = true;

  const author = isDbBook ? (book.author_id === dbAuthor.id ? dbAuthor : dbAuthor) : authors.find(a => a.id === book.author_id);
  const category = isDbBook ? dbCategories.find(c => c.id === book.category_id) : categories.find(c => c.id === book.category_id);
  
  // Find related books
  const relatedBooks = dbBooks.map((b: any) => {
    const rCover = b.cover_image || '';
    const cleanCover = rCover.startsWith('http://online.pubhtml5.com') ? rCover.replace('http://', 'https://') : (rCover || '/images/books/book-placeholder.jpg');
    return {
      ...b,
      category_id: b.category_ids?.[0] || 'cat_world_civ',
      cover: encodeURI(decodeURI(cleanCover)),
      pages: b.page_count,
    };
  })
    .filter((b: any) => (b.category_id === book.category_id || b.category_ids?.includes(book.category_id)) && b.id !== book.id)
    .slice(0, 4);

  const totalPages = book.pages || book.page_count || 120;
  const customContent = getBookCustomContent(book.id);
  const readStats = getBookReadStats();
  const realReadCount = readStats[book.id]?.readCount ?? book.read_count ?? 0;

  return (
    <div className="bg-[#fafaf9] min-h-screen py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation */}
        <Link 
          href="/books" 
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-slate-900 mb-6 transition-colors"
        >
          <ChevronLeft size={18} />
          <span>กลับไปหน้ารวมหนังสือ</span>
        </Link>

        {/* Main Book Detail Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden mb-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
            
            {/* Left: Cover Showcase with 3D Spine */}
            <div className="md:col-span-5 bg-gradient-to-b from-slate-50 to-slate-100/50 p-8 sm:p-10 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100">
              <div className="book-cover-3d relative w-full max-w-[240px] aspect-[1/1.42] rounded-xl overflow-hidden bg-slate-900 ring-1 ring-black/10 shadow-lg">
                {book.cover && book.cover !== '/images/books/book-placeholder.jpg' ? (
                  <Image 
                    src={book.cover} 
                    alt={book.title}
                    fill
                    className="object-cover"
                    priority
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 p-6 flex flex-col justify-between text-white text-center select-none">
                    <div className="w-full border-b border-white/20 pb-2">
                      <div className="text-xs uppercase tracking-widest text-amber-300 font-serif">หนังสือธรรมะ</div>
                    </div>
                    <div className="my-auto px-2">
                      <p className="font-bold text-lg sm:text-xl leading-snug text-white drop-shadow">
                        {book.title}
                      </p>
                    </div>
                    <div className="w-full border-t border-white/20 pt-2">
                      <div className="text-xs text-slate-300 truncate">พระครูปลัดสุวัฒนโพธิคุณ</div>
                    </div>
                  </div>
                )}

                {/* Copyright Red Badge - ตัวแดงเด่นชัดเจน */}
                <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[9px] px-2.5 py-0.5 rounded-full shadow-md z-20 border border-red-300 flex items-center gap-1 select-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  หนังสือลิขสิทธิ์
                </div>
              </div>

              {/* Cover Sub-stats */}
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star size={14} fill="currentColor" /> 4.95
                </span>
                <span>•</span>
                <span title="ยอดเปิดอ่านจริง">{realReadCount > 0 ? `${realReadCount.toLocaleString()} ครั้งที่อ่าน` : '0 ครั้งที่อ่าน'}</span>
              </div>
            </div>
            
            {/* Right: Details */}
            <div className="md:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div>
                    <span className="inline-block text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 mb-2">
                      {category?.name || 'หมวดธรรมปฏิบัติ'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                      {book.title}
                    </h1>
                    <p className="text-sm font-semibold text-slate-600 mt-2 flex items-center gap-1.5">
                      <span>ประพันธ์โดย:</span>
                      <span className="text-slate-900 font-bold">{book.author_id === 'a1' || book.author_id === 'author_001' ? 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)' : (author?.name || 'พระครูปลัดสุวัฒนโพธิคุณ')}</span>
                      <CheckCircle2 size={15} className="text-blue-600" />
                    </p>
                  </div>
                </div>

                {/* Red Copyright Banner - ข้อความตัวแดงๆ เด่นชัดเจน */}
                <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200/90 rounded-2xl p-4 my-4 shadow-2xs">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    <span className="font-extrabold text-red-600 text-sm sm:text-base tracking-wide flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      หนังสือลิขสิทธิ์
                    </span>
                    <span className="text-[10.5px] font-bold bg-red-600 text-white px-2.5 py-0.5 rounded-full">
                      สงวนลิขสิทธิ์ตามกฎหมาย
                    </span>
                    {book.isbn && (
                      <span className="text-xs font-mono text-red-700 bg-white/90 border border-red-200 px-2 py-0.5 rounded-md font-semibold">
                        ISBN: {book.isbn}
                      </span>
                    )}
                  </div>
                  <p className="text-red-700 text-xs sm:text-sm leading-relaxed font-medium">
                    หนังสือฉบับนี้เป็นลิขสิทธิ์ของ {book.publisher || 'มูลนิธิธรรมะคุ้มครองโลก'} ได้รับอนุญาตให้อ่านและศึกษาธรรมะออนไลน์ภายใน Thanavuddho Digital Library ห้ามคัดลอก ทำซ้ำ ดัดแปลง หรือนำไปใช้ในเชิงพาณิชย์
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 text-xs text-slate-500 my-4 py-3 border-y border-slate-100">
                  <div>ปีที่พิมพ์: <strong className="text-slate-900">{book.publication_year}</strong></div>
                  <div>•</div>
                  <div>จำนวนหน้า: <strong className="text-slate-900">{totalPages} หน้า</strong></div>
                  <div>•</div>
                  <div>ภาษา: <strong className="text-slate-900">{book.language || 'ไทย'}</strong></div>
                  <div>•</div>
                  <div>สถานะ: <strong className="text-emerald-700">ฉบับสมบูรณ์ (อ่านออนไลน์)</strong></div>
                </div>

                <div className="mb-6">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-2">คำอธิบายหนังสือ</h3>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    {book.description || 'รวบรวมหลักธรรมคำสอนและแนวทางการดำเนินชีวิตอย่างมีความสุขและสงบใจ ผสานมุมมองพุทธศาสตร์เข้ากับชีวิตประจำวัน เพื่อประโยชน์ในการศึกษาและพัฒนาจิตใจ'}
                  </p>
                </div>
              </div>

              {/* Actions: Strict Digital Copyright & 3-Book Loan Control */}
              <BookLoanAction
                bookId={book.id}
                bookTitle={book.title}
                bookCover={book.cover}
                totalPages={totalPages}
                audioId={book.audio_id}
              />
            </div>

          </div>
        </div>

        {/* Custom Content: Chapters (if added by user in bookCustomData.ts) */}
        {customContent?.chapters && customContent.chapters.length > 0 && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-8">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen size={20} className="text-slate-700" />
                สารบัญบทเรียน ({customContent.chapters.length} บท)
              </span>
              <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full">
                เนื้อหาตรวจสอบแล้ว
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {customContent.chapters.map((ch, idx) => (
                <div key={idx} className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {ch.chapter_number}
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-slate-800">{ch.title}</span>
                  </div>
                  {ch.page_start && (
                    <span className="text-xs text-slate-400 font-medium">หน้า {ch.page_start}{ch.page_end ? `-${ch.page_end}` : ''}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Content: Quiz Card (if added by user in bookCustomData.ts) */}
        {customContent?.questions && customContent.questions.length > 0 && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50/50 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-extrabold text-sm sm:text-base text-slate-900">แบบทดสอบวัดความรู้ประจำเล่มนี้</h3>
                <p className="text-xs text-slate-600 mt-0.5">มีทั้งหมด {customContent.questions.length} ข้อ • ผ่านเกณฑ์ 70% ได้รับ XP และบันทึกผลงานลงในโปรไฟล์</p>
              </div>
            </div>
            <Link
              href={`/quiz?book=${book.id}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all shrink-0 cursor-pointer"
            >
              <span>เริ่มทำแบบทดสอบ</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        )}

        {/* Real Features Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mb-10">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 mb-4 flex items-center gap-2">
            <FileCheck size={20} className="text-slate-700" />
            การเข้าถึงและการศึกษาหนังสือเล่มนี้
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <BookOpen size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">เปิดอ่านออนไลน์</h3>
              <p className="text-xs text-slate-500 mt-1">อ่านบนระบบพร้อมเครื่องมือเปลี่ยนหน้า ซูมขยาย และโหมดเต็มจอ</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                <Bookmark size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">ยืมอ่าน 14 วัน</h3>
              <p className="text-xs text-slate-500 mt-1">เก็บเข้าชั้นหนังสือดิจิทัลส่วนบุคคลเพื่อติดตามประวัติการอ่าน</p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2">
                <Award size={18} />
              </div>
              <h3 className="font-bold text-sm text-slate-900">ประเมินความรู้</h3>
              <p className="text-xs text-slate-500 mt-1">ทดสอบความเข้าใจหลังการอ่านผ่านระบบ Quiz เพื่อสะสม XP และวุฒิบัตร</p>
            </div>
          </div>
        </div>

        {/* Related Books */}
        {relatedBooks.length > 0 && (
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">หนังสือในหมวดเดียวกัน</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              {relatedBooks.map((relatedBook: any) => (
                <div key={relatedBook.id} className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all border border-slate-200/80 group">
                  <Link href={`/books/${relatedBook.id}`}>
                    <div className="aspect-[3/4] relative overflow-hidden bg-slate-100">
                      <Image 
                        src={relatedBook.cover} 
                        alt={relatedBook.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-xs text-slate-900 mb-1 line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {relatedBook.title}
                      </h3>
                      <p className="text-slate-400 text-[11px]">{relatedBook.pages} หน้า</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
