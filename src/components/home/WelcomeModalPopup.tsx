'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, BookOpen, ArrowRight, UserPlus, LogIn } from 'lucide-react';

export default function WelcomeModalPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only display once for first-time visitors across the entire domain
    const hasSeen = localStorage.getItem('thanavuddho_first_visit_seen');
    if (!hasSeen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('thanavuddho_first_visit_seen', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="library-welcome-title"
    >
      <div 
        className="relative bg-[#FAFAF8] rounded-2xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 text-center animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Editorial Top Visual: Real Library Image */}
        <div className="relative w-full h-36 sm:h-44 bg-[#073B65] overflow-hidden rounded-t-2xl sm:rounded-t-3xl">
          <Image
            src="/hero-image-modern.jpg"
            alt="Thanavuddho Digital Library"
            fill
            priority
            className="object-cover opacity-35 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAFAF8] via-transparent to-black/30" />

          {/* Close Button (X) */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white/90 hover:text-white transition-all cursor-pointer backdrop-blur-xs"
            aria-label="ปิดหน้าต่างต้อนรับ"
          >
            <X size={18} />
          </button>

          {/* Central Logo Crest */}
          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white border-2 border-amber-200/80 shadow-md flex items-center justify-center text-[#073B65]">
              <BookOpen size={26} className="text-[#073B65]" />
            </div>
          </div>
        </div>

        {/* Content Body (Modern Editorial Styling) */}
        <div className="pt-9 pb-6 sm:pb-8 px-5 sm:px-8">
          
          {/* Subtitle Monogram */}
          <div className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1.5 font-sans">
            THANAVUDDHO DIGITAL LIBRARY
          </div>

          {/* Main Title */}
          <h2 id="library-welcome-title" className="text-xl sm:text-2xl font-black text-[#073B65] tracking-tight mb-3">
            ยินดีต้อนรับสู่ห้องสมุดธรรมะ
          </h2>

          {/* Body Description */}
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto mb-4 font-normal">
            แหล่งรวบรวมหนังสือ บทความ เสียงธรรม และวิดีโอธรรมะ เพื่อการศึกษา ค้นคว้า และพัฒนาจิตใจ
          </p>

          {/* Core Motto */}
          <div className="inline-flex items-center gap-2 py-1.5 px-3.5 rounded-full bg-stone-100/80 border border-stone-200 text-xs sm:text-sm font-semibold text-[#073B65] mb-6">
            <span>อ่าน</span>
            <span className="text-amber-500 font-bold">•</span>
            <span>ฟัง</span>
            <span className="text-amber-500 font-bold">•</span>
            <span>เรียนรู้</span>
            <span className="text-amber-500 font-bold">•</span>
            <span>เข้าถึงธรรมะ</span>
          </div>

          {/* 3 Dedicated Action Buttons */}
          <div className="flex flex-col gap-2.5 max-w-sm mx-auto">
            {/* 1. เข้าสู่ห้องสมุด */}
            <button
              onClick={handleDismiss}
              className="w-full py-3 px-5 rounded-xl bg-[#073B65] hover:bg-[#0A4D82] text-white font-bold text-xs sm:text-sm transition-all active:scale-98 shadow-sm cursor-pointer flex items-center justify-center gap-2"
            >
              <span>เข้าสู่ห้องสมุด</span>
              <ArrowRight size={15} />
            </button>

            {/* 2 & 3: เข้าสู่ระบบ และ สมัครสมาชิก */}
            <div className="grid grid-cols-2 gap-2">
              <Link
                href="/login"
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl bg-white hover:bg-stone-50 text-[#073B65] font-bold text-xs border border-stone-300 transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <LogIn size={14} className="text-[#079FE8]" />
                <span>เข้าสู่ระบบ</span>
              </Link>

              <Link
                href="/login?tab=register"
                onClick={handleDismiss}
                className="py-2.5 px-3 rounded-xl bg-[#079FE8] hover:bg-[#0588c7] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <UserPlus size={14} />
                <span>สมัครสมาชิก</span>
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
