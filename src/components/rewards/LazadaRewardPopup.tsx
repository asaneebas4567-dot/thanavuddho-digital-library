'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Coins, Flame, Award, X, CheckCircle2, ChevronRight, Gift } from 'lucide-react';

export interface RewardCelebrationData {
  points: number;
  streakDays?: number;
  title?: string;
  subtitle?: string;
  bonusMultiplier?: number;
  pagesRead?: number;
  secondsSpent?: number;
}

interface LazadaRewardPopupProps {
  isOpen: boolean;
  onClose: () => void;
  data: RewardCelebrationData;
  onClaim?: () => void;
}

export default function LazadaRewardPopup({
  isOpen,
  onClose,
  data,
  onClaim
}: LazadaRewardPopupProps) {
  const [displayPoints, setDisplayPoints] = useState<number>(0);
  const [claimed, setClaimed] = useState<boolean>(false);

  // Animated rolling score effect (ticker)
  useEffect(() => {
    if (!isOpen) {
      setDisplayPoints(0);
      setClaimed(false);
      return;
    }

    const target = data.points || 15;
    const duration = 1200; // ms
    const stepTime = 30;
    const steps = duration / stepTime;
    const increment = target / steps;

    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayPoints(target);
        clearInterval(timer);
      } else {
        setDisplayPoints(Math.floor(current));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isOpen, data.points]);

  if (!isOpen) return null;

  const streakDays = data.streakDays || 3;
  const streakDaysList = [
    { day: 1, points: 5, active: streakDays >= 1 },
    { day: 2, points: 10, active: streakDays >= 2 },
    { day: 3, points: 15, active: streakDays >= 3, current: streakDays === 3 },
    { day: 4, points: 20, active: streakDays >= 4 },
    { day: 5, points: 25, active: streakDays >= 5 },
    { day: 6, points: 30, active: streakDays >= 6 },
    { day: 7, points: 50, isMystery: true, active: streakDays >= 7 }
  ];

  const handleClaim = () => {
    setClaimed(true);
    if (onClaim) onClaim();
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      {/* Container with bright sky-blue & crisp white clean theme */}
      <div className="relative w-full max-w-md bg-white rounded-3xl border-2 border-sky-200 p-6 sm:p-8 shadow-2xl text-center overflow-hidden animate-scaleUp">
        
        {/* Soft Sky Blue Glow Background */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-sky-200/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-200/30 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3">
          <Sparkles size={13} className="text-sky-500 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{data.title || 'เซอร์ไพรส์แต้มปัญญา! (Daily Reward)'}</span>
        </div>

        {/* Big Rotating Gold Coin */}
        <div className="relative my-4 flex justify-center items-center">
          {/* Pulsing ring */}
          <div className="absolute w-28 h-28 rounded-full border-2 border-amber-300 animate-ping opacity-60 pointer-events-none" />
          
          {/* Main 3D Coin Graphic */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-200 p-1.5 shadow-[0_10px_25px_rgba(245,158,11,0.35)] transform hover:rotate-12 transition-transform cursor-pointer">
            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-600 border-2 border-yellow-200/60 flex flex-col items-center justify-center text-white shadow-inner">
              <Coins size={36} className="text-yellow-100 drop-shadow-md animate-bounce" style={{ animationDuration: '2s' }} />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-100 drop-shadow">บุญญาบารมี</span>
            </div>
          </div>
        </div>

        {/* Big Score Counter */}
        <div className="my-2">
          <div className="text-xs font-medium text-slate-600">
            {data.subtitle || 'อ่านเนื้อหาจบตอนตามเวลาที่กำหนด'}
          </div>
          <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 tracking-tight drop-shadow-xs my-1">
            +{displayPoints} <span className="text-2xl sm:text-3xl font-bold text-amber-600">แต้ม</span>
          </div>
          {data.bonusMultiplier && data.bonusMultiplier > 1 && (
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-600 text-[11px] font-bold">
              🔥 โบนัสอ่านต่อเนื่อง x{data.bonusMultiplier}
            </span>
          )}
        </div>

        {/* Lazada/Shopee Streak Bar: 7-Day Continuous Streak */}
        <div className="mt-5 p-3.5 rounded-2xl bg-sky-50/70 border border-sky-100">
          <div className="flex items-center justify-between text-xs mb-2.5">
            <div className="flex items-center gap-1.5 font-bold text-sky-900">
              <Flame size={14} className="text-rose-500 fill-rose-500" />
              <span>อ่านต่อเนื่อง {streakDays} วันติดต่อกัน</span>
            </div>
            <span className="text-[11px] text-slate-500">วันที่ 7 รับกล่องทอง</span>
          </div>

          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {streakDaysList.map((st) => (
              <div
                key={st.day}
                className={`flex flex-col items-center justify-between py-1.5 px-1 rounded-xl border text-[10px] font-bold transition-all ${
                  st.active
                    ? 'bg-white border-sky-300 text-sky-800 shadow-xs'
                    : 'bg-white/50 border-slate-200 text-slate-400'
                } ${st.current ? 'ring-2 ring-sky-400 scale-105' : ''}`}
              >
                <span>ว.{st.day}</span>
                {st.isMystery ? (
                  <Gift size={14} className={st.active ? 'text-amber-500 animate-pulse' : 'text-slate-400'} />
                ) : (
                  <span className={st.active ? 'text-sky-700' : 'text-slate-400'}>+{st.points}</span>
                )}
                {st.active && <CheckCircle2 size={10} className="text-emerald-500 mt-0.5" />}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-6">
          <button
            onClick={handleClaim}
            disabled={claimed}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm sm:text-base tracking-wide shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              claimed
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-gradient-to-r from-sky-500 via-sky-600 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white shadow-sky-500/25 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {claimed ? (
              <>
                <CheckCircle2 size={20} className="text-white" />
                <span>สะสมแต้มเข้าบัญชีสำเร็จแล้ว!</span>
              </>
            ) : (
              <>
                <Coins size={20} />
                <span>กดรับแต้มสะสมทันที (Claim Reward)</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-500 mt-2">
            แต้มสามารถนำไปแลกของที่ระลึกธรรมะหรือปลดล็อกสิทธิพิเศษในระบบได้
          </p>
        </div>

      </div>
    </div>
  );
}

