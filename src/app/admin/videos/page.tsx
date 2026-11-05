'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Video, 
  Plus, 
  Trash2, 
  Edit, 
  FileText, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft,
  Search,
  ExternalLink,
  Sparkles,
  TrendingUp,
  HelpCircle,
  Check,
  X
} from 'lucide-react';
import { VideoKnowledgeItem, UnansweredQueryLog } from '@/types';

export default function AdminVideosPage() {
  const [activeTab, setActiveTab] = useState<'videos' | 'transcript' | 'unanswered'>('videos');
  const [videos, setVideos] = useState<VideoKnowledgeItem[]>([]);
  const [unansweredQueries, setUnansweredQueries] = useState<UnansweredQueryLog[]>([]);
  const [searchFilter, setSearchFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Form states for Add / Edit Video
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formStartFormatted, setFormStartFormatted] = useState('');
  const [formHasTranscript, setFormHasTranscript] = useState(false);
  const [formTranscript, setFormTranscript] = useState('');

  // Selected video for Transcript tab
  const [selectedTranscriptVideoId, setSelectedTranscriptVideoId] = useState<string>('');
  const [transcriptInput, setTranscriptInput] = useState('');
  const [transcriptStartInput, setTranscriptStartInput] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/videos');
      const data = await res.json();
      if (data.success) {
        setVideos(data.videos || []);
        setUnansweredQueries(data.unansweredQueries || []);
        if (data.videos.length > 0 && !selectedTranscriptVideoId) {
          setSelectedTranscriptVideoId(data.videos[0].id);
          setTranscriptInput(data.videos[0].transcript || '');
          setTranscriptStartInput(data.videos[0].startFormatted || '');
        }
      }
    } catch (err) {
      console.error('Failed to load video admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormTitle('');
    setFormUrl('');
    setFormDescription('');
    setFormTags('');
    setFormKeywords('');
    setFormStartFormatted('');
    setFormHasTranscript(false);
    setFormTranscript('');
    setIsModalOpen(true);
  };

  const openEditModal = (v: VideoKnowledgeItem) => {
    setEditingId(v.id);
    setFormTitle(v.title);
    setFormUrl(v.url);
    setFormDescription(v.description);
    setFormTags(v.tags.join(', '));
    setFormKeywords((v.keywords || []).join(', '));
    setFormStartFormatted(v.startFormatted || '');
    setFormHasTranscript(v.hasVerifiedTranscript);
    setFormTranscript(v.transcript || '');
    setIsModalOpen(true);
  };

  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    setSaving(true);
    try {
      let startSeconds: number | undefined = undefined;
      if (formStartFormatted.includes(':')) {
        const parts = formStartFormatted.split(':').map(Number);
        if (parts.length === 2) {
          startSeconds = parts[0] * 60 + parts[1];
        }
      }

      const payload = {
        action: editingId ? 'update' : 'add',
        video: {
          id: editingId || undefined,
          title: formTitle.trim(),
          url: formUrl.trim(),
          description: formDescription.trim(),
          tags: formTags.split(',').map(t => t.trim()).filter(Boolean),
          keywords: formKeywords.split(',').map(k => k.trim()).filter(Boolean),
          hasVerifiedTranscript: formHasTranscript,
          transcript: formTranscript.trim() || undefined,
          startFormatted: formStartFormatted.trim() || undefined,
          startSeconds,
          status: 'published',
          isOfficialChannel: true
        }
      };

      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (result.success) {
        setStatusMessage('บันทึกข้อมูลวิดีโอเรียบร้อยแล้ว');
        setIsModalOpen(false);
        await loadData();
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDeleteVideo = async (id: string, title: string) => {
    if (!confirm(`ต้องการลบวิดีโอ "${title}" ออกจากคลังความรู้ใช่หรือไม่?`)) return;

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('ลบวิดีโอเรียบร้อยแล้ว');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveTranscript = async () => {
    if (!selectedTranscriptVideoId) return;
    const targetVideo = videos.find(v => v.id === selectedTranscriptVideoId);
    if (!targetVideo) return;

    setSaving(true);
    try {
      let startSeconds: number | undefined = undefined;
      if (transcriptStartInput.includes(':')) {
        const parts = transcriptStartInput.split(':').map(Number);
        if (parts.length === 2) {
          startSeconds = parts[0] * 60 + parts[1];
        }
      }

      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update',
          video: {
            ...targetVideo,
            transcript: transcriptInput.trim() || undefined,
            hasVerifiedTranscript: !!transcriptInput.trim(),
            startFormatted: transcriptStartInput.trim() || undefined,
            startSeconds
          }
        })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage('บันทึกบทถอดเสียงและเวลาเริ่มต้นเรียบร้อยแล้ว');
        await loadData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  const handleDeleteUnanswered = async (id: string) => {
    try {
      await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_query', id })
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredVideos = videos.filter(v => 
    v.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    v.tags.some(t => t.toLowerCase().includes(searchFilter.toLowerCase())) ||
    (v.keywords || []).some(k => k.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  const verifiedCount = videos.filter(v => v.hasVerifiedTranscript).length;
  const totalRecommends = videos.reduce((acc, v) => acc + (v.recommendCount || 0), 0);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Breadcrumb & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 mb-1">
              <Link href="/admin" className="hover:text-amber-700 flex items-center gap-1">
                <ArrowLeft size={14} /> กลับสู่แดชบอร์ดผู้ดูแล
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
              <Video className="text-rose-600" size={28} />
              ระบบคลังวิดีโอ & Knowledge-to-Video Fallback
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              จัดการวิดีโอคำสอนของพระอาจารย์ (@ThanavuddhoStory), นำเข้า Transcript, กำหนดเวลาคลิป และติดตามคำถามที่ยังไม่มีคำตอบ
            </p>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Plus size={16} />
            <span>เพิ่มวิดีโอ YouTube เข้าคลัง</span>
          </button>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
              <Video size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">วิดีโอในคลังทั้งหมด</p>
              <p className="text-2xl font-black text-slate-900">{videos.length} คลิป</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
              <CheckCircle2 size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">มี Transcript ตรวจสอบแล้ว</p>
              <p className="text-2xl font-black text-emerald-700">{verifiedCount} คลิป ({videos.length > 0 ? Math.round((verifiedCount / videos.length) * 100) : 0}%)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
              <TrendingUp size={22} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500">จำนวนครั้งที่ถูกแนะนำโดย Fallback</p>
              <p className="text-2xl font-black text-amber-700">{totalRecommends} ครั้ง</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 gap-2 sm:gap-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('videos')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'videos'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            🎥 คลังวิดีโอเชื่อมต่อ ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'transcript'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            📝 นำเข้า Transcript & หมุดเวลา
          </button>
          <button
            onClick={() => setActiveTab('unanswered')}
            className={`pb-3 px-3 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'unanswered'
                ? 'border-rose-600 text-rose-600'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HelpCircle size={15} />
            <span>คำถามที่ยังตอบไม่ได้</span>
            {unansweredQueries.length > 0 && (
              <span className="bg-rose-100 text-rose-800 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                {unansweredQueries.length}
              </span>
            )}
          </button>
        </div>

        {/* TAB 1: VIDEOS LIST */}
        {activeTab === 'videos' && (
          <div className="space-y-4">
            {/* Search Filter */}
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
              <Search size={18} className="text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="ค้นหาวิดีโอด้วยชื่อเรื่อง, แท็ก หรือคีย์เวิร์ด..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full text-xs sm:text-sm focus:outline-none"
              />
              {searchFilter && (
                <button onClick={() => setSearchFilter('')} className="text-slate-400 hover:text-slate-600">
                  <X size={16} />
                </button>
              )}
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 font-bold">กำลังโหลดคลังวิดีโอ...</div>
            ) : filteredVideos.length === 0 ? (
              <div className="py-12 bg-white rounded-2xl text-center border border-slate-200">
                <p className="text-slate-500 text-sm font-bold">ไม่พบวิดีโอที่ตรงกับคำค้นหา</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredVideos.map((v) => (
                  <div key={v.id} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-all">
                    <div>
                      <div className="flex gap-3 items-start">
                        {/* Thumbnail */}
                        <div className="w-28 h-20 bg-slate-100 rounded-xl overflow-hidden relative shrink-0 border border-black/5">
                          {v.thumbnail ? (
                            <Image src={v.thumbnail} alt={v.title} fill className="object-cover" unoptimized />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Video size={20} />
                            </div>
                          )}
                          {v.startFormatted && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                              {v.startFormatted}
                            </span>
                          )}
                        </div>

                        {/* Title & Channel */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200/60">
                              YouTube
                            </span>
                            {v.hasVerifiedTranscript ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-0.5">
                                <Check size={10} /> มี Transcript
                              </span>
                            ) : (
                              <span className="text-[9px] font-medium px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200/70">
                                ค้นจากชื่อ/คำอธิบาย
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400 font-semibold ml-auto">
                              แนะนำ {v.recommendCount || 0} ครั้ง
                            </span>
                          </div>

                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                            {v.title}
                          </h3>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                            {v.description}
                          </p>
                        </div>
                      </div>

                      {/* Tags */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {v.tags.map((t, idx) => (
                          <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <a 
                        href={v.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-rose-600 font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        <span>เปิดคลิป YouTube</span>
                        <ExternalLink size={11} />
                      </a>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(v)}
                          className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(v.id, v.title)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="ลบวิดีโอ"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: TRANSCRIPT IMPORTER */}
        {activeTab === 'transcript' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileText className="text-rose-600" size={20} />
                นำเข้าบทถอดเสียง (Transcript) และกำหนดเวลาเริ่มต้น (Timestamp)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                เมื่อนำเข้า Transcript ระบบจะใช้เนื้อหาภายในคลิปในการคำนวณความเกี่ยวข้อง ช่วยให้บอทแนะนำคำตอบได้แม่นยำยิ่งขึ้น
              </p>
            </div>

            {/* Select Video */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เลือกวิดีโอที่ต้องการจัดการบทถอดเสียง:
              </label>
              <select
                value={selectedTranscriptVideoId}
                onChange={(e) => {
                  const id = e.target.value;
                  setSelectedTranscriptVideoId(id);
                  const selected = videos.find(v => v.id === id);
                  if (selected) {
                    setTranscriptInput(selected.transcript || '');
                    setTranscriptStartInput(selected.startFormatted || '');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-400"
              >
                {videos.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.title} {v.hasVerifiedTranscript ? '✓ (มี Transcript แล้ว)' : '(ยังไม่มี)'}
                  </option>
                ))}
              </select>
            </div>

            {/* Timestamp input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Clock size={13} className="text-rose-600" />
                <span>เวลาเริ่มต้นของประเด็นสำคัญ (เช่น 03:15 หรือ 14:20):</span>
              </label>
              <input
                type="text"
                placeholder="เช่น 03:15"
                value={transcriptStartInput}
                onChange={(e) => setTranscriptStartInput(e.target.value)}
                className="w-48 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                ระบุเฉพาะเมื่อมีจุดเวลาเริ่มบรรยายจริง ห้ามแต่งเวลาขึ้นเอง
              </p>
            </div>

            {/* Transcript Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                เนื้อหาบทถอดเสียง (Transcript / คำบรรยายคำสอนของพระอาจารย์):
              </label>
              <textarea
                rows={8}
                placeholder="วางบทถอดเสียงหรือเนื้อหาคำสอนจริงที่พระอาจารย์บรรยายในคลิปนี้..."
                value={transcriptInput}
                onChange={(e) => setTranscriptInput(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-2xl p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed font-sans"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={handleSaveTranscript}
                disabled={saving}
                className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
              >
                {saving ? 'กำลังบันทึก...' : 'บันทึก Transcript ลงฐานข้อมูล'}
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: UNANSWERED QUERIES LOG */}
        {activeTab === 'unanswered' && (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="text-rose-600" size={20} />
                บันทึกคำถามที่ระบบตอบไม่ได้ (Situation D: Zero-Hallucination Log)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                รายการคำถามจากผู้ใช้ที่ระบบไม่พบทั้งในหนังสือและวิดีโอ เพื่อให้ผู้ดูแลสามารถนำเข้าเนื้อหาหรือคลิปวิดีโอของพระอาจารย์มารองรับในอนาคต
              </p>
            </div>

            {unansweredQueries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 font-bold text-sm bg-slate-50 rounded-2xl border border-slate-200">
                🎉 ขณะนี้ยังไม่มีประวัติคำถามที่ระบบตอบไม่ได้ (ระบบตอบหรือแนะนำวิดีโอได้อย่างครบถ้วน)
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold">
                      <th className="py-3 px-3">คำถามที่ผู้ใช้ถาม</th>
                      <th className="py-3 px-3 text-center">ถามซ้ำ (ครั้ง)</th>
                      <th className="py-3 px-3">เวลาที่บันทึก</th>
                      <th className="py-3 px-3 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unansweredQueries.map((q) => (
                      <tr key={q.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {q.query}
                        </td>
                        <td className="py-3 px-3 text-center font-bold text-rose-600">
                          {q.hitCount}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-xs">
                          {new Date(q.timestamp).toLocaleString('th-TH')}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => handleDeleteUnanswered(q.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                            title="ลบรายการ"
                          >
                            <Trash2 size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* MODAL: ADD / EDIT VIDEO */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                  <Video className="text-rose-600" size={20} />
                  <span>{editingId ? 'แก้ไขข้อมูลวิดีโอ' : 'เพิ่มวิดีโอ YouTube ของพระอาจารย์'}</span>
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ชื่อวิดีโอ / หัวข้อเทศนา *
                  </label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="เช่น พระไตรปิฎกกับชีวิตประจำวัน"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    YouTube URL หรือ Video ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://www.youtube.com/watch?v=..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    คำอธิบายสาระสำคัญ
                  </label>
                  <textarea
                    rows={3}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="สรุปสาระสำคัญของคำสอนในวิดีโอนี้..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Tags (คั่นด้วยจุลภาค ,)
                    </label>
                    <input
                      type="text"
                      value={formTags}
                      onChange={(e) => setFormTags(e.target.value)}
                      placeholder="อิทธิบาท 4, สมาธิ, การทำงาน"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      เวลาเริ่มต้นจริง (ถ้าระบุได้ เช่น 03:15)
                    </label>
                    <input
                      type="text"
                      value={formStartFormatted}
                      onChange={(e) => setFormStartFormatted(e.target.value)}
                      placeholder="03:15"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Keywords ค้นคว้า (คั่นด้วยจุลภาค ,)
                  </label>
                  <input
                    type="text"
                    value={formKeywords}
                    onChange={(e) => setFormKeywords(e.target.value)}
                    placeholder="ฉันทะ, วิริยะ, จิตตะ, วิมังสา, ทำงานสำเร็จ"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-rose-400"
                  />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-5 py-2 rounded-xl shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'กำลังบันทึก...' : 'บันทึกวิดีโอ'}
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

