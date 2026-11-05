'use client';

import Image from 'next/image';
import { Video } from '@/types';
import { PlayCircle, Clock, Eye, Calendar, Sparkles, AlertCircle, Smartphone, Monitor } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onSelect?: (video: Video) => void;
}

export default function VideoCard({ video, onSelect }: VideoCardProps) {
  const isVertical = video.orientation === 'vertical' || video.aspect_ratio === '9:16';
  const isAvailable = video.is_available !== false;

  const handleClick = (e: React.MouseEvent) => {
    if (onSelect) {
      e.preventDefault();
      onSelect(video);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group cursor-pointer flex flex-col bg-white rounded-2xl shadow-sm hover:shadow-xl border transition-all duration-300 overflow-hidden ${
        isAvailable 
          ? 'border-border/50 hover:border-amber-500/40 hover:-translate-y-1' 
          : 'border-border/30 opacity-90 hover:border-zinc-300'
      }`}
    >
      {/* Thumbnail Container: Aspect ratio 16:9 for horizontal, 9:16 for vertical */}
      <div 
        className={`relative w-full overflow-hidden bg-zinc-900 ${
          isVertical ? 'aspect-[9/16] max-h-[460px]' : 'aspect-video'
        }`}
      >
        {video.thumbnail ? (
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transform group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-amber-600/20 to-amber-900/30">
            <PlayCircle className="w-14 h-14 text-amber-400/40" />
          </div>
        )}

        {/* Ambient Dark Gradient on bottom for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />

        {/* Top Badges: Orientation & Availability */}
        <div className="absolute top-2.5 inset-x-2.5 z-20 flex items-center justify-between pointer-events-none">
          {/* Orientation Badge */}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-[10px] font-bold border border-white/10 shadow-sm">
            {isVertical ? (
              <>
                <Smartphone className="w-3 h-3 text-rose-400" />
                <span>แนวตั้ง 9:16</span>
              </>
            ) : (
              <>
                <Monitor className="w-3 h-3 text-amber-400" />
                <span>แนวนอน 16:9</span>
              </>
            )}
          </span>

          {/* Availability Status Badge */}
          {isAvailable ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/90 text-white text-[10px] font-bold shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              <span>พร้อมรับชม</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-600/90 text-white text-[10px] font-bold shadow-sm">
              <AlertCircle className="w-2.5 h-2.5" />
              <span>รอเผยแพร่</span>
            </span>
          )}
        </div>

        {/* Center Hover Play Button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="w-14 h-14 rounded-full bg-amber-500/90 backdrop-blur-md flex items-center justify-center scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-xl text-white">
            <PlayCircle className="w-8 h-8 fill-current" />
          </div>
        </div>

        {/* Bottom Right: Duration Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-20 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm border border-white/10">
          <Clock className="w-3 h-3 text-amber-400" />
          <span>{video.duration}</span>
        </div>
      </div>

      {/* Video Metadata Under Thumbnail */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 bg-white">
        {/* Title */}
        <h3 className="font-bold text-foreground text-sm sm:text-base leading-snug mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-foreground/60 text-xs leading-relaxed mb-3 line-clamp-2 font-normal">
          {video.description}
        </p>

        {/* Tags */}
        {video.tags && video.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {video.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-amber-500/10 text-amber-700 px-2 py-0.5 rounded-md font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Footer Row: Views and Publish Date */}
        <div className="mt-auto pt-3 border-t border-border/40 flex items-center justify-between text-[11px] text-foreground/50 font-medium">
          <div className="flex items-center gap-1.5">
            {video.youtubeId ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-50 text-red-600 font-bold text-[10px] border border-red-200">
                <svg className="w-3 h-3 fill-current text-red-600 shrink-0" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>YouTube {video.view_count.toLocaleString()} วิว</span>
              </span>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-foreground/40" />
                <span>{isAvailable ? `${video.view_count.toLocaleString()} ครั้ง` : 'รอเผยแพร่'}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-foreground/40" />
            <span>
              {video.published_date 
                ? new Date(video.published_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' }) 
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
