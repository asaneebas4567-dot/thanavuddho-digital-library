'use client';

import React, { useState, useEffect, Suspense } from 'react';
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
  CheckCircle2,
  Share2,
  Tv,
  ListMusic,
  Quote,
  Smartphone,
  Info
} from 'lucide-react';
import { podcasts } from '@/data/multimediaAndGamificationData';
import MeloloWatchToEarnWidget from '@/components/rewards/MeloloWatchToEarnWidget';

// 8 Official YouTube Podcast Episodes for "ทำใจให้พร้อมบวก"
const officialPodcast = podcasts[0]; // pod-tam-jai-hai-prom-buak
const episodes = officialPodcast.episodes;

// Transcripts / Key teachings for each episode
const episodeTranscripts: Record<string, { time: string; speaker: string; text: string }[]> = {
  'ep-tj-01': [
    { time: '00:00', speaker: 'ผู้บรรยาย & พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขอต้อนรับเข้าสู่ "ทำใจให้พร้อมบวก Podcast" ตอนพิเศษ: คิดบวกไม่ใช่การหลอกตัวเอง ผลงานธรรมะประพันธ์โดย พระครูปลัดสุวัฒนโพธิคุณ' },
    { time: '01:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การคิดบวกไม่ใช่การหลอกตัวเอง ไม่ใช่การปฏิเสธความจริง แต่คือการมองหาโอกาสและแง่คิดดีๆ ในทุกสถานการณ์' },
    { time: '03:45', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ใจของเราเปรียบเสมือนแม่ทัพ หากใจมีพลัง สติปัญญาและความสงบเย็นย่อมเป็นเกราะคุ้มกันอุปสรรคทั้งปวง' },
    { time: '07:20', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยอมรับ เข้าใจ เกิดประโยชน์ เมื่อเรายอมรับความจริง เข้าใจความเป็นไป และนำมาใช้ให้เกิดประโยชน์ ใจจะเบาสบาย' }
  ],
  'ep-tj-02': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 1: ปกติของมนุษย์ ปกติของผู้มีศีล' },
    { time: '02:15', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ศีลไม่ได้เป็นข้อห้ามที่จำกัดอิสรภาพ แต่คือเกราะคุ้มครองใจให้สงบเย็นและไม่เดือดร้อนใจในภายหลัง' },
    { time: '05:40', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'คนที่มีปกติใจมั่นคง จะไม่หวั่นไหวไปกับกระแสโลก เพราะรู้เท่าทันความเป็นจริงของสังขาร' }
  ],
  'ep-tj-03': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 2: วิกฤต เป็น โอกาส' },
    { time: '02:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ในทุกวิกฤต มีเมล็ดพันธุ์แห่งโอกาสซ่อนอยู่เสมอ อยู่ที่ว่าเรามองด้วยสายตาของปัญหา หรือมองด้วยสายตาของปัญญา' },
    { time: '06:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ความล้มเหลวไม่ใช่จุดจบ แต่คือบทเรียนที่สอนให้เราแข็งแกร่งและก้าวข้ามขีดจำกัดเดิม' }
  ],
  'ep-tj-04': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 3: ความลับของความสุข' },
    { time: '03:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ความสุขที่แทจริงไม่ได้ขึ้นอยู่กับวัตถุภายนอก แต่อยู่ที่ความนิ่ง สงบ และความพอดีภายในใจเราเอง' },
    { time: '07:05', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เมื่อใจหยุดนิ่ง ณ ศูนย์กลางกาย ความสว่างและปีติจะเกิดขึ้นอย่างเป็นธรรมชาติ' }
  ],
  'ep-tj-05': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 4: คนสุข คนไม่หลงโลก' },
    { time: '02:50', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การใช้ชีวิตในโลกปัจจุบัน ต้องมีหลักยึด ไม่ไหลไปตามกระแสกิเลสและค่านิยมชั่วคราว' },
    { time: '06:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'อยู่อย่างเข้าใจ ปล่อยวางในสิ่งที่ควบคุมไม่ได้ และทำหน้าที่ของตนเองให้ดีที่สุดในทุกปัจจุบันขณะ' }
  ],
  'ep-tj-06': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 5: มองข้าม ปัญหาเล็กๆ' },
    { time: '02:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ปัญหาเล็กๆ น้อยๆ ในชีวิตประจำวัน ถ้าเราเก็บมาคิดทุกเรื่อง ใจเราจะหนักและไม่มีพื้นที่สำหรับสิ่งที่ดีกว่า' },
    { time: '05:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'มองข้ามเรื่องไม่เป็นเรื่อง แล้วโฟกัสที่เป้าหมายที่แท้จริง คือการทำความดีและรักษาใจให้บริสุทธิ์' }
  ],
  'ep-tj-07': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 6: คิดบวก สร้างโลกบวก' },
    { time: '02:40', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'พลังความคิดของเราส่งผลต่อโลกรอบตัว เมื่อใจเราสว่างไสว ย่อมส่งต่อรอยยิ้ม ความเมตตา และพลังบวกให้ผู้คนรอบข้าง' },
    { time: '06:15', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การคิดดี พูดดี ทำดี คือการร่วมกันสร้างสิ่งแวดล้อมที่น่าอยู่และงดงามให้กับโลกใบนี้' }
  ],
  'ep-tj-08': [
    { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทสรุปส่งท้าย: เคล็ดลับสูงสุด... ใจพร้อมบวกตลอดไป' },
    { time: '03:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เคล็ดลับสำคัญที่สุดคือ "ความต่อเนื่อง" การฝึกใจให้หยุดนิ่งที่ศูนย์กลางกายทุกวัน วันละเล็กวันละน้อย' },
    { time: '07:20', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขออำนวยอวยพรให้ทุกท่านมีใจที่พร้อมบวก มีสติ ปัญญา และความสุขความเจริญรุ่งเรืองในชีวิตทุกประการเทอญ' }
  ]
};

function AudiosPageContent() {
  const searchParams = useSearchParams();
  const epParam = searchParams.get('ep');

  // Active playing episode state (defaults to Episode 1)
  const [activeEpisode, setActiveEpisode] = useState(() => {
    if (epParam) {
      const match = episodes.find(e => e.id === epParam || e.youtube_id === epParam);
      if (match) return match;
    }
    return episodes[0];
  });

  const [showTranscript, setShowTranscript] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync if URL query param changes
  useEffect(() => {
    if (epParam) {
      const match = episodes.find(e => e.id === epParam || e.youtube_id === epParam);
      if (match) setActiveEpisode(match);
    }
  }, [epParam]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const currentTranscript = episodeTranscripts[activeEpisode.id] || episodeTranscripts['ep-tj-01'];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 sm:pb-16 pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* ========================================================= */}
        {/* 1. HEADER HERO BANNER                                     */}
        {/* ========================================================= */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0A4D82] to-[#079FE8] text-white p-5 sm:p-8 lg:p-10 mb-6 sm:mb-8 shadow-lg border border-[#073B65]/30">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-[#FEF08A] text-xs font-bold backdrop-blur-md border border-white/20 mb-3">
              <Headphones size={13} />
              <span>พอดแคสต์ธรรมะฟังสบาย · 8 ตอนจบชุดสมบูรณ์</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight mb-2 sm:mb-3 leading-tight">
              ทำใจให้พร้อมบวก <span className="text-sky-200">(Podcast)</span>
            </h1>
            <p className="text-sky-100/90 text-xs sm:text-sm leading-relaxed mb-4 max-w-2xl">
              ชวนคุณมาพักสายตาจิบกาแฟอุ่นๆ ไปกับพอดแคสต์ฟังสบาย เติมพลังบวก สติ และปัญญา จากหนังสือลิขสิทธิ์ &quot;ทำใจให้พร้อมบวก&quot; โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor
            </p>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <a
                href={officialPodcast.playlist_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <span>เปิด Playlist บน YouTube</span>
                <ExternalLink size={13} />
              </a>
              <Link
                href="/reader/book_tam_jai_hai_prom_buak"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs border border-white/30 backdrop-blur-xs transition-all active:scale-95"
              >
                <BookOpen size={13} className="text-[#FEF08A]" />
                <span>เปิดอ่านหนังสือ Flipbook</span>
              </Link>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 2. DEDICATED IN-PAGE YOUTUBE MEDIA PLAYER (NO OVERLAYS)    */}
        {/* ========================================================= */}
        <div id="player-view" className="bg-white rounded-2xl sm:rounded-3xl border border-[#DCEAF3] shadow-md overflow-hidden mb-6 sm:mb-8">
          
          {/* Top Player Info Bar */}
          <div className="bg-gradient-to-r from-[#073B65] via-[#084c82] to-[#079FE8] text-white px-4 sm:px-6 py-3 sm:py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300 bg-white/10 px-2 py-0.5 rounded-md shrink-0">
                EP.{activeEpisode.episode_number}
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white truncate">
                {activeEpisode.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={handleShare}
                className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                title="แชร์ลิงก์ตอนนี้"
              >
                <Share2 size={12} />
                <span>{copiedLink ? 'คัดลอกแล้ว!' : 'แชร์'}</span>
              </button>
              <a
                href={activeEpisode.youtube_url || `https://www.youtube.com/watch?v=${activeEpisode.youtube_id}`}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold flex items-center gap-1 transition-all shadow-xs"
                title="เปิดฟังในแอป YouTube เพื่อฟังแบบปิดหน้าจอ"
              >
                <span>เปิดใน YouTube</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>

          {/* Responsive 16:9 YouTube IFrame Player */}
          <div className="relative aspect-video w-full bg-black">
            <iframe
              key={activeEpisode.youtube_id}
              src={`https://www.youtube-nocookie.com/embed/${activeEpisode.youtube_id}?autoplay=1&rel=0&modestbranding=1`}
              title={activeEpisode.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Under Player Meta & Melolo Listen-to-Earn */}
          <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-sky-600" />
                  ความยาว: {activeEpisode.duration} นาที
                </span>
                <span>•</span>
                <span>เผยแพร่: {activeEpisode.published_at}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-2xl">
                {activeEpisode.description}
              </p>
            </div>

            {/* Listen to earn widget */}
            <div className="shrink-0 flex items-center gap-2">
              <MeloloWatchToEarnWidget
                mediaType="audio"
                isPlaying={true}
                title={activeEpisode.title}
                sourceId={activeEpisode.id}
              />
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  showTranscript 
                    ? 'bg-[#073B65] text-white border-[#073B65]' 
                    : 'bg-white hover:bg-slate-100 text-[#073B65] border-slate-200'
                }`}
                title="เปิดอ่านสรุปข้อคิดธรรมะประจำตอนนี้"
              >
                <Quote size={13} />
                <span>{showTranscript ? 'ซ่อนบทสรุป' : 'บทสรุปธรรมะ'}</span>
              </button>
            </div>
          </div>

          {/* Collapsible In-Page Transcript / Quotes */}
          {showTranscript && (
            <div className="p-4 sm:p-6 bg-white border-t border-slate-200 animate-in fade-in duration-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-extrabold text-sm sm:text-base text-[#073B65] flex items-center gap-2">
                  <Quote size={16} className="text-[#079FE8]" />
                  <span>สรุปข้อคิดธรรมะจากตอนนี้: {activeEpisode.title}</span>
                </h3>
              </div>
              <div className="space-y-3">
                {currentTranscript.map((t, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-sky-50/60 border border-sky-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                        {t.time}
                      </span>
                      <span className="font-bold text-[#073B65] text-xs">
                        {t.speaker}
                      </span>
                    </div>
                    <p className="pl-1">{t.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ========================================================= */}
        {/* 3. SCREEN-OFF LISTENING GUIDE (MOBILE TIPS)               */}
        {/* ========================================================= */}
        <div className="mb-6 sm:mb-8 p-4 rounded-2xl bg-[#F0F8FD] border border-[#DCEAF3] flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#079FE8]/10 text-[#079FE8] flex items-center justify-center shrink-0 mt-0.5">
            <Smartphone size={18} />
          </div>
          <div className="text-xs text-slate-700 space-y-1">
            <h4 className="font-bold text-[#073B65] flex items-center gap-1.5 text-xs sm:text-sm">
              <span>คำแนะนำการเปิดฟังแบบปิดหน้าจอ / ล็อกหน้าจอโทรศัพท์</span>
              <span className="text-[10px] font-normal text-sky-700 bg-sky-100 px-2 py-0.2 rounded-full">เคล็ดลับ</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              สำหรับโทรศัพท์มือถือ เพื่อให้เสียงเล่นต่อเนื่องได้แม้ดับหน้าจอหรือล็อกจอ:
            </p>
            <ul className="list-disc list-inside space-y-0.5 text-slate-600 pt-0.5">
              <li>
                <strong>ฟังผ่านแอป YouTube:</strong> กดปุ่มสีแดง <span className="text-red-600 font-bold">&quot;เปิดใน YouTube&quot;</span> ด้านบน (หากมีสมาชิก YouTube Premium จะเล่นในพื้นหลังตอนปิดจอได้ทันที)
              </li>
              <li>
                <strong>ฟังฟรีปิดหน้าจอผ่านเว็บ:</strong> สามารถเปิดเว็บนี้ผ่านเบราว์เซอร์ <strong>Brave</strong> หรือเปิดโหมด <strong>Picture-in-Picture (PiP)</strong> แล้วกดปุ่ม Play ที่หน้าจอล็อก (Lock Screen Media Controls)
              </li>
            </ul>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4. EPISODE LIST: 5 OFFICIAL EPISODES                      */}
        {/* ========================================================= */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
                <ListMusic size={20} className="text-[#079FE8]" />
                <span>สารบัญตอนทั้งหมด (รวม 8 ตอนจบชุดบริบูรณ์)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                แตะเลือกตอนที่ต้องการรับฟังเพื่อเปลี่ยนเสียงบรรยายทันที
              </p>
            </div>
            <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-full">
              8 ตอนครบชุดสมบูรณ์
            </span>
          </div>

          <div className="space-y-3">
            {episodes.map((ep) => {
              const isActive = activeEpisode.id === ep.id;
              const ytThumbnail = `https://img.youtube.com/vi/${ep.youtube_id}/mqdefault.jpg`;

              return (
                <div
                  key={ep.id}
                  onClick={() => {
                    setActiveEpisode(ep);
                    if (typeof window !== 'undefined' && window.innerWidth < 768) {
                      document.getElementById('player-view')?.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`p-3 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${
                    isActive 
                      ? 'bg-sky-50/80 border-[#079FE8] shadow-sm ring-2 ring-[#079FE8]/20' 
                      : 'bg-white border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3 sm:gap-4 min-w-0">
                    {/* Thumbnail */}
                    <div className="relative w-24 sm:w-32 aspect-video rounded-xl overflow-hidden shrink-0 bg-slate-900 shadow-xs border border-slate-100">
                      <Image
                        src={ytThumbnail}
                        alt={ep.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center shadow-sm ${
                          isActive ? 'bg-[#079FE8] text-white' : 'bg-white/90 text-slate-800'
                        }`}>
                          <Play size={13} className="ml-0.5" />
                        </div>
                      </div>
                      <span className="absolute bottom-1 right-1 bg-black/75 text-white text-[9px] font-mono font-bold px-1 py-0.2 rounded">
                        {ep.duration}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[10px] font-extrabold px-2 py-0.2 rounded-md ${
                          isActive 
                            ? 'bg-[#079FE8] text-white' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          ตอนที่ {ep.episode_number}
                        </span>
                        {isActive && (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-md flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                            <span>กำลังเล่น</span>
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {ep.published_at}
                        </span>
                      </div>

                      <h4 className={`text-xs sm:text-sm font-bold leading-snug line-clamp-2 ${
                        isActive ? 'text-[#073B65]' : 'text-slate-900'
                      }`}>
                        {ep.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-2 mt-1 leading-relaxed">
                        {ep.description}
                      </p>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center justify-end sm:justify-center shrink-0">
                    <button
                      type="button"
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                        isActive
                          ? 'bg-[#079FE8] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      <Play size={12} className={isActive ? 'text-white' : 'text-slate-600'} />
                      <span>{isActive ? 'กำลังเล่น' : 'เปิดฟังตอนนี้'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ========================================================= */}
        {/* 5. COMPANION FLIPBOOK CARD                                */}
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
                ทำใจให้พร้อมบวก (ฉบับ E-Book Flipbook)
              </h4>
              <p className="text-xs text-slate-600 max-w-md mt-0.5 leading-relaxed">
                อ่านเนื้อหาต้นฉบับเต็มเล่มแบบเปิดหน้า 2 หน้าสมจริง คู่ขนานไปกับการฟังพอดแคสต์
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
          <p className="text-xs font-bold text-[#073B65]">กำลังโหลดพอดแคสต์ธรรมะ...</p>
        </div>
      </div>
    }>
      <AudiosPageContent />
    </Suspense>
  );
}
