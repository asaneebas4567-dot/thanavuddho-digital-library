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
  Sparkles,
  Coins,
  Headphones,
  Video,
  Compass,
  BookMarked
} from 'lucide-react';
import { Book } from '@/types';
import { useLoan } from '@/context/LoanContext';

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
  btnBg: string;              // button background style
}

export const PASTEL_THEMES: Record<PastelThemeKey, PastelTheme> = {
  mint: {
    name: 'เขียวมิ้นต์',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#079FE8]/60',
    badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    accentText: 'text-emerald-700',
    dotColor: 'bg-emerald-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white shadow-xs',
  },
  sky: {
    name: 'ฟ้าอ่อน',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#079FE8]/60',
    badgeBg: 'bg-sky-50 text-sky-800 border-sky-200',
    accentText: 'text-sky-700',
    dotColor: 'bg-sky-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white shadow-xs',
  },
  rose: {
    name: 'ชมพูอ่อน',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#079FE8]/60',
    badgeBg: 'bg-rose-50 text-rose-800 border-rose-200',
    accentText: 'text-rose-700',
    dotColor: 'bg-rose-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white shadow-xs',
  },
  cream: {
    name: 'ครีมทอง',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#D9A441]/60',
    badgeBg: 'bg-amber-50 text-amber-900 border-amber-200',
    accentText: 'text-amber-800',
    dotColor: 'bg-amber-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#D9A441] hover:bg-[#c59132] text-white shadow-xs',
  },
  orange: {
    name: 'ฟ้าครามไซแอน',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#079FE8]/60',
    badgeBg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
    accentText: 'text-cyan-700',
    dotColor: 'bg-cyan-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white shadow-xs',
  },
  indigo: {
    name: 'ม่วงลาเวนเดอร์',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#079FE8]/60',
    badgeBg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
    accentText: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#073B65] hover:bg-[#052946] text-white shadow-xs',
  },
  teal: {
    name: 'เขียวน้ำทะเล',
    cardBg: 'bg-white hover:bg-slate-50/60',
    cardBorder: 'border-slate-200/90 hover:border-[#079FE8]/60',
    badgeBg: 'bg-teal-50 text-teal-800 border-teal-200',
    accentText: 'text-teal-700',
    dotColor: 'bg-teal-500',
    glowShadow: 'hover:shadow-md',
    btnBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white shadow-xs',
  },
};

export interface ShowcaseCard {
  id: string;
  type: 'welcome' | 'survey' | 'podcast' | 'video' | 'book';
  title: string;
  description: string;
  coverImage?: string;
  categoryName: string;
  badgeLabel?: string;
  themeKey: PastelThemeKey;
  actionUrl: string;
  actionLabel: string;
  isCopyright?: boolean;
  isExternal?: boolean;
  isSurveyTrigger?: boolean;
}

// 10 Curated Highlight Showcase Items (Welcome, Survey 200pts, Podcast, Video, and 6 Copyright Books)
export const DEFAULT_10_SHOWCASE_CARDS: ShowcaseCard[] = [
  // 1. Welcome Card
  {
    id: 'item-welcome',
    type: 'welcome',
    title: 'ยินดีต้อนรับสู่ Thanavuddho Digital Library',
    description: 'คลังหนังสือธรรมะดิจิทัล เสียงพอดแคสต์ และสื่อการเรียนรู้พระพุทธศาสนาร่วมสมัย โดย พระครูปลัดสุวัฒนโพธิคุณ',
    categoryName: 'ห้องสมุดธรรมะดิจิทัล',
    badgeLabel: 'ยินดีต้อนรับ',
    themeKey: 'sky',
    actionUrl: '/books',
    actionLabel: 'สำรวจคลังธรรมะ',
  },

  // 2. Survey Promotion Card (200 Points)
  {
    id: 'item-survey-200',
    type: 'survey',
    title: 'ตอบแบบสอบถาม รับทันที 200 แต้มสะสม',
    description: 'ร่วมทำแบบประเมินคุณภาพเว็บไซต์และห้องสมุดดิจิทัล กรอกอีเมลสมาชิกแล้วกดยืนยันรับ 200 แต้มสะสมทันที',
    categoryName: 'ภารกิจรับแต้ม',
    badgeLabel: 'รับ 200 แต้ม',
    themeKey: 'cream',
    actionUrl: '/survey',
    actionLabel: 'ทำแบบประเมิน รับ 200 แต้ม',
    isSurveyTrigger: true,
  },

  // 3. Featured Podcast Card
  {
    id: 'item-podcast-tamjai',
    type: 'podcast',
    title: 'พอดแคสต์ "ทำใจให้พร้อมบวก"',
    description: 'ซีรีส์ 5 ตอนจบ ฟังเพลิน เติมพลังบวก สติ และปัญญา จากหนังสือยอดนิยม โดย พระครูปลัดสุวัฒนโพธิคุณ',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    categoryName: 'พอดแคสต์ธรรมะ',
    badgeLabel: 'พอดแคสต์ 5 ตอน',
    themeKey: 'rose',
    actionUrl: '/audios?podcast=pod-tam-jai-hai-prom-buak',
    actionLabel: 'ฟังพอดแคสต์ธรรมะ',
  },

  // 4. Featured Video Card
  {
    id: 'item-video-thanavuddho',
    type: 'video',
    title: 'วิดีโอธรรมบรรยาย พระครูปลัดสุวัฒนโพธิคุณ',
    description: 'เทศนาธรรมะร่วมสมัย สาระน่ารู้ ตอบโจทย์ชีวิต ข้อคิดเตือนใจ และแนวทางปฏิบัติธรรมสู่ความสุขแท้จริง',
    coverImage: '/images/books/ตามหลวงพี่ไปโกอินเตอร์.jpg',
    categoryName: 'สื่อธรรมะวิดีโอ',
    badgeLabel: 'วิดีโอแนะนำ',
    themeKey: 'teal',
    actionUrl: '/videos',
    actionLabel: 'รับชมวิดีโอธรรมะ',
  },

  // 5. VIP Book: ทำใจให้พร้อมบวก (Digital Library Loan)
  {
    id: 'book_tam_jai_hai_prom_buak',
    type: 'book',
    title: 'ทำใจให้พร้อมบวก',
    description: 'สร้างสุขที่แท้จริง ด้วยการสร้างความคิดดี ๆ จากการมองสิ่งต่าง ๆ อย่างเข้าใจ ยอมรับ เข้าใจ เกิดประโยชน์',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    categoryName: 'จิตวิทยา & พัฒนาตนเอง',
    badgeLabel: 'ยอดนิยม',
    themeKey: 'mint',
    actionUrl: '/books/book_tam_jai_hai_prom_buak',
    actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
    isCopyright: true,
  },

  // 6. VIP Book: อย่ามโน (Digital Library Loan)
  {
    id: 'book_อย่ามโน',
    type: 'book',
    title: 'อย่ามโน',
    description: 'ดึงสติไม่ให้หลงไปตามอารมณ์ ค้นพบความจริงของชีวิตด้วยสัมมาทิฏฐิและความรู้เท่าทันใจตนเอง',
    coverImage: '/images/books/อย่ามโน.jpg',
    categoryName: 'จิตใจ & สติรู้ทัน',
    badgeLabel: 'หนังสือแนะนำ',
    themeKey: 'sky',
    actionUrl: '/books/book_อย่ามโน',
    actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
    isCopyright: true,
  },

  // 7. VIP Book: สมดุลเท่ากับดี (Digital Library Loan)
  {
    id: 'book_สมดุลเท่ากับดี',
    type: 'book',
    title: 'สมดุลเท่ากับดี',
    description: 'ปรับสมดุลกายและใจให้ลงตัว ทำงานอย่างมีความสุข ชีวิตราบรื่นด้วยหลักมัชฌิมาปฏิปทา',
    coverImage: '/images/books/สมดุลเท่ากับดี.jpg',
    categoryName: 'การทำงาน & ความสำเร็จ',
    badgeLabel: 'หนังสือแนะนำ',
    themeKey: 'orange',
    actionUrl: '/books/book_สมดุลเท่ากับดี',
    actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
    isCopyright: true,
  },

  // 8. VIP Book: เขาก็สุข เราก็สุข (Digital Library Loan)
  {
    id: 'book_khao_kor_sook_rao_kor_sook',
    type: 'book',
    title: 'เขาก็สุข เราก็สุข',
    description: 'เปลี่ยนศัตรูให้เป็นมิตร ศิลปะป้องกันใจ และสร้างมิตรภาพอันงดงามร่วมกันในสังคม',
    coverImage: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    categoryName: 'มิตรภาพ & สังคม',
    badgeLabel: 'หนังสือแนะนำ',
    themeKey: 'mint',
    actionUrl: '/books/book_khao_kor_sook_rao_kor_sook',
    actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
    isCopyright: true,
  },

  // 9. VIP Book: ความสุข 360 องศา (Digital Library Loan)
  {
    id: 'book_ความสุข-360-องศา',
    type: 'book',
    title: 'ความสุข 360 องศา',
    description: 'กะเทาะเปลือกความทุกข์ ค้นพบความสุขรอบตัวในทุกมิติของชีวิตอย่างยั่งยืนจากภายใน',
    coverImage: '/images/books/ความสุข-360-องศา.jpg',
    categoryName: 'ความสุข & ความสงบใจ',
    badgeLabel: 'หนังสือแนะนำ',
    themeKey: 'rose',
    actionUrl: '/books/book_ความสุข-360-องศา',
    actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
    isCopyright: true,
  },

  // 10. VIP Book: มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า (Digital Library Loan)
  {
    id: 'book_mongkol_chiwit_124',
    type: 'book',
    title: 'มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า',
    description: 'หลักธรรม 38 ประการอันเป็นบันไดสู่ความสำเร็จและความเจริญรุ่งเรืองในชีวิต',
    coverImage: '/images/books/mongkol-124.jpg',
    categoryName: 'หลักธรรม & มงคลชีวิต',
    badgeLabel: 'มงคลชีวิต',
    themeKey: 'indigo',
    actionUrl: '/books/book_mongkol_chiwit_124',
    actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
    isCopyright: true,
  },
];

// Cute Mini Novice Monk Mascot for the Survey Card
function MiniNoviceMascot() {
  return (
    <svg 
      viewBox="0 0 160 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full drop-shadow-md select-none"
    >
      <defs>
        <radialGradient id="miniHaloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="miniSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </linearGradient>
        <linearGradient id="miniRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="miniCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Halo Background */}
      <circle cx="80" cy="72" r="54" fill="url(#miniHaloGlow)" />

      {/* Body / Saffron Robe */}
      <path 
        d="M48 108 C44 122 42 142 40 152 C52 154 108 154 120 152 C118 142 116 122 112 108 C102 116 58 116 48 108 Z" 
        fill="url(#miniRobeGrad)" 
      />
      <path 
        d="M50 110 C62 125 98 125 110 110 C100 135 60 135 50 110 Z" 
        fill="#C2410C" 
        opacity="0.35" 
      />

      {/* Ears */}
      <circle cx="45" cy="76" r="8" fill="url(#miniSkinGrad)" />
      <circle cx="115" cy="76" r="8" fill="url(#miniSkinGrad)" />

      {/* Head */}
      <circle cx="80" cy="72" r="36" fill="url(#miniSkinGrad)" />

      {/* Eyebrows */}
      <path d="M60 60 Q68 56 74 60" stroke="#795548" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 60 Q92 56 100 60" stroke="#795548" strokeWidth="2.5" strokeLinecap="round" />

      {/* Happy Curved Eyes */}
      <path d="M60 69 Q67 76 74 69" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M86 69 Q93 76 100 69" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Sweet Smile */}
      <path d="M72 82 Q80 90 88 82" stroke="#3E2723" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M75 84 Q80 88 85 84" fill="#E57373" />

      {/* Peach Cheeks */}
      <ellipse cx="57" cy="77" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />
      <ellipse cx="103" cy="77" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />

      {/* Left Hand holding Dharma Tablet */}
      <g transform="translate(32, 102)">
        <rect x="0" y="0" width="22" height="28" rx="3" fill="#073B65" />
        <rect x="2" y="2" width="18" height="24" rx="2" fill="#FFFFFF" />
        <circle cx="11" cy="14" r="5" fill="#D9A441" />
      </g>

      {/* Right Hand Waving & Holding 200 Coin */}
      <g transform="translate(108, 38)">
        <circle cx="18" cy="18" r="18" fill="url(#miniCoinGrad)" />
        <circle cx="18" cy="18" r="14.5" stroke="#FEF08A" strokeWidth="1.5" fill="none" />
        <text 
          x="18" 
          y="23" 
          textAnchor="middle" 
          fill="#78350F" 
          fontSize="11" 
          fontWeight="900" 
          fontFamily="sans-serif"
        >
          200
        </text>
        <path d="M8 8 L9 5 L10 8 L13 9 L10 10 L9 13 L8 10 L5 9 Z" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

interface TopBannerCarouselProps {
  books?: Book[];
  showcaseItems?: ShowcaseCard[];
  title?: string;
  badge?: string;
  autoPlayIntervalMs?: number;
}

export default function TopBannerCarousel({
  books,
  showcaseItems,
  title = 'ไฮไลต์ห้องสมุดดิจิทัล',
  badge = 'รายการแนะนำ',
  autoPlayIntervalMs = 8000,
}: TopBannerCarouselProps) {
  const { isMediaBorrowed } = useLoan();
  // Use custom showcase items, or default curated 10 items
  const items: ShowcaseCard[] = React.useMemo(() => {
    if (showcaseItems && showcaseItems.length > 0) {
      return showcaseItems;
    }
    // If user explicitly provided books and wants them mapped:
    if (books && books.length > 0 && !showcaseItems) {
      // Map up to 10 books ensuring readerUrl goes to /reader/[id]
      const themeKeys: PastelThemeKey[] = ['mint', 'sky', 'rose', 'cream', 'orange', 'indigo', 'teal'];
      return books.slice(0, 10).map((book, index) => {
        const themeKey = themeKeys[index % themeKeys.length];
        const cover = book.cover_image || book.cover || '/images/books/tam-jai-hai-prom-buak.jpg';
        const category = (book.tags && book.tags[0]) || book.category_id || 'หนังสือธรรมะ';
        
        return {
          id: book.id,
          type: 'book',
          title: book.title,
          description: book.description || 'คำสอนและข้อคิดธรรมะอันทรงคุณค่า เพื่อการดำเนินชีวิตอย่างมีความสุข',
          coverImage: cover,
          categoryName: category,
          badgeLabel: '📖 หนังสือแนะนำ',
          themeKey,
          actionUrl: `/books/${book.id}`,
          actionLabel: 'ยืมหนังสือ (จำกัด 3 เล่ม)',
          isCopyright: book.is_copyright ?? true,
        };
      });
    }

    return DEFAULT_10_SHOWCASE_CARDS;
  }, [books, showcaseItems]);

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

  // Autoplay handler (8000ms by default, smoothly step-by-step)
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

  const handleMouseMove = () => {
    if (!isMouseDownRef.current) return;
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

  // Trigger Survey Modal with seamless fallback to /survey page
  const handleTriggerSurvey = (e?: React.MouseEvent) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-survey-modal'));
      setTimeout(() => {
        const modal = document.getElementById('survey-modal-overlay');
        if (!modal) {
          window.location.href = '/survey';
        }
      }, 150);
    }
  };

  // Empty State handling
  if (totalCards === 0) {
    return null;
  }

  // Calculate slide percentage width (88% on mobile so adjacent card peeks at the side)
  const cardWidthPercent = visibleCount === 1 ? 88 : 100 / visibleCount;

  return (
    <section 
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="relative bg-gradient-to-r from-[#073B65] via-[#0A4D82] to-[#079FE8] border-b border-[#073B65]/40 py-4 sm:py-5.5 select-none focus:outline-none shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isMouseDownRef.current = false;
      }}
      aria-label="ไฮไลต์ 10 หน้าต่าง Thanavuddho Digital Library"
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
        
        {/* 1. Header Bar: Title + Badge (10 รายการ) + Controls */}
        <div className="flex items-center justify-between gap-2.5 mb-3.5">
          
          {/* Left: Title */}
          <div className="flex items-center gap-2 min-w-0">
            <h2 className="text-base sm:text-lg font-semibold text-white tracking-tight truncate">
              {title}
            </h2>
          </div>

          {/* Right: Counter + Play/Pause + Prev + Next */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Position Counter Chip */}
            <span 
              className="text-[11px] sm:text-xs font-mono font-bold text-[#073B65] bg-white/95 border border-white/80 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full shadow-2xs tabular-nums"
              title="ตำแหน่งสไลด์ปัจจุบัน"
            >
              {currentIndex + 1}{visibleCount > 1 ? ` - ${Math.min(currentIndex + visibleCount, totalCards)}` : ''} / {totalCards}
            </span>

            {/* Play / Pause Toggle Button */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#073B65] flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95"
              title={isPlaying ? 'หยุดเล่นอัตโนมัติ (8 วินาที)' : 'เริ่มเล่นอัตโนมัติ (8 วินาที)'}
              aria-label={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} className="translate-x-0.5" />}
            </button>

            {/* Prev Button */}
            <button
              onClick={prevSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#073B65] flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95 hover:scale-105"
              title="ก่อนหน้า"
              aria-label="เลื่อนไปก่อนหน้า"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Next Button */}
            <button
              onClick={nextSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-[#073B65] flex items-center justify-center transition-all shadow-2xs cursor-pointer active:scale-95 hover:scale-105"
              title="ถัดไป"
              aria-label="เลื่อนไปถัดไป"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* 2. Carousel Viewport (10 Cards: Desktop 3, Tablet 2, Mobile 1) */}
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
              const isBorrowed = item.type === 'book' && isMediaBorrowed(item.id);
              const resolvedUrl = item.type === 'book'
                ? (isBorrowed ? `/reader/${item.id}` : `/books/${item.id}`)
                : item.actionUrl;
              const resolvedLabel = item.type === 'book'
                ? (isBorrowed ? 'เปิดอ่าน (ยืมแล้ว)' : 'ยืมหนังสือ (จำกัด 3 เล่ม)')
                : item.actionLabel;

              return (
                <div 
                  key={`${item.id}-${index}`}
                  className="px-1.5 sm:px-2 shrink-0"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  <div
                    className={`group relative rounded-2xl overflow-hidden ${theme.cardBg} ${theme.glowShadow} p-3.5 sm:p-4 shadow-xs hover:shadow-md transition-all duration-300 border ${theme.cardBorder} flex flex-row items-center gap-3.5 sm:gap-4 min-h-[175px] sm:min-h-[190px] h-full hover:-translate-y-1`}
                  >
                    
                    {/* LEFT COLUMN: Customized Visual Slot (Book Spine / Mascot / Video / Welcome / Podcast) */}
                    {item.type === 'welcome' ? (
                      /* Welcome Visual: Elegant Emblem */
                      <Link
                        href={item.actionUrl}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-gradient-to-br from-[#073B65] via-[#0A4D82] to-[#079FE8] shadow-md border border-sky-300/40 flex flex-col items-center justify-center p-2 text-center group-hover:scale-102 transition-transform duration-300"
                        title="สำรวจห้องสมุดดิจิทัล"
                      >
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.25)_0%,transparent_70%)] pointer-events-none" />
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center shadow-inner mb-1.5">
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#FDE68A]" />
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-black text-white tracking-wide uppercase">Thanavuddho</span>
                        <span className="text-[8px] sm:text-[9px] text-sky-200 font-medium">Digital Library</span>
                      </Link>
                    ) : item.type === 'survey' ? (
                      /* Survey Visual: Cute Novice Monk with 200 Coin */
                      <Link
                        href="/survey"
                        onClick={handleTriggerSurvey}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200/90 shadow-md border border-amber-300 flex flex-col items-center justify-center p-1 group-hover:scale-102 transition-transform duration-300 cursor-pointer block"
                        title="คลิกเพื่อทำแบบประเมิน รับทันที 200 แต้ม"
                      >
                        <div className="w-full h-full p-1 flex items-center justify-center">
                          <MiniNoviceMascot />
                        </div>
                        <span className="absolute bottom-1 px-1.5 py-0.5 rounded-full bg-[#D9A441] text-white text-[8px] font-extrabold shadow-xs">
                          🪙 200 P
                        </span>
                      </Link>
                    ) : item.type === 'podcast' ? (
                      /* Podcast Visual: Cover with Pulsing Headphones Overlay */
                      <Link
                        href={item.actionUrl}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-white shadow-md border border-slate-200/70 group-hover:scale-102 transition-transform duration-300 block"
                        title={item.title}
                      >
                        {item.coverImage && (
                          <Image
                            src={encodeURI(item.coverImage)}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-950/80 via-transparent to-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-rose-500/90 text-white flex items-center justify-center shadow-lg ring-2 ring-white/80 animate-pulse">
                            <Headphones className="w-5 h-5" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 inset-x-1 text-center py-0.5 rounded bg-black/70 text-white text-[8px] font-bold">
                          5 ตอนจบ
                        </span>
                      </Link>
                    ) : item.type === 'video' ? (
                      /* Video Visual: Cover with Play Badge Overlay */
                      <Link
                        href={item.actionUrl}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-slate-900 shadow-md border border-slate-200/70 group-hover:scale-102 transition-transform duration-300 block"
                        title={item.title}
                      >
                        {item.coverImage && (
                          <Image
                            src={encodeURI(item.coverImage)}
                            alt={item.title}
                            fill
                            className="object-cover opacity-85"
                            sizes="128px"
                            unoptimized
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/80 via-transparent to-black/20" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyan-500 text-white flex items-center justify-center shadow-lg ring-2 ring-white/90">
                            <Play className="w-5 h-5 translate-x-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-1 inset-x-1 text-center py-0.5 rounded bg-black/70 text-teal-300 text-[8px] font-bold">
                          วิดีโอ HD
                        </span>
                      </Link>
                    ) : (
                      /* Standard Book Visual: 3D Book Cover with Spine Line */
                      <Link
                        href={resolvedUrl}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-white shadow-[2px_4px_12px_rgba(0,0,0,0.14)] border border-slate-200/70 group-hover:shadow-[3px_6px_16px_rgba(0,0,0,0.18)] transition-shadow duration-300 block"
                        title={isBorrowed ? `เปิดอ่านหนังสือที่ยืมแล้ว: ${item.title}` : `ยืมหนังสือ: ${item.title}`}
                      >
                        {/* 3D Spine Highlight */}
                        <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
                        {/* Right Edge Page-stack Simulation */}
                        <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />
                        
                        {/* DRM / Borrowed Badge */}
                        <div className="absolute top-1 right-1 z-20">
                          {isBorrowed ? (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-600 text-white text-[7.5px] font-bold shadow-xs">
                              ยืมแล้ว
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.5 rounded bg-rose-600 text-white text-[7.5px] font-bold shadow-xs">
                              ลิขสิทธิ์
                            </span>
                          )}
                        </div>

                        {item.coverImage && (
                          <Image
                            src={encodeURI(item.coverImage)}
                            alt={`ปกหนังสือ ${item.title}`}
                            fill
                            loading={index < 3 ? 'eager' : 'lazy'}
                            className="object-cover group-hover:scale-103 transition-transform duration-300"
                            sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                            unoptimized
                          />
                        )}
                      </Link>
                    )}

                    {/* RIGHT COLUMN: Details & Clear Action Button */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                      <div>
                        {/* Top: Clean Category Label */}
                        <div className="flex items-center gap-1.5 mb-1.5">
                          <span className="text-[11px] font-medium text-slate-500">
                            {item.categoryName}
                          </span>
                        </div>

                        {/* Title: High Contrast Slate-800 */}
                        {item.isSurveyTrigger ? (
                          <Link
                            href="/survey"
                            onClick={handleTriggerSurvey}
                            className="text-left cursor-pointer block"
                          >
                            <h3 
                              className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-2 leading-snug"
                              title={item.title}
                            >
                              {item.title}
                            </h3>
                          </Link>
                        ) : (
                          <Link href={resolvedUrl}>
                            <h3 
                              className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug"
                              title={item.title}
                            >
                              {item.title}
                            </h3>
                          </Link>
                        )}

                        {/* Description: 2 lines */}
                        <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Bottom Action: Clean Library Button for Every Card */}
                      <div className="mt-2.5 sm:mt-3 flex items-center justify-start">
                        {item.isSurveyTrigger ? (
                          <Link
                            href="/survey"
                            onClick={handleTriggerSurvey}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#D9A441] hover:bg-[#c59132] text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title="ทำแบบประเมิน รับทันที 200 แต้ม"
                          >
                            <Coins size={12} className="shrink-0 text-yellow-100" />
                            <span>{resolvedLabel}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : item.type === 'podcast' ? (
                          <Link
                            href={resolvedUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={item.title}
                          >
                            <Headphones size={12} className="shrink-0 text-white" />
                            <span>{resolvedLabel}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : item.type === 'video' ? (
                          <Link
                            href={resolvedUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={item.title}
                          >
                            <Play size={12} className="shrink-0 text-white fill-current" />
                            <span>{resolvedLabel}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : item.type === 'welcome' ? (
                          <Link
                            href={resolvedUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#073B65] hover:bg-[#052946] text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={item.title}
                          >
                            <Compass size={12} className="shrink-0 text-sky-200" />
                            <span>{resolvedLabel}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : isBorrowed ? (
                          <Link
                            href={resolvedUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={`เปิดอ่านหนังสือที่ยืมแล้ว: ${item.title}`}
                          >
                            <BookOpen size={12} className="shrink-0" />
                            <span>เปิดอ่าน (ยืมแล้ว)</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        ) : (
                          <Link
                            href={resolvedUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white text-[11px] sm:text-xs font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={`ยืมหนังสือลิขสิทธิ์: ${item.title}`}
                          >
                            <BookMarked size={12} className="shrink-0" />
                            <span>{resolvedLabel}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        )}
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
                    ? 'w-7 bg-sky-400 shadow-2xs'
                    : 'w-2 bg-white/40 hover:bg-white/70'
                }`}
                title={`ไปที่หน้าต่างชุดที่ ${idx + 1}`}
                aria-label={`ไปที่หน้าต่างชุดที่ ${idx + 1}`}
              />
            ))}
          </div>
        )}

        {/* 4. Autoplay Progress Countdown Bar (8s per slide) */}
        {isPlaying && !isHovered && totalCards > visibleCount && (
          <div className="max-w-[160px] mx-auto h-0.5 bg-white/20 rounded-full overflow-hidden mt-1.5">
            <div 
              key={progressKey}
              className="h-full bg-gradient-to-r from-amber-300 via-sky-300 to-white banner-progress-bar-active rounded-full"
            />
          </div>
        )}

      </div>
    </section>
  );
}
