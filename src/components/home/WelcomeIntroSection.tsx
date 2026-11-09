'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Video, 
  Headphones, 
  Sparkles, 
  Gift, 
  LogIn, 
  UserPlus, 
  Compass, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  Award, 
  Coins, 
  ArrowDown, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  ExternalLink,
  Flame
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLearningPoints } from '@/lib/useLearningPoints';

export default function WelcomeIntroSection() {
  const { user, isAuthenticated } = useAuth();
  const { availablePoints } = useLearningPoints();
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [isIntroExpanded, setIsIntroExpanded] = useState(true);

  // Smooth scroll to public library catalog
  const handleExploreGuest = () => {
    const target = document.getElementById('public-catalog-start');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 680, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white pt-6 pb-10 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D9A441] shadow-xl">
      {/* Background Decorative Halos & Motifs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#079FE8]/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#D9A441]/20 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-6">
        
        {/* 1. TOP HEADER & BRAND IDENTITY */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 pb-4 border-b border-white/15">
          
          {/* Brand Logo & Titles */}
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 backdrop-blur-md p-1.5 border-2 border-[#D9A441] shadow-lg shrink-0 flex items-center justify-center">
              <Image
                src="/images/books/tam-jai-hai-prom-buak.jpg"
                alt="Thanavuddho Logo"
                fill
                className="object-cover rounded-xl"
                unoptimized
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#D9A441] border border-white flex items-center justify-center text-[10px] font-black text-[#073B65] shadow-xs">
                ✦
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-[#FEF08A] text-xs font-black tracking-wide uppercase shadow-xs mb-1">
                <Sparkles size={12} className="text-[#D9A441]" />
                <span>คลังปัญญาธรรมะดิจิทัล & ระบบสะสมคะแนน</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight drop-shadow-sm">
                Thanavuddho Digital Library
              </h1>
              <p className="text-xs sm:text-sm text-sky-100 font-semibold mt-0.5 max-w-2xl">
                ห้องสมุดดิจิทัล พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)
              </p>
            </div>
          </div>

          {/* Member Status / Guest Indicator Badge */}
          <div className="shrink-0 flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="px-4 py-2.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center gap-3 shadow-md">
                <div className="w-9 h-9 rounded-full bg-[#D9A441] text-[#073B65] font-black flex items-center justify-center text-sm shadow-xs">
                  {user.name ? user.name[0].toUpperCase() : 'M'}
                </div>
                <div className="text-left text-xs">
                  <div className="font-extrabold text-white flex items-center gap-1">
                    <span>{user.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-400 text-slate-900 text-[9px] font-black">
                      สมาชิก
                    </span>
                  </div>
                  <div className="text-[#FEF08A] font-bold text-[11px] flex items-center gap-1 mt-0.5">
                    <Coins size={12} className="text-[#D9A441]" />
                    <span>{availablePoints.toLocaleString()} คะแนนบุญสะสม</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="px-3.5 py-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sky-100 font-bold">สถานะ: ผู้เยี่ยมชม (Guest)</span>
                <span className="text-[10px] text-sky-200 bg-sky-900/60 px-2 py-0.5 rounded-full border border-sky-400/30">
                  เข้าชมฟรี
                </span>
              </div>
            )}
          </div>

        </div>

        {/* 2. MISSION & PURPOSE STATEMENT */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs sm:text-sm text-sky-50 leading-relaxed max-w-3xl">
            <strong className="text-white font-extrabold block text-sm sm:text-base mb-1">
              📖 วัตถุประสงค์ของห้องสมุดดิจิทัล
            </strong>
            เพื่อเป็นศูนย์กลางการเผยแผ่พระพุทธศาสนาและพัฒนาปัญญาให้ประชาชน รวบรวมหนังสือธรรมะฉบับเต็ม วิดีโอธรรมบรรยาย พอดแคสต์ และข้อคิดเตือนใจ พร้อมระบบสะสมแต้มบุญและภารกิจ Game Quest เพื่อส่งเสริมการเรียนรู้ตลอดชีวิตอย่างมีความสุข
          </div>

          <button
            onClick={() => setShowPermissionsModal(!showPermissionsModal)}
            className="shrink-0 px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
          >
            <ShieldCheck size={14} className="text-[#FEF08A]" />
            <span>ดูตารางสิทธิ์ Guest vs Member</span>
            <ChevronDown size={14} className={`transform transition-transform ${showPermissionsModal ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* 3. PERMISSIONS COMPARISON TABLE (POPUP / ACCORDION) */}
        {showPermissionsModal && (
          <div className="bg-slate-900/90 backdrop-blur-md rounded-2xl p-5 border-2 border-[#D9A441] shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-white/15 pb-2">
              <h3 className="text-sm font-extrabold text-[#FEF08A] flex items-center gap-2">
                <ShieldCheck size={16} />
                <span>ตารางเปรียบเทียบสิทธิ์การใช้งาน (Guest vs Member)</span>
              </h3>
              <button 
                onClick={() => setShowPermissionsModal(false)}
                className="text-xs text-zinc-400 hover:text-white px-2 py-0.5 rounded cursor-pointer"
              >
                ✕ ปิด
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/20 text-sky-200">
                    <th className="py-2 pr-4 font-bold">ฟังก์ชันการใช้งาน</th>
                    <th className="py-2 px-3 font-bold text-center bg-white/5 rounded-t-lg">
                      ผู้เยี่ยมชม (Guest)
                    </th>
                    <th className="py-2 px-3 font-bold text-center bg-[#D9A441]/20 text-[#FEF08A] rounded-t-lg">
                      สมาชิกห้องสมุด (Member) ⭐
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 text-sky-50">
                  <tr>
                    <td className="py-2 pr-4">เข้าชมหน้าแนะนำ และค้นหาสื่อทั้งหมด</td>
                    <td className="py-2 px-3 text-center bg-white/5 font-bold text-emerald-400">✓ ได้ทันที</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-emerald-400">✓ ได้ทันที</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">เปิดอ่านหนังสือดิจิทัล Flipbook สาธารณะ</td>
                    <td className="py-2 px-3 text-center bg-white/5 font-bold text-emerald-400">✓ ได้ทันที</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-emerald-400">✓ ได้ทันที</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">รับชมวิดีโอธรรมะ & ฟังพอดแคสต์</td>
                    <td className="py-2 px-3 text-center bg-white/5 font-bold text-emerald-400">✓ ได้ทันที</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-emerald-400">✓ ได้ทันที</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">บันทึกหน้าที่อ่านล่าสุด (ข้ามอุปกรณ์)</td>
                    <td className="py-2 px-3 text-center bg-white/5 text-zinc-400">✕ เฉพาะในเครื่อง</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-emerald-400">✓ บันทึกลงระบบ</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">สะสมคะแนนจากการอ่าน / ดู / ฟัง (5 P ทุก 10 หน้า/10 นาที)</td>
                    <td className="py-2 px-3 text-center bg-white/5 text-zinc-400">✕ ต้องเป็นสมาชิก</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-[#FEF08A]">✓ รับคะแนนสะสมจริง</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">ระบบสุ่มภารกิจ Game Quest ประจำวัน</td>
                    <td className="py-2 px-3 text-center bg-white/5 text-zinc-400">✕ ต้องเป็นสมาชิก</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-[#FEF08A]">✓ รับเควสสุ่มและโบนัส</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium">นำคะแนนไปแลกหนังสือเล่มจริงและของรางวัล</td>
                    <td className="py-2 px-3 text-center bg-white/5 text-zinc-400">✕ ต้องเป็นสมาชิก</td>
                    <td className="py-2 px-3 text-center bg-[#D9A441]/10 font-bold text-[#FEF08A]">✓ แลกของรางวัลจัดส่งฟรี</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <p className="text-[11px] text-sky-200/80 italic text-center pt-1">
              * ผู้เยี่ยมชม (Guest) สามารถเพลิดเพลินกับการศึกษาธรรมะได้ทันทีโดยไม่ถูกบังคับให้ Login
            </p>
          </div>
        )}

        {/* 4. THE 3 PRIMARY ACTION BUTTONS (CORE REQUIREMENT) */}
        <div className="pt-2 pb-1">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3.5 max-w-3xl mx-auto">
            
            {/* Button 1: Login */}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="flex-1 py-3 px-5 rounded-2xl bg-[#073B65] hover:bg-[#052845] border border-sky-300/40 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-sky-900/40 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <LogIn size={18} className="text-sky-300" />
                <span>เข้าสู่ระบบสมาชิก</span>
              </Link>
            )}

            {/* Button 2: Register */}
            {!isAuthenticated ? (
              <Link
                href="/login?tab=register"
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#D9A441] via-amber-500 to-[#B88328] hover:from-amber-600 hover:to-amber-700 text-[#073B65] font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Sparkles size={18} className="text-[#073B65]" />
                <span>สมัครสมาชิกใหม่</span>
              </Link>
            ) : (
              <Link
                href="/dashboard"
                className="flex-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-[#D9A441] via-amber-500 to-[#B88328] hover:from-amber-600 hover:to-amber-700 text-[#073B65] font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl hover:shadow-amber-500/30 transition-all hover:scale-102 active:scale-98 cursor-pointer"
              >
                <Award size={18} className="text-[#073B65]" />
                <span>เข้าสู่แดชบอร์ดสมาชิก</span>
              </Link>
            )}

            {/* Button 3: Explore as Guest */}
            <button
              onClick={handleExploreGuest}
              className="flex-1 py-3 px-5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Compass size={18} className="text-[#FEF08A]" />
              <span>เข้าใช้งานแบบ Guest</span>
              <ArrowDown size={16} className="text-sky-200 animate-bounce" />
            </button>

          </div>

          <div className="text-center mt-2">
            <span className="text-[11px] text-sky-200 font-medium">
              💡 ไม่บังคับล็อกอิน • บุคคลทั่วไปเข้าอ่านหนังสือ ดูวิดีโอ และฟังพอดแคสต์ได้ฟรีทันที
            </span>
          </div>
        </div>

        {/* 5. 4 SERVICE PILLARS PREVIEW CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
          
          {/* Card 1: Books */}
          <Link
            href="/books"
            className="group p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-sky-500/30 border border-sky-300/40 flex items-center justify-center text-sky-200 mb-2.5 group-hover:scale-110 transition-transform">
                <BookOpen size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-[#FEF08A] transition-colors">
                คลังหนังสือดิจิทัล
              </h4>
              <p className="text-[11px] text-sky-100/90 mt-1 line-clamp-2">
                อ่านหนังสือธรรมะกว่า 40 เล่ม พลิกหน้า 2 หน้าคู่เสมือนจริง พร้อมสารบัญ
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-sky-300 group-hover:text-white">
              <span>เปิดคลังหนังสือ</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 2: Videos */}
          <Link
            href="/videos"
            className="group p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-rose-500/30 border border-rose-300/40 flex items-center justify-center text-rose-200 mb-2.5 group-hover:scale-110 transition-transform">
                <Video size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-[#FEF08A] transition-colors">
                วิดีโอธรรมบรรยาย
              </h4>
              <p className="text-[11px] text-sky-100/90 mt-1 line-clamp-2">
                สื่อวิดีโอคมชัด พร้อม AI ถอดเสียงกระโดดตามเวลา และสะสมแต้มทุก 10 นาที
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-sky-300 group-hover:text-white">
              <span>ชมวิดีโอธรรมะ</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 3: Podcasts */}
          <Link
            href="/audios"
            className="group p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-purple-500/30 border border-purple-300/40 flex items-center justify-center text-purple-200 mb-2.5 group-hover:scale-110 transition-transform">
                <Headphones size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-[#FEF08A] transition-colors">
                พอดแคสต์ & หนังสือเสียง
              </h4>
              <p className="text-[11px] text-sky-100/90 mt-1 line-clamp-2">
                ฟังธรรมะสบายใจทุกที่ทุกเวลา บันทึกประวัติและรับคะแนนทุก 10 นาที
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-sky-300 group-hover:text-white">
              <span>ฟังพอดแคสต์</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

          {/* Card 4: Quests & Rewards */}
          <Link
            href="/rewards"
            className="group p-3.5 sm:p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 hover:border-white/40 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/30 border border-amber-300/40 flex items-center justify-center text-amber-200 mb-2.5 group-hover:scale-110 transition-transform">
                <Gift size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-white group-hover:text-[#FEF08A] transition-colors">
                เควส & ร้านแลกรางวัล
              </h4>
              <p className="text-[11px] text-sky-100/90 mt-1 line-clamp-2">
                สะสมแต้มบุญจากการศึกษาธรรมะ แลกหนังสือเล่มจริงและของที่ระลึก 21 ชิ้น
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-bold text-sky-300 group-hover:text-white">
              <span>เข้าร้านแลกรางวัล</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </Link>

        </div>

      </div>

      {/* Anchor for Guest Scroll */}
      <div id="public-catalog-start" />
    </section>
  );
}

