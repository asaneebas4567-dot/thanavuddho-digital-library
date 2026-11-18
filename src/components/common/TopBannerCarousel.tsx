'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronLeft, 
  ChevronRight, 
  Pause, 
  Play, 
  BookOpen, 
  Headphones, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useLoan } from '@/context/LoanContext';

export interface MebBannerSlide {
  id: string;
  type: 'book' | 'podcast' | 'video' | 'survey';
  title: string;
  subtitle: string;
  quote: string;
  coverImage: string;
  badge: string;
  targetUrl: string;
  themeGradient: string; // Tailored, sophisticated, non-harsh background
  glowColor: string;
  tagColor: string;
  customBannerImage?: string; // Support for custom full-bleed banner artwork
}

export const HERO_SLIDES: MebBannerSlide[] = [
  // 1. มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า
  {
    id: 'slide-mongkol-38',
    type: 'book',
    title: 'มงคลชีวิต 38 ประการ',
    subtitle: 'ฉบับทางก้าวหน้า (433 หน้า)',
    quote: 'แผนที่ชีวิตฉบับสมบูรณ์ ก้าวแรกแห่งปัญญาสู่ความสุขแท้จริง',
    coverImage: '/images/books/mongkol-124.jpg',
    badge: '👑 อันดับ 1 ยอดนิยมสูงสุด',
    targetUrl: '/books/book_mongkol_chiwit_124',
    themeGradient: 'from-[#0B1E36] via-[#112F53] to-[#1A4270]',
    glowColor: 'bg-sky-500/15',
    tagColor: 'bg-amber-400 text-slate-950',
  },
  // 2. ทำใจให้พร้อมบวก
  {
    id: 'slide-tamjai-prombuak',
    type: 'book',
    title: 'ทำใจให้พร้อมบวก',
    subtitle: 'สร้างสุขแท้จริง เปลี่ยนวิกฤตเป็นโอกาส',
    quote: 'สูตรสำเร็จ 3 ประการ: "ยอมรับ เข้าใจ เกิดประโยชน์"',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    badge: '✨ หนังสือแนะนำประจำสัปดาห์',
    targetUrl: '/books/book_tam_jai_hai_prom_buak',
    themeGradient: 'from-[#063B2B] via-[#09563F] to-[#0E6C50]',
    glowColor: 'bg-emerald-500/15',
    tagColor: 'bg-emerald-300 text-teal-950',
  },
  // 3. อย่ามโน (อ้างอิงตามรูปตัวอย่าง อย่ามโน รักแท้มันใหญ่มาก)
  {
    id: 'slide-ya-mano',
    type: 'book',
    title: 'อย่ามโน',
    subtitle: 'รักแท้มันใหญ่มาก',
    quote: 'ดึงสติรู้เท่าทันความคิด สลายภาพลวงตาด้วยสัมมาทิฏฐิ',
    coverImage: '/images/books/อย่ามโน.jpg',
    badge: '🌸 พัฒนาจิตใจ & ฝึกสติ',
    targetUrl: '/books/book_อย่ามโน',
    themeGradient: 'from-[#421223] via-[#5C1A32] to-[#782242]',
    glowColor: 'bg-rose-500/15',
    tagColor: 'bg-pink-300 text-rose-950',
  },
  // 4. สมดุลเท่ากับดี
  {
    id: 'slide-samdun-dee',
    type: 'book',
    title: 'สมดุลเท่ากับดี',
    subtitle: 'มัชฌิมาปฏิปทา กาย-ใจ-งาน',
    quote: 'สร้างความสำเร็จอย่างยั่งยืน ไม่ตึงจนท้อ ไม่หย่อนจนทิ้ง',
    coverImage: '/images/books/สมดุลเท่ากับดี.jpg',
    badge: '🌿 การทำงาน & ความสำเร็จ',
    targetUrl: '/books/book_สมดุลเท่ากับดี',
    themeGradient: 'from-[#0E3854] via-[#144F75] to-[#1B6494]',
    glowColor: 'bg-cyan-500/15',
    tagColor: 'bg-cyan-300 text-slate-950',
  },
  // 5. อยู่สุขในยุคดิจิทัล
  {
    id: 'slide-yoo-sook-digital',
    type: 'book',
    title: 'อยู่สุขในยุคดิจิทัล',
    subtitle: 'ศิลปะการรับมือผู้คนบนโลกออนไลน์',
    quote: 'เรียนรู้และสร้างภูมิคุ้มกันใจ ใช้ออนไลน์อย่างมีความสุข',
    coverImage: '/images/books/yoo-sook-nai-yook-digital.jpg',
    badge: '📱 วิถีชีวิตดิจิทัล & เควสต์สะสมแต้ม',
    targetUrl: '/books/book_อยู่สุขในยุคดิจิทัล',
    themeGradient: 'from-[#172554] via-[#1E3A8A] to-[#2563EB]',
    glowColor: 'bg-blue-500/15',
    tagColor: 'bg-sky-300 text-blue-950',
  },
  // 6. ความสุข 360 องศา
  {
    id: 'slide-happiness-360',
    type: 'book',
    title: 'ความสุข 360 องศา',
    subtitle: 'กะเทาะเปลือกความทุกข์สู่แก่นแท้',
    quote: 'ค้นพบความสุขรอบตัวที่ยั่งยืนจากภายในในทุกมิติของชีวิต',
    coverImage: '/images/books/ความสุข-360-องศา.jpg',
    badge: '☀️ ค้นหาความสุขแท้',
    targetUrl: '/books/book_ความสุข-360-องศา',
    themeGradient: 'from-[#522504] via-[#753607] to-[#994709]',
    glowColor: 'bg-amber-500/15',
    tagColor: 'bg-amber-300 text-amber-950',
  },
  // 7. เขาก็สุข เราก็สุข
  {
    id: 'slide-khao-suk-rao-suk',
    type: 'book',
    title: 'เขาก็สุข เราก็สุข',
    subtitle: 'ศิลปะป้องกันใจ สร้างสัมพันธ์งดงาม',
    quote: 'เปลี่ยนศัตรูให้เป็นมิตร อยู่ร่วมกับผู้อื่นอย่างสันติสุข',
    coverImage: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    badge: '🤝 มิตรภาพ & สังคม',
    targetUrl: '/books/book_khao_kor_sook_rao_kor_sook',
    themeGradient: 'from-[#2E1045] via-[#451866] to-[#5C2087]',
    glowColor: 'bg-purple-500/15',
    tagColor: 'bg-purple-200 text-purple-950',
  }
];

interface TopBannerCarouselProps {
  autoPlayIntervalMs?: number;
}

export default function TopBannerCarousel({ autoPlayIntervalMs = 7000 }: TopBannerCarouselProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const { isMediaBorrowed } = useLoan();

  const total = HERO_SLIDES.length;

  // Responsive items per page: 3 on desktop, 2 on tablet, 1 on mobile
  useEffect(() => {
    const handleResize = () => {
      if (typeof window === 'undefined') return;
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, total - visibleCount);

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  }, [maxIndex]);

  // Autoplay
  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayIntervalMs);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextSlide, autoPlayIntervalMs]);

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diff = touchStartXRef.current - touchEndXRef.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section 
      className="w-full bg-gradient-to-b from-slate-100/90 via-slate-50 to-slate-50/50 pt-3 sm:pt-4 pb-4 sm:pb-6 border-b border-slate-200/60 select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="ไฮไลต์หนังสือและสื่อเด่นประจำสัปดาห์"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CAROUSEL STAGE CONTAINER (MEB Multi-Card Slider) */}
        <div className="relative group/carousel">
          
          {/* TRACK VIEWPORT */}
          <div 
            className="overflow-hidden rounded-2xl"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / visibleCount)}%)`,
              }}
            >
              {HERO_SLIDES.map((slide, idx) => {
                const isBorrowed = slide.type === 'book' && isMediaBorrowed(slide.targetUrl.replace('/books/', ''));
                const finalUrl = isBorrowed ? slide.targetUrl.replace('/books/', '/reader/') : slide.targetUrl;

                return (
                  <div 
                    key={slide.id}
                    className="shrink-0 px-2 sm:px-2.5"
                    style={{ width: `${100 / visibleCount}%` }}
                  >
                    {/* Entire Banner Card is 1 direct clickable Link */}
                    <Link
                      href={finalUrl}
                      className={`group relative h-[195px] sm:h-[210px] lg:h-[220px] rounded-2xl overflow-hidden bg-gradient-to-r ${slide.themeGradient} p-4 sm:p-5 flex items-center justify-between shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-white/10 cursor-pointer block`}
                      title={`${slide.title} — คลิกเพื่อเข้าสู่เนื้อหา`}
                    >
                      {/* Ambient Glow */}
                      <div className={`absolute top-0 right-1/3 w-40 h-40 rounded-full blur-2xl pointer-events-none transition-all ${slide.glowColor}`} />
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/25 pointer-events-none" />

                      {/* LEFT CONTENT: Title, Subtitle, Quote & CTA Indicator */}
                      <div className="relative z-10 flex-1 min-w-0 pr-3 sm:pr-4 flex flex-col justify-between h-full py-0.5">
                        
                        {/* Top: Category Badge */}
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold shadow-xs w-fit"
                          style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(6px)' }}
                        >
                          <span className={`px-1.5 py-0.2 rounded-full text-[9px] sm:text-[10px] font-black ${slide.tagColor}`}>
                            {slide.badge}
                          </span>
                        </div>

                        {/* Middle: Title & Slogan */}
                        <div className="my-auto space-y-1">
                          <h2 className="text-base sm:text-lg lg:text-xl font-black text-white leading-tight line-clamp-1 group-hover:text-amber-200 transition-colors drop-shadow-sm">
                            {slide.title}
                          </h2>
                          <p className="text-xs sm:text-[13px] font-semibold text-white/90 line-clamp-1 drop-shadow-xs">
                            {slide.subtitle}
                          </p>
                          <p className="text-[11px] sm:text-xs text-white/70 line-clamp-2 leading-relaxed italic font-light">
                            &ldquo;{slide.quote}&rdquo;
                          </p>
                        </div>

                        {/* Bottom: Direct Entry Cue */}
                        <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-bold text-white/90 group-hover:text-amber-200 transition-colors">
                          {slide.type === 'podcast' ? (
                            <Headphones size={13} className="text-purple-300" />
                          ) : (
                            <BookOpen size={13} className="text-sky-300" />
                          )}
                          <span>{isBorrowed ? 'คลิกเปิดอ่านได้ทันที' : 'เข้าสู่หน้าเนื้อหา'}</span>
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </div>

                      </div>

                      {/* RIGHT: High-Definition 3D Standing Book Cover */}
                      <div className="relative shrink-0 flex items-center justify-center z-10">
                        <div className="relative w-24 sm:w-28 lg:w-32 aspect-[1/1.42] rounded-lg overflow-hidden shadow-[0_12px_28px_rgba(0,0,0,0.55)] border border-white/20 group-hover:scale-105 group-hover:-rotate-1 transition-all duration-300 bg-slate-900">
                          {/* 3D Spine Highlight */}
                          <div className="absolute left-0 inset-y-0 w-2 bg-gradient-to-r from-black/40 via-white/30 to-transparent z-20 pointer-events-none" />
                          <div className="absolute right-0 inset-y-0 w-1 bg-slate-300/80 z-20 pointer-events-none" />

                          <Image
                            src={slide.coverImage}
                            alt={slide.title}
                            fill
                            priority={idx < 3}
                            className="object-cover"
                            unoptimized
                          />

                          {/* Gloss Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/15 pointer-events-none" />
                        </div>
                      </div>

                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PREV / NEXT ARROWS (Floating Clean Controls) */}
          <button
            onClick={prevSlide}
            aria-label="เลื่อนไปแถบก่อนหน้า"
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all border border-slate-200 cursor-pointer opacity-90 hover:opacity-100"
          >
            <ChevronLeft size={20} className="sm:size-6" />
          </button>

          <button
            onClick={nextSlide}
            aria-label="เลื่อนไปแถบถัดไป"
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white text-slate-800 shadow-xl flex items-center justify-center hover:bg-slate-50 hover:scale-105 active:scale-95 transition-all border border-slate-200 cursor-pointer opacity-90 hover:opacity-100"
          >
            <ChevronRight size={20} className="sm:size-6" />
          </button>

        </div>

        {/* BOTTOM PAGINATION & CONTROLS */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-4 px-1">
          
          {/* Slide Dots Indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-6 sm:w-7 h-2 sm:h-2.5 bg-blue-600 shadow-sm' 
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`ไปที่ชุดที่ ${idx + 1}`}
                aria-label={`ไปที่ชุดที่ ${idx + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause & Counter */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-slate-500">
              {currentIndex + 1} / {maxIndex + 1}
            </span>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-slate-200/80 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all cursor-pointer"
              title={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
              aria-label={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
            >
              {isPlaying ? <Pause size={11} /> : <Play size={11} className="translate-x-0.5" />}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
