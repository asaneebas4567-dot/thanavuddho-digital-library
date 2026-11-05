'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Compass, 
  Sparkles, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  CheckCircle2, 
  HelpCircle, 
  BookOpen, 
  Award, 
  ExternalLink, 
  AlertCircle,
  Eye,
  Crown,
  MapPin,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';
import { BookEasterEggQuest, QUEST_BOOKS_CATALOG } from '@/data/bookEasterEggQuests';

export default function QuestEditorPage() {
  const [selectedBookId, setSelectedBookId] = useState<string>('book_mongkol_chiwit_124');
  const [quests, setQuests] = useState<BookEasterEggQuest[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal / Form state
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [editingQuest, setEditingQuest] = useState<BookEasterEggQuest | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Form Fields
  const [formBookId, setFormBookId] = useState<string>('book_mongkol_chiwit_124');
  const [formQuestNumber, setFormQuestNumber] = useState<number>(1);
  const [formQuestType, setFormQuestType] = useState<'main' | 'side' | 'legendary' | 'discovery'>('side');
  const [formTitle, setFormTitle] = useState<string>('');
  const [formSubtitle, setFormSubtitle] = useState<string>('');
  const [formCategoryTag, setFormCategoryTag] = useState<string>('🥚 Easter Egg');
  const [formTriggerPage, setFormTriggerPage] = useState<number>(26);
  const [formTriggerPageEnd, setFormTriggerPageEnd] = useState<number | ''>('');
  const [formPrintedPageStart, setFormPrintedPageStart] = useState<number | ''>('');
  const [formPrintedPageEnd, setFormPrintedPageEnd] = useState<number | ''>('');
  const [formLoreStory, setFormLoreStory] = useState<string>('');
  const [formHint, setFormHint] = useState<string>('');
  const [formQuestion, setFormQuestion] = useState<string>('');
  const [formOptions, setFormOptions] = useState<[string, string, string, string]>([
    'ตัวเลือก ก',
    'ตัวเลือก ข',
    'ตัวเลือก ค',
    'ตัวเลือก ง'
  ]);
  const [formCorrectIndex, setFormCorrectIndex] = useState<number>(1);
  const [formExplanation, setFormExplanation] = useState<string>('');
  const [formPoints, setFormPoints] = useState<number>(75);
  const [formBadgeName, setFormBadgeName] = useState<string>('ผู้ค้นพบสัจธรรม');
  const [formBadgeIcon, setFormBadgeIcon] = useState<string>('✨');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fetch quests for selected book
  const fetchQuests = async (bookId: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/quests?bookId=${encodeURIComponent(bookId)}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.quests)) {
        setQuests(data.quests);
      }
    } catch (err) {
      console.error('Failed to fetch quests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests(selectedBookId);
  }, [selectedBookId]);

  const handleOpenCreate = () => {
    setEditingQuest(null);
    setFormBookId(selectedBookId);
    setFormQuestNumber((quests.length || 0) + 1);
    setFormQuestType('side');
    setFormTitle('');
    setFormSubtitle('');
    setFormCategoryTag('🥚 Easter Egg');
    setFormTriggerPage(30);
    setFormTriggerPageEnd('');
    setFormPrintedPageStart(5);
    setFormPrintedPageEnd(6);
    setFormLoreStory('');
    setFormHint('');
    setFormQuestion('');
    setFormOptions(['ก. ', 'ข. ', 'ค. ', 'ง. ']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormPoints(75);
    setFormBadgeName('ผู้ไขปริศนาธรรม');
    setFormBadgeIcon('🌟');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (q: BookEasterEggQuest) => {
    setEditingQuest(q);
    setFormBookId(q.bookId);
    setFormQuestNumber(q.questNumber);
    setFormQuestType(q.questType || (q.isLegendary ? 'legendary' : 'side'));
    setFormTitle(q.title);
    setFormSubtitle(q.subtitle);
    setFormCategoryTag(q.categoryTag);
    setFormTriggerPage(q.triggerPage);
    setFormTriggerPageEnd(q.triggerPageEnd || '');
    setFormPrintedPageStart(q.printedPageStart || '');
    setFormPrintedPageEnd(q.printedPageEnd || '');
    setFormLoreStory(q.loreStory);
    setFormHint(q.hint || '');
    setFormQuestion(q.question);
    setFormOptions([...q.options] as [string, string, string, string]);
    setFormCorrectIndex(q.correctIndex);
    setFormExplanation(q.explanation || '');
    setFormPoints(q.loot.points);
    setFormBadgeName(q.loot.badgeName);
    setFormBadgeIcon(q.loot.badgeIcon);
    setIsFormOpen(true);
  };

  const handleDeleteQuest = async (questId: string) => {
    if (!confirm('คุณต้องการลบเควสนี้ใช่หรือไม่? (เควส Built-in หลักจะไม่สามารถลบได้)')) return;

    try {
      const res = await fetch(`/api/quests?id=${encodeURIComponent(questId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showToast('ลบเควสสำเร็จแล้ว');
        fetchQuests(selectedBookId);
      } else {
        alert(data.error || 'ไม่สามารถลบเควสได้');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('เกิดข้อผิดพลาดในการลบเควส');
    }
  };

  const handleSaveQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formQuestion.trim()) {
      alert('กรุณากรอกชื่อเควสและคำถามให้ครบถ้วน');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<BookEasterEggQuest> = {
        id: editingQuest?.id || `custom_quest_${Date.now()}`,
        bookId: formBookId,
        questNumber: Number(formQuestNumber),
        questType: formQuestType,
        isLegendary: formQuestType === 'legendary',
        title: formTitle.trim(),
        subtitle: formSubtitle.trim(),
        categoryTag: formCategoryTag.trim(),
        triggerPage: Number(formTriggerPage),
        triggerPageEnd: formTriggerPageEnd !== '' ? Number(formTriggerPageEnd) : undefined,
        printedPageStart: formPrintedPageStart !== '' ? Number(formPrintedPageStart) : undefined,
        printedPageEnd: formPrintedPageEnd !== '' ? Number(formPrintedPageEnd) : undefined,
        loreStory: formLoreStory.trim(),
        hint: formHint.trim(),
        question: formQuestion.trim(),
        options: formOptions,
        correctIndex: Number(formCorrectIndex),
        explanation: formExplanation.trim(),
        loot: {
          points: Number(formPoints),
          badgeName: formBadgeName.trim(),
          badgeIcon: formBadgeIcon.trim(),
        }
      };

      const res = await fetch('/api/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showToast(editingQuest ? 'อัปเดตข้อมูลเควสเรียบร้อยแล้ว' : 'สร้างเควสใหม่สำเร็จแล้ว');
        setIsFormOpen(false);
        fetchQuests(selectedBookId);
      } else {
        alert(data.error || 'ไม่สามารถบันทึกเควสได้');
      }
    } catch (err) {
      console.error('Save error:', err);
      alert('เกิดข้อผิดพลาดในการบันทึกเควส');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredQuests = useMemo(() => {
    if (!searchFilter.trim()) return quests;
    const q = searchFilter.toLowerCase();
    return quests.filter(item => 
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.question.toLowerCase().includes(q)
    );
  }, [quests, searchFilter]);

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Toast Alert */}
        {toastMessage && (
          <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/admin" 
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                <span>กลับสู่แผงควบคุมหลัก</span>
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Compass size={28} />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  เครื่องมือจัดการ Quest & Easter Eggs
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  สร้างและปรับแต่งภารกิจประจำหน้าหนังสือ สำหรับระบบสำรวจ Open World Reading โดยไม่ต้องแก้โค้ด
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/reader/${selectedBookId}`}
              target="_blank"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <Eye size={15} />
              <span>ทดสอบอ่านใน Reader</span>
              <ExternalLink size={12} className="opacity-70" />
            </Link>

            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition-all shadow-lg shadow-amber-500/20 active:scale-95 cursor-pointer"
            >
              <Plus size={16} />
              <span>เพิ่มเควสใหม่</span>
            </button>
          </div>
        </div>

        {/* Book Selector & Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2 p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              เลือกหนังสือที่ต้องการจัดการเควส
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-2xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-amber-500 transition-colors"
            >
              {Object.entries(QUEST_BOOKS_CATALOG).map(([id, info]) => (
                <option key={id} value={id}>
                  {info.title}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              หนังสือที่เลือก: <strong>{QUEST_BOOKS_CATALOG[selectedBookId]?.title || selectedBookId}</strong>
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Sparkles size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">จำนวนเควสทั้งหมด</p>
              <p className="text-2xl font-black text-white">{quests.length} จุด</p>
              <p className="text-[10px] text-emerald-400 font-mono">พร้อมทำงานในระบบ</p>
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 flex items-center gap-4">
            <div className="p-3.5 rounded-2xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
              <Award size={24} />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">แต้มสะสมรวมทั้งเล่ม</p>
              <p className="text-2xl font-black text-amber-400">
                {quests.reduce((acc, q) => acc + (q.loot?.points || 0), 0)} แต้ม
              </p>
              <p className="text-[10px] text-slate-400">สำหรับแลกรางวัล</p>
            </div>
          </div>
        </div>

        {/* Quests Table Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          {/* Table Toolbar */}
          <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-2">
              <Compass size={18} className="text-amber-400" />
              <h2 className="text-base font-black text-white">รายการภารกิจและจุด Easter Egg ทั้งหมด</h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-slate-300 font-mono">
                {filteredQuests.length} รายการ
              </span>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="ค้นหาชื่อเควส คำถาม หรือหน้า..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="p-12 text-center text-slate-400 text-sm flex items-center justify-center gap-2">
              <RefreshCw size={18} className="animate-spin text-amber-500" />
              <span>กำลังโหลดข้อมูลเควส...</span>
            </div>
          ) : filteredQuests.length === 0 ? (
            <div className="p-12 text-center text-slate-500 text-sm">
              <Sparkles size={32} className="mx-auto mb-2 opacity-40 text-amber-400" />
              <p>ยังไม่มีเควสสำหรับหนังสือเล่มนี้</p>
              <button
                onClick={handleOpenCreate}
                className="mt-3 text-xs text-amber-400 hover:text-amber-300 font-bold underline"
              >
                + คลิกที่นี่เพื่อเพิ่มเควสแรก
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400">
                    <th className="px-5 py-3.5 font-bold">ลำดับ</th>
                    <th className="px-5 py-3.5 font-bold">ชื่อภารกิจ & ประเภท</th>
                    <th className="px-5 py-3.5 font-bold">พิกัด PDF</th>
                    <th className="px-5 py-3.5 font-bold">หน้าเล่มจริง</th>
                    <th className="px-5 py-3.5 font-bold">คำถามประจำบท</th>
                    <th className="px-5 py-3.5 font-bold">รางวัล</th>
                    <th className="px-5 py-3.5 font-bold text-right">การจัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredQuests.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4 font-mono font-bold text-amber-400">
                        #{q.questNumber}
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-extrabold text-sm text-white line-clamp-1">
                          {q.title}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                            q.isLegendary
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : q.questType === 'main'
                              ? 'bg-amber-500/20 text-amber-300 font-bold'
                              : 'bg-white/10 text-slate-300'
                          }`}>
                            {q.categoryTag}
                          </span>
                          <span className="text-[11px] text-slate-400 line-clamp-1">
                            {q.subtitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-slate-200">
                        PDF น. {q.triggerPage}
                        {q.triggerPageEnd ? `–${q.triggerPageEnd}` : ''}
                      </td>
                      <td className="px-5 py-4 font-mono text-slate-400">
                        {q.printedPageStart ? `น. ${q.printedPageStart}–${q.printedPageEnd || q.printedPageStart}` : '-'}
                      </td>
                      <td className="px-5 py-4 text-slate-300 max-w-xs line-clamp-2">
                        {q.question}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{q.loot.badgeIcon}</span>
                          <div>
                            <div className="font-bold text-white text-[11px]">{q.loot.badgeName}</div>
                            <div className="font-mono text-amber-400 text-[10px]">+{q.loot.points} แต้ม</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/reader/${q.bookId}?page=${q.triggerPage}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-slate-300 hover:text-white transition-colors"
                            title="วาร์ปไปทดสอบในหน้านี้"
                          >
                            <Eye size={14} />
                          </Link>
                          <button
                            onClick={() => handleOpenEdit(q)}
                            className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-colors cursor-pointer"
                            title="แก้ไขเควส"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteQuest(q.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                            title="ลบเควส"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal: Create / Edit Quest */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div 
              onClick={() => setIsFormOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            />

            <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl text-white flex flex-col z-10 animate-in fade-in zoom-in-95 duration-200">
              {/* Form Header */}
              <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
                <div className="flex items-center gap-2.5">
                  <Compass size={22} className="text-amber-400" />
                  <div>
                    <h3 className="font-black text-lg text-white">
                      {editingQuest ? 'แก้ไขเควสประจำบท' : 'สร้างภารกิจ / Easter Egg ใหม่'}
                    </h3>
                    <p className="text-xs text-slate-400">
                      บันทึกพิกัดหน้า เงื่อนไข และคำสอนแท้จริงเพื่อเปิดทางสำรวจ
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSaveQuest} className="p-5 sm:p-6 space-y-5 flex-1 overflow-y-auto text-xs">
                {/* 1. General Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">หนังสือเป้าหมาย</label>
                    <select
                      value={formBookId}
                      onChange={(e) => setFormBookId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    >
                      {Object.entries(QUEST_BOOKS_CATALOG).map(([id, info]) => (
                        <option key={id} value={id}>
                          {info.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ประเภทเควส</label>
                    <select
                      value={formQuestType}
                      onChange={(e) => {
                        const val = e.target.value as any;
                        setFormQuestType(val);
                        if (val === 'main') setFormCategoryTag('📜 ภารกิจหลัก');
                        else if (val === 'legendary') setFormCategoryTag('🌟 เควสระดับตำนาน ⭐⭐⭐⭐⭐');
                        else if (val === 'discovery') setFormCategoryTag('🧭 การค้นพบลับ');
                        else setFormCategoryTag('🛡️ ภารกิจรอง');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                    >
                      <option value="main">📜 ภารกิจหลัก (Main Quest)</option>
                      <option value="side">🛡️ ภารกิจรอง (Side Quest)</option>
                      <option value="legendary">🌟 เควสระดับตำนาน (Legendary)</option>
                      <option value="discovery">🧭 การค้นพบลับ (Discovery)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ลำดับเควส (#)</label>
                    <input
                      type="number"
                      value={formQuestNumber}
                      onChange={(e) => setFormQuestNumber(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
                      min={1}
                      required
                    />
                  </div>
                </div>

                {/* 2. Title & Subtitle */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อเควส / ภารกิจ *</label>
                    <input
                      type="text"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="เช่น ก้าวแรกสู่มงคลชีวิต"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">คำบรรยายย่อย (Subtitle)</label>
                    <input
                      type="text"
                      value={formSubtitle}
                      onChange={(e) => setFormSubtitle(e.target.value)}
                      placeholder="เช่น บทนำ: ที่มาแห่งมงคลสูตรและมงคลโกลาหล"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* 3. Page Coordinates */}
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 space-y-2">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5 text-xs">
                    <MapPin size={14} />
                    <span>พิกัดหน้าเอกสาร (ระบบป้องกันคลาดเคลื่อน)</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1 font-bold">PDF หน้าที่เริ่ม (Trigger) *</label>
                      <input
                        type="number"
                        value={formTriggerPage}
                        onChange={(e) => setFormTriggerPage(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono font-bold"
                        min={1}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">PDF หน้าสิ้นสุด (ถ้ามี)</label>
                      <input
                        type="number"
                        value={formTriggerPageEnd}
                        onChange={(e) => setFormTriggerPageEnd(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">เลขหน้าพิมพ์ในเล่มจริง (เริ่ม)</label>
                      <input
                        type="number"
                        value={formPrintedPageStart}
                        onChange={(e) => setFormPrintedPageStart(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                        min={1}
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-slate-400 block mb-1">เลขหน้าพิมพ์ในเล่มจริง (จบ)</label>
                      <input
                        type="number"
                        value={formPrintedPageEnd}
                        onChange={(e) => setFormPrintedPageEnd(e.target.value === '' ? '' : Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-white font-mono"
                        min={1}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Lore Story & Hint */}
                <div>
                  <label className="font-bold text-slate-300 block mb-1">เนื้อหาคติธรรมอ้างอิงจากหนังสือ (Lore Story)</label>
                  <textarea
                    value={formLoreStory}
                    onChange={(e) => setFormLoreStory(e.target.value)}
                    rows={3}
                    placeholder="ใส่เนื้อหาคำสอนจริงที่ตรวจสอบได้จากต้นฉบับหนังสือ..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white leading-relaxed"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">คำใบ้สำหรับผู้สำรวจ (Hint)</label>
                  <input
                    type="text"
                    value={formHint}
                    onChange={(e) => setFormHint(e.target.value)}
                    placeholder="เช่น เปิดอ่านหน้าหนังสือ 1 – 9 สังเกตระยะเวลาแห่งมงคลโกลาหล"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                  />
                </div>

                {/* 5. Question & 4 Options */}
                <div className="space-y-2.5 pt-2 border-t border-slate-800">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">คำถามปริศนาประจำบท *</label>
                    <input
                      type="text"
                      value={formQuestion}
                      onChange={(e) => setFormQuestion(e.target.value)}
                      placeholder="เช่น ตามหนังสือมงคลชีวิต มงคลโกลาหลยืดเยื้อกี่ปี?"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-bold text-slate-300 block">4 ตัวเลือกคำตอบ และเลือกข้อที่ถูกต้อง:</label>
                    {formOptions.map((opt, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctIndex"
                          checked={formCorrectIndex === idx}
                          onChange={() => setFormCorrectIndex(idx)}
                          className="w-4 h-4 text-amber-500 focus:ring-amber-400 cursor-pointer"
                        />
                        <span className="font-mono font-bold text-slate-400 w-6">
                          {['ก.', 'ข.', 'ค.', 'ง.'][idx]}
                        </span>
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const next = [...formOptions] as [string, string, string, string];
                            next[idx] = e.target.value;
                            setFormOptions(next);
                          }}
                          className={`flex-1 bg-slate-950 border rounded-xl p-2 text-white ${
                            formCorrectIndex === idx ? 'border-amber-400 bg-amber-500/10 font-bold' : 'border-slate-700'
                          }`}
                          required
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="font-bold text-slate-300 block mb-1">คำเฉลยและคติธรรม (Explanation)</label>
                    <textarea
                      value={formExplanation}
                      onChange={(e) => setFormExplanation(e.target.value)}
                      rows={2}
                      placeholder="คำอธิบายเมื่อผู้อ่านตอบถูกว่าเหตุผลคืออะไรตามหนังสือ..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                {/* 6. Loot Rewards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">แต้มรางวัล (Points)</label>
                    <input
                      type="number"
                      value={formPoints}
                      onChange={(e) => setFormPoints(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-mono font-bold"
                      min={10}
                      step={5}
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อเหรียญตรา (Badge Name)</label>
                    <input
                      type="text"
                      value={formBadgeName}
                      onChange={(e) => setFormBadgeName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white font-bold"
                      required
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ไอคอน / อิโมจิเหรียญตรา</label>
                    <input
                      type="text"
                      value={formBadgeIcon}
                      onChange={(e) => setFormBadgeIcon(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-center text-lg"
                      required
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-bold cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle2 size={16} />
                    <span>{isSubmitting ? 'กำลังบันทึก...' : editingQuest ? 'บันทึกการแก้ไข' : 'สร้างเควส'}</span>
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
