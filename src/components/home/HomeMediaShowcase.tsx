'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Headphones, 
  Video as VideoIcon, 
  Play, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Film,
  Smartphone
} from 'lucide-react';
import { libraryVideos } from '@/data/videoData';
import { podcasts } from '@/data/multimediaAndGamificationData';
import { Video } from '@/types';

export default function HomeMediaShowcase() {
  const [videoFilter, setVideoFilter] = useState<'all' | 'horizontal' | 'vertical'>('all');

  // Filtered videos
  const filteredVideos = libraryVideos.filter((v) => {
    if (videoFilter === 'horizontal') return v.orientation === 'horizontal';
    if (videoFilter === 'vertical') return v.orientation === 'vertical';
    return true;
  }).slice(0, 6);

  // Podcasts list
  const podcastList = podcasts.slice(0, 3);

  return (
    <div className="space-y-8 pt-2">
      
      {/* 1. Podcast Showcase Section (Poster-Style) */}
      <section className="bg-gradient-to-br from-indigo-50/70 via-purple-50/50 to-white rounded-3xl p-5 sm:p-7 border border-indigo-200/80 shadow-2xs">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold shadow-2xs border border-indigo-200">
              <Headphones size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>เสียงธรรมบรรยาย & พอดแคสต์</span>
                <span className="text-[10px] font-bold text-indigo-800 bg-indigo-100/90 border border-indigo-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Dhamma Audio
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 mt-0.5">
                ฟังข้อคิดธรรมะยามเช้า และสาระธรรมเพื่อจิตใจสงบ สามารถเปิดฟังขณะทำงานหรือเดินทาง
              </p>
            </div>
          </div>

          <Link 
            href="/audios" 
            className="text-xs sm:text-sm font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 shrink-0 px-3 py-1.5 rounded-full bg-white/90 hover:bg-white border border-indigo-200/60 shadow-2xs transition-colors"
          >
            <span>ดูทั้งหมด</span>
            <ChevronRight size={15} />
          </Link>
        </div>

        {/* Podcast Cards Grid (Poster Style) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {podcastList.map((pod) => {
            const latestEp = pod.episodes && pod.episodes[0];
            const isPlayable = Boolean(latestEp?.audio_url);

            return (
              <div 
                key={pod.id}
                className="group bg-white rounded-2xl p-4 border border-indigo-100 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-slate-900 shadow-sm border border-slate-200/60 mb-3">
                    <Image
                      src={pod.cover}
                      alt={pod.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                      unoptimized
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {isPlayable ? (
                        <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-50/95 border border-emerald-300/80 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600" />
                          <span>พร้อมรับฟัง</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-50/95 border border-amber-300/80 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                          <AlertCircle size={11} className="text-amber-600" />
                          <span>เตรียมเปิดให้บริการ</span>
                        </span>
                      )}
                    </div>

                    {/* Total Episodes Pill */}
                    <div className="absolute bottom-2 right-2 bg-slate-950/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock size={11} />
                      <span>{pod.total_episodes} ตอน</span>
                    </div>
                  </div>

                  {/* Title & Host */}
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-1 group-hover:text-indigo-700 transition-colors">
                    {pod.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                    ผู้บรรยาย: {pod.host}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                    {latestEp ? `${latestEp.title} - ${latestEp.description}` : pod.description}
                  </p>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {latestEp?.duration || '15 นาที'}
                  </span>
                  
                  {isPlayable ? (
                    <Link
                      href={`/audios`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition shadow-2xs"
                    >
                      <Play size={11} fill="currentColor" />
                      <span>เปิดฟัง</span>
                    </Link>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-400 italic">
                      เตรียมเปิดให้บริการ
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 2. Video Showcase Section with 16:9 & 9:16 Orientation Filter */}
      <section className="bg-gradient-to-br from-rose-50/70 via-orange-50/40 to-white rounded-3xl p-5 sm:p-7 border border-rose-200/80 shadow-2xs">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold shadow-2xs border border-rose-200">
              <VideoIcon size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>วิดีโอธรรมเทศนา & คลิปสั้น</span>
                <span className="text-[10px] font-bold text-rose-800 bg-rose-100/90 border border-rose-200 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Dhamma Videos
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 mt-0.5">
                รับชมคลิปเทศนาพร้อมการกรองขนาดแนวนอน (16:9) และคลิปสั้นแนวตั้ง (9:16)
              </p>
            </div>
          </div>

          {/* Orientation Filter Tabs (ทั้งหมด / แนวนอน / แนวตั้ง) */}
          <div className="flex items-center gap-1 bg-white/90 p-1 rounded-full border border-rose-200/80 shadow-2xs self-start sm:self-auto">
            <button
              onClick={() => setVideoFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                videoFilter === 'all'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setVideoFilter('horizontal')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                videoFilter === 'horizontal'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Film size={12} />
              <span>แนวนอน (16:9)</span>
            </button>
            <button
              onClick={() => setVideoFilter('vertical')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                videoFilter === 'vertical'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Smartphone size={12} />
              <span>แนวตั้ง (9:16)</span>
            </button>
          </div>

        </div>

        {/* Video Posters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredVideos.map((vid) => {
            const isVertical = vid.orientation === 'vertical';

            return (
              <div 
                key={vid.id}
                className="group bg-white rounded-2xl p-3.5 border border-rose-100 hover:border-rose-300 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  {/* Poster Thumbnail */}
                  <div className={`relative w-full rounded-xl overflow-hidden bg-slate-950 shadow-sm border border-slate-200/70 mb-3 ${
                    isVertical ? 'aspect-[9/13]' : 'aspect-video'
                  }`}>
                    <Image
                      src={vid.thumbnail}
                      alt={vid.title}
                      fill
                      className="object-cover group-hover:scale-103 transition-transform duration-300"
                      unoptimized
                    />

                    {/* Gradient Overlay for Title on Vertical */}
                    {isVertical && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-2 left-2 z-10">
                      {vid.is_available ? (
                        <span className="text-[9.5px] font-extrabold text-emerald-800 bg-emerald-50/95 border border-emerald-300/80 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                          <CheckCircle2 size={10} className="text-emerald-600" />
                          <span>พร้อมรับชม</span>
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-bold text-amber-800 bg-amber-50/95 border border-amber-300/80 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                          <AlertCircle size={10} className="text-amber-600" />
                          <span>เตรียมเปิดให้บริการ</span>
                        </span>
                      )}
                    </div>

                    {/* Center Play Button (Only if available) */}
                    {vid.is_available && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-85 group-hover:opacity-100 transition-opacity">
                        <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play size={16} fill="currentColor" className="ml-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Duration Badge */}
                    <span className="absolute bottom-2 right-2 bg-slate-950/85 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      {vid.duration}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="px-0.5">
                    <div className="flex items-center gap-1 text-[10px] text-rose-700 font-bold mb-1">
                      <span>{isVertical ? '📱 คลิปสั้น 9:16' : '🎬 ธรรมเทศนา 16:9'}</span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-rose-700 transition-colors">
                      {vid.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-1">
                      {vid.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">
                    {vid.channel_handle || '@ThanavuddhoStory'}
                  </span>
                  
                  {vid.is_available ? (
                    <Link
                      href="/videos"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold transition shadow-2xs"
                    >
                      <span>ชมวิดีโอ</span>
                      <ChevronRight size={12} />
                    </Link>
                  ) : (
                    <span className="text-[10px] font-medium text-slate-400 italic">
                      {vid.unavailable_reason ? 'เตรียมเปิดให้บริการ' : 'เร็วๆ นี้'}
                    </span>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* View All Videos Footer Link */}
        <div className="mt-5 text-center">
          <Link
            href="/videos"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-white hover:bg-rose-50 text-rose-700 border border-rose-200/90 text-xs font-bold transition-all shadow-2xs hover:shadow"
          >
            <span>ดูวิดีโอและคลิปสั้นทั้งหมดในคลัง</span>
            <ChevronRight size={14} />
          </Link>
        </div>

      </section>

    </div>
  );
}
