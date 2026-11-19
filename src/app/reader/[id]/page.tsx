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
import { Loader2, ArrowLeft, ShieldCheck, Lock, BookMarked, AlertCircle, BookOpen } from 'lucide-react';

function resolveReaderBook(rawId: string): any {
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

  // 6. Safe fallback: first available book instead of throwing 404
  return allPool[0] || null;
}

function BookReaderContent({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const { isMediaBorrowed, borrowMedia, activeLoanCount, maxLoans } = useLoan();
  const [borrowFeedback, setBorrowFeedback] = useState<string | null>(null);

  const foundBook = resolveReaderBook(bookId);

  const rawCover = foundBook?.cover_image || foundBook?.cover || '';
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

  // DRM & Copyright Enforcement: Must be borrowed to open reader
  const isBorrowed = isMediaBorrowed(book.id || bookId);

  if (!isBorrowed) {
    return (
      <div className="min-h-screen bg-[#F0F8FD]/60 flex flex-col justify-between font-sans">
        {/* Top Header */}
        <header className="bg-white border-b border-[#DCEAF3] px-4 sm:px-6 py-3 flex items-center justify-between shadow-xs">
          <Link
            href={book.id ? `/books/${book.id}` : '/books'}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#073B65] hover:text-[#079FE8] transition-colors"
          >
            <ArrowLeft size={16} />
            <span>ย้อนกลับไปหน้ารายละเอียดหนังสือ</span>
          </Link>

          <Link
            href="/dashboard"
            className="text-xs sm:text-sm font-bold text-[#079FE8] hover:underline"
          >
            ชั้นหนังสือของฉัน (ยืมอยู่ {activeLoanCount}/{maxLoans})
          </Link>
        </header>

        {/* Center Content: DRM Copyright Borrow Gate */}
        <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-[#DCEAF3] shadow-xl p-6 sm:p-8 text-center space-y-5 animate-in fade-in duration-300">
            {/* Book Cover */}
            <div className="relative w-28 sm:w-32 aspect-[1/1.42] mx-auto rounded-xl overflow-hidden shadow-lg border border-slate-200">
              <Image
                src={secureCover}
                alt={book.title || 'ปกหนังสือ'}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute top-1.5 right-1.5 bg-rose-700 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-xs">
                ลิขสิทธิ์
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-1">
              <h1 className="text-base sm:text-lg font-bold text-[#073B65] leading-snug">
                {book.title || 'หนังสือธรรมะ'}
              </h1>
              <p className="text-xs text-[#64748B]">
                พระครูปลัดสุวัฒนโพธิคุณ • {book.pages} หน้า
              </p>
            </div>

            {/* DRM Explanation Card */}
            <div className="p-4 rounded-2xl bg-[#F0F8FD] border border-[#DCEAF3] text-left space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#073B65]">
                <ShieldCheck size={16} className="text-[#079FE8] shrink-0" />
                <span>หนังสือลิขสิทธิ์ดิจิทัล (Digital Rights Management)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                ตามข้อกำหนดการคุ้มครองลิขสิทธิ์ดิจิทัลของห้องสมุด ระบบได้ปิดการอ่านโดยตรง ผู้ใช้งานจำเป็นต้องทำรายการยืมก่อนเปิดอ่าน โดยสามารถยืมหนังสือเก็บไว้ได้สูงสุด <strong>{maxLoans} เล่ม</strong> พร้อมกัน (อ่านได้ไม่จำกัดตลอดระยะเวลายืม 14 วัน)
              </p>
              <div className="pt-2 border-t border-[#DCEAF3] flex items-center justify-between text-xs font-semibold text-[#073B65]">
                <span>โควตายืมปัจจุบัน:</span>
                <span className={activeLoanCount >= maxLoans ? 'text-rose-600 font-bold' : 'text-[#079FE8] font-bold'}>
                  {activeLoanCount} / {maxLoans} เล่ม
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-1">
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
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#079FE8] to-[#073B65] hover:from-[#0588c7] hover:to-[#052946] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <BookMarked size={18} />
                  <span>📘 กดยืมหนังสือเพื่อเริ่มอ่านทันที (ว่าง {maxLoans - activeLoanCount} เล่ม)</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle size={16} className="text-rose-600 shrink-0" />
                    <span>คุณยืมหนังสือครบโควตา 3 เล่มแล้ว กรุณาคืนเล่มเดิมก่อน</span>
                  </div>
                  <Link
                    href="/dashboard"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#073B65] hover:bg-[#0A4D82] text-white font-bold text-sm shadow-md transition-all active:scale-98 flex items-center justify-center gap-2 block text-center"
                  >
                    <span>ไปยังชั้นหนังสือของฉันเพื่อคืนเล่มเดิม</span>
                  </Link>
                </div>
              )}

              <Link
                href={book.id ? `/books/${book.id}` : '/books'}
                className="w-full py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors block text-center"
              >
                ย้อนกลับไปหน้ารายละเอียดหนังสือ
              </Link>
            </div>

            {borrowFeedback && (
              <p className="text-xs text-rose-600 font-semibold">{borrowFeedback}</p>
            )}
          </div>
        </main>
      </div>
    );
  }

  // Check if book is strictly an external PubHTML5 flipbook with no local PDF (World Civilization series 1-14)
  const isExternalPubHtml5Only = Boolean(
    (book.category_id === 'cat_world_civ' || (book.category_ids && book.category_ids.includes('cat_world_civ'))) &&
    !book.pdf_url?.startsWith('/books/pdf/')
  );

  // 1. Explicit query param requested
  if (modeParam === 'embed' && (book.reader_url || book.source_url || book.pdf_url || (book as any).drive_file_id)) {
    return <PubHtml5Reader book={book} hasLocalPdf={true} />;
  }

  // 2. World Civilization external webtoon / PubHTML5 series without local PDF
  if (isExternalPubHtml5Only && modeParam !== 'flip') {
    return <PubHtml5Reader book={book} hasLocalPdf={false} />;
  }

  // 3. For ALL Library books: Launch the complete 3D Flipbook Reader system (ระบบของที่ทำมา)
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
