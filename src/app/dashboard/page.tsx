'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  BookOpen, 
  Bookmark, 
  Clock, 
  User as UserIcon, 
  BookMarked, 
  RotateCcw, 
  CheckCircle, 
  Award, 
  Sparkles, 
  AlertCircle,
  FileText,
  Calendar,
  Headphones,
  Video
} from 'lucide-react';
import { users, books } from '@/lib/mock-data';
import { useLoan } from '@/context/LoanContext';
import { useAuth } from '@/context/AuthContext';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { initialBadges } from '@/data/multimediaAndGamificationData';
import { LogIn, LogOut, Lock, Database, ArrowRight, ShieldCheck } from 'lucide-react';

export default function UserDashboard() {
  const { user: authUser, isAuthenticated, logout } = useAuth();
  const { availablePoints } = useLearningPoints();
  const readingHistory = books.slice(0, 2);
  const favorites = books.slice(1, 3);

  const { loans, returnMedia, renewMedia, activeLoanCount, maxLoans } = useLoan();
  const [activeTab, setActiveTab] = useState<'loans' | 'history' | 'achievements'>('loans');
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const activeLoans = loans.filter(l => l.status === 'active');
  const returnedLoans = loans.filter(l => l.status === 'returned');

  const handleReturn = (loanId: string) => {
    returnMedia(loanId);
    setActionFeedback('คืนสื่อเรียบร้อยแล้ว ขอบคุณที่ใช้บริการ');
    setTimeout(() => setActionFeedback(null), 3000);
  };

  const handleRenew = (loanId: string) => {
    const res = renewMedia(loanId);
    setActionFeedback(res.message);
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const calculateDaysLeft = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="bg-slate-50/60 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Banner: Shows Real Logged-in Member or Guest State */}
        {!isAuthenticated || !authUser ? (
          <div className="bg-white rounded-3xl shadow-sm border border-sky-200/80 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-sky-100 to-sky-200 text-sky-800 flex items-center justify-center font-black text-2xl shadow-inner shrink-0">
              <Lock size={32} />
            </div>

            <div className="text-center md:text-left flex-grow">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-2xl font-black text-gray-900">ชั้นหนังสือส่วนบุคคล (Guest)</h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                  ยังไม่ได้เข้าสู่ระบบ
                </span>
              </div>
              <p className="text-gray-600 text-xs sm:text-sm mb-4 max-w-xl">
                เข้าสู่ระบบหรือสมัครสมาชิกห้องสมุด เพื่อดูรายการหนังสือที่ยืม คืนสื่อ บันทึกประวัติการอ่าน และสะสมแต้มคะแนนการเรียนรู้
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              <Link 
                href="/login?redirect=/dashboard"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <LogIn size={16} />
                <span>เข้าสู่ระบบ / สมัครสมาชิก</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
            <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-4 ring-sky-50 shrink-0 shadow-md bg-sky-500 text-white flex items-center justify-center font-black text-2xl">
              {authUser.picture ? (
                <Image src={authUser.picture} alt={authUser.name} fill className="object-cover" unoptimized />
              ) : (
                <span>{authUser.name?.slice(0, 2).toUpperCase() || 'TH'}</span>
              )}
            </div>

            <div className="text-center md:text-left flex-grow min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                <h1 className="text-2xl font-bold text-gray-900 truncate">{authUser.name}</h1>
                {authUser.role === 'admin' || authUser.email === 'asaneebas4567@gmail.com' || authUser.email === 'thanavuddho.dhamma@gmail.com' ? (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-xs font-black shadow-xs">
                    <ShieldCheck size={13} /> ผู้ดูแลระบบ (Admin)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold shadow-xs">
                    <Sparkles size={12} /> สมาชิกห้องสมุด
                  </span>
                )}
              </div>
              <p className="text-gray-500 text-sm mb-4 truncate">{authUser.email}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-sky-50 text-sky-900 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border border-sky-200/60">
                  <span className="text-[10px] text-sky-700">รหัสสมาชิก:</span>
                  <span className="font-mono text-sky-950 font-black">{authUser.memberCardId || '69001'}</span>
                </div>
                <div className="bg-sky-50 text-sky-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-sky-200/60">
                  <BookMarked size={14} className="text-sky-600" />
                  <span>ยืมสื่ออยู่: {activeLoanCount} / {maxLoans} ชิ้น</span>
                </div>
                <div className="bg-purple-50 text-purple-800 px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-purple-200/60">
                  <Award size={14} className="text-purple-600" />
                  <span>คะแนนสะสม: {availablePoints.toLocaleString()} P</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 shrink-0">
              {(authUser.role === 'admin' || authUser.email === 'asaneebas4567@gmail.com' || authUser.email === 'thanavuddho.dhamma@gmail.com') && (
                <Link
                  href="/admin/database"
                  className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer"
                  title="จัดการฐานข้อมูลและสารสนเทศ"
                >
                  <Database size={15} />
                  <span>ศูนย์จัดการฐานข้อมูล</span>
                </Link>
              )}
              <Link 
                href="/rewards"
                className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer"
              >
                <span>🎁 ร้านแลกรางวัล</span>
              </Link>

              <button
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <LogOut size={15} />
                <span>ออกจากระบบ</span>
              </button>
            </div>
          </div>
        )}

        {/* Admin Access Panel Banner */}
        {isAuthenticated && authUser && (authUser.role === 'admin' || authUser.email === 'asaneebas4567@gmail.com' || authUser.email === 'thanavuddho.dhamma@gmail.com') && (
          <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 rounded-3xl p-6 mb-8 text-white shadow-lg border border-emerald-600/70 flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in">
            <div className="flex items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white/10 text-emerald-300 border border-white/10 shrink-0">
                <Database size={26} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black text-base sm:text-lg">สิทธิ์ผู้ดูแลระบบ (Admin Database & Media Center)</h3>
                  <span className="text-[10px] bg-emerald-400 text-slate-950 font-black px-2.5 py-0.5 rounded-full uppercase">
                    Admin Access
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-emerald-100/90 max-w-2xl leading-relaxed">
                  บัญชีนี้มีสิทธิ์ระดับผู้ดูแลระบบ สามารถตรวจสอบ Entity ตารางฐานข้อมูล เพิ่มหนังสือ นำเข้า PDF สกัดปก และจัดการของรางวัลได้
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <Link
                href="/admin/database"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs hover:bg-emerald-50 transition-all shadow-md active:scale-95"
              >
                <Database size={15} className="text-emerald-700" />
                <span>เปิดศูนย์จัดการฐานข้อมูล</span>
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all border border-emerald-500/60 active:scale-95"
              >
                <span>หน้าแดชบอร์ดแอดมิน</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* Global Feedback notification */}
        {actionFeedback && (
          <div className="mb-6 p-4 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 text-sm font-semibold flex items-center gap-3 shadow-md animate-in fade-in">
            <AlertCircle size={20} className="text-sky-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Navigation Tabs for Dashboard */}
        <div className="flex items-center gap-3 mb-8 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab('loans')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'loans' 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <BookMarked size={16} />
            <span>ระบบยืม-คืนสื่อ ({activeLoanCount})</span>
          </button>

          <button
            onClick={() => setActiveTab('achievements')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'achievements' 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Award size={16} />
            <span>เหรียญรางวัล & เกมมิฟิเคชัน</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'history' 
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Clock size={16} />
            <span>ประวัติการอ่าน & รายการโปรด</span>
          </button>
        </div>

        {/* TAB 1: ระบบยืม-คืนสื่อดิจิทัล (Digital Media Loan System) */}
        {activeTab === 'loans' && (
          <div className="space-y-8">
            
            {/* Active Borrowed Media Section */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-gray-100 gap-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <BookMarked className="text-sky-600" size={22} />
                    รายการสื่อที่กำลังยืมอยู่ (Active Loans)
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    สมาชิกสามารถยืมสื่อได้สูงสุด {maxLoans} รายการ (ระยะเวลายืม 14 วันต่อรายการ)
                  </p>
                </div>
                <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-sky-50 text-sky-800 border border-sky-200/80 self-start sm:self-auto">
                  สิทธิ์การยืมคงเหลือ: <span className="font-bold text-sky-700">{maxLoans - activeLoanCount}</span> รายการ
                </div>
              </div>

              {activeLoans.length === 0 ? (
                <div className="text-center py-12 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
                  <BookMarked size={40} className="text-gray-300 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-700 text-base mb-1">ยังไม่มีสื่อที่ยืมอยู่ในขณะนี้</h4>
                  <p className="text-xs text-gray-500 mb-4 max-w-sm mx-auto">
                    ท่านสามารถเลือกยืมหนังสือธรรมะ, หนังสือเสียง หรือบรรยายธรรม เพื่อศึกษาได้ตลอด 14 วัน
                  </p>
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold hover:bg-sky-700 transition-colors"
                  >
                    ไปที่ห้องสมุดดิจิทัล
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeLoans.map(loan => {
                    const daysLeft = calculateDaysLeft(loan.due_date);
                    const isUrgent = daysLeft <= 3;
                    return (
                      <div 
                        key={loan.id}
                        className="p-5 rounded-2xl border border-gray-100 bg-white shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex gap-4 mb-4">
                          <div className="relative w-20 aspect-[3/4] rounded-xl overflow-hidden shrink-0 shadow-sm bg-gray-100">
                            <Image src={loan.media_cover} alt={loan.media_title} fill className="object-cover" unoptimized />
                          </div>
                          <div className="min-w-0 flex-grow">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                                {loan.media_type === 'audiobook' ? 'หนังสือเสียง' : loan.media_type === 'book' ? 'หนังสือธรรมะ' : 'สื่อการเรียนรู้'}
                              </span>
                              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                                isUrgent ? 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse' : 'bg-emerald-50 text-emerald-700'
                              }`}>
                                เหลืออีก {daysLeft} วัน
                              </span>
                            </div>

                            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 mb-2">
                              {loan.media_title}
                            </h3>

                            <div className="text-[11px] text-gray-400 space-y-0.5">
                              <div>ยืมเมื่อ: {new Date(loan.borrowed_at).toLocaleDateString('th-TH')}</div>
                              <div>กำหนดส่ง: <span className="font-semibold text-gray-700">{new Date(loan.due_date).toLocaleDateString('th-TH')}</span></div>
                            </div>
                          </div>
                        </div>

                        {/* Loan Action Buttons */}
                        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                          {loan.media_type === 'book' ? (
                            <Link
                              href={`/reader/${loan.media_id}`}
                              className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
                            >
                              <BookOpen size={14} /> อ่านออนไลน์
                            </Link>
                          ) : (
                            <Link
                              href="/audios"
                              className="flex-1 py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
                            >
                              <Headphones size={14} /> ฟังตอนนี้
                            </Link>
                          )}

                          <button
                            onClick={() => handleRenew(loan.id)}
                            disabled={loan.renewal_count >= 1}
                            className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1 ${
                              loan.renewal_count >= 1 
                                ? 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed' 
                                : 'bg-white border-sky-300 text-sky-800 hover:bg-sky-50 cursor-pointer'
                            }`}
                            title={loan.renewal_count >= 1 ? 'ต่ออายุครบจำนวนครั้งแล้ว' : 'ขยายเวลายืมอีก 7 วัน'}
                          >
                            <RotateCcw size={13} />
                            <span>ต่ออายุ (+7 วัน)</span>
                          </button>

                          <button
                            onClick={() => handleReturn(loan.id)}
                            className="py-2 px-3 rounded-xl bg-gray-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-transparent text-gray-700 text-xs font-semibold transition-all cursor-pointer"
                          >
                            คืนสื่อ
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Loan Return History */}
            {returnedLoans.length > 0 && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
                <h3 className="font-bold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Clock className="text-gray-400" size={18} />
                  ประวัติการยืม-คืนสื่อที่ผ่านมา (Loan History)
                </h3>
                <div className="space-y-3">
                  {returnedLoans.map(loan => (
                    <div key={loan.id} className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm truncate">{loan.media_title}</h4>
                          <p className="text-xs text-gray-400">
                            คืนเมื่อ: {loan.returned_at ? new Date(loan.returned_at).toLocaleDateString('th-TH') : '-'}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full shrink-0">
                        คืนแล้ว
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 2: เหรียญรางวัล & เกมมิฟิเคชัน (Gamification & Badges) */}
        {activeTab === 'achievements' && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 pb-4 border-b border-gray-100 gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Award className="text-sky-600" size={22} />
                    เหรียญตราความสำเร็จและการเรียนรู้ (Gamification Badges)
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    สะสมเหรียญรางวัลจากการผ่านแบบทดสอบความเข้าใจทั้ง 4 ระดับ
                  </p>
                </div>
                <Link
                  href="/quiz"
                  className="px-5 py-2.5 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-700 transition-colors shadow-sm self-start sm:self-auto"
                >
                  เข้าสู่ศูนย์แบบทดสอบ (Quiz Center)
                </Link>
              </div>

              {/* Badges Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {initialBadges.map(badge => (
                  <div 
                    key={badge.id}
                    className={`p-6 rounded-2xl border text-center flex flex-col items-center justify-between transition-all ${
                      badge.earned 
                        ? 'bg-sky-50/50 border-sky-200 shadow-sm' 
                        : 'bg-gray-50/60 border-gray-200 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="w-16 h-16 rounded-full bg-white shadow-md flex items-center justify-center text-3xl mb-4 mx-auto ring-4 ring-sky-100">
                        {badge.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{badge.name}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">{badge.description}</p>
                    </div>

                    <div className="w-full pt-3 border-t border-gray-100">
                      {badge.earned ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                          <CheckCircle size={12} /> ปลดล็อกแล้ว ({badge.earned_date})
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-gray-400">
                          ยังไม่ปลดล็อก (ต้องผ่าน Quiz)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ประวัติการอ่านและรายการโปรด */}
        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Clock className="text-sky-600" size={20} /> ประวัติการอ่านล่าสุด
                </h3>
                <div className="space-y-4">
                  {readingHistory.map(b => (
                    <Link key={b.id} href={`/books/${b.id}`} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100">
                      <div className="w-16 aspect-[3/4] relative rounded-lg overflow-hidden shrink-0 shadow-xs">
                        <Image src={b.cover} alt={b.title} fill className="object-cover" unoptimized />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm line-clamp-1">{b.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">อ่านล่าสุดเมื่อ 2 วันที่แล้ว</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Bookmark className="text-sky-600" size={20} /> รายการโปรด
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {favorites.map(b => (
                  <Link key={b.id} href={`/books/${b.id}`} className="group">
                    <div className="aspect-[3/4] relative rounded-xl overflow-hidden shadow-xs mb-2">
                      <Image src={b.cover} alt={b.title} fill className="object-cover group-hover:scale-105 transition-transform" unoptimized />
                    </div>
                    <h5 className="font-semibold text-xs text-gray-900 line-clamp-1 group-hover:text-sky-600">{b.title}</h5>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
