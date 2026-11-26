'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize, 
  Minimize, 
  X, 
  RefreshCw, 
  Loader2, 
  BookOpen, 
  List, 
  Sun, 
  Moon, 
  Coffee, 
  ZoomIn, 
  ZoomOut, 
  Scroll, 
  Search,
  Bookmark,
  BookMarked,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  ArrowRight,
  ExternalLink,
  Compass,
  Sparkles,
  Timer,
  Coins,
  Flame,
  Award,
  RotateCcw
} from 'lucide-react';
import { loadPdfDocument, renderPdfPageToCanvas, unloadPdfDocument, searchPdfText, SearchMatch } from '@/lib/pdfReaderHelper';
import BookQuestManager from '@/components/gamification/BookQuestManager';
import LazadaRewardPopup, { RewardCelebrationData } from '@/components/rewards/LazadaRewardPopup';
import PubHtml5Reader from '@/components/reader/PubHtml5Reader';
import DailyReadingSummaryModal from '@/components/reader/DailyReadingSummaryModal';
import { detectBookDimension, BookDimensionInfo, calculateReadingPoints } from '@/lib/readingPacingEngine';
import { useLearningPoints } from '@/lib/useLearningPoints';
import { useLoan } from '@/context/LoanContext';
import { useAuth } from '@/context/AuthContext';

export type ReaderTheme = 'white' | 'sepia' | 'night';
export type ReadingMode = 'flip' | 'scroll';

interface PremiumBookReaderProps {
  book: {
    id: string;
    title: string;
    author_id?: string;
    author_name?: string;
    description?: string;
    cover?: string;
    cover_image?: string;
    pages?: number;
    page_count?: number;
    pdf_url?: string;
    reader_url?: string;
    source_url?: string;
    isbn?: string;
  };
  initialPage?: number;
}

export function resolveBookPdfUrl(book: {
  id?: string;
  title?: string;
  pdf_url?: string;
  source_url?: string;
  reader_url?: string;
}): string {
  // 1. Direct local PDF candidate from book object
  const candidate = ((book.pdf_url || book.reader_url || book.source_url || '') as string).trim();
  if (candidate.startsWith('/books/pdf/') || candidate.startsWith('/pdfs/')) {
    return candidate;
  }

  const rawId = (book.id || '').trim();
  const id = rawId.toLowerCase();
  const title = (book.title || '').toLowerCase();

  // 2. Strict ID Mapping Table for All Library Books
  const EXACT_ID_MAP: Record<string, string> = {
    'book_mua_jai_sai': '/books/pdf/mua-jai-sai.pdf',
    'book_เมื่อใจใสใส_อะไรๆ_ก็ง่าย': '/books/pdf/mua-jai-sai.pdf',
    'book_เมื่อใจใส_ๆ_อะไร_ๆ_ก็ง่าย': '/books/pdf/mua-jai-sai.pdf',
    'book_รักเเท้ไม่ได้มีเเค่ในนิยาย': '/books/pdf/รักเเท้ไม่ได้มีเเค่ในนิยาย.pdf',
    'book_เปิดพรมเเดนโลกเเห่งธรรมok': '/books/pdf/เปิดพรมเเดนโลกเเห่งธรรมok.pdf',
    'book_hope-magazine-vol-18': '/books/pdf/hope-magazine-vol-18.pdf',
    'book_dhammaintrend4': '/books/pdf/dhammaintrend4.pdf',
    'book_อายุวัฒนมงคล-๖๓ปี-๔๐-พรรษา': '/books/pdf/อายุวัฒนมงคล-๖๓ปี-๔๐-พรรษา.pdf',
    'book_อยู่บนโลกใหม่อย่างไม่เป็นโรค': '/books/pdf/อยู่บนโลกใหม่อย่างไม่เป็นโรค.pdf',
    'book_มงคลชีวิตฉบับทางก้าวหน้า-1': '/books/pdf/มงคลชีวิตฉบับทางก้าวหน้า-1.pdf',
    'book_อย่ามโน': '/books/pdf/อย่ามโน.pdf',
    'book_สมดุลเท่ากับดี': '/books/pdf/สมดุลเท่ากับดี.pdf',
    'book_ตามหลวงพี่ไปโกอินเตอร์': '/books/pdf/ตามหลวงพี่ไปโกอินเตอร์.pdf',
    'book_ความสุข-360-องศา': '/books/pdf/ความสุข-360-องศา.pdf',
    'book_ความลับของความรัก': '/books/pdf/ความลับของความรัก.pdf',
    'book_ความรักรสอูมามิ': '/books/pdf/ความรักรสอูมามิ.pdf',
    'book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น': '/books/pdf/กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น.pdf',
    'book_เส้นทางพระบรมฯ': '/books/pdf/เส้นทางพระบรมฯ.pdf',
    'book_perfectionist-สไตล์พุทธะ': '/books/pdf/perfectionist-สไตล์พุทธะ.pdf',
    'book_ลมหายใจเข้าออกของพระพุทธศาสนา': '/books/pdf/lom-hai-jai-khao-ok.pdf',
    'book_อยู่สุขในยุคดิจิทัล': '/books/pdf/yoo-sook-nai-yook-digital.pdf',
    'book_love-myself-รักในตัวตน': '/books/pdf/love-myself-rak-nai-tua-ton.pdf',
    'book_secret-of-love-รักลูกอย่างไรไม่ให้เสียน้ำตา': '/books/pdf/secret-of-love-rak-look.pdf',
    'book_the-lover-รักเป็นจะเห็นใจ': '/books/pdf/the-lover-rak-pen-ja-hen-jai.pdf',
    'book_ข้อคิดรอบตัว': '/books/pdf/kho-khit-rob-tua.pdf',
    'book_ทันโลก-ทันธรรม-3': '/books/pdf/than-lok-than-dhamma-3.pdf',
    'book_ทันโลกทันธรรม1': '/books/pdf/than-lok-than-dhamma-1.pdf',
    'book_ทันโลกทันธรรม2': '/books/pdf/than-lok-than-dhamma-2.pdf',
    'book_ทำใจให้พร้อมบวก': '/books/pdf/tam-jai-hai-prom-buak.pdf',
    'book_พระไตรปิฎก-ฉบับธรรมชัย': '/books/pdf/phra-traipidok-dhammachai.pdf',
    'book_มังกรสอนใจ': '/books/pdf/mang-korn-sorn-jai.pdf',
    'book_ศาสตร์เเห่งสมาธิ': '/books/pdf/the-science-of-meditation.pdf',
    'book_เขาก็สุข-เราก็สุข': '/books/pdf/khao-kor-sook-rao-kor-sook.pdf',
    'book_เพราะไม่รู้สินะ-ตอน-รู้ทันชีวิต': '/books/pdf/phro-mai-roo-roo-than-cheewit.pdf',
    'book_ไขปัญหาความเชื่อ': '/books/pdf/khai-panha-khwam-chuea.pdf',
    'book_tam_jai_hai_prom_buak': '/books/pdf/tam-jai-hai-prom-buak.pdf',
    'book_khao_kor_sook_rao_kor_sook': '/books/pdf/khao-kor-sook-rao-kor-sook.pdf',
    'book_lom_hai_jai_khao_ok': '/books/pdf/lom-hai-jai-khao-ok.pdf',
    'book_phoo_soon_sia_tee_mai_sin_soon': '/books/pdf/phoo-soon-sia-tee-mai-sin-soon.pdf',
    'book_secret_of_love_rak_look_yang_rai': '/books/pdf/secret-of-love-rak-look.pdf',
    'book_the_lover_rak_pen_ja_hen_jai': '/books/pdf/the-lover-rak-pen-ja-hen-jai.pdf',
    'book_yoo_nai_lok_mai_yang_mai_pen_rok': '/books/pdf/yoo-nai-lok-mai.pdf',
    'book_tham_jai_hai_phrom_buak': '/books/pdf/tam-jai-hai-prom-buak.pdf',
    'book_lom_hai_jai_khao_ok_123': '/books/pdf/lom-hai-jai-khao-ok-123.pdf',
    'book_mongkol_chiwit_124': '/books/pdf/mongkol-chiwit-124.pdf',
    'book_perd_promdan_dhamma': '/books/pdf/perd-promdan-dhamma.pdf',
    'book_phro_mai_roo_roo_than_cheewit': '/books/pdf/phro-mai-roo-roo-than-cheewit.pdf',
    'book_rak_thae_mai_dai_mee_khae_nai_niyai': '/books/pdf/rak-thae-mai-dai-mee-khae-nai-niyai.pdf',
    'book_love_myself_rak_nai_tua_ton': '/books/pdf/love-myself-rak-nai-tua-ton.pdf',
    'book_hope_for_life_vol_04': '/books/pdf/hope-for-life-vol-04.pdf',
    'book_yoo_sook_nai_yook_digital': '/books/pdf/yoo-sook-nai-yook-digital.pdf',
    'pubhtml5_64695646': '/books/pdf/สมดุลเท่ากับดี.pdf',
    'pubhtml5_81852783': '/books/pdf/the-science-of-meditation.pdf',
    'pubhtml5_18438372': '/books/pdf/mang-korn-sorn-jai.pdf',
    'pubhtml5_23054983': '/books/pdf/kho-khit-rob-tua.pdf',
    'pubhtml5_68005005': '/books/pdf/อย่ามโน.pdf',
    'pubhtml5_89853151': '/books/pdf/phra-traipidok-dhammachai.pdf',
    'pubhtml5_16604262': '/books/pdf/เส้นทางพระบรมฯ.pdf',
    'pubhtml5_10811287': '/books/pdf/khai-panha-khwam-chuea.pdf',
    'pubhtml5_86887339': '/books/pdf/than-lok-than-dhamma-3.pdf',
    'pubhtml5_26910324': '/books/pdf/than-lok-than-dhamma-2.pdf',
    'pubhtml5_76550937': '/books/pdf/than-lok-than-dhamma-1.pdf',
    'pubhtml5_45477721': '/books/pdf/อายุวัฒนมงคล-๖๓ปี-๔๐-พรรษา.pdf'
  };

  if (EXACT_ID_MAP[rawId]) return EXACT_ID_MAP[rawId];
  if (EXACT_ID_MAP[`book_${rawId}`]) return EXACT_ID_MAP[`book_${rawId}`];

  // 3. Precise Semantic / Title Mappings for Authentic Library Books
  if (title.includes('ทันโลกทันธรรม 3') || title.includes('ทันโลก ทันธรรม 3') || id.includes('than_lok_3')) {
    return '/books/pdf/than-lok-than-dhamma-3.pdf';
  }
  if (title.includes('ทันโลกทันธรรม 2') || title.includes('ทันโลก ทันธรรม 2') || id.includes('than_lok_2')) {
    return '/books/pdf/than-lok-than-dhamma-2.pdf';
  }
  if (title.includes('ทันโลกทันธรรม 1') || title.includes('ทันโลกทันธรรม1') || id.includes('than_lok_1')) {
    return '/books/pdf/than-lok-than-dhamma-1.pdf';
  }
  if (title.includes('พระไตรปิฎก') || id.includes('dhammachai') || id.includes('traipidok')) {
    return '/books/pdf/phra-traipidok-dhammachai.pdf';
  }
  if (title.includes('มังกรสอนใจ') || id.includes('mang_korn')) {
    return '/books/pdf/mang-korn-sorn-jai.pdf';
  }
  if (title.includes('ไขปัญหาความเชื่อ') || id.includes('khai_panha')) {
    return '/books/pdf/khai-panha-khwam-chuea.pdf';
  }
  if (title.includes('dhammaintrend') || id.includes('dhammaintrend')) {
    return '/books/pdf/dhammaintrend4.pdf';
  }
  if (title.includes('hope magazine') || id.includes('hope-magazine')) {
    return '/books/pdf/hope-magazine-vol-18.pdf';
  }
  if (id.includes('tam_jai') || id.includes('tham_jai') || title.includes('ทำใจให้พร้อมบวก')) {
    return '/books/pdf/tam-jai-hai-prom-buak.pdf';
  }
  if (id.includes('mongkol') || id.includes('124') || title.includes('มงคลชีวิต')) {
    return '/books/pdf/มงคลชีวิตฉบับทางก้าวหน้า-1.pdf';
  }
  if (id.includes('phoo_soon_sia') || title.includes('ผู้สูญเสีย')) {
    return '/books/pdf/phoo-soon-sia-tee-mai-sin-soon.pdf';
  }
  if (id.includes('secret_of_love') || title.includes('รักลูก')) {
    return '/books/pdf/secret-of-love-rak-look.pdf';
  }
  if (id.includes('the_lover') || title.includes('รักเป็นจะเห็นใจ')) {
    return '/books/pdf/the-lover-rak-pen-ja-hen-jai.pdf';
  }
  if (id.includes('yoo_nai_lok_mai') || title.includes('อยู่ในโลกใหม่') || title.includes('อยู่บนโลกใหม่')) {
    return '/books/pdf/อยู่บนโลกใหม่อย่างไม่เป็นโรค.pdf';
  }
  if (id.includes('123') || (title.includes('ลมหายใจ') && title.includes('123'))) {
    return '/books/pdf/lom-hai-jai-khao-ok-123.pdf';
  }
  if (id.includes('lom_hai_jai') || title.includes('ลมหายใจ')) {
    return '/books/pdf/lom-hai-jai-khao-ok.pdf';
  }
  if (id.includes('perd_promdan') || title.includes('เปิดพรมแดน') || title.includes('เปิดพรมเเดน')) {
    return '/books/pdf/เปิดพรมเเดนโลกเเห่งธรรมok.pdf';
  }
  if (id.includes('phro_mai_roo') || title.includes('เพราะไม่รู้')) {
    return '/books/pdf/phro-mai-roo-roo-than-cheewit.pdf';
  }
  if (id.includes('rak_thae') || title.includes('รักแท้') || title.includes('รักเเท้')) {
    return '/books/pdf/รักเเท้ไม่ได้มีเเค่ในนิยาย.pdf';
  }
  if (id.includes('love_myself') || title.includes('รักในตัวตน')) {
    return '/books/pdf/love-myself-rak-nai-tua-ton.pdf';
  }
  if (id.includes('hope_for_life') || title.includes('hope for life')) {
    return '/books/pdf/hope-for-life-vol-04.pdf';
  }
  if (id.includes('yoo_sook') || title.includes('อยู่สุข')) {
    return '/books/pdf/yoo-sook-nai-yook-digital.pdf';
  }
  if (id.includes('meditation') || title.includes('ศาสตร์แห่งสมาธิ') || title.includes('ศาสตร์เเห่งสมาธิ') || id === 'b_htht') {
    return '/books/pdf/the-science-of-meditation.pdf';
  }
  if (id.includes('kho_khit') || title.includes('ข้อคิดรอบตัว') || id === 'b_xith') {
    return '/books/pdf/kho-khit-rob-tua.pdf';
  }
  if (id.includes('khao_kor_sook') || title.includes('เขาก็สุข')) {
    return '/books/pdf/khao-kor-sook-rao-kor-sook.pdf';
  }
  if (id.includes('อย่ามโน') || title.includes('อย่ามโน')) {
    return '/books/pdf/อย่ามโน.pdf';
  }
  if (id.includes('สมดุล') || title.includes('สมดุล')) {
    return '/books/pdf/สมดุลเท่ากับดี.pdf';
  }
  if (id.includes('โกอินเตอร์') || title.includes('ตามหลวงพี่') || title.includes('โกอินเตอร์')) {
    return '/books/pdf/ตามหลวงพี่ไปโกอินเตอร์.pdf';
  }
  if (id.includes('360') || title.includes('360') || title.includes('ความสุข 360')) {
    return '/books/pdf/ความสุข-360-องศา.pdf';
  }
  if (id.includes('ความลับของความรัก') || title.includes('ความลับของความรัก')) {
    return '/books/pdf/ความลับของความรัก.pdf';
  }
  if (id.includes('อูมามิ') || title.includes('ความรักรสอูมามิ')) {
    return '/books/pdf/ความรักรสอูมามิ.pdf';
  }
  if (id.includes('กะเทาะเปลือก') || title.includes('กะเทาะเปลือก')) {
    return '/books/pdf/กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น.pdf';
  }
  if (id.includes('เส้นทางพระบรม') || title.includes('เส้นทางพระบรม')) {
    return '/books/pdf/เส้นทางพระบรมฯ.pdf';
  }
  if (id.includes('perfectionist') || title.includes('perfectionist') || title.includes('สไตล์พุทธะ')) {
    return '/books/pdf/perfectionist-สไตล์พุทธะ.pdf';
  }
  if (title.includes('อายุวัฒนมงคล') || id.includes('อายุวัฒน')) {
    return '/books/pdf/อายุวัฒนมงคล-๖๓ปี-๔๐-พรรษา.pdf';
  }

  // 4. Remote Google Drive or HTTPS PDF via CORS Proxy
  if (candidate.includes('drive.google.com') || candidate.includes('docs.google.com')) {
    return `/api/pdf-proxy?url=${encodeURIComponent(candidate)}`;
  }
  if (candidate.startsWith('http://') || candidate.startsWith('https://')) {
    return `/api/pdf-proxy?url=${encodeURIComponent(candidate)}`;
  }

  return candidate || '';
}

function PremiumFlipbookCore({ book, initialPage = 1 }: PremiumBookReaderProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 1. Reading Navigation State
  const totalPages = book.pages || book.page_count || 1;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [jumpInput, setJumpInput] = useState<string>(String(initialPage));
  const [theme, setTheme] = useState<ReaderTheme>('white');
  const [mode, setMode] = useState<ReadingMode>('flip');
  const [pageLayout, setPageLayout] = useState<'single' | 'dual'>('dual');
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);

  // 2. Drawers & Dialogs
  const [isTOCDrawerOpen, setIsTOCDrawerOpen] = useState<boolean>(false);
  const [isQuestDrawerOpen, setIsQuestDrawerOpen] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isMobileOptionsOpen, setIsMobileOptionsOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchMatch[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // 3. PDF Document & Canvas State
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [isPdfLoading, setIsPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [pdfActualPageCount, setPdfActualPageCount] = useState<number | null>(null);
  const [renderedDimensions, setRenderedDimensions] = useState<{ width: number; height: number }>({ width: 520, height: 740 });

  // 4. Persistence, Resume & Bookmarks
  const { user } = useAuth();
  const [showResumeBanner, setShowResumeBanner] = useState<boolean>(false);
  const [savedLastPage, setSavedLastPage] = useState<number | null>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [tocDrawerTab, setTocDrawerTab] = useState<'pages' | 'bookmarks'>('pages');

  // 5. Reading Pacing, Book Dimension & Gamified Reward State
  const { recordEarn } = useLearningPoints();
  const [detectedDimension, setDetectedDimension] = useState<BookDimensionInfo | null>(null);
  const [pageReadingSeconds, setPageReadingSeconds] = useState<number>(0);
  const [totalSessionSeconds, setTotalSessionSeconds] = useState<number>(0);
  const [pagesReadSession, setPagesReadSession] = useState<number>(1);
  const [isRewardPopupOpen, setIsRewardPopupOpen] = useState<boolean>(false);
  const [rewardData, setRewardData] = useState<RewardCelebrationData>({ points: 15 });
  const [hasRewardedCurrentPage, setHasRewardedCurrentPage] = useState<boolean>(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // DOM References
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasLeftRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRightRef = useRef<HTMLCanvasElement | null>(null);
  const canvasSingleRef = useRef<HTMLCanvasElement | null>(null);
  const touchStartCoords = useRef<{ x: number; y: number } | null>(null);
  const isRenderingRef = useRef<boolean>(false);
  const pendingPageRef = useRef<number | null>(null);

  const rawPdfUrl = useMemo(() => resolveBookPdfUrl(book), [book]);
  const effectiveTotalPages = pdfActualPageCount || totalPages;

  // Stable callback for continuous scroll mode page updates
  const handlePageInView = useCallback((pNum: number) => {
    setCurrentPage(prev => (prev !== pNum ? pNum : prev));
  }, []);

  // Responsive Dual vs Single Page Mode Check (Hydration-safe)
  const isDualPage = useMemo(() => {
    if (!hasMounted || typeof window === 'undefined') {
      return false;
    }
    if (window.innerWidth < 860 || window.innerHeight < 540) {
      return false; // Force single page on mobile & small viewports
    }
    return pageLayout === 'dual' && mode === 'flip';
  }, [hasMounted, pageLayout, mode]);

  // Keep jump input in sync with currentPage
  useEffect(() => {
    setJumpInput(String(currentPage));
  }, [currentPage]);

  // -------------------------------------------------------------------------
  // STEP 5: ROBUST SINGLE-CLICK BACK NAVIGATION
  // -------------------------------------------------------------------------
  const [showExitSummaryModal, setShowExitSummaryModal] = useState(false);

  const handleExecuteExit = useCallback(() => {
    // 1. Direct return if 'from' query param was passed
    const fromParam = searchParams.get('from');
    if (fromParam) {
      window.location.href = fromParam;
      return;
    }

    // 2. Check referrer if coming from same origin
    if (typeof window !== 'undefined' && document.referrer) {
      try {
        const refUrl = new URL(document.referrer);
        if (refUrl.origin === window.location.origin && !refUrl.pathname.startsWith('/reader/')) {
          window.location.href = refUrl.pathname + refUrl.search;
          return;
        }
      } catch {
        // ignore
      }
    }

    // 3. Fallback: navigate directly to book details
    if (book.id) {
      window.location.href = `/books/${book.id}`;
    } else {
      window.location.href = '/books';
    }
  }, [searchParams, book.id]);

  const handleGoBack = useCallback(() => {
    // Single click instant back without blocking modal
    handleExecuteExit();
  }, [handleExecuteExit]);

  const handleClaimReadingRewardAndExit = useCallback(async (pointsEarned: number) => {
    setShowExitSummaryModal(false);
    try {
      await recordEarn({
        type: 'reading_time_milestone',
        sourceId: book.id,
        customPoints: pointsEarned,
        customTitle: `ศึกษาธรรมะเล่ม: ${book.title}`,
        customDetail: `อ่านหนังสือต่อเนื่อง ${Math.max(1, Math.floor(totalSessionSeconds / 60))} นาที (+${pointsEarned} P)`
      });
    } catch {}
    handleExecuteExit();
  }, [recordEarn, book.id, book.title, totalSessionSeconds, handleExecuteExit]);

  const { returnMediaByBookId, isMediaBorrowed } = useLoan();
  const isBorrowed = isMediaBorrowed(book.id);

  const handleReturnBook = useCallback(() => {
    if (confirm('คุณต้องการคืนหนังสือเล่มนี้เพื่อเพิ่มโควตายืมใช่หรือไม่?')) {
      returnMediaByBookId(book.id);
      handleGoBack();
    }
  }, [book.id, returnMediaByBookId, handleGoBack]);

  // -------------------------------------------------------------------------
  // STEP 6: READING PROGRESS PERSISTENCE & BOOKMARKS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const savedTheme = localStorage.getItem('thanavuddho_reader_theme') as ReaderTheme;
      if (['white', 'sepia', 'night'].includes(savedTheme)) setTheme(savedTheme);

      const savedMode = localStorage.getItem('thanavuddho_reader_mode') as ReadingMode;
      if (['flip', 'scroll'].includes(savedMode)) setMode(savedMode);

      const savedLayout = localStorage.getItem('thanavuddho_reader_layout') as 'single' | 'dual';
      if (['single', 'dual'].includes(savedLayout)) setPageLayout(savedLayout);

      const bookmarksKey = `thanavuddho_bookmarks_${book.id}`;
      const savedBm = localStorage.getItem(bookmarksKey);
      if (savedBm) {
        setBookmarks(JSON.parse(savedBm));
      }

      const progressKey = `thanavuddho_reading_progress_${book.id}`;
      const savedProgress = localStorage.getItem(progressKey);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        const lastPage = parseInt(parsed.page, 10);
        if (!isNaN(lastPage) && lastPage > 1 && lastPage <= effectiveTotalPages && lastPage !== initialPage) {
          setSavedLastPage(lastPage);
          setShowResumeBanner(true);
        }
      }
    } catch {
      // ignore
    }

    // Fetch cloud reading progress from server API if user is authenticated
    if (user?.email) {
      fetch(`/api/books/progress?email=${encodeURIComponent(user.email)}&bookId=${encodeURIComponent(book.id)}`)
        .then(r => r.json())
        .then(data => {
          if (data.success && data.progress) {
            if (Array.isArray(data.progress.bookmarks) && data.progress.bookmarks.length > 0) {
              setBookmarks(data.progress.bookmarks);
              try {
                localStorage.setItem(`thanavuddho_bookmarks_${book.id}`, JSON.stringify(data.progress.bookmarks));
              } catch {}
            }
            const serverPage = data.progress.current_page;
            if (serverPage > 1 && serverPage <= effectiveTotalPages && serverPage !== initialPage) {
              setSavedLastPage(serverPage);
              setShowResumeBanner(true);
            }
          }
        })
        .catch(() => {});
    }
  }, [book.id, initialPage, effectiveTotalPages, user?.email]);

  // Save Progress on Page Change (LocalStorage + Server API)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const progressKey = `thanavuddho_reading_progress_${book.id}`;
      localStorage.setItem(
        progressKey,
        JSON.stringify({
          page: currentPage,
          totalPages: effectiveTotalPages,
          percent: Math.min(100, Math.round((currentPage / effectiveTotalPages) * 100)),
          mode,
          updatedAt: Date.now(),
        })
      );
    } catch {
      // ignore
    }

    // Debounced sync to cloud server API
    if (user?.email) {
      const timer = setTimeout(() => {
        fetch('/api/books/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            userId: user.id,
            bookId: book.id,
            bookTitle: book.title,
            bookCover: book.cover || (book as any).cover_image,
            currentPage,
            totalPages: effectiveTotalPages,
            bookmarks,
          })
        }).catch(() => {});
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [book.id, book.title, book.cover, currentPage, effectiveTotalPages, mode, bookmarks, user?.email, user?.id]);

  const isCurrentPageBookmarked = bookmarks.includes(currentPage);

  const handleToggleBookmark = () => {
    const isBookmarked = bookmarks.includes(currentPage);
    const updated = isBookmarked
      ? bookmarks.filter((p) => p !== currentPage)
      : [...bookmarks, currentPage].sort((a, b) => a - b);

    setBookmarks(updated);
    try {
      localStorage.setItem(`thanavuddho_bookmarks_${book.id}`, JSON.stringify(updated));
    } catch {}

    if (user?.email) {
      fetch('/api/books/progress', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          bookId: book.id,
          pageNumber: currentPage,
          bookTitle: book.title,
          bookCover: book.cover || (book as any).cover_image,
          totalPages: effectiveTotalPages,
        }),
      }).catch(() => {});
    }
  };

  // -------------------------------------------------------------------------
  // STEP 2: LOAD PDF.JS DOCUMENT & DETECT BOOK DIMENSIONS (A4, A5, B5, POCKET)
  // -------------------------------------------------------------------------
  const loadPdf = useCallback(() => {
    if (!rawPdfUrl) return;
    setIsPdfLoading(true);
    setPdfError(null);

    loadPdfDocument(rawPdfUrl)
      .then(doc => {
        setPdfDoc(doc);
        setPdfActualPageCount(doc.numPages);
        setIsPdfLoading(false);

        // Detect real paper dimension from Page 1 viewport
        doc.getPage(1)
          .then((p: any) => {
            const vp = p.getViewport({ scale: 1 });
            const dim = detectBookDimension(vp.width, vp.height);
            setDetectedDimension(dim);
          })
          .catch(() => {});
      })
      .catch(err => {
        console.warn('PDF primary load failed:', err);
        setPdfError('ไม่สามารถโหลดเอกสาร PDF ของหนังสือเล่มนี้ได้ในรูปแบบ 3D Flipbook');
        setIsPdfLoading(false);
      });
  }, [rawPdfUrl]);

  // Reading Pacing Timer
  useEffect(() => {
    if (!hasMounted) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      setPageReadingSeconds(prev => prev + 1);
      setTotalSessionSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [hasMounted]);

  // Page Navigation Transition & Pacing Check
  useEffect(() => {
    setPageReadingSeconds(0);
    setPagesReadSession(prev => prev + 1);
  }, [currentPage]);

  // Trigger gamified reward popup (Lazada/Shopee Coin Burst)
  const triggerReadingReward = useCallback((bonusReason?: string) => {
    const calc = calculateReadingPoints({
      secondsSpent: totalSessionSeconds,
      pagesRead: Math.max(1, pagesReadSession),
      dimension: detectedDimension?.code || 'A5',
      streakDays: 3
    });

    setRewardData({
      points: calc.totalPoints,
      title: bonusReason || 'เซอร์ไพรส์แต้มปัญญา! (Reading Bonus)',
      subtitle: `อ่านหนังสือสะสม ${pagesReadSession} หน้า (${Math.max(1, Math.floor(totalSessionSeconds / 60))} นาที)`,
      bonusMultiplier: calc.streakMultiplier,
      streakDays: 3,
      pagesRead: pagesReadSession,
      secondsSpent: totalSessionSeconds
    });

    setIsRewardPopupOpen(true);
    setHasRewardedCurrentPage(true);

    // Persist real points to server
    recordEarn({
      type: 'read_chapter',
      chapterIndex: currentPage,
      chapterTitle: `หน้า ${currentPage}`,
      durationSeconds: totalSessionSeconds
    });
  }, [totalSessionSeconds, pagesReadSession, detectedDimension, currentPage, recordEarn]);

  // Auto-trigger surprise reward at milestones (e.g. 3 minutes of reading, or every 10 pages)
  useEffect(() => {
    if (totalSessionSeconds > 0 && totalSessionSeconds % 180 === 0 && !hasRewardedCurrentPage) {
      triggerReadingReward('อ่านครบ 3 นาทีต่อเนื่อง! ปัญญาบารมีเพิ่มพูน');
    }
  }, [totalSessionSeconds, hasRewardedCurrentPage, triggerReadingReward]);

  useEffect(() => {
    loadPdf();
    return () => {
      if (rawPdfUrl) {
        unloadPdfDocument(rawPdfUrl);
      }
    };
  }, [loadPdf, rawPdfUrl]);

  // -------------------------------------------------------------------------
  // STEP 3: PAGE NAVIGATION HANDLERS (DEFINED FIRST FOR SAFE ASYNC USAGE)
  // -------------------------------------------------------------------------
  const turnToPage = useCallback((newPage: number) => {
    if (newPage < 1 || newPage > effectiveTotalPages) return;
    setCurrentPage(newPage);
    if (stageRef.current) {
      stageRef.current.scrollTop = 0;
    }
  }, [effectiveTotalPages]);

  const nextPage = useCallback(() => {
    const step = isDualPage ? 2 : 1;
    const target = Math.min(effectiveTotalPages, currentPage + step);
    if (target !== currentPage) {
      turnToPage(target);
    }
  }, [isDualPage, effectiveTotalPages, currentPage, turnToPage]);

  const prevPage = useCallback(() => {
    const step = isDualPage ? 2 : 1;
    const target = Math.max(1, currentPage - step);
    if (target !== currentPage) {
      turnToPage(target);
    }
  }, [isDualPage, currentPage, turnToPage]);

  // -------------------------------------------------------------------------
  // STEP 4: RENDER PDF PAGES (CONCURRENCY-PROTECTED WITH PENDING PAGE QUEUE)
  // -------------------------------------------------------------------------
  const renderCurrentPdfPages = useCallback(async () => {
    if (!pdfDoc) return;

    if (isRenderingRef.current) {
      pendingPageRef.current = currentPage;
      return;
    }
    isRenderingRef.current = true;

    try {
      const stageEl = stageRef.current;
      const stageH = stageEl && stageEl.clientHeight > 50 
        ? stageEl.clientHeight 
        : (typeof window !== 'undefined' ? window.innerHeight - 80 : 650);
      const stageW = stageEl && stageEl.clientWidth > 50 
        ? stageEl.clientWidth 
        : (typeof window !== 'undefined' ? window.innerWidth : 800);

      const availH = Math.max(80, stageH - 32);
      const availW = Math.max(100, stageW - 32);

      // Fetch authentic page aspect ratio from PDF document
      let pageRatio = 0.707; // standard A4 default
      try {
        const samplePage = await pdfDoc.getPage(Math.min(pdfDoc.numPages, Math.max(1, currentPage)));
        const vp = samplePage.getViewport({ scale: 1.0 });
        if (vp.width && vp.height) {
          pageRatio = vp.width / vp.height;
        }
      } catch {
        pageRatio = 0.707;
      }

      if (isDualPage) {
        // Dual page spread: page 1 on right or pair 2-3, 4-5
        const leftPageNum = currentPage % 2 === 0 ? currentPage : currentPage - 1;
        const rightPageNum = leftPageNum + 1;
        const perPageAvailW = Math.max(50, Math.floor((availW - 20) / 2));

        let baseH = availH;
        let baseW = Math.floor(baseH * pageRatio);
        if (baseW > perPageAvailW) {
          baseW = perPageAvailW;
          baseH = Math.floor(baseW / pageRatio);
        }
        if (baseH > availH) {
          baseH = availH;
          baseW = Math.floor(baseH * pageRatio);
        }

        const targetW = Math.max(50, Math.floor(baseW * zoomScale));
        const targetH = Math.max(70, Math.floor(baseH * zoomScale));

        setRenderedDimensions({ width: targetW, height: targetH });

        if (canvasLeftRef.current && leftPageNum >= 1 && leftPageNum <= pdfDoc.numPages) {
          await renderPdfPageToCanvas(pdfDoc, leftPageNum, canvasLeftRef.current, {
            targetHeight: targetH,
            targetWidth: targetW,
          });
        }

        if (canvasRightRef.current && rightPageNum >= 1 && rightPageNum <= pdfDoc.numPages) {
          await renderPdfPageToCanvas(pdfDoc, rightPageNum, canvasRightRef.current, {
            targetHeight: targetH,
            targetWidth: targetW,
          });
        }
      } else {
        // Single Page Mode: accurately fit within available stage area at 1.0 zoom on notebooks
        let baseH = availH;
        let baseW = Math.floor(baseH * pageRatio);
        if (baseW > availW) {
          baseW = availW;
          baseH = Math.floor(baseW / pageRatio);
        }
        if (baseH > availH) {
          baseH = availH;
          baseW = Math.floor(baseH * pageRatio);
        }

        const targetW = Math.max(80, Math.floor(baseW * zoomScale));
        const targetH = Math.max(120, Math.floor(baseH * zoomScale));

        setRenderedDimensions({ width: targetW, height: targetH });

        if (canvasSingleRef.current && currentPage <= pdfDoc.numPages) {
          await renderPdfPageToCanvas(pdfDoc, currentPage, canvasSingleRef.current, {
            targetHeight: targetH,
            targetWidth: targetW,
          });
        }
      }
    } catch (err: any) {
      if (err?.name !== 'RenderingCancelledException') {
        console.error('Error rendering PDF page:', err);
      }
    } finally {
      isRenderingRef.current = false;
      if (pendingPageRef.current !== null && pendingPageRef.current !== currentPage) {
        const nextTarget = pendingPageRef.current;
        pendingPageRef.current = null;
        turnToPage(nextTarget);
      }
    }
  }, [pdfDoc, isDualPage, currentPage, zoomScale, turnToPage]);

  useEffect(() => {
    if (pdfDoc && mode === 'flip') {
      renderCurrentPdfPages();
    }
  }, [pdfDoc, mode, currentPage, isDualPage, zoomScale, renderCurrentPdfPages]);

  // Window Resize
  useEffect(() => {
    const handleResize = () => {
      if (pdfDoc && mode === 'flip') {
        renderCurrentPdfPages();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDoc, mode, renderCurrentPdfPages]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      } else if (e.key.toLowerCase() === 'z' || e.key.toLowerCase() === 'h') {
        setShowControls(s => !s);
      } else if (e.key === '+' || e.key === '=') {
        setZoomScale(z => Math.min(2.5, Number((z + 0.15).toFixed(2))));
      } else if (e.key === '-') {
        setZoomScale(z => Math.max(0.7, Number((z - 0.15).toFixed(2))));
      } else if (e.key === '0') {
        setZoomScale(1.0);
      } else if (e.key === 'Escape') {
        setIsTOCDrawerOpen(false);
        setIsSettingsOpen(false);
        setIsSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextPage, prevPage]);

  // Touch Pinch-to-Zoom & Swipe Handlers for mobile & tablet
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef<number>(1.0);
  const lastTapTime = useRef<number>(0);

  const getTouchDistance = (t1: React.Touch, t2: React.Touch) => {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (mode !== 'flip') return;
    if (e.touches.length === 2) {
      pinchStartDist.current = getTouchDistance(e.touches[0], e.touches[1]);
      pinchStartScale.current = zoomScale;
      touchStartCoords.current = null;
    } else if (e.touches.length === 1) {
      pinchStartDist.current = null;
      const now = Date.now();
      if (now - lastTapTime.current < 300) {
        // Double-tap: quick toggle between normal 100% and 180% zoom for fine reading
        setZoomScale(prev => (prev > 1.2 ? 1.0 : 1.8));
        lastTapTime.current = 0;
        touchStartCoords.current = null;
        return;
      }
      lastTapTime.current = now;
      touchStartCoords.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (mode !== 'flip') return;
    if (e.touches.length === 2 && pinchStartDist.current) {
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      const ratio = currentDist / pinchStartDist.current;
      const newScale = Math.min(3.5, Math.max(0.6, Number((pinchStartScale.current * ratio).toFixed(2))));
      setZoomScale(newScale);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (mode !== 'flip') return;
    if (e.touches.length < 2) {
      pinchStartDist.current = null;
    }
    if (!touchStartCoords.current || e.changedTouches.length === 0) return;
    const diffX = e.changedTouches[0].clientX - touchStartCoords.current.x;
    const diffY = e.changedTouches[0].clientY - touchStartCoords.current.y;
    touchStartCoords.current = null;

    // Only swipe to turn page if user is not zoomed in, allowing seamless pan navigation
    if (zoomScale <= 1.15 && Math.abs(diffX) > 35 && Math.abs(diffX) > Math.abs(diffY) * 1.3) {
      if (diffX < 0) {
        nextPage();
      } else {
        prevPage();
      }
    }
  };

  // Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Search in PDF Handler
  const handleSearchPdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfDoc || !searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchPdfText(pdfDoc, searchQuery);
      setSearchResults(results);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  // Theme Styling (Deep Navy Toolbars with Cream/Soft-White Paper for Reading Comfort)
  const themeClasses = useMemo(() => {
    switch (theme) {
      case 'sepia':
        return {
          viewportBg: 'bg-[#F5EEDB] text-[#382b1d]',
          stageBg: 'bg-[#EBDDC3]',
          paperBg: 'bg-[#FAF4E6] text-[#382b1d] border-[#DECFA9] shadow-[0_12px_36px_rgba(56,43,29,0.08)]',
          headerBg: 'bg-[#073B65] border-white/10 text-white shadow-md',
          footerBg: 'bg-[#073B65] border-white/10 text-white shadow-md',
          accent: 'text-[#D9A441]',
          accentBg: 'bg-[#D9A441] hover:bg-[#C59132] text-white',
        };
      case 'night':
        return {
          viewportBg: 'bg-zinc-950 text-zinc-100',
          stageBg: 'bg-zinc-900',
          paperBg: 'bg-zinc-900 text-zinc-100 border-zinc-800 shadow-2xl',
          headerBg: 'bg-[#052946] border-white/10 text-white shadow-md',
          footerBg: 'bg-[#052946] border-white/10 text-white shadow-md',
          accent: 'text-sky-400',
          accentBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white',
        };
      case 'white':
      default:
        return {
          viewportBg: 'bg-[#F0F4F8] text-[#243447]',
          stageBg: 'bg-[#F0F4F8]',
          paperBg: 'bg-[#FFFDF9] text-[#243447] border-[#E8DFC8] shadow-[0_12px_36px_rgba(7,59,101,0.08)]',
          headerBg: 'bg-[#073B65] border-white/10 text-white shadow-md',
          footerBg: 'bg-[#073B65] border-white/10 text-white shadow-md',
          accent: 'text-[#079FE8]',
          accentBg: 'bg-[#079FE8] hover:bg-[#0588c7] text-white',
        };
    }
  }, [theme]);

  const progressPercent = Math.min(100, Math.round((currentPage / effectiveTotalPages) * 100));

  return (
    <div 
      className={`fixed inset-0 z-[100] flex flex-col font-sans select-none overflow-hidden ${themeClasses.viewportBg}`}
    >
      {/* =========================================================================
          1. TOP TOOLBAR: BACK BUTTON, TITLE, SEARCH, TOC, THEMES, ZOOM, FULLSCREEN
         ========================================================================= */}
      <header className={`h-12 px-3 sm:px-5 border-b flex items-center justify-between shrink-0 z-40 backdrop-blur-md transition-all duration-300 shadow-md ${
        showControls ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
      } ${themeClasses.headerBg}`}>
        
        {/* Left: Instant Back Button & Book Title */}
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
            <div className="flex items-center gap-1.5">
              <h1 className="font-extrabold line-clamp-1 text-xs sm:text-sm tracking-tight text-white max-w-[125px] min-[360px]:max-w-[165px] sm:max-w-xs md:max-w-md">
                {book.title}
              </h1>
              <span className="text-[9.5px] text-zinc-300 font-mono font-bold bg-white/10 px-1.5 py-0.5 rounded md:hidden shrink-0">
                {currentPage}/{effectiveTotalPages}
              </span>
              {detectedDimension && (
                <span 
                  className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md text-[9px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30"
                  title={`${detectedDimension.labelTh}: ${detectedDimension.descriptionTh}`}
                >
                  📐 {detectedDimension.code}
                </span>
              )}
            </div>
            <div className="text-[10px] text-zinc-400 hidden md:block truncate">
              {book.author_name || 'พระครูปลัดสุวัฒนโพธิคุณ'} • รวม {effectiveTotalPages} หน้า
            </div>
          </div>
        </div>

        {/* Right: Controls, Reading Pacing & Modes */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">

          {/* Reading Timer per page */}
          <div 
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300"
            title="ตัวจับเวลาการอ่านหน้านี้ (วินาที)"
          >
            <Timer size={13} className="text-sky-400 animate-pulse" />
            <span>
              {String(Math.floor(pageReadingSeconds / 60)).padStart(2, '0')}:
              {String(pageReadingSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Lazada / Shopee Surprise Reward Streak Button */}
          <button
            onClick={() => triggerReadingReward('กดรับแต้มอ่านหนังสือ (Lazada Reward Style)')}
            className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-sky-500/20 via-blue-500/20 to-sky-500/20 hover:from-sky-500/30 hover:to-blue-500/30 border border-sky-400/40 text-sky-300 text-xs font-bold transition-all shadow-xs cursor-pointer"
            title="เซอร์ไพรส์รับแต้มสะสมปัญญาบารมี (Lazada / Shopee Gamified Streak)"
          >
            <Coins size={14} className="text-sky-300 animate-bounce" />
            <span>รับแต้ม</span>
          </button>
          
          {/* Return Book Button (For active loan) */}
          {isBorrowed && (
            <button
              onClick={handleReturnBook}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white/10 hover:bg-rose-500/20 hover:text-rose-200 border border-white/15 text-zinc-300 text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="คืนหนังสือเล่มนี้เพื่อเพิ่มโควตายืม"
            >
              <RotateCcw size={12} />
              <span className="hidden sm:inline">คืนหนังสือ</span>
            </button>
          )}

          {/* Mode Switcher: 📖 หน้าต่อหน้า (Flip) vs 📜 เลื่อนอ่าน (Scroll) */}
          <div className="hidden md:flex items-center rounded-xl p-0.5 border border-white/15 bg-white/5 shrink-0">
            <button
              onClick={() => {
                setMode('flip');
                localStorage.setItem('thanavuddho_reader_mode', 'flip');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                mode === 'flip' ? 'bg-sky-600 text-white shadow-xs' : 'text-zinc-300 hover:text-white'
              }`}
              title="เปิดอ่านหน้าต่อหน้า (สไตล์หนังสือจริง)"
            >
              <BookOpen size={13} />
              <span className="hidden sm:inline">หน้าต่อหน้า</span>
            </button>

            <button
              onClick={() => {
                setMode('scroll');
                localStorage.setItem('thanavuddho_reader_mode', 'scroll');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                mode === 'scroll' ? 'bg-sky-600 text-white shadow-xs' : 'text-zinc-300 hover:text-white'
              }`}
              title="เลื่อนอ่านต่อเนื่อง (Continuous Scroll)"
            >
              <Scroll size={13} />
              <span className="hidden sm:inline">เลื่อนอ่าน</span>
            </button>
          </div>

          {/* Search Button */}
          <button
            onClick={() => setIsSearchOpen(s => !s)}
            className={`hidden md:inline-flex p-2 rounded-xl border transition-all cursor-pointer ${
              isSearchOpen ? 'bg-sky-600 border-sky-500 text-white' : 'bg-white/5 border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title="ค้นหาข้อความในเอกสาร PDF"
          >
            <Search size={15} />
          </button>

          {/* Table of Contents & Quick Jump */}
          <button
            onClick={() => setIsTOCDrawerOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 border border-white/15 text-xs font-bold text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="สารบัญและเลือกหน้า"
          >
            <List size={15} />
            <span className="hidden md:inline">สารบัญ</span>
          </button>

          {/* Quest Journal & Easter Eggs Trigger */}
          <button
            onClick={() => setIsQuestDrawerOpen(true)}
            className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-sky-500/15 hover:bg-sky-500/25 border border-sky-500/40 hover:border-sky-400 text-xs font-bold text-sky-300 hover:text-sky-200 transition-all cursor-pointer shadow-sm"
            title="เปิดสมุดภารกิจ Quest Journal & Easter Eggs"
          >
            <Compass size={15} className="text-sky-400" />
            <span className="hidden md:inline">ภารกิจ</span>
          </button>

          {/* Mobile All-in-One Options Button */}
          <button
            onClick={() => setIsMobileOptionsOpen(true)}
            className="md:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs cursor-pointer border border-white/20 active:scale-95 shadow-xs"
            title="เปิดเครื่องมือและตัวเลือกการอ่าน"
          >
            <Settings size={14} />
            <span>ตัวเลือก</span>
          </button>

          {/* Theme & Settings Trigger (Desktop) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setIsSettingsOpen(s => !s)}
              className="p-2 rounded-xl bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="ธีมสีและการจัดหน้า"
            >
              <Settings size={15} />
            </button>

            {/* Settings Popover */}
            {isSettingsOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 p-4 rounded-2xl shadow-2xl border border-zinc-700 bg-zinc-900 text-white z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-zinc-800">
                  <span className="text-xs font-bold">ปรับแต่งการอ่าน</span>
                  <button onClick={() => setIsSettingsOpen(false)} className="p-1 hover:bg-zinc-800 rounded-lg">
                    <X size={14} />
                  </button>
                </div>

                {/* Theme Selector */}
                <div className="mb-4">
                  <span className="text-[11px] font-bold text-zinc-400 block mb-2">ธีมและโทนสี</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setTheme('white')}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 text-xs font-bold border transition-all ${
                        theme === 'white' ? 'border-sky-500 bg-zinc-800 text-sky-300' : 'bg-zinc-800/50 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <Sun size={15} />
                      <span className="text-[10px]">คลาสสิก</span>
                    </button>
                    <button
                      onClick={() => setTheme('sepia')}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 text-xs font-bold border transition-all ${
                        theme === 'sepia' ? 'border-sky-500 bg-[#f4ebd0] text-[#382b1d]' : 'bg-[#faf3e0]/20 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <Coffee size={15} />
                      <span className="text-[10px]">ถนอมตา</span>
                    </button>
                    <button
                      onClick={() => setTheme('night')}
                      className={`p-2 rounded-xl text-center flex flex-col items-center gap-1 text-xs font-bold border transition-all ${
                        theme === 'night' ? 'border-sky-400 bg-black text-sky-400' : 'bg-zinc-800/50 border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <Moon size={15} />
                      <span className="text-[10px]">โหมดมืด</span>
                    </button>
                  </div>
                </div>

                {/* Layout Mode (1 Page vs 2 Pages) */}
                {mode === 'flip' && (
                  <div className="mb-2">
                    <span className="text-[11px] font-bold text-zinc-400 block mb-2">รูปแบบหน้าจอ</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setPageLayout('single');
                          localStorage.setItem('thanavuddho_reader_layout', 'single');
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          pageLayout === 'single' ? 'bg-sky-600 text-white border-sky-500' : 'bg-zinc-800/50 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        1 หน้า (อ่านง่าย)
                      </button>
                      <button
                        onClick={() => {
                          setPageLayout('dual');
                          localStorage.setItem('thanavuddho_reader_layout', 'dual');
                        }}
                        className={`p-2 rounded-xl text-xs font-bold border transition-all ${
                          pageLayout === 'dual' ? 'bg-sky-600 text-white border-sky-500' : 'bg-zinc-800/50 border-zinc-700 text-zinc-300'
                        }`}
                      >
                        2 หน้า (กางแบบเล่ม)
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bookmark Button (Desktop) */}
          <button
            onClick={handleToggleBookmark}
            className={`hidden md:inline-flex p-2 rounded-xl border transition-all cursor-pointer shrink-0 items-center gap-1.5 text-xs font-bold ${
              isCurrentPageBookmarked
                ? 'bg-sky-500/25 border-sky-400 text-sky-300 shadow-sm'
                : 'bg-white/5 border-white/15 text-zinc-300 hover:text-white hover:bg-white/10'
            }`}
            title={isCurrentPageBookmarked ? 'นำที่คั่นหน้านี้ออก' : 'คั่นหน้านี้ไว้'}
          >
            <Bookmark size={15} className={isCurrentPageBookmarked ? 'fill-sky-400 text-sky-400' : ''} />
            <span className="hidden sm:inline">{isCurrentPageBookmarked ? 'คั่นแล้ว' : 'คั่นหน้า'}</span>
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-xl bg-white/5 border border-white/15 text-zinc-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shrink-0"
            title={isFullscreen ? 'ออกจากเต็มจอ' : 'เปิดอ่านเต็มจอ'}
          >
            {isFullscreen ? <Minimize size={15} /> : <Maximize size={15} />}
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE ALL-IN-ONE OPTIONS BOTTOM DRAWER
         ========================================================================= */}
      {isMobileOptionsOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsMobileOptionsOpen(false)}
        >
          <div 
            className="bg-zinc-900 border-t border-zinc-700 w-full rounded-t-3xl p-5 text-white max-h-[85vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom-5 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Settings size={18} className="text-sky-400" />
                <h3 className="font-extrabold text-sm text-white">ตัวเลือกและการตั้งค่าการอ่าน</h3>
              </div>
              <button
                onClick={() => setIsMobileOptionsOpen(false)}
                className="p-1.5 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            {/* Section 1: Reading Mode Switcher */}
            <div className="mb-4">
              <span className="text-xs font-bold text-zinc-400 block mb-2">โหมดการอ่าน</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMode('flip');
                    localStorage.setItem('thanavuddho_reader_mode', 'flip');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    mode === 'flip'
                      ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <BookOpen size={16} />
                  <span>หน้าต่อหน้า (Flip)</span>
                </button>
                <button
                  onClick={() => {
                    setMode('scroll');
                    localStorage.setItem('thanavuddho_reader_mode', 'scroll');
                  }}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold border transition-all ${
                    mode === 'scroll'
                      ? 'bg-sky-600 border-sky-500 text-white shadow-md'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Scroll size={16} />
                  <span>เลื่อนอ่านต่อเนื่อง</span>
                </button>
              </div>
            </div>

            {/* Section 2: Reading Theme */}
            <div className="mb-4">
              <span className="text-xs font-bold text-zinc-400 block mb-2">ธีมและโทนสีถนอมสายตา</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setTheme('white')}
                  className={`py-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all ${
                    theme === 'white' ? 'border-sky-500 bg-zinc-800 text-sky-300 ring-2 ring-sky-500/30' : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Sun size={16} />
                  <span className="text-[10px]">คลาสสิก</span>
                </button>
                <button
                  onClick={() => setTheme('sepia')}
                  className={`py-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all ${
                    theme === 'sepia' ? 'border-amber-400 bg-[#382b1d] text-amber-200 ring-2 ring-amber-400/30' : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Coffee size={16} />
                  <span className="text-[10px]">ถนอมตา</span>
                </button>
                <button
                  onClick={() => setTheme('night')}
                  className={`py-2 rounded-xl flex flex-col items-center gap-1 text-xs font-bold border transition-all ${
                    theme === 'night' ? 'border-sky-400 bg-black text-sky-400 ring-2 ring-sky-400/30' : 'bg-zinc-800/60 border-zinc-700 text-zinc-300'
                  }`}
                >
                  <Moon size={16} />
                  <span className="text-[10px]">โหมดมืด</span>
                </button>
              </div>
            </div>

            {/* Section 3: Essential Tools */}
            <div className="mb-4">
              <span className="text-xs font-bold text-zinc-400 block mb-2">เครื่องมือช่วยเหลือ</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setIsMobileOptionsOpen(false);
                    setIsSearchOpen(true);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold"
                >
                  <Search size={16} className="text-sky-400" />
                  <span>ค้นหาในเล่ม</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileOptionsOpen(false);
                    setIsTOCDrawerOpen(true);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold"
                >
                  <List size={16} className="text-sky-400" />
                  <span>สารบัญและหน้า</span>
                </button>

                <button
                  onClick={() => {
                    setIsMobileOptionsOpen(false);
                    setIsQuestDrawerOpen(true);
                  }}
                  className="flex items-center gap-2 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-200 hover:text-white text-xs font-bold"
                >
                  <Compass size={16} className="text-amber-400" />
                  <span>สมุดภารกิจ</span>
                </button>

                <button
                  onClick={() => {
                    handleToggleBookmark();
                  }}
                  className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${
                    isCurrentPageBookmarked
                      ? 'bg-sky-500/20 border-sky-400 text-sky-300'
                      : 'bg-zinc-800 border-zinc-700 text-zinc-200 hover:text-white'
                  }`}
                >
                  <Bookmark size={16} className={isCurrentPageBookmarked ? 'fill-sky-400 text-sky-400' : 'text-zinc-400'} />
                  <span>{isCurrentPageBookmarked ? 'คั่นหน้านี้แล้ว' : 'คั่นหน้านี้ไว้'}</span>
                </button>
              </div>
            </div>

            {/* Section 4: Gamification & Return */}
            <div className="pt-2 border-t border-zinc-800 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsMobileOptionsOpen(false);
                  triggerReadingReward('กดรับแต้มอ่านหนังสือ (Lazada Reward Style)');
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 via-blue-600 to-sky-600 text-white font-bold text-xs shadow-md"
              >
                <Coins size={16} className="text-amber-300 animate-bounce" />
                <span>เซอร์ไพรส์รับแต้มสะสมบารมี 🪙</span>
              </button>

              {isBorrowed && (
                <button
                  onClick={() => {
                    setIsMobileOptionsOpen(false);
                    handleReturnBook();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/10 hover:bg-rose-500/20 text-zinc-300 hover:text-rose-200 font-bold text-xs transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>คืนหนังสือเพื่อเพิ่มโควตา</span>
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          SEARCH IN PDF POP-DOWN DRAWER
         ========================================================================= */}
      {isSearchOpen && (
        <div className="z-30 bg-zinc-900 border-b border-zinc-800 p-4 shadow-xl text-white animate-in slide-in-from-top-3 duration-200">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            <form onSubmit={handleSearchPdf} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="พิมพ์คำที่ต้องการค้นหาในเอกสาร PDF..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-sky-500"
                />
              </div>
              <button
                type="submit"
                disabled={isSearching || !searchQuery.trim()}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                {isSearching ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                <span>ค้นหา</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={15} />
              </button>
            </form>

            {searchResults.length > 0 && (
              <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                <div className="text-[11px] text-zinc-400 font-semibold">
                  พบ {searchResults.length} แห่งในเล่ม (คลิกเพื่อเปิดหน้าที่พบข้อความ):
                </div>
                {searchResults.map((match, mIdx) => (
                  <div
                    key={mIdx}
                    onClick={() => {
                      turnToPage(match.pageNum);
                      setIsSearchOpen(false);
                    }}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs transition-colors cursor-pointer flex items-center justify-between gap-2"
                  >
                    <span className="text-zinc-300 truncate">{match.snippet}</span>
                    <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono text-[11px] shrink-0">
                      หน้า {match.pageNum}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          RESUME READING TOAST (POLITE AND NON-INTRUSIVE)
         ========================================================================= */}
      {showControls && showResumeBanner && savedLastPage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="bg-zinc-900/95 text-white border border-sky-500/40 backdrop-blur-md px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-3 text-xs">
            <span>อ่านค้างไว้ที่หน้า <strong className="text-sky-400 font-mono">{savedLastPage}</strong> ต้องการอ่านต่อไหม?</span>
            <button
              onClick={() => {
                turnToPage(savedLastPage);
                setShowResumeBanner(false);
              }}
              className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 rounded-lg font-bold transition-all cursor-pointer"
            >
              อ่านต่อ
            </button>
            <button
              onClick={() => setShowResumeBanner(false)}
              className="p-1 hover:bg-white/10 rounded text-zinc-400 hover:text-white cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          3. MAIN STAGE / READING CANVASES
         ========================================================================= */}
      <main 
        ref={stageRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setShowControls(s => !s);
          }
        }}
        className={`flex-grow relative flex flex-col items-center justify-start overflow-y-auto overflow-x-auto select-none transition-colors duration-200 min-h-0 w-full p-2 sm:p-4 overscroll-contain touch-manipulation ${themeClasses.stageBg}`}
      >
        {/* Loading Overlay */}
        {isPdfLoading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/40 backdrop-blur-xs text-center p-4">
            <Loader2 className="w-10 h-10 animate-spin text-sky-400 mb-3" />
            <h4 className="font-bold text-sm text-white">กำลังเปิดหน้าหนังสือจากต้นฉบับจริง...</h4>
            <p className="text-xs text-zinc-300 mt-1 max-w-xs">
              ระบบกำลังเรนเดอร์เอกสาร PDF ความคมชัดสูง
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {pdfError && (
          <div className="m-auto max-w-lg p-6 sm:p-8 rounded-3xl bg-zinc-900 text-white shadow-2xl border border-red-500/30 text-center animate-fadeIn">
            <AlertCircle size={36} className="text-rose-500 mx-auto mb-3" />
            <h4 className="font-bold text-base mb-1">พบข้อผิดพลาดในการโหลดไฟล์</h4>
            <p className="text-xs text-zinc-300 mb-4 leading-relaxed">{pdfError}</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
              {(book.reader_url || book.source_url || (book as any).drive_file_id) && (
                <button
                  onClick={() => router.push(`/reader/${book.id}?mode=embed`)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <BookOpen size={14} />
                  <span>เปิดอ่านผ่าน Web Viewer</span>
                </button>
              )}

              <button
                onClick={loadPdf}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw size={14} />
                <span>ลองโหลดใหม่อีกครั้ง</span>
              </button>

              <button
                onClick={handleGoBack}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer"
              >
                กลับไปหน้ารายละเอียด
              </button>
            </div>
          </div>
        )}

        {/* =======================================================================
            MODE B: REALISTIC PAGE-BY-PAGE / BOOK FLIP (PUB HTML5-LIKE 3D BOOK)
           ======================================================================= */}
        {mode === 'flip' && !pdfError && (
          <>
            {/* Desktop & Mobile Left Page Navigation Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                prevPage();
              }}
              disabled={currentPage <= 1}
              className={`fixed left-2 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-black/70 hover:bg-black/90 text-white shadow-2xl border border-white/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-90 disabled:opacity-0 disabled:pointer-events-none group select-none backdrop-blur-md ${
                showControls ? 'opacity-100 scale-100' : 'opacity-40 hover:opacity-90 scale-90'
              }`}
              title="หน้าก่อนหน้า"
            >
              <ChevronLeft size={22} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>

            {/* Desktop & Mobile Right Page Navigation Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                nextPage();
              }}
              disabled={currentPage >= effectiveTotalPages}
              className={`fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-sky-600/90 sm:bg-black/70 hover:bg-sky-600 sm:hover:bg-black/90 text-white shadow-2xl border border-white/20 flex items-center justify-center cursor-pointer transition-all hover:scale-110 active:scale-90 disabled:opacity-0 disabled:pointer-events-none group select-none backdrop-blur-md ${
                showControls ? 'opacity-100 scale-100' : 'opacity-60 hover:opacity-90 scale-90'
              }`}
              title="หน้าถัดไป"
            >
              <ChevronRight size={22} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            {/* Realistic Physical Book Stage Container Wrapper */}
            <div 
              className="w-full min-h-full flex flex-col items-center my-auto shrink-0"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowControls(s => !s);
                }
              }}
            >
              <div 
                className="relative flex items-center justify-center shrink-0 select-none mx-auto my-auto transition-all duration-150"
                style={{
                  width: isDualPage ? `${renderedDimensions.width * 2}px` : `${renderedDimensions.width}px`,
                  height: `${renderedDimensions.height}px`,
                }}
              >
                {isDualPage ? (
                  /* Dual Page Spread (PUB HTML5 Wood/Desk Realism) */
                  <div className="relative w-full h-full flex rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-black/30 bg-white">
                    
                    {/* Left Page */}
                    <div 
                      onClick={prevPage}
                      className="relative w-1/2 h-full flex flex-col items-center justify-center overflow-hidden border-r border-zinc-200 bg-white cursor-pointer select-none group/left"
                      title="คลิกหน้าซ้ายเพื่อย้อนกลับ"
                    >
                      {/* Spine Shadow Gradient on Left Page inner edge */}
                      <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-black/15 via-black/5 to-transparent pointer-events-none z-10" />
                      <canvas ref={canvasLeftRef} className="block w-full h-full object-contain pointer-events-none" />
                      <div className="absolute bottom-2.5 left-5 text-[10px] text-zinc-400 font-mono font-bold bg-white/90 px-2 py-0.5 rounded shadow-xs">
                        {currentPage % 2 === 0 ? currentPage : currentPage - 1}
                      </div>
                    </div>

                    {/* Right Page */}
                    <div 
                      onClick={nextPage}
                      className="relative w-1/2 h-full flex flex-col items-center justify-center overflow-hidden bg-white cursor-pointer select-none group/right"
                      title="คลิกหน้าขวาเพื่อเปิดหน้าถัดไป"
                    >
                      {/* Spine Shadow Gradient on Right Page inner edge */}
                      <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-black/15 via-black/5 to-transparent pointer-events-none z-10" />
                      <canvas ref={canvasRightRef} className="block w-full h-full object-contain pointer-events-none" />
                      <div className="absolute bottom-2.5 right-5 text-[10px] text-zinc-400 font-mono font-bold bg-white/90 px-2 py-0.5 rounded shadow-xs">
                        {(currentPage % 2 === 0 ? currentPage : currentPage - 1) + 1}
                      </div>
                    </div>

                  </div>
                ) : (
                  /* Single Page View */
                  <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center bg-white border border-zinc-300">
                    <canvas ref={canvasSingleRef} className="block w-full h-full object-contain pointer-events-none" />

                    {/* Left Click Zone (Prev Page - 32% width) */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        prevPage();
                      }}
                      className="absolute left-0 top-0 bottom-0 w-[32%] z-20 cursor-pointer select-none"
                      title="แตะด้านซ้ายเพื่อย้อนกลับ"
                    />

                    {/* Middle Click Zone (Toggle Menu - 36% width) */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowControls(s => !s);
                      }}
                      className="absolute left-[32%] right-[32%] top-0 bottom-0 z-20 cursor-pointer select-none"
                      title="แตะตรงกลางเพื่อแสดง/ซ่อนแถบเมนู (อ่านเต็มตา)"
                    />

                    {/* Right Click Zone (Next Page - 32% width) */}
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        nextPage();
                      }}
                      className="absolute right-0 top-0 bottom-0 w-[32%] z-20 cursor-pointer select-none"
                      title="แตะด้านขวาเพื่อเปิดหน้าถัดไป"
                    />

                    <div className="absolute bottom-2.5 right-5 text-[10px] text-zinc-400 font-mono font-bold bg-white/90 px-2 py-0.5 rounded shadow-xs pointer-events-none">
                      {currentPage}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* =======================================================================
            MODE A: CONTINUOUS SCROLL MODE (LAZY-LOADED FOR BUTTERY-SMOOTH READING)
           ======================================================================= */}
        {mode === 'scroll' && !pdfError && (
          <div className="w-full max-w-4xl mx-auto flex flex-col items-center gap-6 py-4 select-text shrink-0">
            {pdfDoc && Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((pNum) => (
              <PdfLazyScrollItem 
                key={pNum} 
                pdfDoc={pdfDoc} 
                pageNum={pNum} 
                zoomScale={zoomScale} 
                onInView={handlePageInView}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating Zoom Indicator & Quick Reset on Mobile / Zoomed View */}
      {zoomScale > 1.05 && (
        <div className="fixed bottom-16 sm:bottom-20 right-3 sm:right-6 z-40 flex items-center gap-2 bg-black/85 backdrop-blur-md text-white border border-white/20 px-3 py-1.5 rounded-full shadow-2xl animate-fade-in text-xs font-bold select-none">
          <span className="text-sky-300">🔍 {Math.round(zoomScale * 100)}%</span>
          <button 
            onClick={() => setZoomScale(1.0)} 
            className="p-1 rounded-full hover:bg-white/20 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-1"
            title="รีเซ็ตกลับขนาดปกติ (100%)"
          >
            <RotateCcw size={12} />
            <span className="text-[10px] hidden min-[360px]:inline">รีเซ็ต</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          4. BOTTOM TOOLBAR: PREV, DIRECT PAGE JUMP INPUT, SLIDER, NEXT
         ========================================================================= */}
      <footer className={`h-12 px-3 sm:px-5 border-t flex items-center justify-between shrink-0 z-40 backdrop-blur-md transition-all duration-300 shadow-md ${
        showControls ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      } ${themeClasses.footerBg}`}>
        
        {/* Previous Button */}
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-white disabled:opacity-25 transition-all cursor-pointer border border-white/10"
        >
          <ChevronLeft size={16} />
          <span className="hidden sm:inline">หน้าก่อนหน้า</span>
        </button>

        {/* Center: Jump to Page Input & Range Scrubber */}
        <div className="flex items-center gap-2 sm:gap-4 flex-1 max-w-md justify-center mx-2">
          
          {/* Zoom Buttons (Visible on Mobile, Tablet & Desktop) */}
          <div className="flex items-center border border-white/20 bg-white/10 backdrop-blur-md rounded-xl p-0.5 shrink-0">
            <button
              onClick={() => setZoomScale(z => Math.max(0.5, Number((z - 0.2).toFixed(2))))}
              className="p-1 sm:p-1.5 hover:bg-white/20 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="ย่อขนาด (-)"
              aria-label="ย่อขนาด"
            >
              <ZoomOut size={13} />
            </button>
            <button
              onClick={() => setZoomScale(1.0)}
              className="px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-bold text-zinc-200 hover:text-white transition-all cursor-pointer min-w-[38px] text-center"
              title="รีเซ็ตเป็น 100%"
            >
              {Math.round(zoomScale * 100)}%
            </button>
            <button
              onClick={() => setZoomScale(z => Math.min(3.5, Number((z + 0.2).toFixed(2))))}
              className="p-1 sm:p-1.5 hover:bg-white/20 rounded-lg text-zinc-300 hover:text-white transition-all cursor-pointer active:scale-95"
              title="ขยายขนาด (+)"
              aria-label="ขยายขนาด"
            >
              <ZoomIn size={13} />
            </button>
          </div>

          {/* Jump to Page Input Box (Direct Entry) */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/15 rounded-xl text-xs">
            <input
              type="number"
              min={1}
              max={effectiveTotalPages}
              value={jumpInput}
              onChange={(e) => setJumpInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const p = parseInt(jumpInput, 10);
                  if (!isNaN(p) && p >= 1 && p <= effectiveTotalPages) {
                    turnToPage(p);
                  }
                }
              }}
              onBlur={() => {
                const p = parseInt(jumpInput, 10);
                if (!isNaN(p) && p >= 1 && p <= effectiveTotalPages) {
                  turnToPage(p);
                } else {
                  setJumpInput(String(currentPage));
                }
              }}
              className="w-10 text-center font-mono font-extrabold text-white bg-black/40 border border-white/20 rounded-md py-0.5 focus:outline-none focus:ring-1 focus:ring-sky-500"
              title="กรอกเลขหน้าที่ต้องการไปแล้วกด Enter"
            />
            <span className="font-mono text-zinc-400 font-bold">/ {effectiveTotalPages}</span>
          </div>

          {/* Scrubber Range Slider (Desktop) */}
          <div className="hidden md:flex items-center gap-2 w-full max-w-[120px] shrink-0">
            <input 
              type="range"
              min={1}
              max={effectiveTotalPages}
              value={currentPage}
              onChange={(e) => turnToPage(parseInt(e.target.value, 10))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-white/20 rounded-full"
            />
          </div>

          <div className="hidden lg:inline text-[11px] text-zinc-400 font-mono font-semibold shrink-0">
            {progressPercent}%
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={nextPage}
          disabled={currentPage >= effectiveTotalPages}
          className="flex items-center gap-1 px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold bg-sky-600 hover:bg-sky-500 text-white disabled:opacity-25 transition-all cursor-pointer shadow-sm"
        >
          <span className="hidden sm:inline">หน้าถัดไป</span>
          <ChevronRight size={16} />
        </button>
      </footer>

      {/* Floating Zen Pill (when menu is hidden) */}
      {!showControls && (
        <div className="fixed bottom-3 right-3 z-50 flex items-center gap-1 animate-in fade-in duration-200">
          <div className="bg-black/80 text-white backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono font-bold shadow-md border border-white/20">
            {currentPage}/{effectiveTotalPages}
          </div>
          <button
            onClick={() => setShowControls(true)}
            className="flex items-center gap-1 px-3 py-1 bg-black/80 hover:bg-black text-white hover:text-sky-300 backdrop-blur-md rounded-full text-xs font-bold shadow-md border border-white/20 transition-all cursor-pointer"
          >
            <Eye size={13} className="text-sky-400" />
            <span>แสดงเมนู</span>
          </button>
        </div>
      )}

      {/* =========================================================================
          TABLE OF CONTENTS & JUMP DRAWER
         ========================================================================= */}
      {isTOCDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            onClick={() => setIsTOCDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
          />

          <div className="relative w-80 sm:w-96 max-w-[85vw] h-full shadow-2xl flex flex-col z-10 bg-zinc-900 border-r border-zinc-800 text-white animate-in slide-in-from-left duration-200">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <List size={18} className="text-sky-400" />
                <h3 className="font-bold text-sm">สารบัญและหน้าที่คั่นไว้</h3>
              </div>
              <button 
                onClick={() => setIsTOCDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tab switch between All Pages & Bookmarks */}
            <div className="flex border-b border-zinc-800 px-4 pt-2 gap-2 text-xs">
              <button
                onClick={() => setTocDrawerTab('pages')}
                className={`pb-2 px-2 font-bold transition-all border-b-2 cursor-pointer ${
                  tocDrawerTab === 'pages'
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                ทุกหน้า ({effectiveTotalPages})
              </button>
              <button
                onClick={() => setTocDrawerTab('bookmarks')}
                className={`pb-2 px-2 font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  tocDrawerTab === 'bookmarks'
                    ? 'border-sky-500 text-sky-400'
                    : 'border-transparent text-zinc-400 hover:text-white'
                }`}
              >
                <Bookmark size={13} className={bookmarks.length > 0 ? 'fill-sky-400 text-sky-400' : ''} />
                <span>หน้าที่คั่นไว้ ({bookmarks.length})</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              {tocDrawerTab === 'pages' ? (
                Array.from({ length: effectiveTotalPages }, (_, i) => i + 1).map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      turnToPage(pNum);
                      setIsTOCDrawerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      pNum === currentPage 
                        ? 'bg-sky-600 text-white font-bold' 
                        : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>หน้า {pNum}</span>
                      {bookmarks.includes(pNum) && <Bookmark size={12} className="fill-sky-400 text-sky-400" />}
                    </span>
                    {pNum === currentPage && <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded">กำลังอ่าน</span>}
                  </button>
                ))
              ) : bookmarks.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-xs">
                  <Bookmark size={32} className="mx-auto mb-2 opacity-30 text-sky-400" />
                  ยังไม่มีหน้าที่คั่นไว้<br />
                  <span className="text-[11px] text-zinc-400 mt-1 block">กดปุ่ม &quot;คั่นหน้า&quot; ที่แถบด้านบนเพื่อบันทึกหน้าที่ชื่นชอบ</span>
                </div>
              ) : (
                bookmarks.map((pNum) => (
                  <button
                    key={pNum}
                    onClick={() => {
                      turnToPage(pNum);
                      setIsTOCDrawerOpen(false);
                    }}
                    className={`w-full p-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                      pNum === currentPage 
                        ? 'bg-sky-600 text-white font-bold' 
                        : 'hover:bg-zinc-800 text-zinc-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Bookmark size={13} className="fill-sky-400 text-sky-400" />
                      <span>หน้าที่คั่น: หน้า {pNum}</span>
                    </span>
                    <span className="text-[10px] text-zinc-400">เปิดอ่าน &rarr;</span>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          QUEST SYSTEM & EASTER EGG MANAGER (Embedded in reader)
         ========================================================================= */}
      <BookQuestManager
        bookId={book.id}
        currentPage={currentPage}
        onJumpToPage={(p) => turnToPage(p)}
        isQuestDrawerOpen={isQuestDrawerOpen}
        onToggleQuestDrawer={setIsQuestDrawerOpen}
      />

      {/* =========================================================================
          GAMIFIED REWARD CELEBRATION (Lazada / Shopee Coin Streak Style)
         ========================================================================= */}
      <LazadaRewardPopup
        isOpen={isRewardPopupOpen}
        onClose={() => setIsRewardPopupOpen(false)}
        data={rewardData}
      />

      {/* DAILY READING EXIT SUMMARY MODAL (Lazada Coin Style) */}
      <DailyReadingSummaryModal
        isOpen={showExitSummaryModal}
        readingSeconds={totalSessionSeconds}
        pagesRead={pagesReadSession}
        bookTitle={book.title}
        onClaimAndExit={handleClaimReadingRewardAndExit}
        onContinueReading={() => setShowExitSummaryModal(false)}
      />

    </div>
  );
}

export default function PremiumBookReader({ book, initialPage = 1 }: PremiumBookReaderProps) {
  // Check if this book is a PubHTML5 or Google Drive embed book without a dedicated local PDF
  const isEmbedBook = Boolean(
    book.id?.startsWith('pubhtml5_') ||
    book.reader_url?.includes('pubhtml5.com') ||
    book.source_url?.includes('pubhtml5.com') ||
    book.reader_url?.includes('drive.google.com') ||
    book.source_url?.includes('drive.google.com') ||
    book.pdf_url?.includes('drive.google.com') ||
    (book as any).category_id === 'cat_world_civ' ||
    ((book as any).category_ids && (book as any).category_ids.includes('cat_world_civ')) ||
    (book as any).drive_file_id
  );

  const resolvedPdf = resolveBookPdfUrl(book);
  const isActualTamJai = (book.id || '').toLowerCase().includes('tam_jai') || (book.title || '').includes('ทำใจให้พร้อมบวก');
  const hasLocal = (resolvedPdf && resolvedPdf !== '/books/pdf/tam-jai-hai-prom-buak.pdf') || isActualTamJai;

  if (isEmbedBook && !hasLocal) {
    return <PubHtml5Reader book={book} hasLocalPdf={false} />;
  }

  return <PremiumFlipbookCore book={book} initialPage={initialPage} />;
}

// ---------------------------------------------------------------------------
// Lazy-Loaded Continuous Scroll Page Item using IntersectionObserver
// Optimized for mobile: Reclaims canvas memory when out of view & uses stable observer
// ---------------------------------------------------------------------------
const PdfLazyScrollItem = React.memo(function PdfLazyScrollItem({
  pdfDoc,
  pageNum,
  zoomScale,
  onInView,
}: {
  pdfDoc: any;
  pageNum: number;
  zoomScale: number;
  onInView?: (pageNum: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasRendered, setHasRendered] = useState(false);
  const onInViewRef = useRef(onInView);
  onInViewRef.current = onInView;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            onInViewRef.current?.(pageNum);
          } else {
            setIsVisible(false);
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [pageNum]);

  useEffect(() => {
    if (!isVisible) {
      // Reclaim memory when scrolled out of view on mobile devices
      if (canvasRef.current) {
        canvasRef.current.width = 1;
        canvasRef.current.height = 1;
      }
      setHasRendered(false);
      return;
    }

    if (!pdfDoc || !canvasRef.current) return;

    const screenW = typeof window !== 'undefined' ? window.innerWidth : 780;
    const dynamicTargetW = Math.min(Math.floor(750 * zoomScale), Math.floor((screenW - 24) * zoomScale));

    renderPdfPageToCanvas(pdfDoc, pageNum, canvasRef.current, {
      targetWidth: dynamicTargetW,
    })
      .then(() => setHasRendered(true))
      .catch(() => {});
  }, [isVisible, pdfDoc, pageNum, zoomScale]);

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-[780px] min-h-[420px] sm:min-h-[500px] bg-white rounded-2xl shadow-xl border border-zinc-200/90 p-2 sm:p-5 flex flex-col items-center"
    >
      <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 text-xs font-mono font-bold text-zinc-500">
        <span>หน้า {pageNum} / {pdfDoc?.numPages || ''}</span>
        <span className="text-[10px] bg-zinc-100 px-2 py-0.5 rounded text-zinc-600">เอกสารต้นฉบับจริง</span>
      </div>

      <div className="w-full flex justify-center items-center flex-1 relative min-h-[360px]">
        <canvas ref={canvasRef} className="max-w-full object-contain rounded-lg shadow-sm" />
        {!hasRendered && isVisible && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-sky-600" />
          </div>
        )}
      </div>
    </div>
  );
});
