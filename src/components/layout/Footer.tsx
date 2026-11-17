'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ArrowUp, 
  Mail, 
  Phone, 
  Globe, 
  BookOpen, 
  Headphones, 
  Video, 
  Sparkles, 
  Award, 
  Gift, 
  Smartphone 
} from 'lucide-react';

const FacebookIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const TiktokIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const YoutubeIcon = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full mt-auto select-none">
      
      {/* ========================================================= */}
      {/* 1. UPPER SECTION: Clean MEB-style Category Columns (White) */}
      {/* ========================================================= */}
      <div className="bg-white border-t border-slate-200/80 py-10 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Col 1: เกี่ยวกับห้องสมุด */}
            <div className="col-span-2 md:col-span-1 space-y-3">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="w-8 h-8 bg-[#079FE8] text-white rounded-xl flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform border border-white/80">
                  ถ
                </div>
                <span className="font-extrabold text-lg sm:text-xl text-[#073B65] tracking-tight">
                  Thanavuddho <span className="text-[#079FE8] font-black">Library</span>
                </span>
              </Link>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                รวบรวมองค์ความรู้และผลงานของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) เพื่อการศึกษา ค้นคว้า และพัฒนาจิตใจ
              </p>
              <div className="flex items-center gap-3 pt-1 text-slate-400">
                <a 
                  href="https://www.facebook.com/ThanavuddhoStory" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#1877F2] hover:text-white transition-all shadow-xs" 
                  title="Facebook พระอาจารย์"
                >
                  <FacebookIcon size={16} />
                </a>
                <a 
                  href="https://www.tiktok.com/@udornsharo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-black hover:text-white transition-all shadow-xs" 
                  title="TikTok พระอาจารย์"
                >
                  <TiktokIcon size={16} />
                </a>
                <a 
                  href="https://www.youtube.com/@ThanavuddhoStory" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-[#FF0000] hover:text-white transition-all shadow-xs" 
                  title="YouTube พระอาจารย์"
                >
                  <YoutubeIcon size={16} />
                </a>
              </div>
            </div>

            {/* Col 2: คลังสื่อการเรียนรู้หลัก (ตามคำสั่งผู้ใช้: ตัวหนังสือ, พอดแคสต์, วิดีโอ, วิดีโอช็อต) */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight flex items-center gap-2">
                <BookOpen size={16} className="text-[#079FE8]" />
                <span>คลังสื่อการเรียนรู้</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-normal">
                <li>
                  <Link href="/books" className="hover:text-[#079FE8] transition-colors block">
                    หนังสือธรรมะดิจิทัล
                  </Link>
                </li>
                <li>
                  <Link href="/pdf-books" className="hover:text-[#079FE8] transition-colors block">
                    หนังสืออ่านออนไลน์ (Flipbook)
                  </Link>
                </li>
                <li>
                  <Link href="/audios" className="hover:text-[#079FE8] transition-colors block">
                    พอดแคสต์ & หนังสือเสียง
                  </Link>
                </li>
                <li>
                  <Link href="/videos" className="hover:text-[#079FE8] transition-colors block">
                    วิดีโอเทศนาธรรม (16:9)
                  </Link>
                </li>
                <li>
                  <Link href="/videos?tab=shorts" className="hover:text-[#079FE8] transition-colors block">
                    คลิปสั้น YouTube & TikTok
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: กิจกรรมและการเรียนรู้ (ตามคำสั่งผู้ใช้: กหวีด/ควิซ, ตัวเลขของขวัญ/ร้านรางวัล) */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight flex items-center gap-2">
                <Award size={16} className="text-amber-500" />
                <span>กิจกรรม & แต้มสะสม</span>
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-normal">
                <li>
                  <Link href="/quiz" className="hover:text-[#079FE8] transition-colors block">
                    แบบทดสอบความรู้ท้ายเล่ม (รับ XP)
                  </Link>
                </li>
                <li>
                  <Link href="/rewards" className="hover:text-[#079FE8] transition-colors block">
                    ร้านแลกของรางวัลธรรมะ (แลกของขวัญ)
                  </Link>
                </li>
                <li>
                  <Link href="/survey" className="hover:text-[#079FE8] transition-colors block">
                    แบบประเมินห้องสมุด (รับ 200 แต้ม)
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#079FE8] transition-colors block">
                    กระเป๋าแต้ม & ชั้นหนังสือของฉัน
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: บริการและการช่วยเหลือ */}
            <div className="space-y-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base tracking-tight">
                เกี่ยวกับระบบและบริการ
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-normal">
                <li>
                  <Link href="/welcome" className="hover:text-[#079FE8] transition-colors block">
                    แนะนำการใช้งานห้องสมุด
                  </Link>
                </li>
                <li>
                  <Link href="/categories" className="hover:text-[#079FE8] transition-colors block">
                    หมวดหมู่ธรรมะทั้งหมด
                  </Link>
                </li>
                <li>
                  <Link href="/chatbot" className="hover:text-[#079FE8] transition-colors block">
                    ผู้ช่วย AI ค้นคว้าธรรมะ
                  </Link>
                </li>
                <li>
                  <span className="text-slate-400 block cursor-default">
                    เปิดอ่านฟรีเพื่อประโยชน์สาธารณะ
                  </span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. LOWER SECTION: BKK e-library Calm Green Brand Bar      */}
      {/* ========================================================= */}
      <div className="bg-[#0B6647] text-white py-8 sm:py-10 border-t border-emerald-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 pb-6 sm:pb-8">
            
            {/* Left: Address / ข้อมูลห้องสมุด */}
            <div className="space-y-2">
              <h4 className="font-bold text-base sm:text-lg text-emerald-100 tracking-tight">
                Address / ข้อมูลการติดต่อ
              </h4>
              <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed max-w-sm">
                หอสมุดดิจิทัล พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)<br />
                เพื่อการศึกษา วิจัย และเผยแผ่พระพุทธศาสนาสู่สากล
              </p>
              <div className="flex items-center gap-3 pt-2 text-white">
                <a 
                  href="https://www.facebook.com/ThanavuddhoStory" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center transition-all"
                  title="Facebook"
                >
                  <FacebookIcon size={16} />
                </a>
                <a 
                  href="https://www.tiktok.com/@udornsharo" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center transition-all"
                  title="TikTok"
                >
                  <TiktokIcon size={16} />
                </a>
                <a 
                  href="/" 
                  className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-700 flex items-center justify-center transition-all"
                  title="Website"
                >
                  <Globe size={16} />
                </a>
              </div>
            </div>

            {/* Center: BKK e-library style App & Web Platform */}
            <div className="flex flex-col items-start md:items-center justify-center text-left md:text-center space-y-2.5">
              <h4 className="font-bold text-base sm:text-lg text-white tracking-tight">
                Thanavuddho e-Library
              </h4>
              <p className="text-xs text-emerald-100 font-medium">
                เข้าอ่านออนไลน์ได้ทันที ทุกอุปกรณ์โดยไม่ต้องติดตั้ง
              </p>

              {/* App badges (เหมือน BKK e-library) */}
              <div className="flex items-center gap-2.5 pt-1">
                {/* Web App iOS Badge */}
                <div className="flex items-center gap-2 bg-black/60 hover:bg-black text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all cursor-default shadow-xs">
                  <div className="text-lg"></div>
                  <div className="text-left leading-tight">
                    <p className="text-[9px] text-white/70 uppercase">เปิดอ่านบน</p>
                    <p className="text-xs font-bold">App Store / iOS</p>
                  </div>
                </div>

                {/* Web App Android Badge */}
                <div className="flex items-center gap-2 bg-black/60 hover:bg-black text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all cursor-default shadow-xs">
                  <Smartphone size={16} className="text-emerald-400" />
                  <div className="text-left leading-tight">
                    <p className="text-[9px] text-white/70 uppercase">เปิดอ่านบน</p>
                    <p className="text-xs font-bold">Google Play / Web</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Contact Us */}
            <div className="flex flex-col items-start md:items-end justify-center text-left md:text-right space-y-2">
              <h4 className="font-bold text-base sm:text-lg text-emerald-100 tracking-tight">
                Contact Us / ติดต่อสอบถาม
              </h4>
              <p className="text-xs sm:text-sm text-emerald-50/90 leading-relaxed">
                เปิดบริการออนไลน์ฟรีตลอด 24 ชั่วโมง<br />
                สำหรับนักเรียน นักศึกษา และประชาชนทั่วไป
              </p>
              <p className="text-xs text-emerald-200 font-mono pt-1">
                Customer Service : thanavuddho.library@gmail.com
              </p>
            </div>

          </div>

          {/* BOTTOM STRIP: Powered by | Copyright | Back to top */}
          <div className="border-t border-emerald-700/60 pt-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-emerald-100/80">
            <div>
              v.2.4.84 Powered by Thanavuddho Library System
            </div>
            
            <div className="text-center">
              Copyright © 2026 All Right Reserved. | <Link href="/welcome" className="hover:underline">เงื่อนไขการให้บริการ</Link> | <Link href="/welcome" className="hover:underline">นโยบายความเป็นส่วนตัว</Link>
            </div>

            {/* Back to top circle button (BKK style) */}
            <div className="flex items-center gap-2">
              <button
                onClick={scrollToTop}
                className="w-9 h-9 rounded-full bg-white text-[#0B6647] shadow-lg flex items-center justify-center hover:bg-emerald-50 hover:scale-110 active:scale-95 transition-all cursor-pointer font-bold"
                title="กลับสู่ด้านบน"
                aria-label="กลับสู่ด้านบน"
              >
                <ArrowUp size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>

    </footer>
  );
}
