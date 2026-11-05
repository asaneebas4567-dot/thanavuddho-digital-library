'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Eye, BookOpen } from 'lucide-react';
import { Book } from '@/types';

export type CategoryShelfTheme = 
  | 'peach' 
  | 'cream' 
  | 'mint' 
  | 'sage' 
  | 'gold' 
  | 'rose' 
  | 'sky' 
  | 'slate';

export interface ShelfThemeConfig {
  containerBg: string;      // section container background
  containerBorder: string;  // delicate card border
  iconBg: string;           // icon wrapper bg & text
  viewAllColor: string;     // "ดูทั้งหมด >" text color
  badgeColor: string;       // small badge
  arrowHover: string;       // nav arrows hover state
  glowColor: string;        // hover glow
}

export const SHELF_THEMES: Record<CategoryShelfTheme, ShelfThemeConfig> = {
  // สุขภาพและครอบครัว: ครีม ส้มอ่อน หรือพีช
  peach: {
    containerBg: 'bg-amber-50/70',
    containerBorder: 'border-amber-200/90',
    iconBg: 'bg-amber-100/90 text-amber-800 border border-amber-200/90',
    viewAllColor: 'text-amber-800 hover:text-amber-950',
    badgeColor: 'bg-amber-100/90 text-amber-800 border-amber-200/90',
    arrowHover: 'hover:bg-amber-500 hover:text-white hover:border-amber-500',
    glowColor: 'hover:shadow-amber-100/50',
  },
  cream: {
    containerBg: 'bg-orange-50/65',
    containerBorder: 'border-orange-200/90',
    iconBg: 'bg-orange-100/90 text-orange-800 border border-orange-200/90',
    viewAllColor: 'text-orange-800 hover:text-orange-950',
    badgeColor: 'bg-orange-100/90 text-orange-800 border-orange-200/90',
    arrowHover: 'hover:bg-orange-500 hover:text-white hover:border-orange-500',
    glowColor: 'hover:shadow-orange-100/50',
  },
  // ปรัชญาและวิทยาการ: เขียวมิ้นต์
  mint: {
    containerBg: 'bg-emerald-50/70',
    containerBorder: 'border-emerald-200/90',
    iconBg: 'bg-emerald-100/90 text-emerald-800 border border-emerald-200/90',
    viewAllColor: 'text-emerald-800 hover:text-emerald-950',
    badgeColor: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/90',
    arrowHover: 'hover:bg-emerald-500 hover:text-white hover:border-emerald-500',
    glowColor: 'hover:shadow-emerald-100/50',
  },
  // ธรรมะและการปฏิบัติ: เขียวอ่อนหรือทองอ่อน
  sage: {
    containerBg: 'bg-teal-50/70',
    containerBorder: 'border-teal-200/90',
    iconBg: 'bg-teal-100/90 text-teal-800 border border-teal-200/90',
    viewAllColor: 'text-teal-800 hover:text-teal-950',
    badgeColor: 'bg-teal-100/90 text-teal-800 border-teal-200/90',
    arrowHover: 'hover:bg-teal-500 hover:text-white hover:border-teal-500',
    glowColor: 'hover:shadow-teal-100/50',
  },
  gold: {
    containerBg: 'bg-yellow-50/60',
    containerBorder: 'border-yellow-200/90',
    iconBg: 'bg-yellow-100/90 text-yellow-900 border border-yellow-200/90',
    viewAllColor: 'text-yellow-800 hover:text-yellow-950',
    badgeColor: 'bg-yellow-100/90 text-yellow-900 border-yellow-200/90',
    arrowHover: 'hover:bg-yellow-500 hover:text-white hover:border-yellow-500',
    glowColor: 'hover:shadow-yellow-100/50',
  },
  // หนังสือแนะนำ / ลิขสิทธิ์: ชมพูอ่อน หรือ แดงกุหลาบอ่อน
  rose: {
    containerBg: 'bg-rose-50/70',
    containerBorder: 'border-rose-200/90',
    iconBg: 'bg-rose-100/90 text-rose-800 border border-rose-200/90',
    viewAllColor: 'text-rose-800 hover:text-rose-950',
    badgeColor: 'bg-rose-100/90 text-rose-800 border-rose-200/90',
    arrowHover: 'hover:bg-rose-500 hover:text-white hover:border-rose-500',
    glowColor: 'hover:shadow-rose-100/50',
  },
  // การทำงานและความสำเร็จ: ฟ้าอ่อน
  sky: {
    containerBg: 'bg-sky-50/70',
    containerBorder: 'border-sky-200/90',
    iconBg: 'bg-sky-100/90 text-sky-800 border border-sky-200/90',
    viewAllColor: 'text-sky-800 hover:text-sky-950',
    badgeColor: 'bg-sky-100/90 text-sky-800 border-sky-200/90',
    arrowHover: 'hover:bg-sky-500 hover:text-white hover:border-sky-500',
    glowColor: 'hover:shadow-sky-100/50',
  },
  // ห้องเรียนอารยธรรม: สีกรมท่าอ่อน / Slate
  slate: {
    containerBg: 'bg-slate-50/80',
    containerBorder: 'border-slate-200',
    iconBg: 'bg-indigo-100/90 text-indigo-800 border border-indigo-200/90',
    viewAllColor: 'text-indigo-800 hover:text-indigo-950',
    badgeColor: 'bg-indigo-100/90 text-indigo-800 border-indigo-200/90',
    arrowHover: 'hover:bg-indigo-500 hover:text-white hover:border-indigo-500',
    glowColor: 'hover:shadow-indigo-100/50',
  },
};

interface ScrollableBookRowProps {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  books: Book[];
  icon?: React.ReactNode;
  categoryTheme?: CategoryShelfTheme;
  onQuickView?: (book: Book) => void;
}

function BookCoverItem({ 
  book, 
  onQuickView 
}: { 
  book: Book; 
  onQuickView?: (book: Book) => void;
}) {
  const [imageError, setImageError] = useState(false);

  let rawCover = book.cover_image || (book as any).cover;
  if (book.id?.startsWith('pubhtml5_')) {
    rawCover = `/images/books/pubhtml5/${book.id}.jpg`;
  }
  const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg' && !imageError;
  const coverUrl = rawCover ? encodeURI(rawCover) : '/images/books/book-placeholder.jpg';

  const readCount = book.read_count ?? book.view_count ?? 0;
  const pages = book.page_count ?? (book as any).pages ?? null;
  const authorName = book.author_id === 'author_001' || !book.author_id 
    ? 'พระครูปลัดสุวัฒนโพธิคุณ' 
    : ((book as any).author || 'พระครูปลัดสุวัฒนโพธิคุณ');

  return (
    <div 
      className="shrink-0 w-[145px] sm:w-[160px] md:w-[172px] group/card cursor-pointer select-none"
      onClick={() => onQuickView ? onQuickView(book) : undefined}
    >
      {/* 1. Book Poster with 3D Spine and Polite Lift */}
      <div className="relative aspect-[1/1.42] w-full rounded-xl overflow-hidden bg-white shadow-[2px_4px_12px_rgba(0,0,0,0.10)] border border-slate-200/90 group-hover/card:border-amber-400 group-hover/card:shadow-[3px_8px_18px_rgba(0,0,0,0.16)] group-hover/card:-translate-y-1.5 transition-all duration-300">
        
        {/* Book Spine 3D Highlight Line on Left */}
        <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
        
        {/* Right Edge Page-stack Simulation */}
        <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />

        {/* Cover Image */}
        {hasCover ? (
          <Image 
            src={coverUrl} 
            alt={`ปกหนังสือ ${book.title}`}
            fill
            className="object-cover group-hover/card:scale-103 transition-transform duration-300"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200 p-3 flex flex-col justify-between text-center">
            <span className="text-[9px] font-bold text-amber-800">ธรรมบรรณาการ</span>
            <p className="text-xs font-black text-slate-800 line-clamp-3 leading-snug">{book.title}</p>
            <span className="text-[8px] font-medium text-slate-600">{authorName}</span>
          </div>
        )}

        {/* Copyright Badge on Cover */}
        {(book.is_copyright || book.copyright_status === 'approved' || (book as any).copyright_notice) && (
          <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[8px] leading-none px-2 py-0.5 rounded-full shadow-md tracking-wider z-20 select-none border border-red-300/80 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>ลิขสิทธิ์</span>
          </div>
        )}

        {/* Hover Quick-Action Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center p-2 z-20">
          <Link
            href={`/reader/${book.id}`}
            onClick={(e) => e.stopPropagation()}
            className="px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[11px] shadow-lg flex items-center gap-1.5 hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all"
          >
            <BookOpen size={12} />
            <span>เปิดอ่าน</span>
          </Link>
        </div>

      </div>

      {/* 2. Book Metadata Under Poster */}
      <div className="mt-2 px-0.5">
        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-0.5">
          {pages ? (
            <span className="font-semibold text-slate-600">{pages} หน้า</span>
          ) : (
            <span className="text-[10px] text-slate-400">ฉบับดิจิทัล</span>
          )}
          {readCount > 0 && (
            <span className="flex items-center gap-0.5 text-slate-400 text-[10px]">
              <Eye size={11} /> {readCount.toLocaleString()}
            </span>
          )}
        </div>

        {/* Book Title (2 lines clamp, high contrast) */}
        <h3 
          className="font-bold text-xs sm:text-[13px] text-slate-900 line-clamp-2 leading-snug min-h-[2.2rem] group-hover/card:text-amber-700 transition-colors"
          title={book.title}
        >
          {book.title}
        </h3>
        
        {/* Author Name */}
        <p className="text-[11px] text-slate-500 truncate mt-0.5">
          {authorName}
        </p>
      </div>

    </div>
  );
}

export default function ScrollableBookRow({
  title,
  subtitle,
  viewAllHref = '/books',
  books,
  icon,
  categoryTheme = 'peach',
  onQuickView,
}: ScrollableBookRowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const theme = SHELF_THEMES[categoryTheme] || SHELF_THEMES.peach;

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [books]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!books || books.length === 0) return null;

  return (
    <div className={`rounded-3xl p-4 sm:p-6 border ${theme.containerBorder} ${theme.containerBg} shadow-2xs transition-all relative group/row`}>
      
      {/* 1. Category Header: Icon + Title + Subtitle on Left, 'ดูทั้งหมด >' on Right */}
      <div className="flex items-center justify-between gap-3 mb-4 px-0.5">
        
        {/* Left: Icon & Category Names */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {icon && (
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 font-bold shadow-2xs ${theme.iconBg}`}>
              {icon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2 truncate">
              <span>{title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block ${theme.badgeColor}`}>
                {books.length} เล่ม
              </span>
            </h2>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: "ดูทั้งหมด" Button */}
        <Link 
          href={viewAllHref}
          className={`text-xs sm:text-sm font-bold flex items-center gap-1 shrink-0 transition-colors group/link cursor-pointer px-3 py-1.5 rounded-full bg-white/80 hover:bg-white border border-slate-200/60 shadow-2xs ${theme.viewAllColor}`}
        >
          <span>ดูทั้งหมด</span>
          <ChevronRight size={15} className="transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </div>

      {/* 2. Scrollable Poster Track with Floating Left/Right Arrows */}
      <div className="relative">
        
        {/* Left Scroll Button */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className={`absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center ${theme.arrowHover} hover:scale-105 active:scale-95 transition-all cursor-pointer`}
            title="เลื่อนไปทางซ้าย"
            aria-label="ก่อนหน้า"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        {/* Books Poster Track */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-3.5 sm:gap-4 md:gap-5 overflow-x-auto pb-2 pt-1 px-1 scrollbar-hide scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {books.map((book) => (
            <BookCoverItem
              key={book.id}
              book={book}
              onQuickView={onQuickView}
            />
          ))}
        </div>

        {/* Right Scroll Button */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className={`absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white text-slate-800 shadow-xl border border-slate-200 flex items-center justify-center ${theme.arrowHover} hover:scale-105 active:scale-95 transition-all cursor-pointer`}
            title="เลื่อนไปทางขวา"
            aria-label="ถัดไป"
          >
            <ChevronRight size={18} />
          </button>
        )}

      </div>

    </div>
  );
}
