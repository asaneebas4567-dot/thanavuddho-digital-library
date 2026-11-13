'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Sparkles, 
  Gift, 
  Check, 
  Clock, 
  X, 
  Flame, 
  Coins, 
  ArrowRight,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { triggerFlyingCoins } from '@/components/common/FlyingCoinAnimation';

export interface DailyLoginRewardConfig {
  day: number;
  points: number;
  isMysteryBox?: boolean;
  minPoints?: number;
  maxPoints?: number;
  title: string;
  icon: string;
}

export const DAILY_LOGIN_SCHEDULE: DailyLoginRewardConfig[] = [
  { day: 1, points: 30, title: 'วันที่ 1', icon: '🪙' },
  { day: 2, points: 60, title: 'วันที่ 2', icon: '🪙' },
  { day: 3, points: 70, title: 'วันที่ 3', icon: '🪙' },
  { day: 4, points: 100, title: 'วันที่ 4', icon: '💰' },
  { day: 5, points: 100, title: 'วันที่ 5', icon: '💰' },
  { day: 6, points: 130, title: 'วันที่ 6', icon: '👑' },
  { 
    day: 7, 
    points: 300, 
    isMysteryBox: true, 
    minPoints: 200, 
    maxPoints: 500, 
    title: 'วันที่ 7 สุ่มรางวัลใหญ่', 
    icon: '🎁' 
  },
];

interface DailyLoginStreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DailyLoginStreakModal({ isOpen, onClose }: DailyLoginStreakModalProps) {
  const { recordEarn, userEmail } = useLearningPoints();
  const [streakDays, setStreakDays] = useState(1);
  const [isClaimedToday, setIsClaimedToday] = useState(false);
  const [claimedReward, setClaimedReward] = useState<{ day: number; points: number } | null>(null);
  const [isRollingMystery, setIsRollingMystery] = useState(false);

  const getTodayString = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const today = getTodayString();
    const lastClaimDate = localStorage.getItem('dhamma_daily_login_last_date');
    const savedStreak = parseInt(localStorage.getItem('dhamma_daily_login_streak') || '0', 10);

    if (lastClaimDate === today) {
      setIsClaimedToday(true);
      setStreakDays(savedStreak || 1);
    } else {
      setIsClaimedToday(false);
      if (!lastClaimDate) {
        setStreakDays(1);
      } else {
        // Calculate days difference
        const last = new Date(lastClaimDate);
        const curr = new Date(today);
        const diffDays = Math.round((curr.getTime() - last.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          // Continuous streak
          setStreakDays(savedStreak >= 7 ? 1 : savedStreak + 1);
        } else {
          // Missed streak: reset to day 1
          setStreakDays(1);
        }
      }
    }
  }, [isOpen]);

  const handleClaimToday = async () => {
    if (isClaimedToday) return;

    const today = getTodayString();
    const config = DAILY_LOGIN_SCHEDULE.find(s => s.day === streakDays) || DAILY_LOGIN_SCHEDULE[0];
    
    let pointsAwarded = config.points;
    if (config.isMysteryBox && config.minPoints && config.maxPoints) {
      setIsRollingMystery(true);
      // Random reward between 200 and 500 in multiples of 10
      const steps = Math.floor((config.maxPoints - config.minPoints) / 10);
      pointsAwarded = config.minPoints + Math.floor(Math.random() * (steps + 1)) * 10;
      await new Promise(r => setTimeout(r, 800));
      setIsRollingMystery(false);
    }

    // Save to LocalStorage
    localStorage.setItem('dhamma_daily_login_last_date', today);
    localStorage.setItem('dhamma_daily_login_streak', streakDays.toString());
    setIsClaimedToday(true);
    setClaimedReward({ day: streakDays, points: pointsAwarded });

    // Trigger visual coins animation!
    triggerFlyingCoins({ count: 18, sound: true });

    // Record points on server
    await recordEarn({
      type: 'daily_login',
      sourceId: `login_${today}`,
      customPoints: pointsAwarded,
      customTitle: `เช็คอินธรรมะประจำวัน (วันที่ ${streakDays}/7)`,
      customDetail: config.isMysteryBox 
        ? `เปิดกล่องสุ่มนำโชค 7 วันต่อเนื่อง ได้รับ +${pointsAwarded} P`
        : `เช็คอินวันที่ ${streakDays} ได้รับ +${pointsAwarded} P`
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-amber-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        
        {/* Header Golden Glow Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#073B65] via-[#0A4D82] to-[#079FE8] text-white p-5 sm:p-6 text-center border-b border-sky-300/30">
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X size={17} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-sm mb-2">
            <Flame size={14} className="text-amber-800 fill-current" />
            <span>เช็คอินรับแต้มธรรมะ 7 วันต่อเนื่อง</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-black tracking-tight">
            รางวัลเข้าใช้งานประจำวัน
          </h3>
          <p className="text-xs sm:text-sm text-sky-100 mt-1">
            เข้าศึกษาธรรมะต่อเนื่องเพื่อรับแต้มสะสม วันที่ 7 รับกล่องสุ่มพิเศษสูงสุด 500 แต้ม!
          </p>
        </div>

        {/* 7-Day Streak Grid */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
            {DAILY_LOGIN_SCHEDULE.map((item) => {
              const isPast = item.day < streakDays || (item.day === streakDays && isClaimedToday);
              const isCurrent = item.day === streakDays && !isClaimedToday;
              const isFuture = item.day > streakDays;

              return (
                <div
                  key={item.day}
                  className={`relative rounded-2xl p-2.5 sm:p-3 text-center flex flex-col items-center justify-between transition-all ${
                    item.isMysteryBox ? 'col-span-4 sm:col-span-1' : ''
                  } ${
                    isPast
                      ? 'bg-emerald-50 border-2 border-emerald-300 text-emerald-900 shadow-xs'
                      : isCurrent
                      ? 'bg-gradient-to-b from-amber-50 to-orange-50 border-2 border-amber-400 shadow-md scale-103 ring-2 ring-amber-300/60'
                      : 'bg-slate-50 border border-slate-200 text-slate-500 opacity-75'
                  }`}
                >
                  {/* Status Indicator */}
                  <div className="text-[10px] sm:text-[11px] font-bold mb-1">
                    {item.day === 7 ? 'วันที่ 7' : `วันที่ ${item.day}`}
                  </div>

                  {/* Icon */}
                  <div className="text-2xl sm:text-3xl my-1 animate-bounce-short">
                    {item.icon}
                  </div>

                  {/* Points Label */}
                  <div className="text-xs font-black text-slate-900">
                    {item.isMysteryBox ? (
                      <span className="text-[#D9A441] font-black">200-500 P</span>
                    ) : (
                      <span>+{item.points} P</span>
                    )}
                  </div>

                  {/* Badge */}
                  {isPast && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                      <Check size={11} />
                    </div>
                  )}

                  {isCurrent && (
                    <span className="mt-1 text-[9px] font-bold text-amber-800 bg-amber-200/90 px-1.5 py-0.2 rounded-full">
                      วันนี้
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Action Button & Confirmation Message */}
          <div className="pt-2">
            {isClaimedToday ? (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-center">
                <div className="flex items-center justify-center gap-1.5 text-emerald-800 font-bold text-xs sm:text-sm">
                  <Check size={16} className="text-emerald-600" />
                  <span>คุณเช็คอินวันที่ {streakDays} เรียบร้อยแล้ว (รับ +{claimedReward?.points || DAILY_LOGIN_SCHEDULE[streakDays - 1]?.points} แต้ม)</span>
                </div>
                <p className="text-[11px] text-emerald-600 mt-0.5">
                  กลับมาเช็คอินวันที่ {streakDays >= 7 ? 1 : streakDays + 1} ในวันพรุ่งนี้เพื่อสะสมแต้มต่อเนื่อง
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleClaimToday}
                disabled={isRollingMystery}
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer active:scale-98 flex items-center justify-center gap-2"
              >
                {isRollingMystery ? (
                  <span>กำลังสุ่มกล่องสมบัติ...</span>
                ) : (
                  <>
                    <Coins size={18} className="text-amber-100" />
                    <span>กดรับรางวัลเช็คอินวันที่ {streakDays} (+{DAILY_LOGIN_SCHEDULE[streakDays - 1]?.points || 30} แต้ม)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Rules & Policy Note */}
          <div className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 rounded-xl p-3 border border-slate-100">
            <span className="font-bold text-slate-700">เกณฑ์การนับคะแนนล็อกอิน:</span>
            {' '}วันที่ 1 (30P), วันที่ 2 (60P), วันที่ 3 (70P), วันที่ 4 (100P), วันที่ 5 (100P), วันที่ 6 (130P) และวันที่ 7 สุ่มกล่องของขวัญนำโชค 200 - 500P เพื่อนำไปใช้แลกของรางวัลในระบบ
          </div>

        </div>

      </div>
    </div>
  );
}

