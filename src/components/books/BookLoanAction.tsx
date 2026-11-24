'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoan } from '@/context/LoanContext';
import { BookOpen, BookMarked, Check, RotateCcw, AlertCircle, Headphones, Lock, ShieldCheck, ShoppingCart, ExternalLink } from 'lucide-react';

interface BookLoanActionProps {
  bookId: string;
  bookTitle: string;
  bookCover: string;
  totalPages: number;
  audioId?: string | null;
  buyUrl?: string;
  storeName?: string;
  price?: string;
  isExternalStore?: boolean;
}

export default function BookLoanAction({
  bookId,
  bookTitle,
  bookCover,
  totalPages,
  audioId,
  buyUrl,
  storeName,
  price,
  isExternalStore
}: BookLoanActionProps) {
  const router = useRouter();
  const { isMediaBorrowed, borrowMedia, returnMediaByBookId, activeLoanCount, maxLoans, loans } = useLoan();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  const borrowed = isMediaBorrowed(bookId);
  const currentLoan = loans.find(l => l.media_id === bookId && l.status === 'active');

  const getDueDays = () => {
    if (!currentLoan) return 14;
    const due = new Date(currentLoan.due_date);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeLoanCount >= maxLoans) {
      setIsError(true);
      setFeedback(`คุณยืมหนังสือครบโควตาสูงสุด ${maxLoans} เล่มแล้ว กรุณาคืนเล่มเดิมก่อน`);
      setTimeout(() => setFeedback(null), 4000);
      return;
    }

    const res = borrowMedia({
      id: bookId,
      title: bookTitle,
      type: 'book',
      cover: bookCover
    });

    setIsError(!res.success);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    returnMediaByBookId(bookId);
    setIsError(false);
    setFeedback('คืนหนังสือเรียบร้อยแล้ว เพิ่มโควตายืมว่าง 1 เล่ม');
    setTimeout(() => setFeedback(null), 3000);
  };

  const hasAudio = audioId || bookId === 'book_tam_jai_hai_prom_buak' || bookTitle.includes('ทำใจให้พร้อมบวก');

  // Commercial / External Store Book Handling
  if (isExternalStore || buyUrl) {
    const effectiveStoreUrl = buyUrl || 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=115432';
    const effectiveStoreName = storeName || 'MEB Market';

    return (
      <div className="w-full space-y-4 pt-4 border-t border-slate-100">
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent border-2 border-amber-300 text-xs sm:text-sm shadow-xs">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="font-extrabold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs shadow-xs">
              🛒 หนังสือฉบับวางจำหน่ายภายนอก
            </span>
            {price && (
              <span className="text-xs font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-md border border-amber-200">
                ราคาประมาณ {price}
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-amber-950 leading-relaxed font-medium">
            หนังสือเล่มนี้เป็นผลงานฉบับลิขสิทธิ์วางจำหน่าย ไม่ได้เปิดให้อ่านฟรีออนไลน์ในระบบหอสมุด แต่ได้รวบรวมข้อมูลไว้เพื่อให้คลังผลงานธรรมะของพระอาจารย์ครบถ้วนที่สุด ท่านสามารถเลือกซื้อและสนับสนุนผลงานฉบับสมบูรณ์ได้โดยตรงจาก {effectiveStoreName}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <a
            href={effectiveStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95 group"
          >
            <ShoppingCart size={18} />
            <span>สั่งซื้อฉบับเต็มบน {effectiveStoreName}</span>
            <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 pt-4 border-t border-slate-100">
      
      {/* DRM & Copyright Loan Status Card */}
      <div className={`p-4 rounded-2xl border text-xs sm:text-sm transition-all ${
        borrowed 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
          : 'bg-[#F0F8FD] border-[#DCEAF3] text-[#073B65]'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {borrowed ? (
              <ShieldCheck size={18} className="text-emerald-600 shrink-0" />
            ) : (
              <Lock size={18} className="text-[#079FE8] shrink-0" />
            )}
            <div>
              <span className="font-bold">
                {borrowed ? 'คุณได้ยืมหนังสือเล่มนี้แล้ว (พร้อมเปิดอ่าน)' : 'หนังสือลิขสิทธิ์ดิจิทัล (DRM)'}
              </span>
              <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                {borrowed 
                  ? `เหลือเวลาอ่านอีก ${getDueDays()} วัน • เก็บไว้ในชั้นหนังสือของคุณ`
                  : 'ต้องทำรายการยืมก่อนจึงจะสามารถเปิดอ่านได้ โดยจำกัดสิทธิ์ยืมได้สูงสุด 3 เล่มพร้อมกัน'}
              </p>
            </div>
          </div>

          {/* Quota Badge */}
          <div className="self-start sm:self-auto px-3 py-1 rounded-full font-bold text-xs bg-white border shadow-2xs">
            <span className="text-slate-500 font-normal">โควตายืม: </span>
            <span className={activeLoanCount >= maxLoans ? 'text-rose-600' : 'text-[#079FE8]'}>
              {activeLoanCount} / {maxLoans} เล่ม
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Signature Blue Theme */}
      <div className="flex flex-wrap items-center gap-3">
        {borrowed ? (
          <>
            {/* 1. Read Button (Unlocked) - Signature Blue Pill */}
            <Link 
              href={`/reader/${bookId}?from=/books/${bookId}`} 
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#079FE8] to-[#073B65] hover:from-[#0588c7] hover:to-[#052946] text-white px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-98 w-full sm:w-auto text-center"
            >
              <BookOpen size={18} />
              <span>เปิดอ่านหนังสือ (ยืมแล้ว)</span>
            </Link>

            {/* 2. Return Button */}
            <button
              type="button"
              onClick={handleReturn}
              className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 font-bold text-xs sm:text-sm transition-colors border border-slate-200 cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw size={15} />
              <span>คืนหนังสือ</span>
            </button>
          </>
        ) : (
          <>
            {/* 1. Borrow Button - Signature Blue Pill */}
            {activeLoanCount < maxLoans ? (
              <button
                type="button"
                onClick={handleBorrow}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#079FE8] to-[#073B65] hover:from-[#0588c7] hover:to-[#052946] text-white px-8 py-3.5 rounded-full font-extrabold text-sm sm:text-base transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer w-full sm:w-auto"
              >
                <BookMarked size={18} />
                <span>📘 กดยืมหนังสือเพื่อเริ่มอ่านทันที (ว่าง {maxLoans - activeLoanCount} เล่ม)</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-2 bg-slate-200 text-slate-500 px-6 py-3.5 rounded-full font-bold text-sm cursor-not-allowed w-full sm:w-auto"
                >
                  <Lock size={16} />
                  <span>ยืมครบโควตา 3 เล่มแล้ว</span>
                </button>
                <Link
                  href="/dashboard"
                  className="text-xs font-bold text-[#079FE8] hover:underline"
                >
                  ไปยังชั้นหนังสือเพื่อคืนเล่มเดิม →
                </Link>
              </div>
            )}
          </>
        )}

        {/* 3. Buy on Google Play Store Button */}
        <a
          href="https://play.google.com/store/search?q=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%A2%20%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B8%E0%B8%91%E0%B9%82%E0%B8%92&c=books"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm border border-slate-300 shadow-2xs transition-all active:scale-98 w-full sm:w-auto cursor-pointer"
          title="เลือกซื้อหนังสือฉบับเต็มบน Google Play Books"
        >
          <span className="text-base">📱</span>
          <span>Google Play Books</span>
        </a>
      </div>

      {/* Floating feedback toast */}
      {feedback && (
        <div className={`p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md animate-in fade-in duration-200 ${
          isError ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
        }`}>
          {isError ? <AlertCircle size={16} className="text-rose-600 shrink-0" /> : <Check size={16} className="text-emerald-600 shrink-0" />}
          <span>{feedback}</span>
        </div>
      )}

    </div>
  );
}

