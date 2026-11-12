'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLoan } from '@/context/LoanContext';
import { BookOpen, BookMarked, Check, RotateCcw, AlertCircle, Headphones, Lock, ShieldCheck } from 'lucide-react';

interface BookLoanActionProps {
  bookId: string;
  bookTitle: string;
  bookCover: string;
  totalPages: number;
  audioId?: string | null;
}

export default function BookLoanAction({
  bookId,
  bookTitle,
  bookCover,
  totalPages,
  audioId
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

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {borrowed ? (
          <>
            {/* 1. Read Button (Unlocked) */}
            <Link 
              href={`/reader/${bookId}?from=/books/${bookId}`} 
              className="flex items-center justify-center gap-2 bg-[#073B65] hover:bg-[#052946] text-white px-7 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md active:scale-98 w-full sm:w-auto"
            >
              <BookOpen size={18} className="text-[#D9A441]" />
              <span>เปิดอ่านหนังสือที่ยืมแล้ว ({totalPages} หน้า)</span>
            </Link>

            {/* 2. Return Button */}
            <button
              type="button"
              onClick={handleReturn}
              className="flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors border border-slate-300/80 cursor-pointer w-full sm:w-auto"
            >
              <RotateCcw size={16} />
              <span>คืนหนังสือเล่มนี้</span>
            </button>
          </>
        ) : (
          <>
            {/* 1. Borrow Button */}
            {activeLoanCount < maxLoans ? (
              <button
                type="button"
                onClick={handleBorrow}
                className="flex items-center justify-center gap-2 bg-[#079FE8] hover:bg-[#0588c7] text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all shadow-md hover:shadow-lg active:scale-98 cursor-pointer w-full sm:w-auto"
              >
                <BookMarked size={18} />
                <span>📘 กดยืมหนังสือเล่มนี้ (อ่านได้ 14 วัน)</span>
              </button>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  disabled
                  className="flex items-center justify-center gap-2 bg-slate-200 text-slate-500 px-6 py-3.5 rounded-xl font-bold text-sm cursor-not-allowed w-full sm:w-auto"
                >
                  <Lock size={16} />
                  <span>ยืมครบโควตา 3 เล่มแล้ว</span>
                </button>
                <Link
                  href="/loans"
                  className="text-xs font-bold text-[#079FE8] hover:underline"
                >
                  ไปยังชั้นหนังสือเพื่อคืนเล่มเดิม →
                </Link>
              </div>
            )}
          </>
        )}

        {/* Podcast Button (if available) */}
        {hasAudio && (
          <Link
            href="/audios?podcast=pod-tam-jai-hai-prom-buak"
            className="flex items-center justify-center gap-2 bg-[#F0F8FD] hover:bg-sky-100 text-[#073B65] border border-[#DCEAF3] px-6 py-3.5 rounded-xl font-bold text-sm transition-all shadow-xs w-full sm:w-auto"
          >
            <Headphones size={18} className="text-[#079FE8]" />
            <span>ฟังพอดแคสต์ (5 ตอน) 🎧</span>
          </Link>
        )}

        <Link
          href="/loans"
          className="text-xs font-semibold text-slate-500 hover:text-[#073B65] ml-auto py-2"
        >
          ชั้นหนังสือที่ยืมไว้ ({activeLoanCount}/{maxLoans}) →
        </Link>
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
