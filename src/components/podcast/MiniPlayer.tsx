'use client';

import React from 'react';
import Image from 'next/image';
import { 
  Play, 
  Pause, 
  Maximize2, 
  X, 
  Headphones, 
  Radio, 
  RotateCcw, 
  RotateCw,
  AlertCircle
} from 'lucide-react';
import { usePodcastPlayer } from '@/context/PodcastPlayerContext';
import { formatDuration } from '@/lib/youtubeUtils';

export default function MiniPlayer() {
  const {
    currentPodcast,
    sourceType,
    isPlaying,
    isLoading,
    isExpanded,
    currentTime,
    duration,
    playbackRate,
    playbackError,
    togglePlay,
    seekRelative,
    setPlaybackRate,
    expandPlayer,
    closePlayer
  } = usePodcastPlayer();

  // If no podcast is selected, or if expanded modal is currently shown, hide mini player bar
  if (!currentPodcast || isExpanded) return null;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  return (
    <aside 
      aria-label="แถบเล่นพอดแคสต์ (Mini Player)"
      className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-30 bg-[#073B65] text-white shadow-2xl border-t border-white/10 transition-all duration-300 select-none pb-[env(safe-area-inset-bottom)]"
    >
      {/* Tiny Progress Bar on top edge */}
      <div className="w-full h-1 bg-white/15 relative overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-[#079FE8] via-sky-400 to-[#D9A441] transition-all duration-200"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3">
        
        {/* ========================================================= */}
        {/* LEFT: Cover & Track Info (Clickable to Expand)            */}
        {/* ========================================================= */}
        <div 
          onClick={expandPlayer}
          className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 max-w-[50%] sm:max-w-[40%] cursor-pointer group"
          title="คลิกเพื่อขยายเครื่องเล่นเต็มหน้าต่าง"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 shadow-md ring-1 ring-white/20 group-hover:scale-105 transition-transform bg-slate-900">
            <Image
              src={currentPodcast.cover_image || '/images/books/tam-jai-hai-prom-buak.jpg'}
              alt={currentPodcast.title}
              fill
              className="object-cover"
              unoptimized
            />
            {isPlaying && (
              <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-white animate-pulse" />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                sourceType === 'mp3' 
                  ? 'bg-amber-400 text-amber-950 font-bold' 
                  : 'bg-red-600 text-white font-bold'
              }`}>
                {sourceType === 'mp3' ? 'MP3' : 'YouTube'}
              </span>
              <span className="text-[10px] text-sky-200 truncate hidden md:inline">
                {currentPodcast.host}
              </span>
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white truncate leading-tight group-hover:text-sky-200 transition-colors">
              {currentPodcast.title}
            </h4>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER: Play/Pause & Timers                               */}
        {/* ========================================================= */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => seekRelative(-10)}
            className="hidden sm:inline-flex p-1.5 text-sky-200 hover:text-white transition-colors cursor-pointer"
            title="ย้อนหลัง 10 วินาที"
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={togglePlay}
            disabled={isLoading}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white flex items-center justify-center shadow-md shadow-[#079FE8]/40 active:scale-95 transition-transform cursor-pointer shrink-0"
            title={isPlaying ? 'หยุดชั่วคราว' : 'เล่นต่อ'}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause size={17} />
            ) : (
              <Play size={17} className="ml-0.5" />
            )}
          </button>

          <button
            onClick={() => seekRelative(10)}
            className="hidden sm:inline-flex p-1.5 text-sky-200 hover:text-white transition-colors cursor-pointer"
            title="ข้ามไปข้างหน้า 10 วินาที"
          >
            <RotateCw size={16} />
          </button>

          {/* Time Display */}
          <div className="text-[10px] sm:text-xs font-mono text-sky-200 whitespace-nowrap hidden xs:inline">
            <span className="font-bold text-white">{formatDuration(currentTime)}</span>
            <span className="opacity-60"> / {formatDuration(duration)}</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT: Speed, Expand & Close                              */}
        {/* ========================================================= */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Speed Toggle */}
          <button
            onClick={() => {
              const speeds = [1, 1.25, 1.5, 0.75];
              const next = speeds[(speeds.indexOf(playbackRate) + 1) % speeds.length];
              setPlaybackRate(next);
            }}
            className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[10px] font-mono font-bold transition-colors cursor-pointer hidden sm:inline-block"
            title="ความเร็วในการเล่น"
          >
            {playbackRate}x
          </button>

          {/* Expand Modal Button */}
          <button
            onClick={expandPlayer}
            className="p-1.5 sm:p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="ขยายเป็นหน้าต่างเต็ม"
            aria-label="ขยายเป็นหน้าต่างเต็ม"
          >
            <Maximize2 size={16} />
          </button>

          {/* Close Player Button */}
          <button
            onClick={closePlayer}
            className="p-1.5 sm:p-2 rounded-xl text-sky-200 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            title="ปิดเครื่องเล่นเสียง"
            aria-label="ปิดเครื่องเล่นเสียง"
          >
            <X size={18} />
          </button>
        </div>

      </div>
    </aside>
  );
}
