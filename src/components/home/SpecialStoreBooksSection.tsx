'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShoppingCart, 
  ExternalLink, 
  Sparkles, 
  BookMarked, 
  Store, 
  Info,
  CheckCircle2,
  ArrowUpRight,
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
  }
];

interface SpecialStoreBooksSectionProps {
  customBooks?: Book[];
}

export default function SpecialStoreBooksSection({ customBooks = [] }: SpecialStoreBooksSectionProps) {
  // Merge preset books with any external store books found in persistentBooks or props
  const allCommercialBooks = React.useMemo(() => {
    const map = new Map<string, Book>();
    COMMERCIAL_STORE_BOOKS.forEach(b => map.set(b.id, b));
    customBooks
      .filter(b => b.is_external_store || (b as any).buy_url)
      .forEach(b => map.set(b.id, { ...map.get(b.id), ...b }));
    return Array.from(map.values());
  }, [customBooks]);

  return (
    <section 
      id="special-commercial-books" 
      aria-label="หนังสือหมวดพิเศษฉบับวางจำหน่าย"
      className="relative w-full rounded-3xl p-5 sm:p-8 md:p-10 my-8 overflow-hidden bg-gradient-to-b from-[#FFFDF7] via-[#FFF9ED] to-[#F3F9FD] border-2 border-amber-300/80 shadow-[0_15px_45px_-10px_rgba(217,164,65,0.22)]"
    >
      {/* Decorative Gold & Amber Ambient Lighting */}
      <div 
        aria-hidden="true" 
        className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-amber-300/25 to-yellow-500/10 blur-3xl pointer-events-none" 
      />
      <div 
        aria-hidden="true" 
        className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-tr from-sky-400/20 to-blue-500/10 blur-3xl pointer-events-none" 
      />

      <div className="relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-amber-200/80">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold shadow-sm mb-3">
              <Sparkles size={14} className="animate-pulse" />
              <span>หมวดพิเศษ • ผลงานวางจำหน่าย (E-Book & ร้านค้า)</span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#073B65] tracking-tight">
              หนังสือฉบับวางจำหน่ายภายนอก & ช่องทางสั่งซื้อ
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              รวบรวมผลงานหนังสือของพระครูปลัดสุวัฒนโพธิคุณ ที่วางจำหน่ายผ่านร้านค้า E-Book ชั้นนำ เพื่อความครบถ้วนสมบูรณ์ของคลังผลงานธรรมะ 
              <span className="font-semibold text-amber-900 block sm:inline sm:ml-1">
                (หมวดนี้เป็นหนังสือฉบับจำหน่าย ไม่เปิดให้อ่านฟรีในระบบ — ท่านสามารถเลือกซื้อได้จากร้านค้าโดยตรง)
              </span>
            </p>
          </div>

          {/* External Store Direct Links Pill */}
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <a
              href="https://www.mebmarket.com/index.php?action=SearchBook&type=author&search=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%A2%20%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B8%E0%B8%91%E0%B9%82%E0%B8%92"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-2xs transition-all hover:scale-105 active:scale-95"
              title="ค้นหาหนังสือทั้งหมดบน MEB Market"
            >
              <Store size={13} className="text-amber-600" />
              <span>ร้าน MEB Market</span>
              <ArrowUpRight size={13} className="text-amber-500" />
            </a>

            <a
              href="https://play.google.com/store/search?q=%E0%B8%9E%E0%B8%A3%E0%B8%B0%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%AA%E0%B8%A1%E0%B8%8A%E0%B8%B2%E0%B8%A2%20%E0%B8%90%E0%B8%B2%E0%B8%99%E0%B8%A7%E0%B8%B8%E0%B8%91%E0%B9%82%E0%B8%92&c=books"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-sky-50 border border-sky-200 text-xs font-bold text-[#073B65] shadow-2xs transition-all hover:scale-105 active:scale-95"
              title="ค้นหาหนังสือบน Google Play Books"
            >
              <ShoppingCart size={13} className="text-[#079FE8]" />
              <span>Google Play Store</span>
              <ArrowUpRight size={13} className="text-[#079FE8]" />
            </a>
          </div>
        </div>

        {/* Commercial Book Grid Showcase */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCommercialBooks.map((book) => {
            const rawCover = book.cover_image || book.cover || '/images/books/book-placeholder.jpg';
            const storeUrl = book.buy_url || book.source_url || 'https://www.mebmarket.com/index.php?action=BookDetails&book_id=115432';
            const storeName = book.store_name || 'MEB Market';
            const price = book.price || '99 บาท';

            return (
              <div 
                key={book.id}
                className="group relative bg-white/95 backdrop-blur-xs rounded-2xl p-4 sm:p-5 border-2 border-amber-200/90 hover:border-amber-400 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
              >
                {/* Ribbon Tag Top Right */}
                <div className="absolute -top-3 -right-2 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10.5px] font-extrabold px-3 py-1 rounded-full shadow-md">
                  <Tag size={11} />
                  <span>{storeName} • {price}</span>
                </div>

                {/* Upper Content: Cover & Synopsis */}
                <div>
                  {/* Book Cover with 3D Spine and Direct Store Link */}
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative aspect-[3/4] w-full max-w-[200px] mx-auto rounded-xl overflow-hidden shadow-[0_12px_28px_-6px_rgba(0,0,0,0.25)] border border-amber-200/60 transition-transform duration-300 group-hover:scale-105 cursor-pointer bg-amber-50"
                    title={`คลิกเพื่อไปที่ร้านค้า ${storeName}: ${book.title}`}
                  >
                    <Image
                      src={rawCover}
                      alt={book.title}
                      fill
                      sizes="(max-width: 640px) 180px, 200px"
                      className="object-cover"
                      priority
                    />
                    
                    {/* Spine Shadow */}
                    <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none" />
                    
                    {/* Hover Overlay with Store Prompt */}
                    <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 text-white text-center">
                      <ShoppingCart size={28} className="text-amber-300 mb-1.5 animate-bounce" />
                      <span className="text-xs font-bold leading-tight">คลิกเพื่อสั่งซื้อบน</span>
                      <span className="text-xs font-extrabold text-amber-300">{storeName}</span>
                    </div>
                  </a>

                  {/* Title & Metadata */}
                  <div className="mt-4 text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200">
                        🔒 ฉบับจำหน่าย (ไม่เปิดให้อ่านฟรี)
                      </span>
                      {book.publisher && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          สำนักพิมพ์ {book.publisher}
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base sm:text-lg text-[#073B65] line-clamp-2 mt-1">
                      <a 
                        href={storeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-amber-600 transition-colors"
                        title={book.title}
                      >
                        {book.title}
                      </a>
                    </h3>

                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {book.author || 'พระมหาสมชาย ฐานวุฑฺโฒ'}
                    </p>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-5 pt-3 border-t border-amber-100 space-y-2">
                  {/* Primary Direct Store Purchase Button */}
                  <a
                    href={storeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-extrabold text-xs sm:text-sm shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95 group/btn"
                  >
                    <ShoppingCart size={15} />
                    <span>เลือกซื้อบน {storeName}</span>
                    <ExternalLink size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                  </a>

                  {/* Secondary Book Detail Button */}
                  <Link
                    href={`/books/${book.id}`}
                    className="w-full py-1.5 px-3 rounded-lg bg-amber-50/80 hover:bg-amber-100 text-amber-900 border border-amber-200/60 font-semibold text-xs flex items-center justify-center gap-1 transition-colors text-center"
                  >
                    <Info size={12} className="text-amber-700" />
                    <span>ดูข้อมูลหนังสือฉบับนี้ในระบบ</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note on Extensibility */}
        <div className="mt-8 pt-4 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-amber-600 shrink-0" />
            <span>
              หนังสือทุกเล่มในหมวดนี้เป็นผลงานลิขสิทธิ์ถูกต้อง วางจำหน่ายผ่านตัวแทนจำหน่ายอย่างเป็นทางการ
            </span>
          </div>

          <span className="text-[11px] font-medium text-amber-900 bg-amber-100/70 border border-amber-200/80 px-2.5 py-1 rounded-lg text-center">
            ✨ หนังสือเล่มใหม่จะถูกอัปเดตเพิ่มเติมเข้ามาในหมวดนี้อย่างต่อเนื่อง
          </span>
        </div>

      </div>
    </section>
  );
}
