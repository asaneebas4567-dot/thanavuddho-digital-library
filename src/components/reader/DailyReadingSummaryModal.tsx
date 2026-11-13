'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Clock, 
  BookOpen, 
  Coins, 
  ArrowRight, 
  CheckCircle2, 
  Flame,
  X
} from 'lucide-react';
import { triggerFlyingCoins } from '@/components/common/FlyingCoinAnimation';

interface DailyReadingSummaryModalProps {
  isOpen: boolean;
  readingSeconds: number;
  pagesRead: number;
  bookTitle: string;
  onClaimAndExit: (pointsEarned: number) => void;
  onContinueReading: () => void;
}

export default function DailyReadingSummaryModal({
  isOpen,
  readingSeconds,
  pagesRead,
  bookTitle,
  onClaimAndExit,
  onContinueReading,
}: DailyReadingSummaryModalProps) {
  const [isClaiming, setIsClaiming] = useState(false);

  if (!isOpen) return null;

  const minutes = Math.floor(readingSeconds / 60);
  const seconds = readingSeconds % 60;

  // Calculate coins according to read time (Lazada coin style gamification)
  let coinsAwarded = 2; // base starter
  if (minutes >= 15) coinsAwarded = 15;
  else if (minutes >= 10) coinsAwarded = 10;
  else if (minutes >= 5) coinsAwarded = 5;
  else if (minutes >= 1) coinsAwarded = 3;

  const handleClaim = () => {
    setIsClaiming(true);
    triggerFlyingCoins({ count: 15, sound: true });
    setTimeout(() => {
      onClaimAndExit(coinsAwarded);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity"
        onClick={onContinueReading}
      />

      {/* Lazada-Style Gamified Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-2 border-amber-300 overflow-hidden z-10 animate-in zoom-in-95 duration-200 text-center">
        
        {/* Top Floating Glow & Mascot */}
        <div className="relative bg-gradient-to-b from-[#073B65] via-[#0A4D82] to-[#079FE8] pt-8 pb-10 px-6 text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(251,191,36,0.25)_0%,transparent_70%)] pointer-events-none" />
          
          <button
            onClick={onContinueReading}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ปิด"
          >
            <X size={16} />
          </button>

          {/* Golden Bouncing Coin Hub */}
          <div className="relative w-24 h-24 mx-auto mb-3 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-amber-400/30 blur-xl animate-pulse" />
            <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 shadow-2xl flex items-center justify-center border-3 border-white text-4xl select-none animate-bounce">
              🪙
            </div>
            <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-black border border-amber-400">
              +{coinsAwarded} P
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-xs mb-1.5">
            <Flame size={13} className="fill-current text-amber-800" />
            <span>ภารกิจอ่านหนังสือประจำวัน</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            สาธุ! ศึกษาธรรมะสำเร็จ
          </h3>
          <p className="text-xs text-sky-100 mt-1 line-clamp-1 max-w-xs mx-auto">
            {bookTitle}
          </p>
        </div>

        {/* Reading Summary Badges (3 Pillars) */}
        <div className="p-5 sm:p-6 space-y-4 -mt-5 bg-white rounded-t-3xl relative z-10 shadow-lg">
          
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <Clock className="w-4 h-4 text-sky-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-500 font-bold">เวลาอ่านวันนี้</div>
              <div className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">
                {minutes > 0 ? `${minutes}น. ${seconds}ว.` : `${seconds} วินาที`}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <BookOpen className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-[10px] text-slate-500 font-bold">หน้าที่เปิดอ่าน</div>
              <div className="text-xs sm:text-sm font-black text-slate-800 mt-0.5">
                {pagesRead} หน้า
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-center">
              <Coins className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <div className="text-[10px] text-amber-800 font-bold">เหรียญที่ได้รับ</div>
              <div className="text-xs sm:text-sm font-black text-amber-950 mt-0.5">
                +{coinsAwarded} แต้ม
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleClaim}
              disabled={isClaiming}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
            >
              <Coins size={17} className="text-amber-100" />
              <span>{isClaiming ? 'กำลังบันทึกแต้ม...' : `รับเหรียญ +${coinsAwarded} แต้ม แล้วออก`}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={onContinueReading}
              className="w-full py-2.5 px-4 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              อ่านต่ออีกนิด (ยังไม่ออก)
            </button>
          </div>

          <p className="text-[10px] text-slate-400 leading-normal">
            * ยิ่งอ่านต่อเนื่องนานขึ้น ยิ่งได้รับเหรียญรางวัลสะสมสูงสุดเพื่อนำไปแลกของรางวัล
          </p>

        </div>

      </div>
    </div>
  );
}

