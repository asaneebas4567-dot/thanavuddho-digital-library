'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Headphones, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Tv
} from 'lucide-react';

function PodcastLibraryContent() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 sm:pb-24 pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* Notice Banner: Podcast update in progress */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-amber-900 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700 font-bold text-lg">
              📢
            </div>
            <div>
              <h3 className="font-bold text-sm">ระบบพอดแคสต์กำลังอยู่ระหว่างเตรียมความพร้อม</h3>
              <p className="text-xs text-amber-800/90 mt-0.5">
                กำลังรวบรวมและจัดเตรียมชุดไฟล์เสียงธรรมะฉบับสมบูรณ์ รอพบกับการเปิดตัวอย่างเป็นทางการในเร็ว ๆ นี้
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/videos"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              รับชมวิดีโอแทน &rarr;
            </Link>
            <Link
              href="/books"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              อ่านหนังสือ &rarr;
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 1. HERO BANNER                                            */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0A4D82] to-[#079FE8] text-white p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-lg border border-[#073B65]/30">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#FEF08A] text-xs font-bold backdrop-blur-md border border-white/20 mb-3">
              <Headphones size={13} />
              <span>ห้องสมุดเสียงธรรมะบรรยาย & พอดแคสต์</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3 leading-tight">
              ห้องสมุดพอดแคสต์ & <span className="text-sky-200">เสียงธรรมบรรยาย</span>
            </h1>
            <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed mb-4 max-w-2xl">
              ศูนย์รวมพอดแคสต์พัฒนาจิตใจ เสียงอ่านหนังสือลิขสิทธิ์ และธรรมเทศนาร่วมสมัย เพื่อการเรียนรู้และนำไปปรับใช้ในชีวิตจริง
            </p>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. PODCAST SYSTEM UPDATE NOTICE                           */}
        {/* ========================================================= */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 mb-8 text-center max-w-3xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-[#079FE8] border border-sky-100 flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Headphones size={32} />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mb-3">
            🔄 อยู่ระหว่างรวบรวมและจัดเตรียมชุดไฟล์เสียงฉบับสมบูรณ์
          </span>

          <h2 className="text-xl sm:text-2xl font-black text-[#073B65] tracking-tight mb-2">
            ระบบพอดแคสต์กำลังอยู่ระหว่างเตรียมความพร้อม
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl mx-auto mb-6">
            ทีมงานกำลังรวบรวมและปรับปรุงไฟล์เสียงธรรมะคุณภาพสูง (Master MP3) และจัดระบบสตรีมเสียงธรรมเทศนาใหม่ เพื่อให้ท่านได้รับฟังธรรมะอย่างต่อเนื่อง คมชัด และมีความสุขอย่างแท้จริง รอพบกับเวอร์ชันอัปเดตสมบูรณ์เร็ว ๆ นี้
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/videos"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <Tv size={16} />
              <span>รับชมวิดีโอธรรมะ & คลิปสั้น</span>
            </Link>

            <Link
              href="/books"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#073B65] hover:bg-[#0A4D82] text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
            >
              <BookOpen size={16} />
              <span>อ่านหนังสือธรรมะ Flipbook</span>
            </Link>

            <Link
              href="/chatbot"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all"
            >
              <Sparkles size={16} className="text-amber-500" />
              <span>สนทนาธรรมะกับ AI Chatbot</span>
            </Link>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. COMPANION FLIPBOOK PROMO CARD                          */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 rounded-2xl sm:rounded-3xl border border-amber-200/80 p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="relative w-16 sm:w-20 aspect-[3/4.2] rounded-xl overflow-hidden shadow-md shrink-0 border border-amber-300">
              <Image
                src="/images/books/tam-jai-hai-prom-buak.jpg"
                alt="หนังสือ ทำใจให้พร้อมบวก"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full uppercase tracking-wide">
                หนังสือลิขสิทธิ์ฉบับเต็ม
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                ทำใจให้พร้อมบวก (ฉบับ E-Book Flipbook 2 หน้า)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mt-0.5 leading-relaxed">
                อ่านเนื้อหาต้นฉบับเต็มเล่มแบบเปิดหน้าเสมือนจริง ควบคู่ไปกับการเปิดฟังพอดแคสต์ในระบบ Hybrid Player
              </p>
            </div>
          </div>

          <Link
            href="/reader/book_tam_jai_hai_prom_buak"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#073B65] hover:bg-[#0A4D82] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <BookOpen size={14} className="text-[#FEF08A]" />
            <span>เปิดอ่านหนังสือฟรี</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AudiosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8">
          <div className="w-10 h-10 border-4 border-[#079FE8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-[#073B65]">กำลังโหลดห้องสมุดพอดแคสต์...</p>
        </div>
      </div>
    }>
      <PodcastLibraryContent />
    </Suspense>
  );
}
