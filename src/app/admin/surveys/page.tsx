'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BarChart3, 
  FileSpreadsheet, 
  Users, 
  Award, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Database, 
  Upload, 
  RefreshCw, 
  BookOpen, 
  Video, 
  Headphones, 
  FileText, 
  Sparkles, 
  Quote, 
  Clock, 
  ShieldCheck, 
  Copy, 
  Trash2, 
  Filter,
  Check,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  SurveyQuestion, 
  SurveyResponse, 
  SurveyAnalytics, 
  SurveyCategory 
} from '@/types/survey';

export default function AdminSurveysPage() {
  const { user } = useAuth();

  // Security gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Tabs
  const [activeTab, setActiveTab] = useState<'overview' | 'import' | 'responses' | 'feedback'>('overview');
  const [filterType, setFilterType] = useState<'all' | 'real_only' | 'test_only'>('real_only');

  // Data states
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [analytics, setAnalytics] = useState<SurveyAnalytics | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // CSV Import states
  const [csvInput, setCsvInput] = useState('');
  const [isTestImport, setIsTestImport] = useState(false);
  const [autoAwardPoints, setAutoAwardPoints] = useState(true);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<any | null>(null);

  // Status notification
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Auto unlock for admin
  useEffect(() => {
    if (user && (user.role === 'admin' || user.email === 'asaneebas4567@gmail.com' || user.email === 'thanavuddho.dhamma@gmail.com')) {
      setIsUnlocked(true);
    }
  }, [user]);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMsg({ text, type });
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/surveys?filter=${filterType}`);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions || []);
        setResponses(data.responses || []);
        setAnalytics(data.analytics || null);
      } else {
        showStatus(data.message || 'เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
      }
    } catch (err: any) {
      showStatus('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterType]);

  const handleAction = async (action: 'inject_authentic_sample' | 'inject_test_dataset' | 'clear_test_data') => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/surveys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(data.message, 'success');
        fetchData();
      } else {
        showStatus(data.message || 'การทำงานไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvInput.trim()) {
      showStatus('กรุณาวางเนื้อหาไฟล์ CSV ก่อนกดยืนยัน', 'error');
      return;
    }
    setIsImporting(true);
    setImportResult(null);
    try {
      const res = await fetch('/api/admin/surveys/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          csvText: csvInput,
          isTest: isTestImport,
          autoAwardPoints
        })
      });
      const data = await res.json();
      if (data.success) {
        setImportResult(data.result);
        showStatus(data.message, 'success');
        fetchData();
      } else {
        showStatus(data.message || 'การนำเข้าไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus('เกิดข้อผิดพลาด: ' + err.message, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  const handleAwardPoints = async (responseId: string) => {
    try {
      const res = await fetch('/api/admin/surveys/award-points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ responseId })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(data.message, 'success');
        fetchData();
      } else {
        showStatus(data.message || 'ไม่สามารถให้คะแนนได้', 'error');
      }
    } catch (err: any) {
      showStatus('เกิดข้อผิดพลาด: ' + err.message, 'error');
    }
  };

  // Lock Screen
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-3xl p-8 shadow-2xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">ระบบจัดการแบบประเมินและสถิติ</h2>
          <p className="text-xs text-zinc-400 mb-6">
            เข้าถึงเฉพาะผู้ดูแลระบบ หรือกรอกรหัสผ่านเพื่อปลดล็อก (รหัส: <code className="text-amber-400 font-mono">admin69</code> หรือ <code className="text-amber-400 font-mono">69001</code>)
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (['admin69', '69001', 'thanavuddho'].includes(passcodeInput.trim())) {
                setIsUnlocked(true);
                setPasscodeError(false);
              } else {
                setPasscodeError(true);
              }
            }}
            className="space-y-4"
          >
            <input
              type="password"
              value={passcodeInput}
              onChange={(e) => setPasscodeInput(e.target.value)}
              placeholder="กรอกรหัสผ่านผู้ดูแลระบบ..."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-white/10 text-white placeholder-zinc-500 text-center font-mono focus:outline-none focus:border-amber-400"
            />
            {passcodeError && (
              <p className="text-xs text-rose-400 font-medium">รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition-all shadow-md cursor-pointer"
            >
              ปลดล็อกเข้าสู่แดชบอร์ด
            </button>
          </form>
          <div className="mt-6 pt-4 border-t border-white/5">
            <Link href="/admin" className="text-xs text-zinc-400 hover:text-white transition-colors">
              ← กลับไปยังหน้า Admin หลัก
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const categoryIcons: Record<SurveyCategory, any> = {
    books: BookOpen,
    website: Sparkles,
    video: Video,
    podcast: Headphones,
    article: FileText,
    general: Quote
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors"
            title="กลับไปหน้า Admin หลัก"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm sm:text-base tracking-tight text-white">
                ระบบจัดเก็บผลแบบประเมินและวิเคราะห์ความพึงพอใจ
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Phase 1-6 ครบวงจร
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Thanavuddho Digital Library • Google Forms Evaluation & Database Testing Suite
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/database"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-300 text-xs font-bold transition-colors"
          >
            <Database size={14} />
            <span>ดูโครงสร้างตาราง Supabase</span>
          </Link>
          <button
            onClick={() => fetchData()}
            disabled={isLoading}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
            title="รีเฟรชข้อมูล"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Status Notification Toast */}
      {statusMsg && (
        <div className="fixed top-16 right-4 z-50 animate-bounce">
          <div className={`px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-950/95 border-emerald-500/40 text-emerald-200'
              : 'bg-rose-950/95 border-rose-500/40 text-rose-200'
          }`}>
            {statusMsg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{statusMsg.text}</span>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">

        {/* Action Tool Strip */}
        <div className="p-4 rounded-3xl bg-slate-900/80 border border-white/10 backdrop-blur-md flex flex-wrap items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-zinc-400">ชุดข้อมูลตัวอย่าง:</span>
            <button
              onClick={() => handleAction('inject_authentic_sample')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Sparkles size={13} className="text-amber-400" />
              <span>นำเข้าข้อมูลจริงตัวอย่าง 5 รายการ (พร้อมมอบ 200 แต้ม)</span>
            </button>
            <button
              onClick={() => handleAction('inject_test_dataset')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>🧪 ชุดทดสอบระบบ (is_test=true)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('clear_test_data')}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-bold transition-all cursor-pointer"
              title="ล้างเฉพาะข้อมูลที่ระบุว่า is_test=true โดยไม่ลบผลประเมินจริง"
            >
              <Trash2 size={13} />
              <span>ล้างข้อมูลทดสอบ (Clear Test)</span>
            </button>
          </div>
        </div>

        {/* 4 Key Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Respondents */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400">ผู้ตอบแบบประเมินทั้งหมด</span>
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
                <Users size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-white">
              {analytics ? analytics.totalResponses : 0}
              <span className="text-xs font-normal text-zinc-400 ml-2">คน</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-2 flex items-center justify-between">
              <span>ข้อมูลผู้ใช้จริง: <strong className="text-emerald-400">{analytics?.realResponsesCount || 0}</strong></span>
              <span>ข้อมูลทดสอบ: <strong className="text-purple-400">{analytics?.testResponsesCount || 0}</strong></span>
            </div>
          </div>

          {/* Card 2: Overall Satisfaction */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400">ความพึงพอใจเฉลี่ยรวม</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Star size={18} className="fill-amber-400" />
              </div>
            </div>
            <div className="text-3xl font-black text-amber-300 flex items-baseline gap-1.5">
              <span>{analytics?.overallSatisfactionAverage || 0}</span>
              <span className="text-sm font-bold text-zinc-500">/ 5.00</span>
            </div>
            <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
              <CheckCircle2 size={12} />
              <span>ระดับความพึงพอใจ: ดีเยี่ยม (Very High)</span>
            </div>
          </div>

          {/* Card 3: 200 Points Awarded */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400">สมาชิกที่ได้รับ 200 แต้มแล้ว</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Award size={18} />
              </div>
            </div>
            <div className="text-3xl font-black text-emerald-300">
              {analytics?.pointsAwardedCount || 0}
              <span className="text-xs font-normal text-zinc-400 ml-2">คน</span>
            </div>
            <div className="text-[11px] text-zinc-400 mt-2">
              <span>สมาชิกที่ยืนยันตัวตนแล้ว: <strong className="text-white">{analytics?.verifiedMembersCount || 0}</strong> คน</span>
            </div>
          </div>

          {/* Card 4: Top Satisfaction Category */}
          <div className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-zinc-400">หมวดหมู่ที่พึงพอใจสูงสุด</span>
              <div className="p-2 rounded-xl bg-yellow-500/20 text-yellow-400">
                <Sparkles size={18} />
              </div>
            </div>
            <div className="text-xl font-black text-white truncate">
              {analytics?.categoryStats?.books?.avgRating ? 'หนังสือดิจิทัล & E-Books' : 'ระบบเว็บไซต์'}
            </div>
            <div className="text-[11px] text-amber-300 mt-2 font-mono">
              คะแนนหมวดหนังสือ: {analytics?.categoryStats?.books?.avgRating || 0} / 5.00
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <BarChart3 size={15} />
            <span>สถิติความพึงพอใจ 5 เสาหลัก</span>
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'import'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet size={15} />
            <span>นำเข้า Google Forms (CSV)</span>
          </button>

          <button
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'responses'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Users size={15} />
            <span>รายการผู้ตอบทั้งหมด ({responses.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'feedback'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white'
            }`}
          >
            <Quote size={15} />
            <span>ข้อเสนอแนะจากสมาชิก ({analytics?.recentFeedback?.length || 0})</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & 5 PILLARS SATISFACTION */}
        {activeTab === 'overview' && analytics && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter Toggle */}
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-semibold">แสดงสถิติการประเมิน:</span>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-white/10">
                <button
                  onClick={() => setFilterType('real_only')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    filterType === 'real_only' ? 'bg-emerald-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  เฉพาะผู้ใช้งานจริง
                </button>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    filterType === 'all' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  รวมทั้งหมด (จริง + ทดสอบ)
                </button>
                <button
                  onClick={() => setFilterType('test_only')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition-colors ${
                    filterType === 'test_only' ? 'bg-purple-600 text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  เฉพาะชุดทดสอบ
                </button>
              </div>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Object.entries(analytics.categoryStats).map(([catKey, catStat]) => {
                const IconComponent = categoryIcons[catKey as SurveyCategory] || BookOpen;
                const percentage = Math.round((catStat.avgRating / 5) * 100);

                return (
                  <div key={catKey} className="p-5 rounded-3xl bg-slate-900 border border-white/10 shadow-md hover:border-amber-500/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                            <IconComponent size={18} />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm text-white">{catStat.nameTh}</h3>
                            <span className="text-[10px] text-zinc-500 font-mono">หมวด: {catKey}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-xl font-black text-amber-300">{catStat.avgRating || '-'}</span>
                          <span className="text-xs text-zinc-500">/5</span>
                        </div>
                      </div>

                      {/* Rating Progress Bar */}
                      <div className="space-y-1 mb-4">
                        <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[10px] text-zinc-500">
                          <span>ความพึงพอใจ {percentage}%</span>
                          <span>ประเมิน {catStat.totalRatingsCount} ครั้ง</span>
                        </div>
                      </div>

                      {/* Likert 5-Star Distribution */}
                      <div className="space-y-1 pt-2 border-t border-white/5 text-[10px]">
                        {[5, 4, 3, 2, 1].map((star) => (
                          <div key={star} className="flex items-center gap-2 text-zinc-400">
                            <span className="w-12">{star} ดาว</span>
                            <div className="flex-1 bg-white/5 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-400/80 h-full rounded-full"
                                style={{
                                  width: `${catStat.totalRatingsCount > 0 ? (catStat.distribution[star as 1|2|3|4|5] / catStat.totalRatingsCount) * 100 : 0}%`
                                }}
                              />
                            </div>
                            <span className="w-6 text-right font-mono text-zinc-500">
                              {catStat.distribution[star as 1|2|3|4|5]}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Question Scores Table */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-lg">
              <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-amber-400" />
                <span>คะแนนเฉลี่ยรายข้อคำถาม (Likert Scale 1-5 ดาว)</span>
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-zinc-400 border-b border-white/10 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-2.5 px-3">ข้อคำถามแบบประเมิน</th>
                      <th className="py-2.5 px-3">หมวดหมู่</th>
                      <th className="py-2.5 px-3 text-center">จำนวนผู้ตอบ</th>
                      <th className="py-2.5 px-3 text-right">คะแนนเฉลี่ย</th>
                      <th className="py-2.5 px-3 text-center">ระดับผล</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {analytics.questionStats.map((qs) => (
                      <tr key={qs.questionId} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 text-slate-200 font-medium">
                          {qs.questionText}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded-md bg-white/5 text-amber-300 border border-white/10 text-[10px]">
                            {qs.categoryTitleTh}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center font-mono text-zinc-400">
                          {qs.count}
                        </td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-300 text-sm">
                          {qs.avgRating.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                            {qs.avgRating >= 4.5 ? 'ดีเยี่ยม' : qs.avgRating >= 3.5 ? 'ดี' : 'ปานกลาง'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: CSV & GOOGLE FORMS IMPORTER */}
        {activeTab === 'import' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="text-amber-400" size={20} />
                <h3 className="text-base font-bold text-white">นำเข้าข้อมูลผลประเมินจาก Google Forms / Google Sheets</h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed">
                คัดลอกข้อมูลทั้งหมดจากตาราง Google Sheets (ที่เชื่อมกับ Google Forms) หรือเนื้อหาในไฟล์ CSV มาวางในช่องด้านล่าง ระบบจะตรวจสอบรูปแบบข้อมูล ป้องกันการนำเข้าซ้ำอัตโนมัติ และตรวจสอบสิทธิ์มอบ 200 คะแนนให้สมาชิกที่ยืนยันตัวตน
              </p>

              {/* Import Options */}
              <div className="flex flex-wrap items-center gap-6 p-4 rounded-2xl bg-white/5 border border-white/5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={autoAwardPoints}
                    onChange={(e) => setAutoAwardPoints(e.target.checked)}
                    className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                  />
                  <span>ตรวจสอบและบันทึกคะแนน 200 แต้มให้สมาชิกทันที (Auto-Award 200 Points)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                  <input
                    type="checkbox"
                    checked={isTestImport}
                    onChange={(e) => setIsTestImport(e.target.checked)}
                    className="rounded accent-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span className="text-purple-300 font-bold">ระบุเป็นชุดข้อมูลทดสอบ (is_test = true)</span>
                </label>
              </div>

              {/* Textarea for CSV */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 mb-1.5">
                  วางเนื้อหา CSV หรือตาราง Google Sheets:
                </label>
                <textarea
                  rows={8}
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder={`ประทับเวลา,ที่อยู่อีเมล,ความสะดวกรวดเร็วในการค้นหา,คุณภาพความคมชัดของ PDF,ความสวยงามของเว็บไซต์,ความชัดเจนของวิดีโอ,คุณภาพเสียงพอดแคสต์,คุณค่าบทความธรรมะ,ระบบสะสมแต้ม,ข้อเสนอแนะเพิ่มเติม
2026/11/08 14:20:15,asaneebas4567@gmail.com,5,5,5,5,4,5,5,"ระบบ Flipbook ใช้งานสะดวกและลื่นไหลมากครับ"
2026/11/08 15:30:10,test.student@univ.ac.th,4,4,5,4,4,4,4,"อยากให้เพิ่มระบบคั่นหน้าหนังสือครับ"`}
                  className="w-full p-4 rounded-2xl bg-slate-950 border border-white/10 text-xs text-white font-mono placeholder-zinc-600 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => {
                    const sampleCsv = `ประทับเวลา,ที่อยู่อีเมล,ความสะดวกรวดเร็วในการค้นหา,คุณภาพความคมชัดของ PDF,ความสวยงามของเว็บไซต์,ความชัดเจนของวิดีโอ,คุณภาพเสียงพอดแคสต์,คุณค่าบทความธรรมะ,ระบบสะสมแต้ม,ข้อเสนอแนะเพิ่มเติม\n2026/11/08 10:15:20,asaneebas4567@gmail.com,5,5,5,5,5,5,5,"หนังสืออ่านสบายตา ระบบบทถอดเสียงวิดีโอช่วยให้ค้นคว้าได้เร็วมาก"\n2026/11/08 11:25:40,thanavuddho.dhamma@gmail.com,5,5,4,5,5,5,4,"ระบบการจัดหมวดหมู่ทำได้เป็นระเบียบเรียบร้อยดีมาก"`;
                    setCsvInput(sampleCsv);
                  }}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
                >
                  + ใส่ตัวอย่างข้อความ CSV จำลอง
                </button>

                <button
                  onClick={handleCsvImport}
                  disabled={isImporting}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Upload size={16} />
                  <span>{isImporting ? 'กำลังประมวลผล...' : 'เริ่มนำเข้าข้อมูลเข้าสู่ฐานข้อมูล'}</span>
                </button>
              </div>

              {/* Import Result Feedback Card */}
              {importResult && (
                <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/30 text-xs space-y-2 animate-fadeIn">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 size={16} />
                    <span>ผลการประมวลผลการนำเข้า</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-zinc-300 font-mono">
                    <div className="p-2 bg-white/5 rounded-xl">แถวทั้งหมด: <strong>{importResult.totalParsed}</strong></div>
                    <div className="p-2 bg-emerald-500/10 text-emerald-300 rounded-xl">บันทึกสำเร็จ: <strong>{importResult.importedCount}</strong></div>
                    <div className="p-2 bg-amber-500/10 text-amber-300 rounded-xl">ข้ามข้อมูลซ้ำ: <strong>{importResult.skippedDuplicates}</strong></div>
                    <div className="p-2 bg-blue-500/10 text-blue-300 rounded-xl">มอบ 200 แต้ม: <strong>{importResult.pointsAwardedCount}</strong></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: RESPONSES TABLE */}
        {activeTab === 'responses' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Filter buttons */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400 font-semibold">ตัวกรอง:</span>
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    filterType === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  ทั้งหมด ({responses.length})
                </button>
                <button
                  onClick={() => setFilterType('real_only')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    filterType === 'real_only' ? 'bg-emerald-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  เฉพาะผู้ใช้จริง
                </button>
                <button
                  onClick={() => setFilterType('test_only')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-colors ${
                    filterType === 'test_only' ? 'bg-purple-600 text-white' : 'bg-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  เฉพาะข้อมูลทดสอบ
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-lg overflow-x-auto">
              {responses.length === 0 ? (
                <div className="p-10 text-center text-zinc-500 text-xs">
                  ยังไม่มีข้อมูลการส่งแบบประเมินในระบบ สามารถกดปุ่ม "นำเข้าข้อมูลจริงตัวอย่าง" ด้านบนเพื่อเริ่มทดสอบได้
                </div>
              ) : (
                <table className="w-full text-xs text-left">
                  <thead className="text-zinc-400 border-b border-white/10 uppercase text-[10px] font-mono">
                    <tr>
                      <th className="py-2.5 px-3">วันที่/เวลาส่ง</th>
                      <th className="py-2.5 px-3">ผู้ตอบ (อีเมล / สมาชิก)</th>
                      <th className="py-2.5 px-3 text-center">ประเภท</th>
                      <th className="py-2.5 px-3 text-center">คะแนนเฉลี่ย</th>
                      <th className="py-2.5 px-3 text-center">สถานะ 200 คะแนน</th>
                      <th className="py-2.5 px-3 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {responses.map((resp) => (
                      <tr key={resp.id} className="hover:bg-white/[0.02]">
                        <td className="py-3 px-3 text-zinc-400 font-mono text-[11px] whitespace-nowrap">
                          {new Date(resp.submittedAt).toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-bold text-white">{resp.respondentEmail}</div>
                          <div className="text-[10px] text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            {resp.memberCardId ? (
                              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                                บัตร: {resp.memberCardId}
                              </span>
                            ) : (
                              <span className="text-zinc-500">บุคคลทั่วไป (ไม่ผูกสมาชิก)</span>
                            )}
                            {resp.userName && <span>• คุณ{resp.userName}</span>}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {resp.isTest ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              ชุดทดสอบ
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              ผู้ใช้จริง
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <span className="font-mono font-bold text-amber-300 text-sm">
                            {resp.averageRating ? `${resp.averageRating} ★` : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          {resp.pointsAwarded ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              <CheckCircle2 size={11} />
                              <span>รับแล้ว (+200 P)</span>
                            </span>
                          ) : resp.userId ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              <span>รอมอบคะแนน</span>
                            </span>
                          ) : (
                            <span className="text-[10px] text-zinc-500">
                              ไม่ใช่สมาชิก (ไม่มีสิทธิ์รับแต้ม)
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-right">
                          {!resp.pointsAwarded && resp.userId && !resp.isTest && (
                            <button
                              onClick={() => handleAwardPoints(resp.id)}
                              className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-[11px] transition-all cursor-pointer shadow-xs"
                            >
                              กดให้ 200 แต้ม
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: MEMBER FEEDBACK & QUALITATIVE COMMENTS */}
        {activeTab === 'feedback' && analytics && (
          <div className="space-y-4 animate-fadeIn">
            <div className="p-6 rounded-3xl bg-slate-900 border border-white/10 shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Quote className="text-amber-400" size={18} />
                  <h3 className="text-sm font-bold text-white">ข้อเสนอแนะและคำติชมจริงจากผู้ตอบแบบประเมิน</h3>
                </div>
                <span className="text-xs text-zinc-400 font-mono">
                  รวม {analytics.recentFeedback.length} ข้อเสนอแนะ
                </span>
              </div>

              {analytics.recentFeedback.length === 0 ? (
                <div className="p-8 text-center text-xs text-zinc-500">
                  ยังไม่มีข้อความข้อเสนอแนะในระบบ
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analytics.recentFeedback.map((fb, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between">
                      <p className="text-xs text-slate-200 leading-relaxed italic mb-3">
                        &ldquo;{fb.comment}&rdquo;
                      </p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-amber-300">{fb.userName || fb.email}</span>
                          {fb.memberCardId && (
                            <span className="px-1 rounded bg-white/5 text-zinc-400 font-mono">
                              #{fb.memberCardId}
                            </span>
                          )}
                          {fb.isTest && (
                            <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-bold">
                              ชุดทดสอบ
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-zinc-500">
                          {new Date(fb.submittedAt).toLocaleDateString('th-TH')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
