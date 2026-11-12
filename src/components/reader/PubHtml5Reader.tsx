'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Maximize, Minimize, ExternalLink, BookOpen, Sparkles, Clock, BookMarked, Coins, RotateCcw } from 'lucide-react';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { useLoan } from '@/context/LoanContext';
import LazadaRewardPopup, { RewardCelebrationData } from '@/components/rewards/LazadaRewardPopup';

interface PubHtml5ReaderProps {
  book: {
    id: string;
    title: string;
    author_name?: string;
    reader_url?: string;
    source_url?: string;
    pdf_url?: string;
    pages?: number;
    page_count?: number;
    category_id?: string;
    category_ids?: string[];
  };
  hasLocalPdf?: boolean;
}

export default function PubHtml5Reader({ book, hasLocalPdf }: PubHtml5ReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebrationData, setCelebrationData] = useState<RewardCelebrationData>({ points: 15 });
  const hasRewardedRef = useRef<boolean>(false);
  const { recordEarn } = useLearningPoints();
  const { returnMediaByBookId, isMediaBorrowed } = useLoan();
  const isBorrowed = isMediaBorrowed(book.id);

  const handleReturnBook = useCallback(() => {
    if (confirm('คุณต้องการคืนหนังสือเล่มนี้เพื่อเพิ่มโควตายืมใช่หรือไม่?')) {
      returnMediaByBookId(book.id);
      router.push(`/books/${book.id}`);
    }
  }, [book.id, returnMediaByBookId, router]);

  // Timer tracking for reading session
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionSeconds(s => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Gamified reading bonus at 2 minutes
  useEffect(() => {
    if (sessionSeconds >= 120 && !hasRewardedRef.current) {
      hasRewardedRef.current = true;
      recordEarn({
        type: 'read_chapter',
        chapterIndex: 1,
        chapterTitle: book.title,
        durationSeconds: sessionSeconds
      });
      setCelebrationData({
        points: 15,
        title: 'อ่านต่อเนื่อง 2 นาที! 🪙',
        subtitle: `ปัญญาบารมีเพิ่มพูนจากการศึกษาหนังสือ "${book.title}" (+15 P)`
      });
      setShowCelebration(true);
    }
  }, [sessionSeconds, book.title, recordEarn]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  let rawUrl = (book as any).drive_file_id 
    ? `https://drive.google.com/file/d/${(book as any).drive_file_id}/preview`
    : (book.reader_url || book.source_url || book.pdf_url || '');

  let secureUrl = rawUrl.startsWith('http://') ? rawUrl.replace('http://', 'https://') : rawUrl;

  // Convert Google Drive links to /preview for clean, reliable iframe embedding
  if (secureUrl.includes('drive.google.com')) {
    const fileIdMatch = secureUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch && fileIdMatch[1]) {
      secureUrl = `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    } else {
      const idParamMatch = secureUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (idParamMatch && idParamMatch[1]) {
        secureUrl = `https://drive.google.com/file/d/${idParamMatch[1]}/preview`;
      }
    }
  }

  const isDrive = secureUrl.includes('drive.google.com') || secureUrl.includes('docs.google.com');
  const isPubHtml5 = secureUrl.includes('pubhtml5.com');
  const isWorldCiv = book.category_id === 'cat_world_civ' || (book.category_ids && book.category_ids.includes('cat_world_civ'));

  const handleGoBack = useCallback(() => {
    // 1. If explicit 'from' parameter provided in URL
    const fromParam = searchParams.get('from');
    if (fromParam) {
      router.push(fromParam);
      return;
    }

    // 2. Check referrer if coming from same origin
    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin === window.location.origin && !refUrl.pathname.startsWith('/reader/')) {
          router.push(refUrl.pathname + refUrl.search);
          return;
        }
      } catch {
        // ignore
      }
    }

    // 3. Fallback: navigate directly to book details
    if (book.id) {
      router.push(`/books/${book.id}`);
    } else {
      router.push('/books');
    }
  }, [router, searchParams, book.id]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-[#14191c] select-none overflow-hidden">
      {/* Top Header */}
      <header className="h-11 sm:h-12 border-b border-white/10 bg-slate-950/95 backdrop-blur-md flex items-center justify-between px-3 sm:px-5 shrink-0 z-40 text-white shadow-md">
        {/* Left: Back & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={handleGoBack}
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer shrink-0 flex items-center gap-1 font-bold text-xs"
            title="กลับไปหน้าที่มาก่อนหน้า"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">ย้อนกลับ</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xs sm:text-sm tracking-tight truncate text-slate-100 max-w-[180px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h1>
              <span className={`hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 shadow-2xs ${
                isWorldCiv 
                  ? 'bg-emerald-600/90 text-white' 
                  : isDrive 
                  ? 'bg-sky-600/90 text-white' 
                  : 'bg-amber-600/90 text-white'
              }`}>
                <BookOpen size={11} />
                {isWorldCiv ? 'ห้องเรียน อารยธรรมโลก' : isDrive ? 'Cloud Viewer' : 'PubHTML5 Flipbook'}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden md:block truncate">
              หนังสือฉบับเปิดอ่านออนไลน์ • รวม {book.pages || book.page_count || 1} หน้า
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Reading Timer */}
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 text-sky-200 text-xs font-mono font-bold">
            <Clock size={12} className="text-[#079FE8]" />
            <span>{formatTimer(sessionSeconds)}</span>
          </div>

          {/* Return Book Button */}
          {isBorrowed && (
            <button
              onClick={handleReturnBook}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-200 border border-white/15 text-zinc-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="คืนหนังสือเล่มนี้เพื่อเพิ่มโควตายืม"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">คืนหนังสือ</span>
            </button>
          )}

          {/* Switch to Flipbook Mode (if local PDF is available) */}
          {hasLocalPdf && (
            <Link
              href={`/reader/${book.id}?mode=flip`}
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all shadow-xs"
              title="สลับไปโหมดพลิกหน้าสมจริง (Flipbook)"
            >
              <BookMarked size={13} />
              <span>โหมดพลิกหน้า 3D</span>
            </Link>
          )}

          <a
            href={secureUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-all text-slate-200 cursor-pointer"
            title="เปิดอ่านในแท็บใหม่"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline text-[11px]">เปิดในแท็บใหม่</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer text-slate-200"
            title={isFullscreen ? 'ออกจากเต็มจอ' : 'เปิดอ่านเต็มจอ'}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </header>

      {/* Main Embed Stage */}
      <main className="flex-grow w-full h-full relative bg-[#1c2226]">
        {secureUrl ? (
          <iframe
            src={secureUrl}
            className="w-full h-full border-0 block"
            allowFullScreen
            allow="clipboard-write; encrypted-media; autoplay"
            title={book.title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-6 text-center">
            <Sparkles size={32} className="text-amber-400 mb-2" />
            <p className="font-bold text-sm">ไม่พบลำดับลิงก์ของหนังสือชุดนี้</p>
          </div>
        )}
      </main>

      {/* Gamified Reward Celebration Popup */}
      <LazadaRewardPopup
        isOpen={showCelebration}
        onClose={() => setShowCelebration(false)}
        data={celebrationData}
      />
    </div>
  );
}
