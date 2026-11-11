'use client';

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { PodcastItem, PodcastPlayerState, PodcastSourceType } from '@/types/podcast';
import { parseYouTubeUrl } from '@/lib/youtubeUtils';
import { useAuth } from '@/context/AuthContext';

// Declare YouTube IFrame API window type
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const PodcastPlayerContext = createContext<PodcastPlayerState | undefined>(undefined);

export function PodcastPlayerProvider({ children }: { children: React.ReactNode }) {
  const { user, updateUserPoints } = useAuth();
  const userEmail = user?.email || '';

  // Core Player State
  const [currentPodcast, setCurrentPodcast] = useState<PodcastItem | null>(null);
  const [sourceType, setSourceType] = useState<PodcastSourceType | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [playbackRate, setPlaybackRateState] = useState<number>(1);
  const [volume, setVolumeState] = useState<number>(85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  // References for Media Adapters
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtApiReadyRef = useRef<boolean>(false);
  const tickerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sessionHeartbeatTimerRef = useRef<NodeJS.Timeout | null>(null);

  // ---------------------------------------------------------------------------
  // 1. INITIALIZE ADAPTERS ON MOUNT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // 1.1 Initialize HTMLAudioElement for MP3
    if (typeof window !== 'undefined' && !audioRef.current) {
      const audio = new Audio();
      audio.preload = 'metadata';
      audio.volume = volume / 100;
      audioRef.current = audio;

      // MP3 Events
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        setPlaybackError(null);
      };

      audio.onpause = () => {
        setIsPlaying(false);
      };

      audio.onwaiting = () => {
        setIsLoading(true);
      };

      audio.oncanplay = () => {
        setIsLoading(false);
      };

      audio.onloadedmetadata = () => {
        if (audio.duration && !isNaN(audio.duration)) {
          setDuration(Math.floor(audio.duration));
        }
        setIsLoading(false);
      };

      audio.ontimeupdate = () => {
        if (!isNaN(audio.currentTime)) {
          setCurrentTime(Math.floor(audio.currentTime));
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setCurrentTime(0);
      };

      audio.onerror = () => {
        setIsLoading(false);
        setIsPlaying(false);
        setPlaybackError('ไม่สามารถโหลดไฟล์เสียง MP3 ได้ กรุณาตรวจสอบเครือข่ายหรือไฟล์ต้นทาง');
      };
    }

    // 1.2 Load YouTube IFrame Player API Script
    if (typeof window !== 'undefined') {
      if (window.YT && window.YT.Player) {
        isYtApiReadyRef.current = true;
      } else {
        const existingScript = document.getElementById('youtube-iframe-api');
        if (!existingScript) {
          const tag = document.createElement('script');
          tag.id = 'youtube-iframe-api';
          tag.src = 'https://www.youtube.com/iframe_api';
          document.body.appendChild(tag);
        }

        window.onYouTubeIframeAPIReady = () => {
          isYtApiReadyRef.current = true;
        };
      }
    }

    return () => {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
      if (progressSaveTimerRef.current) clearInterval(progressSaveTimerRef.current);
      if (sessionHeartbeatTimerRef.current) clearInterval(sessionHeartbeatTimerRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 2. YOUTUBE PLAYER INITIALIZATION HELPER
  // ---------------------------------------------------------------------------
  const initYouTubePlayer = useCallback((videoId: string, startSeconds: number = 0) => {
    setIsLoading(true);
    setPlaybackError(null);

    const containerId = 'global-yt-player-slot';
    const container = document.getElementById(containerId);
    if (!container) return;

    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.loadVideoById({
          videoId,
          startSeconds: Math.floor(startSeconds)
        });
        ytPlayerRef.current.playVideo();
        return;
      } catch {
        try {
          ytPlayerRef.current.destroy();
        } catch {}
        ytPlayerRef.current = null;
      }
    }

    const checkAndCreate = () => {
      if (!window.YT || !window.YT.Player) {
        setTimeout(checkAndCreate, 200);
        return;
      }

      try {
        ytPlayerRef.current = new window.YT.Player(containerId, {
          height: '100%',
          width: '100%',
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 1,
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            start: Math.floor(startSeconds)
          },
          events: {
            onReady: (event: any) => {
              setIsLoading(false);
              event.target.setVolume(volume);
              event.target.setPlaybackRate(playbackRate);
              if (isMuted) event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              // YT.PlayerState: -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 video cued
              if (event.data === 1) {
                setIsPlaying(true);
                setIsLoading(false);
                setPlaybackError(null);
                const dur = ytPlayerRef.current?.getDuration();
                if (dur && !isNaN(dur)) setDuration(Math.floor(dur));
              } else if (event.data === 2) {
                setIsPlaying(false);
              } else if (event.data === 3) {
                setIsLoading(true);
              } else if (event.data === 0) {
                setIsPlaying(false);
                setCurrentTime(0);
              }
            },
            onError: (event: any) => {
              setIsLoading(false);
              setIsPlaying(false);
              const errorCode = event.data;
              if (errorCode === 101 || errorCode === 150) {
                setPlaybackError('เจ้าของวิดีโอไม่อนุญาตให้เล่นแบบฝัง (Embed Disabled) กรุณากดปุ่มเปิดบน YouTube เพื่อรับฟัง');
              } else if (errorCode === 100) {
                setPlaybackError('ไม่พบวิดีโอนี้ หรือวิดีโอถูกตั้งค่าเป็นส่วนตัว');
              } else {
                setPlaybackError('เกิดข้อผิดพลาดในการโหลดวิดีโอ YouTube (รหัส: ' + errorCode + ')');
              }
            }
          }
        });
      } catch (err: any) {
        setIsLoading(false);
        setPlaybackError('ไม่สามารถเริ่มต้นเครื่องเล่น YouTube ได้: ' + (err.message || ''));
      }
    };

    checkAndCreate();
  }, [volume, playbackRate, isMuted]);

  // ---------------------------------------------------------------------------
  // 3. PLAY PODCAST (UNIFIED METHOD FOR BOTH YOUTUBE & MP3)
  // ---------------------------------------------------------------------------
  const playPodcast = useCallback(async (podcast: PodcastItem, startPosition?: number) => {
    // 1. Stop and cleanup current active playback
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.stopVideo();
      } catch {}
    }

    setCurrentPodcast(podcast);
    const source = podcast.source_type === 'mp3' ? 'mp3' : 'youtube';
    setSourceType(source);
    setIsLoading(true);
    setPlaybackError(null);

    // Initial duration from metadata if present
    if (podcast.duration_seconds && podcast.duration_seconds > 0) {
      setDuration(podcast.duration_seconds);
    }

    // Determine starting position: manual parameter or fetch from saved progress
    let startSec = startPosition !== undefined ? startPosition : 0;
    if (startPosition === undefined && userEmail) {
      try {
        const res = await fetch(`/api/podcasts/progress?email=${encodeURIComponent(userEmail)}&podcastId=${encodeURIComponent(podcast.id)}`);
        const json = await res.json();
        if (json.success && json.progress?.current_position_seconds > 5 && !json.progress?.completed_status) {
          startSec = json.progress.current_position_seconds;
        }
      } catch {}
    }
    setCurrentTime(startSec);

    // 2. Play based on Source Type
    if (source === 'mp3') {
      const streamUrl = podcast.audio_url || podcast.audio_file_path || '';
      if (!streamUrl) {
        setIsLoading(false);
        setPlaybackError('ไม่พบลิงก์หรือไฟล์เสียง MP3 สำหรับรายการนี้');
        return;
      }

      if (audioRef.current) {
        audioRef.current.src = streamUrl;
        audioRef.current.currentTime = startSec;
        audioRef.current.playbackRate = playbackRate;
        audioRef.current.volume = volume / 100;
        audioRef.current.muted = isMuted;

        // Native MediaSession API for lock-screen controls on iOS & Android
        if ('mediaSession' in navigator) {
          try {
            navigator.mediaSession.metadata = new MediaMetadata({
              title: podcast.title,
              artist: podcast.host || 'พระครูปลัดสุวัฒนโพธิคุณ',
              album: 'Thanavuddho Podcast',
              artwork: [
                { src: podcast.cover_image || '/images/books/tam-jai-hai-prom-buak.jpg', sizes: '512x512', type: 'image/jpeg' }
              ]
            });
            navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
            navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
            navigator.mediaSession.setActionHandler('seekbackward', () => {
              if (audioRef.current) audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime - 10);
            });
            navigator.mediaSession.setActionHandler('seekforward', () => {
              if (audioRef.current) audioRef.current.currentTime = Math.min(audioRef.current.duration || 9999, audioRef.current.currentTime + 10);
            });
          } catch {}
        }

        audioRef.current.play().catch((err) => {
          setIsLoading(false);
          if (err.name === 'NotAllowedError') {
            setPlaybackError('เบราว์เซอร์ระงับการเล่นอัตโนมัติ กรุณากดปุ่มเล่น');
          } else {
            setPlaybackError('ไม่สามารถเล่นไฟล์เสียง MP3 ได้: ' + err.message);
          }
        });
      }
    } else {
      // YouTube Source
      const ytId = podcast.youtube_video_id || parseYouTubeUrl(podcast.youtube_url || '').videoId;
      if (!ytId) {
        setIsLoading(false);
        setPlaybackError('ไม่พบ Video ID สำหรับวิดีโอ YouTube นี้');
        return;
      }
      initYouTubePlayer(ytId, startSec);
    }
  }, [userEmail, playbackRate, volume, isMuted, initYouTubePlayer]);

  // ---------------------------------------------------------------------------
  // 4. TICKER FOR YOUTUBE CURRENT TIME TRACKING
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (sourceType === 'youtube' && isPlaying) {
      tickerIntervalRef.current = setInterval(() => {
        if (ytPlayerRef.current) {
          try {
            const time = ytPlayerRef.current.getCurrentTime();
            if (time !== undefined && !isNaN(time)) {
              setCurrentTime(Math.floor(time));
            }
            const dur = ytPlayerRef.current.getDuration();
            if (dur !== undefined && !isNaN(dur) && dur > 0) {
              setDuration(Math.floor(dur));
            }
          } catch {}
        }
      }, 500);
    } else {
      if (tickerIntervalRef.current) {
        clearInterval(tickerIntervalRef.current);
        tickerIntervalRef.current = null;
      }
    }

    return () => {
      if (tickerIntervalRef.current) clearInterval(tickerIntervalRef.current);
    };
  }, [sourceType, isPlaying]);

  // ---------------------------------------------------------------------------
  // 5. PROGRESS AUTO-SAVE (PHASE 7) - EVERY 15 SECONDS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isPlaying || !currentPodcast || !userEmail) {
      if (progressSaveTimerRef.current) {
        clearInterval(progressSaveTimerRef.current);
        progressSaveTimerRef.current = null;
      }
      return;
    }

    progressSaveTimerRef.current = setInterval(() => {
      if (currentTime > 0) {
        fetch('/api/podcasts/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: userEmail,
            podcastId: currentPodcast.id,
            currentPositionSeconds: currentTime,
            durationSeconds: duration
          })
        }).catch(() => {});
      }
    }, 15000);

    return () => {
      if (progressSaveTimerRef.current) clearInterval(progressSaveTimerRef.current);
    };
  }, [isPlaying, currentPodcast, userEmail, currentTime, duration]);

  // ---------------------------------------------------------------------------
  // 6. LISTENING SESSION & POINT INTEGRATION (PHASE 8) - HEARTBEAT
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!isPlaying || !currentPodcast || !userEmail) {
      if (sessionHeartbeatTimerRef.current) {
        clearInterval(sessionHeartbeatTimerRef.current);
        sessionHeartbeatTimerRef.current = null;
      }
      return;
    }

    sessionHeartbeatTimerRef.current = setInterval(() => {
      // Don't accumulate time if window is in background / not focused
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden' && sourceType === 'youtube') {
        return;
      }

      fetch('/api/podcasts/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          podcastId: currentPodcast.id,
          sourceType: currentPodcast.source_type,
          deltaSeconds: 15
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.pointsAwarded > 0 && typeof updateUserPoints === 'function') {
            updateUserPoints(data.pointsAwarded);
          }
        })
        .catch(() => {});
    }, 15000);

    return () => {
      if (sessionHeartbeatTimerRef.current) clearInterval(sessionHeartbeatTimerRef.current);
    };
  }, [isPlaying, currentPodcast, userEmail, sourceType, updateUserPoints]);

  // ---------------------------------------------------------------------------
  // 7. CONTROLS IMPLEMENTATION
  // ---------------------------------------------------------------------------
  const pausePodcast = useCallback(() => {
    if (sourceType === 'mp3') {
      audioRef.current?.pause();
    } else if (sourceType === 'youtube') {
      try {
        ytPlayerRef.current?.pauseVideo();
      } catch {}
    }
    setIsPlaying(false);
  }, [sourceType]);

  const resumePodcast = useCallback(() => {
    if (sourceType === 'mp3') {
      audioRef.current?.play().catch(() => {});
    } else if (sourceType === 'youtube') {
      try {
        ytPlayerRef.current?.playVideo();
      } catch {}
    }
  }, [sourceType]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pausePodcast();
    } else {
      resumePodcast();
    }
  }, [isPlaying, pausePodcast, resumePodcast]);

  const seekTo = useCallback((seconds: number) => {
    const target = Math.max(0, Math.min(seconds, duration || 99999));
    setCurrentTime(target);

    if (sourceType === 'mp3') {
      if (audioRef.current) {
        audioRef.current.currentTime = target;
      }
    } else if (sourceType === 'youtube') {
      try {
        ytPlayerRef.current?.seekTo(target, true);
      } catch {}
    }
  }, [duration, sourceType]);

  const seekRelative = useCallback((deltaSeconds: number) => {
    seekTo(currentTime + deltaSeconds);
  }, [currentTime, seekTo]);

  const setPlaybackRate = useCallback((rate: number) => {
    setPlaybackRateState(rate);
    if (sourceType === 'mp3') {
      if (audioRef.current) {
        audioRef.current.playbackRate = rate;
      }
    } else if (sourceType === 'youtube') {
      try {
        ytPlayerRef.current?.setPlaybackRate(rate);
      } catch {}
    }
  }, [sourceType]);

  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(100, val));
    setVolumeState(clamped);
    setIsMuted(clamped === 0);

    if (sourceType === 'mp3') {
      if (audioRef.current) {
        audioRef.current.volume = clamped / 100;
        audioRef.current.muted = clamped === 0;
      }
    } else if (sourceType === 'youtube') {
      try {
        ytPlayerRef.current?.setVolume(clamped);
        if (clamped === 0) ytPlayerRef.current?.mute();
        else ytPlayerRef.current?.unMute();
      } catch {}
    }
  }, [sourceType]);

  const toggleMute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(volume > 0 ? volume : 80);
    } else {
      setIsMuted(true);
      if (sourceType === 'mp3') {
        if (audioRef.current) audioRef.current.muted = true;
      } else if (sourceType === 'youtube') {
        try {
          ytPlayerRef.current?.mute();
        } catch {}
      }
    }
  }, [isMuted, volume, setVolume, sourceType]);

  const expandPlayer = useCallback(() => {
    setIsExpanded(true);
  }, []);

  const minimizePlayer = useCallback(() => {
    setIsExpanded(false);
  }, []);

  const closePlayer = useCallback(() => {
    // Save last position before closing
    if (currentPodcast && userEmail && currentTime > 0) {
      fetch('/api/podcasts/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          podcastId: currentPodcast.id,
          currentPositionSeconds: currentTime,
          durationSeconds: duration
        })
      }).catch(() => {});
    }

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    if (ytPlayerRef.current) {
      try {
        ytPlayerRef.current.stopVideo();
        ytPlayerRef.current.destroy();
      } catch {}
      ytPlayerRef.current = null;
    }

    setCurrentPodcast(null);
    setSourceType(null);
    setIsPlaying(false);
    setIsLoading(false);
    setIsExpanded(false);
    setCurrentTime(0);
    setDuration(0);
    setPlaybackError(null);
  }, [currentPodcast, userEmail, currentTime, duration]);

  const contextValue: PodcastPlayerState = {
    currentPodcast,
    sourceType,
    isPlaying,
    isLoading,
    isExpanded,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    playbackError,
    playPodcast,
    pausePodcast,
    resumePodcast,
    togglePlay,
    seekTo,
    seekRelative,
    setPlaybackRate,
    setVolume,
    toggleMute,
    expandPlayer,
    minimizePlayer,
    closePlayer
  };

  return (
    <PodcastPlayerContext.Provider value={contextValue}>
      {children}
    </PodcastPlayerContext.Provider>
  );
}

export function usePodcastPlayer() {
  const context = useContext(PodcastPlayerContext);
  if (!context) {
    throw new Error('usePodcastPlayer must be used within a PodcastPlayerProvider');
  }
  return context;
}

