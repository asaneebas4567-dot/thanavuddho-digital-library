'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  AlertCircle, 
  Filter, 
  Package, 
  History, 
  Flame, 
  X,
  BookOpen
} from 'lucide-react';
import { RewardItem, RewardRedemption } from '@/lib/learningPointsServer';
import { useLearningPoints } from '@/lib/useLearningPoints';
import DailyActivityWidget from '@/components/rewards/DailyActivityWidget';

// Visual Mockup Component for Rewards Cards
function RewardCardVisual({ item }: { item: RewardItem }) {
  // Case 1: Boxset (3 Overlapping books in 3D perspective)
  if (item.isBoxset || item.id === 'rew-10001') {
    return (
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-[#073B65] via-[#0B4E85] to-[#079FE8] p-3 overflow-hidden flex items-center justify-center select-none group border-b border-sky-300/40">
        {/* Golden radial background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(217,164,65,0.35)_0%,transparent_70%)] pointer-events-none" />
        
        {/* Overlapping 3-Book Stack ("ทำ 3 เล่มมาทับๆกัน ขอให้เห็นภาพ") */}
        <div className="relative w-52 h-36 flex items-center justify-center">
          {/* Left Book: ทำใจให้พร้อมบวก (-14deg) */}
          <div className="absolute left-2.5 bottom-2 w-20 aspect-[3/4.2] rounded-md shadow-2xl -rotate-14 border border-white/50 overflow-hidden transform group-hover:-translate-x-2 transition-transform duration-300">
            <Image
              src="/images/books/tam-jai-hai-prom-buak.jpg"
              alt="ทำใจให้พร้อมบวก"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/40 to-transparent z-10" />
          </div>

          {/* Right Book: สมดุลเท่ากับดี (+14deg) */}
          <div className="absolute right-2.5 bottom-2 w-20 aspect-[3/4.2] rounded-md shadow-2xl rotate-14 border border-white/50 overflow-hidden transform group-hover:translate-x-2 transition-transform duration-300">
            <Image
              src="/images/books/สมดุลเท่ากับดี.jpg"
              alt="สมดุลเท่ากับดี"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/40 to-transparent z-10" />
          </div>

          {/* Center Front Book: อย่ามโน (raised upright) */}
          <div className="relative z-10 w-22 aspect-[3/4.2] rounded-lg shadow-[0_14px_30px_rgba(0,0,0,0.55)] border-2 border-[#D9A441] overflow-hidden transform group-hover:scale-106 transition-transform duration-300">
            <Image
              src="/images/books/อย่ามโน.jpg"
              alt="อย่ามโน"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/40 via-white/20 to-transparent z-10" />
            <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/80 z-10" />
            <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-[#D9A441] text-white text-[8px] font-black shadow-xs tracking-wider">
              BOXSET
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Case 2: Books (Single Book or Signed Book) - Upright real cover on pastel backdrop with 3D spine
  if (item.isBookCover || item.category === 'book' || item.category === 'signed_book') {
    const pastelThemes: Record<string, string> = {
      rose: 'bg-rose-50/80 border-b border-rose-200/80',
      mint: 'bg-emerald-50/80 border-b border-emerald-200/80',
      sky: 'bg-sky-50/80 border-b border-sky-200/80',
      orange: 'bg-orange-50/80 border-b border-orange-200/80',
      teal: 'bg-teal-50/80 border-b border-teal-200/80',
      indigo: 'bg-indigo-50/80 border-b border-indigo-200/80',
      cream: 'bg-amber-50/70 border-b border-amber-200/80',
    };
    const pastelClass = pastelThemes[item.pastelTheme || 'sky'] || pastelThemes.sky;

    return (
      <div className={`relative aspect-[4/3] w-full ${pastelClass} p-3 overflow-hidden flex items-center justify-center select-none`}>
        {/* Ambient background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.65)_0%,transparent_75%)] pointer-events-none" />

        {/* Upright 3D Book */}
        <div className="relative w-22 sm:w-24 aspect-[3/4.2] rounded-lg overflow-hidden shadow-[2px_6px_18px_rgba(0,0,0,0.18)] border border-slate-200/90 group-hover:scale-105 group-hover:shadow-[3px_8px_24px_rgba(0,0,0,0.22)] transition-all duration-300">
          {/* 3D Spine Shading */}
          <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/30 via-white/20 to-transparent pointer-events-none z-10" />
          {/* Right Edge Page-stack */}
          <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/80 pointer-events-none z-10" />
          <Image
            src={item.bookCover || item.image}
            alt={item.title}
            fill
            className="object-cover"
            unoptimized
          />
          {item.category === 'signed_book' && (
            <div className="absolute bottom-1 inset-x-1 py-0.5 rounded bg-amber-500/95 text-white text-[8px] font-black text-center shadow-xs">
              พร้อมลายเซ็นแท้ ✍️
            </div>
          )}
        </div>
      </div>
    );
  }

  // Case 3: Simulated Clean Product Visuals (Custom Designed Local Mockups)
  return (
    <div className="relative aspect-[4/3] w-full bg-slate-900/5 overflow-hidden border-b border-zinc-200/80 select-none group">
      <Image
        src={item.image}
        alt={item.title}
        fill
        unoptimized
        className="object-cover group-hover:scale-104 transition-transform duration-300"
      />
    </div>
  );
}

export default function RewardsShopPage() {
  const {
    availablePoints,
    todayPoints,
    dailyLearningPoints,
    dailyLearningCap,
    isDailyCapReached,
    userEmail,
    userName,
    refreshPoints
  } = useLearningPoints();

  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [myRedemptions, setMyRedemptions] = useState<RewardRedemption[]>([]);
  const [activeTab, setActiveTab] = useState<'catalog' | 'history'>('catalog');
  const [selectedTier, setSelectedTier] = useState<number | 'all'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Daily Activity Modal state
  const [showDailyModal, setShowDailyModal] = useState<boolean>(false);

  // Redemption Form Modal state
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [orderNote, setOrderNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successRedemption, setSuccessRedemption] = useState<RewardRedemption | null>(null);

  // Fetch catalog & user redemptions
  const fetchShopData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/rewards');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRewards(data.rewards || []);
        }
      }

      if (userEmail) {
        const myRes = await fetch(`/api/rewards/my-redemptions?email=${encodeURIComponent(userEmail)}`);
        if (myRes.ok) {
          const myData = await myRes.json();
          if (myData.success) {
            setMyRedemptions(myData.redemptions || []);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching rewards shop data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShopData();
  }, [userEmail]);

  // Filter rewards by Tier
  const filteredRewards = useMemo(() => {
    if (selectedTier === 'all') return rewards;
    if (selectedTier === 1000) {
      return rewards.filter(r => r.points <= 1000);
    }
    if (selectedTier === 2500) {
      return rewards.filter(r => r.points > 1000 && r.points <= 3500);
    }
    if (selectedTier === 5000) {
      return rewards.filter(r => r.points >= 4000 && r.points <= 5500);
    }
    if (selectedTier === 7000) {
      return rewards.filter(r => r.points >= 7000 && r.points <= 8500);
    }
    if (selectedTier === 10000) {
      return rewards.filter(r => r.points >= 10000);
    }
    return rewards.filter(r => r.tier === selectedTier);
  }, [rewards, selectedTier]);

  // Open redemption modal
  const handleOpenRedeemModal = (item: RewardItem) => {
    setSelectedReward(item);
    setSubmitError(null);
    setSuccessRedemption(null);
    setRecipientName(userName || '');
  };

  // Submit redemption
  const handleSubmitRedemption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReward) return;

    if (!recipientName.trim() || !recipientPhone.trim() || !shippingAddress.trim()) {
      setSubmitError('กรุณากรอกชื่อผู้รับ เบอร์โทรศัพท์ และที่อยู่จัดส่งให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch('/api/rewards/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userEmail,
          rewardId: selectedReward.id,
          recipientName: recipientName.trim(),
          recipientPhone: recipientPhone.trim(),
          shippingAddress: shippingAddress.trim(),
          note: orderNote.trim()
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setSubmitError(data.message || 'ไม่สามารถแลกของรางวัลได้');
      } else {
        setSuccessRedemption(data.redemption);
        refreshPoints();
        fetchShopData();
      }
    } catch (err: any) {
      setSubmitError(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F8FD]/50 text-[#243447] font-sans pb-24">
      {/* 1. Shop Top Header & Points Banner (Deep Navy to Primary Blue Gradient) */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-[#073B65]/40 shadow-md">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            
            {/* Title & Description */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-white text-xs font-bold mb-3 shadow-inner">
                <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                <span>Thanavuddho Learning Points & Rewards Shop</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                ร้านแลกของรางวัลธรรมะ
              </h1>
              <p className="text-xs sm:text-sm text-sky-100/90 mt-1 max-w-xl leading-relaxed">
                สะสมคะแนนจากการอ่านหนังสือ ข้อคิดธรรมะ ดูวิดีโอ และฟังพอดแคสต์ เพื่อนำมาแลกของที่ระลึก หนังสือเล่มจริงฉบับพิเศษ และ Boxset ทางปัญญา
              </p>
            </div>

            {/* Points Showcase Card with Accent Gold */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="p-4 sm:p-5 rounded-3xl bg-black/35 border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#D9A441] via-[#FDF6E9] to-[#B88328] flex items-center justify-center text-2xl font-black shadow-lg shrink-0">
                  🪙
                </div>
                <div>
                  <div className="text-xs text-sky-200 font-semibold">คะแนนสะสมของคุณ</div>
                  <div className="text-2xl sm:text-3xl font-black text-[#D9A441] tracking-tight">
                    {availablePoints.toLocaleString()} <span className="text-sm font-bold text-white/80">P</span>
                  </div>
                  <div className="text-[11px] text-sky-200/90">
                    วันนี้ได้รับ: +{todayPoints.toLocaleString()} P (กิจกรรมประจำวัน: {dailyLearningPoints}/{dailyLearningCap} P)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowDailyModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white text-[#073B65] font-extrabold text-xs shadow-md hover:bg-sky-50 transition-all cursor-pointer active:scale-95"
                >
                  <Flame className="w-4 h-4 text-[#D9A441]" />
                  <span>กิจกรรมวันนี้ ({dailyLearningPoints}/100 P)</span>
                  {isDailyCapReached && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">เต็ม</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab(activeTab === 'catalog' ? 'history' : 'catalog')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>{activeTab === 'catalog' ? `ประวัติการแลก (${myRedemptions.length})` : 'กลับไปหน้าร้านค้า'}</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        
        {/* Navigation Tabs (Catalog vs My Orders) */}
        <div className="flex items-center justify-between gap-4 bg-white rounded-2xl p-2 border border-zinc-200 shadow-md mb-6">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'catalog'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>รายการของรางวัลทั้งหมด ({rewards.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'history'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
              }`}
            >
              <History className="w-4 h-4" />
              <span>ประวัติการแลกของฉัน</span>
              {myRedemptions.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px]">
                  {myRedemptions.length}
                </span>
              )}
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground font-medium pr-2">
            <Coins className="w-4 h-4 text-sky-600" />
            <span>คะแนนไม่มีวันหมดอายุ • แลกได้ไม่จำกัดจำนวนครั้ง</span>
          </div>
        </div>

        {/* TAB 1: REWARDS CATALOG */}
        {activeTab === 'catalog' && (
          <div>
            {/* Tier Filters Filter Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-thin">
              <span className="text-xs font-bold text-zinc-500 flex items-center gap-1 pl-1 shrink-0">
                <Filter className="w-3.5 h-3.5" />
                ระดับคะแนน:
              </span>

              {[
                { label: 'ทั้งหมด', val: 'all' },
                { label: '1,000 P (ของที่ระลึก)', val: 1000 },
                { label: '2,500 P (ของใช้พรีเมียม)', val: 2500 },
                { label: '4,500 - 5,000 P (หนังสือเล่มจริง)', val: 5000 },
                { label: '7,000 P+ (พร้อมลายเซ็นแท้ ✍️)', val: 7000 },
                { label: '10,000 P+ (Boxset & Power Bank)', val: 10000 },
              ].map(tier => {
                const isSelected = selectedTier === tier.val;
                return (
                  <button
                    key={String(tier.val)}
                    onClick={() => setSelectedTier(tier.val as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 font-extrabold shadow-sm'
                        : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {tier.label}
                  </button>
                );
              })}
            </div>

            {/* Grid of Reward Cards */}
            {isLoading ? (
              <div className="py-20 text-center text-sm text-zinc-400">
                กำลังโหลดรายการของรางวัล...
              </div>
            ) : filteredRewards.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-zinc-200 p-8">
                <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-700">ไม่พบของรางวัลในระดับคะแนนนี้</h3>
                <p className="text-xs text-zinc-400 mt-1">กรุณาเลือกตัวกรองระดับคะแนนอื่น</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRewards.map((item) => {
                  const canAfford = availablePoints >= item.points;
                  const neededPoints = Math.max(0, item.points - availablePoints);
                  const progressPct = Math.min(100, Math.floor((availablePoints / item.points) * 100));
                  const isOutOfStock = item.stock <= 0;

                  return (
                    <div
                      key={item.id}
                      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-zinc-200/80 hover:border-sky-400/80 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Product Visual Container (Custom Boxset / Pastel Book / Clean Product Mockup) */}
                      <div className="relative">
                        <RewardCardVisual item={item} />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none z-20">
                          <span className="px-2.5 py-1 rounded-full bg-zinc-950/85 backdrop-blur-md text-[#D9A441] text-[11px] font-mono font-extrabold border border-[#D9A441]/40 shadow-md">
                            🪙 {item.points.toLocaleString()} P
                          </span>

                          {item.badge && (
                            <span className="px-2.5 py-1 rounded-full bg-[#D9A441] text-white text-[10px] font-black shadow-md">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Stock indicator badge at bottom right */}
                        <div className="absolute bottom-2.5 right-3 pointer-events-none z-20">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold backdrop-blur-md ${
                            isOutOfStock 
                              ? 'bg-rose-950/80 text-rose-300 border border-rose-500/40' 
                              : 'bg-black/60 text-zinc-200 border border-white/20'
                          }`}>
                            {isOutOfStock ? 'สินค้าหมด' : `คงเหลือ ${item.stock} ชิ้น`}
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between gap-4">
                        <div>
                          <h3 className="text-base font-extrabold text-foreground group-hover:text-sky-700 transition-colors line-clamp-2 leading-snug">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5 leading-relaxed font-normal">
                            {item.description}
                          </p>
                        </div>

                        {/* Points Progress / Redeem Button Area */}
                        <div className="pt-3 border-t border-zinc-100 flex flex-col gap-2.5">
                          {!canAfford ? (
                            /* Progress bar showing deficit */
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between text-[11px] font-semibold">
                                <span className="text-sky-700">ขาดอีก {neededPoints.toLocaleString()} P</span>
                                <span className="text-zinc-400 font-mono">{progressPct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full"
                                  style={{ width: `${progressPct}%` }}
                                />
                              </div>
                              <button
                                disabled
                                className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-400 font-bold text-xs cursor-not-allowed"
                              >
                                คะแนนยังไม่เพียงพอ
                              </button>
                            </div>
                          ) : isOutOfStock ? (
                            <button
                              disabled
                              className="w-full py-2.5 rounded-xl bg-zinc-100 text-zinc-400 font-bold text-xs cursor-not-allowed"
                            >
                              ของรางวัลหมดชั่วคราว
                            </button>
                          ) : (
                            <button
                              onClick={() => handleOpenRedeemModal(item)}
                              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#D9A441] via-amber-500 to-[#B88328] hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                            >
                              <Gift className="w-4 h-4 text-yellow-100" />
                              <span>แลกของรางวัลชิ้นนี้</span>
                            </button>
                          )}
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MY REDEMPTION HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
            <h2 className="text-lg font-extrabold text-foreground mb-4 flex items-center gap-2">
              <History className="w-5 h-5 text-sky-600" />
              <span>ประวัติการแลกของรางวัลของคุณ</span>
            </h2>

            {myRedemptions.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-700">ยังไม่มีประวัติการแลกของรางวัล</h3>
                <p className="text-xs text-zinc-400 mt-1 mb-5">
                  ร่วมกิจกรรมศึกษาธรรมะ สะสมแต้มบุญ แล้วนำมาแลกของรางวัลที่ระลึกได้ที่นี่
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors"
                >
                  สำรวจรายการของรางวัล
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRedemptions.map((red) => (
                  <div
                    key={red.id}
                    className="p-4 sm:p-5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-sky-700">{red.id}</span>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                          red.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          red.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                          red.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {red.status === 'shipped' ? 'กำลังจัดส่ง' :
                           red.status === 'approved' ? 'อนุมัติแล้ว' :
                           red.status === 'cancelled' ? 'ยกเลิก' : 'รอดำเนินการ'}
                        </span>
                      </div>
                      <h4 className="font-extrabold text-sm text-foreground">{red.rewardTitle}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        ผู้รับ: {red.recipientName} ({red.recipientPhone}) • ที่อยู่: {red.shippingAddress}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-black text-amber-600 text-sm">
                        -{red.pointsDeducted.toLocaleString()} P
                      </div>
                      <div className="text-[10px] text-zinc-400">
                        {new Date(red.createdAt).toLocaleDateString('th-TH')}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. REDEEM CONFIRMATION MODAL */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-2xl relative overflow-hidden">
            
            <button
              onClick={() => setSelectedReward(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {successRedemption ? (
              /* Success State */
              <div className="text-center py-4 space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-3xl shadow-inner animate-bounce">
                  ✓
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-foreground">แลกของรางวัลสำเร็จแล้ว!</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                    ระบบได้ทำการบันทึกและหักคะแนน {successRedemption.pointsDeducted.toLocaleString()} P เรียบร้อยแล้ว
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 text-left text-xs space-y-1.5">
                  <div><strong>รายการ:</strong> {successRedemption.rewardTitle}</div>
                  <div><strong>ผู้รับ:</strong> {successRedemption.recipientName} ({successRedemption.recipientPhone})</div>
                  <div><strong>ที่อยู่จัดส่ง:</strong> {successRedemption.shippingAddress}</div>
                  <div><strong>รหัสคำสั่งแลก:</strong> <span className="font-mono">{successRedemption.id}</span></div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={() => {
                      setSelectedReward(null);
                      setActiveTab('history');
                    }}
                    className="flex-1 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs transition-all cursor-pointer"
                  >
                    ดูประวัติการแลกของฉัน
                  </button>
                  <button
                    onClick={() => setSelectedReward(null)}
                    className="px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              </div>
            ) : (
              /* Input Form */
              <form onSubmit={handleSubmitRedemption} className="space-y-4">
                <div className="flex items-start gap-4 pb-3 border-b border-zinc-100">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                    <Image 
                      src={selectedReward.bookCover || selectedReward.image} 
                      alt={selectedReward.title} 
                      fill 
                      unoptimized 
                      className="object-cover" 
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">ยืนยันการแลกของรางวัล</span>
                    <h3 className="font-extrabold text-foreground text-sm sm:text-base leading-snug">
                      {selectedReward.title}
                    </h3>
                    <div className="text-xs font-bold text-amber-600 mt-1">
                      ใช้คะแนน: {selectedReward.points.toLocaleString()} P (คงเหลือหลังแลก: {(availablePoints - selectedReward.points).toLocaleString()} P)
                    </div>
                  </div>
                </div>

                {submitError && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      ชื่อ-นามสกุล ผู้รับ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={recipientName}
                      onChange={(e) => setRecipientName(e.target.value)}
                      placeholder="เช่น สมชาย ใจดี"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      เบอร์โทรศัพท์สำหรับติดต่อส่งของ <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={recipientPhone}
                      onChange={(e) => setRecipientPhone(e.target.value)}
                      placeholder="เช่น 081-234-5678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      ที่อยู่ในการจัดส่งพัสดุ (พร้อมรหัสไปรษณีย์) <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="บ้านเลขที่, หมู่, ซอย, ถนน, ตำบล/แขวง, อำเภอ/เขต, จังหวัด, รหัสไปรษณีย์"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-zinc-600 mb-1">
                      ข้อความเพิ่มเติมถึงผู้จัดส่ง (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="เช่น ฝากไว้ที่ป้อมยาม, โทรแจ้งก่อนส่ง"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#D9A441] via-amber-500 to-[#B88328] hover:from-amber-600 hover:to-amber-700 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'กำลังบันทึกข้อมูล...' : `ยืนยันการแลก (-${selectedReward.points.toLocaleString()} P)`}
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 4. DAILY ACTIVITY PROGRESS MODAL */}
      {showDailyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-8 border border-sky-200 shadow-2xl relative">
            <button
              onClick={() => setShowDailyModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <DailyActivityWidget />

            <div className="mt-4 text-center">
              <button
                onClick={() => setShowDailyModal(false)}
                className="px-6 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition-all cursor-pointer"
              >
                เข้าใจแล้ว ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
