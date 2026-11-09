'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, ArrowRight, Eye, Star, Sparkles } from 'lucide-react';
import { Book } from '@/types';

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
    <div className="group relative bg-white border border-[#DCEAF3] rounded-2xl shadow-xs hover:shadow-xl hover:border-[#079FE8]/40 transition-all duration-300 flex flex-col h-full hover:-translate-y-1 overflow-hidden">
      
      {/* Cover Artwork Container */}
      <div className="relative aspect-[3/4] w-full bg-[#F0F8FD]/50 overflow-hidden flex items-center justify-center p-4 sm:p-5 border-b border-[#DCEAF3]">
        
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

        {/* 3D Book Frame */}
        <div className="book-cover-3d relative w-32 sm:w-36 aspect-[1/1.42] rounded-md overflow-hidden bg-slate-900 ring-1 ring-black/10 group-hover:scale-105 transition-transform duration-300 shadow-md">
          

          {/* Copyright Red Badge - หนังสือลิขสิทธิ์ ตัวแดงเด่นชัดเจน */}
          {(book.is_copyright || book.copyright_status === 'approved' || (book as any).copyright_notice) && (
            <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[8px] sm:text-[8.5px] leading-none px-2 py-0.5 rounded-full shadow-md tracking-wider z-20 select-none border border-red-300/80 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              หนังสือลิขสิทธิ์
            </div>
          )}

          {hasCover ? (
            <Image
              src={coverUrl}
              alt={book.title}
              fill
              className="object-cover"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              unoptimized
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-b ${theme.bg} p-2.5 flex flex-col justify-between text-center select-none relative overflow-hidden shadow-inner`}>
              <div className={`absolute inset-y-0 left-0 w-2 ${theme.spine} opacity-90`} />
              <div className={`w-full h-full border ${theme.border} rounded-sm p-1.5 flex flex-col justify-between bg-white/40 backdrop-blur-[1px]`}>
                <div className="border-b border-black/10 pb-0.5">
                  <span className={`text-[7.5px] uppercase tracking-widest font-black ${theme.tag}`}>
                    ธรรมบรรณาการ
                  </span>
                </div>
                <p className={`text-[11px] font-black ${theme.text} line-clamp-3 leading-snug drop-shadow-2xs px-0.5`}>
                  {book.title}
                </p>
                <div className="border-t border-black/10 pt-0.5">
                  <span className={`text-[7.5px] font-bold ${theme.tag} truncate block`}>
                    พระครูปลัดสุวัฒนโพธิคุณ
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Spine gradient */}
          <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/25 via-black/10 to-transparent pointer-events-none z-10" />
        </div>

        {/* Hover Quick Action */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <Link
            href={`/reader/${book.id}?from=/books`}
            className="px-4 py-1.5 rounded-full bg-[#073B65] hover:bg-[#052946] text-white font-bold text-xs shadow-lg flex items-center gap-1.5 whitespace-nowrap active:scale-95"
          >
            <BookOpen size={13} className="text-[#D9A441]" />
            <span>อ่านทันที</span>
          </Link>
        </div>

      </div>

      {/* Book Metadata */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Tags / Meta Pill */}
          <div className="flex items-center text-xs text-gray-500 mb-2 gap-2 flex-wrap">
            <span className="bg-[#F0F8FD] text-[#073B65] border border-[#DCEAF3] px-2 py-0.5 rounded-md font-semibold text-[11px]">
              {year ? `ปี ${year}` : 'ธรรมบรรณาการ'}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
              <BookOpen className="w-3 h-3 text-slate-500" /> 
              {pageCount ? `${pageCount} หน้า` : 'ฉบับเต็ม'}
            </span>
            {(book.is_copyright || book.copyright_status === 'approved' || (book as any).copyright_notice) && (
              <>
                <span className="text-gray-300">•</span>
                <span className="bg-red-50 text-red-600 border border-red-200/90 px-1.5 py-0.5 rounded-md font-bold text-[10.5px] inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
                  หนังสือลิขสิทธิ์
                </span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1.5 line-clamp-2 leading-snug group-hover:text-sky-700 transition-colors">
            <Link href={`/books/${book.id}`}>
              {book.title}
            </Link>
          </h3>

          <p className="text-xs text-gray-500 font-medium mb-3">
            {author}
          </p>

          {/* Description */}
          <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-4">
            {book.description || 'รวบรวมหลักธรรมคำสอนและแนวทางการดำเนินชีวิตอย่างมีความสุขและสงบใจ'}
          </p>
        </div>

        {/* Card Footer */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <Link 
            href={`/books/${book.id}`}
            className="text-xs font-bold text-slate-800 hover:text-sky-700 flex items-center gap-1 group/btn"
          >
            <span>รายละเอียด</span>
            <ArrowRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
          </Link>

          <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-100" title="ยอดผู้เปิดอ่านจริง">
            <Eye size={12} className="text-gray-400" />
            <span>{readCount > 0 ? `${readCount.toLocaleString()} อ่าน` : '0 อ่าน'}</span>
          </span>
        </div>

      </div>

    </div>
  );
}
