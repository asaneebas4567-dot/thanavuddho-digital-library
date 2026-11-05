'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Gift, 
  Package, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle, 
  Search, 
  Plus, 
  Edit3, 
  Save, 
  X, 
  ArrowLeft, 
  TrendingUp, 
  Coins, 
  Users, 
  Filter, 
  ExternalLink 
} from 'lucide-react';
import { RewardItem, RewardRedemption, PointTransaction } from '@/lib/learningPointsServer';

export default function AdminRewardsPage() {
  const [activeTab, setActiveTab] = useState<'rewards' | 'orders' | 'logs'>('orders');
  const [rewards, setRewards] = useState<RewardItem[]>([]);
  const [redemptions, setRedemptions] = useState<RewardRedemption[]>([]);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalPointsInSystem: 0
  });

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'shipped'>('all');

  // Edit / Add Reward Item State
  const [editingItem, setEditingItem] = useState<RewardItem | null>(null);
  const [isNewItem, setIsNewItem] = useState<boolean>(false);
  const [isSavingItem, setIsSavingItem] = useState<boolean>(false);

  // Tracking Number Input state for order
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  const fetchAdminData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/rewards');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setRewards(data.rewards || []);
          setRedemptions(data.redemptions || []);
          setTransactions(data.recentTransactions || []);
          setStats(data.stats || {
            totalItems: 0,
            totalOrders: 0,
            pendingOrders: 0,
            totalPointsInSystem: 0
          });
        }
      }
    } catch (err) {
      console.error('Failed to load admin rewards data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Update order status (Approve / Ship)
  const handleUpdateOrderStatus = async (redemptionId: string, newStatus: 'approved' | 'shipped', trackingNumber?: string) => {
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          redemptionId,
          status: newStatus,
          trackingNumber
        })
      });

      if (res.ok) {
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error updating order:', err);
    }
  };

  // Save edited/new reward item
  const handleSaveRewardItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    setIsSavingItem(true);
    try {
      const res = await fetch('/api/admin/rewards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item: editingItem })
      });

      if (res.ok) {
        setEditingItem(null);
        setIsNewItem(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error('Error saving item:', err);
    } finally {
      setIsSavingItem(false);
    }
  };

  // Filtered Redemptions
  const filteredRedemptions = redemptions.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.recipientName?.toLowerCase().includes(q);
      const matchEmail = r.userEmail?.toLowerCase().includes(q);
      const matchTitle = r.rewardTitle?.toLowerCase().includes(q);
      const matchId = r.id?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchTitle && !matchId) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-foreground font-sans pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 mb-1">
              <Link href="/admin" className="hover:underline flex items-center gap-1">
                <ArrowLeft size={13} />
                แผงควบคุมระบบ (Admin)
              </Link>
              <span>/</span>
              <span>ระบบจัดการคะแนนและของรางวัล</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              จัดการของรางวัลและประวัติการแลก (Admin Rewards)
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              ควบคุมสต็อกของรางวัล อนุมัติการจัดส่ง ตรวจสอบประวัติการแลก และตรวจสอบคะแนนสะสม
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/rewards"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-zinc-200 text-foreground text-xs font-bold hover:bg-zinc-50 shadow-2xs"
            >
              <span>เปิดหน้าร้านค้า Rewards</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-medium">รายการของรางวัล</div>
              <div className="text-2xl font-black text-foreground">{stats.totalItems} รายการ</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0">
              <Clock size={24} />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-medium">รอการตรวจสอบ</div>
              <div className="text-2xl font-black text-rose-600">{stats.pendingOrders} คำสั่ง</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
              <Truck size={24} />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-medium">คำสั่งแลกทั้งหมด</div>
              <div className="text-2xl font-black text-blue-600">{stats.totalOrders} รายการ</div>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-zinc-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Coins size={24} />
            </div>
            <div>
              <div className="text-xs text-zinc-500 font-medium">คะแนนคงค้างในระบบ</div>
              <div className="text-2xl font-black text-emerald-600">{stats.totalPointsInSystem.toLocaleString()} P</div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-zinc-200 pb-2">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Clock size={16} />
            <span>คำสั่งแลกของรางวัล ({redemptions.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('rewards')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'rewards'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Package size={16} />
            <span>จัดการรายการของรางวัล ({rewards.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'logs'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            <Coins size={16} />
            <span>ประวัติการแจกคะแนน ({transactions.length})</span>
          </button>
        </div>

        {/* ==================================================== */}
        {/* TAB 1: ORDERS / REDEMPTIONS MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-zinc-200 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อผู้รับ, อีเมล, รายการรางวัล..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                <span className="text-xs font-bold text-zinc-500 shrink-0">สถานะ:</span>
                {(['all', 'pending', 'approved', 'shipped'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer border ${
                      statusFilter === st
                        ? 'bg-amber-600 text-white border-amber-600 font-bold'
                        : 'bg-white hover:bg-zinc-50 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {st === 'all' && 'ทั้งหมด'}
                    {st === 'pending' && 'รอตรวจสอบ'}
                    {st === 'approved' && 'อนุมัติแล้ว'}
                    {st === 'shipped' && 'จัดส่งแล้ว'}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders Table */}
            {filteredRedemptions.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-3xl border border-zinc-200 p-8">
                <Clock className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <h3 className="font-bold text-zinc-700">ไม่พบคำสั่งแลกของรางวัลตามเงื่อนไข</h3>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-600 font-bold">
                      <tr>
                        <th className="py-3.5 px-4">รหัส / วันที่</th>
                        <th className="py-3.5 px-4">ของรางวัล</th>
                        <th className="py-3.5 px-4">ข้อมูลผู้รับ & ที่อยู่จัดส่ง</th>
                        <th className="py-3.5 px-4">คะแนนที่หัก</th>
                        <th className="py-3.5 px-4">สถานะคำสั่ง</th>
                        <th className="py-3.5 px-4 text-right">ดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {filteredRedemptions.map(order => (
                        <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-zinc-600">
                            <div className="font-bold text-foreground">{order.id}</div>
                            <div className="text-[11px] text-zinc-400">
                              {new Date(order.createdAt).toLocaleDateString('th-TH')}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                                <Image src={order.rewardImage} alt={order.rewardTitle} fill unoptimized className="object-cover" />
                              </div>
                              <span className="font-bold text-foreground leading-tight">{order.rewardTitle}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-foreground">{order.recipientName} ({order.recipientPhone})</div>
                            <div className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">{order.shippingAddress}</div>
                            {order.note && (
                              <div className="text-[10px] text-amber-700 mt-0.5">หมายเหตุ: {order.note}</div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 font-bold text-amber-700">
                            -{order.pointsDeducted.toLocaleString()} P
                          </td>

                          <td className="py-3.5 px-4">
                            {order.status === 'pending' && (
                              <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold">
                                ⏳ รอตรวจสอบ
                              </span>
                            )}
                            {order.status === 'approved' && (
                              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
                                📦 อนุมัติแล้ว
                              </span>
                            )}
                            {order.status === 'shipped' && (
                              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                                🚚 จัดส่งแล้ว
                              </span>
                            )}
                            {order.trackingNumber && (
                              <div className="text-[11px] font-mono font-bold text-zinc-600 mt-1">
                                #{order.trackingNumber}
                              </div>
                            )}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              {order.status === 'pending' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'approved')}
                                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-xs"
                                >
                                  อนุมัติคำสั่ง
                                </button>
                              )}

                              {order.status === 'approved' && (
                                <div className="flex items-center gap-1.5">
                                  <input
                                    type="text"
                                    placeholder="เลขพัสดุ..."
                                    value={trackingInputs[order.id] || ''}
                                    onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                                    className="w-28 px-2 py-1 rounded-lg border border-zinc-300 text-xs focus:outline-none"
                                  />
                                  <button
                                    onClick={() => handleUpdateOrderStatus(order.id, 'shipped', trackingInputs[order.id])}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                                  >
                                    แจ้งจัดส่ง
                                  </button>
                                </div>
                              )}

                              {order.status === 'shipped' && (
                                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                  <CheckCircle2 size={14} /> สำเร็จ
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: REWARDS CATALOG INVENTORY MANAGEMENT */}
        {/* ==================================================== */}
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-foreground text-base">รายการสต็อกและของรางวัลทั้งหมด</h3>
                <p className="text-xs text-muted-foreground">ปรับจำนวนสต็อก คะแนนที่ต้องใช้ หรือเปิด/ปิดการแลกได้ทันที</p>
              </div>

              <button
                onClick={() => {
                  setIsNewItem(true);
                  setEditingItem({
                    id: `rew-${Date.now().toString().slice(-4)}`,
                    title: '',
                    tier: 1000,
                    category: 'souvenir',
                    points: 1000,
                    description: '',
                    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
                    stock: 20,
                    isActive: true,
                    requiresShipping: true
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                <Plus size={16} />
                <span>เพิ่มของรางวัลใหม่</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rewards.map(item => (
                <div key={item.id} className="p-4 rounded-2xl bg-white border border-zinc-200 shadow-xs flex flex-col justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 shrink-0 border border-zinc-200">
                      <Image src={item.image} alt={item.title} fill unoptimized className="object-cover" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono text-zinc-400">ID: {item.id}</span>
                      <h4 className="font-extrabold text-foreground text-sm line-clamp-1">{item.title}</h4>
                      <div className="text-xs font-bold text-amber-700 mt-0.5">
                        🪙 {item.points.toLocaleString()} P
                      </div>
                      <div className="text-xs text-zinc-500 mt-0.5">
                        สต็อกคงเหลือ: <strong>{item.stock}</strong> ชิ้น
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      item.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-400'
                    }`}>
                      {item.isActive ? 'เปิดให้แลก' : 'ปิดชั่วคราว'}
                    </span>

                    <button
                      onClick={() => {
                        setIsNewItem(false);
                        setEditingItem(item);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-semibold cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>แก้ไข</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: POINTS TRANSACTION AUDIT LOGS */}
        {/* ==================================================== */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden p-6">
            <div className="pb-4 border-b border-zinc-100 mb-4">
              <h3 className="font-extrabold text-foreground text-base">บันทึกการเพิ่มและหักคะแนน (Transaction Audit Logs)</h3>
              <p className="text-xs text-muted-foreground">บันทึกกิจกรรมการอ่านหนังสือ บทความ ดูวิดีโอ ฟังพอดแคสต์ และการแลกรางวัลทั้งหมด</p>
            </div>

            <div className="space-y-3">
              {transactions.slice(0, 30).map(tx => (
                <div key={tx.id} className="p-3.5 rounded-xl border border-zinc-100 bg-zinc-50 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-foreground">{tx.title}</div>
                    <div className="text-[11px] text-zinc-500 mt-0.5">
                      ผู้ใช้: <span className="font-mono text-zinc-700">{tx.userEmail}</span> • {new Date(tx.timestamp).toLocaleString('th-TH')}
                    </div>
                  </div>

                  <div className={`font-mono font-black text-sm ${tx.points > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {tx.points > 0 ? `+${tx.points}` : tx.points} P
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit/Add Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="max-w-md w-full bg-white rounded-3xl p-6 border border-zinc-200 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 mb-4">
                <h3 className="font-extrabold text-foreground text-base">
                  {isNewItem ? 'เพิ่มของรางวัลใหม่' : 'แก้ไขข้อมูลของรางวัล'}
                </h3>
                <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-zinc-700">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveRewardItem} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">ชื่อของรางวัล</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">คะแนนที่ต้องใช้ (P)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      max={50000}
                      value={editingItem.points}
                      onChange={(e) => setEditingItem({ ...editingItem, points: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-zinc-700 mb-1">จำนวนสต็อกคงเหลือ</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={editingItem.stock}
                      onChange={(e) => setEditingItem({ ...editingItem, stock: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">URL รูปภาพ</label>
                  <input
                    type="url"
                    required
                    value={editingItem.image}
                    onChange={(e) => setEditingItem({ ...editingItem, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">คำอธิบาย</label>
                  <textarea
                    rows={2}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-zinc-300 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="isActiveToggle"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem({ ...editingItem, isActive: e.target.checked })}
                    className="rounded text-amber-600"
                  />
                  <label htmlFor="isActiveToggle" className="font-semibold text-zinc-700 cursor-pointer">
                    เปิดให้สมาชิกทำการแลกรางวัลนี้ได้
                  </label>
                </div>

                <div className="pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="flex-1 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingItem}
                    className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold flex items-center justify-center gap-1.5"
                  >
                    <Save size={15} />
                    <span>บันทึกข้อมูล</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

