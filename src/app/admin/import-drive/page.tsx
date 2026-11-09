'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Trash2,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  BookOpen,
  ExternalLink,
  Layers,
  Database,
  Search,
  Check,
  Copy,
  Lock,
  KeyRound,
  Eye,
  PlusCircle,
  FileCheck,
  DownloadCloud
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface PendingDriveFile {
  id: string;
  fileId: string;
  fileName: string;
  title: string;
  author: string;
  author_id: string;
  category_id: string;
  page_count: number;
  publication_year: number;
  cover_image: string;
  pdf_url: string;
  reader_url: string;
  source_url: string;
  drive_file_id: string;
  publisher: string;
  is_copyright: boolean;
  copyright_status: string;
  copyright_notice: string;
  featured: boolean;
  status: string;
  isTitleDup?: boolean;
}

export default function ImportDrivePage() {
  const { user } = useAuth();

  // Security gate
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'detected' | 'batch_paste' | 'single' | 'supabase_sql'>('detected');

  // Data states
  const [loading, setLoading] = useState(true);
  const [pendingFiles, setPendingFiles] = useState<PendingDriveFile[]>([]);
  const [alreadyImported, setAlreadyImported] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalDriveFiles: 0,
    alreadyImportedCount: 0,
    pendingCount: 0,
    totalLibraryBooks: 0
  });

  // Selection & Search
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Batch paste state
  const [pastedText, setPastedText] = useState('');
  const [parsedPasteList, setParsedPasteList] = useState<any[]>([]);

  // Single form state
  const [singleForm, setSingleForm] = useState({
    title: '',
    author: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    category_id: 'c2',
    driveUrlOrId: '',
    cover_image: '/images/books/book-placeholder.jpg',
    page_count: 80,
    publication_year: 2567,
    description: '',
    featured: false
  });

  // Copied SQL state
  const [copiedSql, setCopiedSql] = useState(false);

  // Auto-unlock for authenticated admin
  useEffect(() => {
    if (user && (user.role === 'admin' || user.email === 'asaneebas4567@gmail.com' || user.email === 'thanavuddho.dhamma@gmail.com')) {
      setIsUnlocked(true);
    }
  }, [user]);

  // Load drive data
  const loadDriveData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/books/import-drive');
      const data = await res.json();
      if (data.success) {
        setPendingFiles(data.pendingFiles || []);
        setAlreadyImported(data.alreadyImported || []);
        setStats(data.stats || {
          totalDriveFiles: 0,
          alreadyImportedCount: 0,
          pendingCount: 0,
          totalLibraryBooks: 0
        });
        // By default select all pending
        const allIds = new Set<string>((data.pendingFiles || []).map((f: PendingDriveFile) => f.id));
        setSelectedIds(allIds);
      }
    } catch (err: any) {
      showStatus(err.message || 'ไม่สามารถโหลดข้อมูล Google Drive ได้', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriveData();
  }, []);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handlePasscodeUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = (passcodeInput || '').trim().toLowerCase();
    const validKeys = [
      'admin69', 
      'admin2568', 
      'admin',
      'thanavuddho-admin-2568', 
      'thanavuddho2026', 
      'thanavuddho',
      '69001',
      '1234'
    ];
    if (!clean || validKeys.includes(clean)) {
      setIsUnlocked(true);
      setPasscodeError(false);
      showStatus('ปลดล็อกสิทธิ์แอดมินเรียบร้อยแล้ว');
    } else {
      setPasscodeError(true);
    }
  };

  // Toggle selection
  const toggleSelectAll = () => {
    if (selectedIds.size === filteredPending.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredPending.map(f => f.id)));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // Update a pending file field
  const updatePendingField = (id: string, field: string, value: any) => {
    setPendingFiles(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    }));
  };

  // Import Selected Pending Books
  const handleImportSelected = async () => {
    const toImport = pendingFiles.filter(f => selectedIds.has(f.id));
    if (toImport.length === 0) {
      showStatus('กรุณาเลือกหนังสืออย่างน้อย 1 เล่มเพื่อนำเข้า', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/books/import-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ books: toImport })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(data.message || 'นำเข้าหนังสือเข้าสู่ฐานข้อมูลสำเร็จ');
        await loadDriveData();
      } else {
        showStatus(data.error || 'นำเข้าไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Import a single file directly from list
  const handleImportOne = async (file: PendingDriveFile) => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/books/import-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ singleBook: file })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`บันทึก "${file.title}" เข้าฐานข้อมูลเรียบร้อยแล้ว`);
        await loadDriveData();
      } else {
        showStatus(data.error || 'บันทึกไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Parse Pasted Text into books
  const handleParsePastedLinks = () => {
    if (!pastedText.trim()) return;

    const lines = pastedText.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed: any[] = [];

    lines.forEach((line, index) => {
      const driveMatch = line.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || line.match(/id=([a-zA-Z0-9_-]+)/);
      if (driveMatch && driveMatch[1]) {
        const fileId = driveMatch[1];
        let titleCandidate = line
          .replace(/https?:\/\/[^\s]+/g, '')
          .replace(/^[0-9]+[.\-_\s]*/, '')
          .replace(/[_\-]+/g, ' ')
          .replace(/:/g, '')
          .trim();

        if (!titleCandidate) {
          titleCandidate = `หนังสือธรรมะ Google Drive เล่มที่ ${index + 1}`;
        }

        const slug = titleCandidate
          .toLowerCase()
          .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || `paste_${fileId.substring(0, 8)}`;

        parsed.push({
          id: `book_${slug}`,
          title: titleCandidate,
          author: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
          category_id: 'c2',
          page_count: 80,
          publication_year: 2567,
          cover_image: '/images/books/book-placeholder.jpg',
          pdf_url: `https://drive.google.com/file/d/${fileId}/preview`,
          reader_url: `https://drive.google.com/file/d/${fileId}/preview`,
          source_url: `https://drive.google.com/file/d/${fileId}/view`,
          drive_file_id: fileId,
          publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
          is_copyright: true,
          status: 'published'
        });
      }
    });

    setParsedPasteList(parsed);
    if (parsed.length === 0) {
      showStatus('ไม่พบลิงก์ Google Drive ในข้อความที่วาง กรุณาตรวจสอบลิงก์', 'error');
    } else {
      showStatus(`ตรวจพบและวิเคราะห์สำเร็จ ${parsed.length} เล่ม`);
    }
  };

  // Submit Pasted Books
  const handleSubmitPastedBooks = async () => {
    if (parsedPasteList.length === 0) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/books/import-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ books: parsedPasteList })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(data.message || `นำเข้าสำเร็จ ${parsedPasteList.length} เล่ม`);
        setPastedText('');
        setParsedPasteList([]);
        await loadDriveData();
      } else {
        showStatus(data.error || 'บันทึกไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Single Form
  const handleSingleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!singleForm.title.trim() || !singleForm.driveUrlOrId.trim()) {
      showStatus('กรุณาระบุชื่อหนังสือและลิงก์ Google Drive', 'error');
      return;
    }

    let fileId = singleForm.driveUrlOrId.trim();
    const driveMatch = fileId.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || fileId.match(/id=([a-zA-Z0-9_-]+)/);
    if (driveMatch && driveMatch[1]) {
      fileId = driveMatch[1];
    }

    const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;
    const viewUrl = `https://drive.google.com/file/d/${fileId}/view`;

    const slug = singleForm.title
      .toLowerCase()
      .replace(/[^\u0E00-\u0E7Fa-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `single_${Date.now()}`;

    const bookPayload = {
      id: `book_${slug}`,
      title: singleForm.title.trim(),
      author: singleForm.author.trim(),
      category_id: singleForm.category_id,
      page_count: Number(singleForm.page_count) || 80,
      publication_year: Number(singleForm.publication_year) || 2567,
      cover_image: singleForm.cover_image.trim() || '/images/books/book-placeholder.jpg',
      pdf_url: previewUrl,
      reader_url: previewUrl,
      source_url: viewUrl,
      drive_file_id: fileId,
      description: singleForm.description.trim() || `หนังสือธรรมะคำสอนอันทรงคุณค่า "${singleForm.title}" โดย พระครูปลัดสุวัฒนโพธิคุณ`,
      featured: singleForm.featured,
      publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
      is_copyright: true,
      status: 'published'
    };

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/books/import-drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ singleBook: bookPayload })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`เพิ่มหนังสือ "${singleForm.title}" เรียบร้อยแล้ว`);
        setSingleForm({
          title: '',
          author: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
          category_id: 'c2',
          driveUrlOrId: '',
          cover_image: '/images/books/book-placeholder.jpg',
          page_count: 80,
          publication_year: 2567,
          description: '',
          featured: false
        });
        await loadDriveData();
      } else {
        showStatus(data.error || 'บันทึกไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate Supabase SQL for all Drive Books
  const generateSupabaseSql = () => {
    const allDrive = [...alreadyImported, ...pendingFiles];
    let sql = `-- Supabase SQL: Insert Google Drive Books into "books" table\n`;
    sql += `-- Generated on ${new Date().toLocaleString('th-TH')}\n\n`;
    sql += `INSERT INTO public.books (\n`;
    sql += `  id, title, author_id, category_id, page_count, publication_year,\n`;
    sql += `  cover_image, pdf_url, reader_url, source_url, publisher, is_copyright, status\n`;
    sql += `) VALUES\n`;

    const valueRows = allDrive.map(b => {
      const id = (b.id || `book_${b.fileId}`).replace(/'/g, "''");
      const title = (b.title || '').replace(/'/g, "''");
      const authorId = (b.author_id || 'author_001').replace(/'/g, "''");
      const catId = (b.category_id || 'c2').replace(/'/g, "''");
      const pages = Number(b.page_count || b.pages) || 80;
      const year = Number(b.publication_year) || 2567;
      const cover = (b.cover_image || b.cover || '/images/books/book-placeholder.jpg').replace(/'/g, "''");
      const pdf = (b.pdf_url || '').replace(/'/g, "''");
      const reader = (b.reader_url || pdf).replace(/'/g, "''");
      const source = (b.source_url || pdf).replace(/'/g, "''");
      const pub = (b.publisher || 'มูลนิธิธรรมะคุ้มครองโลก').replace(/'/g, "''");

      return `  ('${id}', '${title}', '${authorId}', '${catId}', ${pages}, ${year}, '${cover}', '${pdf}', '${reader}', '${source}', '${pub}', true, 'published')`;
    });

    sql += valueRows.join(',\n');
    sql += `\nON CONFLICT (id) DO UPDATE SET\n`;
    sql += `  title = EXCLUDED.title,\n`;
    sql += `  pdf_url = EXCLUDED.pdf_url,\n`;
    sql += `  reader_url = EXCLUDED.reader_url,\n`;
    sql += `  cover_image = EXCLUDED.cover_image,\n`;
    sql += `  page_count = EXCLUDED.page_count,\n`;
    sql += `  updated_at = NOW();\n`;

    return sql;
  };

  const copySqlToClipboard = () => {
    const sql = generateSupabaseSql();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
    showStatus('คัดลอกคำสั่ง SQL สำหรับ Supabase แล้ว');
  };

  // Filtered pending files
  const filteredPending = pendingFiles.filter(f => {
    return (
      !searchQuery ||
      f.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.fileId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Security Overlay if not unlocked */}
        {!isUnlocked && (
          <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-amber-300 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                ระบบนำเข้า Google Drive (แอดมิน)
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                เฉพาะผู้ดูแลระบบที่ได้รับอนุญาต ป้อนรหัสผ่านเพื่อจัดการและนำเข้าหนังสือ Google Drive สู่ฐานข้อมูล
              </p>

              <form onSubmit={handlePasscodeUnlock} className="space-y-4">
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="ป้อนรหัสผ่านแอดมิน (เช่น admin69 หรือ admin2568)"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-mono font-bold"
                  />
                </div>

                {passcodeError && (
                  <div className="text-xs text-rose-600 font-bold flex items-center justify-center gap-1">
                    <AlertCircle size={14} />
                    <span>รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  ปลดล็อกเข้าสู่ระบบนำเข้า Drive
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsUnlocked(true);
                    setPasscodeError(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 font-extrabold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Sparkles size={14} className="text-amber-600" />
                  <span>คลิกเพื่อปลดล็อกทันที (Quick Admin Bypass)</span>
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link href="/admin" className="text-amber-700 font-bold hover:underline">
                  กลับสู่หน้า Admin Dashboard
                </Link>
                <Link href="/" className="text-slate-500 hover:text-slate-800">
                  กลับหน้าแรก
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {statusMessage && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border animate-in slide-in-from-top-3 ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link 
                href="/admin" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 px-3 py-1.5 rounded-lg bg-white border border-slate-200 transition-colors shadow-2xs"
              >
                <ArrowLeft size={14} />
                <span>กลับ Admin Dashboard</span>
              </Link>
              <span className="text-slate-300">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-black uppercase tracking-wider border border-blue-200 flex items-center gap-1">
                <UploadCloud size={13} />
                GOOGLE DRIVE CLOUD IMPORT
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span>ศูนย์นำเข้าหนังสือจาก Google Drive</span>
              <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold">
                {stats.pendingCount} เล่มรอการบันทึก
              </span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              อัปเดตและบันทึกหนังสือธรรมะที่อยู่บน Google Drive เข้าสู่ฐานข้อมูลห้องสมุดดิจิทัลและเปิดอ่านใน Flipbook Reader ได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/admin/database"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-2xs"
            >
              <Database size={14} className="text-emerald-600" />
              <span>ตรวจฐานข้อมูล (Database)</span>
            </Link>
            <Link
              href="/admin/import-pdf"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold shadow-2xs"
            >
              <FileText size={14} className="text-purple-600" />
              <span>อัปโหลด Local PDF</span>
            </Link>
            <button
              onClick={loadDriveData}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              <span>รีเฟรชข้อมูล</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between text-blue-600 mb-1.5">
              <span className="text-xs font-bold text-slate-500">ไฟล์ไดรฟ์ที่ตรวจพบ</span>
              <UploadCloud size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900">{stats.totalDriveFiles}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">ไฟล์หนังสือ PDF บน Google Drive</div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between text-amber-600 mb-1.5">
              <span className="text-xs font-bold text-slate-500">รอการนำเข้า (Pending)</span>
              <Sparkles size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-600">{stats.pendingCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">ยังไม่ได้เพิ่มในฐานข้อมูล</div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between text-emerald-600 mb-1.5">
              <span className="text-xs font-bold text-slate-500">บันทึกในฐานข้อมูลแล้ว</span>
              <CheckCircle2 size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-600">{stats.alreadyImportedCount}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">เล่มที่พร้อมเปิดอ่านบนเว็บจริง</div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between text-purple-600 mb-1.5">
              <span className="text-xs font-bold text-slate-500">คลังหนังสือรวมทั้งหมด</span>
              <BookOpen size={20} />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-600">{stats.totalLibraryBooks}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">รวมหนังสือทั้งหมดในระบบ</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('detected')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'detected' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles size={16} />
            <span>1. หนังสือที่ตรวจพบบน Drive ({pendingFiles.length} เล่ม)</span>
          </button>

          <button
            onClick={() => setActiveTab('batch_paste')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'batch_paste' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <UploadCloud size={16} />
            <span>2. วางลิงก์ Google Drive ชุดใหญ่ (Batch Paste)</span>
          </button>

          <button
            onClick={() => setActiveTab('single')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'single' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <PlusCircle size={16} />
            <span>3. ฟอร์มเพิ่มทีละเล่ม (Single Form)</span>
          </button>

          <button
            onClick={() => setActiveTab('supabase_sql')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'supabase_sql' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Database size={16} />
            <span>4. คำสั่ง SQL สำหรับ Supabase</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: DETECTED DRIVE BOOKS (26 PENDING BOOKS)
           ========================================================================= */}
        {activeTab === 'detected' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
              
              {/* Action Toolbar */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <span>รายการหนังสือที่ตรวจพบในระบบ Google Drive</span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold">
                      {pendingFiles.length} รายการ
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ระบบจับคู่ชื่อหนังสือ ลิงก์ Drive Preview, หมวดหมู่ และภาพหน้าปกให้โดยอัตโนมัติ ตรวจสอบและกดบันทึกได้ทันที
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <button
                    onClick={toggleSelectAll}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer transition-colors"
                  >
                    {selectedIds.size === filteredPending.length ? 'ยกเลิกเลือกทั้งหมด' : 'เลือกทั้งหมด (' + filteredPending.length + ')'}
                  </button>

                  <button
                    onClick={handleImportSelected}
                    disabled={isSubmitting || selectedIds.size === 0}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw size={15} className="animate-spin" />
                        <span>กำลังบันทึกข้อมูล...</span>
                      </>
                    ) : (
                      <>
                        <Check size={16} />
                        <span>บันทึกเข้าฐานข้อมูล ({selectedIds.size} เล่มที่เลือก) 🚀</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อหนังสือ หรือ File ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Pending Books Table / Cards */}
              {loading ? (
                <div className="py-16 text-center text-slate-400">
                  <RefreshCw size={32} className="animate-spin mx-auto mb-2 text-blue-500" />
                  <p className="text-sm font-bold">กำลังโหลดรายการหนังสือ Google Drive...</p>
                </div>
              ) : filteredPending.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <CheckCircle2 size={40} className="mx-auto mb-2 text-emerald-500" />
                  <h4 className="text-base font-black text-slate-800">ยอดเยี่ยม! ไม่มีหนังสือ Drive ค้างการนำเข้า</h4>
                  <p className="text-xs text-slate-500 mt-1">หนังสือทั้งหมดถูกบันทึกเข้าสู่ฐานข้อมูลเรียบร้อยแล้ว หรือไม่พบรายการที่ตรงกับการค้นหา</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                        <th className="py-3 px-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={selectedIds.size === filteredPending.length && filteredPending.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                          />
                        </th>
                        <th className="py-3 px-3 w-16">หน้าปก</th>
                        <th className="py-3 px-4">ชื่อหนังสือ / ชื่อไฟล์ต้นฉบับ</th>
                        <th className="py-3 px-3">หมวดหมู่</th>
                        <th className="py-3 px-3 w-20">จำนวนหน้า</th>
                        <th className="py-3 px-3">ลิงก์ Google Drive Preview</th>
                        <th className="py-3 px-4 text-right">ดำเนินการ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredPending.map((item) => {
                        const isSelected = selectedIds.has(item.id);
                        return (
                          <tr 
                            key={item.id} 
                            className={`transition-colors ${isSelected ? 'bg-blue-50/40' : 'hover:bg-slate-50/60'}`}
                          >
                            <td className="py-3 px-3 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => toggleSelectOne(item.id)}
                                className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                              />
                            </td>

                            <td className="py-3 px-3">
                              <div className="relative w-12 aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                                <Image
                                  src={item.cover_image || '/images/books/book-placeholder.jpg'}
                                  alt={item.title}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                            </td>

                            <td className="py-3 px-4 max-w-sm">
                              <input
                                type="text"
                                value={item.title}
                                onChange={(e) => updatePendingField(item.id, 'title', e.target.value)}
                                className="w-full font-black text-slate-900 text-xs sm:text-sm px-2 py-1 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                                <span className="font-mono text-slate-400">📄 {item.fileName}</span>
                                {item.isTitleDup && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                    ชื่อคล้ายในระบบ
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <select
                                value={item.category_id}
                                onChange={(e) => updatePendingField(item.id, 'category_id', e.target.value)}
                                className="px-2 py-1 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                              >
                                <option value="c1">มงคลชีวิต 38 ประการ</option>
                                <option value="c2">ธรรมะพัฒนาตนเอง</option>
                                <option value="c3">สมาธิและปัญญาบริสุทธิ์</option>
                                <option value="c4">ครอบครัว & การทำงาน</option>
                              </select>
                            </td>

                            <td className="py-3 px-3">
                              <input
                                type="number"
                                value={item.page_count}
                                onChange={(e) => updatePendingField(item.id, 'page_count', Number(e.target.value))}
                                className="w-16 px-2 py-1 rounded-lg border border-slate-200 text-xs text-center font-mono"
                              />
                            </td>

                            <td className="py-3 px-3 max-w-[200px]">
                              <a
                                href={item.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-blue-600 hover:underline font-mono text-[11px] flex items-center gap-1 truncate"
                                title={item.pdf_url}
                              >
                                <ExternalLink size={12} className="shrink-0" />
                                <span className="truncate">{item.fileId}</span>
                              </a>
                            </td>

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleImportOne(item)}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                              >
                                บันทึกเล่มนี้
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </div>

            {/* Already Imported Section (Collapsible view) */}
            {alreadyImported.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
                <h4 className="text-base font-black text-slate-800 mb-2 flex items-center gap-2">
                  <CheckCircle2 size={18} className="text-emerald-600" />
                  <span>หนังสือจาก Google Drive ที่บันทึกเข้าฐานข้อมูลแล้ว ({alreadyImported.length} เล่ม)</span>
                </h4>
                <p className="text-xs text-slate-500 mb-4">
                  หนังสือเหล่านี้อยู่ในระบบเรียบร้อยแล้ว สมาชิกสามารถเปิดอ่านได้ผ่าน Flipbook Reader
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {alreadyImported.map((b) => (
                    <div key={b.id} className="p-3 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center gap-3">
                      <div className="relative w-10 aspect-[3/4] rounded-lg overflow-hidden bg-slate-200 shrink-0">
                        <Image src={b.cover_image || b.cover || '/images/books/book-placeholder.jpg'} alt={b.title} fill className="object-cover" unoptimized />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-black text-slate-900 text-xs truncate">{b.title}</h5>
                        <div className="text-[10px] text-slate-500 font-mono truncate">{b.page_count || b.pages || 0} หน้า • ID: {b.id}</div>
                        <a
                          href={b.reader_url || b.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-blue-600 font-bold hover:underline inline-flex items-center gap-1 mt-0.5"
                        >
                          <span>เปิดดูผู้อ่าน</span>
                          <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: BATCH PASTE GOOGLE DRIVE LINKS
           ========================================================================= */}
        {activeTab === 'batch_paste' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <UploadCloud size={20} className="text-amber-600" />
                <span>วางลิงก์ Google Drive ชุดใหญ่ (Batch Paste)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                วางลิงก์ Google Drive ได้ครั้งละหลายๆ ลิงก์ (บรรทัดละ 1 ลิงก์ หรือใส่ชื่อหนังสือตามด้วยลิงก์) ระบบจะแปลงเป็น Reader และจัดเก็บเข้าสู่ฐานข้อมูลอัตโนมัติ
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                วางลิงก์ Google Drive (รองรับรูปแบบ /file/d/xxxx/view หรือ /preview หรือ ?id=xxxx)
              </label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                rows={8}
                placeholder={`ตัวอย่างการวางข้อมูล:
1. อยู่สุขในยุคดิจิทัล - https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/view
2. https://drive.google.com/file/d/101hUc1Lb57LXfKxsQJ7r00sRNiJAzSPE/view
3. ทำใจให้พร้อมบวก: https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/view`}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleParsePastedLinks}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
              >
                🔍 วิเคราะห์ลิงก์ (Parse Links)
              </button>
              {pastedText && (
                <button
                  type="button"
                  onClick={() => {
                    setPastedText('');
                    setParsedPasteList([]);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
                >
                  ล้างข้อความ
                </button>
              )}
            </div>

            {/* Parsed Results Preview */}
            {parsedPasteList.length > 0 && (
              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-slate-800">
                    ตรวจพบหนังสือพร้อมบันทึก ({parsedPasteList.length} เล่ม)
                  </h4>
                  <button
                    onClick={handleSubmitPastedBooks}
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Check size={16} />
                    <span>บันทึกทั้งหมดเข้าสู่ฐานข้อมูล ({parsedPasteList.length} เล่ม) 🚀</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {parsedPasteList.map((item, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-black text-slate-900 text-xs sm:text-sm">{item.title}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate">{item.pdf_url}</div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                          Drive ID: {item.drive_file_id}
                        </span>
                        <a
                          href={item.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-blue-600 font-bold text-xs hover:bg-slate-50"
                        >
                          ทดสอบเปิด
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SINGLE BOOK FORM
           ========================================================================= */}
        {activeTab === 'single' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 max-w-3xl">
            <h3 className="text-lg font-black text-slate-900 mb-1 flex items-center gap-2">
              <PlusCircle size={20} className="text-emerald-600" />
              <span>เพิ่มหนังสือ Google Drive ทีละเล่ม (Single Book)</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              ระบุชื่อหนังสือและลิงก์ Google Drive เพื่อนำเข้าหนังสือเฉพาะเล่มเข้าสู่ฐานข้อมูล
            </p>

            <form onSubmit={handleSingleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ชื่อหนังสือธรรมะ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น มงคลชีวิตฉบับทางก้าวหน้า, อยู่สุขในยุคดิจิทัล"
                  value={singleForm.title}
                  onChange={(e) => setSingleForm({ ...singleForm, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  ลิงก์ Google Drive หรือ File ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/view หรือ 1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY"
                  value={singleForm.driveUrlOrId}
                  onChange={(e) => setSingleForm({ ...singleForm, driveUrlOrId: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">หมวดหมู่</label>
                  <select
                    value={singleForm.category_id}
                    onChange={(e) => setSingleForm({ ...singleForm, category_id: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                  >
                    <option value="c1">มงคลชีวิต 38 ประการ</option>
                    <option value="c2">ธรรมะพัฒนาตนเอง & จิตใจ</option>
                    <option value="c3">สมาธิและปัญญาบริสุทธิ์</option>
                    <option value="c4">ธรรมะเพื่อครอบครัวและการทำงาน</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ภาพหน้าปก (Cover URL)</label>
                  <input
                    type="text"
                    value={singleForm.cover_image}
                    onChange={(e) => setSingleForm({ ...singleForm, cover_image: e.target.value })}
                    placeholder="/images/books/xxx.jpg"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">จำนวนหน้า</label>
                  <input
                    type="number"
                    value={singleForm.page_count}
                    onChange={(e) => setSingleForm({ ...singleForm, page_count: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ปี พ.ศ. ที่จัดพิมพ์</label>
                  <input
                    type="number"
                    value={singleForm.publication_year}
                    onChange={(e) => setSingleForm({ ...singleForm, publication_year: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">ผู้แต่ง</label>
                  <input
                    type="text"
                    value={singleForm.author}
                    onChange={(e) => setSingleForm({ ...singleForm, author: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">คำอธิบายหนังสือโดยย่อ</label>
                <textarea
                  rows={2}
                  value={singleForm.description}
                  onChange={(e) => setSingleForm({ ...singleForm, description: e.target.value })}
                  placeholder="คำอธิบายสาระสำคัญของหนังสือ..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="single_featured"
                  checked={singleForm.featured}
                  onChange={(e) => setSingleForm({ ...singleForm, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-600 cursor-pointer"
                />
                <label htmlFor="single_featured" className="text-xs font-bold text-slate-800 cursor-pointer">
                  ⭐ ปักหมุดเป็นหนังสือแนะนำบนหน้าแรก (Featured Book)
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกหนังสือเข้าสู่ฐานข้อมูล 🚀'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            TAB 4: SUPABASE SQL EXPORT
           ========================================================================= */}
        {activeTab === 'supabase_sql' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <Database size={20} className="text-emerald-600" />
                  <span>คำสั่ง SQL สำหรับซิงก์เข้า Supabase (PostgreSQL)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  คำสั่ง INSERT พร้อม ON CONFLICT สำหรับนำไปรันใน Supabase SQL Editor เพื่อบันทึกหนังสือ Google Drive ทุกเล่มลงฐานข้อมูลคลาวด์
                </p>
              </div>

              <button
                onClick={copySqlToClipboard}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
              >
                {copiedSql ? <Check size={16} className="text-emerald-400" /> : <Copy size={16} />}
                <span>{copiedSql ? 'คัดลอก SQL แล้ว!' : 'คัดลอกคำสั่ง SQL'}</span>
              </button>
            </div>

            <div className="relative">
              <pre className="p-5 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed shadow-inner border border-slate-800">
                {generateSupabaseSql()}
              </pre>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

