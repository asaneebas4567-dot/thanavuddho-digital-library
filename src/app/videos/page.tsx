'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { officialChannelProfile, libraryVideos } from '@/data/videoData';
import { Video } from '@/types';
import ChannelHeader from '@/components/videos/ChannelHeader';
import VideoTabs, { VideoFilterTab } from '@/components/videos/VideoTabs';
import VideoCard from '@/components/videos/VideoCard';
import VideoWatchView from '@/components/videos/VideoWatchView';
import { Search, Sparkles, Filter, ChevronDown } from 'lucide-react';

function VideosMainContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialVideoId = searchParams.get('id');

  // Filter Tab State: 'all' | 'horizontal' | 'vertical'
  const [activeTab, setActiveTab] = useState<VideoFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleCount, setVisibleCount] = useState<number>(12);

  const [videos, setVideos] = useState<Video[]>(libraryVideos);

  // Selected Video for Watch Mode
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(() => {
    if (initialVideoId) {
      return libraryVideos.find(v => v.id === initialVideoId) || null;
    }
    return null;
  });

  // Fetch live YouTube views in background
  useEffect(() => {
    fetch('/api/youtube/views')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.views) {
          setVideos(prev => prev.map(v => {
            if (v.youtubeId && data.views[v.youtubeId] !== undefined) {
              return { ...v, view_count: data.views[v.youtubeId] };
            }
            return v;
          }));
          if (selectedVideo && selectedVideo.youtubeId && data.views[selectedVideo.youtubeId] !== undefined) {
            setSelectedVideo(prev => prev ? { ...prev, view_count: data.views[prev.youtubeId!] } : null);
          }
        }
      })
      .catch(() => {});
  }, []);

  // Keep state synchronized with URL query params
  useEffect(() => {
    if (initialVideoId) {
      const match = videos.find(v => v.id === initialVideoId);
      if (match) {
        setSelectedVideo(match);
      }
    } else {
      setSelectedVideo(null);
    }
  }, [initialVideoId, videos]);

  // Compute counts for tabs
  const counts = useMemo(() => {
    const horizontal = videos.filter(v => v.orientation === 'horizontal').length;
    const vertical = videos.filter(v => v.orientation === 'vertical').length;
    const ready = videos.filter(v => v.is_available).length;
    return {
      all: videos.length,
      horizontal,
      vertical,
      ready
    };
  }, [videos]);

  // Filtered videos based on activeTab and optional search
  const filteredVideos = useMemo(() => {
    return videos.filter(v => {
      // Tab filter
      if (activeTab === 'horizontal' && v.orientation !== 'horizontal') return false;
      if (activeTab === 'vertical' && v.orientation !== 'vertical') return false;

      // Search keyword filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = v.title.toLowerCase().includes(q);
        const matchDesc = v.description.toLowerCase().includes(q);
        const matchTag = v.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchTag) return false;
      }

      return true;
    });
  }, [activeTab, searchQuery]);

  // Handle switching video / opening watch view
  const handleSelectVideo = (video: Video) => {
    setSelectedVideo(video);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const newUrl = `/videos?id=${video.id}`;
      window.history.pushState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    } catch {
      // ignore
    }
  };

  // Handle back to grid
  const handleBackToGrid = () => {
    setSelectedVideo(null);
    try {
      window.history.pushState({ ...window.history.state, as: '/videos', url: '/videos' }, '', '/videos');
    } catch {
      // ignore
    }
  };

  // Reset pagination when tab or search changes
  const handleTabChange = (tab: VideoFilterTab) => {
    setActiveTab(tab);
    setVisibleCount(12);
  };

  // If in Watch Mode, display the dedicated VideoWatchView (which handles both 16:9 and 9:16)
  if (selectedVideo) {
    return (
      <VideoWatchView
        video={selectedVideo}
        allVideos={videos}
        onBackToGrid={handleBackToGrid}
        onSelectVideo={handleSelectVideo}
      />
    );
  }

  // Grid displayed count
  const displayedVideos = filteredVideos.slice(0, visibleCount);
  const hasMore = visibleCount < filteredVideos.length;

  return (
    <div className="min-h-screen bg-[#fafaf9] flex flex-col font-sans">
      
      {/* 1. Profile Header for Video Channel */}
      <ChannelHeader
        channel={officialChannelProfile}
        totalCount={counts.all}
        horizontalCount={counts.horizontal}
        verticalCount={counts.vertical}
        readyCount={counts.ready}
      />

      {/* 2. Tabs Bar for filtering videos */}
      <VideoTabs
        activeTab={activeTab}
        onChangeTab={handleTabChange}
        counts={counts}
      />

      {/* 3. Main Gallery / Grid Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
        
        {/* Controls Toolbar: Search & Information Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
              {activeTab === 'all' && 'วิดีโอทั้งหมดในคลังดิจิทัล'}
              {activeTab === 'horizontal' && 'วิดีโอแนวนอน 16:9'}
              {activeTab === 'vertical' && 'วิดีโอแนวตั้ง 9:16 (Shorts)'}
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-bold border border-zinc-200">
              พบ {filteredVideos.length} รายการ
            </span>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="ค้นหาชื่อวิดีโอหรือหัวข้อธรรมะ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white border border-border/70 text-xs sm:text-sm text-foreground placeholder-zinc-400 focus:outline-none focus:border-amber-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Video Cards Grid */}
        {displayedVideos.length > 0 ? (
          <div 
            className={`grid gap-6 ${
              activeTab === 'vertical'
                ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            }`}
          >
            {displayedVideos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onSelect={handleSelectVideo}
              />
            ))}
          </div>
        ) : (
          /* Empty Search Result */
          <div className="py-20 text-center rounded-3xl bg-white border border-dashed border-zinc-200 p-8">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Filter className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-foreground mb-1">ไม่พบวิดีโอที่ตรงกับคำค้นหา</h3>
            <p className="text-xs text-foreground/60 max-w-sm mx-auto mb-4">
              ลองค้นหาด้วยคำอื่น หรือเลือกแท็บ &quot;วิดีโอทั้งหมด&quot; เพื่อดูเนื้อหาในคลัง
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setActiveTab('all');
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              แสดงวิดีโอทั้งหมด
            </button>
          </div>
        )}

        {/* 4. Pagination / Load More Button */}
        {hasMore && (
          <div className="mt-10 mb-6 flex flex-col items-center justify-center gap-2">
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-amber-500 text-foreground text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer group"
            >
              <span>โหลดวิดีโอเพิ่มเติม</span>
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform text-amber-600" />
            </button>
            <span className="text-[11px] text-foreground/50">
              แสดงแล้ว {displayedVideos.length} จากทั้งหมด {filteredVideos.length} รายการ
            </span>
          </div>
        )}

      </div>

    </div>
  );
}

export default function VideosPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-600">กำลังเปิดคลังวิดีโอ Thanavuddho Library...</p>
        </div>
      </div>
    }>
      <VideosMainContent />
    </Suspense>
  );
}
