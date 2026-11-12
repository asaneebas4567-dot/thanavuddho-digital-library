'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Flame, Eye, Star, BookOpen, Crown, Sparkles, TrendingUp } from 'lucide-react';
import { Book } from '@/types';

interface WebtoonRankingShelfProps {
  books: Book[];
  onSelectBook: (book: Book) => void;
}

export default function WebtoonRankingShelf({ books, onSelectBook }: WebtoonRankingShelfProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mind' | 'family' | 'work'>('all');

  // Curate 5 distinct, colorful books for 'all' tab so they don't look repetitive or monotone
  const topCuratedIds = [
    'book_tam_jai_hai_prom_buak',           // ทำใจให้พร้อมบวก
    'book_khao_kor_sook_rao_kor_sook',     // เขาก็สุข เราก็สุข
    'book_อย่ามโน',                        // อย่ามโน
    'book_สมดุลเท่ากับดี',                   // สมดุลเท่ากับดี
    'book_ความสุข-360-องศา',                 // ความสุข 360 องศา
    'book_mongkol_chiwit_124',             // มงคลชีวิต
  ];

  // Pick target IDs based on active tab
  let targetIds = topCuratedIds;
  if (activeTab === 'family') {
    targetIds = ['book_ความลับของความรัก', 'book_ความรักรสอูมามิ', 'book_secret_of_love_rak_look_yang_rai', 'book_the_lover_rak_pen_ja_hen_jai', 'book_rak_thae_mai_dai_mee_khae_nai_niyai'];
  } else if (activeTab === 'mind') {
    targetIds = ['book_tam_jai_hai_prom_buak', 'book_khao_kor_sook_rao_kor_sook', 'book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น', 'book_perfectionist-สไตล์พุทธะ', 'book_อย่ามโน'];
  } else if (activeTab === 'work') {
    targetIds = ['book_สมดุลเท่ากับดี', 'book_ตามหลวงพี่ไปโกอินเตอร์', 'book_เส้นทางพระบรมฯ', 'book_mongkol_chiwit_124', 'book_yoo_sook_nai_yook_digital'];
  }

  // Deduplicate books to ensure unique items
  const uniqueMap = new Map<string, Book>();
  books.forEach((b) => {
    if (!uniqueMap.has(b.id)) {
      uniqueMap.set(b.id, b);
    }
  });

  const displayBooks: Book[] = targetIds
    .map(id => uniqueMap.get(id))
    .filter(Boolean)
    .slice(0, 5) as Book[];

  // Colorful Rank Badges (Gold for #1, Navy for #2, Sky Blue for #3)
  const rankBadges = [
    { rank: '1', badge: 'bg-gradient-to-br from-[#D9A441] to-[#B88328] text-white font-black shadow-[#D9A441]/30', crown: true },
    { rank: '2', badge: 'bg-gradient-to-br from-[#073B65] to-[#0A4D82] text-white font-black shadow-[#073B65]/30', crown: false },
    { rank: '3', badge: 'bg-gradient-to-br from-[#079FE8] to-[#0588c7] text-white font-black shadow-[#079FE8]/30', crown: false },
    { rank: '4', badge: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white font-black shadow-emerald-400/30', crown: false },
    { rank: '5', badge: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white font-black shadow-purple-400/30', crown: false },
  ];

  return (
    <section className="w-full bg-white py-2">
      
      {/* Header & Genre Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-[#073B65] tracking-tight">
            จัดอันดับหนังสือยอดนิยม (Weekly TOP 5)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5">
            คัดเลือกหนังสือที่มีผู้อ่านและศึกษาต่อเนื่องสูงสุด พร้อมสีสันและภาพปกคุณภาพสูง
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'ยอดนิยมทั้งหมด' },
            { id: 'mind', label: 'จิตวิทยา & สมาธิ' },
            { id: 'family', label: 'ครอบครัว & ความรัก' },
            { id: 'work', label: 'การงาน & ความสำเร็จ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#073B65] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5-Card Ranking Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
        {displayBooks.map((book, index) => {
          const rawCover = book.cover_image || (book as any).cover;
          const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg';
          const cleanCover = rawCover?.startsWith('http://online.pubhtml5.com')
            ? rawCover.replace('http://', 'https://')
            : rawCover;
          const coverUrl = cleanCover ? encodeURI(decodeURI(cleanCover)) : '';

          const readCount = book.read_count ?? book.view_count ?? 1200;
          const pages = book.page_count ?? (book as any).pages ?? 120;
          const badge = rankBadges[index] || rankBadges[0];

          return (
            <div
              key={book.id}
              className="group relative flex sm:flex-col items-center sm:items-start bg-white hover:bg-slate-50/50 rounded-xl p-2 sm:p-2.5 transition-all duration-300 cursor-pointer"
              onClick={() => onSelectBook(book)}
            >
              {/* Cover with Rank Overlay */}
              <div className="relative shrink-0 w-20 sm:w-full aspect-[1/1.42] rounded-xl overflow-hidden bg-slate-100 ring-1 ring-black/5 shadow-sm group-hover:shadow-md transition-shadow">
                {hasCover ? (
                  <Image
                    src={coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 p-3 text-white flex flex-col justify-between text-center select-none">
                    <span className="text-[8px] uppercase tracking-wider text-amber-300 font-serif">ธรรมบรรณาการ</span>
                    <p className="text-[11px] font-bold line-clamp-3 text-white">{book.title}</p>
                    <span className="text-[7px] text-gray-300">พระครูปลัดสุวัฒนโพธิคุณ</span>
                  </div>
                )}

                {/* Rank Number Badge with Distinct Colors */}
                <div className={`absolute top-1.5 left-1.5 w-7 h-7 rounded-lg flex items-center justify-center text-xs shadow-md ${badge.badge}`}>
                  {badge.crown ? (
                    <span className="flex items-center gap-0.5">
                      <Crown size={11} className="text-amber-950 fill-current" />
                      1
                    </span>
                  ) : (
                    <span>{badge.rank}</span>
                  )}
                </div>

                {/* Copyright Badge */}
                {(book.is_copyright || book.copyright_status === 'approved' || (book as any).copyright_notice) && (
                  <div className="absolute top-1.5 right-1.5 bg-rose-700/90 text-white font-semibold text-[8px] leading-none px-1.5 py-0.5 rounded shadow-xs z-20 select-none">
                    ลิขสิทธิ์
                  </div>
                )}

                {/* Hover Quick Preview Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                  <span className="px-3 py-1.5 rounded-full bg-white text-gray-900 font-bold text-xs shadow-md flex items-center gap-1.5 hover:bg-slate-100 active:scale-95">
                    <BookOpen size={13} className="text-sky-600" /> 
                    <span>ดูตัวอย่าง</span>
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="ml-3 sm:ml-0 sm:mt-3 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-medium mb-1">
                  <span className="text-slate-800 font-semibold">{pages} หน้า</span>
                  <span>•</span>
                  <span className="flex items-center gap-0.5 text-gray-500">
                    <Eye size={11} /> {readCount.toLocaleString()}
                  </span>
                </div>

                <h3 className="font-bold text-xs sm:text-[13px] text-gray-900 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
                  {book.title}
                </h3>

                <p className="text-[11px] text-gray-500 truncate mt-1">
                  พระครูปลัดสุวัฒนโพธิคุณ
                </p>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
