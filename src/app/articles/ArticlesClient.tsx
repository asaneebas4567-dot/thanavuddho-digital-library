'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  Sparkles, 
  BookOpen, 
  Tag, 
  Flame, 
  Filter,
  CheckCircle2,
  Trophy,
  Bot
} from 'lucide-react';
import { Dhamma } from '@/types';
import ArticleCard from '@/components/articles/ArticleCard';

interface ArticlesClientProps {
  initialArticles: Dhamma[];
}

export default function ArticlesClient({ initialArticles }: ArticlesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'ทั้งหมด', emoji: '🌟' },
    { id: 'mind', label: 'สมาธิ & จิตวิทยา', emoji: '🧘' },
    { id: 'karma', label: 'กฎแห่งกรรม & บุญ', emoji: '⚖️' },
    { id: 'family', label: 'ความรัก & ครอบครัว', emoji: '💖' },
    { id: 'work', label: 'การทำงาน & อิทธิบาท', emoji: '🏆' },
    { id: 'video_summary', label: 'ถอดความจากวิดีโอ', emoji: '🎬' }
  ];

  const filteredArticles = useMemo(() => {
    return initialArticles.filter(art => {
      const matchSearch = searchQuery.trim() === '' || 
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.description && art.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (art.tags && art.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

      if (!matchSearch) return false;

      if (selectedCategory === 'all') return true;
      if (selectedCategory === 'mind') {
        const text = (art.title + ' ' + (art.tags || []).join(' ')).toLowerCase();
        return text.includes('สมาธิ') || text.includes('จิต') || text.includes('ใจ') || text.includes('เครียด');
      }
      if (selectedCategory === 'karma') {
        const text = (art.title + ' ' + (art.tags || []).join(' ')).toLowerCase();
        return text.includes('กรรม') || text.includes('นรก') || text.includes('บุญ') || text.includes('บาป') || text.includes('รองเท้า');
      }
      if (selectedCategory === 'family') {
        const text = (art.title + ' ' + (art.tags || []).join(' ')).toLowerCase();
        return text.includes('รัก') || text.includes('ครอบครัว') || text.includes('ลูก') || text.includes('ชีวิตคู่');
      }
      if (selectedCategory === 'work') {
        const text = (art.title + ' ' + (art.tags || []).join(' ')).toLowerCase();
        return text.includes('งาน') || text.includes('สำเร็จ') || text.includes('อิทธิบาท') || text.includes('เป้าหมาย');
      }
      if (selectedCategory === 'video_summary') {
        return art.source_type === 'video' || art.title.includes('EP') || art.title.includes('วิดีโอ');
      }

      return true;
    });
  }, [initialArticles, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full space-y-8">
        
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link 
            href="/" 
            className="inline-flex items-center text-xs font-bold text-slate-500 hover:text-sky-600 transition-colors bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs"
          >
            <ArrowLeft className="mr-1.5 w-3.5 h-3.5" /> กลับสู่หน้าหลัก
          </Link>

          <Link
            href="/chatbot"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-bold border border-sky-200 transition-colors shadow-2xs"
          >
            <Bot size={14} className="text-sky-600" />
            <span>ถาม AI เจาะลึกข้อคิดธรรมะ</span>
          </Link>
        </div>

        {/* 1. Colorful Thematic Hero Header */}
        <div className="relative rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 text-white p-6 sm:p-10 shadow-xl overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute right-32 top-0 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl">
            {/* Stickers Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-100 text-xs font-extrabold border border-white/20 mb-4 shadow-xs">
              <span className="text-base">🌿 🌸 💡 🧘</span>
              <span>คลังข้อคิดธรรมะสร้างปัญญา</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3 drop-shadow-sm">
              ข้อคิดธรรมะและมรดกคำสอน
            </h1>
            <p className="text-xs sm:text-base text-emerald-50/90 leading-relaxed font-normal mb-6">
              รวบรวมข้อคิดสัจธรรม การดับทุกข์ การทำงาน และจิตวิทยาชีวิตประยุกต์ โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.) ให้ท่านหยิบนำไปใช้ได้ทันทีในชีวิตจริง
            </p>

            {/* Search Input Bar */}
            <div className="relative max-w-md">
              <input
                type="text"
                placeholder="ค้นหาข้อคิดธรรมะ, หัวข้อ, หรือคำสำคัญ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-slate-800 placeholder-slate-400 pl-10 pr-4 py-3 rounded-2xl text-xs sm:text-sm font-bold shadow-lg focus:outline-none focus:ring-3 focus:ring-emerald-300 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md"
                >
                  ล้าง
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 2. Interactive Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 select-none">
          <span className="text-xs font-black text-slate-500 shrink-0 flex items-center gap-1 mr-1">
            <Filter size={13} className="text-emerald-600" /> หมวดหมู่:
          </span>
          {categories.map((cat) => {
            const active = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black transition-all shrink-0 cursor-pointer ${
                  active
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105 ring-2 ring-emerald-300'
                    : 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 border border-slate-200/90 shadow-2xs'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}

          <span className="ml-auto text-xs font-bold text-slate-400 hidden sm:inline-block shrink-0">
            พบ {filteredArticles.length} ข้อคิดธรรมะ
          </span>
        </div>

        {/* 3. Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredArticles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-3xl mx-auto mb-4">
              🔍
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">ไม่พบข้อคิดธรรมะที่ตรงกับคำค้นหา</h3>
            <p className="text-xs text-slate-500 mb-5">
              ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่ "ทั้งหมด" เพื่อดูข้อคิดธรรมะทั้งหมดในระบบ
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              ดูข้อคิดธรรมะทั้งหมด
            </button>
          </div>
        )}

        {/* 4. Bottom Learning CTA */}
        <div className="rounded-3xl bg-gradient-to-r from-amber-500 to-amber-600 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
              🏆
            </div>
            <div>
              <h3 className="text-lg font-black leading-tight">อ่านจบแล้ว มาประลองปัญญากัน!</h3>
              <p className="text-xs text-amber-100 mt-1">
                ทำแบบทดสอบธรรมะ สะสมคะแนน XP เลเวลอัป และปลดล็อกเหรียญตราเกียรติยศ
              </p>
            </div>
          </div>

          <Link
            href="/quiz"
            className="px-6 py-3 rounded-2xl bg-white text-amber-900 font-black text-xs sm:text-sm hover:bg-amber-50 shadow-md transition-all active:scale-95 shrink-0"
          >
            เข้าสู่แบบทดสอบ XP ปัญญาธรรม &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}

