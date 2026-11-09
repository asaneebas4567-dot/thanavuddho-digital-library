'use client';

import React from 'react';
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
  ShieldCheck, 
  Award, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Heart,
  Globe,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/layout/Navbar';

export default function WelcomePage() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-[#F0F8FD] flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-800 hover:text-sky-950 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับหน้าแรกห้องสมุดดิจิทัล</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white p-6 sm:p-10 shadow-2xl border-4 border-[#D9A441]">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/15 border border-white/20 text-[#FEF08A] text-xs font-black uppercase">
              <Sparkles size={13} className="text-[#D9A441]" />
              <span>ยินดีต้อนรับสู่ Thanavuddho Digital Library</span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              คลังปัญญาธรรมะดิจิทัล<br />
              <span className="text-[#FEF08A]">พระครูปลัดสุวัฒนโพธิคุณ</span>
            </h1>

            <p className="text-xs sm:text-base text-sky-50 leading-relaxed font-medium pt-1">
              โครงการห้องสมุดดิจิทัลและระบบส่งเสริมการศึกษาธรรมะตลอดชีวิต รวบรวมผลงานหนังสือธรรมะฉบับเต็ม วิดีโอธรรมบรรยาย พอดแคสต์ พร้อมระบบสะสมแต้มบุญและของรางวัลที่ระลึกมงคล
            </p>

            {/* The 3 Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    href="/login"
                    className="px-6 py-3.5 rounded-2xl bg-white text-[#073B65] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-sky-50 transition-all hover:scale-102"
                  >
                    <LogIn size={18} className="text-[#073B65]" />
                    <span>เข้าสู่ระบบสมาชิก</span>
                  </Link>

                  <Link
                    href="/login?tab=register"
                    className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#D9A441] to-amber-500 text-[#073B65] font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:from-amber-500 hover:to-amber-600 transition-all hover:scale-102"
                  >
                    <Sparkles size={18} />
                    <span>สมัครสมาชิกใหม่ (ฟรี)</span>
                  </Link>

                  <Link
                    href="/"
                    className="px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 border border-white/40 text-white font-extrabold text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-all hover:scale-102"
                  >
                    <Compass size={18} className="text-[#FEF08A]" />
                    <span>เข้าชมแบบ Guest</span>
                  </Link>
                </>
              ) : (
                <Link
                  href="/"
                  className="px-6 py-3.5 rounded-2xl bg-[#D9A441] text-[#073B65] font-black text-sm flex items-center justify-center gap-2 shadow-xl hover:bg-amber-400 transition-all hover:scale-102"
                >
                  <BookOpen size={18} />
                  <span>เข้าสู่ห้องสมุดดิจิทัล</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Monastic Author Bio */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-100 shadow-sm flex flex-col md:flex-row items-center gap-6">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-sky-200 shadow-md">
            <Image
              src="/images/books/tam-jai-hai-prom-buak.jpg"
              alt="พระครูปลัดสุวัฒนโพธิคุณ"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
              ประธานศูนย์เผยแผ่ธรรมะเพื่อประชาชน
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ, M.D., Ph.D.)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              พระมหาเถระผู้ทรงภูมิรู้ทั้งทางโลกและทางธรรม สำเร็จการศึกษาแพทยศาสตรบัณฑิต จุฬาลงกรณ์มหาวิทยาลัย และปริญญาเอกด้านพุทธศาสตร์จากมหาวิทยาลัยโตเกียว ประเทศญี่ปุ่น อุทิศตนเผยแผ่หลักธรรมคำสอนและพัฒนาปัญญาให้แก่เยาวชนและประชาชนทั่วโลก
            </p>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Award className="text-[#D9A441]" size={20} />
            <span>บริการหลัก 4 ระบบใน Thanavuddho Digital Library</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1. Books */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-sky-300 transition-colors space-y-2">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <BookOpen size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">1. คลังหนังสือดิจิทัล & Flipbook Reader</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                อ่านหนังสือธรรมะกว่า 40 เล่ม จำลองการเปิดหน้าคู่ 2 หน้าเสมือนจริง พร้อมระบบจดจำหน้าที่อ่าน สะสมคะแนน 5 แต้มทุก ๆ 10 หน้า
              </p>
              <Link href="/books" className="inline-flex items-center gap-1 text-xs font-bold text-sky-700 hover:underline pt-1">
                <span>เปิดอ่านคลังหนังสือ</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* 2. Videos */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-rose-300 transition-colors space-y-2">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
                <Video size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">2. คลังสื่อวิดีโอธรรมบรรยาย</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                วิดีโอธรรมะ Full HD พร้อมระบบ AI ถอดเสียงบรรยายธรรม กระโดดตามเวลาที่ต้องการ และสะสมคะแนน 5 แต้มเมื่อรับชมครบทุก 10 นาที
              </p>
              <Link href="/videos" className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 hover:underline pt-1">
                <span>ชมวิดีโอธรรมะ</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* 3. Podcasts */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-colors space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Headphones size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">3. พอดแคสต์ & หนังสือเสียง</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ฟังธรรมะยามเช้าหรือก่อนนอน พอดแคสต์ซีรีส์ "ทำใจให้พร้อมบวก" และเสียงธรรมบรรยาย สะสมคะแนน 5 แต้มเมื่อฟังครบทุก 10 นาที
              </p>
              <Link href="/audios" className="inline-flex items-center gap-1 text-xs font-bold text-purple-700 hover:underline pt-1">
                <span>ฟังพอดแคสต์</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            {/* 4. Rewards */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-amber-300 transition-colors space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                <Gift size={20} />
              </div>
              <h4 className="font-extrabold text-sm text-slate-900">4. เควสทางปัญญา & ร้านแลกรางวัล</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                ทำภารกิจศึกษาธรรมะประจำวัน สะสมแต้มบุญบารมี แล้วนำคะแนนมาแลกหนังสือเล่มจริง กล่อง Boxset ที่ระลึก และของรางวัลจัดส่งถึงบ้าน
              </p>
              <Link href="/rewards" className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline pt-1">
                <span>สำรวจร้านรางวัล</span>
                <ArrowRight size={13} />
              </Link>
            </div>

          </div>
        </div>

        {/* Permissions Table */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-sky-600" size={18} />
              <span>เปรียบเทียบสิทธิ์: ผู้เยี่ยมชม (Guest) vs สมาชิก (Member)</span>
            </h3>
            <span className="text-[11px] font-bold text-slate-500">
              ไม่บังคับล็อกอินเพื่อเข้าชม
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="py-2.5 pr-4 font-bold">สิทธิประโยชน์</th>
                  <th className="py-2.5 px-3 text-center font-bold bg-slate-50 rounded-t-lg">
                    ผู้เยี่ยมชม (Guest)
                  </th>
                  <th className="py-2.5 px-3 text-center font-bold bg-amber-50 text-amber-900 rounded-t-lg">
                    สมาชิก (Member) ⭐
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 pr-4">เปิดอ่านหนังสือสาธารณะและคลังบทความ</td>
                  <td className="py-2.5 px-3 text-center bg-slate-50 font-bold text-emerald-600">✓ ได้ทันที</td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold text-emerald-600">✓ ได้ทันที</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4">ชมวิดีโอธรรมบรรยายและฟังพอดแคสต์</td>
                  <td className="py-2.5 px-3 text-center bg-slate-50 font-bold text-emerald-600">✓ ได้ทันที</td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold text-emerald-600">✓ ได้ทันที</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">บันทึกความคืบหน้าการอ่านข้ามอุปกรณ์</td>
                  <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400">✕ เฉพาะเบราว์เซอร์นี้</td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold text-emerald-600">✓ ซิงก์ลงระบบ</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">สะสมคะแนนจากการอ่าน ดู และฟัง</td>
                  <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400">✕ ต้องเป็นสมาชิก</td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold text-amber-600">✓ รับคะแนนจริง</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">สุ่มภารกิจ Game Quest ประจำวัน</td>
                  <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400">✕ ต้องเป็นสมาชิก</td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold text-amber-600">✓ รับโบนัสเควส</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-medium">แลกรับหนังสือเล่มจริงและของที่ระลึก</td>
                  <td className="py-2.5 px-3 text-center bg-slate-50 text-slate-400">✕ ต้องเป็นสมาชิก</td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/60 font-bold text-amber-600">✓ แลกของรางวัลฟรี</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
