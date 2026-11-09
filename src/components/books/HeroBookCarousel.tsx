'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Sparkles, Shuffle } from 'lucide-react';
import { Book } from '@/types';

interface HeroBookCarouselProps {
  books: Book[];
}

export default function HeroBookCarousel({ books }: HeroBookCarouselProps) {
  const [visibleBooks, setVisibleBooks] = useState<Book[]>([]);

  const pickRandomThree = () => {
    if (!books || books.length === 0) return [];
    const shuffled = [...books].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  useEffect(() => {
    setVisibleBooks(pickRandomThree());

    const timer = setInterval(() => {
      setVisibleBooks(pickRandomThree());
    }, 7000);

    return () => clearInterval(timer);
  }, [books]);

  return (
    <div className="relative h-80 md:h-[550px] w-full rounded-[2rem] overflow-hidden shadow-2xl ring-1 ring-black/5 group perspective bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 bg-[url('/hero-image-natural.jpg')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
      
      <div className="flex w-full items-center justify-center gap-4 relative z-10 h-[65%] md:h-[75%]">
        {visibleBooks.map((book, idx) => {
          const rawCover = book.cover_image || (book as any).cover;
          const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg';
          const cleanCover = rawCover?.startsWith('http://online.pubhtml5.com') 
            ? rawCover.replace('http://', 'https://') 
            : rawCover;
          const coverUrl = cleanCover ? encodeURI(decodeURI(cleanCover)) : '';

          return (
            <Link 
              key={`${book.id}-${idx}`} 
              href={`/books/${book.id}`} 
              className={`relative h-full flex-1 max-w-[30%] transition-all duration-500 hover:-translate-y-4 hover:scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg overflow-hidden ${
                idx === 1 ? 'scale-110 z-20' : 'scale-95 z-10 opacity-90'
              }`}
            >
              {hasCover ? (
                <Image 
                  src={coverUrl} 
                  alt={book.title}
                  fill
                  className="object-cover"
                  unoptimized
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-sky-800 via-sky-900 to-slate-950 text-white p-4 flex flex-col justify-between text-center select-none">
                  <span className="text-[10px] text-sky-300 font-serif border-b border-sky-400/20 pb-1">หนังสือธรรมะ</span>
                  <p className="text-xs sm:text-sm font-bold text-sky-100 line-clamp-3">{book.title}</p>
                  <span className="text-[9px] text-sky-300/80 border-t border-sky-400/20 pt-1 truncate">พระครูปลัดสุวัฒนโพธิคุณ</span>
                </div>
              )}
              {/* Book spine effect */}
              <div className="absolute inset-y-0 left-0 w-2.5 bg-gradient-to-r from-black/50 to-transparent z-10"></div>
            </Link>
          );
        })}
      </div>
      
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end z-20">
        <div className="p-6 md:p-8 w-full">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                <Sparkles size={18} />
              </span>
              <div>
                <p className="text-white font-bold text-lg md:text-xl drop-shadow-md">หนังสือแนะนำ (สุ่ม 3 ช่องเด่น)</p>
                <p className="text-sky-300 text-xs md:text-sm font-medium drop-shadow-md">สุ่มเปลี่ยนเล่มอัตโนมัติจากคลังหนังสือ</p>
              </div>
            </div>

            <button
              onClick={() => setVisibleBooks(pickRandomThree())}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all border border-white/30 backdrop-blur-sm cursor-pointer active:scale-95"
            >
              <Shuffle size={14} />
              <span>สุ่มใหม่</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
