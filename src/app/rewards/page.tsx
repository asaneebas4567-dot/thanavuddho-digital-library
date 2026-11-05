'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Gift, 
  Sparkles, 
  Coins, 
  CheckCircle2, 
  Clock, 
  Truck, 
  AlertCircle, 
  ChevronRight, 
  Filter, 
  Package, 
  BookOpen, 
  Award, 
  History, 
  Flame, 
  Phone, 
  MapPin, 
  User, 
  X,
  ExternalLink
} from 'lucide-react';
import { RewardItem, RewardRedemption } from '@/lib/learningPointsServer';
import { useLearningPoints } from '@/lib/useLearningPoints';
import DailyActivityWidget from '@/components/rewards/DailyActivityWidget';

export default function RewardsShopPage() {
  const {
    availablePoints,
    todayPoints,
    dailyLearningPoints,
    dailyLearningCap,
    isDailyCapReached,
    userEmail,
    userName,
    isLoggedIn,
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
    if (selectedTier === 7000) {
      return rewards.filter(r => r.tier >= 7000);
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
    <div className="min-h-screen bg-[#fafaf9] text-foreground font-sans pb-24">
      {/* 1. Shop Top Header & Points Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-amber-800 via-amber-900 to-amber-950 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8 border-b border-amber-800/40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            
            {/* Title & Tagline */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/25 border border-amber-400/40 text-amber-200 text-xs font-bold mb-3 shadow-inner">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Thanavuddho Learning Points & Rewards Shop</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white">
                ร้านแลกของรางวัลธรรมะ
              </h1>
              <p className="text-xs sm:text-sm text-amber-100/80 mt-1 max-w-xl leading-relaxed">
                สะสมคะแนนจากการอ่านหนังสือ บทความ ดูวิดีโอ และฟังพอดแคสต์ เพื่อนำมาแลกของที่ระลึก พระของขวัญ และหนังสือเล่มจริงฉบับพิเศษ
              </p>
            </div>

            {/* Points Showcase Card */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="p-4 sm:p-5 rounded-3xl bg-black/40 border border-white/20 backdrop-blur-md shadow-2xl flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-200 flex items-center justify-center text-zinc-950 text-2xl font-black shadow-lg shrink-0">
                  🪙
                </div>
                <div>
                  <div className="text-xs text-amber-200 font-semibold">คะแนนสะสมของคุณ</div>
                  <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                    {availablePoints.toLocaleString()} <span className="text-sm font-bold text-amber-300">P</span>
                  </div>
                  <div className="text-[11px] text-amber-200/80">
                    วันนี้ได้รับ: +{todayPoints.toLocaleString()} P (กิจกรรมประจำวัน: {dailyLearningPoints}/{dailyLearningCap} P)
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowDailyModal(true)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <Flame className="w-4 h-4 text-amber-950" />
                  <span>กิจกรรมวันนี้ ({dailyLearningPoints}/100 P)</span>
                  {isDailyCapReached && (
                    <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold">เต็ม</span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab(activeTab === 'catalog' ? 'history' : 'catalog')}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition-all cursor-pointer"
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
                  ? 'bg-amber-600 text-white shadow-sm'
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
                  ? 'bg-amber-600 text-white shadow-sm'
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
            <Coins className="w-4 h-4 text-amber-600" />
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
                { label: '2,500 P (ของที่ระลึกพิเศษ)', val: 2500 },
                { label: '4,000 P (พระของขวัญ)', val: 4000 },
                { label: '5,000 P (หนังสือเล่มจริง)', val: 5000 },
                { label: '7,000 P+ (พรีเมียม / VIP)', val: 7000 },
              ].map(tier => {
                const isSelected = selectedTier === tier.val;
                return (
                  <button
                    key={String(tier.val)}
                    onClick={() => setSelectedTier(tier.val as any)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-500 text-zinc-950 border-amber-500 font-extrabold shadow-sm'
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
                      className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-zinc-200/80 hover:border-amber-400/80 shadow-sm hover:shadow-xl transition-all duration-300"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-[4/3] w-full bg-zinc-100 overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                        {/* Top Badges */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-zinc-950/75 backdrop-blur-md text-amber-300 text-[11px] font-mono font-extrabold border border-amber-400/30 shadow-md">
                            🪙 {item.points.toLocaleString()} P
                          </span>

                          {item.badge && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black shadow-md">
                              {item.badge}
                            </span>
                          )}
                        </div>

                        {/* Stock indicator badge at bottom right of image */}
                        <div className="absolute bottom-2.5 right-3">
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
                          <h3 className="text-base font-extrabold text-foreground group-hover:text-amber-700 transition-colors line-clamp-2 leading-snug">
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
                                <span className="text-amber-700">ขาดอีก {neededPoints.toLocaleString()} P</span>
                                <span className="text-zinc-400 font-mono">{progressPct}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-amber-400 to-amber-600 rounded-full"
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
                              className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-98 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                            >
                              <Gift className="w-4 h-4" />
                              <span>แลกของรางวัลนี้ ({item.points.toLocaleString()} P)</span>
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

        {/* TAB 2: MY REDEMPTIONS HISTORY */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-zinc-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-100 mb-6">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                  ประวัติการแลกของรางวัลของฉัน
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  รายการของที่ระลึกและหนังสือที่ท่านได้ทำการแลกไว้
                </p>
              </div>
              <button
                onClick={() => setActiveTab('catalog')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 cursor-pointer"
              >
                ← กลับไปเลือกของรางวัล
              </button>
            </div>

            {myRedemptions.length === 0 ? (
              <div className="py-16 text-center">
                <Gift className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-700">ยังไม่มีประวัติการแลกรางวัล</h3>
                <p className="text-xs text-zinc-400 mt-1">
                  อ่านหนังสือ ดูวิดีโอ หรือทำเควสธรรมะเพื่อสะสมคะแนนมาแลกรางวัลได้เลย
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="mt-4 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-all cursor-pointer"
                >
                  เลือกดูของรางวัล
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myRedemptions.map((order) => {
                  let statusBadge = (
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold flex items-center gap-1">
                      <Clock size={13} />
                      รอตรวจสอบ
                    </span>
                  );
                  if (order.status === 'approved') {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold flex items-center gap-1">
                        <Package size={13} />
                        อนุมัติแล้ว กำลังจัดเตรียม
                      </span>
                    );
                  } else if (order.status === 'shipped') {
                    statusBadge = (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center gap-1">
                        <Truck size={13} />
                        จัดส่งแล้ว
                      </span>
                    );
                  }

                  return (
                    <div
                      key={order.id}
                      className="p-4 sm:p-5 rounded-2xl border border-zinc-200/80 bg-zinc-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-zinc-200 shrink-0">
                          <Image src={order.rewardImage} alt={order.rewardTitle} fill unoptimized className="object-cover" />
                        </div>
                        <div>
                          <div className="text-[11px] text-zinc-400 font-mono">คำสั่งแลก #{order.id}</div>
                          <h4 className="font-extrabold text-foreground text-sm sm:text-base mt-0.5">
                            {order.rewardTitle}
                          </h4>
                          <div className="text-xs text-amber-700 font-semibold mt-1">
                            หักคะแนน: {order.pointsDeducted.toLocaleString()} P
                          </div>
                          <div className="text-xs text-zinc-500 mt-1">
                            ผู้รับ: {order.recipientName} ({order.recipientPhone})
                          </div>
                          <div className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">
                            ที่อยู่: {order.shippingAddress}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col md:items-end justify-between gap-2 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-zinc-200">
                        {statusBadge}
                        {order.trackingNumber && (
                          <div className="text-xs font-mono font-bold text-zinc-700 bg-white px-2.5 py-1 rounded-lg border border-zinc-200">
                            เลขพัสดุ: {order.trackingNumber}
                          </div>
                        )}
                        <span className="text-[11px] text-zinc-400">
                          วันที่แลก: {new Date(order.createdAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 3. REDEEM CONFIRMATION MODAL */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 border border-amber-200 shadow-2xl relative overflow-hidden">
            
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
                    className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs transition-all cursor-pointer"
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
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0">
                    <Image src={selectedReward.image} alt={selectedReward.title} fill unoptimized className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">ยืนยันการแลกของรางวัล</span>
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
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
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
                      placeholder="เช่น 0812345678"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      ที่อยู่จัดส่งพัสดุอย่างละเอียด <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      placeholder="บ้านเลขที่ หมู่ ซอย ถนน ตำบล/แขวง อำเภอ/เขต จังหวัด รหัสไปรษณีย์"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">
                      หมายเหตุเพิ่มเติม (ถ้ามี)
                    </label>
                    <input
                      type="text"
                      value={orderNote}
                      onChange={(e) => setOrderNote(e.target.value)}
                      placeholder="เช่น ฝากไว้ที่ป้อมยาม หรือช่วงเวลาที่สะดวกรับสาย"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                    />
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedReward(null)}
                    className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-xs transition-all cursor-pointer"
                  >
                    ยกเลิก
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:bg-zinc-300 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Gift size={15} />
                    <span>{isSubmitting ? 'กำลังดำเนินการ...' : `ยืนยันแลก (${selectedReward.points.toLocaleString()} P)`}</span>
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

      {/* 4. DAILY ACTIVITY MODAL */}
      {showDailyModal && (
        <DailyActivityWidget isModal onClose={() => setShowDailyModal(false)} />
      )}

    </div>
  );
}

