'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  CheckCircle2, 
  Play, 
  ExternalLink, 
  Share2, 
  Sparkles, 
  Users, 
  Video as VideoIcon, 
  Smartphone, 
  Monitor, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { VideoChannelProfile } from '@/types';

interface ChannelHeaderProps {
  channel: VideoChannelProfile;
  totalCount: number;
  horizontalCount: number;
  verticalCount: number;
  readyCount: number;
}

export default function ChannelHeader({
  channel,
  totalCount,
  horizontalCount,
  verticalCount,
  readyCount
}: ChannelHeaderProps) {
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleShareChannel = async () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 2500);
      } catch {
        // fallback
      }
    }
  };

  return (
    <div className="relative w-full bg-white border-b border-border/40 overflow-hidden">
      {/* Ambient Creator Banner */}
      <div className="relative w-full h-36 sm:h-48 md:h-56 bg-gradient-to-r from-amber-900 via-amber-800 to-amber-950 overflow-hidden">
        {channel.banner && (
          <Image
            src={channel.banner}
            alt="Channel Banner"
            fill
            priority
            unoptimized
            className="object-cover opacity-25 mix-blend-overlay scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Subtle decorative badges inside banner */}
        <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-black/40 backdrop-blur-md text-amber-300 text-xs font-semibold border border-amber-400/30 flex items-center gap-1.5 shadow-lg">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ช่องทางการสื่อธรรมะ</span>
          </span>
        </div>
      </div>

      {/* Main Channel Info Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <div className="relative -mt-14 sm:-mt-16 flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6">
          
          {/* Left: Avatar & Identity */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6">
            {/* Avatar with Golden Frame */}
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-3xl p-1 bg-gradient-to-tr from-amber-500 via-amber-300 to-amber-600 shadow-xl shrink-0">
              <div className="relative w-full h-full rounded-[22px] overflow-hidden bg-zinc-900 border-2 border-white">
                <Image
                  src={channel.avatar}
                  alt={channel.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center p-0.5">
                <CheckCircle2 className="w-5 h-5 text-sky-500 fill-sky-500/20" />
              </div>
            </div>

            {/* Channel Title & Handle */}
            <div className="flex flex-col justify-end">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground tracking-tight">
                  {channel.name}
                </h1>
                {channel.verified && (
                  <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    ยืนยันแล้ว
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 text-foreground/60 text-xs sm:text-sm font-medium mt-1">
                <span className="font-semibold text-amber-600">{channel.handle}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-foreground/40" />
                  {channel.subscribers_count}
                </span>
                <span>•</span>
                <span className="font-semibold text-foreground/80">{totalCount} วิดีโอในคลัง</span>
              </div>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 sm:self-end pt-2 sm:pt-0">
            <a
              href={channel.official_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>เปิดช่อง YouTube ทางการ</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </a>

            <button
              onClick={handleShareChannel}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-foreground font-semibold text-xs sm:text-sm border border-zinc-200 transition-all cursor-pointer"
              title="คัดลอกลิงก์ช่อง"
            >
              <Share2 className="w-4 h-4 text-foreground/70" />
              <span className="hidden xs:inline">แชร์</span>
            </button>
          </div>

        </div>

        {/* Channel Description */}
        <div className="mt-4 sm:mt-5 max-w-4xl">
          <p className={`text-xs sm:text-sm text-foreground/75 leading-relaxed font-normal ${isDescExpanded ? '' : 'line-clamp-2'}`}>
            {channel.description}
          </p>
          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="text-xs font-bold text-amber-600 hover:text-amber-700 mt-1 inline-flex items-center gap-1 cursor-pointer"
          >
            {isDescExpanded ? (
              <>ย่อคำอธิบาย <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>...อ่านเพิ่มเติม <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        </div>

        {/* Video Type Quick Stat Badges */}
        <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <VideoIcon className="w-3.5 h-3.5 text-amber-600" />
            <span>วิดีโอทั้งหมด: <strong>{totalCount}</strong> คลิป</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-blue-50 border border-blue-200/60 text-blue-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <Monitor className="w-3.5 h-3.5 text-blue-600" />
            <span>แนวนอน 16:9: <strong>{horizontalCount}</strong> คลิป</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200/60 text-rose-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <Smartphone className="w-3.5 h-3.5 text-rose-600" />
            <span>แนวตั้ง 9:16: <strong>{verticalCount}</strong> คลิป</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200/60 text-emerald-800 font-semibold flex items-center gap-1.5 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>พร้อมรับชมในระบบ: <strong>{readyCount}</strong> รายการ</span>
          </div>
        </div>

      </div>

      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-2xl bg-zinc-900 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 border border-zinc-700 animate-in fade-in slide-in-from-bottom duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>คัดลอกลิงก์ช่องเรียบร้อยแล้ว!</span>
        </div>
      )}
    </div>
  );
}
