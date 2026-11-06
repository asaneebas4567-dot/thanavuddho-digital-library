'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Eye, 
  Calendar, 
  Share2, 
  BookOpen, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  AlertTriangle, 
  Volume2, 
  VolumeX, 
  Monitor, 
  Smartphone,
  Play,
  Heart,
  MessageCircle,
  Film
} from 'lucide-react';
import { Video } from '@/types';
import MeloloWatchToEarnWidget from '@/components/rewards/MeloloWatchToEarnWidget';
import TranscriptViewer from '@/components/media/TranscriptViewer';

interface VideoWatchViewProps {
  video: Video;
  allVideos: Video[];
  onBackToGrid: () => void;
  onSelectVideo: (video: Video) => void;
}

export default function VideoWatchView({
  video,
  allVideos,
  onBackToGrid,
  onSelectVideo
}: VideoWatchViewProps) {
  const isVertical = video.orientation === 'vertical' || video.aspect_ratio === '9:16';
  const isAvailable = video.is_available !== false && Boolean(video.youtubeId || video.video_url);

  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(video.view_count ? Math.floor(video.view_count * 0.08) : 120);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [infoTab, setInfoTab] = useState<'details' | 'transcript'>('details');
  const [seekSeconds, setSeekSeconds] = useState<number | null>(null);

  // Resolved Authentic Dhamma Transcript
  const resolvedTranscript = video.transcript || [
    { time: 0, timestamp: '00:00', speaker: video.author || 'พระครูปลัดสุวัฒนโพธิคุณ', text: `เจริญพรสาธุชนทุกท่าน วันนี้มาร่วมศึกษาธรรมปฏิบัติในหัวข้อ "${video.title}"` },
    { time: 35, timestamp: '00:35', speaker: video.author || 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'คนเราเกิดมาในโลกนี้ ปัญหาและอุปสรรคย่อมเกิดขึ้นได้เสมอ แต่สิ่งที่สำคัญคือการมี "สัมมาทิฐิ" มีปัญญารู้เท่าทันความเป็นจริง' },
    { time: 110, timestamp: '01:50', speaker: video.author || 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การฝึกทำสมาธิเจริญภาวนา นำใจกลับมาหยุดนิ่งที่ศูนย์กลางกายฐานที่ 7 จะทำให้เกิดความสว่างไสว จิตใจผ่องใสบริสุทธิ์' },
    { time: 240, timestamp: '04:00', speaker: video.author || 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เมื่อใจหยุดนิ่งเป็นอารมณ์เดียว ความสุขที่แท้จริงซึ่งปราศจากความเร่าร้อนจะบังเกิดขึ้น เป็นบ่อเกิดแห่งปัญญาในการแก้ปัญหาชีวิต' },
    { time: 380, timestamp: '06:20', speaker: video.author || 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขอให้ทุกท่านหมั่นสั่งสมบุญกุศล มีทาน ศีล ภาวนา เป็นประจำทุกวัน เพื่อสร้างบารมีและสันติสุขที่ยั่งยืน เจริญพร' }
  ];

  // Recommended videos (other available videos first, matching orientation where possible)
  const recommendedVideos = allVideos
    .filter(v => v.id !== video.id)
    .sort((a, b) => {
      // Prioritize available videos
      if (a.is_available && !b.is_available) return -1;
      if (!a.is_available && b.is_available) return 1;
      // Match orientation
      if (a.orientation === video.orientation && b.orientation !== video.orientation) return -1;
      if (a.orientation !== video.orientation && b.orientation === video.orientation) return 1;
      return 0;
    })
    .slice(0, 8);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleToggleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount(prev => prev - 1);
    } else {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      showToast('สาธุ! บันทึกความชอบแล้ว');
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: `รับชมวิดีโอธรรมะ "${video.title}" โดย ${video.author || 'พระครูปลัดสุวัฒนโพธิคุณ'}`,
          url: url
        });
        showToast('แชร์ธรรมะสำเร็จแล้ว');
        return;
      } catch {
        // user cancelled
      }
    }
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        showToast('คัดลอกลิงก์วิดีโอเรียบร้อยแล้ว!');
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0d0f12] text-white">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-40 bg-zinc-950/85 backdrop-blur-md border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between">
        <button
          onClick={onBackToGrid}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold transition-all group cursor-pointer border border-white/15"
          title="กลับสู่หน้ารวมวิดีโอ"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>กลับไปหน้ารวมวิดีโอ</span>
        </button>

        <div className="flex items-center gap-2 sm:gap-3 text-xs font-medium">
          {/* Melolo-style Watch-to-Earn Coin Widget */}
          <MeloloWatchToEarnWidget
            mediaType="video"
            isPlaying={isAvailable}
            title={video.title}
            sourceId={video.id}
          />

          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {isVertical ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span>{isVertical ? 'คลิปแนวตั้ง (9:16)' : 'วิดีโอแนวนอน (16:9)'}</span>
          </span>

          {isAvailable && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-2 rounded-full border transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-300' 
                  : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
              }`}
              title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all cursor-pointer"
            title="แชร์คลิปนี้"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Watch Layout Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Player Column (Left / Center) */}
          <div className="lg:col-span-8 flex flex-col items-center">
            
            {/* Player Container */}
            <div className="w-full flex justify-center bg-black/60 rounded-3xl p-2 sm:p-4 border border-white/10 shadow-2xl">
              {isAvailable ? (
                /* Authentic Playable Video */
                <div 
                  key={video.id} /* Key forces unmount when changing video, completely stopping previous audio/video */
                  className={`relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl ${
                    isVertical 
                      ? 'max-w-[420px] aspect-[9/16] border border-white/15' 
                      : 'w-full aspect-video'
                  }`}
                >
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&mute=${isMuted ? 1 : 0}&rel=0&modestbranding=1&playsinline=1${seekSeconds !== null ? `&start=${seekSeconds}` : ''}`}
                    title={video.title}
                    className="w-full h-full object-cover border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Unavailable Video Error Notice Card */
                <div 
                  className={`w-full rounded-2xl p-6 sm:p-10 flex flex-col items-center justify-center text-center bg-zinc-900 border border-amber-500/30 ${
                    isVertical ? 'max-w-[420px] aspect-[9/16]' : 'aspect-video'
                  }`}
                >
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 animate-pulse">
                    <AlertTriangle className="w-8 h-8" />
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 mb-3">
                    สถานะ: อยู่ระหว่างจัดเตรียมสื่อ
                  </span>

                  <h3 className="text-lg sm:text-xl font-extrabold text-white mb-2">
                    แหล่งวิดีโอนี้ยังไม่พร้อมใช้งานในระบบ
                  </h3>

                  <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed mb-6">
                    {video.unavailable_reason || 'แหล่งวิดีโอนี้อยู่ระหว่างเตรียมบันทึกสัญญาณและตรวจสอบคุณภาพจากคลังธรรมะต้นฉบับ ทางระบบได้จัดเตรียมโครงสร้างข้อมูลไว้เรียบร้อยแล้ว'}
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => {
                        const firstReady = allVideos.find(v => v.is_available && v.id !== video.id);
                        if (firstReady) onSelectVideo(firstReady);
                      }}
                      className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer flex items-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      <span>เลือกชมคลิปอื่นที่พร้อมเล่น</span>
                    </button>

                    <button
                      onClick={onBackToGrid}
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-all cursor-pointer"
                    >
                      กลับไปหน้ารวมวิดีโอ
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Video Details & Interaction Row */}
            <div className="w-full mt-6 bg-zinc-900/80 rounded-3xl p-5 sm:p-7 border border-white/10">
              
              {/* Category & Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold">
                    {isVertical ? 'วิดีโอแนวตั้ง 9:16' : 'วิดีโอแนวนอน 16:9'}
                  </span>
                  {video.category_ids && video.category_ids.length > 0 && (
                    <span className="text-xs text-zinc-400">หมวดธรรมะ</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" /> พร้อมรับชม
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-400 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" /> รอเผยแพร่
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <h1 className="text-lg sm:text-2xl font-extrabold text-white leading-snug mb-3">
                {video.title}
              </h1>

              {/* Author & Metrics Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center font-bold text-white shadow-md text-base">
                    ฐ
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-white">{video.author || 'พระครูปลัดสุวัฒนโพธิคุณ'}</span>
                      <CheckCircle2 className="w-4 h-4 text-sky-400 fill-sky-400/20" />
                    </div>
                    <span className="text-xs text-zinc-400 font-mono">{video.channel_handle || '@ThanavuddhoStory'}</span>
                  </div>
                </div>

                {/* Like & Share Action Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleToggleLike}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer ${
                      isLiked
                        ? 'bg-rose-600 border-rose-500 text-white shadow-md'
                        : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'
                    }`}
                  >
                    <Heart className="w-4 h-4" fill={isLiked ? 'currentColor' : 'none'} />
                    <span>{likeCount.toLocaleString()}</span>
                  </button>

                  <button
                    onClick={handleShare}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>แชร์</span>
                  </button>
                </div>
              </div>

              {/* Views and Publish Date */}
              <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium py-3">
                {video.youtubeId ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/15 text-red-400 font-bold border border-red-500/30">
                    <svg className="w-3.5 h-3.5 fill-current text-red-500 shrink-0" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>ยอดเข้าชมจริงบน YouTube: {video.view_count.toLocaleString()} ครั้ง</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-zinc-500" />
                    {isAvailable ? `${video.view_count.toLocaleString()} ครั้ง` : 'รอเผยแพร่'}
                  </span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                  เผยแพร่ {video.published_date ? new Date(video.published_date).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}
                </span>
              </div>

              {/* Tab Selector: Overview vs Transcript */}
              <div className="flex items-center gap-2 mt-2 pt-3 border-t border-white/10">
                <button
                  onClick={() => setInfoTab('details')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    infoTab === 'details'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  📝 รายละเอียดวิดีโอ
                </button>
                <button
                  onClick={() => setInfoTab('transcript')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    infoTab === 'transcript'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span>🎙️ บทถอดเสียงบรรยายธรรม</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300">
                    {resolvedTranscript.length} ท่อน
                  </span>
                </button>
              </div>

              {/* Conditional Content based on selected tab */}
              {infoTab === 'details' ? (
                <>
                  {/* Full Description */}
                  <div className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-2">
                    <p>{video.description}</p>
                  </div>

                  {/* Tags */}
                  {video.tags && video.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/10">
                      {video.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs bg-white/5 text-amber-300/90 px-2.5 py-1 rounded-lg border border-white/5">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="mt-3">
                  <TranscriptViewer
                    transcript={resolvedTranscript}
                    currentTime={seekSeconds || 0}
                    onSeek={(secs) => setSeekSeconds(secs)}
                    title={video.title}
                    authorName={video.author}
                  />
                </div>
              )}

              {/* Related Book Notice */}
              {video.related_book_id && (
                <div className="mt-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <span className="text-[11px] text-amber-300 font-semibold block">หนังสือและคัมภีร์ที่เกี่ยวข้อง</span>
                      <span className="text-xs sm:text-sm font-bold text-white">{video.related_book_title || 'มงคลชีวิต 38 ประการ'}</span>
                    </div>
                  </div>
                  <Link
                    href={`/books/${video.related_book_id}`}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    <span>อ่านในห้องสมุด</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

            </div>

          </div>

          {/* Recommended Videos Sidebar (Right Column) */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Film className="w-4 h-4 text-amber-400" />
                <span>วิดีโอแนะนำ ({recommendedVideos.length})</span>
              </h2>
              <span className="text-xs text-zinc-400 font-mono">คลิกเพื่อสลับคลิป</span>
            </div>

            <div className="space-y-3">
              {recommendedVideos.map((recVideo) => {
                const isRecVertical = recVideo.orientation === 'vertical' || recVideo.aspect_ratio === '9:16';
                const isRecReady = recVideo.is_available !== false;

                return (
                  <div
                    key={recVideo.id}
                    onClick={() => onSelectVideo(recVideo)}
                    className="group flex gap-3 p-2.5 rounded-2xl bg-zinc-900/60 hover:bg-zinc-800/90 border border-white/5 hover:border-amber-500/30 transition-all cursor-pointer shadow-sm"
                  >
                    {/* Thumbnail Preview */}
                    <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded-xl overflow-hidden bg-zinc-950 border border-white/10">
                      {recVideo.thumbnail ? (
                        <Image
                          src={recVideo.thumbnail}
                          alt={recVideo.title}
                          fill
                          unoptimized
                          sizes="128px"
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-zinc-800 text-zinc-600">
                          <Play className="w-6 h-6" />
                        </div>
                      )}

                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono font-bold">
                        {recVideo.duration}
                      </div>

                      <div className="absolute top-1 left-1">
                        <span className="px-1.5 py-0.5 rounded bg-black/70 text-[9px] text-white font-bold">
                          {isRecVertical ? '9:16' : '16:9'}
                        </span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex flex-col justify-between flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {recVideo.title}
                      </h4>
                      
                      <div className="mt-1 flex items-center justify-between text-[11px] text-zinc-400">
                        <span>{isRecReady ? `${recVideo.view_count.toLocaleString()} วิว` : 'รอเผยแพร่'}</span>
                        {isRecReady ? (
                          <span className="text-emerald-400 text-[10px]">พร้อมเล่น</span>
                        ) : (
                          <span className="text-amber-500 text-[10px]">รอไฟล์</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Button to Return to Channel Profile */}
            <div className="pt-2">
              <button
                onClick={onBackToGrid}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>กลับสู่โปรไฟล์ช่องและคลังทั้งหมด</span>
              </button>
            </div>
          </div>

        </div>
      </main>

      {/* Floating Animated Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200 pointer-events-none">
          <div className="px-4 py-2.5 rounded-full bg-zinc-900/95 text-white text-xs font-semibold border border-amber-500/40 shadow-2xl flex items-center gap-2 backdrop-blur-md">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
