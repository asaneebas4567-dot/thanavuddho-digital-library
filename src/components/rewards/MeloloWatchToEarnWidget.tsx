'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Coins, Gift, CheckCircle2, Flame } from 'lucide-react';
import { useLearningPoints } from '@/lib/useLearningPoints';

interface MeloloWatchToEarnWidgetProps {
  mediaType: 'video' | 'audio';
  isPlaying: boolean;
  title?: string;
  sourceId?: string;
  className?: string;
}

export default function MeloloWatchToEarnWidget({
  mediaType,
  isPlaying,
  title,
  sourceId,
  className = ''
}: MeloloWatchToEarnWidgetProps) {
  const { recordEarn, userEmail, dailyLearningPoints, isDailyCapReached } = useLearningPoints();

  const [cycleSeconds, setCycleSeconds] = useState<number>(0);
  const [completedCycles, setCompletedCycles] = useState<number>(0);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [celebrationPoints, setCelebrationPoints] = useState<number>(5);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const TARGET_SECONDS = 600; // 10 minutes
  const tickRef = useRef<NodeJS.Timeout | null>(null);
  const lastSyncTimeRef = useRef<number>(Date.now());
  const accumulatedUnsyncedRef = useRef<number>(0);

  // Load initial progress from server
  useEffect(() => {
    if (!userEmail) return;

    fetch(`/api/points?email=${encodeURIComponent(userEmail)}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const progress = mediaType === 'video' ? data.videoProgress : data.audioProgress;
          if (progress) {
            setCycleSeconds(progress.currentCycleSeconds || 0);
            setCompletedCycles(progress.completedCycles || 0);
          }
        }
      })
      .catch(() => {});
  }, [userEmail, mediaType]);

  // Handle active playing ticker & anti-cheat
  useEffect(() => {
    // Only tick when isPlaying is true and tab is active
    if (!isPlaying) {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      return;
    }

    const handleVisibilityChange = () => {
      // Tab hidden -> pause counting
      if (document.visibilityState === 'hidden') {
        if (tickRef.current) {
          clearInterval(tickRef.current);
          tickRef.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    tickRef.current = setInterval(() => {
      // Check document visibility
      if (document.visibilityState === 'hidden') return;

      setCycleSeconds(prev => {
        const next = prev + 1;
        accumulatedUnsyncedRef.current += 1;

        // Periodic sync to server every 15 seconds
        if (accumulatedUnsyncedRef.current >= 15) {
          const delta = accumulatedUnsyncedRef.current;
          accumulatedUnsyncedRef.current = 0;
          recordEarn({
            type: mediaType === 'video' ? 'watch_video' : 'listen_podcast',
            sourceId,
            durationSeconds: delta
          });
        }

        // Cycle completed! (10 minutes)
        if (next >= TARGET_SECONDS) {
          // Immediately sync completion to server
          recordEarn({
            type: mediaType === 'video' ? 'watch_video' : 'listen_podcast',
            sourceId,
            durationSeconds: accumulatedUnsyncedRef.current
          }).then(res => {
            if (res && res.pointsEarned > 0) {
              setCelebrationPoints(res.pointsEarned);
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 4500);
            }
          });
          accumulatedUnsyncedRef.current = 0;
          setCompletedCycles(c => c + 1);
          return 0; // restart new 10m cycle automatically
        }

        return next;
      });
    }, 1000);

    return () => {
      if (tickRef.current) {
        clearInterval(tickRef.current);
        tickRef.current = null;
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);

      // Flush remaining unsynced seconds on unmount
      if (accumulatedUnsyncedRef.current > 0) {
        const delta = accumulatedUnsyncedRef.current;
        accumulatedUnsyncedRef.current = 0;
        recordEarn({
          type: mediaType === 'video' ? 'watch_video' : 'listen_podcast',
          sourceId,
          durationSeconds: delta
        });
      }
    };
  }, [isPlaying, mediaType, sourceId, recordEarn]);

  // Format mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = Math.min(100, Math.floor((cycleSeconds / TARGET_SECONDS) * 100));
  const remainingSeconds = Math.max(0, TARGET_SECONDS - cycleSeconds);

  return (
    <div className={`relative ${className}`}>
      {/* Melolo Floating Coin Pill */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-zinc-900/90 hover:bg-zinc-900 border border-amber-500/40 hover:border-amber-400 text-white shadow-xl backdrop-blur-md transition-all cursor-pointer select-none"
      >
        {/* Animated Coin Badge */}
        <div className="relative w-7 h-7 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center text-zinc-950 font-black shadow-md shrink-0">
          <span className={`text-xs ${isPlaying ? 'animate-bounce' : ''}`}>🪙</span>
          {isPlaying && (
            <span className="absolute -inset-0.5 rounded-full bg-amber-400/30 animate-ping pointer-events-none" />
          )}
        </div>

        {/* Real-time Progress Bar & Time */}
        <div className="flex flex-col min-w-[95px]">
          <div className="flex items-center justify-between text-[11px] font-mono leading-none mb-1">
            <span className="font-bold text-amber-300">
              {formatTime(cycleSeconds)}
            </span>
            <span className="text-zinc-400">/ 10:00</span>
          </div>

          {/* Progress bar track */}
          <div className="w-full h-1.5 bg-white/15 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Reward pill badge */}
        <span className="hidden xs:inline-flex items-center px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-extrabold tracking-wide">
          +5 P
        </span>
      </div>

      {/* Expanded Details Popup */}
      {isExpanded && (
        <div className="absolute top-full mt-2 left-0 sm:right-0 sm:left-auto z-50 w-72 p-4 rounded-2xl bg-zinc-950 border border-amber-500/40 text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>ระบบสะสมแต้ม {mediaType === 'video' ? 'วิดีโอ' : 'พอดแคสต์'} (Melolo-style)</span>
            </span>
            <span className="text-[10px] text-zinc-400">
              รอบที่ {completedCycles + 1}
            </span>
          </div>

          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">ความคืบหน้ารอบนี้:</span>
              <span className="font-mono font-bold text-amber-300">{formatTime(cycleSeconds)} / 10:00 นาที</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400">เวลาที่เหลือเพื่อรับแต้ม:</span>
              <span className="text-zinc-200 font-semibold">{formatTime(remainingSeconds)} นาที</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400">รางวัลเมื่อครบ 10 นาที:</span>
              <span className="font-extrabold text-amber-400">+5 คะแนน (P)</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-zinc-400">โควตากิจกรรมวันนี้:</span>
              <span className={`font-bold ${isDailyCapReached ? 'text-emerald-400' : 'text-amber-300'}`}>
                {dailyLearningPoints}/100 P {isDailyCapReached ? '(เต็มแล้ว)' : ''}
              </span>
            </div>

            <div className="pt-2 border-t border-white/10 text-[11px] text-zinc-400 leading-relaxed">
              💡 {isDailyCapReached 
                ? 'คุณสะสมคะแนนกิจกรรมครบ 100 P ของวันนี้แล้ว ระบบยังคงบันทึกสถิติการรับชมให้ต่อเนื่อง' 
                : isPlaying ? 'ระบบกำลังสะสมเวลาให้อัตโนมัติ (จำกัดกิจกรรมรวมสูงสุด 100 P/วัน)' : 'กดเล่นเพื่อเริ่มสะสมเวลาต่อ (หยุดชั่วคราวจะหยุดนับ)'}
            </div>
          </div>
        </div>
      )}

      {/* Celebration Popup when 10 mins reached! */}
      {showCelebration && (
        <div className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in zoom-in-95 duration-300">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
            🎉
          </div>
          <div>
            <div className="text-xs text-amber-100 font-bold">ยินดีด้วย! คุณสะสมเวลาครบ 10 นาทีแล้ว</div>
            <div className="text-sm font-black text-white">
              ได้รับ +{celebrationPoints} คะแนน (P) เข้าบัญชีของคุณแล้ว
            </div>
            <div className="text-[11px] text-amber-200 mt-0.5">
              เริ่มสะสมรอบใหม่ต่อเนื่องโดยอัตโนมัติ
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

