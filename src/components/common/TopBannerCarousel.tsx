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
  Video, 
  Compass, 
  Coins, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useLoan } from '@/context/LoanContext';

export interface MebBannerSlide {
  id: string;
  type: 'book' | 'podcast' | 'video' | 'survey' | 'welcome';
  title: string;
  subtitle: string;
  description: string;
  coverImage: string;
  badge: string;
  targetUrl: string;
  themeGradient: string; // Rich colorful background theme for the whole banner
  glowColor: string;
  tagColor: string;
}

export const HERO_SLIDES: MebBannerSlide[] = [
  // 1. มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า
  {
    id: 'slide-mongkol-38',
    type: 'book',
    title: 'มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า',
    subtitle: 'แผนที่ชีวิตฉบับสมบูรณ์ 433 หน้าแห่งปัญญา',
    description: 'บันได 10 ขั้นแห่งการพัฒนาตนเอง ตั้งแต่ก้าวแรกของการไม่คบคนพาล จนถึงจิตเกษมไม่หวั่นไหวในโลกธรรม คำสอนอันทรงคุณค่าโดย พระครูปลัดสุวัฒนโพธิคุณ',
    coverImage: '/images/books/mongkol-124.jpg',
    badge: '👑 อันดับ 1 ยอดนิยมสูงสุด',
    targetUrl: '/books/book_mongkol_chiwit_124',
    themeGradient: 'from-[#072B4A] via-[#0B4B7F] to-[#079FE8]',
    glowColor: 'bg-sky-400/20',
    tagColor: 'bg-amber-400 text-slate-950',
  },
  // 2. ทำใจให้พร้อมบวก
  {
    id: 'slide-tamjai-prombuak',
    type: 'book',
    title: 'ทำใจให้พร้อมบวก',
    subtitle: 'สร้างสุขที่แท้จริง เปลี่ยนวิกฤตเป็นโอกาสด้วยปัญญาธรรม',
    description: 'สูตรสำเร็จ 3 ประการ "ยอมรับ เข้าใจ เกิดประโยชน์" ดึงมุมมองความคิดสร้างสรรค์ นำพาสติและความสุขสงบสู่ชีวิตประจำวัน',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    badge: '✨ หนังสือแนะนำประจำสัปดาห์',
    targetUrl: '/books/book_tam_jai_hai_prom_buak',
    themeGradient: 'from-[#044E54] via-[#0D7C85] to-[#14B8A6]',
    glowColor: 'bg-teal-400/20',
    tagColor: 'bg-emerald-300 text-teal-950',
  },
  // 3. อย่ามโน
  {
    id: 'slide-ya-mano',
    type: 'book',
    title: 'อย่ามโน',
    subtitle: 'ดึงสติรู้เท่าทันความคิด สลายภาพลวงตาด้วยสัมมาทิฏฐิ',
    description: 'เรียนรู้วิธีหยุดความคิดฟุ้งซ่านและอุปาทานที่หลอกหลอนตนเอง คืนความปลอดโปร่งและสันติสุขแท้จริงสู่ใจด้วยสติในปัจจุบันขณะ',
    coverImage: '/images/books/อย่ามโน.jpg',
    badge: '🌸 พัฒนาจิตใจ & ฝึกสติ',
    targetUrl: '/books/book_อย่ามโน',
    themeGradient: 'from-[#701A75] via-[#9D174D] to-[#F43F5E]',
    glowColor: 'bg-rose-400/20',
    tagColor: 'bg-pink-300 text-rose-950',
  },
  // 4. สมดุลเท่ากับดี
  {
    id: 'slide-samdun-dee',
    type: 'book',
    title: 'สมดุลเท่ากับดี',
    subtitle: 'มัชฌิมาปฏิปทาเพื่อการทำงานและการใช้ชีวิตที่ยั่งยืน',
    description: 'รักษาสมดุล กาย-ใจ-งาน ไม่ตึงจนหมดไฟ และไม่หย่อนจนคั่งค้าง ประสบความสำเร็จอย่างมีความสุขตามหลักธรรมร่วมสมัย',
    coverImage: '/images/books/สมดุลเท่ากับดี.jpg',
    badge: '🌿 การทำงาน & ความสำเร็จ',
    targetUrl: '/books/book_สมดุลเท่ากับดี',
    themeGradient: 'from-[#14532D] via-[#15803D] to-[#22C55E]',
    glowColor: 'bg-emerald-400/20',
    tagColor: 'bg-lime-300 text-emerald-950',
  },
  // 5. พอดแคสต์ทำใจให้พร้อมบวก
  {
    id: 'slide-podcast-tamjai',
    type: 'podcast',
    title: 'พอดแคสต์ "ทำใจให้พร้อมบวก" (5 ตอนจบ)',
    subtitle: 'ฟังเพลิน เติมพลังใจ ได้ทุกที่ทุกเวลา',
    description: 'เสียงบรรยายธรรมะฟังสบาย ถ่ายทอดแก่นคิดและกำลังใจจากหนังสือเล่มโปรด ให้คุณเริ่มต้นวันใหม่อย่างสดใสและมีสติ',
    coverImage: '/images/books/tam-jai-hai-prom-buak.jpg',
    badge: '🎧 พอดแคสต์ซีรีส์ยอดนิยม',
    targetUrl: '/audios?podcast=pod-tam-jai-hai-prom-buak',
    themeGradient: 'from-[#4C1D95] via-[#6D28D9] to-[#8B5CF6]',
    glowColor: 'bg-purple-400/20',
    tagColor: 'bg-purple-200 text-purple-950',
  },
  // 6. แบบประเมินคุณภาพห้องสมุด รับ 200 แต้ม
  {
    id: 'slide-survey-200',
    type: 'survey',
    title: 'ร่วมตอบแบบประเมินห้องสมุดดิจิทัล',
    subtitle: 'รับทันที 200 แต้มสะสมแลกรับของรางวัลที่ระลึก',
    description: 'ช่วยเราพัฒนาคุณภาพบริการ Thanavuddho Digital Library ให้ดียิ่งขึ้น ตอบแบบสอบถามง่ายๆ ใน 2 นาที รับแต้มสะสมเข้าสู่บัญชีสมาชิกทันที',
    coverImage: '/images/rewards/bookmark-mongkol.jpg',
    badge: '🪙 ภารกิจรับแต้ม 200 P',
    targetUrl: '/survey',
    themeGradient: 'from-[#78350F] via-[#B45309] to-[#D9A441]',
    glowColor: 'bg-amber-400/20',
    tagColor: 'bg-amber-200 text-amber-950',
  }
];

interface TopBannerCarouselProps {
  autoPlayIntervalMs?: number;
}

export default function TopBannerCarousel({ autoPlayIntervalMs = 6500 }: TopBannerCarouselProps = {}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { isMediaBorrowed } = useLoan();

  const total = HERO_SLIDES.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + total) % total);
  }, [total]);

  // Autoplay (6.5s interval like meb/standard stores)
  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(() => {
        nextSlide();
      }, 6500);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, nextSlide]);

  const active = HERO_SLIDES[currentIndex];
  const isBorrowed = active.type === 'book' && isMediaBorrowed(active.targetUrl.replace('/books/', ''));
  const finalUrl = isBorrowed ? active.targetUrl.replace('/books/', '/reader/') : active.targetUrl;

  return (
    <section 
      className="relative w-full overflow-hidden select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="แบนเนอร์ประชาสัมพันธ์ห้องสมุดดิจิทัล"
    >
      {/* FULL-WIDTH BANNER STAGE (mebmarket & 2ebook inspired) */}
      <div className={`relative w-full bg-gradient-to-r ${active.themeGradient} transition-colors duration-700 ease-in-out`}>
        
        {/* Soft Background Texture & Ambient Lighting */}
        <div className={`absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${active.glowColor}`} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black/25 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
          
          {/* Entire Banner is 1 Clickable Container */}
          <Link
            href={finalUrl}
            className="group relative flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 lg:gap-12 cursor-pointer focus:outline-none"
            title={`${active.title} — คลิกเพื่อเข้าสู่เนื้อหา`}
          >
            {/* LEFT / CENTER: Promotional Text & Book Info */}
            <div className="flex-1 min-w-0 text-white z-10 text-center md:text-left space-y-3 sm:space-y-4">
              
              {/* Category / Campaign Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold shadow-md tracking-wide"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(8px)' }}
              >
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${active.tagColor}`}>
                  {active.badge}
                </span>
                <span className="text-white/90 text-xs font-medium">Thanavuddho Digital Library</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md group-hover:text-amber-200 transition-colors">
                {active.title}
              </h1>

              {/* Subtitle / Catchphrase */}
              <p className="text-sm sm:text-base lg:text-lg font-bold text-white/90 drop-shadow-xs max-w-2xl">
                {active.subtitle}
              </p>

              {/* Narrative Description */}
              <p className="text-xs sm:text-sm text-white/80 leading-relaxed max-w-2xl line-clamp-3 md:line-clamp-none font-normal">
                {active.description}
              </p>

              {/* High-visibility Action Indicator (Click to enter) */}
              <div className="pt-2 sm:pt-4 flex items-center justify-center md:justify-start gap-3">
                <span className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow-xl hover:bg-amber-300 transition-all group-hover:scale-105 active:scale-95">
                  {active.type === 'podcast' ? (
                    <Headphones size={16} className="text-purple-600" />
                  ) : active.type === 'survey' ? (
                    <Coins size={16} className="text-amber-500" />
                  ) : (
                    <BookOpen size={16} className="text-[#079FE8]" />
                  )}
                  <span>{isBorrowed ? 'คลิกเปิดอ่านได้ทันที' : 'เข้าสู่หน้าหนังสือ / เนื้อหา'}</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
                <span className="hidden sm:inline-block text-xs text-white/70 font-light">
                  *กดที่ป้ายหรือรูปภาพเพื่อเปิดหน้าเนื้อหา
                </span>
              </div>

            </div>

            {/* RIGHT: High-Definition 3D Book Showcase */}
            <div className="relative shrink-0 flex items-center justify-center z-10">
              <div className="relative w-44 sm:w-56 md:w-64 lg:w-72 aspect-[1/1.42] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-2 border-white/30 group-hover:scale-104 group-hover:shadow-[0_25px_60px_rgba(0,0,0,0.65)] transition-all duration-500 bg-slate-900">
                {/* 3D Spine Highlight */}
                <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-r from-black/40 via-white/30 to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 inset-y-0 w-1 bg-slate-300/80 z-20 pointer-events-none" />

                <Image
                  src={active.coverImage}
                  alt={active.title}
                  fill
                  priority
                  className="object-cover"
                  unoptimized
                />

                {/* Subtle Gloss Sheen Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/20 pointer-events-none" />
              </div>
            </div>

          </Link>

        </div>

        {/* BOTTOM CONTROLS & PAGINATION (meb style) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 sm:pb-4 flex items-center justify-between gap-4 border-t border-white/10 pt-2 sm:pt-3">
          
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  idx === currentIndex 
                    ? 'w-7 sm:w-8 h-2 sm:h-2.5 bg-white shadow-md' 
                    : 'w-2 sm:w-2.5 h-2 sm:h-2.5 bg-white/40 hover:bg-white/70'
                }`}
                title={`ไปที่สไลด์ ${idx + 1}: ${slide.title}`}
                aria-label={`ไปที่สไลด์ ${idx + 1}`}
              />
            ))}
          </div>

          {/* Controls: Prev / Next / Pause */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[11px] font-mono text-white/80 mr-1 sm:mr-2">
              {currentIndex + 1} / {total}
            </span>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              title={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
              aria-label={isPlaying ? 'หยุดเล่นอัตโนมัติ' : 'เล่นอัตโนมัติ'}
            >
              {isPlaying ? <Pause size={12} /> : <Play size={12} className="translate-x-0.5" />}
            </button>

            <button
              onClick={prevSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              title="สไลด์ก่อนหน้า"
              aria-label="สไลด์ก่อนหน้า"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={nextSlide}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/15 hover:bg-white/30 text-white flex items-center justify-center transition-all cursor-pointer"
              title="สไลด์ถัดไป"
              aria-label="สไลด์ถัดไป"
            >
              <ChevronRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
