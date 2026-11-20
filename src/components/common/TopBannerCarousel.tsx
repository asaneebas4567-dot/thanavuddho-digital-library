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
  ExternalLink
} from 'lucide-react';
import { FlexibleShowcaseItem, ShowcaseItemType } from '@/types';
import defaultHomeSettings from '@/data/homeShowcaseSettings.json';

interface TopBannerCarouselProps {
  showcaseItems?: FlexibleShowcaseItem[];
  title?: string;
  badge?: string;
  autoPlayIntervalMs?: number;
}

export default function TopBannerCarousel({
  showcaseItems,
  title = 'ไฮไลต์ห้องสมุดดิจิทัล',
  badge = 'รายการแนะนำ',
  autoPlayIntervalMs = 8000,
}: TopBannerCarouselProps) {
  // Live items state: initialized from props or default JSON, and synchronized with backend API
  const [items, setItems] = useState<FlexibleShowcaseItem[]>(() => {
    if (showcaseItems && showcaseItems.length > 0) {
      return showcaseItems.filter(item => item.is_active);
    }
    const defaultList = (defaultHomeSettings as any)?.showcaseItems || [];
    return defaultList.filter((item: FlexibleShowcaseItem) => item.is_active);
  });

  // Fetch updated settings from backend API on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/home-settings')
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.settings?.showcaseItems) {
          const activeItems = (data.settings.showcaseItems as FlexibleShowcaseItem[])
            .filter(item => item.is_active)
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          if (activeItems.length > 0) {
            setItems(activeItems);
          }
        }
      })
      .catch(() => {
        // Fallback silently to default items
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Autoplay handler (8000ms by default)
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
      aria-label="ไฮไลต์หน้าแรก Thanavuddho Digital Library"
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
        
        {/* 1. Header Bar: Title + Badge + Controls */}
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

        {/* 2. Carousel Viewport (Desktop 3, Tablet 2, Mobile 1) */}
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
              const targetUrl = item.target_url || (item.book_id ? `/reader/${item.book_id}` : '#');
              const isClickable = item.is_clickable !== false;
              const fitMode = item.fit_mode || (item.type === 'PROMOTIONAL_BANNER' ? 'cover' : 'contain');

              return (
                <div 
                  key={`${item.id}-${index}`}
                  className="px-1.5 sm:px-2 shrink-0"
                  style={{ width: `${cardWidthPercent}%` }}
                >
                  {/* ========================================================= */}
                  {/* TYPE A: IMAGE ONLY (แสดงเฉพาะภาพต้นฉบับ ไม่ซ้อนข้อความหรือปุ่ม) */}
                  {/* ========================================================= */}
                  {item.type === 'IMAGE_ONLY' ? (
                    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-white/40 h-[195px] sm:h-[210px] hover:-translate-y-1">
                      {isClickable ? (
                        <Link 
                          href={targetUrl}
                          className="w-full h-full relative block cursor-pointer group-hover:opacity-95 transition-opacity"
                          title={item.title || 'คลิกเพื่อดูรายละเอียด'}
                        >
                          <Image
                            src={encodeURI(item.image_url)}
                            alt={item.title || 'รูปภาพประชาสัมพันธ์'}
                            fill
                            priority={index < 3}
                            className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'} group-hover:scale-102 transition-transform duration-300`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-full relative block">
                          <Image
                            src={encodeURI(item.image_url)}
                            alt={item.title || 'รูปภาพประชาสัมพันธ์'}
                            fill
                            priority={index < 3}
                            className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'}`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  ) : 

                  /* ========================================================= */
                  /* TYPE C: PROMOTIONAL BANNER (ภาพแบนเนอร์เต็มพื้นที่)       */
                  /* ========================================================= */
                  item.type === 'PROMOTIONAL_BANNER' ? (
                    <div className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-300 border border-white/40 h-[195px] sm:h-[210px] hover:-translate-y-1">
                      {isClickable ? (
                        <Link 
                          href={targetUrl}
                          className="w-full h-full relative block cursor-pointer group-hover:opacity-95 transition-opacity"
                          title={item.title || 'คลิกเพื่อเข้าสู่เนื้อหา'}
                        >
                          <Image
                            src={encodeURI(item.image_url)}
                            alt={item.title || 'แบนเนอร์ประชาสัมพันธ์'}
                            fill
                            priority={index < 3}
                            className={`${fitMode === 'contain' ? 'object-contain' : 'object-cover'} group-hover:scale-102 transition-transform duration-300`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        </Link>
                      ) : (
                        <div className="w-full h-full relative block">
                          <Image
                            src={encodeURI(item.image_url)}
                            alt={item.title || 'แบนเนอร์ประชาสัมพันธ์'}
                            fill
                            priority={index < 3}
                            className={`${fitMode === 'contain' ? 'object-contain' : 'object-cover'}`}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  ) : 

                  /* ========================================================= */
                  /* TYPE B: BOOK SHOWCASE (ปก 2D แท้จากฐานข้อมูล พร้อมข้อมูลจริง) */
                  /* ========================================================= */
                  (
                    <div className="group relative rounded-2xl overflow-hidden bg-white p-3.5 sm:p-4 shadow-sm hover:shadow-md transition-all duration-300 border border-slate-100 flex flex-row items-center gap-3.5 sm:gap-4 h-[195px] sm:h-[210px] hover:-translate-y-1">
                      
                      {/* Left: Authentic 2D Book Cover (No fake 3D overlay) */}
                      <Link
                        href={targetUrl}
                        className="relative w-20 sm:w-24 md:w-28 shrink-0 aspect-[3/4.2] rounded-md sm:rounded-lg overflow-hidden bg-slate-50 shadow-md border border-slate-200/80 group-hover:shadow-lg transition-shadow duration-300 block cursor-pointer"
                        title={item.title}
                      >
                        {item.image_url ? (
                          <Image
                            src={encodeURI(item.image_url)}
                            alt={`ปก ${item.title}`}
                            fill
                            loading={index < 3 ? 'eager' : 'lazy'}
                            className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'} group-hover:scale-103 transition-transform duration-300`}
                            sizes="(max-width: 640px) 96px, (max-width: 1024px) 112px, 128px"
                            unoptimized
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-50 flex items-center justify-center">
                            <BookOpen className="w-8 h-8 text-sky-600" />
                          </div>
                        )}

                        {/* Red 'ลิขสิทธิ์' Badge */}
                        <div className="absolute top-1 left-1 z-10 select-none">
                          <span className="bg-rose-700/90 text-white font-semibold text-[7.5px] leading-none px-1.5 py-0.5 rounded shadow-2xs">
                            ลิขสิทธิ์
                          </span>
                        </div>
                      </Link>

                      {/* Right: Book Metadata & Action */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between h-full py-0.5">
                        <div>
                          {/* Badges Line */}
                          <div className="flex items-center flex-wrap gap-1.5 mb-1.5">
                            {item.badge ? (
                              <span className="text-[9.5px] font-bold text-sky-800 bg-sky-100/90 border border-sky-200/90 px-1.5 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            ) : (
                              <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100/90 border border-emerald-200/90 px-1.5 py-0.5 rounded-full">
                                📖 หนังสือแนะนำ
                              </span>
                            )}
                            <span className="text-[9.5px] font-bold text-rose-800 bg-rose-100/90 border border-rose-200/90 px-1.5 py-0.5 rounded-full">
                              ลิขสิทธิ์
                            </span>
                          </div>

                          {/* Title */}
                          <Link href={targetUrl}>
                            <h3 
                              className="text-xs sm:text-sm md:text-base font-bold text-slate-800 group-hover:text-sky-700 transition-colors line-clamp-1 sm:line-clamp-2 leading-snug"
                              title={item.title}
                            >
                              {item.title}
                            </h3>
                          </Link>

                          {/* Author */}
                          {item.author && (
                            <p className="text-[11px] font-medium text-slate-500 truncate mt-0.5">
                              {item.author}
                            </p>
                          )}

                          {/* Description */}
                          {item.description && (
                            <p className="text-[11px] sm:text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="mt-2.5 pt-1.5">
                          <Link
                            href={targetUrl}
                            className="inline-flex items-center gap-1 sm:gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white text-[11px] sm:text-xs font-bold shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                            title={`เปิดอ่านหนังสือ: ${item.title}`}
                          >
                            <BookOpen size={12} className="shrink-0" />
                            <span>{item.action_label || 'เปิดอ่านหนังสือ (Flipbook)'}</span>
                            <ChevronRight size={13} className="shrink-0 group-hover:translate-x-0.5 transition-transform" />
                          </Link>
                        </div>

                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Bottom Indicator Dots */}
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

        {/* 4. Autoplay Progress Countdown Bar */}
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
