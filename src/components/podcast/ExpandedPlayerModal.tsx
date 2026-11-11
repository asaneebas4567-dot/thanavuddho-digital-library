'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronDown, 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  BookOpen, 
  ExternalLink, 
  Sparkles, 
  Headphones, 
  Radio, 
  Clock, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { usePodcastPlayer } from '@/context/PodcastPlayerContext';
import { formatDuration } from '@/lib/youtubeUtils';

const PLAYBACK_RATES = [0.75, 1, 1.25, 1.5, 2];

export default function ExpandedPlayerModal() {
  const {
    currentPodcast,
    sourceType,
    isPlaying,
    isLoading,
    isExpanded,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    playbackError,
    togglePlay,
    seekTo,
    seekRelative,
    setPlaybackRate,
    setVolume,
    toggleMute,
    minimizePlayer,
    closePlayer
  } = usePodcastPlayer();

  const [activeTab, setActiveTab] = useState<'player' | 'transcript'>('player');

  if (!isExpanded || !currentPodcast) return null;

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo(val);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative bg-white w-full max-w-2xl max-h-[94vh] rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* ========================================================= */}
        {/* 1. TOP MODAL HEADER                                       */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-r from-[#073B65] via-[#0A4D82] to-[#079FE8] text-white p-3.5 sm:p-4 px-4 sm:px-6 flex items-center justify-between shrink-0 shadow-sm">
          <button
            onClick={minimizePlayer}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer flex items-center gap-1 text-xs font-semibold"
            title="ย่อแถบเครื่องเล่น (เล่นต่อเนื่อง)"
          >
            <ChevronDown size={20} />
            <span className="hidden sm:inline">ย่อเครื่องเล่น</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/15 text-[#FEF08A] border border-white/20 flex items-center gap-1">
              <Headphones size={11} />
              <span>{sourceType === 'mp3' ? 'MP3 Audio Stream' : 'YouTube Podcast'}</span>
            </span>
          </div>

          <button
            onClick={closePlayer}
            className="p-1.5 rounded-full hover:bg-white/15 text-white/90 hover:text-white transition-colors cursor-pointer"
            title="ปิดเครื่องเล่นและหยุดเสียง"
          >
            <X size={20} />
          </button>
        </div>

        {/* ========================================================= */}
        {/* 2. BODY CONTENT (SCROLLABLE)                              */}
        {/* ========================================================= */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-4">

          {/* Error Notice if any */}
          {playbackError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">เกิดข้อผิดพลาดในการเล่น</p>
                <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">{playbackError}</p>
                {sourceType === 'youtube' && currentPodcast.youtube_url && (
                  <a
                    href={currentPodcast.youtube_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-red-600 hover:underline"
                  >
                    <span>เปิดรับชมบน YouTube โดยตรง</span>
                    <ExternalLink size={12} />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* MEDIA STAGE (YOUTUBE EMBED OR MP3 COVER) */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 shadow-md border border-slate-200">
            {sourceType === 'youtube' ? (
              /* YouTube Stage: Target slot for YT.Player */
              <div className="w-full h-full relative">
                <div id="global-yt-player-slot" className="w-full h-full" />
                {isLoading && (
                  <div className="absolute inset-0 bg-slate-900/80 flex items-center justify-center text-white text-xs gap-2 pointer-events-none">
                    <div className="w-5 h-5 border-2 border-[#079FE8] border-t-transparent rounded-full animate-spin" />
                    <span>กำลังเชื่อมต่อ YouTube...</span>
                  </div>
                )}
              </div>
            ) : (
              /* MP3 Audio Stage: High-Res Album Art with Sound Visualizer */
              <div className="w-full h-full relative flex items-center justify-center bg-gradient-to-br from-[#073B65] via-[#0A4D82] to-[#079FE8]">
                <Image
                  src={currentPodcast.cover_image || '/images/books/tam-jai-hai-prom-buak.jpg'}
                  alt={currentPodcast.title}
                  fill
                  className="object-cover opacity-35"
                  unoptimized
                />
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#D9A441] mb-3">
                    <Image
                      src={currentPodcast.cover_image || '/images/books/tam-jai-hai-prom-buak.jpg'}
                      alt={currentPodcast.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Animated Sound Bars */}
                  <div className="flex items-center gap-1 h-5">
                    {[1, 2, 3, 4, 5, 6, 7].map((bar) => (
                      <span
                        key={bar}
                        className={`w-1 rounded-full bg-[#FEF08A] transition-all duration-300 ${
                          isPlaying ? 'animate-pulse' : 'h-1.5 opacity-40'
                        }`}
                        style={{
                          height: isPlaying ? `${Math.sin(bar + currentTime) * 12 + 14}px` : '6px',
                          animationDelay: `${bar * 120}ms`
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] font-bold text-sky-100 mt-1">
                    ระบบเล่นไฟล์เสียง MP3 พื้นหลัง (รองรับปิดหน้าจอบนโทรศัพท์)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* TRACK INFORMATION */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                {currentPodcast.category_name || 'พอดแคสต์ธรรมะ'}
              </span>
              {currentPodcast.order && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  ตอนที่ {currentPodcast.order}
                </span>
              )}
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
              {currentPodcast.title}
            </h2>
            <p className="text-xs text-sky-700 font-semibold">
              ผู้บรรยาย: {currentPodcast.host}
            </p>
          </div>

          {/* PROGRESS BAR & TIMERS */}
          <div className="space-y-1.5 pt-1">
            <div className="relative w-full">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeekChange}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#079FE8]"
              />
              <div 
                className="absolute top-0 left-0 h-2 bg-gradient-to-r from-[#079FE8] to-blue-600 rounded-lg pointer-events-none"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-500">
              <span className="font-bold text-[#073B65]">{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
          </div>

          {/* CONTROLS (SEEK, PLAY/PAUSE, SPEED, VOLUME) */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            
            {/* Speed Chips */}
            <div className="flex items-center gap-1 order-2 sm:order-1">
              {PLAYBACK_RATES.map((rate) => (
                <button
                  key={rate}
                  onClick={() => setPlaybackRate(rate)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-[#073B65] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>

            {/* Core Playback Buttons */}
            <div className="flex items-center gap-4 sm:gap-5 order-1 sm:order-2">
              <button
                onClick={() => seekRelative(-10)}
                className="p-2 text-slate-600 hover:text-[#073B65] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="ย้อนหลัง 10 วินาที"
              >
                <RotateCcw size={20} />
              </button>

              <button
                onClick={togglePlay}
                disabled={isLoading}
                className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#079FE8] to-blue-600 hover:from-[#0588c7] hover:to-blue-700 text-white flex items-center justify-center shadow-lg shadow-sky-950/20 active:scale-95 transition-all cursor-pointer"
                title={isPlaying ? 'หยุดเล่นชั่วคราว' : 'เล่นต่อ'}
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause size={24} />
                ) : (
                  <Play size={24} className="ml-1" />
                )}
              </button>

              <button
                onClick={() => seekRelative(10)}
                className="p-2 text-slate-600 hover:text-[#073B65] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                title="ข้ามไปข้างหน้า 10 วินาที"
              >
                <RotateCw size={20} />
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 order-3">
              <button
                onClick={toggleMute}
                className="p-1.5 text-slate-600 hover:text-[#073B65] transition-colors cursor-pointer"
                title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
              >
                {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
              <input
                type="range"
                min={0}
                max={100}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-18 sm:w-24 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#079FE8]"
              />
            </div>
          </div>

          {/* ACTION BUTTONS & SHORTCUTS */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {currentPodcast.book_id && (
                <Link
                  href={`/reader/${currentPodcast.book_id}`}
                  onClick={minimizePlayer}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all shadow-2xs"
                >
                  <BookOpen size={13} className="text-[#D9A441]" />
                  <span>อ่านหนังสือฉบับเต็ม Flipbook</span>
                </Link>
              )}
              {sourceType === 'youtube' && currentPodcast.youtube_url && (
                <a
                  href={currentPodcast.youtube_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all"
                >
                  <ExternalLink size={13} />
                  <span>เปิดฟังใน YouTube App</span>
                </a>
              )}
            </div>

            {/* Gamification Point notice */}
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#FDF6E9] border border-[#D9A441]/40 text-[#78350F] text-[10px] font-bold">
              <span>🪙</span>
              <span>ฟังต่อเนื่อง 10 นาที รับแต้มบุญปัญญา +5 P</span>
            </div>
          </div>

          {/* TRANSCRIPT VIEW IF PRESENT */}
          {currentPodcast.transcript && currentPodcast.transcript.length > 0 && (
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                onClick={() => setActiveTab(activeTab === 'transcript' ? 'player' : 'transcript')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-1.5 text-[#073B65]">
                  <FileText size={14} className="text-[#079FE8]" />
                  <span>บทถอดเสียงและข้อคิดธรรมะประจำตอนนี้ ({currentPodcast.transcript.length} ช่วง)</span>
                </span>
                <span className="text-[10px] text-slate-400">
                  {activeTab === 'transcript' ? 'ซ่อน' : 'แสดง'}
                </span>
              </button>

              {activeTab === 'transcript' && (
                <div className="space-y-2 max-h-48 overflow-y-auto p-1">
                  {currentPodcast.transcript.map((t, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs text-slate-700 leading-relaxed"
                    >
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.2 rounded">
                          {t.time}
                        </span>
                        <span className="font-bold text-[#073B65] text-xs">
                          {t.speaker}
                        </span>
                      </div>
                      <p className="pl-0.5 text-slate-600">{t.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
