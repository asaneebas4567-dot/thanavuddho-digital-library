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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Background Warm Glow (Very Subtle) */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-100/50 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="ปิดหน้าต่าง"
        >
          <X size={20} />
        </button>

        {/* Header Icon / Avatar */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl overflow-hidden shadow-md border-2 border-amber-300 bg-amber-50">
          <Image
            src="/images/author-somchai.jpg"
            alt="พระครูปลัดสุวัฒนโพธิคุณ"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Brand Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-black uppercase tracking-wider border border-blue-200 mb-2">
          <Sparkles size={12} className="text-amber-500" />
          <span>คลังธรรมะดิจิทัล & ระบบสะสมคะแนน</span>
        </div>

        {/* Title & Description */}
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          ยินดีต้อนรับสู่ Thanavuddho Digital Library
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-6">
          คลังสารสนเทศเพื่อการเรียนรู้ธรรมะ รวบรวมหนังสือฉบับเต็ม วิดีโอธรรมบรรยาย พอดแคสต์ และเควสสะสมแต้มบุญปัญญา โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)
        </p>

        {/* 4 Feature Pills (Clean, Light Pastels) */}
        <div className="grid grid-cols-2 gap-2.5 mb-6 text-left">
          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
              <BookOpen size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900">คลังหนังสือจริง</div>
              <div className="text-[10px] text-slate-500">อ่านฟรี Flipbook</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
              <Video size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900">วิดีโอธรรมะ</div>
              <div className="text-[10px] text-slate-500">บรรยาย & บทสรุป AI</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
              <Headphones size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900">พอดแคสต์</div>
              <div className="text-[10px] text-slate-500">เสียงอ่านบันทึกธรรม</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Award size={16} />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-black text-slate-900">เควส & แต้มบุญ</div>
              <div className="text-[10px] text-slate-500">แลกของรางวัลจริง</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          {/* Main Action: Enter Live Website Immediately */}
          <button
            onClick={handleClose}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>เข้าสู่หน้าเว็บจริง (เข้าชมทันที)</span>
            <ArrowRight size={16} />
          </button>

          {/* Secondary Action: Login / Register if not authenticated */}
          {!isAuthenticated && (
            <Link
              href="/login"
              onClick={handleClose}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <LogIn size={14} />
              <span>เข้าสู่ระบบสมาชิก (เพื่อสะสมแต้มและแลกของรางวัล)</span>
            </Link>
          )}
        </div>

        {/* Don't show again checkbox */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2">
          <input
            type="checkbox"
            id="dont_show_again"
            checked={dontShowAgain}
            onChange={(e) => setDontShowAgain(e.target.checked)}
            className="w-3.5 h-3.5 rounded text-blue-600 cursor-pointer"
          />
          <label 
            htmlFor="dont_show_again" 
            className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            ไม่ต้องแสดงหน้าต่างนี้อีก
          </label>
        </div>
      </div>
    </div>
  );
}

