'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Users,
  BookOpen,
  Video,
  Headphones,
  Eye,
  Plus,
  Edit,
  Trash2,
  Database,
  Sparkles,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Save,
  X,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  Star,
  Play,
  FileText,
  Globe,
  Flame,
  Lock,
  KeyRound,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  EyeOff,
  Image as ImageIcon,
  FileSpreadsheet,
  BarChart3,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { FlexibleShowcaseItem, ShowcaseItemType } from '@/types';

export default function AdminDashboardPage() {
  const { user, isAuthenticated } = useAuth();

  // Security Unlock (Passcode fallback for offline presentations or direct browser access)
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [passcodeError, setPasscodeError] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'videos' | 'podcasts' | 'home_showcase' | 'users'>('overview');

  // Data States
  const [books, setBooks] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [podcasts, setPodcasts] = useState<any[]>([]);
  const [homeSettings, setHomeSettings] = useState<any>({
    announcementTitle: 'ยินดีต้อนรับสู่ Thanavuddho Digital Library',
    announcementSubtitle: 'คลังธรรมะดิจิทัล รวบรวมหนังสือ ข้อคิดธรรมะ พอดแคสต์ และวิดีโอธรรมบรรยาย พระครูปลัดสุวัฒนโพธิคุณ',
    bannerImageUrl: '/hero-image-modern.jpg',
    bannerLink: '/books',
    bannerButtonText: 'สำรวจคลังหนังสือธรรมะ',
    featuredBookIds: [],
    featuredVideoId: ''
  });
  const [usersList, setUsersList] = useState<any[]>([]);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  // Modals
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any | null>(null);

  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<any | null>(null);

  const [podcastModalOpen, setPodcastModalOpen] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState<any | null>(null);
  const [podcastSourceType, setPodcastSourceType] = useState<'youtube' | 'mp3'>('youtube');
  const [isUploadingMp3, setIsUploadingMp3] = useState(false);
  const [uploadedMp3Url, setUploadedMp3Url] = useState('');
  const [uploadedMp3Path, setUploadedMp3Path] = useState('');

  // Flexible Showcase State
  const [showcaseModalOpen, setShowcaseModalOpen] = useState(false);
  const [editingShowcaseItem, setEditingShowcaseItem] = useState<FlexibleShowcaseItem | null>(null);
  const [selectedShowcaseType, setSelectedShowcaseType] = useState<ShowcaseItemType>('BOOK_SHOWCASE');

  // Status message
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-unlock if logged in as Admin or if active session exists
  useEffect(() => {
    if (user && (user.role === 'admin' || user.email === 'asaneebas4567@gmail.com' || user.email === 'thanavuddho.dhamma@gmail.com')) {
      setIsUnlocked(true);
      return;
    }
    if (typeof window !== 'undefined') {
      const saved = sessionStorage.getItem('thanavuddho_admin_session') || localStorage.getItem('thanavuddho_admin_session');
      if (saved === 'active') {
        setIsUnlocked(true);
      }
    }
  }, [user]);

  // Load all data on mount
  useEffect(() => {
    fetchBooks();
    fetchVideos();
    fetchPodcasts();
    fetchHomeSettings();
    fetchUsers();
  }, []);

  const showStatus = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ text, type });
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const handleLockAdmin = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('thanavuddho_admin_session');
      localStorage.removeItem('thanavuddho_admin_session');
    }
    showStatus('ล็อกเซสชันผู้ดูแลระบบเรียบร้อยแล้ว');
  };

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/admin/books');
      const data = await res.json();
      if (data.success && Array.isArray(data.books)) {
        setBooks(data.books);
      }
    } catch { }
  };

  const fetchVideos = async () => {
    try {
      const res = await fetch('/api/admin/videos');
      const data = await res.json();
      if (data.success && Array.isArray(data.videos)) {
        setVideos(data.videos);
      }
    } catch { }
  };

  const fetchPodcasts = async () => {
    try {
      const res = await fetch('/api/admin/podcasts');
      const data = await res.json();
      if (data.success && Array.isArray(data.podcasts)) {
        setPodcasts(data.podcasts);
      }
    } catch { }
  };

  const fetchHomeSettings = async () => {
    try {
      const res = await fetch('/api/admin/home-settings');
      const data = await res.json();
      if (data.success && data.settings) {
        setHomeSettings(data.settings);
      }
    } catch { }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/user/sync?email=all');
      // If endpoint doesn't support 'all', fallback to known users
    } catch { }
  };

  // Passcode verification
  const handlePasscodeUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = passcodeInput.trim();
    if (clean === 'admin69' || clean === 'thanavuddho2026' || clean === '69001') {
      setIsUnlocked(true);
      setPasscodeError(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('thanavuddho_admin_session', 'active');
        localStorage.setItem('thanavuddho_admin_session', 'active');
      }
      showStatus('ปลดล็อกสิทธิ์ผู้ดูแลระบบเรียบร้อยแล้ว');
    } else {
      setPasscodeError(true);
    }
  };

  // ----------------------------------------------------
  // BOOK CRUD HANDLERS
  // ----------------------------------------------------
  const handleSaveBook = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingBook?.id || '',
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      category_id: formData.get('category_id') as string,
      description: formData.get('description') as string,
      pdf_url: formData.get('pdf_url') as string,
      reader_url: formData.get('reader_url') as string,
      source_url: formData.get('source_url') as string,
      cover_image: formData.get('cover_image') as string,
      page_count: formData.get('page_count') as string,
      publication_year: formData.get('publication_year') as string,
      publisher: formData.get('publisher') as string,
      status: formData.get('status') as string,
      featured: formData.get('featured') === 'on'
    };

    try {
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data.success) {
        showStatus(data.message || 'บันทึกข้อมูลหนังสือสำเร็จ');
        setBookModalOpen(false);
        setEditingBook(null);
        fetchBooks();
      } else {
        showStatus(data.error || 'เกิดข้อผิดพลาดในการบันทึก', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBook = async (bookId: string, bookTitle: string) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือ "${bookTitle}"?`)) return;

    try {
      const res = await fetch(`/api/admin/books?id=${encodeURIComponent(bookId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`ลบหนังสือ "${bookTitle}" เรียบร้อยแล้ว`);
        fetchBooks();
      } else {
        showStatus(data.error || 'ไม่สามารถลบหนังสือได้', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    }
  };

  const handleToggleBookFeatured = async (book: any) => {
    try {
      const updated = {
        ...book,
        featured: !book.featured
      };
      const res = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated)
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`${book.featured ? 'ยกเลิก' : 'ตั้งค่า'} หนังสือแนะนำหน้าแรกเรียบร้อยแล้ว`);
        fetchBooks();
      }
    } catch { }
  };

  // ----------------------------------------------------
  // VIDEO CRUD HANDLERS
  // ----------------------------------------------------
  const handleSaveVideo = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const rawUrl = (formData.get('url') as string) || '';
    const isTikTok = rawUrl.includes('tiktok.com');

    const videoData = {
      id: editingVideo?.id || '',
      platform: isTikTok ? 'tiktok' : 'youtube',
      title: formData.get('title') as string,
      url: rawUrl,
      youtubeId: formData.get('youtubeId') as string,
      description: formData.get('description') as string,
      channelName: formData.get('channelName') as string,
      tags: formData.get('tags') as string,
      status: formData.get('status') as string
    };

    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', video: videoData })
      });
      const data = await res.json();
      if (data.success) {
        showStatus('บันทึกข้อมูลวิดีโอเรียบร้อยแล้ว');
        setVideoModalOpen(false);
        setEditingVideo(null);
        fetchVideos();
      } else {
        showStatus(data.error || 'บันทึกไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (videoId: string, title: string) => {
    if (!confirm(`ต้องการลบวิดีโอ "${title}" ใช่หรือไม่?`)) return;
    try {
      const res = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete', id: videoId })
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`ลบวิดีโอ "${title}" เรียบร้อยแล้ว`);
        fetchVideos();
      }
    } catch { }
  };

  // ----------------------------------------------------
  // PODCAST CRUD & MP3 UPLOAD HANDLERS
  // ----------------------------------------------------
  const handleUploadMp3File = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingMp3(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const res = await fetch('/api/admin/podcasts/upload', {
        method: 'POST',
        body
      });
      const data = await res.json();
      if (data.success) {
        setUploadedMp3Url(data.publicUrl);
        setUploadedMp3Path(data.storagePath);
        showStatus(`อัปโหลดไฟล์เสียงสำเร็จ (${(data.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB)`);
      } else {
        showStatus(data.error || 'อัปโหลดไฟล์เสียงไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsUploadingMp3(false);
    }
  };

  const handleSavePodcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      id: editingPodcast?.id || '',
      title: formData.get('title') as string,
      host: formData.get('host') as string,
      source_type: podcastSourceType,
      youtube_url: formData.get('youtube_url') as string,
      audio_url: uploadedMp3Url || (formData.get('audio_url') as string),
      audio_file_path: uploadedMp3Path,
      cover_image: formData.get('cover_image') as string,
      duration_formatted: formData.get('duration') as string,
      category_id: formData.get('category_id') as string,
      description: formData.get('description') as string,
      is_published: formData.get('is_published') === 'on'
    };

    try {
      const res = await fetch('/api/admin/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showStatus('บันทึกข้อมูล Podcast เรียบร้อยแล้ว');
        setPodcastModalOpen(false);
        setEditingPodcast(null);
        setUploadedMp3Url('');
        setUploadedMp3Path('');
        fetchPodcasts();
      } else {
        showStatus(data.error || 'บันทึกไม่สำเร็จ', 'error');
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePodcast = async (id: string, title: string) => {
    if (!confirm(`ต้องการลบ Podcast "${title}" หรือไม่?`)) return;
    try {
      const res = await fetch(`/api/admin/podcasts?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        showStatus(`ลบ Podcast "${title}" เรียบร้อยแล้ว`);
        fetchPodcasts();
      }
    } catch { }
  };

  // ----------------------------------------------------
  // HOME SHOWCASE HANDLER
  // ----------------------------------------------------
  const handleSaveHomeSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    const payload = {
      ...homeSettings,
      announcementTitle: formData.get('announcementTitle') as string,
      announcementSubtitle: formData.get('announcementSubtitle') as string,
      bannerImageUrl: formData.get('bannerImageUrl') as string,
      bannerLink: formData.get('bannerLink') as string,
      bannerButtonText: formData.get('bannerButtonText') as string
    };

    try {
      const res = await fetch('/api/admin/home-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showStatus('บันทึกการตั้งค่าหน้าแรกเรียบร้อยแล้ว! ข้อมูลจะปรากฏบนหน้าแรกทันที');
        setHomeSettings(data.settings);
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------
  // FLEXIBLE SHOWCASE SYSTEM HANDLERS
  // ----------------------------------------------------
  const handleSaveShowcaseItems = async (updatedItems: FlexibleShowcaseItem[]) => {
    setIsSubmitting(true);
    const payload = {
      ...homeSettings,
      showcaseItems: updatedItems
    };

    try {
      const res = await fetch('/api/admin/home-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        showStatus('บันทึกรายการไฮไลต์หน้าแรกเรียบร้อยแล้ว!');
        setHomeSettings(data.settings);
      }
    } catch (err: any) {
      showStatus(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAddShowcase = () => {
    setEditingShowcaseItem(null);
    setSelectedShowcaseType('BOOK_SHOWCASE');
    setShowcaseModalOpen(true);
  };

  const handleOpenEditShowcase = (item: FlexibleShowcaseItem) => {
    setEditingShowcaseItem(item);
    setSelectedShowcaseType(item.type);
    setShowcaseModalOpen(true);
  };

  const handleToggleActiveShowcase = async (id: string) => {
    const currentItems: FlexibleShowcaseItem[] = homeSettings.showcaseItems || [];
    const updated = currentItems.map(item => 
      item.id === id ? { ...item, is_active: !item.is_active } : item
    );
    await handleSaveShowcaseItems(updated);
  };

  const handleDeleteShowcase = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้ออกจากหน้าแรก?')) return;
    const currentItems: FlexibleShowcaseItem[] = homeSettings.showcaseItems || [];
    const updated = currentItems.filter(item => item.id !== id);
    await handleSaveShowcaseItems(updated);
  };

  const handleMoveShowcase = async (index: number, direction: 'up' | 'down') => {
    const currentItems: FlexibleShowcaseItem[] = [...(homeSettings.showcaseItems || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentItems.length) return;

    const temp = currentItems[index];
    currentItems[index] = currentItems[targetIndex];
    currentItems[targetIndex] = temp;

    const updated = currentItems.map((item, idx) => ({ ...item, order: idx + 1 }));
    await handleSaveShowcaseItems(updated);
  };

  const handleSaveShowcaseForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const type = selectedShowcaseType;

    const currentItems: FlexibleShowcaseItem[] = [...(homeSettings.showcaseItems || [])];

    const newItem: FlexibleShowcaseItem = {
      id: editingShowcaseItem ? editingShowcaseItem.id : `showcase-${Date.now()}`,
      type,
      title: (formData.get('title') as string) || '',
      author: (formData.get('author') as string) || '',
      description: (formData.get('description') as string) || '',
      image_url: (formData.get('image_url') as string) || '',
      image_url_mobile: (formData.get('image_url_mobile') as string) || '',
      book_id: (formData.get('book_id') as string) || '',
      target_url: (formData.get('target_url') as string) || '',
      is_clickable: formData.get('is_clickable') === 'true',
      order: Number(formData.get('order')) || (currentItems.length + 1),
      is_active: formData.get('is_active') === 'true',
      fit_mode: (formData.get('fit_mode') as 'contain' | 'cover') || 'contain',
      badge: (formData.get('badge') as string) || '',
      action_label: (formData.get('action_label') as string) || 'เปิดอ่านหนังสือ (Flipbook)'
    };

    let updated: FlexibleShowcaseItem[];
    if (editingShowcaseItem) {
      updated = currentItems.map(item => item.id === editingShowcaseItem.id ? newItem : item);
    } else {
      updated = [...currentItems, newItem];
    }

    updated.sort((a, b) => (a.order || 0) - (b.order || 0));

    await handleSaveShowcaseItems(updated);
    setShowcaseModalOpen(false);
    setIsSubmitting(false);
  };

  // Calculate Metrics
  const totalBooksCount = books.length;
  const totalVideosCount = videos.length;
  const totalPodcastsCount = podcasts.length;
  const totalReadCount = books.reduce((acc, b) => acc + (b.read_count || 0), 0);
  const featuredBooksCount = books.filter(b => b.featured).length;

  // Filtered books
  const filteredBooks = books.filter(b => {
    const matchesSearch = !searchQuery ||
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.author && b.author.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat = filterCategory === 'all' || b.category_id === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Security Gate Overlay if not unlocked */}
        {!isUnlocked && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border-2 border-amber-300 text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Lock size={32} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-1">
                ระบบจัดการระดับผู้ดูแลระบบ (Admin Access)
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                เฉพาะผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น เข้าสู่ระบบด้วยบัญชีแอดมินหรือป้อนรหัสผ่านด่วนเพื่อเข้าใช้งาน
              </p>

              <form onSubmit={handlePasscodeUnlock} className="space-y-4">
                <div className="relative">
                  <KeyRound size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    placeholder="ป้อนรหัสผ่านแอดมิน (เช่น admin69)"
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
                  ปลดล็อกเข้าสู่แผงควบคุม
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link href="/login?redirect=/admin" className="text-amber-700 font-bold hover:underline">
                  เข้าสู่ระบบด้วย Google / อีเมล
                </Link>
                <Link href="/" className="text-slate-500 hover:text-slate-800">
                  กลับหน้าแรกห้องสมุด
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Global Feedback Alert */}
        {statusMessage && (
          <div className={`fixed top-4 right-4 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-bold border animate-in slide-in-from-top-3 ${statusMessage.type === 'success'
            ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
            : 'bg-rose-50 border-rose-300 text-rose-900'
            }`}>
            {statusMessage.type === 'success' ? <CheckCircle2 size={18} className="text-emerald-600" /> : <AlertCircle size={18} className="text-rose-600" />}
            <span>{statusMessage.text}</span>
          </div>
        )}

        {/* Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider border border-emerald-300 flex items-center gap-1">
                <ShieldCheck size={14} />
                ADMIN CONTROL SUITE
              </span>
              <span className="text-xs font-semibold text-slate-500">
                ระบบจัดการสารสนเทศห้องสมุดดิจิทัลครบวงจร
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ศูนย์บริหารจัดการห้องสมุด (Admin Management Portal)
            </h1>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/admin/surveys"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 text-white font-extrabold text-xs shadow-md hover:from-amber-500 hover:to-amber-600 transition-all active:scale-95"
            >
              <FileSpreadsheet size={15} />
              <span>ผลแบบประเมิน & 200 แต้ม 📊</span>
            </Link>
            <Link
              href="/admin/database"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-extrabold text-xs shadow-md hover:from-emerald-500 hover:to-teal-600 transition-all active:scale-95"
            >
              <Database size={15} />
              <span>ฐานข้อมูล Supabase (Schema) 🗄️</span>
            </Link>
            <Link
              href="/admin/import-drive"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
            >
              <UploadCloud size={15} className="text-amber-300" />
              <span>นำเข้า Google Drive (26 เล่มรอซิงก์) ☁️</span>
            </Link>
            <Link
              href="/admin/import-pdf"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Plus size={15} className="text-amber-400" />
              <span>นำเข้า PDF สกัดปกอัตโนมัติ</span>
            </Link>
            <Link
              href="/books"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95"
            >
              <span>เปิดดูหน้าบ้าน (Live Web)</span>
              <ExternalLink size={13} />
            </Link>
            <button
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-200 hover:bg-rose-100 hover:text-rose-700 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              title="ล็อกเซสชันผู้ดูแลระบบ"
            >
              <Lock size={13} />
              <span>ล็อกเซสชัน</span>
            </button>
          </div>
        </div>

        {/* Real-time Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-blue-600 mb-2">
              <span className="text-xs font-bold text-slate-500">คลังหนังสือจริง</span>
              <BookOpen size={20} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalBooksCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">เล่มในฐานข้อมูล ({featuredBooksCount} เล่มเด่น)</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-rose-600 mb-2">
              <span className="text-xs font-bold text-slate-500">คลังวิดีโอธรรมะ</span>
              <Video size={20} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalVideosCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">คลิปและ Fallback YouTube</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-purple-600 mb-2">
              <span className="text-xs font-bold text-slate-500">พอดแคสต์ & เสียงอ่าน</span>
              <Headphones size={20} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalPodcastsCount}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">รายการเสียงบรรยายธรรม</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div className="flex items-center justify-between text-emerald-600 mb-2">
              <span className="text-xs font-bold text-slate-500">สถิติการเปิดอ่าน</span>
              <Eye size={20} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalReadCount.toLocaleString()}</div>
              <div className="text-[11px] text-slate-500 mt-0.5">ครั้งการเข้าศึกษาหนังสือ</div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between text-amber-600 mb-2">
              <span className="text-xs font-bold text-slate-500">ฐานสมาชิกจริง</span>
              <Users size={20} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900">3</div>
              <div className="text-[11px] text-slate-500 mt-0.5">รหัสสมาชิก 69000..69002</div>
            </div>
          </div>

        </div>

        {/* PROMINENT ACTION HUB: ศูนย์นำเข้า & จัดการข้อมูลสื่อธรรมะ */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-700/60 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] uppercase">
                  Data Ingestion & Updates
                </span>
                <span className="text-xs text-slate-300 font-semibold">
                  ศูนย์รับเข้าและอัปเดตข้อมูลเข้าคลัง
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2.5">
                <Sparkles size={22} className="text-amber-400" />
                <span>เพิ่มหนังสือ วิดีโอ และอัปเดตฐานข้อมูล (Admin Action Hub)</span>
              </h2>
            </div>
            <Link
              href="/admin/database"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-all active:scale-95 shrink-0"
            >
              <Database size={15} />
              <span>เปิดดูตารางฐานข้อมูลจริง (11 ตาราง) →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* 1. Add Books Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-3 border border-blue-400/30">
                  <BookOpen size={20} />
                </div>
                <h3 className="font-black text-white text-base">เพิ่มหนังสือใหม่</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  กรอกชื่อหนังสือ แนบไฟล์ PDF หรือพิกัด Flipbook เพื่อเพิ่มเข้าสู่ระบบทันที
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEditingBook(null);
                    setBookModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>+ โพสต์หนังสือเล่มใหม่</span>
                </button>
                <div className="grid grid-cols-2 gap-1.5">
                  <Link
                    href="/admin/import-pdf"
                    className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-blue-200 text-center font-bold text-[11px] transition-colors"
                  >
                    สกัดปก PDF
                  </Link>
                  <Link
                    href="/admin/import-drive"
                    className="py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-indigo-200 text-center font-bold text-[11px] transition-colors"
                  >
                    ซิงก์ Drive
                  </Link>
                </div>
              </div>
            </div>

            {/* 2. Add Videos Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold mb-3 border border-rose-400/30">
                  <Video size={20} />
                </div>
                <h3 className="font-black text-white text-base">เพิ่มคลิปวิดีโอ</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  แนบลิงก์คลิป YouTube ID ระบบดึงภาพ Thumbnail และจัดเก็บลงฐานข้อมูล
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>+ โพสต์วิดีโอใหม่</span>
                </button>
                <Link
                  href="/admin/videos"
                  className="block py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-rose-200 text-center font-bold text-[11px] transition-colors"
                >
                  จัดการคลังวิดีโอ & บทถอดเสียง
                </Link>
              </div>
            </div>

            {/* 3. Add Podcasts Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-3 border border-purple-400/30">
                  <Headphones size={20} />
                </div>
                <h3 className="font-black text-white text-base">เพิ่มพอดแคสต์ & MP3</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  อัปโหลดไฟล์เสียงอ่านธรรมะ MP3 หรือแนบลิงก์เสียงออนไลน์
                </p>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setEditingPodcast(null);
                    setPodcastModalOpen(true);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={15} />
                  <span>+ โพสต์ Podcast ใหม่</span>
                </button>
                <button
                  onClick={() => setActiveTab('podcasts')}
                  className="w-full py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-purple-200 text-center font-bold text-[11px] transition-colors cursor-pointer"
                >
                  ดูรายการเสียงอ่านทั้งหมด
                </button>
              </div>
            </div>

            {/* 4. Quests & Surveys Card */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-3 border border-amber-400/30">
                  <Star size={20} />
                </div>
                <h3 className="font-black text-white text-base">เควสต์ & แบบประเมิน</h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  จัดการชุดคำถามเควสต์ตามบทหนังสือ และตรวจผลคะแนนประเมิน 200 แต้ม
                </p>
              </div>
              <div className="space-y-2">
                <Link
                  href="/admin/quests"
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
                >
                  <span>🎯 จัดการเควสต์หนังสือ</span>
                </Link>
                <Link
                  href="/admin/surveys"
                  className="block py-1.5 px-2 rounded-lg bg-white/10 hover:bg-white/20 text-amber-200 text-center font-bold text-[11px] transition-colors"
                >
                  ผลประเมิน & ส่งแต้มรางวัล
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <LayoutDashboard size={16} />
            <span>ภาพรวมการจัดการ (Overview)</span>
          </button>

          <button
            onClick={() => setActiveTab('books')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'books' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <BookOpen size={16} />
            <span>จัดการหนังสือ & แนบ Link ({books.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'videos' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Video size={16} />
            <span>จัดการวิดีโอ & YouTube Embed ({videos.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('podcasts')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'podcasts' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Headphones size={16} />
            <span>จัดการ Podcast & เสียงอ่าน ({podcasts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('home_showcase')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${activeTab === 'home_showcase' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`}
          >
            <Sparkles size={16} />
            <span>ปรับแต่งหน้าแรก & ประกาศ (Showcase)</span>
          </button>
        </div>

        {/* =========================================================================
            TAB 1: OVERVIEW DASHBOARD
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">

            {/* Quick Actions Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <h2 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles size={18} className="text-amber-600" />
                <span>คำสั่งลัดสำหรับผู้ดูแลระบบ (Admin Action Hub)</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                <button
                  onClick={() => {
                    setEditingBook(null);
                    setBookModalOpen(true);
                  }}
                  className="p-4 rounded-2xl bg-blue-50/70 border-2 border-blue-200 hover:border-blue-400 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm group-hover:scale-105 transition-transform">
                    <Plus size={20} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">โพสต์หนังสือใหม่</h4>
                  <p className="text-xs text-slate-500 mt-1">แนบลิงก์ Google Drive, PDF หรือคลาวด์</p>
                </button>

                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoModalOpen(true);
                  }}
                  className="p-4 rounded-2xl bg-rose-50/70 border-2 border-rose-200 hover:border-rose-400 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm group-hover:scale-105 transition-transform">
                    <Video size={20} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">โพสต์วิดีโอใหม่</h4>
                  <p className="text-xs text-slate-500 mt-1">แนบลิงก์ YouTube ID พร้อมดึงรูปอัตโนมัติ</p>
                </button>

                <button
                  onClick={() => {
                    setEditingPodcast(null);
                    setPodcastModalOpen(true);
                  }}
                  className="p-4 rounded-2xl bg-purple-50/70 border-2 border-purple-200 hover:border-purple-400 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm group-hover:scale-105 transition-transform">
                    <Headphones size={20} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">โพสต์ Podcast ใหม่</h4>
                  <p className="text-xs text-slate-500 mt-1">แนบลิงก์ไฟล์เสียง Audio URL</p>
                </button>

                <button
                  onClick={() => setActiveTab('home_showcase')}
                  className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 hover:border-amber-400 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold mb-3 shadow-sm group-hover:scale-105 transition-transform">
                    <Star size={20} />
                  </div>
                  <h4 className="font-black text-slate-900 text-sm">เปลี่ยนหน้าแรก & ป้ายประกาศ</h4>
                  <p className="text-xs text-slate-500 mt-1">กำหนดข้อความแบนเนอร์และหนังสือเด่น</p>
                </button>

              </div>
            </div>

            {/* Sub-systems Directory */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-emerald-700 font-black text-sm mb-2">
                    <Database size={18} />
                    <span>ศูนย์จัดการฐานข้อมูล Supabase</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    ตรวจดูโครงสร้าง Entity ครบ 14 ตาราง พจนานุกรมข้อมูล (Data Dictionary) และคัดลอกไฟล์ SQL สำหรับสร้างฐานข้อมูลจริง
                  </p>
                </div>
                <Link
                  href="/admin/database"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                >
                  <span>เปิดสำรวจ Schema ฐานข้อมูล</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-amber-700 font-black text-sm mb-2">
                    <Flame size={18} />
                    <span>จัดการเควสต์ปัญญาธรรม 38 มงคล</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    กำหนดเควสต์คำถามปรัศนีธรรมในหนังสือมงคลชีวิต 38 ประการ และ Easter Eggs ประจำหน้า
                  </p>
                </div>
                <Link
                  href="/admin/quests"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800"
                >
                  <span>จัดการเควสต์ & ปริศนาธรรม</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-purple-700 font-black text-sm mb-2">
                    <Sparkles size={18} />
                    <span>คลังของรางวัล & คำขอแลก</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    จัดการสต็อกของรางวัลธรรมบรรณาการ ตรวจสอบคำขอแลกของสมาชิก และบันทึกหมายเลขพัสดุ
                  </p>
                </div>
                <Link
                  href="/admin/rewards"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-700 hover:text-purple-800"
                >
                  <span>จัดการแคตตาล็อกของรางวัล</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>
        )}

        {/* =========================================================================
            TAB 2: BOOKS MANAGEMENT (CRUD & LINK EMBED)
           ========================================================================= */}
        {activeTab === 'books' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">คลังหนังสือธรรมะทั้งหมด ({filteredBooks.length} เล่ม)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แอดมินสามารถเพิ่มหนังสือ แนบลิงก์ Google Drive/PDF ปรับสถานะ และปักหมุดหน้าแรกได้โดยตรง
                  </p>
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  <Link
                    href="/admin/import-drive"
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs shadow-md transition-all active:scale-95"
                  >
                    <UploadCloud size={16} className="text-amber-300" />
                    <span>นำเข้า Google Drive (26 เล่ม)</span>
                  </Link>

                  <button
                    onClick={() => {
                      setEditingBook(null);
                      setBookModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus size={16} />
                    <span>เพิ่มหนังสือ / แนบ Link</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="ค้นหาชื่อหนังสือ หรือผู้แต่ง..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Books Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                      <th className="py-3 px-3">ปก</th>
                      <th className="py-3 px-4">ชื่อหนังสือ / รายละเอียด</th>
                      <th className="py-3 px-3">ลิงก์อ่าน (PDF / Drive)</th>
                      <th className="py-3 px-3">ยอดอ่าน</th>
                      <th className="py-3 px-3">หน้าแรก</th>
                      <th className="py-3 px-3">สถานะ</th>
                      <th className="py-3 px-4 text-right">การจัดการ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3 px-3">
                          <div className="relative w-12 aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                            <Image src={book.cover_image || book.cover || '/images/books/book-placeholder.jpg'} alt={book.title} fill className="object-cover" unoptimized />
                          </div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-black text-slate-900 text-xs sm:text-sm line-clamp-1">{book.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{book.author}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {book.id} • {book.page_count || book.pages || 0} หน้า</div>
                        </td>

                        <td className="py-3 px-3 max-w-[180px]">
                          {book.pdf_url ? (
                            <a
                              href={book.pdf_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-blue-600 hover:underline font-mono text-[11px] flex items-center gap-1 truncate"
                              title={book.pdf_url}
                            >
                              <ExternalLink size={12} className="shrink-0" />
                              <span className="truncate">{book.pdf_url}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[11px]">ไม่มีลิงก์</span>
                          )}
                        </td>

                        <td className="py-3 px-3 font-mono font-bold text-slate-700">
                          {book.read_count || 0} ครั้ง
                        </td>

                        <td className="py-3 px-3">
                          <button
                            onClick={() => handleToggleBookFeatured(book)}
                            className={`p-1.5 rounded-lg border transition-all cursor-pointer ${book.featured
                              ? 'bg-amber-100 text-amber-800 border-amber-300 font-bold'
                              : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                              }`}
                            title={book.featured ? 'ปักหมุดหน้าแรกอยู่ (คลิกเพื่อยกเลิก)' : 'คลิกเพื่อปักหมุดหน้าแรก'}
                          >
                            <Star size={14} className={book.featured ? 'fill-amber-500 text-amber-500' : ''} />
                          </button>
                        </td>

                        <td className="py-3 px-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${book.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                            {book.status === 'published' ? 'เผยแพร่' : 'แบบร่าง'}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingBook(book);
                                setBookModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg hover:bg-slate-100 text-blue-600 cursor-pointer"
                              title="แก้ไขหนังสือ"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              onClick={() => handleDeleteBook(book.id, book.title)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-rose-600 cursor-pointer"
                              title="ลบหนังสือ"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: VIDEOS MANAGEMENT (YOUTUBE EMBED)
           ========================================================================= */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">คลังวิดีโอธรรมบรรยาย ({videos.length} รายการ)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แอดมินสามารถใส่ YouTube Link หรือ ID เพื่อให้ระบบสตรีมและแนะนำในหน้าวิดีโออัตโนมัติ
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingVideo(null);
                    setVideoModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>เพิ่มวิดีโอใหม่ (YouTube / TikTok)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {videos.map((vid) => {
                  const isTikTok = vid.platform === 'tiktok' || vid.url?.includes('tiktok.com');
                  return (
                    <div key={vid.id} className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between bg-white shadow-2xs">
                      <div>
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-3">
                          <Image src={vid.thumbnail || (vid.youtubeId && vid.youtubeId !== 'tiktok' ? `https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg` : '/images/books/book-placeholder.jpg')} alt={vid.title} fill className="object-cover" unoptimized />
                          <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm text-white ${isTikTok ? 'bg-pink-600' : 'bg-red-600'
                            }`}>
                            {isTikTok ? '🎵 TikTok' : '🔴 YouTube'}
                          </span>
                          {!isTikTok && vid.youtubeId && vid.youtubeId !== 'tiktok' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition-colors">
                              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg">
                                <Play size={18} className="fill-white ml-0.5" />
                              </div>
                            </div>
                          )}
                        </div>

                        <h4 className="font-black text-slate-900 text-sm line-clamp-2 leading-snug">{vid.title}</h4>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">{vid.description || 'ไม่มีคำอธิบาย'}</p>
                        <div className="text-[11px] font-mono text-slate-400 mt-2">
                          {isTikTok ? (
                            <span>แพลตฟอร์ม: <strong className="text-pink-600">TikTok ธรรมะ</strong></span>
                          ) : (
                            <span>YouTube ID: <strong className="text-slate-800">{vid.youtubeId}</strong></span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <a
                          href={vid.url || (isTikTok ? 'https://www.tiktok.com/@thanavuddhostory' : `https://www.youtube.com/watch?v=${vid.youtubeId}`)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <ExternalLink size={12} />
                          <span>{isTikTok ? 'เปิดดูบน TikTok' : 'เปิดคลิป YouTube'}</span>
                        </a>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingVideo(vid);
                              setVideoModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-blue-600 hover:bg-slate-100 cursor-pointer"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(vid.id, vid.title)}
                            className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: PODCASTS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'podcasts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-900">คลัง Podcast & เสียงอ่าน ({podcasts.length} รายการ)</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    แอดมินสามารถแนบลิงก์ไฟล์เสียง Audio URL (.mp3 / Cloud) เพื่อให้ผู้ใช้งานเปิดฟังเสียงบรรยายธรรมได้
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingPodcast(null);
                    setPodcastSourceType('youtube');
                    setUploadedMp3Url('');
                    setUploadedMp3Path('');
                    setPodcastModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer self-start sm:self-auto"
                >
                  <Plus size={16} />
                  <span>เพิ่ม Podcast (YouTube / MP3)</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {podcasts.map((pod) => (
                  <div key={pod.id} className="p-4 rounded-2xl border border-slate-200 hover:border-slate-300 transition-all flex flex-col justify-between bg-white shadow-2xs">
                    <div>
                      <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 mb-3 border border-slate-200">
                        <Image
                          src={pod.cover_image || pod.cover || '/images/books/tam-jai-hai-prom-buak.jpg'}
                          alt={pod.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <span className={`absolute top-2 left-2 text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-sm text-white ${pod.source_type === 'mp3' ? 'bg-amber-600' : 'bg-red-600'
                          }`}>
                          {pod.source_type === 'mp3' ? '🎵 MP3 Audio' : '🔴 YouTube'}
                        </span>
                      </div>
                      <h4 className="font-black text-slate-900 text-sm line-clamp-1">{pod.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">{pod.description}</p>
                      <div className="text-[11px] font-mono text-purple-700 mt-2 font-bold flex items-center justify-between">
                        <span>⏱️ {pod.duration_formatted || pod.duration || '15:00'} • {pod.host}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${pod.is_published !== false ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {pod.is_published !== false ? 'เผยแพร่' : 'ฉบับร่าง'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <a
                        href={pod.youtube_url || pod.audio_url || '#'}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold text-purple-600 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink size={12} />
                        <span>ทดสอบฟัง</span>
                      </a>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingPodcast(pod);
                            setPodcastSourceType(pod.source_type || (pod.youtube_video_id ? 'youtube' : 'mp3'));
                            setUploadedMp3Url(pod.audio_url || '');
                            setUploadedMp3Path(pod.audio_file_path || '');
                            setPodcastModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-slate-100 cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => handleDeletePodcast(pod.id, pod.title)}
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: FLEXIBLE SHOWCASE & ANNOUNCEMENT SETTINGS
           ========================================================================= */}
        {activeTab === 'home_showcase' && (
          <div className="space-y-6">
            
            {/* 1. Header & Actions Hub */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold mb-2">
                    <Sparkles size={13} className="text-amber-600" />
                    <span>Flexible Showcase System</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    จัดการไฮไลต์หน้าแรก (Highlight & Showcase Manager)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
                    เลือกรูปแบบการแสดงผลได้อย่างอิสระทั้ง 3 รูปแบบ: รูปภาพล้วน (Image Only), ตู้หนังสือจริง (Book Showcase) หรือแบนเนอร์ประชาสัมพันธ์ (Promotional Banner) โดยไม่ถูกบังคับให้อยู่ในรูปแบบการ์ดเดียวกัน
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenAddShowcase}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus size={16} />
                  <span>+ เพิ่มรายการไฮไลต์ใหม่</span>
                </button>
              </div>

              {/* Showcase Items List */}
              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800">
                    รายการที่กำลังแสดงผล ({homeSettings.showcaseItems?.length || 0} รายการ)
                  </h3>
                  <span className="text-xs text-slate-400">
                    * จัดลำดับ เลื่อนขึ้น/ลง หรือเปิด/ปิดการแสดงผลได้ทันที
                  </span>
                </div>

                <div className="space-y-3">
                  {(homeSettings.showcaseItems || []).map((item: FlexibleShowcaseItem, idx: number) => {
                    const isFirst = idx === 0;
                    const isLast = idx === (homeSettings.showcaseItems?.length || 0) - 1;

                    return (
                      <div 
                        key={item.id}
                        className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                          item.is_active 
                            ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs' 
                            : 'bg-slate-50 border-slate-200 opacity-60'
                        }`}
                      >
                        {/* Left: Thumbnail & Info */}
                        <div className="flex items-center gap-3.5 min-w-0">
                          {/* Order Number */}
                          <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                            #{item.order || idx + 1}
                          </span>

                          {/* Image Thumbnail */}
                          <div className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                            {item.image_url ? (
                              <Image 
                                src={encodeURI(item.image_url)} 
                                alt={item.title || 'Showcase'} 
                                fill 
                                className={item.fit_mode === 'cover' ? 'object-cover' : 'object-contain p-0.5'}
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <ImageIcon size={20} />
                              </div>
                            )}
                          </div>

                          {/* Details & Type Badge */}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap mb-1">
                              {/* Type Badge */}
                              {item.type === 'IMAGE_ONLY' && (
                                <span className="px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200 text-[10px] font-bold">
                                  🖼️ Image Only (ภาพล้วน)
                                </span>
                              )}
                              {item.type === 'BOOK_SHOWCASE' && (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
                                  📚 Book Showcase (หนังสือจริง)
                                </span>
                              )}
                              {item.type === 'PROMOTIONAL_BANNER' && (
                                <span className="px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold">
                                  📢 Promotional Banner (แบนเนอร์)
                                </span>
                              )}

                              {/* Fit Mode */}
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 text-[9px] font-mono">
                                fit: {item.fit_mode || 'contain'}
                              </span>

                              {/* Active Status */}
                              {item.is_active ? (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold">
                                  ● เปิดแสดง
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 text-[9px] font-bold">
                                  ○ ปิดแสดง
                                </span>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-800 truncate">
                              {item.title || '(ไม่มีชื่อเรื่อง — แสดงเฉพาะรูปภาพ)'}
                            </h4>

                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5 truncate">
                              {item.target_url && (
                                <span className="flex items-center gap-1 font-mono text-[11px] text-sky-700">
                                  <ExternalLink size={11} /> {item.target_url}
                                </span>
                              )}
                              {item.author && (
                                <span>โดย: {item.author}</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-1.5 shrink-0 self-end md:self-auto">
                          {/* Reorder Up */}
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveShowcase(idx, 'up')}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="เลื่อนขึ้น"
                          >
                            <ArrowUp size={14} />
                          </button>

                          {/* Reorder Down */}
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveShowcase(idx, 'down')}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="เลื่อนลง"
                          >
                            <ArrowDown size={14} />
                          </button>

                          {/* Toggle Active */}
                          <button
                            type="button"
                            onClick={() => handleToggleActiveShowcase(item.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              item.is_active 
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700' 
                                : 'bg-slate-200 hover:bg-slate-300 text-slate-600'
                            }`}
                            title={item.is_active ? 'ปิดการแสดงผล' : 'เปิดการแสดงผล'}
                          >
                            <Eye size={14} />
                          </button>

                          {/* Edit */}
                          <button
                            type="button"
                            onClick={() => handleOpenEditShowcase(item)}
                            className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#073B65] transition-colors"
                            title="แก้ไขข้อมูล"
                          >
                            <Edit size={14} />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDeleteShowcase(item.id)}
                            className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                            title="ลบรายการ"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 1: ADD / EDIT BOOK MODAL
           ========================================================================= */}
        {bookModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">

              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingBook ? 'แก้ไขข้อมูลหนังสือธรรมะ' : 'เพิ่มหนังสือธรรมะใหม่ / แนบ Link'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    แนบลิงก์ Google Drive PDF หรือลิงก์ไฟล์ภายนอกได้โดยตรง
                  </p>
                </div>
                <button
                  onClick={() => setBookModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveBook} className="space-y-4 text-xs sm:text-sm">

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ชื่อหนังสือธรรมะ <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingBook?.title || ''}
                    placeholder="เช่น อย่ามโน, สมดุลเท่ากับดี"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ผู้แต่ง</label>
                    <input
                      type="text"
                      name="author"
                      defaultValue={editingBook?.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">หมวดหมู่</label>
                    <select
                      name="category_id"
                      defaultValue={editingBook?.category_id || 'c2'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="c1">มงคลชีวิต 38 ประการ</option>
                      <option value="c2">ธรรมะพัฒนาตนเอง & จิตใจ</option>
                      <option value="c3">สมาธิและปัญญาบริสุทธิ์</option>
                      <option value="c4">ธรรมะเพื่อครอบครัวและการทำงาน</option>
                    </select>
                  </div>
                </div>

                {/* PDF Link Field */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ลิงก์อ่านหนังสือ PDF / Google Drive Preview Link <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pdf_url"
                    defaultValue={editingBook?.pdf_url || ''}
                    placeholder="เช่น https://drive.google.com/file/d/10qPuIeb6qDu_yBvy5hfW2NVz90CTL4Bw/preview หรือ /books/pdf/xxx.pdf"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    💡 หากใส่ลิงก์ Google Drive view ระบบจะแปลงเป็น preview ให้เปิดอ่านได้ทันที
                  </span>
                </div>

                {/* Cover Image Field */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ลิงก์ภาพหน้าปก (Cover Image URL)</label>
                  <input
                    type="text"
                    name="cover_image"
                    defaultValue={editingBook?.cover_image || editingBook?.cover || ''}
                    placeholder="เช่น /images/books/อย่ามโน.jpg หรือ URL รูปภาพ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">จำนวนหน้า (Pages)</label>
                    <input
                      type="number"
                      name="page_count"
                      defaultValue={editingBook?.page_count || editingBook?.pages || 80}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ปี พ.ศ. ที่จัดพิมพ์</label>
                    <input
                      type="number"
                      name="publication_year"
                      defaultValue={editingBook?.publication_year || 2567}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">สถานะการเผยแพร่</label>
                    <select
                      name="status"
                      defaultValue={editingBook?.status || 'published'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="published">เผยแพร่ทันที (Published)</option>
                      <option value="draft">บันทึกเป็นแบบร่าง (Draft)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">คำอธิบายหนังสือโดยย่อ</label>
                  <textarea
                    name="description"
                    defaultValue={editingBook?.description || ''}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    defaultChecked={editingBook?.featured}
                    className="w-4 h-4 rounded text-blue-600 cursor-pointer"
                  />
                  <label htmlFor="featured" className="text-xs font-bold text-slate-800 cursor-pointer">
                    ⭐ ปักหมุดเป็น "หนังสือแนะนำบนหน้าแรก" (Featured Book)
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setBookModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black shadow-md cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูลหนังสือ'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 2: ADD / EDIT VIDEO MODAL
           ========================================================================= */}
        {videoModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">

              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingVideo ? 'แก้ไขข้อมูลวิดีโอ' : 'เพิ่มวิดีโอใหม่ (YouTube / TikTok)'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    รองรับทั้ง YouTube และ TikTok ระบบจะตรวจจับแพลตฟอร์มและสกัด ID ให้อัตโนมัติ
                  </p>
                </div>
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveVideo} className="space-y-4 text-xs sm:text-sm">

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ลิงก์วิดีโอ (YouTube URL หรือ TikTok URL) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="url"
                    defaultValue={editingVideo?.url || ''}
                    placeholder="เช่น https://www.tiktok.com/@thanavuddhostory หรือ https://www.tiktok.com/@thanavuddhostory/video/..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-rose-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    💡 เพียงแค่วางลิงก์คลิปหรือช่อง TikTok (เช่น @thanavuddhostory) ระบบจะดึงชื่อคลิปและขึ้นแสดงผลที่หน้าแรกและคลังวิดีโอทันที
                  </p>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ชื่อคลิปวิดีโอ <span className="text-slate-400 font-normal">(เว้นว่างได้ ระบบจะดึงอัตโนมัติ)</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingVideo?.title || ''}
                    placeholder="เว้นว่างได้ ระบบจะดึงชื่อคลิปจาก TikTok / YouTube ให้อัตโนมัติ"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อช่อง / ผู้บรรยาย</label>
                  <input
                    type="text"
                    name="channelName"
                    defaultValue={editingVideo?.channelName || 'Thanavuddho Story (พระครูปลัดสุวัฒนโพธิคุณ)'}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">คำอธิบายวิดีโอ</label>
                  <textarea
                    name="description"
                    defaultValue={editingVideo?.description || ''}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">แท็กคำค้นหา (คั่นด้วยจุลภาค ,)</label>
                  <input
                    type="text"
                    name="tags"
                    defaultValue={Array.isArray(editingVideo?.tags) ? editingVideo?.tags.join(', ') : ''}
                    placeholder="เช่น สมาธิ, มงคลชีวิต, ความสุข"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVideoModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black shadow-md cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกวิดีโอ'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 3: ADD / EDIT PODCAST MODAL
           ========================================================================= */}
        {podcastModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">

              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingPodcast ? 'แก้ไขข้อมูล Podcast' : 'เพิ่ม Podcast / แนบ Link เสียงอ่าน'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    แนบลิงก์ไฟล์เสียง Audio URL เพื่อเปิดให้สมาชิกฟังได้ตลอด 24 ชั่วโมง
                  </p>
                </div>
                <button
                  onClick={() => setPodcastModalOpen(false)}
                  className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-800"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSavePodcast} className="space-y-4 text-xs sm:text-sm">

                {/* 1. SOURCE TYPE SELECTOR (YOUTUBE VS. MP3) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    ประเภทแหล่งข้อมูลเสียง (Audio Source Type) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPodcastSourceType('youtube')}
                      className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${podcastSourceType === 'youtube'
                        ? 'bg-red-50 border-red-500 text-red-700 ring-2 ring-red-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <span>🔴 YouTube (IFrame Stream)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPodcastSourceType('mp3')}
                      className={`p-3 rounded-2xl border font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${podcastSourceType === 'mp3'
                        ? 'bg-purple-50 border-purple-500 text-purple-700 ring-2 ring-purple-200'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      <span>🎵 MP3 (Supabase Storage)</span>
                    </button>
                  </div>
                </div>

                {/* 2. DYNAMIC SOURCE INPUT */}
                {podcastSourceType === 'youtube' ? (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ลิงก์วิดีโอ YouTube (URL / Video ID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="youtube_url"
                      defaultValue={editingPodcast?.youtube_url || (editingPodcast?.youtube_video_id ? `https://www.youtube.com/watch?v=${editingPodcast.youtube_video_id}` : '')}
                      placeholder="เช่น https://www.youtube.com/watch?v=COag-KtzVmY หรือ ID 11 ตัว"
                      required={podcastSourceType === 'youtube'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      ระบบจะตรวจสอบและแยก Video ID พร้อมดึงภาพปกอัตโนมัติ
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        อัปโหลดไฟล์เสียง MP3 ขึ้น Supabase Storage
                      </label>
                      <input
                        type="file"
                        accept="audio/*,.mp3,.m4a,.ogg,.wav"
                        onChange={handleUploadMp3File}
                        disabled={isUploadingMp3}
                        className="w-full text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
                      />
                      {isUploadingMp3 && (
                        <p className="text-xs text-purple-700 font-bold mt-1.5 animate-pulse">
                          ⏳ กำลังอัปโหลดไฟล์เสียงขึ้นคลาวด์...
                        </p>
                      )}
                      {uploadedMp3Path && (
                        <p className="text-[11px] text-emerald-700 font-mono mt-1 truncate">
                          ✓ อัปโหลดสำเร็จ: {uploadedMp3Path}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        หรือระบุ URL สตรีมเสียงตรง (.mp3 / Cloud CDN)
                      </label>
                      <input
                        type="text"
                        name="audio_url"
                        value={uploadedMp3Url || editingPodcast?.audio_url || ''}
                        onChange={(e) => setUploadedMp3Url(e.target.value)}
                        placeholder="https://... หรือเส้นทางไฟล์ใน storage"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* 3. PODCAST TITLE */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    ชื่อรายการ Podcast / ชื่อตอน <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingPodcast?.title || ''}
                    placeholder="เช่น Podcast ทำใจให้พร้อมบวก: บทที่ 1"
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-bold focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* 4. HOST & DURATION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ผู้บรรยาย / Host</label>
                    <input
                      type="text"
                      name="host"
                      defaultValue={editingPodcast?.host || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ความยาว (เช่น 24:31 หรือ 15:00)</label>
                    <input
                      type="text"
                      name="duration"
                      defaultValue={editingPodcast?.duration_formatted || editingPodcast?.duration || '15:00'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono"
                    />
                  </div>
                </div>

                {/* 5. CATEGORY & COVER IMAGE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">หมวดหมู่</label>
                    <select
                      name="category_id"
                      defaultValue={editingPodcast?.category_id || 'cat_mind'}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white"
                    >
                      <option value="cat_mind">พัฒนาจิตใจ & คิดบวก</option>
                      <option value="cat_meditation">สมาธิ & จิตสงบ</option>
                      <option value="cat_work">การทำงาน & ความสำเร็จ</option>
                      <option value="cat_life">มงคลชีวิต & สังคม</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ลิงก์ภาพปก (เว้นว่างเพื่อใช้ค่าเริ่มต้น)</label>
                    <input
                      type="text"
                      name="cover_image"
                      defaultValue={editingPodcast?.cover_image || editingPodcast?.cover || ''}
                      placeholder="URL รูปภาพสี่เหลี่ยมจัตุรัส"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* 6. DESCRIPTION */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">คำอธิบาย</label>
                  <textarea
                    name="description"
                    defaultValue={editingPodcast?.description || ''}
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200"
                  />
                </div>

                {/* 7. PUBLISH STATUS CHECKBOX */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="is_published"
                    name="is_published"
                    defaultChecked={editingPodcast ? editingPodcast.is_published !== false : true}
                    className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="is_published" className="text-xs font-bold text-slate-700 cursor-pointer">
                    เผยแพร่ทันที (Published) ให้สมาชิกและบุคคลทั่วไปรับฟังได้
                  </label>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPodcastModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || isUploadingMp3}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-md cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก Podcast'}
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

        {/* =========================================================================
            MODAL 4: ADD / EDIT FLEXIBLE SHOWCASE ITEM MODAL
           ========================================================================= */}
        {showcaseModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    {editingShowcaseItem ? 'แก้ไขรายการไฮไลต์หน้าแรก' : 'เพิ่มรายการไฮไลต์หน้าแรกใหม่'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    กำหนดรูปแบบการแสดงผล: รูปภาพล้วน, หนังสือจริง, หรือแบนเนอร์ประชาสัมพันธ์
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowcaseModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveShowcaseForm} className="space-y-5 text-xs">
                
                {/* 1. DISPLAY TYPE SELECTOR */}
                <div>
                  <label className="block font-bold text-slate-800 mb-2">
                    เลือกประเภทการแสดงผล (Display Type) <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    
                    {/* A. IMAGE ONLY */}
                    <button
                      type="button"
                      onClick={() => setSelectedShowcaseType('IMAGE_ONLY')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedShowcaseType === 'IMAGE_ONLY'
                          ? 'bg-purple-50 border-purple-500 ring-2 ring-purple-200 text-purple-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 text-xs">
                        <span>🖼️ Image Only</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">
                        แสดงเฉพาะรูปภาพล้วน ไม่ซ้อนทับข้อความหรือปุ่ม
                      </p>
                    </button>

                    {/* B. BOOK SHOWCASE */}
                    <button
                      type="button"
                      onClick={() => setSelectedShowcaseType('BOOK_SHOWCASE')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedShowcaseType === 'BOOK_SHOWCASE'
                          ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 text-emerald-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 text-xs">
                        <span>📚 Book Showcase</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">
                        ปก 2D แท้จากฐานข้อมูล พร้อมชื่อผู้แต่งและปุ่มเปิดอ่าน
                      </p>
                    </button>

                    {/* C. PROMOTIONAL BANNER */}
                    <button
                      type="button"
                      onClick={() => setSelectedShowcaseType('PROMOTIONAL_BANNER')}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        selectedShowcaseType === 'PROMOTIONAL_BANNER'
                          ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-200 text-sky-900'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5 text-xs">
                        <span>📢 Banner</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 mt-1 leading-snug">
                        ภาพแบนเนอร์ประชาสัมพันธ์เต็มพื้นที่
                      </p>
                    </button>

                  </div>
                </div>

                {/* QUICK SELECT FROM BOOK (Only for BOOK_SHOWCASE) */}
                {selectedShowcaseType === 'BOOK_SHOWCASE' && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-200/80">
                    <label className="block font-bold text-emerald-900 mb-1.5">
                      📖 ดึงข้อมูลอัตโนมัติจากหนังสือในระบบ (Quick Select from Books)
                    </label>
                    <select
                      onChange={(e) => {
                        const b = books.find((x: any) => x.id === e.target.value);
                        if (b) {
                          const form = e.target.form;
                          if (form) {
                            (form.elements.namedItem('title') as HTMLInputElement).value = b.title || '';
                            (form.elements.namedItem('author') as HTMLInputElement).value = b.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)';
                            (form.elements.namedItem('description') as HTMLTextAreaElement).value = b.description || '';
                            (form.elements.namedItem('image_url') as HTMLInputElement).value = b.cover_image || b.cover || '';
                            (form.elements.namedItem('target_url') as HTMLInputElement).value = `/reader/${b.id}`;
                            (form.elements.namedItem('book_id') as HTMLInputElement).value = b.id;
                          }
                        }
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-emerald-300 bg-white font-medium text-xs focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">-- เลือกหนังสือจากคลังเพื่อกรอกข้อมูลอัตโนมัติ --</option>
                      {books.map((b: any) => (
                        <option key={b.id} value={b.id}>
                          {b.title} {b.author ? `(${b.author})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* QUICK PRESETS FOR IMAGES */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-600 block mb-1.5">
                    ⚡ ทางลัดเลือกภาพด่วน (Quick Presets):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/banners/banner-muthita-65-years.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/welcome';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'มุทิตาสักการะ วาระอายุวัฒนมงคล ๖๕ ปี พระครูปลัดสุวัฒนโพธิคุณ';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-[10.5px] font-semibold text-amber-900 shadow-2xs"
                    >
                      + ภาพพระอาจารย์ (มุทิตาสักการะ ๖๕ ปี)
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/banners/banner-yoo-sook-digital-official.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/reader/book_yoo_sook_nai_yook_digital';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'อยู่สุขในยุคดิจิทัล';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-[10.5px] font-semibold text-[#073B65] shadow-2xs"
                    >
                      + แบนเนอร์อยู่สุขในยุคดิจิทัล
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/banners/banner-tam-jai-hai-prom-buak.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/reader/book_tam_jai_hai_prom_buak';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'ทำใจให้พร้อมบวก';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-pink-50 border border-slate-200 text-[10.5px] font-semibold text-pink-700 shadow-2xs"
                    >
                      + แบนเนอร์ทำใจให้พร้อมบวก (สีชมพู)
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/banners/banner-phro-mai-roo-si-na-roo-than-cheewit.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/reader/book_เพราะไม่รู้สินะ-ตอน-รู้ทันชีวิต';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'เพราะไม่รู้สินะ ตอน รู้ทันชีวิต';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-[10.5px] font-semibold text-emerald-800 shadow-2xs"
                    >
                      + แบนเนอร์เพราะไม่รู้สินะ (รู้ทันชีวิต)
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/banners/banner-rak-thae-mai-dai-mee-khae-nai-niyai.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/reader/book_rak_thae_mai_dai_mee_khae_nai_niyai';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'รักแท้ไม่ได้มีแค่ในนิยาย~';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-rose-50 border border-slate-200 text-[10.5px] font-semibold text-rose-800 shadow-2xs"
                    >
                      + แบนเนอร์รักแท้ไม่ได้มีแค่ในนิยาย (สีชมพูพีช)
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/banners/banner-mongkol-chiwit-thang-kaona.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/reader/book_มงคลชีวิตฉบับทางก้าวหน้า-1';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'มงคลชีวิต ฉบับ "ทางก้าวหน้า"';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-50 border border-slate-200 text-[10.5px] font-semibold text-amber-900 shadow-2xs"
                    >
                      + แบนเนอร์มงคลชีวิต ฉบับ "ทางก้าวหน้า"
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        const form = (e.target as HTMLElement).closest('form');
                        if (form) {
                          (form.elements.namedItem('image_url') as HTMLInputElement).value = '/images/books/tam-jai-hai-prom-buak.jpg';
                          (form.elements.namedItem('target_url') as HTMLInputElement).value = '/reader/book_tam_jai_hai_prom_buak';
                          (form.elements.namedItem('title') as HTMLInputElement).value = 'ทำใจให้พร้อมบวก';
                        }
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-emerald-50 border border-slate-200 text-[10.5px] font-semibold text-emerald-900 shadow-2xs"
                    >
                      + ปกทำใจให้พร้อมบวก
                    </button>
                  </div>
                </div>

                {/* 2. IMAGE URLS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ลิงก์รูปภาพ Desktop (Image URL) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="image_url"
                      defaultValue={editingShowcaseItem?.image_url || ''}
                      required
                      placeholder="/images/banners/... หรือ https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ลิงก์รูปภาพ Mobile (Image URL Mobile) <span className="text-slate-400 font-normal">(ถ้ามี)</span>
                    </label>
                    <input
                      type="text"
                      name="image_url_mobile"
                      defaultValue={editingShowcaseItem?.image_url_mobile || ''}
                      placeholder="กรณีต้องการภาพแยกสำหรับหน้าจอมือถือ"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs"
                    />
                  </div>
                </div>

                {/* 3. TARGET URL & CLICKABLE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      ลิงก์ปลายทางเมื่อคลิก (Target URL)
                    </label>
                    <input
                      type="text"
                      name="target_url"
                      defaultValue={editingShowcaseItem?.target_url || ''}
                      placeholder="เช่น /welcome, /reader/book_id, หรือ https://..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      การคลิก (Clickable)
                    </label>
                    <select
                      name="is_clickable"
                      defaultValue={editingShowcaseItem ? String(editingShowcaseItem.is_clickable !== false) : 'true'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      <option value="true">เปิดให้คลิกได้ (Clickable)</option>
                      <option value="false">ปิดการคลิก (Display Only)</option>
                    </select>
                  </div>
                </div>

                {/* 4. TITLE & AUTHOR (Shown only if not purely empty) */}
                {selectedShowcaseType !== 'IMAGE_ONLY' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ชื่อเรื่อง / ชื่อหนังสือ (Title)
                      </label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingShowcaseItem?.title || ''}
                        placeholder="ชื่อหนังสือ หรือชื่อแบนเนอร์"
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ชื่อผู้แต่ง (Author) <span className="text-slate-400 font-normal">(เฉพาะตู้หนังสือ)</span>
                      </label>
                      <input
                        type="text"
                        name="author"
                        defaultValue={editingShowcaseItem?.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)'}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                      />
                    </div>
                  </div>
                )}

                {/* Hidden Title for IMAGE_ONLY */}
                {selectedShowcaseType === 'IMAGE_ONLY' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      คำอธิบายกำกับรูปภาพ (Title / Alt Text) <span className="text-slate-400 font-normal">(ไม่แสดงบนการ์ด)</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      defaultValue={editingShowcaseItem?.title || 'ภาพประชาสัมพันธ์'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                )}

                {/* 5. DESCRIPTION (Only for BOOK_SHOWCASE or PROMOTIONAL_BANNER) */}
                {selectedShowcaseType === 'BOOK_SHOWCASE' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      คำอธิบายเนื้อหาโดยย่อ (Description)
                    </label>
                    <textarea
                      name="description"
                      rows={2}
                      defaultValue={editingShowcaseItem?.description || ''}
                      placeholder="คำโปรยหรือคำสอนย่อ..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                )}

                {/* 6. SETTINGS ROW: FIT MODE, ORDER, ACTIVE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      สัดส่วนการแสดงผล (Fit Mode)
                    </label>
                    <select
                      name="fit_mode"
                      defaultValue={editingShowcaseItem?.fit_mode || (selectedShowcaseType === 'PROMOTIONAL_BANNER' ? 'cover' : 'contain')}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    >
                      <option value="contain">contain (รักษาสัดส่วน ไม่ตัดภาพ)</option>
                      <option value="cover">cover (เต็มพื้นที่ ปรับขยาย)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      ลำดับการแสดงผล (Sort Order)
                    </label>
                    <input
                      type="number"
                      name="order"
                      defaultValue={editingShowcaseItem?.order || 1}
                      min={1}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      สถานะการแสดงผล (Active)
                    </label>
                    <select
                      name="is_active"
                      defaultValue={editingShowcaseItem ? String(editingShowcaseItem.is_active !== false) : 'true'}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-emerald-800"
                    >
                      <option value="true">✓ เปิดใช้งาน (Active)</option>
                      <option value="false">✕ ปิดชั่วคราว (Disabled)</option>
                    </select>
                  </div>
                </div>

                {/* Hidden book_id, badge, action_label */}
                <input type="hidden" name="book_id" defaultValue={editingShowcaseItem?.book_id || ''} />
                <input type="hidden" name="badge" defaultValue={editingShowcaseItem?.badge || '📖 หนังสือแนะนำ'} />
                <input type="hidden" name="action_label" defaultValue={editingShowcaseItem?.action_label || 'เปิดอ่านหนังสือ (Flipbook)'} />

                {/* Modal Footer Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setShowcaseModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-black shadow-md cursor-pointer active:scale-95"
                  >
                    {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกรายการไฮไลต์'}
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
