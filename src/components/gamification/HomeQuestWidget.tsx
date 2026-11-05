'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { 
  Coins, 
  Gift, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  BookOpen, 
  X, 
  Compass, 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Check, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { 
  BookEasterEggQuest, 
  getGlobalUserQuestProgress, 
  getAllQuestsAcrossBooks,
  QUEST_BOOKS_CATALOG
} from '@/data/bookEasterEggQuests';

// Web Audio sound synthesizer for click/success
function playWidgetSound(type: 'click' | 'reward' | 'redeem', enabled: boolean = true) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    if (type === 'click') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.06);
    } else if (type === 'reward' || type === 'redeem') {
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.4);
      });
    }
  } catch {
    // ignore
  }
}

// Sample Redeemable Gifts
interface RewardItem {
  id: string;
  name: string;
  category: string;
  pointsCost: number;
  icon: string;
  description: string;
  isUnlocked?: boolean;
}

const REWARD_SHOP_ITEMS: RewardItem[] = [
  {
    id: 'reward_bookmark_01',
    name: 'ที่คั่นหนังสือดิจิทัล ลายมงคลชีวิต 38 ประการ',
    category: 'ของที่ระลึกดิจิทัล',
    pointsCost: 100,
    icon: '🔖',
    description: 'ชุดภาพพื้นหลังและที่คั่นหนังสือลายมงคลชีวิต ความละเอียดสูง สำหรับดาวน์โหลดเก็บไว้'
  },
  {
    id: 'reward_badge_01',
    name: 'ตราเกียรติยศ “ผู้เจริญในธรรม (Dharma Seeker)”',
    category: 'เหรียญตราโปรไฟล์',
    pointsCost: 150,
    icon: '🎖️',
    description: 'ติดตราสัญลักษณ์ทองคำแสดงบนโปรไฟล์และประวัติการอ่านของ Thanavuddho Library'
  },
  {
    id: 'reward_ebook_mini',
    name: 'หนังสือพิเศษ: ปฐมบท 38 เคล็ดลับสู่ความสุข',
    category: 'ฉบับพิเศษ Limited',
    pointsCost: 200,
    icon: '📖',
    description: 'รวมบทคัดย่อคติธรรมและแนวทางนำ 38 มงคลชีวิตไปใช้ได้จริงในทุกวัน'
  },
  {
    id: 'reward_discount_code',
    name: 'โค้ดส่วนลด 20% หนังสือฉบับรูปเล่ม',
    category: 'คูปองสิทธิพิเศษ',
    pointsCost: 250,
    icon: '🎟️',
    description: 'ใช้เป็นส่วนลดสั่งซื้อหนังสือเล่มจริง ณ ศูนย์หนังสือพระพุทธศาสนา'
  }
];

export default function HomeQuestWidget() {
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [completedQuestIds, setCompletedQuestIds] = useState<string[]>([]);
  const [discoveredQuestIds, setDiscoveredQuestIds] = useState<string[]>([]);
  const [discoveredQuests, setDiscoveredQuests] = useState<(BookEasterEggQuest & { bookTitle: string; isCompleted: boolean })[]>([]);
  
  const [isCodexOpen, setIsCodexOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeQuestIndex, setActiveQuestIndex] = useState(0);
  const [selectedCodexTab, setSelectedCodexTab] = useState<'discovered' | 'books' | 'shop'>('discovered');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Reviewing specific quest modal
  const [reviewingQuest, setReviewingQuest] = useState<(BookEasterEggQuest & { bookTitle: string; isCompleted: boolean }) | null>(null);

  // Redeemed items
  const [redeemedItemIds, setRedeemedItemIds] = useState<string[]>([]);
  const [redeemSuccessToast, setRedeemSuccessToast] = useState<string | null>(null);

  // Sync quest progress from localStorage
  const refreshQuestState = useCallback(() => {
    const progress = getGlobalUserQuestProgress();
    setTotalPoints(progress.totalPoints);
    setCompletedQuestIds(progress.completedQuestIds);
    setDiscoveredQuestIds(progress.discoveredQuestIds);
    setDiscoveredQuests(progress.discoveredQuests);

    // Read redeemed gifts
    try {
      const savedRedeemed = localStorage.getItem('dhamma_redeemed_gifts');
      if (savedRedeemed) {
        setRedeemedItemIds(JSON.parse(savedRedeemed));
      }
    } catch {}
  }, []);

  useEffect(() => {
    refreshQuestState();

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get('openCodex') === 'true') {
        setIsCodexOpen(true);
      }
    }

    // Listen for custom event triggered by BookQuestManager or other tabs
    const handleQuestUpdate = () => {
      refreshQuestState();
    };

    window.addEventListener('dhamma_quest_updated', handleQuestUpdate);
    window.addEventListener('storage', handleQuestUpdate);
    return () => {
      window.removeEventListener('dhamma_quest_updated', handleQuestUpdate);
      window.removeEventListener('storage', handleQuestUpdate);
    };
  }, [refreshQuestState]);

  // Handle gift redemption
  const handleRedeemGift = (item: RewardItem) => {
    if (totalPoints < item.pointsCost) {
      alert(`คุณมีแต้มไม่เพียงพอ (ต้องการ ${item.pointsCost} แต้ม ปัจจุบันมี ${totalPoints} แต้ม)`);
      return;
    }
    if (redeemedItemIds.includes(item.id)) return;

    playWidgetSound('redeem', soundEnabled);
    const updatedRedeemed = [...redeemedItemIds, item.id];
    setRedeemedItemIds(updatedRedeemed);
    try {
      localStorage.setItem('dhamma_redeemed_gifts', JSON.stringify(updatedRedeemed));
    } catch {}

    setRedeemSuccessToast(`แลกรับ "${item.name}" สำเร็จแล้ว!`);
    setTimeout(() => {
      setRedeemSuccessToast(null);
    }, 4000);
  };

  // Determine which quest to showcase in the homepage quest card
  const allAcrossBooks = getAllQuestsAcrossBooks();
  const currentShowcaseQuest = discoveredQuests.length > 0 
    ? discoveredQuests[activeQuestIndex % discoveredQuests.length]
    : {
        id: 'quest_mongkol_01',
        bookId: 'book_mongkol_chiwit_124',
        questNumber: 1,
        title: 'ปฐมบทแห่งบัณฑิต: เกราะคุ้มกันดวงใจ',
        subtitle: 'มงคลที่ 1: การไม่คบคนพาล (อเสวนา จ พาลานัง)',
        categoryTag: 'ภารกิจหลัก (Main Quest)',
        triggerPage: 1,
        loreStory: '',
        hint: '',
        question: '',
        options: ['', '', '', ''] as [string, string, string, string],
        correctIndex: 0,
        explanation: '',
        loot: { points: 60, badgeName: 'ผู้มีสติระวังภัย', badgeIcon: '🛡️' },
        bookTitle: '124. มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า',
        bookCover: '/images/books/book-mongkol-chiwit-38.jpg',
        isCompleted: completedQuestIds.includes('quest_mongkol_01')
      };

  const isCurrentShowcaseCompleted = completedQuestIds.includes(currentShowcaseQuest.id);

  return (
    <>
      {/* 1. Sleek, Compact Quest & Wallet Bar (Clean, Elegant, Low Visual Clutter) */}
      <div 
        id="quests"
        className="w-full bg-gradient-to-r from-amber-50/70 via-white to-amber-50/50 border border-amber-200/70 rounded-2xl p-4 sm:px-6 sm:py-3.5 shadow-xs font-sans select-none"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          
          {/* Left: Compact Wallet & Status */}
          <div className="flex items-center justify-between w-full lg:w-auto gap-4 shrink-0">
            <div 
              onClick={() => {
                setIsCodexOpen(true);
                playWidgetSound('click', soundEnabled);
              }}
              className="flex items-center gap-3 cursor-pointer group"
              title="คลิกเพื่อเปิดสมุดเควสและแลกของขวัญ"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Coins size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800">กระเป๋าแต้มสะสม</span>
                  <span className="text-xs font-black text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded-full">
                    {totalPoints} แต้ม 🪙
                  </span>
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-2">
                  <span>สำเร็จ {completedQuestIds.length}/{allAcrossBooks.length} เควส</span>
                  <span className="text-amber-700 font-semibold group-hover:underline flex items-center gap-0.5">
                    <Gift size={11} /> แลกของรางวัล
                  </span>
                </div>
              </div>
            </div>

            {/* Mobile Pager */}
            {discoveredQuests.length > 1 && (
              <div className="lg:hidden flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-amber-200 text-xs">
                <button
                  onClick={() => setActiveQuestIndex(prev => (prev > 0 ? prev - 1 : discoveredQuests.length - 1))}
                  className="p-1 hover:bg-amber-100 rounded text-amber-900"
                  title="เควสก่อนหน้า"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="font-bold text-[11px] px-1">
                  {((activeQuestIndex % discoveredQuests.length) + 1)}/{discoveredQuests.length}
                </span>
                <button
                  onClick={() => setActiveQuestIndex(prev => (prev + 1) % discoveredQuests.length)}
                  className="p-1 hover:bg-amber-100 rounded text-amber-900"
                  title="เควสถัดไป"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}
          </div>

          {/* Divider on desktop */}
          <div className="hidden lg:block w-px h-8 bg-amber-200/60" />

          {/* Center: Recommended Active Quest */}
          <div className="flex-1 min-w-0 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md shrink-0">
                เควสอ่านธรรมะ
              </span>
              <span className="text-xs text-gray-500 truncate hidden sm:inline">
                {currentShowcaseQuest.bookTitle}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">
                {currentShowcaseQuest.title}
              </h4>
              <span className="text-xs font-bold text-amber-700 shrink-0">
                +{currentShowcaseQuest.loot.points} แต้ม
              </span>
              {isCurrentShowcaseCompleted && (
                <span className="text-emerald-600 text-[11px] font-bold flex items-center gap-0.5 shrink-0">
                  <CheckCircle2 size={12} /> สำเร็จแล้ว
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions & Pager */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end shrink-0 pt-1 lg:pt-0">
            {/* Desktop Pager */}
            {discoveredQuests.length > 1 && (
              <div className="hidden lg:flex items-center gap-1 bg-white px-2 py-1 rounded-full border border-amber-200 text-xs text-amber-900 mr-1">
                <button
                  onClick={() => setActiveQuestIndex(prev => (prev > 0 ? prev - 1 : discoveredQuests.length - 1))}
                  className="p-0.5 hover:bg-amber-100 rounded text-amber-900 transition-colors"
                  title="เควสก่อนหน้า"
                >
                  <ChevronLeft size={13} />
                </button>
                <span className="font-bold text-[11px] px-1">
                  {((activeQuestIndex % discoveredQuests.length) + 1)} / {discoveredQuests.length}
                </span>
                <button
                  onClick={() => setActiveQuestIndex(prev => (prev + 1) % discoveredQuests.length)}
                  className="p-0.5 hover:bg-amber-100 rounded text-amber-900 transition-colors"
                  title="เควสถัดไป"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            )}

            <Link
              href={`/reader/${currentShowcaseQuest.bookId}?page=${currentShowcaseQuest.triggerPage}`}
              className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <BookOpen size={13} />
              <span>{isCurrentShowcaseCompleted ? 'อ่านซ้ำ' : 'ไปอ่านเควส'}</span>
            </Link>

            <button
              onClick={() => {
                setIsCodexOpen(true);
                playWidgetSound('click', soundEnabled);
              }}
              className="px-3 py-1.5 bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>สมุดเควส</span>
              <ArrowRight size={12} />
            </button>
          </div>

        </div>
      </div>

      {/* 2. Full Quest Codex & Rewards Modal ("สมุดบันทึกเควส & แลกของขวัญ") */}
      {isCodexOpen && (
        <div className="fixed inset-0 z-[250] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-[#FFFDF9] border-2 border-amber-300 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
            
            {/* Header */}
            <div className="px-6 py-4 border-b border-amber-200/80 flex items-center justify-between bg-gradient-to-r from-amber-50 via-orange-50/60 to-amber-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                  <Compass size={24} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-amber-950 flex items-center gap-2">
                    สมุดบันทึกเควสธรรมะ & กระเป๋าแลกของขวัญ
                  </h3>
                  <p className="text-xs text-amber-800/80">
                    ติดตามภารกิจโลก ปริศนาธรรมที่ค้นพบ และแลกของที่ระลึก
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-2 text-amber-800 hover:bg-amber-100/70 rounded-full transition-colors cursor-pointer"
                  title={soundEnabled ? 'ปิดเสียง' : 'เปิดเสียง'}
                >
                  {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
                <button
                  onClick={() => setIsCodexOpen(false)}
                  className="w-9 h-9 rounded-full bg-amber-100/70 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-colors cursor-pointer"
                  title="ปิด"
                >
                  <X size={19} />
                </button>
              </div>
            </div>

            {/* Wallet Summary Banner */}
            <div className="px-6 py-3 bg-gradient-to-r from-amber-100/80 via-orange-100/50 to-amber-100/80 border-b border-amber-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              <div className="flex items-center gap-2 text-amber-950">
                <Coins size={18} className="text-amber-600 shrink-0" />
                <span className="font-semibold">แต้มสะสมในกระเป๋า:</span>
                <strong className="text-lg text-amber-700 font-extrabold">{totalPoints}</strong> แต้ม 🪙
              </div>

              <div className="flex items-center gap-3 text-xs font-semibold text-amber-900">
                <span>สำเร็จแล้ว: <strong>{completedQuestIds.length}</strong>/{allAcrossBooks.length} เควส</span>
                <span className="text-amber-300">|</span>
                <span>ค้นพบแล้ว: <strong>{discoveredQuests.length}</strong> เควส</span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-amber-200 bg-white/70 px-6 gap-2 pt-2 shrink-0">
              <button
                onClick={() => setSelectedCodexTab('discovered')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCodexTab === 'discovered'
                    ? 'border-amber-600 text-amber-900 font-black'
                    : 'border-transparent text-gray-500 hover:text-amber-800'
                }`}
              >
                <span>📜 เควสที่ค้นพบ ({discoveredQuests.length})</span>
              </button>
              <button
                onClick={() => setSelectedCodexTab('books')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCodexTab === 'books'
                    ? 'border-amber-600 text-amber-900 font-black'
                    : 'border-transparent text-gray-500 hover:text-amber-800'
                }`}
              >
                <span>📖 หนังสือที่มีภารกิจลับ ({Object.keys(QUEST_BOOKS_CATALOG).length})</span>
              </button>
              <button
                onClick={() => setSelectedCodexTab('shop')}
                className={`pb-2.5 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedCodexTab === 'shop'
                    ? 'border-amber-600 text-amber-900 font-black'
                    : 'border-transparent text-gray-500 hover:text-amber-800'
                }`}
              >
                <span>🎁 ร้านแลกของขวัญ ({REWARD_SHOP_ITEMS.length})</span>
              </button>
            </div>

            {/* Toast Notification */}
            {redeemSuccessToast && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 text-xs text-emerald-800 font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" />
                <span>{redeemSuccessToast}</span>
              </div>
            )}

            {/* Tab 1: Discovered Quests List */}
            {selectedCodexTab === 'discovered' && (
              <div className="p-4 sm:p-6 overflow-y-auto space-y-3 flex-grow bg-slate-50/50">
                {discoveredQuests.length > 0 ? (
                  discoveredQuests.map((quest) => {
                    const isCompleted = completedQuestIds.includes(quest.id);

                    return (
                      <div
                        key={quest.id}
                        className={`p-4 rounded-2xl border transition-all ${
                          isCompleted
                            ? 'bg-emerald-50/40 border-emerald-200'
                            : 'bg-white border-amber-200/80 shadow-xs'
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  isCompleted
                                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                                }`}
                              >
                                หน้า {quest.triggerPageEnd && quest.triggerPageEnd > quest.triggerPage ? `${quest.triggerPage}–${quest.triggerPageEnd}` : quest.triggerPage}
                              </span>
                              <span className="text-[10px] text-gray-500 font-medium">
                                {quest.bookTitle}
                              </span>
                              <span className="text-[10px] text-amber-800 font-semibold bg-amber-50 px-1.5 py-0.2 rounded">
                                {quest.categoryTag}
                              </span>
                            </div>

                            <h4 className="text-slate-900 font-bold text-sm sm:text-base">
                              {quest.title}
                            </h4>
                            <p className="text-xs text-gray-600 line-clamp-1 mt-0.5">
                              {quest.subtitle}
                            </p>

                            <div className="flex items-center gap-3 mt-2 text-[11px]">
                              <span className="text-amber-700 font-bold flex items-center gap-1">
                                <Coins size={12} className="text-amber-500" /> +{quest.loot.points} แต้ม 🪙
                              </span>
                              <span className="text-purple-700 font-medium flex items-center gap-1">
                                <span>{quest.loot.badgeIcon}</span> {quest.loot.badgeName}
                              </span>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0">
                            {isCompleted ? (
                              <button
                                onClick={() => setReviewingQuest(quest)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-100/70 hover:bg-emerald-100 text-emerald-800 border border-emerald-300/80 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <Check size={13} className="text-emerald-600" />
                                <span>ทบทวนคติธรรม</span>
                              </button>
                            ) : null}

                            <Link
                              href={`/reader/${quest.bookId}?page=${quest.triggerPage}`}
                              onClick={() => setIsCodexOpen(false)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 ${
                                isCompleted
                                  ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white'
                              }`}
                            >
                              <BookOpen size={13} />
                              <span>{isCompleted ? 'อ่านหน้านี้' : 'ไปอ่านเพื่อทำเควส'}</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-12 px-4 text-center">
                    <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 text-2xl shadow-inner">
                      📜
                    </div>
                    <h4 className="font-bold text-slate-900 text-base mb-1">ยังไม่มีเควสที่ค้นพบ</h4>
                    <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                      เควสธรรมะจะซ่อนอยู่ในหน้าหนังสือต่างๆ ลองเปิดอ่านเล่มแรกเพื่อค้นหาปริศนาลับได้ทันที!
                    </p>
                    <Link
                      href="/reader/book_mongkol_chiwit_124?page=1"
                      onClick={() => setIsCodexOpen(false)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
                    >
                      <Sparkles size={14} />
                      <span>เปิดอ่านมงคลชีวิต 38 ประการ หน้า 1</span>
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Books with Easter Egg Quests */}
            {selectedCodexTab === 'books' && (
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow bg-slate-50/50">
                <div className="text-xs text-amber-900/80 mb-2 font-medium">
                  หนังสือที่มีภารกิจลับซ่อนอยู่ สามารถเปิดอ่านและพลิกหน้าเพื่อค้นพบเควสและรับแต้มสะสม
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(QUEST_BOOKS_CATALOG).map(([bId, info]) => {
                    const bookQuests = allAcrossBooks.filter(q => q.bookId === bId);
                    const bookCompleted = bookQuests.filter(q => completedQuestIds.includes(q.id));
                    const bookPoints = bookQuests.reduce((sum, q) => sum + q.loot.points, 0);

                    return (
                      <div 
                        key={bId}
                        className="p-4 rounded-2xl bg-white border border-amber-200/90 shadow-xs flex flex-col justify-between gap-3 hover:border-amber-400 transition-all"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                              {bookQuests.length} ปริศนาลับ
                            </span>
                            <span className="text-[11px] font-extrabold text-amber-700">
                              สูงสุด {bookPoints} แต้ม 🪙
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm line-clamp-2">
                            {info.title}
                          </h4>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                              <span>ความสำเร็จ</span>
                              <span className="font-bold text-amber-900">
                                {bookCompleted.length} / {bookQuests.length} เควส
                              </span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div 
                                className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(bookCompleted.length / (bookQuests.length || 1)) * 100}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/reader/${bId}?page=1`}
                          onClick={() => setIsCodexOpen(false)}
                          className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <BookOpen size={13} />
                          <span>เปิดอ่านและสำรวจเควส</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Reward Shop (แลกของขวัญ) */}
            {selectedCodexTab === 'shop' && (
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-grow bg-slate-50/50">
                <div className="flex items-center justify-between bg-amber-100/70 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium">
                  <div className="flex items-center gap-2">
                    <Gift size={18} className="text-orange-500 shrink-0" />
                    <span>ใช้แต้มที่คุณสะสมจากการอ่านและตอบปริศนาธรรมะ เพื่อแลกรับของรางวัล</span>
                  </div>
                  <div className="font-extrabold text-amber-800 shrink-0">
                    คงเหลือ: {totalPoints} แต้ม
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {REWARD_SHOP_ITEMS.map((item) => {
                    const isRedeemed = redeemedItemIds.includes(item.id);
                    const canAfford = totalPoints >= item.pointsCost;

                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between gap-3 ${
                          isRedeemed 
                            ? 'bg-emerald-50/40 border-emerald-200' 
                            : 'bg-white border-amber-200/80 shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-2xl">{item.icon}</span>
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                              {item.category}
                            </span>
                          </div>

                          <h4 className="font-bold text-slate-900 text-sm mb-1">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                          <div className="text-xs font-black text-amber-700">
                            {item.pointsCost} แต้ม 🪙
                          </div>

                          {isRedeemed ? (
                            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} /> แลกรับแล้ว
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRedeemGift(item)}
                              disabled={!canAfford}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                canAfford
                                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-white shadow-xs'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                            >
                              {canAfford ? 'แลกของขวัญ' : 'แต้มไม่พอ'}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-3 bg-white border-t border-amber-200/80 flex items-center justify-between text-xs text-gray-500 shrink-0">
              <span>Thanavuddho Digital Library Gamification</span>
              <button
                onClick={() => setIsCodexOpen(false)}
                className="px-4 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold rounded-xl transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 3. Review Quest Modal (for completed quests) */}
      {reviewingQuest && (
        <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-[#FFFDF9] border-2 border-amber-300 rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-amber-200 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{reviewingQuest.loot.badgeIcon}</span>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {reviewingQuest.title}
                  </h4>
                  <div className="text-[11px] text-gray-500">
                    {reviewingQuest.bookTitle} (หน้า {reviewingQuest.triggerPageEnd && reviewingQuest.triggerPageEnd > reviewingQuest.triggerPage ? `${reviewingQuest.triggerPage}–${reviewingQuest.triggerPageEnd}` : reviewingQuest.triggerPage})
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setReviewingQuest(null)}
                className="w-8 h-8 rounded-full bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70 text-xs text-amber-950 italic">
              {reviewingQuest.loreStory}
            </div>

            <div>
              <div className="text-xs font-bold text-gray-700 mb-1">คำถามประจำเควส:</div>
              <div className="text-sm font-semibold text-slate-900">
                {reviewingQuest.question}
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs">
              <div className="font-bold text-emerald-800 flex items-center gap-1 mb-1">
                <CheckCircle2 size={14} /> คำตอบที่ถูกต้อง:
              </div>
              <div className="text-emerald-950 font-medium">
                {reviewingQuest.options[reviewingQuest.correctIndex]}
              </div>
            </div>

            <div className="text-xs text-gray-600 bg-white p-3 rounded-xl border border-gray-100">
              <strong className="text-slate-800">คติธรรมและคำอธิบาย:</strong> {reviewingQuest.explanation}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setReviewingQuest(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                เข้าใจแล้ว
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
