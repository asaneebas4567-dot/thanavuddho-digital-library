'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  BookOpen, 
  FileText, 
  Video, 
  Headphones, 
  Award, 
  Gift, 
  Flame, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  X
} from 'lucide-react';
import { useLearningPoints } from '@/lib/useLearningPoints';

interface DailyActivityWidgetProps {
  onClose?: () => void;
  isModal?: boolean;
}

export default function DailyActivityWidget({ onClose, isModal = false }: DailyActivityWidgetProps) {
  const {
    availablePoints,
    todayPoints,
    dailyLearningPoints,
    dailyLearningCap,
    remainingDailyQuota,
    isDailyCapReached,
    chaptersReadToday,
    articlesReadToday,
    videoMinutesToday,
    audioMinutesToday,
    quizzesCompletedToday,
    userName
  } = useLearningPoints();

  const todayThai = new Intl.DateTimeFormat('th-TH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const content = (
    <div className="w-full bg-white rounded-3xl p-5 sm:p-6 border border-[#DCEAF3] shadow-xl overflow-hidden relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#F0F8FD] rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DCEAF3]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#079FE8] uppercase tracking-wider">
            <Flame className="w-4 h-4 text-[#D9A441] fill-[#D9A441]" />
            <span>กิจกรรมวันนี้ (Daily Learning Progress)</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#073B65] mt-1">
            บันทึกการเรียนรู้ประจำวัน
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            {todayThai} • คุณ{userName}
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Today Points Highlight Banner (Deep Navy + Accent Gold) */}
      <div className="mt-4 p-4 rounded-2xl bg-gradient-to-r from-[#073B65] via-[#0B4E85] to-[#073B65] text-white shadow-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-2xl font-black shadow-inner">
            🪙
          </div>
          <div>
            <div className="text-xs text-sky-200 font-medium">คะแนนที่ได้รับวันนี้</div>
            <div className="text-2xl font-black tracking-tight text-[#D9A441]">
              +{todayPoints.toLocaleString()} <span className="text-sm font-semibold text-white/90">P</span>
            </div>
            <div className="text-[10px] text-sky-200/80">
              กิจกรรมทั่วไป {dailyLearningPoints} P • โบนัสเควส {Math.max(0, todayPoints - dailyLearningPoints)} P
            </div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs text-sky-200 font-medium">คะแนนคงเหลือทั้งหมด</div>
          <div className="text-lg font-black text-[#D9A441]">{availablePoints.toLocaleString()} P</div>
        </div>
      </div>

      {/* Daily Learning Activities Quota Progress Bar (100 P / Day Cap) */}
      <div className="mt-3.5 p-4 rounded-2xl bg-[#F0F8FD] border border-[#DCEAF3] shadow-xs">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-lg bg-[#079FE8] text-white shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
            <div>
              <span className="font-extrabold text-[#073B65] block">โควตาคะแนนกิจกรรมประจำวัน</span>
              <span className="text-[10px] text-[#64748B]">อ่านจบบท, บทความ, วิดีโอ, พอดแคสต์ (ไม่ต้องตอบคำถาม)</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-sm font-black text-[#073B65] font-mono">
              {dailyLearningPoints} <span className="text-xs font-bold text-[#079FE8]">/ {dailyLearningCap} P</span>
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full h-3 rounded-full bg-sky-200/60 overflow-hidden shadow-inner p-0.5">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isDailyCapReached 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                : 'bg-gradient-to-r from-sky-500 via-sky-400 to-sky-600'
            }`}
            style={{ width: `${Math.min(100, Math.round((dailyLearningPoints / dailyLearningCap) * 100))}%` }}
          />
        </div>

        {/* Status Message */}
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {isDailyCapReached ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-300/60 w-full justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>เต็มโควตา 100 P ประจำวันนี้แล้ว! พรุ่งนี้มาร่วมเรียนรู้ใหม่นะ</span>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full text-sky-800 text-[11px] font-semibold">
              <span className="flex items-center gap-1">
                <span>💡 วันนี้ยังเก็บแต้มกิจกรรมได้อีก</span>
                <strong className="text-sky-900 font-extrabold">{remainingDailyQuota} P</strong>
              </span>
              <span className="text-sky-600/90 font-mono">
                {Math.round((dailyLearningPoints / dailyLearningCap) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 4 Pillars Activity Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3.5">
        {/* 1. Books */}
        <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-sky-800 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-sky-600" />
              <span>อ่านหนังสือ</span>
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-sky-950">
              {chaptersReadToday} <span className="text-xs font-semibold text-sky-700">บท</span>
            </div>
            <div className="text-[11px] text-sky-700/80 mt-0.5">5-15 P ต่อบท</div>
          </div>
        </div>

        {/* 2. Articles */}
        <div className="p-3.5 rounded-2xl bg-blue-50/60 border border-blue-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-800 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>อ่านบทความ</span>
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-blue-950">
              {articlesReadToday} <span className="text-xs font-semibold text-blue-700">บทความ</span>
            </div>
            <div className="text-[11px] text-blue-700/80 mt-0.5">+2 P ต่อบท</div>
          </div>
        </div>

        {/* 3. Videos */}
        <div className="p-3.5 rounded-2xl bg-rose-50/60 border border-rose-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-800 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5 text-rose-600" />
              <span>ดูวิดีโอ</span>
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-rose-950">
              {videoMinutesToday} <span className="text-xs font-semibold text-rose-700">นาที</span>
            </div>
            <div className="text-[11px] text-rose-700/80 mt-0.5">5 P ทุก 10 นาที</div>
          </div>
        </div>

        {/* 4. Podcast */}
        <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/50 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-emerald-600" />
              <span>ฟังพอดแคสต์</span>
            </span>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950">
              {audioMinutesToday} <span className="text-xs font-semibold text-emerald-700">นาที</span>
            </div>
            <div className="text-[11px] text-emerald-700/80 mt-0.5">5 P ทุก 10 นาที</div>
          </div>
        </div>
      </div>

      {/* Quizzes today info (Exempt from 100 P daily learning cap) */}
      <div className="mt-3.5 p-3.5 rounded-xl bg-sky-50/40 border border-sky-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <span className="text-foreground/90 flex items-center gap-2">
          <Award className="w-4 h-4 text-sky-600 shrink-0" />
          <span>แบบทดสอบ/เควสปัญญาธรรมสำเร็จวันนี้:</span>
          <strong>{quizzesCompletedToday} เควส</strong>
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-sky-700 bg-sky-100/90 px-2 py-0.5 rounded-md border border-sky-300/60">
            โบนัสพิเศษ +5 ถึง 10 P/เควส
          </span>
          <span className="text-[10px] text-muted-foreground hidden sm:inline">
            (ไม่นับรวมในโควตา 100 P)
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-sky-100">
        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>การเรียนรู้วันละนิด สร้างบารมีธรรมและปัญญาอันยิ่งใหญ่</span>
        </div>

        <Link
          href="/rewards"
          onClick={onClose}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
        >
          <Gift className="w-4 h-4" />
          <span>ไปที่ Rewards Shop แลกของรางวัล</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
        <div className="max-w-xl w-full">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

