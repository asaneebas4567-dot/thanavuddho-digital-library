'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Crown, Sparkles, TrendingUp, BookOpen, Check } from 'lucide-react';
import { Book } from '@/types';
import { useLoan } from '@/context/LoanContext';

interface WebtoonRankingShelfProps {
  books: Book[];
  onSelectBook?: (book: Book) => void;
}

export default function WebtoonRankingShelf({ books, onSelectBook }: WebtoonRankingShelfProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'mind' | 'family' | 'work'>('all');
  const [dbReadStats, setDbReadStats] = useState<Record<string, number>>({});
  const { isMediaBorrowed } = useLoan();

  // Fetch real database read stats on mount
  useEffect(() => {
    fetch('/api/books/reads')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.stats) {
          setDbReadStats(d.stats);
        }
      })
      .catch(() => {});
  }, []);

  // Deduplicate pool & merge live stats directly
  const uniqueBooks = useMemo(() => {
    const map = new Map<string, Book>();
    books.forEach((b) => {
      if (b && b.id && !map.has(b.id)) {
        const liveCount = dbReadStats[b.id] ?? b.read_count ?? b.view_count ?? 0;
        map.set(b.id, {
          ...b,
          read_count: liveCount,
          view_count: liveCount,
        });
      }
    });
    return Array.from(map.values());
  }, [books, dbReadStats]);

  // Dynamic ranking based strictly on REAL reading count from database/stats
  const rankedBooks = useMemo(() => {
    // 1. Filter by active category if not 'all'
    let filtered = uniqueBooks;
    if (activeTab === 'mind') {
      filtered = uniqueBooks.filter(b => {
        const text = `${b.title} ${b.category_id || ''} ${(b.tags || []).join(' ')}`.toLowerCase();
        return text.includes('จิต') || text.includes('สมาธิ') || text.includes('ปัญญา') || text.includes('ใจ') || text.includes('ทุกข์') || text.includes('สุข');
      });
    } else if (activeTab === 'family') {
      filtered = uniqueBooks.filter(b => {
        const text = `${b.title} ${b.category_id || ''} ${(b.tags || []).join(' ')}`.toLowerCase();
        return text.includes('รัก') || text.includes('ครอบครัว') || text.includes('ลูก') || text.includes('คู่') || text.includes('เพื่อน') || text.includes('สังคม');
      });
    } else if (activeTab === 'work') {
      filtered = uniqueBooks.filter(b => {
        const text = `${b.title} ${b.category_id || ''} ${(b.tags || []).join(' ')}`.toLowerCase();
        return text.includes('งาน') || text.includes('สำเร็จ') || text.includes('มงคล') || text.includes('สมดุล') || text.includes('ดิจิทัล') || text.includes('โลก');
      });
    }

    // 2. Sort descending strictly by real read_count (or view_count if read_count is equal/zero)
    const sorted = [...filtered].sort((a, b) => {
      const readsA = (a.read_count ?? a.view_count) || 0;
      const readsB = (b.read_count ?? b.view_count) || 0;
      if (readsB !== readsA) {
        return readsB - readsA;
      }
      // If reads are equal, prioritize books that have page count or covers
      const pagesA = a.page_count || (a as any).pages || 0;
      const pagesB = b.page_count || (b as any).pages || 0;
      return pagesB - pagesA;
    });

    // 3. Guarantee strictly 5 books always (backfill if category has fewer than 5)
    const result: Book[] = [];
    const chosenIds = new Set<string>();

    for (const b of sorted) {
      if (result.length >= 5) break;
      if (!chosenIds.has(b.id)) {
        chosenIds.add(b.id);
        result.push(b);
      }
    }

    // Backfill from general pool if needed to reach 5
    if (result.length < 5) {
      const fallbackSorted = [...uniqueBooks].sort((a, b) => {
        const readsA = (a.read_count ?? a.view_count) || 0;
        const readsB = (b.read_count ?? b.view_count) || 0;
        return readsB - readsA;
      });
      for (const b of fallbackSorted) {
        if (result.length >= 5) break;
        if (!chosenIds.has(b.id)) {
          chosenIds.add(b.id);
          result.push(b);
        }
      }
    }

    return result.slice(0, 5);
  }, [uniqueBooks, activeTab]);

  // Distinct Colorful Rank Badges
  const rankStyles = [
    { badgeBg: 'bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-white shadow-amber-500/30 ring-2 ring-amber-300/40', crown: true },
    { badgeBg: 'bg-gradient-to-br from-slate-700 via-[#073B65] to-blue-900 text-white shadow-sky-900/30', crown: false },
    { badgeBg: 'bg-gradient-to-br from-sky-400 to-[#079FE8] text-white shadow-sky-400/30', crown: false },
    { badgeBg: 'bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-teal-500/30', crown: false },
    { badgeBg: 'bg-gradient-to-br from-purple-500 to-indigo-700 text-white shadow-purple-500/30', crown: false },
  ];

  return (
    <section className="w-full bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200/70 text-[#073B65] text-xs font-bold mb-1.5">
            <TrendingUp size={13} className="text-[#079FE8]" />
            <span>สถิติการอ่านจริงประจำสัปดาห์</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-heading text-[#073B65] tracking-tight">
            จัดอันดับหนังสือยอดนิยม (Weekly TOP 5)
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-0.5 font-reading">
            จัดลำดับตามจำนวนการอ่านจริงในระบบ เรียงจากมากไปหาน้อย ครบ 5 อันดับ
          </p>
        </div>

        {/* Tab Filters (Sky Blue for Active State) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'ยอดนิยมทั้งหมด' },
            { id: 'mind', label: 'จิตวิทยา & สมาธิ' },
            { id: 'family', label: 'ครอบครัว & สังคม' },
            { id: 'work', label: 'การงาน & ความสำเร็จ' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                activeTab === tab.id
                  ? 'bg-[#079FE8] text-white shadow-xs ring-2 ring-[#079FE8]/25'
                  : 'bg-slate-100 text-slate-600 hover:bg-sky-50 hover:text-[#079FE8]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href="/books"
          className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#079FE8] hover:text-[#0588c7] transition-colors self-start sm:self-auto shrink-0"
        >
          <span>ดูทั้งหมด</span>
          <span>&rarr;</span>
        </Link>
      </div>

      {/* 5-Card Ranking Grid (Directly Clickable Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-5">
        {rankedBooks.map((book, index) => {
          const rawCover = book.cover_image || (book as any).cover;
          const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg';
          const cleanCover = rawCover?.startsWith('http://online.pubhtml5.com')
            ? rawCover.replace('http://', 'https://')
            : rawCover;
          const coverUrl = cleanCover ? encodeURI(decodeURI(cleanCover)) : '';

          // Real reading stats: strictly show real number, 0 if unread, never invent mock figures
          const realReads = (book.read_count ?? book.view_count) || 0;
          const pages = book.page_count ?? (book as any).pages ?? 0;
          const rank = rankStyles[index] || rankStyles[0];
          const isBorrowed = isMediaBorrowed(book.id);
          const targetUrl = isBorrowed ? `/reader/${book.id}` : `/books/${book.id}`;

          return (
            <Link
              key={book.id}
              href={targetUrl}
              className="group relative flex flex-col bg-white hover:bg-slate-50/70 rounded-2xl p-2.5 sm:p-3 transition-all duration-300 border border-slate-200/60 hover:border-sky-300 hover:shadow-lg hover:-translate-y-1 block"
              title={`${book.title} (คลิกเพื่อเข้าสู่หน้าหนังสือ)`}
            >
              {/* Cover Poster with 3D Spine and Rank Badge */}
              <div className="relative shrink-0 w-full aspect-[1/1.42] rounded-xl overflow-hidden bg-slate-100 shadow-[2px_4px_12px_rgba(0,0,0,0.08)] group-hover:shadow-[4px_8px_20px_rgba(7,159,232,0.18)] transition-all duration-300">
                {/* 3D Spine Highlight */}
                <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
                <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />

                {hasCover ? (
                  <Image
                    src={coverUrl}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-104 transition-transform duration-300"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-[#073B65] p-3 text-white flex flex-col justify-between text-center select-none">
                    <span className="text-[8px] uppercase tracking-wider text-amber-300 font-serif">ธรรมบรรณาการ</span>
                    <p className="text-[11px] font-bold line-clamp-3 text-white">{book.title}</p>
                    <span className="text-[7px] text-gray-300">พระครูปลัดสุวัฒนโพธิคุณ</span>
                  </div>
                )}

                {/* Status Badges: Borrowed & Copyright - ทุกเล่มขึ้นลิขสิทธิ์ */}
                <div className="absolute top-2 right-2 z-20 flex flex-col items-end gap-1 select-none">
                  {isBorrowed && (
                    <span className="bg-emerald-600/95 text-white font-bold text-[8px] px-2 py-0.5 rounded-full shadow-xs flex items-center gap-0.5">
                      <Check size={8} /> ยืมแล้ว
                    </span>
                  )}
                  <span className="bg-rose-700/90 text-white font-semibold text-[8px] px-2 py-0.5 rounded-full shadow-xs">
                    ลิขสิทธิ์
                  </span>
                </div>

                {/* Subtle Hover Action Pill Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#073B65]/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-3 z-20">
                  <span className="w-full py-1.5 rounded-xl bg-white text-[#073B65] font-bold text-[11px] shadow-md flex items-center justify-center gap-1.5">
                    <BookOpen size={13} className="text-[#079FE8]" />
                    <span>{isBorrowed ? 'เปิดอ่าน' : 'ดูรายละเอียด'}</span>
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div className="mt-2.5 flex-1 flex flex-col justify-between">
                <div>
                  {/* Rank Badge & Reads Strip (ย้ายตัวเลขอันดับออกจากหน้าปก เพื่อไม่ให้บังรูปพระอาจารย์หรือองค์ประกอบหน้าปก) */}
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-black shadow-xs ${rank.badgeBg}`}>
                      {rank.crown ? (
                        <>
                          <Crown size={11} className="text-amber-100 fill-amber-100 drop-shadow-xs" />
                          <span>อันดับ 1</span>
                        </>
                      ) : (
                        <span>อันดับ {index + 1}</span>
                      )}
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-reading">
                      <Eye size={12} className="text-[#079FE8]" />
                      <span>{realReads.toLocaleString()} อ่าน</span>
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-sm sm:text-[14px] text-slate-900 group-hover:text-[#079FE8] transition-colors line-clamp-2 leading-snug tracking-tight">
                    {book.title}
                  </h3>
                </div>

                <p className="text-[12px] text-slate-500 truncate mt-1.5 font-reading font-normal">
                  พระครูปลัดสุวัฒนโพธิคุณ
                </p>
              </div>

            </Link>
          );
        })}
      </div>

    </section>
  );
}
