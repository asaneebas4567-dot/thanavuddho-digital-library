'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Video as VideoIcon, 
  Play, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  Film,
  Smartphone,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { libraryVideos } from '@/data/videoData';
import { Video } from '@/types';

export default function HomeMediaShowcase() {
  const [videoFilter, setVideoFilter] = useState<'all' | 'horizontal' | 'vertical'>('all');
  const [allVideos, setAllVideos] = useState<Video[]>(libraryVideos);

  useEffect(() => {
    fetch('/api/admin/videos')
      .then(res => res.json())
      .then(data => {
        if (data.success && Array.isArray(data.videos) && data.videos.length > 0) {
          const customVideos: Video[] = data.videos.map((item: any) => {
            const isTikTok = item.platform === 'tiktok' || !!item.tiktokId || item.url?.includes('tiktok.com');
            return {
              id: item.id,
              title: item.title,
              description: item.description || '',
              video_url: item.url,
              youtubeId: item.youtubeId,
              tiktokId: item.tiktokId,
              platform: isTikTok ? 'tiktok' : (item.platform || 'youtube'),
              thumbnail: item.thumbnail || (isTikTok ? 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600' : '/images/books/book-placeholder.jpg'),
              duration: item.startFormatted || '01:00',
              video_type: isTikTok ? 'tiktok_short' : 'dhamma',
              orientation: isTikTok ? 'vertical' : (item.orientation || 'horizontal'),
              aspect_ratio: isTikTok ? '9:16' : '16:9',
              category_ids: ['cat_001', 'cat_006'],
              tags: item.tags || [],
              published_date: item.publishedDate || '2026-11-15',
              view_count: item.recommendCount ? item.recommendCount * 120 : 15200,
              author: item.channelName || (isTikTok ? 'ธรรมะรอบตัว (TikTok @udornsharo)' : 'พระครูปลัดสุวัฒนโพธิคุณ'),
              channel_handle: item.channelHandle || (isTikTok ? '@udornsharo' : '@ThanavuddhoStory'),
              is_available: true
            };
          });

          setAllVideos(prev => {
            const existingIds = new Set(prev.map(v => v.id));
            const newOnes = customVideos.filter(v => !existingIds.has(v.id));
            return [...newOnes, ...prev];
          });
        }
      })
      .catch(() => {});
  }, []);

  // Filtered videos (strictly YouTube library videos to maintain high quality)
  const filteredVideos = allVideos.filter((v) => {
    const isTikTok = v.platform === 'tiktok' || !!v.tiktokId || v.video_url?.includes('tiktok.com');
    if (isTikTok) return false;
    if (videoFilter === 'horizontal') return v.orientation === 'horizontal';
    if (videoFilter === 'vertical') return v.orientation === 'vertical';
    return true;
  }).slice(0, 6);

  return (
    <div className="space-y-8 pt-2">
      {/* Video Showcase Section with 16:9 & 9:16 Orientation Filter */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-xs">
        
        {/* Header & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 text-[#079FE8] flex items-center justify-center font-bold border border-sky-100">
              <VideoIcon size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-[#073B65] tracking-tight flex items-center gap-2">
                <span>วิดีโอธรรมเทศนา & คลิปสั้น</span>
                <span className="text-[10px] font-semibold text-[#073B65] bg-sky-50 border border-sky-200/80 px-2 py-0.5 rounded-full hidden sm:inline-block">
                  Dhamma Videos
                </span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-1 mt-0.5">
                รับชมคลิปเทศนาพร้อมการกรองขนาดแนวนอน (16:9) และคลิปสั้นแนวตั้ง (9:16)
              </p>
            </div>
          </div>

          {/* Orientation Filter Tabs (ทั้งหมด / แนวนอน / แนวตั้ง) */}
          <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/80 self-start sm:self-auto">
            <button
              onClick={() => setVideoFilter('all')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                videoFilter === 'all'
                  ? 'bg-[#073B65] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              ทั้งหมด
            </button>
            <button
              onClick={() => setVideoFilter('horizontal')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                videoFilter === 'horizontal'
                  ? 'bg-[#073B65] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Film size={12} />
              <span>แนวนอน (16:9)</span>
            </button>
            <button
              onClick={() => setVideoFilter('vertical')}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
                videoFilter === 'vertical'
                  ? 'bg-[#073B65] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Smartphone size={12} />
              <span>🔥 วิดีโอสั้น (Shorts & TikTok)</span>
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
                        <span className="text-[9.5px] font-bold text-slate-700 bg-slate-50/95 border border-slate-300/80 px-2 py-0.5 rounded-full shadow-2xs flex items-center gap-1">
                          <AlertCircle size={10} className="text-slate-500" />
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
