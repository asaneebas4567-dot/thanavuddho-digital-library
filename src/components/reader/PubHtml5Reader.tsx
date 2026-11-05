'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, Maximize, Minimize, ExternalLink, BookOpen, Sparkles } from 'lucide-react';

interface PubHtml5ReaderProps {
  book: {
    id: string;
    title: string;
    author_name?: string;
    reader_url?: string;
    source_url?: string;
    pages?: number;
    page_count?: number;
    category_id?: string;
  };
}

export default function PubHtml5Reader({ book }: PubHtml5ReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const rawUrl = book.reader_url || book.source_url || '';
  // Ensure HTTPS to prevent mixed-content blocks
  const secureUrl = rawUrl.startsWith('http://') ? rawUrl.replace('http://', 'https://') : rawUrl;

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
            title="กลับไปหน้าที่มาก่อนหน้า (คลิกเดียว)"
          >
            <ChevronLeft size={18} />
            <span className="hidden sm:inline">ย้อนกลับ</span>
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-xs sm:text-sm tracking-tight truncate text-slate-100">
                {book.title}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600/90 text-white shrink-0 shadow-2xs">
                <BookOpen size={11} />
                ห้องเรียน อารยธรรมโลก
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden md:block truncate">
              หนังสือฉบับเปิดอ่านออนไลน์ (PubHTML5 Flipbook) • รวม {book.pages || book.page_count || 1} หน้า
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
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
            allow="clipboard-write; encrypted-media"
            title={book.title}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-white/70 p-6 text-center">
            <Sparkles size={32} className="text-amber-400 mb-2" />
            <p className="font-bold text-sm">ไม่พบลำดับลิงก์ของหนังสือชุดนี้</p>
          </div>
        )}
      </main>
    </div>
  );
}
