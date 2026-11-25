'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight, Eye, Star, Sparkles, BookMarked, Check } from 'lucide-react';
import { Book } from '@/types';
import { useLoan } from '@/context/LoanContext';

interface BookCardProps {
  book: Book;
  onQuickView?: (book: Book) => void;
}

const cardFallbackThemes = [
  { bg: 'from-[#fef9c3] via-[#fef08a] to-[#fde047]', text: 'text-[#422006]', spine: 'bg-[#ca8a04]', tag: 'text-[#854d0e]', border: 'border-[#ca8a04]/40' },
  { bg: 'from-[#ffedd5] via-[#fed7aa] to-[#fb923c]', text: 'text-[#431407]', spine: 'bg-[#ea580c]', tag: 'text-[#9a3412]', border: 'border-[#ea580c]/40' },
  { bg: 'from-[#e0f2fe] via-[#bae6fd] to-[#7dd3fc]', text: 'text-[#082f49]', spine: 'bg-[#0284c7]', tag: 'text-[#0369a1]', border: 'border-[#0284c7]/40' },
  { bg: 'from-[#fce7f3] via-[#fbcfe8] to-[#f472b6]', text: 'text-[#500724]', spine: 'bg-[#db2777]', tag: 'text-[#9d174d]', border: 'border-[#db2777]/40' },
  { bg: 'from-[#d1fae5] via-[#a7f3d0] to-[#6ee7b7]', text: 'text-[#022c22]', spine: 'bg-[#059669]', tag: 'text-[#065f46]', border: 'border-[#059669]/40' },
  { bg: 'from-[#fee2e2] via-[#fca5a5] to-[#f87171]', text: 'text-[#450a0a]', spine: 'bg-[#dc2626]', tag: 'text-[#991b1b]', border: 'border-[#dc2626]/40' },
  { bg: 'from-[#ede9fe] via-[#ddd6fe] to-[#c4b5fd]', text: 'text-[#2e1065]', spine: 'bg-[#7c3aed]', tag: 'text-[#5b21b6]', border: 'border-[#7c3aed]/40' },
];

export default function BookCard({ book, onQuickView }: BookCardProps) {
  const [imageError, setImageError] = useState(false);
  const { isMediaBorrowed } = useLoan();
  const isBorrowed = isMediaBorrowed(book.id);

  let rawCover = book.cover_image || (book as any).cover;
  if (book.id?.startsWith('pubhtml5_')) {
    rawCover = `/images/books/pubhtml5/${book.id}.jpg`;
  }
  const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg' && !imageError;
  const coverUrl = rawCover ? encodeURI(decodeURI(rawCover)) : '';

  const pageCount = book.page_count ?? (book as any).pages ?? null;
  const readCount = book.read_count ?? book.view_count ?? 0;
  const year = book.publication_year;
  const author = (book as any).author || (book.author_id === 'author_001' ? 'พระครูปลัดสุวัฒนโพธิคุณ' : 'พระครูปลัดสุวัฒนโพธิคุณ');

  // Pick deterministic theme based on book ID
  const hash = book.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const theme = cardFallbackThemes[hash % cardFallbackThemes.length];

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-2xl shadow-sm hover:shadow-xl hover:border-[#079FE8]/60 transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1">
      
      {/* Cover Artwork Container - MEB Style: 100% Full Width Hero Book Poster */}
      <Link 
        href={isBorrowed ? `/reader/${book.id}?from=/books` : `/books/${book.id}`}
        className="relative aspect-[1/1.42] w-full bg-slate-100 overflow-hidden block group/cover cursor-pointer select-none"
        title={`${book.title} (คลิกเพื่อเข้าสู่หน้าหนังสือ)`}
      >
        {/* Book Spine 3D Highlight Line on Left */}
        <div className="absolute left-0 inset-y-0 w-2 bg-gradient-to-r from-black/25 via-white/20 to-transparent pointer-events-none z-10" />
        
        {/* Right Edge Page-stack Simulation */}
        <div className="absolute right-0 inset-y-0 w-0.5 bg-slate-300/70 pointer-events-none z-10" />

        {/* Badges on Cover (MEB Discount / Status Style at top-right) */}
        <div className="absolute top-2 right-2 flex flex-col items-end gap-1 z-20 select-none">
          <div className="bg-rose-600 text-white font-extrabold text-[8.5px] sm:text-[9px] leading-none px-2 py-1 rounded shadow-xs">
            ลิขสิทธิ์
          </div>
          {isBorrowed && (
            <div className="bg-emerald-600 text-white font-bold text-[8px] sm:text-[8.5px] leading-none px-2 py-1 rounded shadow-xs flex items-center gap-0.5">
              <Check size={9} /> ยืมแล้ว
            </div>
          )}
        </div>

        {hasCover ? (
          <Image
            src={coverUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-104 transition-transform duration-300"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
            unoptimized
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-b ${theme.bg} p-4 flex flex-col justify-between text-center select-none relative overflow-hidden shadow-inner`}>
            <div className={`absolute inset-y-0 left-0 w-2.5 ${theme.spine} opacity-90`} />
            <div className={`w-full h-full border ${theme.border} rounded-sm p-3 flex flex-col justify-between bg-white/40 backdrop-blur-[1px]`}>
              <div className="border-b border-black/10 pb-1">
                <span className={`text-[8.5px] uppercase tracking-widest font-black ${theme.tag}`}>
                  ธรรมบรรณาการ
                </span>
              </div>
              <p className={`text-sm font-black ${theme.text} line-clamp-3 leading-snug drop-shadow-2xs px-1`}>
                {book.title}
              </p>
              <div className="border-t border-black/10 pt-1">
                <span className={`text-[8.5px] font-bold ${theme.tag} truncate block`}>
                  พระครูปลัดสุวัฒนโพธิคุณ
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Subtle Hover Action Indicator */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#073B65]/75 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-3 z-20">
          <span className="w-full py-2 rounded-xl bg-white text-[#073B65] font-bold text-xs shadow-md flex items-center justify-center gap-1.5">
            <BookOpen size={13} className="text-[#079FE8]" />
            <span>{isBorrowed ? 'เปิดอ่าน (ยืมแล้ว)' : 'เปิดอ่าน / ดูรายละเอียด'}</span>
          </span>
        </div>
      </Link>

      {/* Book Metadata Under Poster (MEB Book Card Style) */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Metadata Chips: Year • Pages */}
          <div className="flex items-center text-xs text-slate-500 mb-1.5 gap-1.5 flex-wrap">
            <span className="bg-slate-100 text-[#073B65] px-2 py-0.5 rounded font-semibold text-[10px]">
              {year ? `ปี ${year}` : 'ธรรมบรรณาการ'}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[10.5px] text-slate-500 font-medium flex items-center gap-1">
              <BookOpen size={11} className="text-slate-400" />
              {pageCount ? `${pageCount} น.` : 'ฉบับเต็ม'}
            </span>
          </div>

          {/* Title (Bold, 2 lines clamp, high contrast like MEB) */}
          <h3 className="text-sm sm:text-[14.5px] font-bold font-heading text-slate-900 mb-1 line-clamp-2 leading-snug group-hover:text-[#079FE8] transition-colors min-h-[2.4rem] tracking-tight">
            <Link href={`/books/${book.id}`}>
              {book.title}
            </Link>
          </h3>

          {/* Author */}
          <p className="text-xs text-slate-500 truncate mt-0.5 font-reading">
            {author}
          </p>
        </div>

        {/* Rating and Price/Read Button Row (MEB Style) */}
        <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
          <div className="flex items-center gap-1 text-[11px] text-rose-500 font-extrabold tracking-tight font-ui">
            <span>♥♥♥♥♥</span>
            {readCount > 0 && (
              <span className="text-[10px] text-slate-400 font-normal">({readCount})</span>
            )}
          </div>
          <Link
            href={isBorrowed ? `/reader/${book.id}?from=/books` : `/books/${book.id}`}
            className="px-2.5 py-1 rounded-md bg-[#00ba51] hover:bg-[#009b43] text-white font-extrabold font-ui text-[11px] shadow-2xs transition-colors flex items-center gap-1"
          >
            {isBorrowed ? 'อ่านเลย' : 'อ่านฟรี'}
          </Link>
        </div>

      </div>

    </div>
  );
}
