'use client';

import React from 'react';
import { usePodcastPlayer } from '@/context/PodcastPlayerContext';
import MiniPlayer from './MiniPlayer';
import ExpandedPlayerModal from './ExpandedPlayerModal';

export default function GlobalPodcastPlayer() {
  const { currentPodcast, sourceType, isExpanded } = usePodcastPlayer();

  if (!currentPodcast) return null;

  return (
    <>
      {/* 
        Persistent Host Container for YouTube IFrame Player
        Crucial Architectural Requirement:
        1. Single persistent DOM node so iframe is NEVER reloaded on route change or expand/minimize.
        2. Never hidden with display:none to respect YouTube Terms of Service.
      */}
      {sourceType === 'youtube' && (
        <div
          aria-hidden={!isExpanded}
          className={`transition-all duration-300 z-50 overflow-hidden ${
            isExpanded
              ? 'fixed top-[15vh] sm:top-[12vh] left-1/2 -translate-x-1/2 w-[92vw] max-w-2xl aspect-video rounded-2xl shadow-2xl pointer-events-auto border-2 border-slate-700 bg-black'
              : 'fixed bottom-32 sm:bottom-20 right-3 sm:right-6 w-36 sm:w-44 aspect-video rounded-xl shadow-xl border border-white/30 bg-black pointer-events-auto ring-2 ring-[#079FE8]/40'
          }`}
        >
          <div id="global-yt-player-slot" className="w-full h-full" />
        </div>
      )}

      {/* Mini Player Sticky Bottom Bar */}
      <MiniPlayer />

      {/* Full Expanded Player Modal / Drawer */}
      <ExpandedPlayerModal />
    </>
  );
}

