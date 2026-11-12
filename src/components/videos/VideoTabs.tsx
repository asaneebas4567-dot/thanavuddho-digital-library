'use client';

import React from 'react';
import { Video, Monitor, Smartphone } from 'lucide-react';

export type VideoFilterTab = 'all' | 'horizontal' | 'vertical';

interface VideoTabsProps {
  activeTab: VideoFilterTab;
  onChangeTab: (tab: VideoFilterTab) => void;
  counts: {
    all: number;
    horizontal: number;
    vertical: number;
  };
}

export default function VideoTabs({
  activeTab,
  onChangeTab,
  counts
}: VideoTabsProps) {
  const tabs = [
    {
      id: 'all' as VideoFilterTab,
      label: 'วิดีโอทั้งหมด',
      count: counts.all,
      icon: Video
    },
    {
      id: 'horizontal' as VideoFilterTab,
      label: 'วิดีโอแนวนอน (16:9)',
      count: counts.horizontal,
      icon: Monitor
    },
    {
      id: 'vertical' as VideoFilterTab,
      label: '🔥 วิดีโอสั้น (Shorts & TikTok)',
      count: counts.vertical,
      icon: Smartphone
    }
  ];

  return (
    <div className="w-full bg-white border-b border-border/40 sticky top-16 z-30 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav 
          className="flex space-x-2 sm:space-x-8 overflow-x-auto no-scrollbar py-2 sm:py-0"
          aria-label="Video Categories"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`relative group inline-flex items-center gap-2 py-3 sm:py-4 px-3 sm:px-1 text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer rounded-xl sm:rounded-none ${
                  isActive
                    ? 'text-amber-600 sm:text-foreground bg-amber-50 sm:bg-transparent'
                    : 'text-foreground/60 hover:text-foreground hover:bg-zinc-50 sm:hover:bg-transparent'
                }`}
              >
                <Icon 
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-amber-600' : 'text-foreground/40 group-hover:text-foreground/70'
                  }`} 
                />
                
                <span>{tab.label}</span>

                {/* Counter Pill */}
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold transition-colors ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-zinc-100 text-foreground/60 group-hover:bg-zinc-200'
                  }`}
                >
                  {tab.count}
                </span>

                {/* Active Underline Highlight on Desktop */}
                {isActive && (
                  <span className="hidden sm:block absolute inset-x-0 bottom-0 h-0.5 bg-amber-600 rounded-full shadow-sm" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
