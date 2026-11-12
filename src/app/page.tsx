'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  BookOpen, 
  Video, 
  ArrowRight, 
  Play, 
  Headphones, 
  Eye, 
  Heart, 
  Star, 
  Award, 
  Bot, 
  Sparkles, 
  Search, 
  HeartPulse, 
  Brain, 
  Briefcase, 
  Globe,
  Compass,
  Radio,
  Flame
} from 'lucide-react';
import { books as libBooks, videos, articles } from '@/lib/mock-data';
import { books as dbBooks } from '@/data/mockData';
import persistentBooks from '@/data/persistentBooks.json';
import HomeMediaShowcase from '@/components/home/HomeMediaShowcase';
import TopBannerCarousel from '@/components/common/TopBannerCarousel';
import ScrollableBookRow from '@/components/books/ScrollableBookRow';
import WebtoonRankingShelf from '@/components/books/WebtoonRankingShelf';
import BookPreviewModal from '@/components/books/BookPreviewModal';
import HomeQuestWidget from '@/components/gamification/HomeQuestWidget';
import CategorySection from '@/components/categories/CategorySection';
import { Book } from '@/types';

export default function Home() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveReadStats, setLiveReadStats] = useState<Record<string, number>>({});

  useEffect(() => {
    fetch('/api/books/reads')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setLiveReadStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  const handleOpenBookModal = (book: any) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseBookModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  // 1. Normalize custom persistent books imported by user
  const customBooks: Book[] = (persistentBooks as any[]).map((b: any) => ({
    ...b,
    cover: b.cover_image || b.cover || '/images/books/book-placeholder.jpg',
    pages: b.page_count || b.pages || 1,
    author: b.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    category_id: b.category_id || b.category_ids?.[0] || 'c2',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    view_count: liveReadStats[b.id] ?? b.view_count ?? 0,
    read_count: liveReadStats[b.id] ?? b.read_count ?? 0,
  }));

  // 2. Normalize dbBooks
  const normalizedDbBooks: Book[] = dbBooks.map((b: any) => {
    let secureCover = b.cover_image || '';
    if (b.id?.startsWith('pubhtml5_')) {
      secureCover = `/images/books/pubhtml5/${b.id}.jpg`;
    } else if (secureCover.startsWith('http://online.pubhtml5.com')) {
      secureCover = secureCover.replace('http://', 'https://');
    }
    return {
      ...b,
      cover: secureCover,
      cover_image: secureCover,
      pages: b.page_count,
      author: 'พระครูปลัดสุวัฒนโพธิคุณ',
      pdf_url: b.pdf_url || b.reader_url,
      category_id: b.category_ids?.[0] || 'cat_world_civ',
      tags: b.tags && b.tags.length > 0 ? b.tags : ['อารยธรรมโลก', 'ประวัติศาสตร์'],
      status: 'published' as const,
      is_copyright: b.is_copyright ?? true,
      copyright_notice: b.copyright_notice || 'หนังสือลิขสิทธิ์',
      view_count: liveReadStats[b.id] ?? b.view_count ?? 0,
      read_count: liveReadStats[b.id] ?? b.read_count ?? 0,
      like_count: b.like_count || 0,
    };
  });

  const normalizedLibBooks: Book[] = (libBooks as Book[]).map(b => ({
    ...b,
    view_count: liveReadStats[b.id] ?? b.view_count ?? 0,
    read_count: liveReadStats[b.id] ?? b.read_count ?? 0,
  }));

  const thaiToArabic = (str: string) => {
    return (str || '').replace(/[๑๒๓๔๕๖๗๘๙๐]/g, (d) => '1234567890'['๑๒๓๔๕๖๗๘๙๐'.indexOf(d)]);
  };

  const normalizeTitleKey = (text: string) => {
    if (!text) return '';
    let s = thaiToArabic(text).toLowerCase();

    // Specific known titles with slight formatting variations
    if (s.includes('สมดุล') && (s.includes('ดี') || s.includes('平衡'))) return 'canon_samdun_dee';
    if (s.includes('อย่ามโน')) return 'canon_ya_mano';
    if (s.includes('เส้นทางพระบรม')) return 'canon_sentang_phraborom';
    if (s.includes('อายุวัฒนมงคล') && s.includes('63')) return 'canon_ayu_63';
    if (s.includes('มงคลชีวิต') && s.includes('ทางก้าวหน้า')) return 'canon_mongkol_124';
    if (s.includes('ลมหายใจเข้าออก') && s.includes('พระพุทธศาสนา')) return 'canon_lom_hai_jai';
    if (s.includes('พระไตรปิฎก') && s.includes('ธรรมชัย')) return 'canon_tipitaka_dhammachai';
    if (s.includes('ทำใจให้พร้อมบวก')) return 'canon_tam_jai_hai_prom_buak';
    if (s.includes('เขาก็สุข') && s.includes('เราก็สุข')) return 'canon_khao_suk_rao_suk';
    if ((s.includes('รักแท้') && s.includes('นิยาย')) || (s.includes('รักเเท้') && s.includes('นิยาย'))) return 'canon_rak_thae_mai_dai_mee_khae_nai_niyai';
    if (s.includes('เปิดพรมแดน') || s.includes('เปิดพรมเเดน')) return 'canon_perd_promdan';
    if (s.includes('ข้อคิดรอบตัว')) return 'canon_kho_khit_rob_tua';
    if (s.includes('ศาสตร์') && s.includes('สมาธิ')) return 'canon_science_of_meditation';
    if (s.includes('มังกรสอนใจ')) return 'canon_mangkon_son_jai';
    if (s.includes('ขัดเกลาความคิด')) return 'canon_khad_glao_khwam_kid';
    if (s.includes('ไขปัญหาความเชื่อ')) return 'canon_khai_panha_khwam_cheua';
    if (s.includes('ดีชั่ว') && s.includes('กรรมหรือบังเอิญ')) return 'canon_dee_chua';

    // For "ทันโลกทันธรรม" volumes
    const matchTL = s.match(/ทันโลก\s*ทันธรรม\s*(?:เล่ม)?\s*([1-5])/);
    if (matchTL) return `canon_than_lok_than_dhamma_${matchTL[1]}`;

    return s
      .replace(/\.pdf$/i, '')
      .replace(/[\u0E48-\u0E4C]+/g, (m) => m[0])
      .replace(/[^\u0E00-\u0E7Fa-z0-9]/g, '')
      .replace(/^1[0-9]{2,3}/, '')
      .replace(/^(ฉบับ|ตอน|เล่ม)/, '')
      .trim();
  };

  const IGNORED_BOOK_IDS = new Set([
    'book_001', 'book_002', 'book_003', 'book_004', 'book_005', 'book_006',
    'pubhtml5_99201494', 'pubhtml5_85353008'
  ]);

  const poolMap = new Map<string, Book>();
  const seenTitles = new Map<string, Book>();

  const addPoolBook = (b: Book) => {
    if (!b || !b.id || IGNORED_BOOK_IDS.has(b.id)) return;
    const norm = normalizeTitleKey(b.title);
    if (norm && seenTitles.has(norm)) {
      const existing = seenTitles.get(norm)!;
      if ((!existing.cover || existing.cover.includes('book-placeholder.jpg')) && b.cover && !b.cover.includes('book-placeholder.jpg')) {
        existing.cover = b.cover;
        existing.cover_image = b.cover;
      }
      if (!existing.pdf_url && b.pdf_url) existing.pdf_url = b.pdf_url;
      if (b.pdf_url?.startsWith('/books/pdf/') && !existing.pdf_url?.startsWith('/books/pdf/')) existing.pdf_url = b.pdf_url;
      if (!existing.reader_url && b.reader_url) existing.reader_url = b.reader_url;
      if (!existing.source_url && b.source_url) existing.source_url = b.source_url;
      if (!(existing as any).drive_file_id && (b as any).drive_file_id) {
        (existing as any).drive_file_id = (b as any).drive_file_id;
      }
      poolMap.set(b.id, existing);
      return;
    }
    poolMap.set(b.id, b);
    if (norm) seenTitles.set(norm, b);
  };

  // Custom uploaded books come FIRST, followed by library books and database books
  [...customBooks, ...normalizedLibBooks, ...normalizedDbBooks].forEach(addPoolBook);
  const allBooksPool: Book[] = Array.from(new Set(poolMap.values()));

  // 0. Shelf: หนังสือลิขสิทธิ์มาใหม่ล่าสุด (Newly added PDF Books with extracted covers)
  const newCopyrightReleases: Book[] = Array.from(new Set([
    ...customBooks,
    poolMap.get('book_tam_jai_hai_prom_buak'),
    poolMap.get('book_khao_kor_sook_rao_kor_sook'),
    poolMap.get('book_lom_hai_jai_khao_ok'),
  ].filter(Boolean) as Book[]));

  // 1. ปรัชญา จิตวิทยา & ฝึกสมาธิ (นำเล่มลิขสิทธิ์ที่สกัดปกขึ้นแถวหน้า)
  const psychologyMindBookIds = [
    'book_tam_jai_hai_prom_buak',
    'book_khao_kor_sook_rao_kor_sook',
    'book_อย่ามโน',
    'book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
    'book_ความสุข-360-องศา',
    'book_perfectionist-สไตล์พุทธะ',
    'book_lom_hai_jai_khao_ok',
    'book_phoo_soon_sia_tee_mai_sin_soon',
    'book_love_myself_rak_nai_tua_ton',
    'book_phro_mai_roo_roo_than_cheewit',
    'book_perd_promdan_dhamma',
  ];
  const psychologyMindBooks = psychologyMindBookIds
    .map(id => poolMap.get(id))
    .filter(Boolean) as Book[];

  // 2. ครอบครัว ความรัก & สุขภาพกายใจ (นำเล่มลิขสิทธิ์ขึ้นแสดงแถวหน้า)
  const familyHealthBookIds = [
    'book_ความลับของความรัก',
    'book_ความรักรสอูมามิ',
    'book_khao_kor_sook_rao_kor_sook',
    'book_secret_of_love_rak_look_yang_rai',
    'book_the_lover_rak_pen_ja_hen_jai',
    'book_rak_thae_mai_dai_mee_khae_nai_niyai',
    'book_yoo_nai_lok_mai_yang_mai_pen_rok',
    'b5',
    'b6'
  ];
  const familyHealthBooks = familyHealthBookIds
    .map(id => poolMap.get(id))
    .filter(Boolean) as Book[];

  // 3. การทำงาน ความสำเร็จ & การใช้ชีวิตยุคดิจิทัล (นำเล่มลิขสิทธิ์ขึ้นแสดงแถวหน้า)
  const workSuccessBookIds = [
    'book_สมดุลเท่ากับดี',
    'book_ตามหลวงพี่ไปโกอินเตอร์',
    'book_เส้นทางพระบรมฯ',
    'book_perfectionist-สไตล์พุทธะ',
    'book_mongkol_chiwit_124',
    'book_yoo_sook_nai_yook_digital',
    'book_hope_for_life_vol_04',
    'book_kho_khit_rop_tua',
    'b_zjdd',
    'b3'
  ];
  const workSuccessBooks = workSuccessBookIds
    .map(id => poolMap.get(id))
    .filter(Boolean) as Book[];

  // 4. ห้องเรียน อารยธรรมโลก (Deep Blue / Navy)
  const worldCivBooks = allBooksPool.filter((b: any) => 
    b.category_ids?.includes('cat_world_civ') ||
    b.id.startsWith('pubhtml5_') ||
    b.title.includes('อารยธรรม')
  ).slice(0, 10);

  // 5. ไฮไลต์ชุดหนังสือดิจิทัล (Curated BKK Book Featured Highlight Pool)
  const featuredHighlightIds = [
    'book_tam_jai_hai_prom_buak',
    'book_อย่ามโน',
    'book_สมดุลเท่ากับดี',
    'book_ความสุข-360-องศา',
    'book_ตามหลวงพี่ไปโกอินเตอร์',
    'book_ความลับของความรัก',
    'book_perfectionist-สไตล์พุทธะ',
    'book_ความรักรสอูมามิ',
    'book_khao_kor_sook_rao_kor_sook',
    'book_กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
    'book_phoo_soon_sia_tee_mai_sin_soon',
    'book_เส้นทางพระบรมฯ',
    'book_lom_hai_jai_khao_ok',
    'book_mongkol_chiwit_124',
  ];
  const featuredHighlightBooks = featuredHighlightIds
    .map(id => poolMap.get(id))
    .filter(Boolean) as Book[];

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      
      {/* 1. ไฮไลต์ชุดหนังสือดิจิทัล */}
      <TopBannerCarousel autoPlayIntervalMs={8000} />

      {/* 2. Main Content Container */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full space-y-5 sm:space-y-7 pt-3 sm:pt-4 pb-24 lg:pb-16">
        
        {/* 1. Webtoon Ranking Shelf (Weekly TOP 5) - Showcase books first */}
        <div id="ranking" className="pt-1">
          <WebtoonRankingShelf
            books={allBooksPool}
            onSelectBook={handleOpenBookModal}
          />
        </div>

        {/* 2. ศูนย์รวมเควสธรรมะ & กระเป๋าแต้มสะสม (Sleek Compact Bar) */}
        <HomeQuestWidget />

        {/* Shelf 0: หนังสือลิขสิทธิ์มาใหม่ล่าสุด (Rose/Red Pastel Tint) */}
        {newCopyrightReleases.length > 0 && (
          <section id="copyright-releases" className="pt-1">
            <ScrollableBookRow 
              title="หนังสือลิขสิทธิ์มาใหม่ล่าสุด"
              subtitle="หนังสือธรรมะคำสอนฉบับเต็ม พร้อมหน้าปกจริงและได้รับการคุ้มครองลิขสิทธิ์ถูกต้อง"
              viewAllHref="/pdf-books"
              books={newCopyrightReleases}
              categoryTheme="rose"
              icon={<Sparkles size={18} className="text-rose-700" />}
              onQuickView={handleOpenBookModal}
            />
          </section>
        )}

        {/* Shelf 1: ปรัชญา จิตวิทยา & ฝึกสมาธิ (Mint Green Pastel Tint) */}
        <section id="mind-psychology" className="pt-1">
          <ScrollableBookRow 
            title="ปรัชญา จิตวิทยา & ฝึกสมาธิ"
            subtitle="วิธีคิดบวก วางใจให้ผ่องใส และการพัฒนาจิตใจสู่ความสงบแท้จริง"
            viewAllHref="/books?category=cat_003"
            books={psychologyMindBooks.length > 0 ? psychologyMindBooks : allBooksPool.slice(3, 9)}
            categoryTheme="mint"
            icon={<Brain size={18} className="text-emerald-800" />}
            onQuickView={handleOpenBookModal}
          />
        </section>

        {/* Shelf 2: ครอบครัว ความรัก & สุขภาพกายใจ (Cream / Peach Pastel Tint) */}
        <section id="family-health" className="pt-1">
          <ScrollableBookRow 
            title="ความรัก ครอบครัว & สุขภาพกายใจ"
            subtitle="ธรรมะสร้างความเข้าใจ เติมเต็มความสุขในครอบครัว และการดูแลสุขภาพในโลกยุคใหม่"
            viewAllHref="/books?category=cat_001"
            books={familyHealthBooks.length > 0 ? familyHealthBooks : allBooksPool.slice(0, 6)}
            categoryTheme="peach"
            icon={<HeartPulse size={18} className="text-amber-800" />}
            onQuickView={handleOpenBookModal}
          />
        </section>

        {/* Shelf 3: การทำงาน ความสำเร็จ & การใช้ชีวิตยุคดิจิทัล (Sky Blue Pastel Tint) */}
        <section id="work-success" className="pt-1">
          <ScrollableBookRow 
            title="การทำงาน ความสำเร็จ & การใช้ชีวิตยุคดิจิทัล"
            subtitle="หลักอิทธิบาท 4 ภูมิปัญญา 38 มงคลชีวิต และศิลปะการทำงานร่วมกับผู้อื่นอย่างมีความสุข"
            viewAllHref="/books?category=cat_002"
            books={workSuccessBooks.length > 0 ? workSuccessBooks : allBooksPool.slice(5, 11)}
            categoryTheme="sky"
            icon={<Briefcase size={18} className="text-sky-800" />}
            onQuickView={handleOpenBookModal}
          />
        </section>

        {/* Shelf 4: ห้องเรียน อารยธรรมโลก & ประวัติศาสตร์ (Indigo / Slate Pastel Tint) */}
        {worldCivBooks.length > 0 && (
          <section id="world-civ" className="pt-1">
            <ScrollableBookRow 
              title="ห้องเรียน อารยธรรมโลก & ประวัติศาสตร์"
              subtitle="ชุดบทเรียนประวัติศาสตร์และอารยธรรมโบราณเพื่อความเข้าใจในวิถีมนุษยชาติ"
              viewAllHref="/books?category=cat_world_civ"
              books={worldCivBooks}
              categoryTheme="slate"
              icon={<Globe size={18} className="text-indigo-800" />}
              onQuickView={handleOpenBookModal}
            />
          </section>
        )}

        {/* Section 5: Multimedia Showcase (Podcasts & Videos with 16:9 & 9:16 Filters) */}
        <div id="multimedia" className="pt-2">
          <HomeMediaShowcase />
        </div>

        {/* Section 6: หมวดหมู่ธรรมะ & สื่อการเรียนรู้ (Category Hub) */}
        <section id="categories" className="pt-2">
          <CategorySection />
        </section>

      </div>

      {/* 4. Interactive Webtoon Series Preview Modal */}
      <BookPreviewModal
        book={selectedBook}
        isOpen={isModalOpen}
        onClose={handleCloseBookModal}
      />

    </div>
  );
}
