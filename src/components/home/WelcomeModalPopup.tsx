'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  BookOpen, 
  Video, 
  Headphones, 
  Award, 
  ArrowRight, 
  Sparkles, 
  LogIn, 
  Compass,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function WelcomeModalPopup() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    // Check if dismissed previously in localStorage or sessionStorage
    const isDismissed = localStorage.getItem('thanavuddho_welcome_modal_dismissed');
    if (!isDismissed) {
      // Small delay for smooth entry
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('thanavuddho_welcome_modal_dismissed', 'true');
    } else {
      sessionStorage.setItem('thanavuddho_welcome_modal_dismissed', 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Background Warm Glow (Very Subtle) */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X size={18} className="sm:w-5 sm:h-5" />
        </button>

        {/* Header Icon / Avatar Badge */}
        <div className="relative w-14 h-14 sm:w-18 sm:h-18 mx-auto mb-3 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300 bg-gradient-to-br from-[#073B65] via-[#0A4D82] to-[#079FE8] flex items-center justify-center text-white">
          <div className="flex flex-col items-center justify-center text-center p-1.5">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-[#FDE68A] drop-shadow-sm mb-0.5" />
            <span className="text-[8px] sm:text-[9px] font-black tracking-wider uppercase text-sky-100">ห้องสมุดดิจิทัล</span>
          </div>
        </div>

        {/* Brand Tag */}
        <div className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] sm:text-[11px] font-black uppercase tracking-wider border border-blue-200 mb-2">
          <Sparkles size={11} className="text-amber-500" />
          <span>คลังธรรมะดิจิทัล & ระบบสะสมคะแนน</span>
        </div>

        {/* Title & Description */}
        <h2 className="text-base sm:text-xl font-black text-slate-900 tracking-tight mb-1.5 leading-snug">
          ยินดีต้อนรับสู่ Thanavuddho Digital Library
        </h2>
        <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed max-w-md mx-auto mb-4 sm:mb-5">
          คลังสารสนเทศเพื่อการเรียนรู้ธรรมะ รวบรวมหนังสือฉบับเต็ม วิดีโอธรรมบรรยาย พอดแคสต์ และเควสสะสมแต้มบุญปัญญา โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)
        </p>

        {/* 4 Feature Pills (Clean, Light Pastels) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-4 sm:mb-5 text-left">
          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen size={14} className="sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-black text-slate-900 truncate">คลังหนังสือจริง</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 truncate">อ่านฟรี Flipbook</div>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Video size={14} className="sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-black text-slate-900 truncate">วิดีโอธรรมะ</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 truncate">บรรยาย & AI</div>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Headphones size={14} className="sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-black text-slate-900 truncate">พอดแคสต์</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 truncate">เสียงบันทึกธรรม</div>
            </div>
          </div>

          <div className="p-2 sm:p-2.5 rounded-xl sm:rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Award size={14} className="sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-[11px] sm:text-xs font-black text-slate-900 truncate">เควส & แต้มบุญ</div>
              <div className="text-[9px] sm:text-[10px] text-slate-500 truncate">แลกของรางวัล</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {/* Main Action: Enter Live Website Immediately */}
          <button
            onClick={handleClose}
            className="w-full py-2.5 sm:py-3.5 px-4 sm:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <span>เข้าสู่หน้าเว็บจริง (เข้าชมทันที)</span>
            <ArrowRight size={15} />
          </button>

          {/* Secondary Action: Login / Register if not authenticated */}
          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={handleClose}
              className="w-full py-2 sm:py-2.5 px-3 rounded-lg sm:rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] sm:text-xs transition-colors flex items-center justify-center gap-1.5 truncate"
            >
              <LogIn size={13} className="shrink-0" />
              <span className="truncate">เข้าสู่ระบบสมาชิก (สะสมแต้มและแลกของรางวัล)</span>
            </Link>
          )}
        </div>

        {/* Don't show again checkbox */}
        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-center gap-1.5">
          <input
            type="checkbox"
            id="dont_show_again"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
          />
          <label 
            htmlFor="dont_show_again" 
            className="text-[10px] sm:text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ไม่ต้องแสดงหน้าต่างนี้อีก
          </label>
        </div>
      </div>
    </div>
  );
}

