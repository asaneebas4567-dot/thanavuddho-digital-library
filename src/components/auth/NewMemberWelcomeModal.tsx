'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Award, Sparkles, ArrowRight, Check } from 'lucide-react';

interface WelcomeEventDetail {
  points: number;
  userName?: string;
}

export default function NewMemberWelcomeModal() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [points, setPoints] = useState(500);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const handleNewMember = (event: Event) => {
      const customEvent = event as CustomEvent<WelcomeEventDetail>;
      if (customEvent.detail) {
        setPoints(customEvent.detail.points || 500);
        setUserName(customEvent.detail.userName || '');
      }
      setIsOpen(true);
    };

    window.addEventListener('thanavuddho_new_member_welcome', handleNewMember);
    return () => {
      window.removeEventListener('thanavuddho_new_member_welcome', handleNewMember);
    };
  }, []);

  const handleStart = () => {
    setIsOpen(false);
    // Dispatch point flying animation event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('dhamma_points_updated'));
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-modal-title"
    >
      <div 
        className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Ivory/Gold Glow */}
        <div className="absolute top-0 right-0 w-44 h-44 bg-amber-50/80 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-44 h-44 bg-sky-50/70 rounded-full blur-3xl pointer-events-none -ml-16 -mb-16" />

        {/* Badge Icon */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-[#073B65] via-[#0A4D82] to-[#079FE8] border-2 border-amber-300 shadow-xl flex items-center justify-center text-white">
          <Award className="w-8 h-8 sm:w-10 sm:h-10 text-amber-300 drop-shadow-md" />
          <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
            <Check size={14} className="stroke-[3]" />
          </span>
        </div>

        {/* Small Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-[#073B65] border border-sky-200/80 text-[11px] font-bold mb-3 shadow-2xs">
          <Sparkles size={12} className="text-[#079FE8]" />
          <span>ยินดีต้อนรับสมาชิกห้องสมุดดิจิทัล</span>
        </div>

        {/* Required Headline */}
        <h2 id="welcome-modal-title" className="text-xl sm:text-2xl font-black text-[#073B65] tracking-tight mb-2">
          ยินดีต้อนรับสมาชิกใหม่!
        </h2>

        {/* Welcome Points Badge */}
        <div className="my-3 py-3 px-4 rounded-2xl bg-[#FFFDF5] border border-[#F5E6C8] shadow-xs inline-flex items-center gap-2">
          <span className="text-xl sm:text-2xl">🪙</span>
          <div className="text-left">
            <div className="text-xs text-amber-800 font-bold">
              คุณได้รับคะแนนต้อนรับ
            </div>
            <div className="text-lg sm:text-xl font-black text-[#073B65] font-mono leading-tight">
              +{points.toLocaleString()} แต้ม
            </div>
          </div>
        </div>

        {/* Required Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto mb-6">
          เริ่มต้นสะสมคะแนนและค้นพบความรู้ธรรมะได้แล้ววันนี้
        </p>

        {/* Required Action Button: "เริ่มต้นใช้งาน" */}
        <button
          onClick={handleStart}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#079FE8] via-[#0A88CE] to-[#073B65] hover:brightness-105 active:scale-98 text-white font-bold text-sm sm:text-base shadow-lg shadow-sky-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>เริ่มต้นใช้งาน</span>
          <ArrowRight size={16} />
        </button>

      </div>
    </div>
  );
}
