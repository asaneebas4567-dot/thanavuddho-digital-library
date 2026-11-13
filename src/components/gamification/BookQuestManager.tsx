'use client';

import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  X, 
  ChevronRight, 
  ArrowRight, 
  Award, 
  Compass, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Star, 
  Flame, 
  Crown, 
  Check, 
  Volume2, 
  VolumeX, 
  MapPin, 
  AlertCircle, 
  Lock, 
  AlertTriangle,
  Clock,
  Timer,
  Hourglass
} from 'lucide-react';
import { 
  BookEasterEggQuest, 
  getBookQuests, 
  findQuestByPage, 
  QUEST_BOOKS_CATALOG 
} from '@/data/bookEasterEggQuests';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { 
  calculateChapterRequiredDwellTime, 
  ChapterDwellCalculation,
  ACADEMIC_READING_BENCHMARKS 
} from '@/lib/readingPacingEngine';
import { triggerFlyingCoins } from '@/components/common/FlyingCoinAnimation';

export interface QuestAttemptRecord {
  selectedOption: number;
  selectedAnswers?: Record<number, number>;
  correctCount?: number;
  totalQuestions?: number;
  isCorrect: boolean;
  pointsEarned: number;
  attemptedAt: string;
}

export interface BookQuestManagerProps {
  bookId: string;
  currentPage: number;
  onJumpToPage: (page: number) => void;
  openQuestId?: string | null;
  onCloseQuestModal?: () => void;
  isQuestDrawerOpen?: boolean;
  onToggleQuestDrawer?: (open: boolean) => void;
}

// ---------------------------------------------------------------------------
// Synthesized Web Audio Sound Generator (No external MP3 files needed)
// ---------------------------------------------------------------------------
function playWebAudioSound(type: 'success' | 'click' | 'error' | 'legendary' | 'discover', enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'discover') {
      const notes = [659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.25);
      });
    } else if (type === 'error') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      gain.gain.setValueAtTime(0.09, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.25);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.07);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + idx * 0.07 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.07);
        osc.stop(ctx.currentTime + idx * 0.07 + 0.35);
      });
    } else if (type === 'legendary') {
      const notes = [440, 554.37, 659.25, 880, 1108.73];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.09);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.09);
        gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + idx * 0.09 + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.09 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.09);
        osc.stop(ctx.currentTime + idx * 0.09 + 0.5);
      });
    }
  } catch {
    // Ignore audio permission or context errors
  }
}

export default function BookQuestManager({
  bookId,
  currentPage,
  onJumpToPage,
  openQuestId,
  onCloseQuestModal,
  isQuestDrawerOpen: externalDrawerOpen,
  onToggleQuestDrawer: externalToggleDrawer,
}: BookQuestManagerProps) {
  // 1. Quests for this book (Static fallback + dynamic API fetch)
  const [allBookQuests, setAllBookQuests] = useState<BookEasterEggQuest[]>(() => getBookQuests(bookId));
  const bookInfo = useMemo(() => QUEST_BOOKS_CATALOG[bookId] || null, [bookId]);

  // Fetch updated quests from API (merged with custom editor quests)
  useEffect(() => {
    let isMounted = true;
    fetch(`/api/quests?bookId=${encodeURIComponent(bookId)}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && Array.isArray(data.quests) && data.quests.length > 0) {
          setAllBookQuests(data.quests);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [bookId]);

  // 2. LocalStorage Persistence State
  const { recordEarn } = useLearningPoints();
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [readChapterIds, setReadChapterIds] = useState<string[]>([]);
  const [chapterToast, setChapterToast] = useState<{
    show: boolean;
    title: string;
    detail: string;
    points?: number;
  } | null>(null);
  const [attempts, setAttempts] = useState<Record<string, QuestAttemptRecord>>({});
  const [discoveredQuestIds, setDiscoveredQuestIds] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [dismissedBeacons, setDismissedBeacons] = useState<string[]>([]);

  // Active Chapter Dwell Tracking (Anti-skimming: 1.5 in 5 minutes ratio)
  const [chapterDwellSeconds, setChapterDwellSeconds] = useState<Record<string, number>>({});

  // 3. Active Quest Modal & Drawer State
  const [activeQuest, setActiveQuest] = useState<BookEasterEggQuest | null>(null);
  const [internalDrawerOpen, setInternalDrawerOpen] = useState<boolean>(false);
  const [drawerTab, setDrawerTab] = useState<'all' | 'active' | 'completed' | 'badges'>('all');
  
  const isDrawerOpen = externalDrawerOpen !== undefined ? externalDrawerOpen : internalDrawerOpen;
  const setDrawerOpen = useCallback((open: boolean) => {
    if (externalToggleDrawer) {
      externalToggleDrawer(open);
    } else {
      setInternalDrawerOpen(open);
    }
  }, [externalToggleDrawer]);

  // 4. Quiz Form State inside Modal
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [multiAnswers, setMultiAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [showRewardCelebration, setShowRewardCelebration] = useState<boolean>(false);

  // Normalize questions for both single-question and multi-question quests
  const currentQuestions = useMemo(() => {
    if (!activeQuest) return [];
    if (activeQuest.questions && activeQuest.questions.length > 0) {
      return activeQuest.questions;
    }
    return [
      {
        questionNumber: 1,
        question: activeQuest.question,
        options: activeQuest.options,
        correctIndex: activeQuest.correctIndex,
        explanation: activeQuest.explanation
      }
    ];
  }, [activeQuest]);

  const activeQuestionItem = currentQuestions[currentQuestionIndex] || currentQuestions[0];

  // 5. Legendary Quest 3-Step Objectives Progress
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  // Ref to prevent spamming audio on repeated flips
  const lastChimePageRef = useRef<number | null>(null);

  // Load persistence from LocalStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const savedCompleted = localStorage.getItem(`dhamma_quests_${bookId}`);
      if (savedCompleted) {
        setCompletedQuestIds(JSON.parse(savedCompleted));
      }
      const savedAttempts = localStorage.getItem(`dhamma_attempts_${bookId}`);
      if (savedAttempts) {
        setAttempts(JSON.parse(savedAttempts));
      }
      const savedDiscovered = localStorage.getItem(`dhamma_discovered_${bookId}`);
      if (savedDiscovered) {
        setDiscoveredQuestIds(JSON.parse(savedDiscovered));
      }
      const savedReadChapters = localStorage.getItem(`dhamma_read_chapters_${bookId}`);
      if (savedReadChapters) {
        setReadChapterIds(JSON.parse(savedReadChapters));
      }
      const savedSound = localStorage.getItem('dhamma_sound_enabled');
      if (savedSound !== null) {
        setSoundEnabled(savedSound === 'true');
      }
      const savedDwell = localStorage.getItem(`dhamma_chapter_dwell_${bookId}`);
      if (savedDwell) {
        setChapterDwellSeconds(JSON.parse(savedDwell));
      }
    } catch {
      // ignore JSON parse error
    }
  }, [bookId]);

  // Detect quest at current page from merged list
  const pageQuest = useMemo(() => {
    return allBookQuests.find(q => {
      const end = q.triggerPageEnd ?? q.triggerPage;
      return currentPage >= q.triggerPage && currentPage <= end;
    }) || null;
  }, [allBookQuests, currentPage]);

  // ---------------------------------------------------------------------------
  // Active Chapter Dwell Timer (Anti-skimming: 1.5 in 5 minutes ratio = 30%)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!pageQuest || typeof window === 'undefined') return;

    let lastInteraction = Date.now();
    const handleInteraction = () => {
      lastInteraction = Date.now();
    };

    window.addEventListener('mousemove', handleInteraction, { passive: true });
    window.addEventListener('keydown', handleInteraction, { passive: true });
    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('scroll', handleInteraction, { passive: true });

    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInteraction < 60000) {
        setChapterDwellSeconds(prev => {
          const current = prev[pageQuest.id] || 0;
          const nextVal = current + 1;
          const updated = { ...prev, [pageQuest.id]: nextVal };

          if (nextVal % 5 === 0) {
            try {
              localStorage.setItem(`dhamma_chapter_dwell_${bookId}`, JSON.stringify(updated));
            } catch {}
          }
          return updated;
        });
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
    };
  }, [pageQuest, bookId]);

  // Pacing calculation for current page quest
  const pageQuestPacing = useMemo(() => {
    if (!pageQuest) return null;
    const pageCount = (pageQuest.triggerPageEnd ?? pageQuest.triggerPage) - pageQuest.triggerPage + 1;
    return calculateChapterRequiredDwellTime(pageCount, 'A5', ACADEMIC_READING_BENCHMARKS.DISCOUNT_FACTOR_ACADEMIC);
  }, [pageQuest]);

  const pageQuestSpentSeconds = pageQuest ? (chapterDwellSeconds[pageQuest.id] || 0) : 0;
  const isPageQuestUnlocked = useMemo(() => {
    if (!pageQuest || !pageQuestPacing) return false;
    if (completedQuestIds.includes(pageQuest.id)) return true;
    return pageQuestSpentSeconds >= pageQuestPacing.requiredDwellSeconds;
  }, [pageQuest, pageQuestPacing, pageQuestSpentSeconds, completedQuestIds]);

  // Pacing calculation for active quest in modal
  const activeQuestPacing = useMemo(() => {
    if (!activeQuest) return null;
    const pageCount = (activeQuest.triggerPageEnd ?? activeQuest.triggerPage) - activeQuest.triggerPage + 1;
    return calculateChapterRequiredDwellTime(pageCount, 'A5', ACADEMIC_READING_BENCHMARKS.DISCOUNT_FACTOR_ACADEMIC);
  }, [activeQuest]);

  const activeQuestSpentSeconds = activeQuest ? (chapterDwellSeconds[activeQuest.id] || 0) : 0;
  const isActiveQuestUnlocked = useMemo(() => {
    if (!activeQuest || !activeQuestPacing) return false;
    if (completedQuestIds.includes(activeQuest.id) || attempts[activeQuest.id]) return true;
    return activeQuestSpentSeconds >= activeQuestPacing.requiredDwellSeconds;
  }, [activeQuest, activeQuestPacing, activeQuestSpentSeconds, completedQuestIds, attempts]);

  // Play discover chime and show unlock toast when reaching threshold
  const unlockAnnouncedRef = useRef<Record<string, boolean>>({});
  useEffect(() => {
    if (pageQuest && pageQuestPacing && !completedQuestIds.includes(pageQuest.id)) {
      if (pageQuestSpentSeconds >= pageQuestPacing.requiredDwellSeconds && !unlockAnnouncedRef.current[pageQuest.id]) {
        unlockAnnouncedRef.current[pageQuest.id] = true;
        playWebAudioSound('discover', soundEnabled);
        setChapterToast({
          show: true,
          title: `ปลดล็อกเควสสำเร็จ: ${pageQuest.title}`,
          detail: `คุณศึกษาบทนี้ครบ ${pageQuestPacing.requiredMinutesDisplay} แล้ว พร้อมตอบคำถามรับแต้มสะสม!`
        });
      }
    }
  }, [pageQuest, pageQuestPacing, pageQuestSpentSeconds, completedQuestIds, soundEnabled]);

  // When user lands on a page with an undiscovered quest, mark it as discovered
  useEffect(() => {
    if (pageQuest && typeof window !== 'undefined') {
      const isNew = !discoveredQuestIds.includes(pageQuest.id);
      if (isNew) {
        setDiscoveredQuestIds(prev => {
          if (!prev.includes(pageQuest.id)) {
            const next = [...prev, pageQuest.id];
            localStorage.setItem(`dhamma_discovered_${bookId}`, JSON.stringify(next));
            return next;
          }
          return prev;
        });
      }
    }
  }, [pageQuest, bookId, discoveredQuestIds]);

  // Check chapter reading completion when user reaches the end page of a chapter (Requires minimum dwell time)
  useEffect(() => {
    if (!currentPage || allBookQuests.length === 0) return;

    // Find if the current page is the end page of any chapter quest
    const endingChapter = allBookQuests.find(q => {
      const endPage = q.triggerPageEnd ?? q.triggerPage;
      return currentPage === endPage;
    });

    if (endingChapter && !readChapterIds.includes(endingChapter.id)) {
      const pages = (endingChapter.triggerPageEnd ?? endingChapter.triggerPage) - endingChapter.triggerPage + 1;
      const pacing = calculateChapterRequiredDwellTime(pages, 'A5', ACADEMIC_READING_BENCHMARKS.DISCOUNT_FACTOR_ACADEMIC);
      const spent = chapterDwellSeconds[endingChapter.id] || 0;

      // Anti-skimming rule: Must have actually studied the chapter for >= minimum dwell time!
      if (spent >= pacing.requiredDwellSeconds) {
        const updatedReads = [...readChapterIds, endingChapter.id];
        setReadChapterIds(updatedReads);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`dhamma_read_chapters_${bookId}`, JSON.stringify(updatedReads));
        }

        recordEarn({
          type: 'read_chapter',
          sourceId: bookId,
          chapterIndex: endingChapter.questNumber,
          chapterTitle: endingChapter.title,
          chapterPageCount: pages
        }).then(res => {
          if (res && res.success) {
            if (res.pointsEarned > 0) {
              setChapterToast({
                show: true,
                title: `อ่านจบบท: ${endingChapter.title}`,
                detail: `คุณได้รับ +${res.pointsEarned} P (สะสมวันนี้ ${res.dailyLearningPoints}/${res.dailyLearningCap} P)`,
                points: res.pointsEarned
              });
              playWebAudioSound('success', soundEnabled);
            } else if (res.dailyCapReached) {
              setChapterToast({
                show: true,
                title: `อ่านจบบท: ${endingChapter.title}`,
                detail: `บันทึกการอ่านจบบทแล้ว (ครบโควตากิจกรรม 100 P วันนี้แล้ว)`
              });
            }
            setTimeout(() => {
              setChapterToast(null);
            }, 6000);
          }
        });
      }
    }
  }, [currentPage, allBookQuests, readChapterIds, chapterDwellSeconds, bookId, recordEarn, soundEnabled]);
  useEffect(() => {
    if (openQuestId) {
      const found = allBookQuests.find(q => q.id === openQuestId);
      if (found) {
        openQuestModal(found);
      }
    }
  }, [openQuestId, allBookQuests]);

  const openQuestModal = (quest: BookEasterEggQuest) => {
    setActiveQuest(quest);
    setCurrentQuestionIndex(0);
    const prevAttempt = attempts[quest.id];
    if (prevAttempt) {
      // Already attempted in the past: lock in previously chosen answer & show final result
      setSelectedOption(prevAttempt.selectedOption);
      setMultiAnswers(prevAttempt.selectedAnswers || { 0: prevAttempt.selectedOption });
      setQuizSubmitted(true);
      setIsAnswerCorrect(prevAttempt.isCorrect);
      setShowRewardCelebration(false);
    } else {
      // Fresh attempt
      setSelectedOption(null);
      setMultiAnswers({});
      setQuizSubmitted(false);
      setIsAnswerCorrect(null);
      setShowRewardCelebration(false);
    }
    setCompletedSteps([1]);
    playWebAudioSound('click', soundEnabled);
  };

  const closeQuestModal = () => {
    setActiveQuest(null);
    setCurrentQuestionIndex(0);
    setMultiAnswers({});
    setSelectedOption(null);
    setQuizSubmitted(false);
    setIsAnswerCorrect(null);
    setShowRewardCelebration(false);
    if (onCloseQuestModal) onCloseQuestModal();
  };

  const dismissBeaconForPage = (questId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedBeacons(prev => [...prev, questId]);
  };

  const handleSelectOption = (idx: number) => {
    // Strictly forbid changing or selecting if already attempted or submitted!
    if (quizSubmitted || (activeQuest && attempts[activeQuest.id])) return;
    setMultiAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: idx
    }));
    setSelectedOption(idx);
    playWebAudioSound('click', soundEnabled);
  };

  const handleSubmitQuiz = () => {
    if (!activeQuest || currentQuestions.length === 0) return;
    // Strict defense: If already attempted, cannot submit again!
    if (attempts[activeQuest.id]) return;

    // Check all questions answered
    const answeredCount = Object.keys(multiAnswers).length;
    if (answeredCount < currentQuestions.length) return;

    let correctCount = 0;
    currentQuestions.forEach((q, idx) => {
      if (multiAnswers[idx] === q.correctIndex) {
        correctCount++;
      }
    });

    const passingScore = currentQuestions.length > 1 
      ? Math.ceil(currentQuestions.length * 0.6) 
      : 1;
    const isCorrect = correctCount >= passingScore;
    const pointsEarned = isCorrect ? activeQuest.loot.points : 0;

    // Permanently record attempt in attempts state & LocalStorage
    const newAttempt: QuestAttemptRecord = {
      selectedOption: multiAnswers[0] ?? 0,
      selectedAnswers: multiAnswers,
      correctCount,
      totalQuestions: currentQuestions.length,
      isCorrect,
      pointsEarned,
      attemptedAt: new Date().toISOString()
    };

    const nextAttempts = {
      ...attempts,
      [activeQuest.id]: newAttempt
    };
    setAttempts(nextAttempts);

    if (typeof window !== 'undefined') {
      localStorage.setItem(`dhamma_attempts_${bookId}`, JSON.stringify(nextAttempts));
    }

    setQuizSubmitted(true);
    setIsAnswerCorrect(isCorrect);

    if (isCorrect) {
      if (activeQuest.isLegendary) {
        playWebAudioSound('legendary', soundEnabled);
      } else {
        playWebAudioSound('success', soundEnabled);
      }
      setShowRewardCelebration(true);
      triggerFlyingCoins({ count: 16, sound: soundEnabled });

      // Save to completed quests if not already
      if (!completedQuestIds.includes(activeQuest.id)) {
        const nextCompleted = [...completedQuestIds, activeQuest.id];
        setCompletedQuestIds(nextCompleted);
        if (typeof window !== 'undefined') {
          localStorage.setItem(`dhamma_quests_${bookId}`, JSON.stringify(nextCompleted));
          
          // Also update global reward points
          try {
            const currentPoints = parseInt(localStorage.getItem('dhamma_reward_points') || '0', 10);
            localStorage.setItem('dhamma_reward_points', (currentPoints + pointsEarned).toString());
            window.dispatchEvent(new Event('dhamma_points_updated'));
          } catch {}

          // Record quiz points to server database (exempt from 100 P daily learning cap)
          recordEarn({
            type: 'quiz_chapter',
            sourceId: activeQuest.id,
            chapterTitle: activeQuest.title
          });
        }
      }

      // Unlock all 3 steps for legendary quest
      if (activeQuest.objectiveSteps) {
        setCompletedSteps(activeQuest.objectiveSteps.map(s => s.stepNumber));
      }
    } else {
      // FAILED: NO RETRY. Points = 0.
      playWebAudioSound('error', soundEnabled);
    }
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (typeof window !== 'undefined') {
      localStorage.setItem('dhamma_sound_enabled', next.toString());
    }
  };

  if (allBookQuests.length === 0) return null;

  const pageQuestAttempt = pageQuest ? attempts[pageQuest.id] : undefined;
  const isCurrentPageQuestCompleted = pageQuest ? completedQuestIds.includes(pageQuest.id) : false;
  const isBeaconDismissed = pageQuest ? dismissedBeacons.includes(pageQuest.id) : false;

  // Filtered Quests in Drawer
  const filteredQuests = allBookQuests.filter(q => {
    const isDone = completedQuestIds.includes(q.id);
    if (drawerTab === 'active') return !isDone;
    if (drawerTab === 'completed') return isDone;
    return true; // 'all'
  });

  // Calculate Badges & Points
  const totalEarnedPoints = completedQuestIds.reduce((sum, id) => {
    const q = allBookQuests.find(item => item.id === id);
    return sum + (q?.loot.points || 0);
  }, 0);

  const completedQuestsList = allBookQuests.filter(q => completedQuestIds.includes(q.id));

  return (
    <>
      {/* Chapter Completion Reward Notification Toast */}
      {chapterToast && chapterToast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92vw] sm:w-auto p-4 rounded-2xl bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white shadow-2xl border-2 border-sky-300 flex items-center gap-3.5 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shadow-inner shrink-0">
            📖
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs text-sky-100 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-200" />
              <span>อ่านจบบทสำเร็จ (Thanavuddho Learning Points)</span>
            </div>
            <div className="text-sm font-bold text-white truncate mt-0.5">{chapterToast.title}</div>
            <div className="text-xs text-sky-100/90 mt-0.5">{chapterToast.detail}</div>
          </div>
          <button 
            onClick={() => setChapterToast(null)}
            className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* =========================================================================
          1. FLOATING QUEST BEACON / PILL (Non-intrusive notification)
         ========================================================================= */}
      {pageQuest && !isBeaconDismissed && (
        <div className="fixed bottom-12 sm:bottom-14 left-1/2 -translate-x-1/2 z-40 max-w-[92vw] sm:max-w-lg animate-in fade-in slide-in-from-bottom-3 duration-300 pointer-events-auto">
          <div 
            onClick={() => openQuestModal(pageQuest)}
            className={`group relative flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 rounded-2xl cursor-pointer shadow-2xl backdrop-blur-xl border transition-all duration-300 hover:scale-[1.02] active:scale-98 ${
              pageQuest.isLegendary
                ? 'bg-gradient-to-r from-amber-950/95 via-yellow-950/90 to-amber-900/95 text-amber-100 border-amber-400/80 shadow-amber-500/25 ring-2 ring-amber-400/40 ring-offset-1 ring-offset-black'
                : isCurrentPageQuestCompleted
                ? 'bg-slate-900/95 text-emerald-100 border-emerald-500/50 shadow-black/50'
                : pageQuestAttempt && !pageQuestAttempt.isCorrect
                ? 'bg-slate-900/95 text-rose-200 border-rose-500/40 shadow-black/50'
                : pageQuest.questType === 'main'
                ? 'bg-slate-900/95 text-amber-100 border-amber-400/80 shadow-amber-500/20'
                : 'bg-slate-900/95 text-white border-amber-500/40 shadow-black/50'
            }`}
          >
            {/* Glowing Icon */}
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
              pageQuest.isLegendary
                ? 'bg-gradient-to-tr from-yellow-500 via-amber-400 to-amber-200 text-slate-950 animate-pulse'
                : isCurrentPageQuestCompleted
                ? 'bg-emerald-500 text-white'
                : pageQuestAttempt && !pageQuestAttempt.isCorrect
                ? 'bg-rose-600 text-white'
                : pageQuest.questType === 'main'
                ? 'bg-amber-400 text-slate-950'
                : 'bg-amber-500 text-slate-950'
            }`}>
              {pageQuest.isLegendary ? (
                <Crown size={20} className="fill-amber-900 text-slate-950" />
              ) : isCurrentPageQuestCompleted ? (
                <CheckCircle2 size={20} />
              ) : pageQuestAttempt && !pageQuestAttempt.isCorrect ? (
                <X size={20} />
              ) : pageQuest.questType === 'main' ? (
                <Compass size={20} className="text-slate-950" />
              ) : (
                <Sparkles size={18} />
              )}
            </div>

            {/* Content Text */}
            <div className="min-w-0 flex-1 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className={`text-[10px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded ${
                  pageQuest.isLegendary
                    ? 'bg-amber-400 text-slate-950 font-extrabold'
                    : isCurrentPageQuestCompleted
                    ? 'bg-emerald-500/20 text-emerald-300'
                    : pageQuestAttempt && !pageQuestAttempt.isCorrect
                    ? 'bg-rose-500/20 text-rose-300'
                    : pageQuest.questType === 'main'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {pageQuest.categoryTag}
                </span>
                {isCurrentPageQuestCompleted ? (
                  <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <Check size={10} /> สำเร็จแล้ว (+{pageQuest.loot.points} แต้ม)
                  </span>
                ) : pageQuestAttempt && !pageQuestAttempt.isCorrect ? (
                  <span className="text-[10px] font-bold bg-rose-500/20 text-rose-300 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                    <X size={10} /> สิ้นสุดแล้ว (0 แต้ม)
                  </span>
                ) : !isPageQuestUnlocked ? (
                  <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Clock size={10} className="animate-pulse" />
                    <span>อ่านศึกษา: {pageQuestSpentSeconds}ว./{pageQuestPacing?.requiredDwellSeconds}ว. ({Math.min(100, Math.round((pageQuestSpentSeconds / (pageQuestPacing?.requiredDwellSeconds || 1)) * 100))}%)</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-bold bg-sky-500/30 text-sky-200 border border-sky-400/40 px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <Sparkles size={10} className="text-amber-300" />
                    <span>ปลดล็อกแล้ว! +{pageQuest.loot.points} แต้ม</span>
                  </span>
                )}
              </div>
              <div className="font-extrabold text-xs sm:text-sm truncate mt-0.5 group-hover:text-amber-300 transition-colors">
                {pageQuest.title}
              </div>
              <div className="text-[10px] sm:text-[11px] opacity-75 truncate">
                {!isPageQuestUnlocked && !isCurrentPageQuestCompleted
                  ? `📖 อยู่ในช่วงหน้า ${pageQuest.printedPageStart || pageQuest.triggerPage}–${pageQuest.printedPageEnd || pageQuest.triggerPageEnd || pageQuest.triggerPage} • ต้องอ่านศึกษาอย่างน้อย ${pageQuestPacing?.requiredMinutesDisplay} (เกณฑ์ 1.5 ใน 5)`
                  : `📖 หน้าหนังสือ ${pageQuest.printedPageStart || pageQuest.triggerPage}–${pageQuest.printedPageEnd || pageQuest.triggerPageEnd || pageQuest.triggerPage} (PDF หน้า ${pageQuest.triggerPage}) • แตะเพื่อตอบคำถาม`}
              </div>
            </div>

            {/* Action Chevron & Dismiss (X) */}
            <div className="flex items-center gap-1 shrink-0">
              <div className="p-1.5 rounded-lg bg-white/10 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                <ChevronRight size={15} />
              </div>
              <button
                onClick={(e) => dismissBeaconForPage(pageQuest.id, e)}
                className="p-1.5 rounded-lg hover:bg-white/20 text-slate-400 hover:text-white transition-colors"
                title="ซ่อนการแจ้งเตือนในหน้านี้"
              >
                <X size={13} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          2. FLOATING ALL-QUESTS JOURNAL TRIGGER BUTTON (Top right shortcut)
         ========================================================================= */}
      <div className="fixed top-14 sm:top-16 right-3 sm:right-5 z-40 flex flex-col gap-1.5 items-end">
        <button
          onClick={() => setDrawerOpen(true)}
          className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white border border-sky-300 shadow-md text-xs font-bold transition-all cursor-pointer hover:scale-105 active:scale-95"
          title="เปิดสมุดภารกิจ Quest Journal & Easter Eggs"
        >
          <Compass size={14} className="text-sky-100 group-hover:rotate-45 transition-transform" />
          <span>เควส ({completedQuestIds.length}/{allBookQuests.length})</span>
        </button>
      </div>

      {/* =========================================================================
          3. MAIN QUEST MODAL (Interactive Dhamma Quiz & Lore View)
         ========================================================================= */}
      {activeQuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
          {/* Backdrop */}
          <div 
            onClick={closeQuestModal}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
          />

          {/* Modal Container: Clean White, Deep Navy Header & Soft Border */}
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl shadow-2xl border border-[#DCEAF3] z-10 text-[#243447] flex flex-col bg-white transition-all duration-300">
            {/* Modal Header: Crisp White Background with Deep Navy Title */}
            <div className="p-5 sm:p-6 bg-white border-b border-[#DCEAF3] relative text-[#243447]">
              {/* Top Controls */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-[#F0F8FD] text-[#079FE8] border border-[#DCEAF3] flex items-center gap-1.5 shadow-2xs">
                    <Sparkles size={13} className="text-[#079FE8]" />
                    <span>{activeQuest.categoryTag || 'ภารกิจทดสอบปัญญาธรรม'}</span>
                  </span>
                  {activeQuest.isLegendary && (
                    <div className="flex items-center text-[#D9A441] text-xs">
                      <Star size={13} className="fill-[#D9A441] text-[#D9A441]" />
                      <Star size={13} className="fill-[#D9A441] text-[#D9A441]" />
                      <Star size={13} className="fill-[#D9A441] text-[#D9A441]" />
                      <Star size={13} className="fill-[#D9A441] text-[#D9A441]" />
                      <Star size={13} className="fill-[#D9A441] text-[#D9A441]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={toggleSound}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title={soundEnabled ? 'ปิดเสียงเอฟเฟกต์' : 'เปิดเสียงเอฟเฟกต์'}
                  >
                    {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                  <button 
                    onClick={closeQuestModal}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    aria-label="ปิดหน้าต่างเควส"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Title & Subtitle in Deep Navy */}
              <h2 className="text-xl sm:text-2xl font-black text-[#073B65] leading-tight tracking-tight mt-1">
                {activeQuest.title}
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] font-normal mt-1">
                {activeQuest.subtitle}
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 bg-[#F0F8FD]/30">
              {!isActiveQuestUnlocked && activeQuestPacing ? (
                /* Locked Study Screen (Anti-skimming / Real Reading Verification) */
                <div className="py-2 space-y-4 text-center sm:text-left">
                  <div className="p-6 rounded-2xl bg-white border border-[#DCEAF3] shadow-xs space-y-5">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#079FE8]/15 to-[#073B65]/10 border border-[#079FE8]/30 flex items-center justify-center shrink-0 text-[#079FE8]">
                        <Hourglass size={28} className="animate-pulse" />
                      </div>
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7FD] text-[#079FE8] border border-[#C5E7FA]">
                          <Clock size={13} />
                          <span>ช่วงเวลาศึกษาเนื้อหาบทเรียน (Anti-Skimming Active Reading)</span>
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-[#073B65] mt-1">
                          กรุณาศึกษาเนื้อหาก่อนเริ่มทำแบบทดสอบ
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          บทนี้ครอบคลุม PDF หน้า {activeQuest.triggerPage}{activeQuest.triggerPageEnd && activeQuest.triggerPageEnd !== activeQuest.triggerPage ? ` ถึง ${activeQuest.triggerPageEnd}` : ''} (ความยาว {activeQuestPacing.chapterPageCount} หน้า) ระบบจะปลดล็อกแบบทดสอบเมื่อท่านศึกษาเนื้อหาอย่างต่อเนื่อง
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar & Countdown Box */}
                    <div className="p-4 rounded-xl bg-[#F0F8FD] border border-[#DCEAF3] space-y-3">
                      <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#073B65]">
                        <span className="flex items-center gap-1.5">
                          <Timer size={15} className="text-[#079FE8]" />
                          <span>เวลาศึกษาแล้ว: {activeQuestSpentSeconds} วินาที</span>
                        </span>
                        <span className="text-[#079FE8]">
                          เป้าหมายขั้นต่ำ: {activeQuestPacing.requiredDwellSeconds} วินาที ({activeQuestPacing.requiredMinutesDisplay})
                        </span>
                      </div>

                      {/* Visual progress bar */}
                      <div className="w-full bg-[#DCEAF3] rounded-full h-3 overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-[#079FE8] to-[#073B65] h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(100, Math.round((activeQuestSpentSeconds / activeQuestPacing.requiredDwellSeconds) * 100))}%`
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-500">
                        <span>ความคืบหน้า {Math.min(100, Math.round((activeQuestSpentSeconds / activeQuestPacing.requiredDwellSeconds) * 100))}%</span>
                        <span className="font-bold text-[#073B65]">
                          อีก {Math.max(0, activeQuestPacing.requiredDwellSeconds - activeQuestSpentSeconds)} วินาที จะปลดล็อกคำถาม
                        </span>
                      </div>
                    </div>

                    {/* Research Reference Card */}
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-left space-y-2 text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 font-bold text-amber-900">
                        <BookOpen size={16} className="text-amber-700 shrink-0" />
                        <span>เกณฑ์การวัดเวลาอ่านตามหลักสถิติวิจัย (Reading Speed Research)</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal text-xs sm:text-[13px]">
                        อ้างอิงงานวิจัยมาตรฐานสากล (Scholar Within / Brysbaert 2019): ผู้ใหญ่อ่านหนังสือในใจเฉลี่ย 238 คำ/นาที หนังสือ 1 หน้ามีประมาณ 150-250 คำ สำหรับบทที่มี {activeQuestPacing.chapterPageCount} หน้า ใช้เวลาอ่านปกติประมาณ {activeQuestPacing.recommendedMinutesDisplay}
                      </p>
                      <p className="text-slate-700 leading-relaxed font-normal text-xs sm:text-[13px]">
                        🎯 <strong>สูตรคำนวณ:</strong> กำหนดเวลาอ่านขั้นต่ำที่ <strong>1.5 ส่วน ใน 5 ส่วน (30%)</strong> เพื่อป้องกันการกดข้ามหน้าเร็วๆ และส่งเสริมให้ผู้ศึกษาได้ซึมซับปัญญาธรรมอย่างแท้จริง
                      </p>
                      <div className="pt-1 border-t border-amber-200/50 text-[11px] text-amber-800 flex items-center gap-1.5">
                        <ShieldCheck size={14} className="text-amber-700 shrink-0" />
                        <span>เวลานับเฉพาะขณะเปิดอ่านหน้านี้และมีปฏิสัมพันธ์ (หยุดนับเมื่อสลับหน้าต่างหรือทิ้งหน้าจอไว้นานเกินไป)</span>
                      </div>
                    </div>

                    {/* Action Button to return to reading */}
                    <button
                      type="button"
                      onClick={closeQuestModal}
                      className="w-full py-3.5 px-5 rounded-xl bg-[#073B65] hover:bg-[#0A4D82] text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                      <BookOpen size={18} />
                      <span>กลับไปอ่านเนื้อหาในหนังสือ (ระบบจะนับเวลาต่ออัตโนมัติ)</span>
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Question Header & Points Reward Pill */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 border-b border-[#DCEAF3]">
                    <div className="text-base sm:text-lg font-bold text-[#073B65] flex items-center gap-2">
                      <HelpCircle size={20} className="text-[#079FE8] shrink-0" />
                      <span>คำถามไขปริศนาธรรม</span>
                      {currentQuestions.length > 1 && (
                        <span className="text-xs sm:text-sm font-semibold text-[#079FE8] bg-[#F0F8FD] px-2.5 py-0.5 rounded-lg border border-[#DCEAF3]">
                          ข้อ {currentQuestionIndex + 1}/{currentQuestions.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs sm:text-sm text-[#B88328] font-bold bg-[#FDF6E9] border border-[#F5E6C8] px-3 py-1 rounded-full w-fit">
                      <span>🪙 รางวัลเมื่อผ่าน: +{activeQuest.loot.points} แต้ม</span>
                    </div>
                  </div>

                  {/* Multi-Question Tabs (ข้อ 1 .. ข้อ 5) */}
                  {currentQuestions.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
                      {currentQuestions.map((q, qIdx) => {
                        const isCurrent = currentQuestionIndex === qIdx;
                        const isAnswered = multiAnswers[qIdx] !== undefined;
                        const isCorrectQ = quizSubmitted ? multiAnswers[qIdx] === q.correctIndex : null;

                        let tabStyle = 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 font-medium';
                        if (quizSubmitted) {
                          if (isCorrectQ) {
                            tabStyle = isCurrent 
                              ? 'bg-emerald-600 text-white border-emerald-600 font-bold ring-2 ring-emerald-400' 
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300 font-medium';
                          } else {
                            tabStyle = isCurrent 
                              ? 'bg-rose-600 text-white border-rose-600 font-bold ring-2 ring-rose-400' 
                              : 'bg-rose-100 text-rose-800 border-rose-300 font-medium';
                          }
                        } else if (isCurrent) {
                          tabStyle = 'bg-sky-600 text-white border-sky-600 font-bold shadow-md scale-105';
                        } else if (isAnswered) {
                          tabStyle = 'bg-sky-100 text-sky-900 border-sky-300 font-semibold';
                        }

                        return (
                          <button
                            key={qIdx}
                            type="button"
                            onClick={() => {
                              setCurrentQuestionIndex(qIdx);
                              playWebAudioSound('click', soundEnabled);
                            }}
                            className={`px-3.5 py-2 rounded-xl border text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shrink-0 shadow-2xs ${tabStyle}`}
                          >
                            <span>ข้อ {q.questionNumber || qIdx + 1}</span>
                            {quizSubmitted ? (
                              isCorrectQ ? (
                                <CheckCircle2 size={14} className={isCurrent ? 'text-white' : 'text-emerald-700'} />
                              ) : (
                                <X size={14} className={isCurrent ? 'text-white' : 'text-rose-700'} />
                              )
                            ) : isAnswered ? (
                              <span className="w-2 h-2 rounded-full bg-sky-600" />
                            ) : null}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Active Question Box: Comfortable, Clear, Legible Typography (font-semibold, relaxed leading) */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200/80 text-slate-800 shadow-xs">
                    <div className="text-sky-700 font-bold text-xs sm:text-sm uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <span>คำถามข้อที่ {activeQuestionItem?.questionNumber || currentQuestionIndex + 1} จาก {currentQuestions.length}:</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-slate-800 leading-relaxed tracking-normal">
                      {activeQuestionItem?.question}
                    </h3>
                  </div>

                  {/* Options for Active Question: Spacious, Clean Cards */}
                  <div className="space-y-3">
                    {activeQuestionItem?.options.map((opt, oIdx) => {
                      const isSelected = multiAnswers[currentQuestionIndex] === oIdx;
                      let optionStyle = 'bg-white hover:bg-sky-50/40 border border-slate-200 hover:border-sky-300 text-slate-700 shadow-xs';

                      if (quizSubmitted) {
                        if (oIdx === activeQuestionItem.correctIndex) {
                          optionStyle = 'bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-semibold ring-2 ring-emerald-400/40 shadow-xs';
                        } else if (isSelected && !isAnswerCorrect) {
                          optionStyle = 'bg-rose-50 border-2 border-rose-500 text-rose-950 font-semibold';
                        } else {
                          optionStyle = 'bg-slate-50 border border-slate-200 text-slate-400 opacity-60';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-sky-50 border-2 border-sky-600 text-sky-950 font-semibold shadow-sm ring-2 ring-sky-300/40';
                      }

                      return (
                        <button
                          key={oIdx}
                          type="button"
                          onClick={() => handleSelectOption(oIdx)}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-4 sm:p-4.5 rounded-2xl text-sm sm:text-base font-normal sm:font-medium leading-relaxed transition-all duration-200 flex items-center justify-between gap-3.5 ${
                            quizSubmitted ? 'cursor-not-allowed' : 'cursor-pointer active:scale-99'
                          } ${optionStyle}`}
                        >
                          <span className="flex-1">{opt}</span>
                          {quizSubmitted && oIdx === activeQuestionItem.correctIndex && (
                            <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                          )}
                          {quizSubmitted && isSelected && oIdx !== activeQuestionItem.correctIndex && (
                            <X size={20} className="text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Prev / Next Question Navigation Buttons */}
                  {currentQuestions.length > 1 && (
                    <div className="flex items-center justify-between pt-1">
                      <button
                        type="button"
                        disabled={currentQuestionIndex === 0}
                        onClick={() => {
                          setCurrentQuestionIndex(prev => Math.max(0, prev - 1));
                          playWebAudioSound('click', soundEnabled);
                        }}
                        className="px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-xs sm:text-sm font-semibold text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                      >
                        ← ข้อก่อนหน้า
                      </button>
                      <span className="text-xs sm:text-sm font-semibold text-slate-500">
                        ตอบแล้ว {Object.keys(multiAnswers).length}/{currentQuestions.length} ข้อ
                      </span>
                      <button
                        type="button"
                        disabled={currentQuestionIndex >= currentQuestions.length - 1}
                        onClick={() => {
                          setCurrentQuestionIndex(prev => Math.min(currentQuestions.length - 1, prev + 1));
                          playWebAudioSound('click', soundEnabled);
                        }}
                        className="px-4 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-200 text-xs sm:text-sm font-semibold text-sky-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all shadow-xs"
                      >
                        ข้อถัดไป →
                      </button>
                    </div>
                  )}

                  {/* Submit Area: Prominent & Clean */}
                  <div className="pt-2">
                    {!quizSubmitted ? (
                      <button
                        type="button"
                        onClick={handleSubmitQuiz}
                        disabled={Object.keys(multiAnswers).length < currentQuestions.length}
                        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:cursor-not-allowed active:scale-98 flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={18} />
                        <span>
                          {Object.keys(multiAnswers).length < currentQuestions.length
                            ? `กรุณาตอบคำถามให้ครบทุกข้อ (${Object.keys(multiAnswers).length}/${currentQuestions.length} ข้อ)`
                            : `ยืนยันส่งคำตอบทั้งหมด (${currentQuestions.length} ข้อ)`}
                        </span>
                      </button>
                    ) : isAnswerCorrect ? (
                      <div className="w-full py-3.5 px-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs">
                        <CheckCircle2 size={18} className="text-emerald-700" />
                        <span>
                          ผ่านภารกิจสำเร็จแล้ว!
                          {currentQuestions.length > 1 && (
                            <span className="ml-1 text-emerald-800">
                              (ตอบถูก {attempts[activeQuest.id]?.correctCount ?? currentQuestions.length}/{currentQuestions.length} ข้อ)
                            </span>
                          )}
                          {' '}(+{activeQuest.loot.points} แต้ม)
                        </span>
                      </div>
                    ) : (
                      <div className="w-full py-3.5 px-4 rounded-2xl bg-rose-100 border-2 border-rose-400 text-rose-900 font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-xs">
                        <X size={18} className="text-rose-700" />
                        <span>
                          ตอบถูก {attempts[activeQuest.id]?.correctCount ?? 0}/{currentQuestions.length} ข้อ (ไม่ผ่านเกณฑ์) — สิ้นสุดภารกิจนี้ (0 แต้ม)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Feedback & Explanation Box: Clear and Easy to Read */}
                  {quizSubmitted && (
                    <div className={`p-5 rounded-2xl border text-xs sm:text-sm leading-relaxed animate-in fade-in duration-300 shadow-xs ${
                      isAnswerCorrect 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50 border-rose-300 text-rose-950'
                    }`}>
                      {isAnswerCorrect ? (
                        <div className="space-y-2">
                          <div className="font-bold text-base flex items-center gap-2 text-emerald-800">
                            <Award size={18} />
                            <span>ถูกต้องยอดเยี่ยม! ปลดล็อกปัญญาธรรม</span>
                          </div>
                          <p className="text-sm sm:text-base text-emerald-900 leading-relaxed font-normal">
                            {activeQuestionItem?.explanation || activeQuest.explanation}
                          </p>
                          {currentQuestions.length > 1 && (
                            <p className="text-xs text-emerald-700 font-medium pt-1">
                              💡 ท่านสามารถคลิกเปลี่ยนแถบข้อ 1-{currentQuestions.length} ด้านบน เพื่อตรวจดูคำเฉลยของแต่ละข้อได้
                            </p>
                          )}
                          <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-800">
                            <Check size={14} />
                            <span>ได้รับเหรียญตรา: {activeQuest.loot.badgeIcon} {activeQuest.loot.badgeName} (+{activeQuest.loot.points} แต้ม)</span>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="font-bold text-base text-rose-800 flex items-center gap-2">
                            <AlertCircle size={18} />
                            <span>ผลการทดสอบยังไม่ผ่านเกณฑ์</span>
                          </div>
                          <div className="pt-1 border-t border-rose-200 text-slate-800">
                            <strong className="text-slate-800 block mb-1 text-sm font-semibold">คติธรรมและคำเฉลยจากหนังสือ (ข้อ {currentQuestionIndex + 1}):</strong>
                            <p className="text-sm sm:text-base leading-relaxed text-slate-700 font-normal">
                              {activeQuestionItem?.explanation || activeQuest.explanation}
                            </p>
                            {currentQuestions.length > 1 && (
                              <p className="text-xs text-sky-800 font-medium pt-1.5">
                                💡 ท่านสามารถคลิกเปลี่ยนแถบข้อ 1-{currentQuestions.length} ด้านบน เพื่อตรวจดูคำเฉลยของแต่ละข้อได้
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-200/80 flex items-center justify-between text-xs sm:text-sm bg-white">
              <button
                onClick={() => {
                  onJumpToPage(activeQuest.triggerPage);
                  closeQuestModal();
                }}
                className="flex items-center gap-2 text-sky-700 hover:text-sky-800 font-semibold transition-colors cursor-pointer"
              >
                <BookOpen size={16} />
                <span>เปิดดูเนื้อหาหน้านี้ในหนังสือ (PDF หน้า {activeQuest.triggerPage})</span>
              </button>

              <button
                onClick={() => {
                  closeQuestModal();
                  setDrawerOpen(true);
                }}
                className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 font-semibold transition-colors cursor-pointer"
              >
                <span>ดูสมุดภารกิจทั้งหมด</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          4. ALL QUESTS ARCHIVE DRAWER (Quest Journal & Collection Drawer)
         ========================================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
          />

          {/* Drawer Body: Clean, Sky Blue & Crisp White Library Style */}
          <div className="relative w-full max-w-md h-full bg-white border-l border-sky-100 text-slate-900 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-sky-400/30 flex items-center justify-between bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 text-white">
              <div className="flex items-center gap-2">
                <Compass size={20} className="text-sky-200" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-white">สมุดภารกิจ (Quest Journal)</h3>
                  <p className="text-[11px] text-sky-100 font-normal">
                    {bookInfo?.title || 'หนังสือและ Easter Eggs ธรรมะ'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1.5 rounded-xl hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Progress Summary Pill */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/80 flex items-center justify-between shadow-xs">
                <div>
                  <div className="text-[11px] font-bold text-sky-800 uppercase">ความคืบหน้าการสำรวจ</div>
                  <div className="text-sm font-bold text-slate-900 mt-0.5">
                    สำเร็จ {completedQuestIds.length} จาก {allBookQuests.length} ภารกิจ
                  </div>
                  {/* Progress bar */}
                  <div className="w-36 h-2 bg-sky-200/70 rounded-full mt-1.5 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-300"
                      style={{ width: `${allBookQuests.length > 0 ? (completedQuestIds.length / allBookQuests.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="text-xs font-bold text-sky-700">
                    {totalEarnedPoints} แต้ม
                  </div>
                  <div className="text-[10px] text-slate-500 font-sans">แต้มสะสมทั้งหมด</div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex items-center gap-1 mt-3 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
                <button
                  onClick={() => setDrawerTab('all')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    drawerTab === 'all' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-sky-900 hover:bg-slate-200/60'
                  }`}
                >
                  ทั้งหมด ({allBookQuests.length})
                </button>
                <button
                  onClick={() => setDrawerTab('active')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    drawerTab === 'active' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-sky-900 hover:bg-slate-200/60'
                  }`}
                >
                  กำลังทำ ({allBookQuests.length - completedQuestIds.length})
                </button>
                <button
                  onClick={() => setDrawerTab('completed')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    drawerTab === 'completed' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-sky-900 hover:bg-slate-200/60'
                  }`}
                >
                  สำเร็จ ({completedQuestIds.length})
                </button>
                <button
                  onClick={() => setDrawerTab('badges')}
                  className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${
                    drawerTab === 'badges' ? 'bg-sky-600 text-white font-bold shadow-xs' : 'text-slate-700 hover:text-sky-900 hover:bg-slate-200/60'
                  }`}
                >
                  ตราสะสม 🏆
                </button>
              </div>
            </div>

            {/* Quests List or Badges View */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/50">
              {drawerTab === 'badges' ? (
                /* Collection / Badges View */
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>ตราความสำเร็จที่ได้รับ ({completedQuestsList.length})</span>
                    <span className="text-sky-700 font-mono font-bold">{totalEarnedPoints} แต้ม</span>
                  </div>

                  {completedQuestsList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-xs bg-white rounded-2xl border border-dashed border-sky-200">
                      <Lock size={28} className="mx-auto mb-2 opacity-40 text-sky-600" />
                      <p className="font-bold text-slate-600">ยังไม่มีตราความสำเร็จ</p>
                      <p className="text-[11px] mt-1 text-slate-500">อ่านหนังสือไปถึงหน้าที่กำหนดและตอบคำถามเพื่อปลดล็อกตราแรกของคุณ</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5">
                      {completedQuestsList.map(q => (
                        <div key={q.id} className="p-3 rounded-2xl bg-white border border-sky-200 flex flex-col items-center text-center gap-1.5 shadow-xs">
                          <span className="text-3xl p-2 rounded-xl bg-sky-50 border border-sky-200">{q.loot.badgeIcon}</span>
                          <span className="text-xs font-bold text-slate-900 line-clamp-1">{q.loot.badgeName}</span>
                          <span className="text-[10px] text-sky-700 font-mono font-bold">+{q.loot.points} แต้ม</span>
                          <span className="text-[9px] text-slate-500 font-medium">น. {q.printedPageStart || q.triggerPage}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Quests Cards View */
                <div className="space-y-2.5">
                  {filteredQuests.length === 0 ? (
                    <div className="p-8 text-center text-slate-500 text-xs bg-white rounded-2xl border border-dashed border-slate-200">
                      <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-500" />
                      <p className="font-bold text-slate-700">ไม่มีภารกิจในหมวดหมู่นี้</p>
                    </div>
                  ) : (
                    filteredQuests.map((quest) => {
                      const isCompleted = completedQuestIds.includes(quest.id);
                      const questAttempt = attempts[quest.id];
                      const isCurrent = currentPage >= quest.triggerPage && currentPage <= (quest.triggerPageEnd || quest.triggerPage);

                      const questSpent = chapterDwellSeconds[quest.id] || 0;
                      const questPages = (quest.triggerPageEnd ?? quest.triggerPage) - quest.triggerPage + 1;
                      const questPacing = calculateChapterRequiredDwellTime(questPages, 'A5', ACADEMIC_READING_BENCHMARKS.DISCOUNT_FACTOR_ACADEMIC);
                      const isQuestDwellUnlocked = isCompleted || !!questAttempt || questSpent >= questPacing.requiredDwellSeconds;

                      return (
                        <div
                          key={quest.id}
                          className={`p-3.5 rounded-2xl border transition-all duration-200 flex flex-col gap-2 ${
                            isCurrent
                              ? 'bg-sky-50/80 border-sky-500 text-slate-900 shadow-md ring-2 ring-sky-400/30'
                              : quest.isLegendary
                              ? 'bg-amber-50/60 border-amber-300 text-slate-900 shadow-xs'
                              : quest.questType === 'main'
                              ? 'bg-white border-sky-200 text-slate-900 shadow-xs hover:border-sky-300'
                              : 'bg-white border-slate-200 text-slate-800 hover:border-sky-200 shadow-xs'
                          }`}
                        >
                          {/* Quest Title & Tag */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md ${
                                  quest.isLegendary
                                    ? 'bg-amber-500 text-white'
                                    : quest.questType === 'main'
                                    ? 'bg-sky-600 text-white'
                                    : 'bg-sky-100 text-sky-900 border border-sky-200'
                                }`}>
                                  {quest.categoryTag}
                                </span>
                                {isCompleted ? (
                                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-0.5">
                                    <CheckCircle2 size={11} /> สำเร็จแล้ว (+{quest.loot.points} แต้ม)
                                  </span>
                                ) : questAttempt && !questAttempt.isCorrect ? (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 flex items-center gap-0.5">
                                    <X size={11} /> ตอบไม่ถูก (0 แต้ม)
                                  </span>
                                ) : isQuestDwellUnlocked ? (
                                  <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                                    พร้อมตอบ (+{quest.loot.points} แต้ม)
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-sky-800 font-medium bg-sky-50 px-1.5 py-0.5 rounded border border-sky-200 flex items-center gap-1">
                                    <Clock size={10} className="text-sky-600" />
                                    ศึกษา {questSpent}/{questPacing.requiredDwellSeconds}ว.
                                  </span>
                                )}
                              </div>
                              <div className="font-bold text-xs sm:text-sm text-slate-900 mt-1 leading-snug">
                                {quest.title}
                              </div>
                              <div className="text-[11px] text-sky-800 font-medium truncate mt-0.5">
                                {quest.subtitle}
                              </div>
                            </div>

                            <span className="text-xl shrink-0 p-1.5 rounded-xl bg-sky-50 border border-sky-200">
                              {quest.loot.badgeIcon}
                            </span>
                          </div>

                          {/* Coordinates: Book Page vs PDF Page */}
                          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500 pt-1 border-t border-slate-100">
                            <span className="text-amber-800 font-bold">
                              📖 เล่มจริง: น. {quest.printedPageStart || quest.triggerPage}–{quest.printedPageEnd || quest.triggerPageEnd || quest.triggerPage}
                            </span>
                            <span>•</span>
                            <span>PDF: หน้า {quest.triggerPage}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => {
                                setDrawerOpen(false);
                                onJumpToPage(quest.triggerPage);
                              }}
                              className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-[11px] font-bold text-slate-700 transition-colors cursor-pointer flex items-center justify-center gap-1 border border-slate-200"
                            >
                              <BookOpen size={12} />
                              <span>วาร์ปไปหน้านี้</span>
                            </button>
                            <button
                              onClick={() => {
                                setDrawerOpen(false);
                                openQuestModal(quest);
                              }}
                              className={`flex-1 py-1.5 px-2.5 rounded-xl text-[11px] font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-1 shadow-xs ${
                                questAttempt
                                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                  : isQuestDwellUnlocked
                                  ? 'bg-amber-600 hover:bg-amber-700 text-white'
                                  : 'bg-sky-100 text-sky-800 hover:bg-sky-200 border border-sky-300'
                              }`}
                            >
                              {questAttempt ? (
                                <>
                                  <Compass size={12} />
                                  <span>ดูผลภารกิจ</span>
                                </>
                              ) : isQuestDwellUnlocked ? (
                                <>
                                  <Compass size={12} />
                                  <span>เปิดภารกิจ</span>
                                </>
                              ) : (
                                <>
                                  <Clock size={12} className="text-sky-600 animate-pulse" />
                                  <span>ศึกษา ({questSpent}/{questPacing.requiredDwellSeconds}ว.)</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className="p-3.5 border-t border-amber-200 text-center text-xs text-slate-500 bg-stone-50 font-medium">
              ระบบสกัดเนื้อหาตามหนังสือพระพุทธศาสนา มงคลชีวิต 38 ประการ
            </div>
          </div>
        </div>
      )}
    </>
  );
}
