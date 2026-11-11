'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Headphones, 
  Play, 
  Pause, 
  BookOpen, 
  Radio, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ExternalLink,
  Search,
  Filter,
  CheckCircle2,
  HardDrive,
  Tv,
  ListMusic,
  Maximize2
} from 'lucide-react';
import { usePodcastPlayer } from '@/context/PodcastPlayerContext';
import { PodcastItem } from '@/types/podcast';

function PodcastLibraryContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSource = searchParams.get('source') || 'all';

  const { currentPodcast, isPlaying, playPodcast, pausePodcast, resumePodcast, expandPlayer } = usePodcastPlayer();

  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSource, setSelectedSource] = useState<string>(initialSource);

  // Fetch podcasts from API
  useEffect(() => {
    fetch('/api/podcasts')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.podcasts)) {
          setPodcasts(data.podcasts);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Filtered podcasts
  const filteredPodcasts = useMemo(() => {
    return podcasts.filter((p) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description?.toLowerCase().includes(q);
        const matchesHost = p.host?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesHost) return false;
      }

      // 2. Category
      if (selectedCategory !== 'all') {
        if (p.category_id !== selectedCategory) return false;
      }

      // 3. Source Type
      if (selectedSource !== 'all') {
        if (p.source_type !== selectedSource) return false;
      }

      return true;
    });
  }, [podcasts, searchQuery, selectedCategory, selectedSource]);

  // Extract unique categories
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    podcasts.forEach(p => {
      if (p.category_id) {
        map.set(p.category_id, p.category_name || p.category_id);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [podcasts]);

  const handlePlayToggle = (podcast: PodcastItem) => {
    if (currentPodcast?.id === podcast.id) {
      if (isPlaying) pausePodcast();
      else resumePodcast();
    } else {
      playPodcast(podcast);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 sm:pb-24 pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* 1. HERO BANNER                                            */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0A4D82] to-[#079FE8] text-white p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-lg border border-[#073B65]/30">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#FEF08A] text-xs font-bold backdrop-blur-md border border-white/20 mb-3">
              <Headphones size={13} />
              <span>ระบบ Hybrid Podcast Player · YouTube & MP3 Stream</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3 leading-tight">
              ห้องสมุดพอดแคสต์ & <span className="text-sky-200">เสียงธรรมบรรยาย</span>
            </h1>
            <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed mb-4 max-w-2xl">
              ศูนย์รวมพอดแคสต์พัฒนาจิตใจ เสียงอ่านหนังสือลิขสิทธิ์ และธรรมเทศนาร่วมสมัย รองรับทั้งการรับชมผ่าน YouTube และการฟังเสียง MP3 ความคมชัดสูงพร้อมระบบเล่นพื้นหลังบนโทรศัพท์มือถือ
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-medium">
                <span>🔴 YouTube Podcasts ({podcasts.filter(p => p.source_type === 'youtube').length})</span>
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-medium">
                <span>🎵 MP3 Cloud Storage ({podcasts.filter(p => p.source_type === 'mp3').length})</span>
              </span>
              <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400 text-amber-950 font-bold shadow-xs">
                <span>🪙 ฟังครบ 10 นาที รับแต้ม +5P</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. SEARCH & FILTER CONTROLS                               */}
        {/* ========================================================= */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 mb-6 space-y-3.5">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder="ค้นหาชื่อตอน, ผู้บรรยาย, หรือเนื้อหาธรรมะ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#079FE8] bg-slate-50/50"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            </div>

            {/* Source Type Filter Tabs */}
            <div className="flex items-center p-1 bg-slate-100 rounded-xl shrink-0 self-stretch sm:self-auto">
              <button
                onClick={() => setSelectedSource('all')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedSource === 'all'
                    ? 'bg-white text-[#073B65] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ทั้งหมด
              </button>
              <button
                onClick={() => setSelectedSource('youtube')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedSource === 'youtube'
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-red-600'
                }`}
              >
                <span>YouTube</span>
              </button>
              <button
                onClick={() => setSelectedSource('mp3')}
                className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  selectedSource === 'mp3'
                    ? 'bg-[#073B65] text-white shadow-xs'
                    : 'text-slate-600 hover:text-[#073B65]'
                }`}
              >
                <span>MP3 Audio</span>
              </button>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer border ${
                selectedCategory === 'all'
                  ? 'bg-[#073B65] text-white border-[#073B65]'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              ทุกหมวดหมู่ ({podcasts.length})
            </button>
            {categories.map((cat) => {
              const count = podcasts.filter(p => p.category_id === cat.id).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat.id
                      ? 'bg-[#079FE8] text-white border-[#079FE8]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 3. PODCAST CATALOG GRID                                   */}
        {/* ========================================================= */}
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-9 h-9 border-3 border-[#079FE8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-500">กำลังโหลดรายการพอดแคสต์...</p>
          </div>
        ) : filteredPodcasts.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 p-8">
            <Headphones size={36} className="text-slate-300 mx-auto mb-2" />
            <h3 className="font-black text-slate-800 text-base">ไม่พบรายการพอดแคสต์ที่ตรงกับคำค้น</h3>
            <p className="text-xs text-slate-500 mt-1">ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-8">
            {filteredPodcasts.map((podcast) => {
              const isThisCurrent = currentPodcast?.id === podcast.id;
              const isThisPlaying = isThisCurrent && isPlaying;

              return (
                <div
                  key={podcast.id}
                  className={`group relative bg-white rounded-2xl sm:rounded-3xl border transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between hover:shadow-md ${
                    isThisCurrent 
                      ? 'border-[#079FE8] ring-2 ring-[#079FE8]/20 shadow-sm' 
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3.5 sm:gap-4 mb-3">
                    {/* Thumbnail / Cover */}
                    <div className="relative w-24 sm:w-28 aspect-square rounded-2xl overflow-hidden shrink-0 shadow-xs bg-slate-900 border border-slate-100">
                      <Image
                        src={podcast.cover_image || '/images/books/tam-jai-hai-prom-buak.jpg'}
                        alt={podcast.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      
                      {/* Play overlay button */}
                      <button
                        onClick={() => handlePlayToggle(podcast)}
                        className={`absolute inset-0 flex items-center justify-center transition-all cursor-pointer ${
                          isThisPlaying ? 'bg-black/40' : 'bg-black/25 group-hover:bg-black/40'
                        }`}
                        title={isThisPlaying ? 'หยุดเล่นชั่วคราว' : 'เปิดฟังตอนนี้'}
                      >
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-transform ${
                          isThisPlaying
                            ? 'bg-[#079FE8] text-white animate-pulse'
                            : 'bg-white/95 text-slate-800 group-hover:bg-[#079FE8] group-hover:text-white'
                        }`}>
                          {isThisPlaying ? <Pause size={17} /> : <Play size={17} className="ml-0.5" />}
                        </div>
                      </button>

                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-mono font-bold px-1 py-0.2 rounded">
                        {podcast.duration_formatted}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                          podcast.source_type === 'mp3'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300/60 font-bold'
                            : 'bg-red-50 text-red-700 border border-red-200/80 font-bold'
                        }`}>
                          {podcast.source_type === 'mp3' ? '🎵 MP3 Audio' : '🔴 YouTube'}
                        </span>
                        {podcast.order && (
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                            ตอนที่ {podcast.order}
                          </span>
                        )}
                        {isThisPlaying && (
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded flex items-center gap-1 animate-pulse">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            <span>กำลังเล่น</span>
                          </span>
                        )}
                      </div>

                      <h3 className={`text-xs sm:text-sm font-black leading-snug line-clamp-2 ${
                        isThisCurrent ? 'text-[#073B65]' : 'text-slate-900'
                      }`}>
                        {podcast.title}
                      </h3>

                      <p className="text-[11px] text-sky-700 font-semibold truncate mt-0.5">
                        {podcast.host}
                      </p>

                      <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {podcast.description}
                      </p>
                    </div>
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handlePlayToggle(podcast)}
                        className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1 transition-all cursor-pointer ${
                          isThisPlaying
                            ? 'bg-[#079FE8] text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-[#073B65] hover:text-white text-slate-700'
                        }`}
                      >
                        {isThisPlaying ? <Pause size={13} /> : <Play size={13} />}
                        <span>{isThisPlaying ? 'กำลังฟัง' : 'เปิดฟังตอนนี้'}</span>
                      </button>

                      {isThisCurrent && (
                        <button
                          onClick={expandPlayer}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer flex items-center gap-1"
                          title="ขยายเครื่องเล่น"
                        >
                          <Maximize2 size={12} />
                          <span className="hidden sm:inline">ขยาย</span>
                        </button>
                      )}
                    </div>

                    {podcast.book_id && (
                      <Link
                        href={`/reader/${podcast.book_id}`}
                        className="text-[11px] font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
                        title="เปิดอ่านหนังสือฉบับเต็มคู่ขนาน"
                      >
                        <BookOpen size={12} />
                        <span>อ่าน Flipbook</span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ========================================================= */}
        {/* 4. COMPANION FLIPBOOK PROMO CARD                          */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100/60 rounded-2xl sm:rounded-3xl border border-amber-200/80 p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="relative w-16 sm:w-20 aspect-[3/4.2] rounded-xl overflow-hidden shadow-md shrink-0 border border-amber-300">
              <Image
                src="/images/books/tam-jai-hai-prom-buak.jpg"
                alt="หนังสือ ทำใจให้พร้อมบวก"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-amber-800 bg-amber-200/80 px-2 py-0.5 rounded-full uppercase tracking-wide">
                หนังสือลิขสิทธิ์ฉบับเต็ม
              </span>
              <h4 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                ทำใจให้พร้อมบวก (ฉบับ E-Book Flipbook 2 หน้า)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mt-0.5 leading-relaxed">
                อ่านเนื้อหาต้นฉบับเต็มเล่มแบบเปิดหน้าเสมือนจริง ควบคู่ไปกับการเปิดฟังพอดแคสต์ในระบบ Hybrid Player
              </p>
            </div>
          </div>

          <Link
            href="/reader/book_tam_jai_hai_prom_buak"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#073B65] hover:bg-[#0A4D82] text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
          >
            <BookOpen size={14} className="text-[#FEF08A]" />
            <span>เปิดอ่านหนังสือฟรี</span>
            <ArrowRight size={13} />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function AudiosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="text-center p-8">
          <div className="w-10 h-10 border-4 border-[#079FE8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs font-bold text-[#073B65]">กำลังโหลดห้องสมุดพอดแคสต์...</p>
        </div>
      </div>
    }>
      <PodcastLibraryContent />
    </Suspense>
  );
}
