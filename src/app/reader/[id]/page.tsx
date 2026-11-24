'use client';

import { use, Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useLoan } from '@/context/LoanContext';
import { books as mockBooks } from '@/lib/mock-data';
import { books as dbBooks } from '@/data/mockData';
import persistentBooks from '@/data/persistentBooks.json';
import PremiumBookReader from '@/components/reader/PremiumBookReader';
import PubHtml5Reader from '@/components/reader/PubHtml5Reader';
import { 
  Loader2, 
  ArrowLeft, 
  ShieldCheck, 
  Lock, 
  BookMarked, 
  AlertCircle, 
  BookOpen,
  Heart,
  Share2,
  FileText,
  Check,
  Award,
  Eye,
  Star,
  FileCheck,
  CheckCircle2
} from 'lucide-react';

function resolveReaderBook(rawId: string): any {
  if (!rawId) return null;
  const decodedId = decodeURIComponent(rawId).trim();
  const trimmedRaw = rawId.trim();

  const isExcluded = (idStr: string) => {
    const s = (idStr || '').toLowerCase();
    return s.includes('dee_chua') || s.includes('ดีชั่ว') ||
           s.includes('24_chom') || s.includes('24 ชม') ||
           s.includes('tua_rao') || s.includes('ตัวเรา') ||
           s.includes('khad_klao') || s.includes('ขัดเกลา') ||
           s.includes('liang_look') || s.includes('เลี้ยงลูกสไตล์สุข');
  };
  if (isExcluded(rawId) || isExcluded(decodedId)) return null;

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
  const allPool: any[] = [...customList, ...dbBooks, ...mockBooks];

  // Helper to merge multiple matching entries so cloud URLs / PDF URLs are fully preserved
  const mergeMatches = (matches: any[]) => {
    let merged: any = {};
    for (let i = matches.length - 1; i >= 0; i--) {
      merged = { ...merged, ...matches[i] };
    }
    return merged;
  };

  // 1. Direct ID match
  const idMatches = allPool.filter(b => b.id === effectiveId || b.id === trimmedRaw);
  if (idMatches.length > 0) return mergeMatches(idMatches);

  // 2. Prefix variation match
  const prefixMatches = allPool.filter(b => b.id.replace(/^book_/, '') === cleanId || b.id === `book_${cleanId}`);
  if (prefixMatches.length > 0) return mergeMatches(prefixMatches);

  // 3. Exact Title match
  const titleMatches = allPool.filter(b => b.title === decodedId || b.title === cleanId);
  if (titleMatches.length > 0) return mergeMatches(titleMatches);

  // 4. Substring Title match
  let found = allPool.find(b => b.title && (b.title.includes(cleanId) || cleanId.includes(b.title)));
  if (found) return found;

  // 5. Normalized match
  const normId = cleanId.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
  if (normId.length >= 2) {
    found = allPool.find(b => {
      const bNorm = ((b.id || '') + ' ' + (b.title || '')).toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
      return bNorm.includes(normId) || normId.includes(bNorm);
    });
    if (found) return found;
  }

  return null;
}

function BookReaderContent({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const { isMediaBorrowed, borrowMedia, activeLoanCount, maxLoans } = useLoan();
  const [borrowFeedback, setBorrowFeedback] = useState<string | null>(null);
  const [isPreviewUnlocked, setIsPreviewUnlocked] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const [copied, setCopied] = useState(false);

  const foundBook = resolveReaderBook(bookId);

  if (!foundBook) {
    return (
      <div className="min-h-screen bg-[#F0F8FD]/60 flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-[#DCEAF3] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <Link
            href="/books"
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#073B65] hover:text-[#079FE8] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับไปหน้ารวมหนังสือ</span>
          </Link>
        </header>
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#DCEAF3] shadow-xl p-6 sm:p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto shadow-inner">
              <BookOpen size={32} />
            </div>
            <h1 className="text-lg font-bold text-[#073B65]">ไม่พบหนังสือเล่มนี้</h1>
            <p className="text-xs text-[#64748B]">หนังสือเล่มนี้ถูกนำออกจากระบบแล้ว หรือไม่มีเนื้อหาให้อ่านในห้องสมุดดิจิทัล</p>
            <Link
              href="/books"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-[#079FE8] text-white font-bold text-sm shadow-md hover:bg-[#0680BA] transition-colors"
            >
              เลือกอ่านหนังสือเล่มอื่น
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const rawCover = foundBook.cover_image || foundBook.cover || '';
  const secureCover = rawCover.startsWith('http://online.pubhtml5.com')
    ? rawCover.replace('http://', 'https://')
    : (rawCover || '/images/books/book-placeholder.jpg');

  const book = {
    ...foundBook,
    category_id: foundBook?.category_id || foundBook?.category_ids?.[0] || 'cat_001',
    cover: secureCover,
    pages: foundBook?.pages || foundBook?.page_count || 1,
    tags: foundBook?.tags || [],
  };

  // Record real reading session (referenced from real user/member reading)
  useEffect(() => {
    if (book?.id) {
      fetch('/api/books/reads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          userEmail: user?.email,
          userName: user?.name,
        }),
      }).catch(() => {});
    }
  }, [book?.id, user?.email]);

  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = !isNaN(pageParam) && pageParam >= 1 ? pageParam : 1;
  const modeParam = searchParams.get('mode'); // 'flip' | 'embed'

  // Commercial External Store Gate: If book is commercial, redirect/prompt to store
  if (foundBook?.is_external_store || (foundBook as any)?.buy_url) {
    const storeUrl = (foundBook as any)?.buy_url || foundBook?.source_url || 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=115432';
    const storeName = (foundBook as any)?.store_name || 'MEB Market';
    const price = (foundBook as any)?.price || '99 บาท';

    return (
      <div className="min-h-screen bg-[#F0F8FD]/60 flex flex-col justify-between font-sans">
        <header className="bg-white border-b border-[#DCEAF3] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <Link
            href={book.id ? `/books/${book.id}` : '/'}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#073B65] hover:text-[#079FE8] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับสู่หน้าหลัก / หน้ารายละเอียด</span>
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-2 border-amber-300 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
              <Lock size={32} />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold">
              <span>🛒 หนังสือฉบับวางจำหน่ายภายนอก</span>
            </div>

            <h2 className="text-lg sm:text-xl font-extrabold text-[#073B65]">
              {book.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              หนังสือเล่มนี้เป็นผลงานฉบับจำหน่าย ไม่เปิดให้อ่านฟรีในระบบหอสมุดออนไลน์ ท่านสามารถสั่งซื้ออีบุ๊กฉบับเต็มได้จาก {storeName} ({price})
            </p>

            <div className="pt-2 flex flex-col gap-2.5">
              <a
                href={storeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                <span>สั่งซื้อบน {storeName} ↗</span>
              </a>

              <Link
                href="/"
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // DRM & Copyright Enforcement: Must be borrowed to open reader (or preview unlocked)
  const isBorrowed = isMediaBorrowed(book.id || bookId);

  if (!isBorrowed && !isPreviewUnlocked) {
    const totalPages = book.pages || book.page_count || 120;
    const year = book.publication_year || 2565;
    const author = book.author || (book.author_id === 'author_001' ? 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)' : 'พระครูปลัดสุวัฒนโพธิคุณ');
    const publisher = book.publisher || 'มูลนิธิธรรมะคุ้มครองโลก';
    const categoryName = (book as any).category_name || (book as any).category || 'หมวดธรรมปฏิบัติ / พัฒนาตนเอง';

    const handleShare = async () => {
      const url = typeof window !== 'undefined' ? `${window.location.origin}/books/${book.id || bookId}` : '';
      if (navigator.share) {
        try {
          await navigator.share({
            title: book.title || 'หนังสือธรรมะ',
            text: `อ่านหนังสือธรรมะ "${book.title}" บน Thanavuddho Digital Library`,
            url
          });
          return;
        } catch {}
      }
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    };

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs z-10">
          <Link
            href={book.id ? `/books/${book.id}` : '/books'}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#073B65] hover:text-[#00ba70] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>ย้อนกลับไปหน้ารายละเอียดหนังสือ</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-bold text-[#00ba70] hover:underline flex items-center gap-1.5"
          >
            <BookMarked size={15} />
            <span>ชั้นหนังสือของฉัน (ยืมอยู่ {activeLoanCount}/{maxLoans})</span>
          </Link>
        </header>

        {/* Center Content: MEB Sizing & Layout (Desktop Spacious, Mobile Balanced) */}
        <main className="flex-1 flex items-center justify-center p-3 sm:p-5 md:p-8">
          <div className="max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl w-full bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-5 sm:p-7 md:p-10 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Main Presentation: Two Column Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
              
              {/* Left Column: Book Poster (Desktop: w-72 to w-80, Mobile: w-44 to w-52 compact) */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-44 sm:w-52 md:w-full md:max-w-[300px] lg:max-w-[320px]">
                  <div className="book-cover-3d relative aspect-[1/1.42] rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-black/10 shadow-2xl transition-all">
                    <Image
                      src={secureCover}
                      alt={book.title || 'ปกหนังสือ'}
                      fill
                      className="object-cover"
                      unoptimized
                      priority
                    />

                    {/* Red Copyright Tag */}
                    <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-lg z-20 border border-red-300/80 flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      ลิขสิทธิ์
                    </div>

                    {/* E-Book Ribbon */}
                    <div className="absolute top-0 left-3 bg-[#00ba70] text-white text-[9.5px] font-bold px-2 py-1 rounded-b-md shadow-md z-20 uppercase tracking-wider">
                      E-Book
                    </div>
                  </div>

                  {/* Below Poster Stats */}
                  <div className="mt-3.5 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1" title="ยอดเปิดอ่าน">
                      <Eye size={14} className="text-slate-400" />
                      <span>ฉบับสมบูรณ์ ({totalPages} หน้า)</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-[#00ba70] font-bold">
                      <ShieldCheck size={14} />
                      ลิขสิทธิ์ถูกต้อง
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Title, MEB Byline, Twin Action Pills, Rating, Icons, Specs */}
              <div className="md:col-span-7 flex flex-col justify-start">
                
                {/* Book Title */}
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight mb-2">
                  {book.title || 'หนังสือธรรมะ'}
                </h1>

                {/* Byline / Links in MEB Green Style */}
                <div className="space-y-1 text-xs sm:text-sm text-slate-600 font-medium mb-4">
                  <p>
                    <span>โดย </span>
                    <span className="text-[#00ba70] hover:underline font-bold cursor-pointer">
                      {author}
                    </span>
                  </p>
                  <p>
                    <span>สำนักพิมพ์ </span>
                    <span className="text-[#00ba70] hover:underline font-semibold cursor-pointer">
                      {publisher}
                    </span>
                  </p>
                  <p>
                    <span>หมวดหมู่ </span>
                    <span className="text-[#00ba70] hover:underline font-semibold cursor-pointer">
                      {categoryName}
                    </span>
                  </p>
                </div>

                {/* Action Buttons: MEB Twin Pills (ทดลองอ่าน + ยืมหนังสือ) */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                  {/* 1. ปุ่ม "ทดลองอ่าน" (White with green border pill) */}
                  <button
                    type="button"
                    onClick={() => setIsPreviewUnlocked(true)}
                    className="rounded-full border-2 border-[#00ba70] text-[#00ba70] hover:bg-emerald-50 px-6 py-2.5 sm:py-3 font-extrabold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                  >
                    <BookOpen size={18} />
                    <span>ทดลองอ่าน</span>
                  </button>

                  {/* 2. ปุ่ม "ยืมหนังสือ (อ่านฟรี 14 วัน)" - Signature Solid Green Pill */}
                  {activeLoanCount < maxLoans ? (
                    <button
                      type="button"
                      onClick={() => {
                        const res = borrowMedia({
                          id: book.id || bookId,
                          title: book.title || 'หนังสือธรรมะ',
                          type: 'book',
                          cover: secureCover
                        });
                        if (!res.success) {
                          setBorrowFeedback(res.message);
                        }
                      }}
                      className="flex-1 rounded-full bg-[#00ba70] hover:bg-[#00a362] text-white px-8 py-2.5 sm:py-3 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                    >
                      <BookMarked size={18} />
                      <span>ยืมหนังสือ (อ่านฟรี 14 วัน)</span>
                    </button>
                  ) : (
                    <div className="flex-1 flex flex-col sm:flex-row items-center gap-2">
                      <button
                        type="button"
                        disabled
                        className="flex-1 rounded-full bg-slate-200 text-slate-500 px-6 py-2.5 sm:py-3 font-bold text-sm cursor-not-allowed text-center"
                      >
                        ยืมครบโควตา 3 เล่มแล้ว
                      </button>
                      <Link
                        href="/dashboard"
                        className="text-xs font-bold text-[#00ba70] hover:underline whitespace-nowrap"
                      >
                        คืนเล่มเดิม →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Rating Row (MEB Pink Hearts & Score) */}
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium mb-4 pb-3 border-b border-slate-100">
                  <span className="font-extrabold text-slate-900 text-sm sm:text-base">5.00</span>
                  <div className="flex items-center gap-0.5 text-rose-500" aria-label="5 Hearts">
                    <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                    <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                    <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                    <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                    <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                  </div>
                  <span className="text-slate-400 font-normal">4.9 Rating (ธรรมบรรณาการ)</span>
                </div>

                {/* Quick Action Icons Row (MEB Style: อยากได้, หน้ารายละเอียด, แชร์) */}
                <div className="flex items-center justify-around sm:justify-start sm:gap-8 mb-5 py-1 text-slate-600">
                  <button
                    onClick={() => setIsWished(!isWished)}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all ${
                      isWished 
                        ? 'bg-rose-50 border-rose-300 text-rose-500 scale-105' 
                        : 'border-slate-200 text-slate-600 group-hover:border-[#00ba70] group-hover:text-[#00ba70]'
                    }`}>
                      <Heart size={17} fill={isWished ? '#f43f5e' : 'none'} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">
                      {isWished ? 'บันทึกแล้ว' : 'อยากได้'}
                    </span>
                  </button>

                  <Link
                    href={book.id ? `/books/${book.id}` : '/books'}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 text-slate-600 group-hover:border-[#00ba70] group-hover:text-[#00ba70] flex items-center justify-center transition-all">
                      <FileText size={17} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">หน้ารายละเอียด</span>
                  </Link>

                  <button
                    onClick={handleShare}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200 text-slate-600 group-hover:border-[#00ba70] group-hover:text-[#00ba70] flex items-center justify-center transition-all">
                      {copied ? <Check size={17} className="text-emerald-500" /> : <Share2 size={17} />}
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">
                      {copied ? 'คัดลอกแล้ว' : 'แชร์'}
                    </span>
                  </button>
                </div>

                {/* MEB 2-Column Key-Value Specifications Table */}
                <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70 space-y-2 text-xs sm:text-sm mb-4">
                  <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-200/50">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">ประเภทไฟล์</span>
                    <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                      pdf, 3D Flipbook <span className="text-emerald-600 font-normal">(เปิดอ่านออนไลน์)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-200/50">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">วันที่เผยแพร่</span>
                    <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                      ปี พ.ศ. {year}
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-200/50">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">ความยาว</span>
                    <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                      {totalPages} หน้า <span className="text-slate-500 font-normal">(ฉบับเต็ม)</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-12 gap-2 py-1">
                    <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">สิทธิ์การเข้าถึง</span>
                    <span className="col-span-7 sm:col-span-8 text-[#00ba70] font-bold">
                      ยืมอ่านฟรี 14 วัน <span className="text-slate-500 font-normal text-xs">(ลิขสิทธิ์ถูกต้อง)</span>
                    </span>
                  </div>
                </div>

                {/* DRM Explanation & Quota */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={18} className="text-[#00ba70] shrink-0" />
                    <span>ตามระเบียบลิขสิทธิ์ ยืมอ่านฟรีได้คราวละ {maxLoans} เล่ม (อ่านได้ 14 วัน)</span>
                  </div>
                  <span className="font-extrabold text-[#00ba70] bg-white px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                    โควตา {activeLoanCount}/{maxLoans} เล่ม
                  </span>
                </div>

                {borrowFeedback && (
                  <p className="mt-2 text-xs text-rose-600 font-semibold">{borrowFeedback}</p>
                )}

              </div>

            </div>

            {/* Red Copyright Legal Banner */}
            <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200/90 rounded-2xl p-4 mt-6 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="font-extrabold text-red-600 text-sm tracking-wide flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  หนังสือลิขสิทธิ์
                </span>
                <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                  สงวนลิขสิทธิ์ตามกฎหมาย
                </span>
                {book.isbn && (
                  <span className="text-[11px] font-mono text-red-700 bg-white/80 border border-red-200 px-2 py-0.5 rounded-md font-semibold">
                    ISBN: {book.isbn}
                  </span>
                )}
              </div>
              <p className="text-red-700 text-xs sm:text-sm leading-relaxed font-medium">
                หนังสือเล่มนี้เป็นลิขสิทธิ์ของ {publisher} ได้รับอนุญาตให้เผยแผ่เพื่อการศึกษาและปฏิบัติธรรม อนุญาตให้อ่านออนไลน์ในระบบหอสมุดดิจิทัล ห้ามทำซ้ำ ดัดแปลง หรือจำหน่ายในเชิงพาณิชย์
              </p>
            </div>

            {/* Synopsis / คำอธิบายหนังสือ */}
            <div className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border border-slate-200/70 mt-4">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-1.5 flex items-center gap-2">
                <FileCheck size={15} className="text-[#00ba70]" />
                เรื่องย่อ / เกี่ยวกับหนังสือเล่มนี้
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {book.description || 'รวบรวมหลักธรรมคำสอนและแนวทางการดำเนินชีวิตอย่างมีความสุขและสงบใจ เพื่อการศึกษาและพัฒนาจิตใจ ผสานมุมมองพุทธศาสตร์เข้ากับชีวิตประจำวัน'}
              </p>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // Check if book has a verified local PDF
  const hasLocalPdf = Boolean(book.pdf_url?.startsWith('/books/pdf/'));

  // Check if book is an external flipbook/web reader (PubHTML5 / Google Drive preview)
  const isExternalEmbed = Boolean(
    book.reader_type === 'external' ||
    book.has_flipbook === false ||
    (book.reader_url && (book.reader_url.includes('pubhtml5.com') || book.reader_url.includes('drive.google.com'))) ||
    (book.pdf_url && (book.pdf_url.includes('pubhtml5.com') || book.pdf_url.includes('drive.google.com'))) ||
    (!hasLocalPdf && (book.reader_url || (book as any).drive_file_id))
  );

  // 1. Explicit embed query param requested, OR book only exists as external web embed
  if (modeParam === 'embed' || (!hasLocalPdf && isExternalEmbed && modeParam !== 'flip')) {
    return <PubHtml5Reader book={book} hasLocalPdf={hasLocalPdf} />;
  }

  // 2. Launch 3D Flipbook Reader for books with verified local PDF
  return <PremiumBookReader book={book} initialPage={initialPage} />;
}

export default function BookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#fbf9f4] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-amber-950/70">กำลังเปิดห้องสมุดดิจิทัล...</p>
        </div>
      }
    >
      <BookReaderContent bookId={resolvedParams.id} />
    </Suspense>
  );
}
