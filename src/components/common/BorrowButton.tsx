'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLoan } from '@/context/LoanContext';
import { useAuth } from '@/context/AuthContext';
import { MediaType } from '@/types';
import { BookMarked, Check, Clock, AlertCircle, LogIn, Lock } from 'lucide-react';

interface BorrowButtonProps {
  mediaId: string;
  mediaTitle: string;
  mediaType: MediaType;
  mediaCover: string;
  className?: string;
  variant?: 'primary' | 'outline' | 'compact';
}

export default function BorrowButton({
  mediaId,
  mediaTitle,
  mediaType,
  mediaCover,
  className = '',
  variant = 'primary'
}: BorrowButtonProps) {
  const router = useRouter();
  const { isMediaBorrowed, borrowMedia, loans, returnMedia } = useLoan();
  const { isAuthenticated, user, syncUserLoans } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const borrowed = isMediaBorrowed(mediaId);
  const currentLoan = loans.find(l => l.media_id === mediaId && l.status === 'active');

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Check if user is authenticated with Google
    if (!isAuthenticated) {
      setShowLoginPrompt(true);
      return;
    }

    if (borrowed) {
      if (currentLoan) {
        returnMedia(currentLoan.id);
        setIsError(false);
        setFeedback('คืนสื่อเรียบร้อยแล้ว');
        setTimeout(() => setFeedback(null), 3000);
      }
      return;
    }

    const res = borrowMedia({
      id: mediaId,
      title: mediaTitle,
      type: mediaType,
      cover: mediaCover
    });

    setIsError(!res.success);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const getDueDays = () => {
    if (!currentLoan) return 14;
    const due = new Date(currentLoan.due_date);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  return (
    <div className="relative inline-block">
      {borrowed ? (
        <button
          onClick={handleBorrow}
          title="คลิกเพื่อคืนสื่อ"
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100 transition-colors shadow-sm cursor-pointer ${className}`}
        >
          <Check size={14} className="text-emerald-600" />
          <span>ยืมอยู่ (เหลือ {getDueDays()} วัน) • คืนสื่อ</span>
        </button>
      ) : (
        <button
          onClick={handleBorrow}
          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer ${
            variant === 'primary' 
              ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-sky-600/20 hover:shadow-md'
              : variant === 'outline'
              ? 'border border-sky-500 text-sky-700 hover:bg-sky-50'
              : 'bg-sky-50 text-sky-800 hover:bg-sky-100'
          } ${className}`}
        >
          <BookMarked size={16} />
          <span>ยืมสื่อ (14 วัน)</span>
        </button>
      )}

      {/* Floating Feedback Notification */}
      {feedback && (
        <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-2.5 rounded-xl text-xs font-medium shadow-xl z-50 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 ${
          isError ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
        }`}>
          {isError ? <AlertCircle size={16} className="text-rose-600 shrink-0" /> : <Clock size={16} className="text-emerald-600 shrink-0" />}
          <span>{feedback}</span>
        </div>
      )}

      {/* Login Required Modal */}
      {showLoginPrompt && (
        <div 
          onClick={(e) => {
            e.stopPropagation();
            setShowLoginPrompt(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-sm w-full p-6 text-center border border-slate-200 shadow-2xl space-y-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto shadow-xs">
              <Lock size={22} />
            </div>

            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                เข้าสู่ระบบเพื่อยืมหนังสือ
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                กรุณาเข้าสู่ระบบหรือสมัครสมาชิกห้องสมุด เพื่อบันทึกประวัติการยืม และเก็บหนังสือเล่มนี้เข้าชั้นหนังสือดิจิทัลส่วนตัวของคุณ (ยืมอ่านได้ 14 วัน)
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  const currentPath = typeof window !== 'undefined' ? window.location.pathname : `/books/${mediaId}`;
                  router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <LogIn size={15} />
                <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
              </button>

              <button
                onClick={() => setShowLoginPrompt(false)}
                className="w-full py-2 px-4 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                ไว้คราวหลัง
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
