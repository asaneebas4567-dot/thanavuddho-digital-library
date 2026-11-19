'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ChevronLeft, 
  ChevronRight, 
  Store, 
  ExternalLink,
  ShieldCheck,
  Tag
} from 'lucide-react';
import { Book } from '@/types';

// Preset commercial store books (easily add more books in the future)
export const COMMERCIAL_STORE_BOOKS: Book[] = [
  {
    id: 'book_dee_chua_meb',
    title: '"ดีชั่ว" เกิดด้วยกรรมหรือบังเอิญ',
    author_id: 'author_001',
    author: 'พระมหาสมชาย ฐานวุฑฺโฒ (ฐานวุฑโฒ ภิกขุ)',
    description: 'ไขข้อข้องใจเกี่ยวกับความเป็นไปในชีวิตมนุษย์ ว่าสิ่งต่าง ๆ ที่เกิดขึ้น ไม่ว่าจะเป็นความสุข ความทุกข์ ความดี หรือความชั่ว แท้จริงแล้วเป็นเรื่องของความบังเอิญ โชคชะตา หรือถูกกำหนดด้วยกฎแห่งกรรม พร้อมชี้แนะเหตุและผลเบื้องหลังการกระทำ วิบากกรรมที่ส่งผลข้ามภพข้ามชาติ และวิธีสร้างบุญอธิษฐานจิตอย่างถูกต้อง',
    cover_image: '/images/books/dee-chua.jpg',
    cover: '/images/books/dee-chua.jpg',
    category_ids: ['cat_dharma', 'cat_lifestyle'],
    category_id: 'cat_dharma',
    tags: ['ดีชั่ว', 'กฎแห่งกรรม', 'เกิดด้วยกรรมหรือบังเอิญ', 'ความดีความชั่ว', 'สร้างบุญ', 'E-Book', 'MEB Market'],
    publication_year: 2562,
    page_count: 180,
    pages: 180,
    language: 'th',
    publisher: 'insidebooks',
    buy_url: 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=115432',
    store_name: 'MEB Market',
    price: '99 บาท',
    is_external_store: true,
    is_copyright: true,
    copyright_notice: 'หนังสือฉบับลิขสิทธิ์วางจำหน่าย (E-Book)',
    status: 'published'
  },
  {
    id: 'book_tua_rao_mai_thammada_meb',
    title: 'ตัวเราไม่ธรรมดา',
    author_id: 'author_001',
    author: 'พระมหาสมชาย ฐานวุฑฺโฒ M.D., Ph.D.',
    description: 'พลิกมุมมองความคิดเพื่อดึงศักยภาพที่ซ่อนอยู่ภายในตัวเราออกมาพัฒนาให้เกิดความสำเร็จ ผ่าน 8 ไอเดียเรียกความสำเร็จ: จุดเริ่มต้นชีวิต, การอ่านเติมพลังปัญญา, จินตนาการสร้างสรรค์, การลงมือทำอย่างมีเป้าหมาย, การเปลี่ยนอุปสรรคเป็นโอกาส, การพัฒนาความเป็นเลิศ, การบริหารจิตใจ และวิชาชีวิตสู่ความสำเร็จ โดย พระมหาสมชาย ฐานวุฑโฒ (insidebooks)',
    cover_image: '/images/books/tua-rao-mai-thammada.jpg',
    cover: '/images/books/tua-rao-mai-thammada.jpg',
    category_ids: ['cat_self_dev', 'cat_lifestyle', 'cat_002'],
    category_id: 'cat_self_dev',
    tags: ['ตัวเราไม่ธรรมดา', '8 ไอเดีย', 'เรียกความสำเร็จ', 'พัฒนาตนเอง', 'กำลังใจ', 'E-Book', 'MEB Market'],
    publication_year: 2558,
    page_count: 174,
    pages: 174,
    language: 'th',
    publisher: 'insidebooks',
    buy_url: 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=22289',
    store_name: 'MEB Market',
    price: '99 บาท',
    is_external_store: true,
    is_copyright: true,
    copyright_notice: 'หนังสือฉบับลิขสิทธิ์วางจำหน่าย (E-Book)',
    status: 'published'
  },
  {
    id: 'book_khad_klao_khwam_kid_meb',
    title: 'ขัดเกลาความคิด',
    author_id: 'author_001',
    author: 'พระมหาสมชาย ฐานวุฑฺโฒ M.D., Ph.D.',
    description: 'ถอดรหัสวิธีคิดของมนุษย์ เนรมิตชีวิตดี ๆ ทั้งในชาตินี้และชาติหน้า (คู่มือนักสร้างบารมี Dhamma for Positive Thinking เล่ม 2) รวบรวมหลักคิดในการปรับทัศนคติ การบริหารสมองและความคิดทั้งทางโลกและทางธรรม เพื่อขัดเกลาจิตใจให้ผ่องใสและเปลี่ยนมุมมองสู่ความสำเร็จที่แท้จริง โดย พระมหาสมชาย ฐานวุฑโฒ',
    cover_image: '/images/books/khad-klao-khwam-kid-meb.jpg',
    cover: '/images/books/khad-klao-khwam-kid-meb.jpg',
    category_ids: ['cat_self_dev', 'cat_lifestyle', 'cat_002'],
    category_id: 'cat_self_dev',
    tags: ['ขัดเกลาความคิด', 'วิธีคิดของมนุษย์', 'เนรมิตชีวิตดีๆ', 'พัฒนาตนเอง', 'ความคิดและจิตใจ', 'E-Book', 'MEB Market'],
    publication_year: 2561,
    page_count: 144,
    pages: 144,
    language: 'th',
    publisher: 'insidebooks',
    buy_url: 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=79825',
    store_name: 'MEB Market',
    price: '99 บาท',
    is_external_store: true,
    is_copyright: true,
    copyright_notice: 'หนังสือฉบับลิขสิทธิ์วางจำหน่าย (E-Book)',
    status: 'published'
  },
  {
    id: 'book_24_chom_tee_chan_hai_jai_meb',
    title: '24 ชม. ที่ฉันหายใจ',
    author_id: 'author_001',
    author: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    description: 'พุทธวิธีไขความลับการบริหารเวลา "สร้างความสุขทางธรรม...นำความสำเร็จทางโลกมาสู่คุณ" เรียนรู้ศาสตร์แห่งการจัดสรรเวลาอย่างมีคุณค่า เพิ่มประสิทธิภาพในการทำงานและการใช้ชีวิตในทุก 24 ชั่วโมงที่เรายังคงหายใจ โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: '/images/books/24-chom-tee-chan-hai-jai.jpg',
    cover: '/images/books/24-chom-tee-chan-hai-jai.jpg',
    category_ids: ['cat_self_dev', 'cat_lifestyle', 'cat_002'],
    category_id: 'cat_self_dev',
    tags: ['24 ชม. ที่ฉันหายใจ', 'การบริหารเวลา', 'สร้างความสุข', 'ความสำเร็จ', 'พัฒนาตนเอง', 'E-Book', 'MEB Market'],
    publication_year: 2560,
    page_count: 160,
    pages: 160,
    language: 'th',
    publisher: 'insidebooks',
    buy_url: 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=72700',
    store_name: 'MEB Market',
    price: '99 บาท',
    is_external_store: true,
    is_copyright: true,
    copyright_notice: 'หนังสือฉบับลิขสิทธิ์วางจำหน่าย (E-Book)',
    status: 'published'
  },
  {
    id: 'book_phro_mai_roo_si_na_meb',
    title: 'เพราะไม่รู้สินะ',
    author_id: 'author_001',
    author: 'พระมหาสมชาย ฐานวุฑฺโฒ M.D., Ph.D.',
    description: 'เผยแง่คิดและมุมมองรู้ทันชีวิต "ถ้ารู้ ป่านนี้คงจะสุขไปนานละ" ชี้ทางสว่างให้ใจคลายทุกข์ ด้วยการทำความเข้าใจความจริงของชีวิต กฎแห่งกรรม และวิธีปลดล็อกความคิด เพื่อก้าวข้ามความไม่รู้สู่ความสุขสงบที่แท้จริง โดย พระมหาสมชาย ฐานวุฑโฒ (insidebooks)',
    cover_image: '/images/books/phro-mai-roo-si-na.jpg',
    cover: '/images/books/phro-mai-roo-si-na.jpg',
    category_ids: ['cat_self_dev', 'cat_lifestyle', 'cat_002'],
    category_id: 'cat_self_dev',
    tags: ['เพราะไม่รู้สินะ', 'รู้ทันชีวิต', 'ถ้ารู้ป่านนี้คงจะสุขไปนานละ', 'พัฒนาตนเอง', 'คลายทุกข์', 'E-Book', 'MEB Market'],
    publication_year: 2557,
    page_count: 160,
    pages: 160,
    language: 'th',
    publisher: 'insidebooks',
    buy_url: 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=14727',
    store_name: 'MEB Market',
    price: '99 บาท',
    is_external_store: true,
    is_copyright: true,
    copyright_notice: 'หนังสือฉบับลิขสิทธิ์วางจำหน่าย (E-Book)',
    status: 'published'
  },
  {
    id: 'book_mang_korn_sorn_jai_meb',
    title: 'มังกรสอนใจ',
    author_id: 'author_001',
    author: 'พระมหาสมชาย ฐานวุฑฺโฒ M.D., Ph.D.',
    description: 'ผลึกเพชรแห่งภูมิปัญญาจีน ซึ่งรักษาความยิ่งใหญ่มากว่า ๔,๐๐๐ ปี รวบรวมนิทานพื้นบ้านและสุภาษิตจีนชื่อดัง สอดแทรกคติธรรมและข้อคิดเตือนใจในการดำเนินชีวิต ความรู้และคุณธรรมแฝงอยู่ในทุกตัวอักษร เพียงรู้จักรับแง่คิดและพลิกมุมมอง โดย พระมหาสมชาย ฐานวุฑโฒ',
    cover_image: '/images/books/mang-korn-sorn-jai-meb.jpg',
    cover: '/images/books/mang-korn-sorn-jai-meb.jpg',
    category_ids: ['cat_world_civ', 'cat_lifestyle', 'cat_dharma'],
    category_id: 'cat_world_civ',
    tags: ['มังกรสอนใจ', 'ภูมิปัญญาจีน', 'นิทานสุภาษิตจีน', 'อารยธรรม', 'ข้อคิดเตือนใจ', 'E-Book', 'MEB Market'],
    publication_year: 2556,
    page_count: 180,
    pages: 180,
    language: 'th',
    publisher: 'insidebooks',
    buy_url: 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=10175',
    store_name: 'MEB Market',
    price: '99 บาท',
    is_external_store: true,
    is_copyright: true,
    copyright_notice: 'หนังสือฉบับลิขสิทธิ์วางจำหน่าย (E-Book)',
    status: 'published'
  }
];

interface SpecialStoreBooksSectionProps {
  customBooks?: Book[];
}

export default function SpecialStoreBooksSection({ customBooks = [] }: SpecialStoreBooksSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Merge preset books with any external store books found in persistentBooks or props
  const allCommercialBooks = React.useMemo(() => {
    const map = new Map<string, Book>();
    COMMERCIAL_STORE_BOOKS.forEach(b => map.set(b.id, b));
    customBooks
      .filter(b => b.is_external_store || (b as any).buy_url)
      .forEach(b => map.set(b.id, { ...map.get(b.id), ...b }));
    return Array.from(map.values());
  }, [customBooks]);

  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
      return () => {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      };
    }
  }, [allCommercialBooks]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const { clientWidth } = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  if (!allCommercialBooks || allCommercialBooks.length === 0) return null;

  return (
    <section 
      id="special-commercial-books" 
      aria-label="หนังสือหมวดพิเศษฉบับวางจำหน่าย"
      className="py-3 sm:py-4 relative group/row"
    >
      {/* Container matching standard shelf styling with subtle soft tint */}
      <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-2xs">
        
        {/* Shelf Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-3.5 pb-2.5 border-b border-slate-200/80">
          
          {/* Left: Title & Subtitle */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-7 h-7 rounded-lg bg-sky-100 text-[#073B65] border border-sky-200/80 flex items-center justify-center shrink-0">
                <Store size={15} />
              </span>
              <h2 className="text-base sm:text-lg font-bold text-[#073B65] tracking-tight flex items-center gap-2 truncate">
                <span>หนังสือฉบับวางจำหน่าย & ช่องทางสั่งซื้อ</span>
                <span className="text-[11px] font-medium text-slate-400">
                  ({allCommercialBooks.length} เล่ม)
                </span>
              </h2>
            </div>
            
            <p className="text-xs text-slate-500 line-clamp-1 ml-9">
              รวมผลงานหนังสือของพระอาจารย์ที่วางจำหน่ายภายนอก (MEB Market & Google Play) สำหรับสั่งซื้อเก็บสะสม
            </p>
          </div>

          {/* Right: Quick Store Links */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <a
              href="https://www.mebmarket.com/index.php?action=SearchBook&type=author&search=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%A2%20%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B8%E0%B8%91%E0%B9%82%E0%B8%92"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#073B65] shadow-2xs transition-colors"
              title="ค้นหาหนังสือทั้งหมดบน MEB Market"
            >
              <span>ร้าน MEB Market</span>
              <ExternalLink size={11} className="text-slate-400" />
            </a>

            <a
              href="https://play.google.com/store/search?q=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%A2%20%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B8%E0%B8%91%E0%B9%82%E0%B8%92&c=books"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-sky-50 border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#073B65] shadow-2xs transition-colors"
              title="ค้นหาหนังสือบน Google Play Books"
            >
              <span>Google Play</span>
              <ExternalLink size={11} className="text-slate-400" />
            </a>
          </div>
        </div>

        {/* Scrollable Track with Floating Left/Right Arrows */}
        <div className="relative">
          
          {/* Left Scroll Button */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white text-slate-700 shadow-lg border border-slate-200 items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="เลื่อนไปทางซ้าย"
              aria-label="ก่อนหน้า"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Book Row Poster Track (Compact, same size as regular shelves) */}
          <div 
            ref={scrollContainerRef}
            className="flex gap-3 sm:gap-4 md:gap-5 overflow-x-auto pb-2 pt-1 px-0.5 scrollbar-hide scroll-smooth no-scrollbar touch-pan-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {allCommercialBooks.map((book) => {
              const rawCover = book.cover_image || book.cover || '/images/books/book-placeholder.jpg';
              const storeUrl = book.buy_url || book.source_url || 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=115432';
              const storeName = book.store_name || 'MEB Market';
              const price = book.price || '99 บาท';
              const authorName = book.author || 'พระมหาสมชาย ฐานวุฑฺโฒ';

              return (
                <div 
                  key={book.id}
                  className="shrink-0 w-[128px] min-[370px]:w-[145px] sm:w-[160px] md:w-[172px] group/card select-none flex flex-col justify-between"
                >
                  <div>
                    {/* 1. Book Poster with 3D Spine and Hover Lift */}
                    <a
                      href={storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative aspect-[1/1.42] w-full rounded-xl overflow-hidden bg-white shadow-[2px_4px_12px_rgba(0,0,0,0.10)] border border-slate-200/90 group-hover/card:border-sky-400 group-hover/card:shadow-[3px_8px_18px_rgba(7,159,232,0.22)] group-hover/card:-translate-y-1.5 transition-all duration-300 block cursor-pointer"
                      title={`${book.title} (คลิกเพื่อสั่งซื้อบน ${storeName})`}
                    >
                      {/* Book Spine 3D Highlight Line on Left */}
                      <div className="absolute left-0 inset-y-0 w-1.5 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
                      
                      {/* Right Edge Page-stack Simulation */}
                      <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />

                      {/* Cover Image */}
                      <Image 
                        src={rawCover} 
                        alt={`ปกหนังสือ ${book.title}`}
                        fill
                        className="object-cover group-hover/card:scale-104 transition-transform duration-300"
                        unoptimized
                      />

                      {/* Discreet Top Badge */}
                      <div className="absolute top-1.5 left-1.5 z-20 select-none">
                        <span className="bg-[#073B65]/90 text-white font-bold text-[8px] leading-none px-1.5 py-0.5 rounded shadow-xs flex items-center gap-0.5">
                          <Tag size={8} /> {price}
                        </span>
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#073B65]/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-center p-2 z-20">
                        <span className="w-full py-1.5 rounded-lg bg-white text-[#073B65] font-bold text-[10.5px] shadow-md flex items-center justify-center gap-1">
                          <ShoppingCart size={11} className="text-[#079FE8]" />
                          <span>สั่งซื้อ {storeName} ↗</span>
                        </span>
                      </div>
                    </a>

                    {/* 2. Book Metadata */}
                    <div className="mt-2 px-0.5">
                      <div className="flex items-center justify-between text-[10.5px] text-slate-500 font-medium mb-0.5">
                        <span className="font-semibold text-slate-600 truncate">{storeName}</span>
                        <span className="text-[#079FE8] font-bold text-[10px]">{price}</span>
                      </div>

                      {/* Book Title */}
                      <a
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block font-semibold text-xs sm:text-[13px] text-slate-800 line-clamp-2 leading-snug min-h-[2.2rem] group-hover/card:text-[#079FE8] transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </a>
                      
                      {/* Author */}
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {authorName}
                      </p>
                    </div>
                  </div>

                  {/* 3. Compact Order Button */}
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 w-full py-1.5 px-2 rounded-lg bg-[#073B65] hover:bg-[#079FE8] text-white text-[11px] font-bold shadow-2xs flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <ShoppingCart size={11} />
                    <span>สั่งซื้อ {storeName} ↗</span>
                  </a>
                </div>
              );
            })}
          </div>

          {/* Right Scroll Button */}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 rounded-full bg-white text-slate-700 shadow-lg border border-slate-200 items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              title="เลื่อนไปทางขวา"
              aria-label="ถัดไป"
            >
              <ChevronRight size={18} />
            </button>
          )}

        </div>

        {/* Subtle Footer Note */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-200/70 flex items-center justify-between text-[11px] text-slate-500 flex-wrap gap-2">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-sky-600 shrink-0" />
            <span>หนังสือฉบับลิขสิทธิ์ถูกต้อง วางจำหน่ายผ่านตัวแทนอย่างเป็นทางการ (MEB Market & Google Play)</span>
          </div>
          <span className="text-[10px] text-slate-400">
            * คลิกเพื่อไปยังหน้าร้านค้าและอ่านตัวอย่างในแอป MEB
          </span>
        </div>

      </div>
    </section>
  );
}
