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
  Compass
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
  btnBg: string;              // button background style
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
    btnBg: 'bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 hover:from-emerald-700 hover:to-sky-700 text-white',
  },
  sky: {
    name: 'ฟ้าอ่อน',
    cardBg: 'bg-sky-50/70 hover:bg-sky-50/95',
    cardBorder: 'border-sky-200/80 hover:border-sky-300',
    badgeBg: 'bg-sky-100/90 text-sky-800 border-sky-200/90',
    accentText: 'text-sky-700',
    dotColor: 'bg-sky-500',
    glowShadow: 'hover:shadow-sky-200/40',
    btnBg: 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white',
  },
  rose: {
    name: 'ชมพูอ่อน',
    cardBg: 'bg-rose-50/70 hover:bg-rose-50/95',
    cardBorder: 'border-rose-200/80 hover:border-rose-300',
    badgeBg: 'bg-rose-100/90 text-rose-800 border-rose-200/90',
    accentText: 'text-rose-700',
    dotColor: 'bg-rose-500',
    glowShadow: 'hover:shadow-rose-200/40',
    btnBg: 'bg-gradient-to-r from-rose-500 via-pink-600 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white',
  },
  cream: {
    name: 'ครีมทอง',
    cardBg: 'bg-amber-50/75 hover:bg-amber-50/95',
    cardBorder: 'border-amber-200/80 hover:border-amber-300',
    badgeBg: 'bg-amber-100/90 text-amber-900 border-amber-300/90',
    accentText: 'text-amber-800',
    dotColor: 'bg-amber-500',
    glowShadow: 'hover:shadow-amber-200/40',
    btnBg: 'bg-gradient-to-r from-[#D9A441] via-amber-500 to-[#B37E22] hover:from-amber-600 hover:to-amber-700 text-white shadow-amber-500/20',
  },
  orange: {
    name: 'ฟ้าครามไซแอน',
    cardBg: 'bg-cyan-50/60 hover:bg-cyan-50/90',
    cardBorder: 'border-cyan-200/80 hover:border-cyan-300',
    badgeBg: 'bg-cyan-100/90 text-cyan-800 border-cyan-200/90',
    accentText: 'text-cyan-700',
    dotColor: 'bg-cyan-500',
    glowShadow: 'hover:shadow-cyan-200/40',
    btnBg: 'bg-gradient-to-r from-cyan-600 via-sky-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white',
  },
  indigo: {
    name: 'ม่วงลาเวนเดอร์',
    cardBg: 'bg-indigo-50/60 hover:bg-indigo-50/90',
    cardBorder: 'border-indigo-200/80 hover:border-indigo-300',
    badgeBg: 'bg-indigo-100/90 text-indigo-800 border-indigo-200/90',
    accentText: 'text-indigo-700',
    dotColor: 'bg-indigo-500',
    glowShadow: 'hover:shadow-indigo-200/40',
    btnBg: 'bg-gradient-to-r from-indigo-600 via-indigo-700 to-sky-700 hover:from-indigo-700 hover:to-sky-800 text-white',
  },
  teal: {
    name: 'เขียวน้ำทะเล',
    cardBg: 'bg-teal-50/70 hover:bg-teal-50/95',
    cardBorder: 'border-teal-200/80 hover:border-teal-300',
    badgeBg: 'bg-teal-100/90 text-teal-800 border-teal-200/90',
    accentText: 'text-teal-700',
    dotColor: 'bg-teal-500',
    glowShadow: 'hover:shadow-teal-200/40',
    btnBg: 'bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white',
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

// 10 Curated Highlight Showcase Items (BKK Library Style)
export const DEFAULT_10_SHOWCASE_CARDS: ShowcaseCard[] = [
  // 1. แนะนำหนังสือ: ทำใจให้พร้อมบวก (ตามคำสั่งผู้ใช้ แนะนำเด่นลำดับแรก)
  {
    id: 'book_tam_jai_hai_prom_buak',
    type: 'book',
    title: 'ทำใจให้พร้อมบวก',
    description: 'สร้างสุขที่แท้จริง เปลี่ยนวิกฤตเป็นโอกาส ด้วยสูตรสำเร็จ 3 ประการ: "ยอมรับ เข้าใจ เกิดประโยชน์"',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    categoryName: 'ปรัชญา จิตวิทยา & ฝึกสมาธิ',
    badgeLabel: '📖 หนังสือแนะนำ',
    themeKey: 'mint',
    actionUrl: '/reader/book_tam_jai_hai_prom_buak',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 2. วาระอายุวัฒนมงคล ๖๕ ปี พระอาจารย์ (รูปที่ผู้ใช้ส่งมาเนื่องในวันเกิดพระอาจารย์)
  {
    id: 'muthita-65-years',
    type: 'welcome',
    title: 'มุทิตาสักการะ วาระอายุวัฒนมงคล ๖๕ ปี',
    description: 'น้อมกราบมุทิตาสักการะ ๖๕ ปี ๔๓ พรรษา พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) วันอาทิตย์ที่ ๑๕ พฤศจิกายน ๒๕๖๙',
    coverImage: '/images/banners/banner-muthita-65-years.jpg',
    categoryName: 'วาระมงคลพิเศษ',
    badgeLabel: '🎉 ๖๕ ปี ๔๓ พรรษา',
    themeKey: 'cream',
    actionUrl: '/welcome',
    actionLabel: 'ร่วมมุทิตาสักการะ',
    isCopyright: false,
  },

  // 3. อยู่สุขในยุคดิจิทัล (รูปภาพปกแบนเนอร์ใหม่ที่ผู้ใช้เจนมา)
  {
    id: 'book_yoo_sook_nai_yook_digital',
    type: 'book',
    title: 'อยู่สุขในยุคดิจิทัล',
    description: 'ศิลปะในการเรียนรู้ และรับมือผู้คนบนโลกออนไลน์อย่างมีความสุข พร้อมฉบับเปิดอ่านและ E-Book บน MEB',
    coverImage: '/images/banners/banner-yoo-sook-digital.jpg',
    categoryName: 'วิถีชีวิตดิจิทัล & E-Book',
    badgeLabel: '✨ ผลงานใหม่ล่าสุด',
    themeKey: 'sky',
    actionUrl: '/reader/book_yoo_sook_nai_yook_digital',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 4. สมดุลเท่ากับดี
  {
    id: 'book_สมดุลเท่ากับดี',
    type: 'book',
    title: 'สมดุลเท่ากับดี',
    description: 'ปรับสมดุลกายและใจให้ลงตัว ทำงานอย่างมีความสุข ชีวิตราบรื่นด้วยหลักมัชฌิมาปฏิปทา',
    coverImage: '/images/books/สมดุลเท่ากับดี.jpg',
    categoryName: 'การทำงาน & ความสำเร็จ',
    badgeLabel: '📖 หนังสือแนะนำ',
    themeKey: 'orange',
    actionUrl: '/reader/book_สมดุลเท่ากับดี',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 5. เขาก็สุข เราก็สุข
  {
    id: 'book_khao_kor_sook_rao_kor_sook',
    type: 'book',
    title: 'เขาก็สุข เราก็สุข',
    description: 'เปลี่ยนศัตรูให้เป็นมิตร ศิลปะป้องกันใจ และสร้างมิตรภาพอันงดงามร่วมกันในสังคม',
    coverImage: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    categoryName: 'มิตรภาพ & สังคม',
    badgeLabel: '📖 หนังสือแนะนำ',
    themeKey: 'mint',
    actionUrl: '/reader/book_khao_kor_sook_rao_kor_sook',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 6. ความสุข 360 องศา
  {
    id: 'book_ความสุข-360-องศา',
    type: 'book',
    title: 'ความสุข 360 องศา',
    description: 'กะเทาะเปลือกความทุกข์ ค้นพบความสุขรอบตัวในทุกมิติของชีวิตอย่างยั่งยืนจากภายใน',
    coverImage: '/images/books/ความสุข-360-องศา.jpg',
    categoryName: 'ความสุข & ความสงบใจ',
    badgeLabel: '📖 หนังสือแนะนำ',
    themeKey: 'rose',
    actionUrl: '/reader/book_ความสุข-360-องศา',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 7. อย่ามโน!! รักแท้มันใหญ่มาก
  {
    id: 'book_อย่ามโน',
    type: 'book',
    title: 'อย่ามโน!! รักแท้มันใหญ่มาก',
    description: 'ดึงสติไม่ให้หลงไปตามอารมณ์ ค้นพบความจริงของชีวิตด้วยสัมมาทิฏฐิและความรู้เท่าทันใจตนเอง',
    coverImage: '/images/books/อย่ามโน.jpg',
    categoryName: 'พัฒนาจิตใจ & ฝึกสติ',
    badgeLabel: '📖 หนังสือแนะนำ',
    themeKey: 'indigo',
    actionUrl: '/reader/book_อย่ามโน',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 8. เลี้ยงลูกสไตล์สุข
  {
    id: 'book_liang_look_style_sook',
    type: 'book',
    title: 'เลี้ยงลูกสไตล์สุข',
    description: 'วิธีบ่มเพาะลูกวัยใสให้เป็นลูกแก้วสารพัดนึก ให้โตขึ้นเป็นทั้งเด็กเก่งและดี ตามหลักพุทธวิธี',
    coverImage: '/images/books/liang-look-style-sook.jpg',
    categoryName: 'ครอบครัว & สุขภาพใจ',
    badgeLabel: '✨ เล่มมาใหม่',
    themeKey: 'teal',
    actionUrl: '/reader/book_liang_look_style_sook',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 9. มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า
  {
    id: 'book_mongkol_chiwit_124',
    type: 'book',
    title: 'มงคลชีวิต 38 ประการ',
    description: 'แผนที่ชีวิตฉบับสมบูรณ์ ก้าวแรกแห่งปัญญาสู่ความสุขแท้จริงตามหลักพระพุทธศาสนา',
    coverImage: '/images/books/mongkol-124.jpg',
    categoryName: 'หลักธรรม & มงคลชีวิต',
    badgeLabel: '👑 ยอดนิยม',
    themeKey: 'cream',
    actionUrl: '/reader/book_mongkol_chiwit_124',
    actionLabel: 'เปิดอ่านหนังสือ (Flipbook)',
    isCopyright: true,
  },

  // 10. แบบประเมินห้องสมุด รับ 200 แต้ม
  {
    id: 'item-survey-200',
    type: 'survey',
    title: 'ตอบแบบสอบถาม รับทันที 200 แต้ม! 🪙',
    description: 'ร่วมทำแบบประเมินคุณภาพเว็บไซต์และห้องสมุดดิจิทัล กรอกอีเมลสมาชิกแล้วกดยืนยันรับ 200 แต้มบุญสะสมทันที',
    categoryName: 'ภารกิจรับแต้มฟรี',
    badgeLabel: '🪙 รับ 200 แต้มบุญ',
    themeKey: 'cream',
    actionUrl: '/survey',
    actionLabel: 'ทำแบบประเมิน รับ 200 แต้ม',
    isSurveyTrigger: true,
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

      {/* Rosy Cheeks */}
      <ellipse cx="58" cy="78" rx="6" ry="4" fill="#FFAB91" opacity="0.65" />
      <ellipse cx="102" cy="78" rx="6" ry="4" fill="#FFAB91" opacity="0.65" />

      {/* 200 Coin Badge in Hands */}
      <circle cx="80" cy="116" r="18" fill="url(#miniCoinGrad)" stroke="#B45309" strokeWidth="2" />
      <text x="80" y="114" textAnchor="middle" fontSize="10" fontWeight="900" fill="#78350F" fontFamily="sans-serif">200</text>
      <text x="80" y="124" textAnchor="middle" fontSize="7" fontWeight="bold" fill="#78350F" fontFamily="sans-serif">แต้มบุญ</text>
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
  // Use custom showcase items, or default curated 10 items
  const items: ShowcaseCard[] = React.useMemo(() => {
    if (showcaseItems && showcaseItems.length > 0) {
      return showcaseItems;
    }
    return DEFAULT_10_SHOWCASE_CARDS;
  }, [showcaseItems]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const [progressKey, setProgressKey] = useState(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const mouseStartXRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Responsive items count: Mobile 1, Tablet 2, Desktop 3
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

  // Trigger Survey Modal
  const handleTriggerSurvey = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-survey-modal'));
    }
  };

  // Empty State handling
  if (totalCards === 0) {
    return null;
  }

  // Calculate slide percentage width
  const cardWidthPercent = 100 / visibleCount;

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
          
          {/* Left: Dot + Title + Badge */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D9A441] opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D9A441] ring-2 ring-amber-200/50" />
            </span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-white tracking-tight flex items-center gap-2 truncate">
              <span>{title}</span>
              <span className="text-[11px] font-bold text-white bg-white/20 border border-white/30 px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1 shadow-2xs backdrop-blur-xs">
                <Sparkles size={11} className="text-[#D9A441]" />
                <span>{badge}</span>
                <span className="text-sky-100 font-normal">({totalCards} รายการ)</span>
              </span>
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

              return (
                <div 
                  key={`${item.id}-${index}`}
                  className="px-1.5 sm:px-2 shrink-0"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  <div
                    className="group relative rounded-2xl overflow-hidden bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-row items-center gap-3.5 sm:gap-4 min-h-[175px] sm:min-h-[190px] h-full hover:-translate-y-1"
                  >
                    
                    {/* LEFT COLUMN: Visual Slot (Book Spine / Custom Image / Mascot) */}
                    {item.type === 'survey' ? (
                      /* Survey Visual: Cute Novice Monk with 200 Coin */
                      <button
                        type="button"
                        onClick={handleTriggerSurvey}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-gradient-to-br from-amber-100 via-orange-50 to-amber-200/90 shadow-md border border-amber-300 flex flex-col items-center justify-center p-1 group-hover:scale-102 transition-transform duration-300 cursor-pointer"
                        title="คลิกเพื่อทำแบบประเมิน รับทันที 200 แต้ม"
                      >
                        <div className="w-full h-full p-1 flex items-center justify-center">
                          <MiniNoviceMascot />
                        </div>
                        <span className="absolute bottom-1 px-1.5 py-0.5 rounded-full bg-[#D9A441] text-white text-[8px] font-extrabold shadow-xs">
                          🪙 200 P
                        </span>
                      </button>
                    ) : (
                      /* Book / Banner Poster: 3D Book Cover with Spine Line */
                      <Link
                        href={item.actionUrl}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-white shadow-[2px_4px_12px_rgba(0,0,0,0.14)] border border-slate-200/70 group-hover:shadow-[3px_6px_16px_rgba(0,0,0,0.18)] transition-shadow duration-300 block"
                        title={item.title}
                      >
                        {/* 3D Spine Highlight */}
                        <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
                        {/* Right Edge Page-stack Simulation */}
                        <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />
                        
                        {item.coverImage ? (
                          <Image
                            src={encodeURI(item.coverImage)}
                            alt={`ปก ${item.title}`}
                            fill
                            loading={index < 3 ? 'eager' : 'lazy'}
                            className="object-cover group-hover:scale-103 transition-transform duration-300"
                            sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-sky-600" />
                          </div>
                        )}

                        {/* Red 'ลิขสิทธิ์' Badge */}
                        {item.isCopyright && (
                          <div className="absolute top-1 left-1 z-20 select-none">
                            <span className="bg-rose-700/90 text-white font-semibold text-[7.5px] leading-none px-1.5 py-0.5 rounded shadow-2xs">
                              ลิขสิทธิ์
                            </span>
                          </div>
                        )}
                      </Link>
                    )}

                    {/* RIGHT COLUMN: Details & Clear Action Button */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                      <div>
                        {/* Top: Category Badge & Badges */}
                        <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                          <span className={`text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full border shadow-2xs flex items-center gap-1 ${theme.badgeBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${theme.dotColor}`} />
                            <span className="truncate max-w-[130px] sm:max-w-none">{item.categoryName}</span>
                          </span>

                          {item.badgeLabel && (
                            <span className="text-[9.5px] font-bold text-sky-800 bg-sky-100/90 border border-sky-200/90 px-1.5 py-0.5 rounded-full">
                              {item.badgeLabel}
                            </span>
                          )}

                          {item.isCopyright && (
                            <span className="text-[9.5px] font-bold text-rose-800 bg-rose-100/90 border border-rose-200/90 px-1.5 py-0.5 rounded-full">
                              ลิขสิทธิ์
                            </span>
                          )}
                        </div>

                        {/* Title: High Contrast Slate-800 */}
                        {item.isSurveyTrigger ? (
                          <button
                            type="button"
                            onClick={handleTriggerSurvey}
                            className="text-left cursor-pointer"
                          >
                            <h3 
                              className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-amber-800 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug"
                              title={item.title}
                            >
                              {item.title}
                            </h3>
                          </button>
                        ) : (
                          <Link href={item.actionUrl}>
                            <h3 
                              className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug"
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

                      {/* Bottom Button */}
                      <div className="mt-2.5 pt-1.5">
                        {item.isSurveyTrigger ? (
                          <button
                            type="button"
                            onClick={handleTriggerSurvey}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white text-[11px] sm:text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title="ทำแบบประเมิน รับทันที 200 แต้ม"
                          >
                            <Coins size={12} className="shrink-0 text-amber-200" />
                            <span>{item.actionLabel}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        ) : (
                          <Link
                            href={item.actionUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white text-[11px] sm:text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={`เปิดอ่านหนังสือ: ${item.title}`}
                          >
                            <BookOpen size={12} className="shrink-0" />
                            <span>{item.actionLabel}</span>
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
