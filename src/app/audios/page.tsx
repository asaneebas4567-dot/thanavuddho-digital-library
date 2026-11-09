'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Headphones, 
  Play, 
  Pause, 
  BookOpen, 
  Radio, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Clock, 
  Share2, 
  ListMusic, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Quote,
  X,
  ExternalLink,
  Tv
} from 'lucide-react';
import { audios as initialAudios } from '@/data/mockData';
import { audiobooks, podcasts } from '@/data/multimediaAndGamificationData';
import BorrowButton from '@/components/common/BorrowButton';
import MeloloWatchToEarnWidget from '@/components/rewards/MeloloWatchToEarnWidget';
import TranscriptViewer from '@/components/media/TranscriptViewer';

interface CurrentTrack {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  audio_url: string;
  duration: string;
  type: 'audio' | 'audiobook' | 'podcast';
  youtube_id?: string;
  youtube_url?: string;
}

function AudiosPageContent() {
  const searchParams = useSearchParams();
  const podcastParam = searchParams.get('podcast');

  const [activeTab, setActiveTab] = useState<'all' | 'audios' | 'audiobooks' | 'podcasts'>('all');
  const [currentTrack, setCurrentTrack] = useState<CurrentTrack | null>({
    id: podcasts[0].episodes[0].id,
    title: podcasts[0].episodes[0].title,
    subtitle: podcasts[0].title,
    cover: podcasts[0].cover,
    audio_url: podcasts[0].episodes[0].audio_url,
    duration: podcasts[0].episodes[0].duration,
    type: 'podcast',
    youtube_id: podcasts[0].episodes[0].youtube_id,
    youtube_url: podcasts[0].episodes[0].youtube_url
  });
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(15);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [selectedAudiobookId, setSelectedAudiobookId] = useState<string>(audiobooks[0].id);
  const [selectedPodcastId, setSelectedPodcastId] = useState<string>(podcasts[0].id);
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  // Sync with URL query parameter
  useEffect(() => {
    if (podcastParam) {
      const found = podcasts.find(p => p.id === podcastParam || p.book_id === podcastParam || p.title.includes(podcastParam));
      if (found) {
        setSelectedPodcastId(found.id);
        setActiveTab('podcasts');
        if (found.episodes && found.episodes.length > 0) {
          const firstEp = found.episodes[0];
          setCurrentTrack({
            id: firstEp.id,
            title: firstEp.title,
            subtitle: found.title,
            cover: found.cover,
            audio_url: firstEp.audio_url,
            duration: firstEp.duration,
            type: 'podcast',
            youtube_id: firstEp.youtube_id,
            youtube_url: firstEp.youtube_url
          });
        }
      }
    }
  }, [podcastParam]);

  // Dynamic Audio Transcript based on current track
  const audioTranscript = currentTrack ? (
    currentTrack.subtitle?.includes('ทำใจให้พร้อมบวก') || currentTrack.title?.includes('ทำใจให้พร้อมบวก') ? [
      { time: 0, timestamp: '00:00', speaker: 'ผู้บรรยาย & พระครูปลัดสุวัฒนโพธิคุณ', text: `ขอต้อนรับเข้าสู่ "ทำใจให้พร้อมบวก Podcast" ตอน "${currentTrack.title}" ผลงานธรรมะประพันธ์โดย พระครูปลัดสุวัฒนโพธิคุณ` },
      { time: 30, timestamp: '00:30', speaker: 'ผู้บรรยาย', text: 'ชวนคุณมาพักสายตาจิบกาแฟอุ่นๆ ไปกับพอดแคสต์ฟังสบายที่จะช่วยเติมพลังบวก สติ และปัญญาให้กับชีวิต' },
      { time: 90, timestamp: '01:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การคิดบวกไม่ใช่การหลอกตัวเอง ไม่ใช่การปฏิเสธความจริง แต่คือการมองหาโอกาสและแง่คิดดีๆ ในทุกสถานการณ์' },
      { time: 180, timestamp: '03:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ใจของเราเปรียบเสมือนแม่ทัพ หากใจมีพลัง สติปัญญาและความสงบเย็นย่อมเป็นเกราะคุ้มกันอุปสรรคทั้งปวง' },
      { time: 300, timestamp: '05:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยอมรับ เข้าใจ เกิดประโยชน์ เมื่อเรายอมรับความจริง เข้าใจความเป็นไป และนำมาใช้ให้เกิดประโยชน์ ใจจะเบาสบาย' },
      { time: 480, timestamp: '08:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขอให้ทุกท่านมีความสุขและพลังใจที่เข้มแข็ง พร้อมเผชิญทุกเรื่องราวในชีวิตด้วยใจที่เป็นบวกและสงบเย็นเทอญ' }
    ] : [
      { time: 0, timestamp: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: `ขอเจริญพรสาธุชนผู้รับฟังทุกท่าน ยินดีต้อนรับสู่เสียงธรรมบรรยาย "${currentTrack.title}"` },
      { time: 40, timestamp: '00:40', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ธรรมะของพระสัมมาสัมพุทธเจ้านั้น เป็นอกาลิโก คือไม่จำกัดกาลเวลา เมื่อนำมาน้อมปฏิบัติตามเมื่อใด ย่อมเกิดความร่มเย็นเป็นสุขเมื่อนั้น' },
      { time: 110, timestamp: '01:50', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ใจของเราเหมือนน้ำนิ่ง ถ้าน้ำกระเพื่อมเพราะคลื่นลมตะกอนก็จะฟุ้งขึ้นมา แต่น้ำที่สงบนิ่งจะสะท้อนความจริงได้ชัดเจนที่สุด สมาธิคือการทำใจให้นิ่ง' },
      { time: 180, timestamp: '03:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ให้กำหนดนิมิตเป็นดวงแก้วใสบริสุทธิ์ หรือองค์พระแก้วใส หยุดนิ่งไว้ ณ ศูนย์กลางกายฐานที่ 7 เหนือระดับสะดือขึ้นมา 2 นิ้วมือ' },
      { time: 260, timestamp: '04:20', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ภาวนาในใจอย่างสบายๆ ว่า สัมมา อะระหัง... สัมมา อะระหัง... ให้เสียงคำภาวดังขึ้นมาจากศูนย์กลางกายอย่างต่อเนื่องและแผ่วเบา' },
      { time: 350, timestamp: '05:50', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขออำนวยอวยพรให้ทุกท่านมีความสุขความเจริญ รุ่งเรืองในชีวิตและการปฏิบัติธรรมทุกประการเทอญ' }
    ]
  ) : [];

  const selectedAudiobook = audiobooks.find(a => a.id === selectedAudiobookId) || audiobooks[0];
  const selectedPodcast = podcasts.find(p => p.id === selectedPodcastId) || podcasts[0];

  const handlePlayTrack = (track: CurrentTrack) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    setProgress(0);
  };

  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const cycleSpeed = () => {
    const speeds = [1, 1.25, 1.5, 0.8];
    const nextIdx = (speeds.indexOf(playbackSpeed) + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIdx]);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-36 pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Banner (Deep Navy to Primary Blue Gradient) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white p-8 sm:p-12 mb-10 shadow-xl shadow-sky-950/10">
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-md border border-white/20 mb-4">
              <Headphones size={15} /> คลังเสียงธรรมะมัลติมีเดีย (Audio & Podcasts)
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
              ฟังธรรมะเพื่อความสุข <span className="text-sky-200">และสติในทุกวัน</span>
            </h1>
            <p className="text-sky-100/90 text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
              รวบรวมเสียงบรรยายธรรมเทศนา, หนังสือเสียง (Audiobooks) ครบชุดแบบแบ่งบท, และรายการพอดแคสต์ (Podcasts) ร่วมสมัย โดย พระครูปลัดสุวัฒนโพธิคุณ
            </p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={() => setActiveTab('audiobooks')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-sky-900 font-bold hover:bg-sky-50 transition-all text-sm shadow-md"
              >
                <BookOpen size={16} /> ฟังหนังสือเสียง (Audiobooks)
              </button>
              <button 
                onClick={() => setActiveTab('podcasts')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all text-sm backdrop-blur-sm border border-white/15"
              >
                <Radio size={16} /> พอดแคสต์รับอรุณ (Podcasts)
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center justify-between border-b border-gray-200 mb-8 overflow-x-auto no-scrollbar pb-2">
          <div className="flex gap-2 sm:gap-4 shrink-0">
            {[
              { id: 'all', label: 'ทั้งหมด (All Audio)', icon: Headphones, count: initialAudios.length + audiobooks.length + podcasts.length },
              { id: 'audiobooks', label: 'หนังสือเสียง (Audiobooks)', icon: BookOpen, count: audiobooks.length },
              { id: 'podcasts', label: 'พอดแคสต์ (Podcasts)', icon: Radio, count: podcasts.length },
              { id: 'audios', label: 'เสียงบรรยายธรรมเทศนา', icon: ListMusic, count: initialAudios.length },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-sky-700/60 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 1: หนังสือเสียง (Audiobooks) */}
        {(activeTab === 'all' || activeTab === 'audiobooks') && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <BookOpen className="text-sky-600" size={24} /> หนังสือเสียง (Audiobooks)
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  หนังสือธรรมะฉบับเสียงอ่านพากย์สมบูรณ์ แบ่งเป็นบทๆ พร้อมระบบยืม-คืนสื่อดิจิทัล
                </p>
              </div>
            </div>

            {/* Main Audiobook Spotlight with Track Player */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Cover & Info */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg mb-6 ring-1 ring-black/5">
                    <Image 
                      src={selectedAudiobook.cover} 
                      alt={selectedAudiobook.title} 
                      fill 
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                      <Clock size={12} /> {selectedAudiobook.duration}
                    </div>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 leading-snug">
                    {selectedAudiobook.title}
                  </h3>
                  <p className="text-sm text-sky-700 font-medium mb-3">
                    ผู้บรรยาย: {selectedAudiobook.narrator}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed mb-6">
                    {selectedAudiobook.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <BorrowButton 
                    mediaId={selectedAudiobook.id}
                    mediaTitle={selectedAudiobook.title}
                    mediaType="audiobook"
                    mediaCover={selectedAudiobook.cover}
                  />
                  <div className="text-xs text-gray-400">
                    ยืมแล้ว {selectedAudiobook.total_borrows} ครั้ง
                  </div>
                </div>
              </div>

              {/* Chapter Track List */}
              <div className="lg:col-span-7 flex flex-col">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h4 className="font-bold text-gray-800 text-sm sm:text-base flex items-center gap-2">
                    <ListMusic size={18} className="text-sky-600" />
                    สารบัญตอน / บทบรรยาย ({selectedAudiobook.tracks.length} ตอน)
                  </h4>
                  <span className="text-xs text-gray-400">คลิกที่บทเพื่อเริ่มฟังทันที</span>
                </div>

                <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-2">
                  {selectedAudiobook.tracks.map((track) => {
                    const isTrackActive = currentTrack?.title === track.title;
                    return (
                      <div 
                        key={track.chapter_number}
                        onClick={() => handlePlayTrack({
                          id: track.title,
                          title: track.title,
                          subtitle: selectedAudiobook.title,
                          cover: selectedAudiobook.cover,
                          audio_url: track.audio_url,
                          duration: track.duration,
                          type: 'audiobook'
                        })}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer group ${
                          isTrackActive 
                            ? 'bg-sky-50/80 border-sky-200 text-sky-900 shadow-sm' 
                            : 'bg-gray-50/60 border-transparent hover:bg-gray-100/80 text-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all ${
                            isTrackActive 
                              ? 'bg-sky-600 text-white' 
                              : 'bg-white text-gray-600 group-hover:bg-sky-100 group-hover:text-sky-700 shadow-xs'
                          }`}>
                            {isTrackActive && isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                          </div>
                          <div className="min-w-0">
                            <div className="font-semibold text-sm truncate">{track.title}</div>
                            <div className="text-xs text-gray-400 flex items-center gap-1">
                              <span>ตอนที่ {track.chapter_number}</span> • <span>{track.duration} นาที</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-xs font-mono font-medium text-gray-400 ml-3">
                          {track.duration}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Other Audiobooks selector */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                    เลือกหนังสือเสียงเรื่องอื่น
                  </span>
                  <div className="flex gap-2 overflow-x-auto no-scrollbar">
                    {audiobooks.map(ab => (
                      <button
                        key={ab.id}
                        onClick={() => setSelectedAudiobookId(ab.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                          selectedAudiobookId === ab.id 
                            ? 'bg-sky-600 text-white shadow-xs' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                        }`}
                      >
                        {ab.title.split(' ')[0]}...
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: พอดแคสต์ (Podcasts) */}
        {(activeTab === 'all' || activeTab === 'podcasts') && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Radio className="text-sky-600" size={24} /> รายการพอดแคสต์ (Podcasts)
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  ซีรีส์ธรรมะร่วมสมัย เติมพลังบวก ข้อคิดสติปัญญาสำหรับการใช้ชีวิตและการทำงาน
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Podcast Shows List */}
              <div className="lg:col-span-4 space-y-4">
                {podcasts.map(pod => (
                  <div 
                    key={pod.id}
                    onClick={() => setSelectedPodcastId(pod.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                      selectedPodcastId === pod.id 
                        ? 'bg-white border-sky-400 shadow-md ring-2 ring-sky-500/10' 
                        : 'bg-white/80 border-gray-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 shadow-sm">
                        <Image src={pod.cover} alt={pod.title} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-sky-600 uppercase">PODCAST SERIES</span>
                        <h4 className="font-bold text-gray-900 text-base leading-snug line-clamp-1">{pod.title}</h4>
                        <p className="text-xs text-gray-500">ดำเนินรายการโดย {pod.host}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
                      {pod.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>รวม {pod.total_episodes} ตอน</span>
                      <span className="text-sky-600 font-semibold flex items-center gap-1">
                        เปิดฟังตอนล่าสุด <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Podcast Episode Feed */}
              <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">
                
                {/* Embedded YouTube Player when currentTrack has youtube_id and is podcast */}
                {currentTrack?.youtube_id && currentTrack?.type === 'podcast' && (
                  <div className="mb-6 rounded-2xl overflow-hidden border border-[#DCEAF3] shadow-md bg-slate-900">
                    <div className="bg-gradient-to-r from-[#073B65] via-[#084c82] to-[#079FE8] text-white px-4 py-2.5 flex items-center justify-between text-xs">
                      <span className="font-bold flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="truncate max-w-[220px] sm:max-w-md">กำลังเล่น: {currentTrack.title}</span>
                      </span>
                      <a
                        href={currentTrack.youtube_url || `https://www.youtube.com/watch?v=${currentTrack.youtube_id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-yellow-300 hover:text-white flex items-center gap-1 font-semibold transition-colors shrink-0"
                      >
                        <span>เปิดบน YouTube</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                    <div className="relative aspect-video w-full bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${currentTrack.youtube_id}?autoplay=1&rel=0`}
                        title={currentTrack.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Official YouTube Playlist Banner */}
                {selectedPodcast.playlist_url && (
                  <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50 border border-red-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-red-600 text-white flex items-center justify-center font-black text-lg shadow-md shrink-0">
                        ▶
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-bold text-red-700 bg-red-100/90 px-2 py-0.5 rounded-full uppercase tracking-wide">
                            Official YouTube Playlist
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            รวมทั้งหมด {selectedPodcast.total_episodes} ตอนจบชุด
                          </span>
                        </div>
                        <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                          เพลย์ลิสต์ทางการ: {selectedPodcast.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-1">
                          สร้างสรรค์เนื้อหาเสียงและภาพโดยทีมงานมูลนิธิฯ & YoKaWaJor
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      <a
                        href={selectedPodcast.playlist_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <span>เปิด Playlist บน YouTube</span>
                        <ExternalLink size={13} />
                      </a>
                      {selectedPodcast.book_id && (
                        <Link
                          href={`/reader/${selectedPodcast.book_id}`}
                          className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#073B65] font-bold text-xs transition-all flex items-center gap-1 shadow-2xs"
                        >
                          <BookOpen size={13} className="text-[#079FE8]" />
                          <span>อ่านเล่มนี้</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between mb-6 pb-3 border-b border-gray-100">
                  <div>
                    <span className="text-xs text-sky-600 font-bold uppercase">ตอนทั้งหมดในรายการ</span>
                    <h3 className="text-xl font-bold text-gray-900">{selectedPodcast.title}</h3>
                  </div>
                  <span className="text-xs bg-sky-50 text-sky-800 font-medium px-3 py-1 rounded-full">
                    {selectedPodcast.episodes.length} Episodes
                  </span>
                </div>

                <div className="space-y-4">
                  {selectedPodcast.episodes.map(ep => {
                    const isTrackActive = currentTrack?.title === ep.title;
                    return (
                      <div 
                        key={ep.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isTrackActive ? 'bg-sky-50/70 border-sky-300' : 'bg-gray-50/50 border-gray-100 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => handlePlayTrack({
                              id: ep.id,
                              title: ep.title,
                              subtitle: selectedPodcast.title,
                              cover: selectedPodcast.cover,
                              audio_url: ep.audio_url,
                              duration: ep.duration,
                              type: 'podcast',
                              youtube_id: ep.youtube_id,
                              youtube_url: ep.youtube_url
                            })}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-all cursor-pointer ${
                              isTrackActive 
                                ? 'bg-sky-600 text-white shadow-sky-600/30' 
                                : 'bg-white text-gray-700 hover:bg-sky-600 hover:text-white'
                            }`}
                          >
                            {isTrackActive && isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
                          </button>
                          <div>
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-200 text-gray-700">
                                EP.{ep.episode_number}
                              </span>
                              {ep.youtube_id && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200/80 px-2 py-0.5 rounded flex items-center gap-1">
                                  <span>YouTube Podcast</span>
                                </span>
                              )}
                              <span className="text-xs text-gray-400">{ep.published_at}</span>
                            </div>
                            <h5 className="font-bold text-gray-900 text-sm sm:text-base leading-tight mb-1">
                              {ep.title}
                            </h5>
                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                              {ep.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                          <span className="text-xs text-gray-400 font-mono flex items-center gap-1">
                            <Clock size={12} /> {ep.duration}
                          </span>
                          {ep.youtube_id && (
                            <a
                              href={ep.youtube_url || `https://www.youtube.com/watch?v=${ep.youtube_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="เปิดดูบน YouTube"
                            >
                              <ExternalLink size={14} />
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: เสียงบรรยายธรรมเทศนา (Dhamma Lectures) */}
        {(activeTab === 'all' || activeTab === 'audios') && (
          <div className="mb-14">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <ListMusic className="text-sky-600" size={24} /> เสียงบรรยายธรรมเทศนาทั่วไป
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  เสียงบรรยายหัวข้อธรรมะสำหรับฝึกจิตตภาวนาและการดำเนินชีวิต
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialAudios.map(audio => (
                <div key={audio.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-all">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 bg-sky-100 text-sky-700 rounded-2xl flex items-center justify-center shrink-0">
                      <Headphones size={28} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-900 text-base truncate">{audio.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">ความยาว: {audio.duration}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {audio.description}
                  </p>
                  <button
                    onClick={() => handlePlayTrack({
                      id: audio.id,
                      title: audio.title,
                      subtitle: 'เสียงบรรยายธรรมะ',
                      cover: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
                      audio_url: audio.audio_url,
                      duration: audio.duration,
                      type: 'audio'
                    })}
                    className="w-full py-2.5 rounded-xl bg-sky-50 hover:bg-sky-600 hover:text-white text-sky-800 font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Play size={15} /> ฟังเสียงบรรยายนี้
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Audio Player Bar (Deep Navy Player for Multimedia Separation) */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#073B65] text-white shadow-2xl px-4 py-3 sm:py-3.5 transition-all border-t border-white/10">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            
            {/* Left: Track Info */}
            <div className="flex items-center gap-3 w-full sm:w-1/3 min-w-0">
              <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-sm shrink-0 ring-1 ring-white/20">
                <Image src={currentTrack.cover} alt={currentTrack.title} fill className="object-cover" unoptimized />
              </div>
              <div className="min-w-0">
                <h5 className="font-bold text-white text-sm truncate leading-tight">{currentTrack.title}</h5>
                <p className="text-xs text-sky-200 font-medium truncate mt-0.5">{currentTrack.subtitle}</p>
              </div>
            </div>

            {/* Center: Controls & Time Bar */}
            <div className="flex flex-col items-center w-full sm:w-1/3 gap-1.5">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setProgress(p => Math.max(0, p - 10))}
                  className="p-1.5 text-sky-200 hover:text-white transition-colors cursor-pointer"
                  title="ย้อนหลัง 10 วินาที"
                >
                  <SkipBack size={18} />
                </button>

                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-full bg-[#079FE8] hover:bg-[#0588c7] text-white flex items-center justify-center shadow-md shadow-[#079FE8]/40 transition-transform active:scale-95 cursor-pointer"
                >
                  {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                </button>

                <button 
                  onClick={() => setProgress(p => Math.min(100, p + 10))}
                  className="p-1.5 text-sky-200 hover:text-white transition-colors cursor-pointer"
                  title="ข้ามไปข้างหน้า 10 วินาที"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="w-full flex items-center gap-2 max-w-md">
                <span className="text-[10px] font-mono text-sky-300">02:15</span>
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setProgress(Math.round((clickX / rect.width) * 100));
                  }}
                  className="flex-grow h-1.5 bg-white/20 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div 
                    className="h-full bg-[#079FE8] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-sky-300">{currentTrack.duration}</span>
              </div>
            </div>

            {/* Right: Melolo-style Listen-to-Earn, Transcript, Volume & Speed */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 w-full sm:w-1/3">
              <MeloloWatchToEarnWidget
                mediaType="audio"
                isPlaying={isPlaying}
                title={currentTrack.title}
                sourceId={currentTrack.id}
              />

              {/* Transcript Drawer Toggle Button */}
              <button
                onClick={() => setIsTranscriptOpen(prev => !prev)}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  isTranscriptOpen
                    ? 'bg-[#079FE8] border-[#079FE8] text-white shadow-xs'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
                }`}
                title="เปิดบทถอดเสียงบรรยายธรรม (Transcript)"
              >
                <Quote size={13} />
                <span className="hidden md:inline">บทถอดเสียง</span>
              </button>

              <button 
                onClick={cycleSpeed}
                className="px-2 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-semibold transition-colors cursor-pointer"
                title="ความเร็วในการเล่น"
              >
                {playbackSpeed}x
              </button>

              <button 
                onClick={() => setIsMuted(m => !m)}
                className="p-1.5 text-sky-200 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
              >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Slide-over Drawer for Audio Transcript */}
      {isTranscriptOpen && currentTrack && (
        <div className="fixed inset-0 z-[60] flex justify-end bg-black/40 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 text-white h-full shadow-2xl flex flex-col border-l border-white/10 animate-slideLeft">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-white">บทถอดเสียงบรรยายธรรม</h3>
                <p className="text-xs text-sky-300 truncate max-w-[280px]">{currentTrack.title}</p>
              </div>
              <button
                onClick={() => setIsTranscriptOpen(false)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-hidden">
              <TranscriptViewer
                transcript={audioTranscript}
                title={currentTrack.title}
                onSeek={(secs) => {
                  setProgress(Math.min(100, Math.round((secs / 360) * 100)));
                  setIsPlaying(true);
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function AudiosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-3 border-[#079FE8] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-bold text-[#073B65]">กำลังโหลดคลังเสียงและพอดแคสต์...</span>
      </div>
    }>
      <AudiosPageContent />
    </Suspense>
  );
}
