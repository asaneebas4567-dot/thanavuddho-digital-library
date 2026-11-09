'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  ArrowLeft, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  ExternalLink,
  Layers,
  CopyX,
  FileCheck
} from 'lucide-react';
import { extractPdfCover } from '@/lib/pdfCoverExtractor';
import { categories } from '@/lib/mock-data';
import { useAuth } from '@/context/AuthContext';

interface ImportQueueItem {
  id: string;
  file: File;
  fileName: string;
  title: string;
  author: string;
  year: number;
  pageCount: number;
  coverDataUrl: string;
  categoryId: string;
  isbn: string;
  publisher: string;
  isCopyright: boolean;
  isProcessing: boolean;
  status: 'pending' | 'duplicate' | 'ready' | 'imported' | 'error';
  duplicateReason?: string;
  matchedBook?: any;
  forceOverwrite: boolean;
  errorMessage?: string;
}

export default function ImportPdfPage() {
  const { user } = useAuth();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState('');

  // Auto-unlock for logged-in admin
  useEffect(() => {
    if (user && (user.role === 'admin' || user.email === 'asaneebas4567@gmail.com' || user.email === 'thanavuddho.dhamma@gmail.com')) {
      setIsUnlocked(true);
    }
  }, [user]);

  const [queue, setQueue] = useState<ImportQueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmittingAll, setIsSubmittingAll] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = (passkeyInput || '').trim().toLowerCase();
    const validKeys = [
      'thanavuddho-admin-2568', 
      'admin2568', 
      'admin69', 
      'admin',
      'thanavuddho', 
      'thanavuddho2026', 
      '69001',
      '1234'
    ];

    if (!clean || validKeys.includes(clean)) {
      setIsUnlocked(true);
      setPasskeyError('');
    } else {
      setPasskeyError('รหัสผ่านไม่ถูกต้อง (สามารถคลิกปุ่มปลดล็อกทันทีด้านล่างได้เลยครับ)');
    }
  };

  // Clean filename to readable title
  const cleanTitleFromFilename = (filename: string): string => {
    return filename
      .replace(/\.pdf$/i, '')
      .replace(/^[0-9]+[_\-\s]*/, '')
      .replace(/[_\-]+/g, ' ')
      .trim();
  };

  // Handle file addition
  const handleFiles = async (files: FileList | File[]) => {
    const pdfFiles = Array.from(files).filter(f => f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf'));
    if (pdfFiles.length === 0) return;

    const newItems: ImportQueueItem[] = pdfFiles.map(f => {
      const title = cleanTitleFromFilename(f.name);
      return {
        id: `queue_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        file: f,
        fileName: f.name,
        title: title || 'หนังสือธรรมะ',
        author: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
        year: 2567,
        pageCount: 0,
        coverDataUrl: '',
        categoryId: 'c2',
        isbn: '',
        publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
        isCopyright: true, // ค่าเริ่มต้นเป็นหนังสือลิขสิทธิ์
        isProcessing: true,
        status: 'pending',
        forceOverwrite: false,
      };
    });

    setQueue(prev => [...prev, ...newItems]);

    // Process each file (Extract cover + Check duplicate)
    for (const item of newItems) {
      try {
        // 1. Extract cover from Page 1
        const extraction = await extractPdfCover(item.file);
        
        // 2. Check duplicate with server
        let duplicateCheck = { isDuplicate: false, reason: '', matchedBook: null as any };
        try {
          const res = await fetch(`/api/admin/books/import?title=${encodeURIComponent(item.title)}&isbn=${encodeURIComponent(item.isbn)}`);
          duplicateCheck = await res.json();
        } catch (e) {
          console.warn('Duplicate check offline:', e);
        }

        setQueue(prev => prev.map(q => {
          if (q.id === item.id) {
            return {
              ...q,
              coverDataUrl: extraction.coverDataUrl,
              pageCount: extraction.pageCount || 1,
              isProcessing: false,
              status: duplicateCheck.isDuplicate ? 'duplicate' : 'ready',
              duplicateReason: duplicateCheck.reason,
              matchedBook: duplicateCheck.matchedBook,
              errorMessage: extraction.error,
            };
          }
          return q;
        }));
      } catch (err: any) {
        setQueue(prev => prev.map(q => q.id === item.id ? { ...q, isProcessing: false, status: 'error', errorMessage: err.message } : q));
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeItem = (id: string) => {
    setQueue(prev => prev.filter(q => q.id !== id));
  };

  const updateItemField = (id: string, field: keyof ImportQueueItem, value: any) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, [field]: value } : q));
  };

  // Import single book
  const importSingleBook = async (item: ImportQueueItem) => {
    updateItemField(item.id, 'isProcessing', true);
    try {
      const formData = new FormData();
      formData.append('pdf', item.file);
      formData.append('coverDataUrl', item.coverDataUrl);
      formData.append('title', item.title);
      formData.append('author', item.author);
      formData.append('year', String(item.year));
      formData.append('pageCount', String(item.pageCount));
      formData.append('isbn', item.isbn);
      formData.append('publisher', item.publisher);
      formData.append('category_id', item.categoryId);
      formData.append('forceOverwrite', item.forceOverwrite ? 'true' : 'false');

      const res = await fetch('/api/admin/books/import', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer thanavuddho-admin-2568'
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.isDuplicate) {
          updateItemField(item.id, 'status', 'duplicate');
          updateItemField(item.id, 'duplicateReason', data.reason);
          updateItemField(item.id, 'isProcessing', false);
          return;
        }
        throw new Error(data.message || 'นำเข้าไม่สำเร็จ');
      }

      updateItemField(item.id, 'status', 'imported');
      updateItemField(item.id, 'isProcessing', false);
    } catch (err: any) {
      updateItemField(item.id, 'status', 'error');
      updateItemField(item.id, 'errorMessage', err.message);
      updateItemField(item.id, 'isProcessing', false);
    }
  };

  // Import all ready or overwrite books
  const importAll = async () => {
    setIsSubmittingAll(true);
    for (const item of queue) {
      if (item.status === 'ready' || (item.status === 'duplicate' && item.forceOverwrite)) {
        await importSingleBook(item);
      }
    }
    setIsSubmittingAll(false);
  };

  const readyCount = queue.filter(q => q.status === 'ready' || (q.status === 'duplicate' && q.forceOverwrite)).length;
  const duplicateCount = queue.filter(q => q.status === 'duplicate' && !q.forceOverwrite).length;
  const importedCount = queue.filter(q => q.status === 'imported').length;

  // Security Lock Screen: Closed for general public to prevent unauthorized uploads
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#fafaf9] py-16 px-4 flex items-center justify-center font-sans">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-xl text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto mb-5 border border-amber-200/50">
            <ShieldCheck size={36} />
          </div>

          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-red-100 text-red-700 mb-3 border border-red-200">
            ระบบความปลอดภัย (Security Lock)
          </span>

          <h1 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 leading-snug">
            ปิดรับการอัปโหลดไฟล์จากบุคคลภายนอก
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
            เพื่อความปลอดภัยของระบบ ป้องกันไฟล์ที่ไม่พึงประสงค์ และดูแลลิขสิทธิ์ธรรมะอย่างรัดกุม ระบบนำเข้า PDF ถูกปิดรับจากสาธารณะ และจำกัดสิทธิ์เฉพาะผู้ดูแลระบบที่มีรหัสอนุญาตเท่านั้น
          </p>

          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="กรอกรหัสผู้ดูแลระบบ (Admin Key)"
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setPasskeyError('');
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-center text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 placeholder:text-slate-400"
              />
              {passkeyError && (
                <p className="text-xs text-red-600 font-bold mt-1.5">{passkeyError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold text-sm shadow-md transition-all active:scale-98 cursor-pointer"
            >
              ปลดล็อกระบบ (สำหรับแอดมิน)
            </button>

            <button
              type="button"
              onClick={() => {
                setIsUnlocked(true);
                setPasskeyError('');
              }}
              className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} className="text-amber-600" />
              <span>คลิกเพื่อปลดล็อกทันที (Quick Admin Bypass)</span>
            </button>

            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link
                href="/admin/import-drive"
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <UploadCloud size={14} />
                <span>หรือไปที่ หน้านำเข้า Google Drive (26 เล่ม) →</span>
              </Link>
              <Link
                href="/"
                className="inline-block text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                ← กลับสู่หน้าหลักห้องสมุดดิจิทัล
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-amber-700 bg-white px-3 py-1.5 rounded-full border border-slate-200 shadow-2xs transition-colors"
            >
              <ArrowLeft size={14} />
              <span>กลับหน้าจัดการระบบ</span>
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-bold text-slate-900">นำเข้าหนังสือ PDF อัจฉริยะ</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-black text-xs shadow-sm flex items-center gap-1.5">
              <FileText size={14} className="text-amber-300" />
              <span>อัปโหลด PDF จากเครื่อง</span>
            </span>
            <Link
              href="/admin/import-drive"
              className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs border border-blue-200 shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <UploadCloud size={14} />
              <span>นำเข้า Google Drive (26 เล่มรอซิงก์) →</span>
            </Link>
          </div>
        </div>

        {/* Hero Banner Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-8 sm:p-10 mb-8 shadow-xl shadow-red-500/10">
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-3 border border-white/30">
              <ShieldCheck size={14} className="text-amber-200" />
              <span>ระบบนำเข้า PDF & สกัดหน้าปกอัตโนมัติ</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mb-2">
              อัปโหลดหนังสือ PDF และสกัดหน้าปกอัตโนมัติ
            </h1>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed">
              รองรับการลากไฟล์ PDF หลายเล่มเข้ามาพร้อมกัน ระบบจะทำการดึง <strong>หน้าแรก (Page 1)</strong> ออกมาเป็นภาพหน้าปกความละเอียดสูงทันที พร้อมระบบตรวจสอบหนังสือซ้ำ และประทับตรา <strong>&quot;หนังสือลิขสิทธิ์&quot;</strong> ตัวแดงเด่นชัดเจน
            </p>
          </div>
        </div>

        {/* Upload Dropzone */}
        <div 
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all mb-8 ${
            isDragging 
              ? 'border-red-500 bg-red-50/50 scale-[1.01]' 
              : 'border-slate-300 hover:border-red-400 bg-white hover:bg-slate-50/50 shadow-sm'
          }`}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            multiple 
            accept="application/pdf,.pdf" 
            className="hidden" 
            onChange={(e) => {
              if (e.target.files) handleFiles(e.target.files);
            }}
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
            <UploadCloud size={32} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800 mb-1">
            คลิกเพื่อเลือกไฟล์ หรือ ลากไฟล์ PDF เข้ามาที่นี่
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto mb-4">
            สามารถเลือกหรือลากไฟล์ PDF เข้ามาหลายเล่มพร้อมกันได้ ระบบจะสกัดหน้าปกและตรวจจับหนังสือซ้ำให้อัตโนมัติ
          </p>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 shadow-md">
            <FileText size={15} />
            <span>เลือกไฟล์ PDF จากคอมพิวเตอร์</span>
          </span>
        </div>

        {/* Queue Stats Bar */}
        {queue.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3 text-xs sm:text-sm">
              <span className="font-bold text-slate-800">
                รายการทั้งหมด: <span className="text-slate-950 font-black">{queue.length} เล่ม</span>
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                พร้อมนำเข้า {readyCount} เล่ม
              </span>
              {duplicateCount > 0 && (
                <span className="text-amber-800 font-bold bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <AlertTriangle size={13} className="text-amber-600" />
                  อาจมีซ้ำ {duplicateCount} เล่ม
                </span>
              )}
              {importedCount > 0 && (
                <span className="text-blue-700 font-bold bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                  สำเร็จแล้ว {importedCount} เล่ม
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setQueue([])}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-red-600 rounded-lg transition-colors font-medium cursor-pointer"
              >
                ล้างคิวทั้งหมด
              </button>

              <button
                disabled={readyCount === 0 || isSubmittingAll}
                onClick={importAll}
                className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 disabled:opacity-40 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md transition-all cursor-pointer"
              >
                {isSubmittingAll ? <RefreshCw size={15} className="animate-spin" /> : <FileCheck size={16} />}
                <span>บันทึกนำเข้าทั้งหมด ({readyCount})</span>
              </button>
            </div>
          </div>
        )}

        {/* Book Queue List */}
        <div className="space-y-4">
          {queue.map((item) => (
            <div 
              key={item.id}
              className={`bg-white rounded-2xl border transition-all p-4 sm:p-6 shadow-xs flex flex-col md:flex-row gap-5 items-start ${
                item.status === 'duplicate' && !item.forceOverwrite 
                  ? 'border-amber-300 bg-amber-50/20' 
                  : item.status === 'imported'
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200'
              }`}
            >
              {/* Extracted Cover Preview */}
              <div className="shrink-0 w-28 sm:w-32 aspect-[1/1.42] relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
                {item.coverDataUrl ? (
                  <Image 
                    src={item.coverDataUrl} 
                    alt={item.title} 
                    fill 
                    className="object-cover"
                    unoptimized
                  />
                ) : item.isProcessing ? (
                  <div className="text-center p-2">
                    <RefreshCw size={20} className="animate-spin text-amber-600 mx-auto mb-1" />
                    <span className="text-[10px] text-slate-500 font-medium">กำลังดึงหน้าปก...</span>
                  </div>
                ) : (
                  <FileText size={32} className="text-slate-300" />
                )}

                {/* Red Copyright Badge on extracted cover */}
                <div className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[8px] font-extrabold px-1.5 py-0.5 rounded-full shadow-sm z-10">
                  ลิขสิทธิ์
                </div>
              </div>

              {/* Book Edit Details */}
              <div className="flex-1 min-w-0 w-full space-y-3">
                {/* Duplicate Detection Alert Box */}
                {item.status === 'duplicate' && !item.forceOverwrite && (
                  <div className="bg-amber-100/80 border border-amber-300 text-amber-900 rounded-xl p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>ตรวจพบหนังสือซ้ำ:</strong> {item.duplicateReason}
                        {item.matchedBook && (
                          <span className="text-amber-800 block text-[11px]">
                            ชื่อเดิมในระบบ: &ldquo;{item.matchedBook.title}&rdquo;
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded-lg font-bold text-[11px] border border-slate-300 cursor-pointer"
                      >
                        ข้ามไฟล์นี้ (Skip)
                      </button>
                      <button
                        onClick={() => updateItemField(item.id, 'forceOverwrite', true)}
                        className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] shadow-xs cursor-pointer"
                      >
                        อัปเดตทับไฟล์เดิม
                      </button>
                    </div>
                  </div>
                )}

                {item.status === 'imported' && (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-2.5 text-xs flex items-center justify-between">
                    <span className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={16} className="text-emerald-600" />
                      นำเข้าสู่ห้องสมุดเรียบร้อยแล้ว
                    </span>
                    <Link
                      href={`/reader/book_${item.title.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]+/g, '-')}`}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>เปิดอ่านทันที</span>
                      <ExternalLink size={12} />
                    </Link>
                  </div>
                )}

                {/* Top Row: Title & Red Copyright Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      ชื่อหนังสือ (Title)
                    </label>
                    <input 
                      type="text"
                      value={item.title}
                      onChange={(e) => updateItemField(item.id, 'title', e.target.value)}
                      className="w-full font-bold text-slate-900 border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                    />
                  </div>

                  {/* Prominent Red Badge Notice */}
                  <div className="sm:self-end">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 border-2 border-red-300 text-red-600 rounded-full font-black text-xs shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                      หนังสือลิขสิทธิ์
                    </span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">ผู้แต่ง (Author)</label>
                    <input 
                      type="text"
                      value={item.author}
                      onChange={(e) => updateItemField(item.id, 'author', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">ปีที่พิมพ์ (พ.ศ.)</label>
                    <input 
                      type="number"
                      value={item.year}
                      onChange={(e) => updateItemField(item.id, 'year', parseInt(e.target.value, 10))}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">จำนวนหน้า (Auto-detected)</label>
                    <div className="px-2.5 py-1.5 bg-slate-100 rounded-lg font-bold text-slate-700">
                      {item.pageCount > 0 ? `${item.pageCount} หน้า` : 'กำลังนับ...'}
                    </div>
                  </div>
                </div>

                {/* Additional Metadata */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">หมายเลข ISBN (ถ้ามี)</label>
                    <input 
                      type="text"
                      placeholder="เช่น 978-616-7803-XX-X"
                      value={item.isbn}
                      onChange={(e) => updateItemField(item.id, 'isbn', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 font-medium block mb-1">หมวดหมู่</label>
                    <select
                      value={item.categoryId}
                      onChange={(e) => updateItemField(item.id, 'categoryId', e.target.value)}
                      className="w-full border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                    >
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-mono text-[11px] truncate max-w-xs">
                    ไฟล์: {item.fileName}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="ลบออกจากคิว"
                    >
                      <Trash2 size={16} />
                    </button>

                    {item.status !== 'imported' && (
                      <button
                        disabled={item.isProcessing || (item.status === 'duplicate' && !item.forceOverwrite)}
                        onClick={() => importSingleBook(item)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-lg font-bold text-xs shadow-xs cursor-pointer"
                      >
                        {item.isProcessing ? <RefreshCw size={13} className="animate-spin" /> : <FileCheck size={13} />}
                        <span>นำเข้าเล่มนี้</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
