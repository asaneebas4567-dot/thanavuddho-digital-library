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
  Sparkles
} from 'lucide-react';
import { Book } from '@/types';

// Dynamic Pastel Theme System (BKK Book inspired: soft, gentle, readable contrast)
export type PastelThemeKey = 'mint' | 'sky' | 'rose' | 'cream' | 'orange' | 'indigo' | 'teal';

export interface PastelTheme {
  name: string;
  cardBg: string;             // pastel background tint
  cardBorder: string;         // delicate border
  badgeBg: string;            // category pill styling
  accentText: string;         // accent label text
  dotColor: string;           // decorative tiny badge dot
  glowShadow: string;         // hover shadow hue
}

export const PASTEL_THEMES: Record<PastelThemeKey, PastelTheme> = {
  mint: {
    name: 'เขียวมิ้นต์',
    cardBg: 'bg-emerald-50/70 hover:bg-emerald-50/95',
    cardBorder: 'border-emerald-200/80 hover:border-emerald-300',
    badgeBg: 'bg-emerald-100/90 text-emerald-800 border-emerald-200/90',
    accentText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    glowShadow: 'hover:shadow-emerald-200/40',
  },
  sky: {
    name: 'ฟ้าอ่อน',
    cardBg: 'bg-sky-50/70 hover:bg-sky-50/95',
    cardBorder: 'border-sky-200/80 hover:border-sky-300',
    badgeBg: 'bg-sky-100/90 text-sky-800 border-sky-200/90',
    accentText: 'text-sky-700',
    dotColor: 'bg-sky-500',
    glowShadow: 'hover:shadow-sky-200/40',
  },
  rose: {
    name: 'ชมพูอ่อน',
    cardBg: 'bg-rose-50/70 hover:bg-rose-50/95',
    cardBorder: 'border-rose-200/80 hover:border-rose-300',
    badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-200/90',
    accentText: 'text-rose-700',
    dotColor: 'bg-rose-500',
    glowShadow: 'hover:shadow-rose-200/40',
  },
  cream: {
    name: 'ครีม',
    cardBg: 'bg-amber-50/60 hover:bg-amber-50/90',
    cardBorder: 'border-amber-200/80 hover:border-amber-300',
    badgeBg: 'bg-amber-100/90 text-amber-800 border-amber-200/90',
    accentText: 'text-amber-700',
    dotColor: 'bg-amber-500',
    glowShadow: 'hover:shadow-amber-200/40',
  },
  orange: {
    name: 'ส้มอ่อน',
    cardBg: 'bg-orange-50/60 hover:bg-orange-50/90',
    cardBorder: 'border-orange-200/80 hover:border-orange-300',
    badgeBg: 'bg-orange-100/90 text-orange-800 border-orange-200/90',
    accentText: 'text-orange-700',
    dotColor: 'bg-orange-500',
    glowShadow: 'hover:shadow-orange-200/40',
  },
  indigo: {
    name: 'ม่วงลาเวนเดอร์',
    cardBg: 'bg-indigo-50/60 hover:bg-indigo-50/90',
    cardBorder: 'border-indigo-200/80 hover:border-indigo-300',
    badgeBg: 'bg-indigo-100/90 text-indigo-800 border-indigo-200/90',
    accentText: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    glowShadow: 'hover:shadow-indigo-200/40',
  },
  teal: {
    name: 'เขียวน้ำทะเล',
    cardBg: 'bg-teal-50/70 hover:bg-teal-50/95',
    cardBorder: 'border-teal-200/80 hover:border-teal-300',
    badgeBg: 'bg-teal-100/90 text-teal-800 border-teal-200/90',
    accentText: 'text-teal-700',
    dotColor: 'bg-teal-500',
    glowShadow: 'hover:shadow-teal-200/40',
  },
};

const THEME_KEYS: PastelThemeKey[] = ['mint', 'sky', 'rose', 'cream', 'orange', 'indigo', 'teal'];

export interface FeaturedBookCard {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  categoryName: string;
  themeKey: PastelThemeKey;
  readerUrl: string;
  detailUrl: string;
  isCopyright?: boolean;
}

// 14 Authentic Verified Books from Thanavuddho Digital Library
const DEFAULT_AUTHENTIC_FEATURED_BOOKS: FeaturedBookCard[] = [
  {
    id: 'book_tam_jai_hai_prom_buak',
    title: 'ทำใจให้พร้อมบวก',
    description: 'สร้างสุขที่แท้จริง ด้วยการสร้างความคิดดี ๆ จากการมองสิ่งต่าง ๆ อย่างเข้าใจ ยอมรับ เข้าใจ เกิดประโยชน์',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    categoryName: 'จิตวิทยา & พัฒนาตนเอง',
    themeKey: 'mint',
    readerUrl: '/reader/book_tam_jai_hai_prom_buak',
    detailUrl: '/books/book_tam_jai_hai_prom_buak',
    isCopyright: true,
  },
  {
    id: 'book_อย่ามโน',
    title: 'อย่ามโน',
    description: 'ดึงสติไม่ให้หลงไปตามอารมณ์ ค้นพบความจริงของชีวิตด้วยสัมมาทิฏฐิและความรู้เท่าทันใจตนเอง',
    coverImage: '/images/books/อย่ามโน.jpg',
    categoryName: 'จิตใจ & สติรู้ทัน',
    themeKey: 'sky',
    readerUrl: '/reader/book_อย่ามโน',
    detailUrl: '/books/book_อย่ามโน',
    isCopyright: true,
  },
  {
    id: 'book_สมดุลเท่ากับดี',
    title: 'สมดุลเท่ากับดี',
    description: 'ปรับสมดุลกายและใจให้ลงตัว ทำงานอย่างมีความสุข ชีวิตราบรื่นด้วยหลักมัชฌิมาปฏิปทา',
    coverImage: '/images/books/สมดุลเท่ากับดี.jpg',
    categoryName: 'การทำงาน & ความสำเร็จ',
    themeKey: 'orange',
    readerUrl: '/reader/book_สมดุลเท่ากับดี',
    detailUrl: '/books/book_สมดุลเท่ากับดี',
    isCopyright: true,
  },
  {
    id: 'book_ความสุข-360-องศา',
    title: 'ความสุข 360 องศา',
    description: 'กะเทาะเปลือกความทุกข์ ค้นพบความสุขรอบตัวในทุกมิติของชีวิตอย่างยั่งยืนจากภายใน',
    coverImage: '/images/books/ความสุข-360-องศา.jpg',
    categoryName: 'ความสุข & ความสงบใจ',
    themeKey: 'rose',
    readerUrl: '/reader/book_ความสุข-360-องศา',
    detailUrl: '/books/book_ความสุข-360-องศา',
    isCopyright: true,
  },
  {
    id: 'book_ตามหลวงพี่ไปโกอินเตอร์',
    title: 'ตามหลวงพี่ไปโกอินเตอร์',
    description: 'บันทึกเรื่องราวน่าประทับใจ การเผยแผ่พระพุทธศาสนาสู่เวทีโลกและประสบการณ์เดินทางรอบโลก',
    coverImage: '/images/books/ตามหลวงพี่ไปโกอินเตอร์.jpg',
    categoryName: 'บันทึกการเดินทาง & สากล',
    themeKey: 'teal',
    readerUrl: '/reader/book_ตามหลวงพี่ไปโกอินเตอร์',
    detailUrl: '/books/book_ตามหลวงพี่ไปโกอินเตอร์',
    isCopyright: true,
  },
  {
    id: 'book_ความลับของความรัก',
    title: 'ความลับของความรัก',
    description: 'ศิลปะการครองเรือน การประคับประคองความรักและความสัมพันธ์ให้ยืนยาวด้วยหลักพุทธวิธี',
    coverImage: '/images/books/ความลับของความรัก.jpg',
    categoryName: 'ครอบครัว & ความรัก',
    themeKey: 'indigo',
    readerUrl: '/reader/book_ความลับของความรัก',
    detailUrl: '/books/book_ความลับของความรัก',
    isCopyright: true,
  },
  {
    id: 'book_perfectionist-สไตล์พุทธะ',
    title: 'Perfectionist สไตล์พุทธะ',
    description: 'ทำทุกสิ่งด้วยความตั้งใจแต่ไม่ติดกับดักความสมบูรณ์แบบจนเป็นทุกข์ ปล่อยวางเพื่อความสงบใจ',
    coverImage: '/images/books/perfectionist-สไตล์พุทธะ.jpg',
    categoryName: 'การพัฒนาตนเอง',
    themeKey: 'cream',
    readerUrl: '/reader/book_perfectionist-สไตล์พุทธะ',
    detailUrl: '/books/book_perfectionist-สไตล์พุทธะ',
    isCopyright: true,
  },
  {
    id: 'book_ความรักรสอูมามิ',
    title: 'ความรักรสอูมามิ',
    description: 'รสชาติความรักที่กลมกล่อม เติมเต็มความอบอุ่นในใจด้วยความเข้าใจ การให้อภัย และความเมตตา',
    coverImage: '/images/books/ความรักรสอูมามิ.jpg',
    categoryName: 'ความรัก & ความสัมพันธ์',
    themeKey: 'rose',
    readerUrl: '/reader/book_ความรักรสอูมามิ',
    detailUrl: '/books/book_ความรักรสอูมามิ',
    isCopyright: true,
  },
  {
    id: 'book_khao_kor_sook_rao_kor_sook',
    title: 'เขาก็สุข เราก็สุข',
    description: 'เปลี่ยนศัตรูให้เป็นมิตร ศิลปะป้องกันใจ และสร้างมิตรภาพอันงดงามร่วมกันในสังคม',
    coverImage: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    categoryName: 'มิตรภาพ & สังคม',
    themeKey: 'mint',
    readerUrl: '/reader/book_khao_kor_sook_rao_kor_sook',
    detailUrl: '/books/book_khao_kor_sook_rao_kor_sook',
    isCopyright: true,
  },
  {
    id: 'book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
    title: 'กะเทาะเปลือกความทุกข์ สุขให้ถึงเเก่น',
    description: 'กะเทาะเปลือกความทุกข์ที่มาบดบังใจ ก้าวข้ามอุปสรรคชีวิตและเข้าถึงแก่นแท้แห่งความสุขที่แท้จริง',
    coverImage: '/images/books/กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น.jpg',
    categoryName: 'ธรรมะบำบัด & กำลังใจ',
    themeKey: 'sky',
    readerUrl: '/reader/book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
    detailUrl: '/books/book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
    isCopyright: true,
  },
  {
    id: 'book_phoo_soon_sia_tee_mai_sin_soon',
    title: 'ผู้สูญเสีย ที่ไม่เสียศูนย์',
    description: 'ธรรมะเยียวยาใจเมื่อต้องเผชิญความพลัดพราก ดึงสติกลับมาตั้งมั่น ไม่ให้ชีวิตต้องเสียศูนย์',
    coverImage: '/images/books/phoo-soon-sia-tee-mai-sin-soon.png',
    categoryName: 'กำลังใจ & สติ',
    themeKey: 'teal',
    readerUrl: '/reader/book_phoo_soon_sia_tee_mai_sin_soon',
    detailUrl: '/books/book_phoo_soon_sia_tee_mai_sin_soon',
    isCopyright: true,
  },
  {
    id: 'book_เส้นทางพระบรมฯ',
    title: 'เส้นทางพระบรมฯ',
    description: 'ย่ำรอยพระบาทบนเส้นทางธรรม ศึกษาประวัติศาสตร์และแนวทางการสร้างบารมีอันยิ่งใหญ่',
    coverImage: '/images/books/เส้นทางพระบรมฯ.jpg',
    categoryName: 'ประวัติศาสตร์ & ปัญญา',
    themeKey: 'cream',
    readerUrl: '/reader/book_เส้นทางพระบรมฯ',
    detailUrl: '/books/book_เส้นทางพระบรมฯ',
    isCopyright: true,
  },
  {
    id: 'book_lom_hai_jai_khao_ok',
    title: 'ลมหายใจเข้าออก ของพระพุทธศาสนา',
    description: 'ธรรมบรรยายว่าด้วยอานาปานสติและสมาธิภาวนา สร้างแสงสว่างและปัญญาให้ชีวิต',
    coverImage: '/images/books/lom-hai-jai-khao-ok.jpg',
    categoryName: 'สมาธิ & ปฏิบัติธรรม',
    themeKey: 'indigo',
    readerUrl: '/reader/book_lom_hai_jai_khao_ok',
    detailUrl: '/books/book_lom_hai_jai_khao_ok',
    isCopyright: true,
  },
  {
    id: 'book_mongkol_chiwit_124',
    title: 'มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า',
    description: 'หลักธรรม 38 ประการอันเป็นบันไดสู่ความสำเร็จและความเจริญรุ่งเรืองในชีวิต',
    coverImage: '/images/books/mongkol-124.jpg',
    categoryName: 'หลักธรรม & มงคลชีวิต',
    themeKey: 'mint',
    readerUrl: '/reader/book_mongkol_chiwit_124',
    detailUrl: '/books/book_mongkol_chiwit_124',
    isCopyright: true,
  },
];

interface TopBannerCarouselProps {
  books?: Book[];
  title?: string;
  badge?: string;
  autoPlayIntervalMs?: number;
}

export default function TopBannerCarousel({
  books,
  title = 'ไฮไลต์ชุดหนังสือดิจิทัล',
  badge = 'หนังสือแนะนำ',
  autoPlayIntervalMs = 8000,
}: TopBannerCarouselProps) {
  // Convert incoming books to FeaturedBookCard format if provided
  const items: FeaturedBookCard[] = React.useMemo(() => {
    if (!books || books.length === 0) {
      return DEFAULT_AUTHENTIC_FEATURED_BOOKS;
    }

    return books.map((book, index) => {
      const themeKey = THEME_KEYS[index % THEME_KEYS.length];
      const cover = book.cover_image || book.cover || '/images/books/book-placeholder.jpg';
      const category = (book.tags && book.tags[0]) || book.category_id || 'หนังสือธรรมะ';
      
      return {
        id: book.id,
        title: book.title,
        description: book.description || 'คำสอนและข้อคิดธรรมะอันทรงคุณค่า เพื่อการดำเนินชีวิตอย่างมีความสุข',
        coverImage: cover,
        categoryName: category,
        themeKey,
        readerUrl: book.reader_url || `/reader/${book.id}`,
        detailUrl: `/books/${book.id}`,
        isCopyright: book.is_copyright ?? true,
      };
    });
  }, [books]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [progressKey, setProgressKey] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Swipe / Drag tracking
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isMouseDownRef = useRef(false);
  const mouseStartXRef = useRef<number | null>(null);

  // Responsive Breakpoints: Desktop (3), Tablet (2), Mobile (1)
  useEffect(() => {
    const handleResize = () => {
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

  const totalCards = items.length;
  const maxIndex = Math.max(0, totalCards - visibleCount);

  // Clamp current index when screen resized
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    setProgressKey((k) => k + 1);
  }, [maxIndex]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    setProgressKey((k) => k + 1);
  }, [maxIndex]);

  // Autoplay handler (pauses on hover and user interaction)
  useEffect(() => {
    if (isPlaying && !isHovered && totalCards > visibleCount) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, autoPlayIntervalMs);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextSlide, autoPlayIntervalMs, totalCards, visibleCount]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextSlide();
    }
  };

  // Touch Swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchEndXRef.current = null;
    setIsHovered(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartXRef.current !== null && touchEndXRef.current !== null) {
      const diff = touchStartXRef.current - touchEndXRef.current;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
    setIsHovered(false);
  };

  // Mouse Drag Support
  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    mouseStartXRef.current = e.clientX;
    setIsHovered(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current) return;
    // user is dragging
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (isMouseDownRef.current && mouseStartXRef.current !== null) {
      const diff = mouseStartXRef.current - e.clientX;
      if (Math.abs(diff) > 40) {
        if (diff > 0) nextSlide();
        else prevSlide();
      }
    }
    isMouseDownRef.current = false;
    mouseStartXRef.current = null;
    setIsHovered(false);
  };

  // Empty State handling
  if (totalCards === 0) {
    return (
      <section className="bg-stone-50/60 border-b border-slate-200/80 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-10 px-4 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-2xs">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2.5" />
            <h3 className="text-sm font-bold text-slate-800">ยังไม่มีรายการหนังสือแนะนำในขณะนี้</h3>
            <p className="text-xs text-slate-500 mt-1">ท่านสามารถเลือกอ่านหนังสือเล่มอื่น ๆ ได้จากคลังหนังสือทั้งหมด</p>
            <Link 
              href="/books" 
              className="inline-flex items-center gap-1.5 mt-4 px-4 py-1.5 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition shadow-xs"
            >
              สำรวจคลังหนังสือทั้งหมด
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // Calculate slide percentage width
  const cardWidthPercent = 100 / visibleCount;

  return (
    <section 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="bg-stone-50/70 border-b border-slate-200/80 py-3.5 sm:py-4.5 relative select-none focus:outline-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isMouseDownRef.current = false;
      }}
      aria-label="ไฮไลต์ชุดหนังสือดิจิทัล Thanavuddho Library"
    >
      <style>{`
        @keyframes bannerProgressSmooth {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .banner-progress-bar-active {
          animation: bannerProgressSmooth ${autoPlayIntervalMs}ms linear infinite;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* 1. Header Bar: Decorative Dot + Title + Badge + Right-side Controls */}
        <div className="flex items-center justify-between gap-2.5 mb-3">
          
          {/* Left: Dot + Title + Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 ring-2 ring-amber-100" />
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-slate-800 tracking-tight flex items-center gap-2 truncate">
              <span>{title}</span>
              <span className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200/90 px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 shadow-2xs">
                <Sparkles size={11} className="text-amber-600" />
                <span>{badge}</span>
                <span className="text-slate-400 font-normal">({totalCards} เล่ม)</span>
              </span>
            </h2>
          </div>

          {/* Right: Counter + Play/Pause + Prev + Next */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* Position Counter Chip */}
            <span 
              className="text-[11px] sm:text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200/90 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-2xs tabular-nums"
              title="ตำแหน่งสไลด์ปัจจุบัน"
            >
              {currentIndex + 1}{visibleCount > 1 ? ` - ${Math.min(currentIndex + visibleCount, totalCards)}` : ''} / {totalCards}
            </span>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-slate-50 border border-slate-200/90 flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer active:scale-95"
              title={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
              aria-label={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} className="translate-x-0.5" />}
            </button>

            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-amber-500 hover:text-white hover:border-amber-500 border border-slate-200/90 flex items-center justify-center text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="ก่อนหน้า"
              aria-label="เลื่อนไปก่อนหน้า"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white hover:bg-amber-500 hover:text-white hover:border-amber-500 border border-slate-200/90 flex items-center justify-center text-slate-700 transition-all shadow-2xs cursor-pointer active:scale-95"
              title="ถัดไป"
              aria-label="เลื่อนไปถัดไป"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 2. Carousel Viewport (BKK Book Style: 3 cards desktop, 2 tablet, 1 mobile) */}
        <div 
          className="overflow-hidden rounded-2xl cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ 
              transform: `translateX(-${currentIndex * cardWidthPercent}%)`,
            }}
          >
            {items.map((item, index) => {
              const theme = PASTEL_THEMES[item.themeKey] || PASTEL_THEMES.mint;

              return (
                <div 
                  key={`${item.id}-${index}`}
                  className="px-1.5 sm:px-2 shrink-0"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  <div
                    className={`group relative rounded-2xl overflow-hidden ${theme.cardBg} ${theme.glowShadow} p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 border ${theme.cardBorder} flex flex-row items-center gap-3.5 sm:gap-4 min-h-[170px] sm:min-h-[185px] h-full hover:-translate-y-1`}
                  >
                    {/* Left: Authentic Upright Book Cover with Realistic Depth (No Distortion, 100% Readable Title) */}
                    <Link
                      href={item.detailUrl}
                      className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-white shadow-[2px_4px_12px_rgba(0,0,0,0.14)] border border-slate-200/70 group-hover:shadow-[3px_6px_16px_rgba(0,0,0,0.18)] transition-shadow duration-300 block"
                      title={`ดูรายละเอียดเล่ม: ${item.title}`}
                    >
                      {/* Left Book Spine 3D Highlight Line */}
                      <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
                      
                      {/* Right Edge Page-stack Simulation */}
                      <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />
                      
                      {/* Genuine Book Cover Image */}
                      {/* Genuine Book Cover Image */}
                      <Image
                        src={encodeURI(item.coverImage)}
                        alt={`ปกหนังสือ ${item.title}`}
                        fill
                        loading={index < 3 ? 'eager' : 'lazy'}
                        className="object-cover group-hover:scale-103 transition-transform duration-300"
                        sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                        unoptimized
                      />
                    </Link>

                    {/* Right: Book Details & Vibrant Orange Read Button */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                      <div>
                        {/* Top: Category Badge & Copyright Indicator */}
                        <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                          <span className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${theme.badgeBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                            <span className="truncate max-w-[130px] sm:max-w-none">{item.categoryName}</span>
                          </span>
                          {item.isCopyright && (
                            <span className="text-[9.5px] font-bold text-amber-800 bg-amber-100/80 border border-amber-200/90 px-1.5 py-0.5 rounded-full">
                              ลิขสิทธิ์
                            </span>
                          )}
                        </div>

                        {/* Title: Legible, High Contrast, Dark Slate */}
                        <Link href={item.detailUrl}>
                          <h3 
                            className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug"
                            title={item.title}
                          >
                            {item.title}
                          </h3>
                        </Link>

                        {/* Description: 2-line preview, accessible slate color */}
                        <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Action: Vibrant Orange "เปิดอ่านหนังสือ" Button (BKK Book Style) */}
                      <div className="mt-2.5 sm:mt-3 flex items-center justify-start">
                        <Link
                          href={item.readerUrl}
                          className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold shadow-xs hover:shadow-md transition-all group-hover:scale-102 cursor-pointer"
                          title={`เปิดอ่านหนังสือ: ${item.title}`}
                        >
                          <BookOpen size={12} className="shrink-0" />
                          <span>เปิดอ่านหนังสือ</span>
                          <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                      </div>

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom Indicator Dots (Page & Item Progression) */}
        {totalCards > visibleCount && (
          <div className="flex items-center justify-center gap-1.5 mt-3">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setCurrentIndex(idx);
                  setProgressKey((k) => k + 1);
                }}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex
                    ? 'w-7 bg-amber-500 shadow-2xs'
                    : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`ไปที่หน้า ${idx + 1}`}
                aria-label={`ไปที่หน้า ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* 4. Autoplay Progress Countdown Bar (Smooth & Polite) */}
        {isPlaying && !isHovered && totalCards > visibleCount && (
          <div className="max-w-[160px] mx-auto h-0.5 bg-slate-200/80 rounded-full overflow-hidden mt-1.5">
            <div 
              key={progressKey}
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 banner-progress-bar-active rounded-full"
            />
          </div>
        )}

      </div>
    </section>
  );
}
