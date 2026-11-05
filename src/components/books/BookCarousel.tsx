'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, Heart, CheckCircle2 } from 'lucide-react';
import { Book } from '@/types';

interface BookCarouselProps {
  books: Book[];
}

export default function BookCarousel({ books }: BookCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 6;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => {
        // If we reach the end, go back to 0
        if (prev + itemsPerView >= books.length) {
          return 0;
        }
        return prev + itemsPerView;
      });
    }, 10000);
    return () => clearInterval(timer);
  }, [books.length]);

  const visibleBooks = books.slice(currentIndex, currentIndex + itemsPerView);

  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex justify-start gap-4 sm:gap-6 pb-2 transition-all duration-500 ease-in-out">
        {visibleBooks.map((book) => {
          const rawCover = book.cover_image || (book as any).cover;
          const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg';
          const cleanCover = rawCover?.startsWith('http://online.pubhtml5.com') 
            ? rawCover.replace('http://', 'https://') 
            : rawCover;
          const coverUrl = cleanCover ? encodeURI(decodeURI(cleanCover)) : '';

          return (
            <Link key={book.id} href={`/books/${book.id}`} className="group shrink-0 w-[140px] sm:w-[160px] md:w-[180px]">
              <div className="relative aspect-[3/4] w-full rounded-md overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
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
                  <div className="w-full h-full bg-gradient-to-br from-amber-800 via-amber-900 to-amber-950 p-3 text-white flex flex-col justify-between text-center select-none">
                    <span className="text-[9px] text-amber-300 font-serif">ธรรมทาน</span>
                    <p className="text-xs font-bold text-amber-100 line-clamp-3 leading-snug">{book.title}</p>
                    <span className="text-[8px] text-amber-300/80 truncate">พระอาจารย์</span>
                  </div>
                )}
                <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-black/20 to-transparent"></div>
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
                  แนะนำ
                </div>
              </div>
            <div className="mt-3">
              <h3 className="font-semibold text-xs sm:text-sm text-gray-900 line-clamp-2 group-hover:text-amber-600 transition-colors">{book.title}</h3>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] sm:text-xs text-gray-500">
                <span className="flex items-center gap-1" title="จำนวนผู้เข้าชม"><Eye size={12} /> {book.view_count?.toLocaleString()}</span>
                <span className="flex items-center gap-1 text-rose-500" title="ถูกใจ"><Heart size={12} fill="currentColor" /> {book.like_count?.toLocaleString() || 0}</span>
                {book.is_finished && <span className="flex items-center gap-1 text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm font-medium" title="อ่านจบแล้ว"><CheckCircle2 size={12} /> จบแล้ว</span>}
              </div>
            </div>
          </Link>
        );
      })}
      </div>
      
      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: Math.ceil(books.length / itemsPerView) }).map((_, idx) => (
          <button
            key={idx}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              Math.floor(currentIndex / itemsPerView) === idx ? 'bg-amber-500 w-6' : 'bg-gray-300 hover:bg-gray-400'
            }`}
            onClick={() => setCurrentIndex(idx * itemsPerView)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
