'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLoan } from '@/context/LoanContext';
import { useAuth } from '@/context/AuthContext';
import { 
  BookMarked, 
  BookOpen, 
  RotateCcw, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Lock,
  Layers,
  Sparkles,
  Calendar
} from 'lucide-react';

export default function LoansPage() {
  const { activeLoans, loans, returnMedia, renewMedia, activeLoanCount, maxLoans } = useLoan();
  const { user, isAuthenticated } = useAuth();
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const returnedLoans = loans.filter(l => l.status === 'returned');

  const handleReturn = (loanId: string, title: string) => {
    returnMedia(loanId);
    setIsError(false);
    setFeedback(`คืนหนังสือ "${title}" เรียบร้อยแล้ว (เพิ่มโควตายืมว่าง 1 เล่ม)`);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleRenew = (loanId: string) => {
    const res = renewMedia(loanId);
    setIsError(!res.success);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3500);
  };

  const calculateDaysLeft = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const slots = [0, 1, 2];

  return (
    <div className="min-h-screen bg-[#F0F8FD]/50 py-8 sm:py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#64748B] mb-4">
          <Link href="/" className="hover:text-[#079FE8] transition-colors">หน้าแรก</Link>
          <span>/</span>
          <span className="text-[#073B65] font-semibold">ชั้นหนังสือที่ยืมไว้</span>
        </div>

        {/* Hero Banner: Title & Quota Overview */}
        <div className="bg-white rounded-3xl border border-[#DCEAF3] p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#EBF7FD] text-[#079FE8] border border-[#C5E7FA]">
                <ShieldCheck size={14} />
                <span>ระบบคุ้มครองลิขสิทธิ์ดิจิทัล (Digital Rights Management)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#073B65] tracking-tight">
                ชั้นหนังสือดิจิทัลที่ยืมไว้
              </h1>
              <p className="text-xs sm:text-sm text-[#64748B] max-w-2xl leading-relaxed">
                ตามข้อกำหนดลิขสิทธิ์หนังสือดิจิทัล สมาชิกสามารถยืมหนังสือเก็บไว้ในระบบได้สูงสุด <strong>{maxLoans} เล่ม</strong> พร้อมกัน โดยสามารถเปิดอ่านฉบับเต็มได้ตลอดระยะเวลาการยืม (14 วัน) และสามารถกดคืนเล่มที่อ่านจบเพื่อรับโควตายืมเล่มใหม่ได้ตลอดเวลา
              </p>
            </div>

            {/* Quota Counter Card */}
            <div className="bg-[#F0F8FD] border border-[#DCEAF3] rounded-2xl p-5 min-w-[260px] text-center space-y-3 shrink-0">
              <div className="flex items-center justify-between text-xs font-bold text-[#073B65]">
                <span>โควตายืมปัจจุบัน</span>
                <span className={activeLoanCount >= maxLoans ? 'text-rose-600' : 'text-[#079FE8]'}>
                  {activeLoanCount} / {maxLoans} เล่ม
                </span>
              </div>

              {/* Visual 3 Slots Bar */}
              <div className="grid grid-cols-3 gap-2">
                {slots.map((idx) => {
                  const loan = activeLoans[idx];
                  return (
                    <div
                      key={idx}
                      className={`h-10 rounded-xl border flex items-center justify-center text-xs font-bold transition-all ${
                        loan
                          ? 'bg-[#073B65] text-white border-[#073B65] shadow-xs'
                          : 'bg-white border-dashed border-slate-300 text-slate-400'
                      }`}
                      title={loan ? loan.media_title : 'ช่องว่าง (พร้อมยืม)'}
                    >
                      {loan ? (
                        <span className="truncate px-1.5 text-[11px] font-medium">{loan.media_title.slice(0, 8)}...</span>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-normal">ว่าง {idx + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-500 font-medium">
                {activeLoanCount >= maxLoans ? (
                  <span className="text-rose-600 font-semibold">โควตาเต็มแล้ว (คืนหนังสือเพื่อยืมเพิ่ม)</span>
                ) : (
                  <span>สามารถยืมเพิ่มได้อีก <strong>{maxLoans - activeLoanCount}</strong> เล่ม</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action feedback toast */}
        {feedback && (
          <div className={`p-4 rounded-2xl mb-6 text-xs sm:text-sm font-semibold flex items-center gap-2.5 shadow-md animate-in fade-in ${
            isError ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-900'
          }`}>
            {isError ? <AlertCircle size={18} className="text-rose-600 shrink-0" /> : <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />}
            <span>{feedback}</span>
          </div>
        )}

        {/* Tab Navigation: กำลังยืม (Active) vs ประวัติการยืม (History) */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#DCEAF3] pb-3">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'active'
                ? 'bg-[#073B65] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <BookMarked size={16} />
            <span>หนังสือที่ยืมอยู่ ({activeLoans.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'history'
                ? 'bg-[#073B65] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <RotateCcw size={16} />
            <span>ประวัติที่เคยคืนแล้ว ({returnedLoans.length})</span>
          </button>

          <Link
            href="/books"
            className="ml-auto inline-flex items-center gap-1.5 text-xs font-bold text-[#079FE8] hover:text-[#0588c7] transition-colors"
          >
            <span>+ ค้นหาหนังสือเพื่อยืมเพิ่ม</span>
          </Link>
        </div>

        {/* Tab 1: Active Loans */}
        {activeTab === 'active' && (
          <div>
            {activeLoans.length === 0 ? (
              /* Empty Shelf View */
              <div className="bg-white rounded-3xl border border-[#DCEAF3] p-10 sm:p-14 text-center space-y-4 shadow-xs">
                <div className="w-16 h-16 rounded-2xl bg-[#F0F8FD] text-[#079FE8] border border-[#DCEAF3] flex items-center justify-center mx-auto shadow-inner">
                  <BookMarked size={28} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-[#073B65]">ยังไม่มีหนังสือที่ยืมไว้ในขณะนี้</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] max-w-md mx-auto">
                    คุณมีโควตายืมหนังสือดิจิทัลว่าง {maxLoans} เล่ม สามารถเลือกหนังสือในคลังเพื่อเปิดอ่านได้ทันที
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/books"
                    className="inline-flex items-center gap-2 bg-[#079FE8] hover:bg-[#0588c7] text-white px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md active:scale-98"
                  >
                    <BookOpen size={16} />
                    <span>สำรวจคลังหนังสือและเริ่มยืม</span>
                  </Link>
                </div>
              </div>
            ) : (
              /* Active Loans Cards */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {activeLoans.map((loan) => {
                  const daysLeft = calculateDaysLeft(loan.due_date);
                  const isExpiringSoon = daysLeft <= 3;
                  const borrowedDate = new Date(loan.borrowed_at).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit'
                  });
                  const dueDate = new Date(loan.due_date).toLocaleDateString('th-TH', {
                    day: 'numeric',
                    month: 'short',
                    year: '2-digit'
                  });

                  return (
                    <div
                      key={loan.id}
                      className="bg-white rounded-2xl border border-[#DCEAF3] hover:border-[#079FE8]/60 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                    >
                      <div className="flex gap-4">
                        {/* Book Cover */}
                        <div className="relative w-20 sm:w-24 aspect-[1/1.42] rounded-xl overflow-hidden shadow-md shrink-0 border border-slate-200 bg-slate-900">
                          <Image
                            src={loan.media_cover || '/images/books/book-placeholder.jpg'}
                            alt={loan.media_title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                          <div className="absolute top-1 right-1 bg-rose-700 text-white text-[7px] font-bold px-1 rounded shadow-xs">
                            ลิขสิทธิ์
                          </div>
                        </div>

                        {/* Metadata */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="inline-block text-[10px] font-bold text-[#079FE8] bg-[#EBF7FD] px-2 py-0.5 rounded-md">
                            ยืมอ่านออนไลน์
                          </span>
                          <h3 className="font-bold text-sm sm:text-base text-[#073B65] line-clamp-2 leading-snug">
                            {loan.media_title}
                          </h3>
                          <p className="text-[11px] text-[#64748B]">
                            พระครูปลัดสุวัฒนโพธิคุณ
                          </p>

                          {/* Loan Dates info */}
                          <div className="pt-2 text-[11px] text-slate-500 space-y-0.5 font-medium">
                            <div className="flex items-center gap-1">
                              <Calendar size={11} className="text-slate-400" />
                              <span>ยืมเมื่อ: {borrowedDate}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock size={11} className={isExpiringSoon ? 'text-rose-500' : 'text-emerald-500'} />
                              <span className={isExpiringSoon ? 'text-rose-600 font-bold' : 'text-slate-600 font-semibold'}>
                                ครบกำหนด: {dueDate} (เหลือ {daysLeft} วัน)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        {/* 1. Open Reader */}
                        <Link
                          href={`/reader/${loan.media_id}`}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#073B65] hover:bg-[#052946] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98"
                        >
                          <BookOpen size={16} className="text-[#D9A441]" />
                          <span>เปิดอ่านหนังสือ (Flipbook)</span>
                        </Link>

                        {/* 2. Secondary Actions: Renew & Return */}
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => handleRenew(loan.id)}
                            className="py-2 px-3 rounded-xl bg-[#F0F8FD] hover:bg-sky-100 text-[#073B65] font-semibold text-xs border border-[#DCEAF3] transition-colors cursor-pointer flex items-center justify-center gap-1"
                            title="ต่ออายุการยืมเพิ่มอีก 7 วัน"
                          >
                            <Clock size={13} />
                            <span>ต่ออายุ (+7 วัน)</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleReturn(loan.id, loan.media_title)}
                            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1"
                            title="คืนหนังสือเพื่อเพิ่มโควตายืมว่าง"
                          >
                            <RotateCcw size={13} />
                            <span>คืนหนังสือ</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Returned Loans History */}
        {activeTab === 'history' && (
          <div>
            {returnedLoans.length === 0 ? (
              <div className="bg-white rounded-3xl border border-[#DCEAF3] p-8 text-center text-slate-500 text-xs">
                ยังไม่มีประวัติการคืนหนังสือ
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-[#DCEAF3] overflow-hidden shadow-xs">
                <div className="divide-y divide-slate-100">
                  {returnedLoans.map((loan) => (
                    <div key={loan.id} className="p-4 sm:p-5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden shrink-0 border bg-slate-900">
                          <Image src={loan.media_cover} alt={loan.media_title} fill className="object-cover" unoptimized />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs sm:text-sm text-[#073B65] truncate">{loan.media_title}</h4>
                          <p className="text-[11px] text-slate-500">
                            คืนเมื่อ: {loan.returned_at ? new Date(loan.returned_at).toLocaleDateString('th-TH') : '-'}
                          </p>
                        </div>
                      </div>

                      <Link
                        href={`/books/${loan.media_id}`}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#079FE8] bg-[#F0F8FD] hover:bg-sky-100 border border-[#DCEAF3] shrink-0"
                      >
                        ยืมอีกครั้ง
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
