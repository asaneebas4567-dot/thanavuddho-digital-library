'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Coins, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Copy, 
  Check, 
  LogIn, 
  ChevronRight, 
  HelpCircle,
  Eye,
  Gift,
  Award,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LazadaRewardPopup, { RewardCelebrationData } from '@/components/rewards/LazadaRewardPopup';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeXm0BjEItVpzTyy6KMPUeRVFw9r7Z-hSczqDeTOytPc3NTXQ/viewform?usp=dialog';
const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeXm0BjEItVpzTyy6KMPUeRVFw9r7Z-hSczqDeTOytPc3NTXQ/viewform?embedded=true';

// Cute Novice Monk Mascot "น้องธรรมะ" (Nong Dhamma)
function NongDhammaMascot({ className = "w-20 h-20" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 160 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <radialGradient id="haloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </linearGradient>
        <linearGradient id="robeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
        <filter id="mascotShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#073B65" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Halo Background */}
      <circle cx="80" cy="72" r="54" fill="url(#haloGlow)" />

      {/* Body / Saffron Robe */}
      <g filter="url(#mascotShadow)">
        <path 
          d="M48 108 C44 122 42 142 40 152 C52 154 108 154 120 152 C118 142 116 122 112 108 C102 116 58 116 48 108 Z" 
          fill="url(#robeGrad)" 
        />
        {/* Robe Sashes & Folds */}
        <path 
          d="M50 110 C62 125 98 125 110 110 C100 135 60 135 50 110 Z" 
          fill="#C2410C" 
          opacity="0.35" 
        />
        <path 
          d="M62 104 Q72 138 80 152 Q88 138 98 104" 
          stroke="#9A3412" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          opacity="0.4" 
        />
      </g>

      {/* Ears */}
      <circle cx="45" cy="76" r="8" fill="url(#skinGrad)" />
      <circle cx="115" cy="76" r="8" fill="url(#skinGrad)" />
      <circle cx="46" cy="76" r="4" fill="#FFB74D" opacity="0.6" />
      <circle cx="114" cy="76" r="4" fill="#FFB74D" opacity="0.6" />

      {/* Head */}
      <circle cx="80" cy="72" r="36" fill="url(#skinGrad)" filter="url(#mascotShadow)" />

      {/* Cute Head Hair Shave Dot Accent */}
      <circle cx="80" cy="40" r="1.5" fill="#FFA726" opacity="0.5" />

      {/* Eyebrows */}
      <path d="M60 60 Q68 56 74 60" stroke="#795548" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 60 Q92 56 100 60" stroke="#795548" strokeWidth="2.5" strokeLinecap="round" />

      {/* Happy Curved Eyes */}
      <path d="M60 69 Q67 76 74 69" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M86 69 Q93 76 100 69" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Sweet Smile */}
      <path d="M72 82 Q80 90 88 82" stroke="#3E2723" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M75 84 Q80 88 85 84" fill="#E57373" />

      {/* Rosy Peach Cheeks */}
      <ellipse cx="57" cy="77" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />
      <ellipse cx="103" cy="77" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />

      {/* Left Hand holding Dharma Book/Tablet */}
      <g transform="translate(32, 102)">
        <rect x="0" y="0" width="22" height="28" rx="3" fill="#073B65" />
        <rect x="2" y="2" width="18" height="24" rx="2" fill="#FFFFFF" />
        {/* Book Lines & Golden Wheel */}
        <circle cx="11" cy="14" r="5" fill="#D9A441" />
        <circle cx="11" cy="14" r="2.5" fill="#FFFFFF" />
        <circle cx="11" cy="22" r="5" fill="url(#skinGrad)" />
      </g>

      {/* Right Hand Waving & Holding Big Shiny Golden Coin */}
      <g transform="translate(108, 38)">
        {/* Golden Coin */}
        <circle cx="18" cy="18" r="18" fill="url(#coinGrad)" filter="url(#mascotShadow)" />
        <circle cx="18" cy="18" r="14.5" stroke="#FEF08A" strokeWidth="1.5" fill="none" />
        {/* Text 200 */}
        <text 
          x="18" 
          y="23" 
          textAnchor="middle" 
          fill="#78350F" 
          fontSize="11" 
          fontWeight="900" 
          fontFamily="sans-serif"
        >
          200
        </text>
        {/* Sparkle Stars on Coin */}
        <path d="M8 8 L9 5 L10 8 L13 9 L10 10 L9 13 L8 10 L5 9 Z" fill="#FFFFFF" />
        <path d="M28 26 L28.6 24 L29.2 26 L31 26.6 L29.2 27.2 L28.6 29 L28 27.2 L26.2 26.6 Z" fill="#FEF08A" />
        {/* Little hand holding coin */}
        <circle cx="6" cy="24" r="5.5" fill="url(#skinGrad)" />
      </g>
    </svg>
  );
}

export default function SurveyMascotWidget() {
  const { user, isAuthenticated, updateUserPoints } = useAuth();
  
  // Widget Open State (Default to true so mobile is never blocked by expanded mascot)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [viewMode, setViewMode] = useState<'info' | 'embed'>('info');

  // Auto-expand on desktop screens (>=1024px) after mount, while keeping sleek edge pill on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      setIsMinimized(false);
    }
  }, []);

  // Claim Status State
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Celebration Modal State
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<RewardCelebrationData>({
    points: 200,
    title: 'แบบประเมินห้องสมุดสำเร็จ! 🪙',
    subtitle: 'รับ 200 แต้มบุญญาบารมี ขอบพระคุณที่ร่วมพัฒนา Thanavuddho Library'
  });

  // Inline Quick Login State (if guest wants to log in without leaving)
  const [showQuickLogin, setShowQuickLogin] = useState(false);

  // Check claim status when user changes
  useEffect(() => {
    if (!user?.email) {
      setIsClaimed(false);
      return;
    }

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/survey/claim?email=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        if (data.success && data.claimed) {
          setIsClaimed(true);
        } else {
          setIsClaimed(false);
        }
      } catch (e) {
        console.error('Failed to check survey claim status:', e);
      }
    };

    checkStatus();
  }, [user?.email]);

  // Listen for global open-survey-modal event (e.g. from TopBannerCarousel)
  useEffect(() => {
    const handleOpen = () => setIsModalOpen(true);
    window.addEventListener('open-survey-modal', handleOpen);
    return () => window.removeEventListener('open-survey-modal', handleOpen);
  }, []);

  // Audio Chime
  const playRewardChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.18, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.4);
      });
    } catch {}
  };

  // Copy Email to Clipboard
  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Claim 200 Points Action
  const handleClaimPoints = async () => {
    if (!user?.email) {
      setClaimMessage('กรุณาเข้าสู่ระบบก่อนรับคะแนน');
      return;
    }

    setIsClaiming(true);
    setClaimMessage('');

    try {
      const res = await fetch('/api/survey/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email })
      });

      const data = await res.json();

      if (data.success) {
        setIsClaimed(true);
        // Play rewarding chime
        playRewardChime();
        // Update client auth points balance
        await updateUserPoints(200);
        // Trigger Lazada-style surprise celebration popup!
        setCelebrationData({
          points: 200,
          title: 'แบบประเมินห้องสมุดสำเร็จ! 🪙',
          subtitle: 'รับ 200 แต้มบุญญาบารมี ขอบพระคุณที่ร่วมพัฒนา Thanavuddho Library'
        });
        setShowCelebration(true);
      } else if (data.alreadyAwarded) {
        setIsClaimed(true);
        setClaimMessage(data.message || 'คุณได้รับคะแนน 200 แต้มนี้ไปแล้วครับ');
      } else {
        setClaimMessage(data.message || 'เกิดข้อผิดพลาดในการบันทึกคะแนน กรุณาลองใหม่อีกครั้ง');
      }
    } catch (err: any) {
      setClaimMessage(err.message || 'การเชื่อมต่อขัดข้อง กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. FLOATING SIDE MASCOT WIDGET */}
      {/* ------------------------------------------------------------- */}
      <div 
        className={`fixed z-40 transition-all duration-300 ease-out select-none ${
          isMinimized 
            ? 'left-0 bottom-24 lg:bottom-1/3' 
            : 'left-2 sm:left-3 lg:left-6 bottom-24 lg:bottom-1/3'
        }`}
      >
        {isMinimized ? (
          /* Minimized Badge Tab - Compact & non-intrusive on mobile */
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-[#073B65] to-[#079FE8] text-white py-1.5 sm:py-2 px-2.5 sm:px-3 rounded-r-2xl shadow-lg border-y border-r border-[#D9A441]/60 hover:pl-3.5 transition-all cursor-pointer group active:scale-95"
            title="เปิดตัวช่วยแบบประเมิน รับ 200 แต้ม"
          >
            <div className="w-5 h-5 rounded-full bg-[#D9A441] flex items-center justify-center text-[#78350F] font-black text-[10px] shadow-sm animate-bounce">
              🪙
            </div>
            <span className="text-[11px] sm:text-xs font-black tracking-tight whitespace-nowrap">
              ประเมิน +200P
            </span>
          </button>
        ) : (
          /* Full Mascot with Speech Bubble */
          <div className="relative flex flex-col items-start group">
            
            {/* Close / Minimize Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMinimized(true);
              }}
              className="absolute -top-2 right-0 lg:-right-2 w-5 h-5 rounded-full bg-white/90 border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center text-[10px] shadow-sm z-10 transition-all cursor-pointer"
              title="ย่อแถบแนะนำ"
            >
              ✕
            </button>

            {/* Speech Bubble Callout */}
            <div 
              onClick={() => setIsModalOpen(true)}
              className="mb-1 cursor-pointer transition-transform duration-200 group-hover:-translate-y-0.5"
            >
              <div className="relative bg-white border-2 border-[#D9A441] rounded-2xl p-2.5 shadow-lg shadow-sky-950/15 max-w-[190px] sm:max-w-[210px] text-left">
                {/* Gold Highlight Tag */}
                <div className="flex items-center gap-1 text-[10px] font-extrabold text-[#B88328] uppercase tracking-wide mb-0.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#D9A441] animate-ping" />
                  <span>กิจกรรมพิเศษ</span>
                  <span className="ml-auto bg-[#FDF6E9] text-[#B88328] border border-[#D9A441]/40 px-1.5 py-0.2 rounded-md font-bold text-[9px]">
                    +200 P
                  </span>
                </div>

                {/* Thai Invitation Message */}
                <p className="text-xs font-bold text-[#073B65] leading-snug">
                  ประเมินเว็บ รับ 200 แต้ม! 🪙
                </p>
                <p className="text-[10px] text-[#64748B] mt-0.5 line-clamp-2">
                  ช่วยตอบแบบสอบถาม เพื่อพัฒนาห้องสมุดดิจิทัล
                </p>

                {/* Speech Bubble Arrow Tail */}
                <div className="absolute -bottom-2 left-6 w-3 h-3 bg-white border-b-2 border-r-2 border-[#D9A441] rotate-45" />
              </div>
            </div>

            {/* Mascot Character Interactive Button */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="relative p-1 rounded-3xl transition-transform duration-300 ease-out group-hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center focus:outline-none"
              title="คลิกเพื่อทำแบบประเมิน Google Forms รับ 200 แต้ม"
            >
              {/* Soft Golden Aura */}
              <div className="absolute inset-2 rounded-full bg-amber-400/20 blur-md pointer-events-none group-hover:bg-amber-400/35 transition-all" />
              
              {/* Animated Floating Mascot */}
              <div className="animate-bounce" style={{ animationDuration: '3.5s' }}>
                <NongDhammaMascot className="w-14 h-14 sm:w-20 sm:h-20 lg:w-24 lg:h-24 drop-shadow-md" />
              </div>

              {/* Status Badge below mascot */}
              <div className="absolute -bottom-1.5 bg-[#073B65] text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/60 shadow-sm flex items-center gap-1">
                {isClaimed ? (
                  <>
                    <CheckCircle2 size={10} className="text-emerald-400" />
                    <span>รับแต้มแล้ว</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={10} className="text-[#D9A441]" />
                    <span>กดรับแต้ม</span>
                  </>
                )}
              </div>
            </button>

          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. SURVEY INVITATION & CLAIM MODAL DIALOG                     */}
      {/* ------------------------------------------------------------- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div 
            className={`relative w-full bg-white rounded-3xl border border-[#DCEAF3] shadow-2xl overflow-hidden flex flex-col transition-all max-h-[92vh] ${
              viewMode === 'embed' ? 'max-w-4xl h-[90vh]' : 'max-w-xl'
            }`}
          >
            {/* Modal Header */}
            <div className="relative bg-gradient-to-r from-[#073B65] via-[#084c82] to-[#079FE8] text-white p-5 sm:p-6 shrink-0">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-full bg-white/5 rounded-full blur-2xl pointer-events-none" />
              
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer z-10"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 bg-white/10 rounded-2xl p-1 border border-white/20 backdrop-blur-xs flex items-center justify-center">
                  <NongDhammaMascot className="w-full h-full" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-yellow-300 text-[11px] font-bold tracking-wide uppercase mb-1 border border-yellow-300/30">
                    <Sparkles size={12} />
                    <span>รับ 200 แต้มบุญญาบารมี</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold leading-tight">
                    แบบประเมินความพึงพอใจห้องสมุดดิจิทัล
                  </h3>
                  <p className="text-xs text-sky-100/90 mt-1">
                    Thanavuddho Digital Library · พระครูปลัดสุวัฒนโพธิคุณ
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#243447]">
              
              {/* STEP 1: LOGIN CHECK CARD */}
              <div className="p-4 rounded-2xl bg-[#F0F8FD] border border-[#DCEAF3]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#079FE8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </span>
                    <h4 className="font-bold text-sm text-[#073B65]">
                      สถานะบัญชีสมาชิกที่ใช้รับแต้ม
                    </h4>
                  </div>
                  {isAuthenticated ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      <CheckCircle2 size={13} /> เข้าสู่ระบบแล้ว
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      <AlertCircle size={13} /> ยังไม่ได้เข้าสู่ระบบ
                    </span>
                  )}
                </div>

                {isAuthenticated && user ? (
                  /* Logged-in User Profile */
                  <div className="mt-2 bg-white rounded-xl p-3 border border-[#DCEAF3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#079FE8] to-[#073B65] text-white font-bold flex items-center justify-center text-sm shadow-xs shrink-0 overflow-hidden">
                        {user.picture ? (
                          <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          user.name.charAt(0)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#073B65]">
                          {user.name}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                          <span>{user.email}</span>
                          <button
                            onClick={handleCopyEmail}
                            className="p-1 hover:bg-slate-100 rounded text-slate-500 hover:text-slate-800 transition-colors"
                            title="คัดลอกอีเมลเพื่อไปกรอกใน Google Forms"
                          >
                            {copiedEmail ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                          </button>
                          {copiedEmail && <span className="text-[10px] text-emerald-600">คัดลอกแล้ว</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FDF6E9] border border-[#D9A441]/40 text-[#B88328] font-bold text-xs self-start sm:self-auto">
                      <Coins size={14} />
                      <span>คะแนนปัจจุบัน: {user.points} แต้ม</span>
                    </div>
                  </div>
                ) : (
                  /* Guest Notification & Quick Login CTA */
                  <div className="mt-2 bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/80">
                    <p className="text-xs text-amber-900 leading-relaxed mb-3">
                      💡 <strong>สำคัญ:</strong> กรุณาเข้าสู่ระบบก่อนทำแบบประเมิน เพื่อให้ระบบสามารถบันทึกและโอน <strong>200 แต้ม</strong> เข้ากระเป๋าสะสมของคุณได้ทันที
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/login?redirect=${encodeURIComponent(window.location.pathname)}`}
                        onClick={() => setIsModalOpen(false)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#079FE8] hover:bg-[#0588c7] text-white font-bold text-xs shadow-sm transition-all"
                      >
                        <LogIn size={14} />
                        <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: OPEN GOOGLE FORMS */}
              <div className="p-4 rounded-2xl bg-white border border-[#DCEAF3] shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#079FE8] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <h4 className="font-bold text-sm text-[#073B65]">
                    เปิดทำแบบสอบถามบน Google Forms
                  </h4>
                </div>

                <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                  กดปุ่มด้านล่างเพื่อเปิดแบบประเมินคุณภาพเว็บไซต์และหนังสือดิจิทัล Thanavuddho Library (กรุณากรอกอีเมลเดียวกับบัญชีสมาชิกของคุณเพื่อความถูกต้องในการยืนยันสิทธิ์)
                </p>

                <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                  {/* Primary Link Button */}
                  <a
                    href={GOOGLE_FORM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-[#079FE8] to-[#0588c7] hover:from-[#0588c7] hover:to-[#073B65] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-sky-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer text-center"
                  >
                    <span>เปิดแบบสอบถาม Google Forms (หน้าต่างใหม่)</span>
                    <ExternalLink size={15} />
                  </a>

                  {/* Toggle Embed View */}
                  <button
                    onClick={() => setViewMode(viewMode === 'embed' ? 'info' : 'embed')}
                    className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#073B65] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Eye size={15} />
                    <span>{viewMode === 'embed' ? 'ซ่อนแบบฟอร์ม' : 'ทำในหน้านี้'}</span>
                  </button>
                </div>

                {/* Embedded Google Form View (if toggled) */}
                {viewMode === 'embed' && (
                  <div className="mt-4 border border-[#DCEAF3] rounded-2xl overflow-hidden shadow-inner bg-slate-50">
                    <div className="bg-[#F0F8FD] px-3 py-2 border-b border-[#DCEAF3] flex items-center justify-between text-xs text-[#64748B]">
                      <span className="font-medium">Google Forms Embed</span>
                      <a 
                        href={GOOGLE_FORM_URL} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="text-[#079FE8] hover:underline flex items-center gap-1"
                      >
                        เปิดเต็มจอ <ExternalLink size={11} />
                      </a>
                    </div>
                    <iframe
                      src={GOOGLE_FORM_EMBED_URL}
                      width="100%"
                      height="460"
                      className="border-0 w-full"
                      title="Google Form Survey Embed"
                    >
                      กำลังโหลดแบบประเมิน...
                    </iframe>
                  </div>
                )}
              </div>

              {/* STEP 3: CONFIRMATION & CLAIM 200 POINTS */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#FDF6E9] to-white border-2 border-[#D9A441]/50 shadow-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-full bg-[#D9A441] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <h4 className="font-bold text-sm text-[#073B65]">
                    ส่งแบบสอบถามเสร็จแล้ว กดรับ 200 แต้ม
                  </h4>
                </div>

                <p className="text-xs text-[#64748B] mb-3 leading-relaxed">
                  เมื่อท่านกดปุ่ม <strong>"ส่ง" (Submit)</strong> ใน Google Forms เรียบร้อยแล้ว ให้กดยืนยันด้านล่างเพื่อรับคะแนนสะสม 200 แต้มเข้ากระเป๋าสมาชิกทันที (จำกัด 1 สิทธิ์/คน)
                </p>

                {claimMessage && (
                  <div className={`p-3 rounded-xl text-xs font-medium mb-3 flex items-start gap-2 ${
                    isClaimed ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}>
                    {isClaimed ? <CheckCircle2 size={16} className="shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle size={16} className="shrink-0 text-rose-600 mt-0.5" />}
                    <span>{claimMessage}</span>
                  </div>
                )}

                {isClaimed ? (
                  /* Already Claimed State */
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mb-2">
                      <CheckCircle2 size={26} />
                    </div>
                    <div className="text-sm font-bold text-emerald-900">
                      ท่านได้รับคะแนน 200 แต้มเรียบร้อยแล้ว
                    </div>
                    <p className="text-xs text-emerald-700 mt-1">
                      ขอบพระคุณสำหรับข้อคิดเห็นอันมีค่ายิ่ง เพื่อนำไปพัฒนา Thanavuddho Digital Library
                    </p>
                  </div>
                ) : (
                  /* Claim Button */
                  <button
                    onClick={handleClaimPoints}
                    disabled={isClaiming || !isAuthenticated}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#D9A441] via-[#c49233] to-[#B88328] hover:from-[#c49233] hover:to-[#a1701e] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm sm:text-base shadow-lg shadow-amber-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isClaiming ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>กำลังตรวจสอบและบันทึก 200 แต้ม...</span>
                      </>
                    ) : (
                      <>
                        <Coins size={20} className="text-yellow-100 animate-bounce" />
                        <span>ยืนยันว่าส่งคำตอบแล้ว — รับทันที 200 แต้ม! 🪙</span>
                      </>
                    )}
                  </button>
                )}

                {!isAuthenticated && (
                  <p className="text-[11px] text-center text-amber-700 mt-2 font-medium">
                    * กรุณาเข้าสู่ระบบในขั้นตอนที่ 1 ก่อนกดรับคะแนน
                  </p>
                )}
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-[#DCEAF3] flex items-center justify-between text-xs text-[#64748B] shrink-0">
              <span className="flex items-center gap-1.5">
                <Gift size={13} className="text-[#D9A441]" />
                <span>จำกัด 1 สิทธิ์ ต่อ 1 บัญชีสมาชิก</span>
              </span>
              <button
                onClick={() => setIsModalOpen(false)}
                className="hover:text-[#073B65] font-semibold transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. LAZADA REWARD CELEBRATION POPUP (+200 POINTS SURPRISE)     */}
      {/* ------------------------------------------------------------- */}
      <LazadaRewardPopup
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        data={celebrationData}
        onClaim={() => {
          setShowCelebration(false);
        }}
      />
    </>
  );
}

