'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Coins, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  LogIn, 
  ChevronRight, 
  Gift, 
  ArrowLeft,
  Eye,
  ShieldCheck,
  Star
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import LazadaRewardPopup, { RewardCelebrationData } from '@/components/rewards/LazadaRewardPopup';

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeXm0BjEItVpzTyy6KMPUeRVFw9r7Z-hSczqDeTOytPc3NTXQ/viewform?usp=dialog';
const GOOGLE_FORM_EMBED_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSeXm0BjEItVpzTyy6KMPUeRVFw9r7Z-hSczqDeTOytPc3NTXQ/viewform?embedded=true';

// Mini Novice Monk Mascot SVG
function NoviceMascotHero() {
  return (
    <svg 
      viewBox="0 0 160 160" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className="w-28 h-28 sm:w-36 sm:h-36 drop-shadow-xl select-none"
    >
      <defs>
        <radialGradient id="heroHaloGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="heroSkinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFE0B2" />
          <stop offset="100%" stopColor="#FFCC80" />
        </linearGradient>
        <linearGradient id="heroRobeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="50%" stopColor="#EA580C" />
          <stop offset="100%" stopColor="#C2410C" />
        </linearGradient>
        <linearGradient id="heroCoinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="40%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#CA8A04" />
        </linearGradient>
      </defs>

      {/* Halo Background */}
      <circle cx="80" cy="72" r="54" fill="url(#heroHaloGlow)" />

      {/* Body / Saffron Robe */}
      <path 
        d="M48 108 C44 122 42 142 40 152 C52 154 108 154 120 152 C118 142 116 122 112 108 C102 116 58 116 48 108 Z" 
        fill="url(#heroRobeGrad)" 
      />
      <path 
        d="M50 110 C62 125 98 125 110 110 C100 135 60 135 50 110 Z" 
        fill="#C2410C" 
        opacity="0.35" 
      />

      {/* Ears */}
      <circle cx="45" cy="76" r="8" fill="url(#heroSkinGrad)" />
      <circle cx="115" cy="76" r="8" fill="url(#heroSkinGrad)" />

      {/* Head */}
      <circle cx="80" cy="72" r="36" fill="url(#heroSkinGrad)" />

      {/* Eyebrows */}
      <path d="M60 60 Q68 56 74 60" stroke="#795548" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M86 60 Q92 56 100 60" stroke="#795548" strokeWidth="2.5" strokeLinecap="round" />

      {/* Happy Curved Eyes */}
      <path d="M60 69 Q67 76 74 69" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M86 69 Q93 76 100 69" stroke="#3E2723" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Sweet Smile */}
      <path d="M72 82 Q80 90 88 82" stroke="#3E2723" strokeWidth="2.8" strokeLinecap="round" fill="none" />
      <path d="M75 84 Q80 88 85 84" fill="#E57373" />

      {/* Peach Cheeks */}
      <ellipse cx="57" cy="77" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />
      <ellipse cx="103" cy="77" rx="6" ry="4" fill="#FF8A80" opacity="0.65" />

      {/* Left Hand holding Dharma Tablet */}
      <g transform="translate(32, 102)">
        <rect x="0" y="0" width="22" height="28" rx="3" fill="#073B65" />
        <rect x="2" y="2" width="18" height="24" rx="2" fill="#FFFFFF" />
        <circle cx="11" cy="14" r="5" fill="#D9A441" />
      </g>

      {/* Right Hand Waving & Holding 200 Coin */}
      <g transform="translate(108, 38)">
        <circle cx="18" cy="18" r="18" fill="url(#heroCoinGrad)" />
        <circle cx="18" cy="18" r="14.5" stroke="#FEF08A" strokeWidth="1.5" fill="none" />
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
        <path d="M8 8 L9 5 L10 8 L13 9 L10 10 L9 13 L8 10 L5 9 Z" fill="#FFFFFF" />
      </g>
    </svg>
  );
}

export default function SurveyPage() {
  const { user, isAuthenticated, updateUserPoints } = useAuth();
  const [isClaimed, setIsClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [showEmbed, setShowEmbed] = useState(true);

  // Celebration Modal
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<RewardCelebrationData>({
    points: 200,
    title: 'ตอบแบบประเมินสำเร็จ! 🪙',
    subtitle: 'รับ 200 แต้มสะสม ขอบพระคุณที่ร่วมพัฒนา Thanavuddho Digital Library'
  });

  // Check Status
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

  const handleCopyEmail = () => {
    if (!user?.email) return;
    navigator.clipboard.writeText(user.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

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
        if (typeof data.pointsAdded === 'number') {
          updateUserPoints(data.pointsAdded);
          setCelebrationData({
            points: data.pointsAdded,
            title: 'รับ 200 แต้มสะสมสำเร็จ! 🪙',
            subtitle: 'แต้มถูกโอนเข้ากระเป๋าของคุณแล้ว ขอบพระคุณสำหรับข้อคิดเห็นอันมีค่ายิ่ง'
          });
        }
        setShowCelebration(true);
        setClaimMessage('บันทึก 200 แต้มสะสมสำเร็จเรียบร้อยแล้ว!');
      } else if (data.alreadyAwarded) {
        setIsClaimed(true);
        setClaimMessage('บัญชีของคุณได้รับแต้มแบบประเมินนี้ไปแล้ว (จำกัด 1 ครั้ง/คน)');
      } else {
        setClaimMessage(data.message || 'ไม่สามารถรับแต้มได้ กรุณาลองใหม่อีกครั้ง');
      }
    } catch (e: any) {
      setClaimMessage('เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsClaiming(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-700 hover:text-sky-900 transition-colors"
          >
            <ArrowLeft size={16} />
            <span>กลับสู่หน้าแรก</span>
          </Link>
          <span className="text-xs text-slate-500 font-medium">
            ภารกิจรับแต้มห้องสมุดดิจิทัล
          </span>
        </div>

        {/* Hero Card */}
        <div className="relative rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0A4D82] to-[#079FE8] text-white p-6 sm:p-8 shadow-xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-3 text-center md:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold border border-amber-300/30">
              <Sparkles size={14} />
              <span>กิจกรรมพิเศษ: ทำแบบประเมิน รับ 200 แต้มสะสม</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              แบบประเมินความพึงพอใจการใช้งานห้องสมุดดิจิทัล
            </h1>
            <p className="text-sm sm:text-base text-sky-100 max-w-xl leading-relaxed">
              ขอเชิญชวนทุกท่านร่วมตอบแบบสอบถามเพื่อนำข้อมูลไปพัฒนาปรับปรุงระบบห้องสมุดดิจิทัล พระครูปลัดสุวัฒนโพธิคุณ ให้ดียิ่งขึ้น ตอบเสร็จรับทันที 200 แต้ม!
            </p>
          </div>

          <div className="shrink-0 z-10 flex flex-col items-center">
            <NoviceMascotHero />
            <span className="mt-2 px-3 py-1 rounded-full bg-[#D9A441] text-white text-xs font-black shadow-md">
              🪙 โบนัส +200 แต้ม
            </span>
          </div>
        </div>

        {/* 3 Step Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* STEP 1 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </span>
                {isAuthenticated ? (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 size={12} /> เข้าสู่ระบบแล้ว
                  </span>
                ) : (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <AlertCircle size={12} /> ยังไม่เข้าสู่ระบบ
                  </span>
                )}
              </div>
              <h3 className="text-sm font-bold text-[#073B65] mb-1">
                ตรวจสอบบัญชีสมาชิก
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                ใช้อีเมลเดียวกับที่สมัครสมาชิก เพื่อให้ระบบโอนแต้มเข้าบัญชีของคุณได้ถูกต้อง
              </p>
            </div>

            {isAuthenticated && user ? (
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <div className="font-semibold text-slate-800 truncate">{user.name}</div>
                <div className="flex items-center justify-between text-slate-500 mt-0.5">
                  <span className="truncate text-[11px]">{user.email}</span>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1 text-sky-600 hover:text-sky-800 shrink-0"
                    title="คัดลอกอีเมล"
                  >
                    {copiedEmail ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            ) : (
              <Link
                href="/login?redirect=/survey"
                className="w-full py-2.5 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <LogIn size={14} />
                <span>เข้าสู่ระบบก่อนตอบ</span>
              </Link>
            )}
          </div>

          {/* STEP 2 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-sky-600 text-white font-bold text-xs flex items-center justify-center">
                  2
                </span>
                <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                  Google Forms
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#073B65] mb-1">
                ทำแบบประเมินความพึงพอใจ
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                เปิดทำแบบประเมินบนหน้าต่างใหม่ หรือทำในช่องแบบฟอร์มด้านล่างหน้านี้ได้ทันที
              </p>
            </div>

            <div className="space-y-2">
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
              >
                <span>เปิดแบบประเมิน (หน้าต่างใหม่)</span>
                <ExternalLink size={13} />
              </a>
              <button
                type="button"
                onClick={() => setShowEmbed(!showEmbed)}
                className="w-full py-1.5 text-center text-xs text-slate-500 hover:text-slate-800 font-medium"
              >
                {showEmbed ? '▼ ซ่อนแบบฟอร์มด้านล่าง' : '▲ แสดงแบบฟอร์มในหน้านี้'}
              </button>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="bg-white rounded-2xl p-5 border-2 border-amber-300/80 bg-gradient-to-br from-amber-50/40 to-white shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-7 h-7 rounded-full bg-[#D9A441] text-white font-bold text-xs flex items-center justify-center">
                  3
                </span>
                <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                  รับ 200 แต้ม
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#073B65] mb-1">
                กดยืนยันเพื่อรับคะแนนสะสม
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                เมื่อกด "ส่ง" ใน Google Forms แล้ว ให้กดปุ่มด้านล่างเพื่อรับ 200 แต้มเข้ากระเป๋าทันที
              </p>
            </div>

            {isClaimed ? (
              <div className="py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                <CheckCircle2 size={15} className="text-emerald-600" />
                <span>รับ 200 แต้มเรียบร้อยแล้ว</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleClaimPoints}
                disabled={isClaiming || !isAuthenticated}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D9A441] to-[#b37e22] hover:from-[#c59132] hover:to-[#9f6d1b] disabled:opacity-50 text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
              >
                {isClaiming ? (
                  <span>กำลังบันทึกคะแนน...</span>
                ) : (
                  <>
                    <Coins size={14} className="text-yellow-100" />
                    <span>กดรับ 200 แต้มสะสม 🪙</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

        {/* Claim Status Message */}
        {claimMessage && (
          <div className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-2 ${
            isClaimed 
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}>
            {isClaimed ? <CheckCircle2 size={16} className="text-emerald-600" /> : <AlertCircle size={16} className="text-rose-600" />}
            <span>{claimMessage}</span>
          </div>
        )}

        {/* Embedded Google Form Section */}
        {showEmbed && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="bg-slate-100/80 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span className="font-bold flex items-center gap-2">
                <Eye size={14} className="text-sky-600" />
                <span>แบบฟอร์มประเมินออนไลน์ (Google Forms)</span>
              </span>
              <a
                href={GOOGLE_FORM_URL}
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:text-sky-800 font-semibold flex items-center gap-1"
              >
                <span>เปิดแบบฟอร์มเต็มจอ</span>
                <ExternalLink size={12} />
              </a>
            </div>

            <div className="p-2 sm:p-4 bg-slate-50">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                width="100%"
                height="800"
                className="border-0 rounded-2xl w-full bg-white shadow-inner"
                title="Google Form Survey Embed"
              >
                กำลังโหลดแบบสอบถาม...
              </iframe>
            </div>

            {/* Bottom reminder bar */}
            <div className="bg-amber-50/70 p-4 border-t border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-amber-900 leading-relaxed text-center sm:text-left">
                💡 <strong>อย่าลืม:</strong> เมื่อกดส่งแบบฟอร์มใน Google Forms เรียบร้อยแล้ว อย่าลืมกดปุ่ม <strong>"รับ 200 แต้มสะสม"</strong> ด้านบน
              </div>
              {!isClaimed && isAuthenticated && (
                <button
                  type="button"
                  onClick={handleClaimPoints}
                  disabled={isClaiming}
                  className="px-4 py-2 rounded-xl bg-[#D9A441] hover:bg-[#c59132] text-white text-xs font-bold shrink-0 shadow-xs active:scale-95 cursor-pointer"
                >
                  {isClaiming ? 'กำลังบันทึก...' : 'กดรับ 200 แต้มทันที 🪙'}
                </button>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Celebration Popup */}
      <LazadaRewardPopup
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        data={celebrationData}
        onClaim={() => setShowCelebration(false)}
      />
    </div>
  );
}
