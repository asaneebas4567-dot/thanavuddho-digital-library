'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, Gift } from 'lucide-react';
import { useLearningPoints } from '@/lib/useLearningPoints';

interface ArticleReadingTrackerProps {
  articleId: string;
  articleTitle: string;
}

export default function ArticleReadingTracker({ articleId, articleTitle }: ArticleReadingTrackerProps) {
  const { recordEarn } = useLearningPoints();
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isAwarded, setIsAwarded] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const startTimeRef = useRef<number>(Date.now());
  const hasTriggeredRef = useRef<boolean>(false);

  useEffect(() => {
    // Check if already claimed in local cache
    const claimedKey = `dhamma_article_claimed_${articleId}`;
    if (localStorage.getItem(claimedKey)) {
      setIsAwarded(true);
      hasTriggeredRef.current = true;
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;

      const progress = Math.min(100, Math.round((scrollTop / docHeight) * 100));
      setScrollProgress(progress);

      // Trigger criteria: scroll >= 85% and time on page >= 12 seconds
      const elapsedSeconds = (Date.now() - startTimeRef.current) / 1000;
      if (progress >= 85 && elapsedSeconds >= 12 && !hasTriggeredRef.current) {
        hasTriggeredRef.current = true;

        recordEarn({
          type: 'read_article',
          sourceId: articleId,
          chapterTitle: articleTitle
        }).then(res => {
          if (res && res.success) {
            localStorage.setItem(claimedKey, 'true');
            setIsAwarded(true);
            if (res.pointsEarned > 0) {
              setToastMessage(`สาธุ! คุณอ่านจบ "${articleTitle}" ได้รับ +${res.pointsEarned} P (วันนี้สะสม ${res.dailyLearningPoints}/${res.dailyLearningCap} P)`);
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 5000);
            } else if (res.dailyCapReached) {
              setToastMessage(`คุณอ่านจบ "${articleTitle}" แล้ว (ครบโควตากิจกรรมประจำวัน 100 P แล้ว)`);
              setShowCelebration(true);
              setTimeout(() => setShowCelebration(false), 5000);
            }
          } else if (res && res.alreadyEarned) {
            localStorage.setItem(claimedKey, 'true');
            setIsAwarded(true);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [articleId, articleTitle, recordEarn]);

  return (
    <>
      {/* Top Floating Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1.5 bg-slate-200/60">
        <div 
          className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Reading Reward Pill at bottom of screen */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-amber-300 shadow-lg backdrop-blur-md text-xs">
        <span className="text-amber-500 font-bold">🪙 สะสมแต้มอ่านข้อคิดธรรมะ:</span>
        {isAwarded ? (
          <span className="text-emerald-600 font-extrabold flex items-center gap-1">
            <CheckCircle2 size={14} />
            ได้รับ 2 P แล้ว
          </span>
        ) : (
          <span className="text-muted-foreground font-mono">
            อ่านถึงท้ายเรื่อง รับ +2 P ({scrollProgress}%)
          </span>
        )}
      </div>

      {/* Celebration Toast upon earning points */}
      {showCelebration && (
        <div className="fixed bottom-8 right-8 z-50 p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-2xl border-2 border-amber-300 flex items-center gap-3 animate-in zoom-in-95 duration-300">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl shadow-inner">
            🎉
          </div>
          <div>
            <div className="text-xs text-amber-100 font-bold">อ่านจบข้อคิดธรรมะสำเร็จ!</div>
            <div className="text-sm font-black text-white">{toastMessage}</div>
            <div className="text-[11px] text-amber-200 mt-0.5">
              แต้มถูกบันทึกเข้าสู่ระบบ Thanavuddho Learning Points แล้ว
            </div>
          </div>
        </div>
      )}
    </>
  );
}

