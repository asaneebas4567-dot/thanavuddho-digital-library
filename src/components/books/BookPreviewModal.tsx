'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  BookOpen, 
  Eye, 
  Heart, 
  Share2, 
  Bookmark, 
  CheckCircle2, 
  FileCheck, 
  Award, 
  BookMarked, 
  ExternalLink, 
  Check, 
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { Book } from '@/types';
import { useLoan } from '@/context/LoanContext';
import { getBookCustomContent } from '@/data/bookCustomData';

interface BookPreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookPreviewModal({ book, isOpen, onClose }: BookPreviewModalProps) {
  const { isMediaBorrowed, borrowMedia, returnMediaByBookId, activeLoanCount, maxLoans, loans } = useLoan();
  const [copied, setCopied] = useState(false);
  const [isWished, setIsWished] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !book) return null;

  let rawCover = book.cover_image || (book as any).cover;
  if (book.id?.startsWith('pubhtml5_')) {
    rawCover = `/images/books/pubhtml5/${book.id}.jpg`;
  }
  const hasCover = rawCover && rawCover !== '/images/books/book-placeholder.jpg';
  const coverUrl = rawCover ? encodeURI(decodeURI(rawCover)) : '';

  const totalPages = book.page_count ?? (book as any).pages ?? 120;
  const readCount = book.read_count ?? book.view_count ?? 0;
  const year = book.publication_year ?? 2565;
  const author = (book as any).author || (book.author_id === 'author_001' ? 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)' : 'พระครูปลัดสุวัฒนโพธิคุณ');
  const publisher = book.publisher || 'มูลนิธิธรรมะคุ้มครองโลก';
  const categoryName = (book as any).category_name || (book as any).category || 'ธรรมะปฏิบัติ / พัฒนาตนเอง';

  const customContent = getBookCustomContent(book.id);
  const borrowed = isMediaBorrowed(book.id);
  const currentLoan = loans.find(l => l.media_id === book.id && l.status === 'active');

  const getDueDays = () => {
    if (!currentLoan) return 14;
    const due = new Date(currentLoan.due_date);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const handleBorrow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (activeLoanCount >= maxLoans) {
      setIsError(true);
      setFeedback(`ยืมครบโควตาสูงสุด ${maxLoans} เล่มแล้ว กรุณาคืนเล่มเดิมก่อน`);
      setTimeout(() => setFeedback(null), 3500);
      return;
    }

    const res = borrowMedia({
      id: book.id,
      title: book.title,
      type: 'book',
      cover: coverUrl
    });

    setIsError(!res.success);
    setFeedback(res.message);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleReturn = (e: React.MouseEvent) => {
    e.preventDefault();
    returnMediaByBookId(book.id);
    setIsError(false);
    setFeedback('คืนหนังสือเรียบร้อยแล้ว เพิ่มโควตายืมว่าง 1 เล่ม');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? `${window.location.origin}/books/${book.id}` : '';
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `อ่านหนังสือธรรมะ "${book.title}" บน Thanavuddho Digital Library`,
          url
        });
        return;
      } catch {}
    }
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/65 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog: Spacious on Desktop, Balanced & Normal on Mobile */}
      <div 
        className="relative w-full max-w-[95vw] sm:max-w-2xl md:max-w-4xl lg:max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-3.5 border-b border-slate-100 bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F8FD] text-[#073B65] border border-[#DCEAF3]">
              <BookMarked size={14} className="text-[#079FE8]" />
              ข้อมูลและยืมอ่านหนังสือ
            </span>
            <span className="hidden sm:inline-block text-xs text-slate-400">
              โควตายืมคงเหลือ {activeLoanCount}/{maxLoans} เล่ม
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="ปิดหน้าต่าง"
          >
            <X size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Floating Notification Toast */}
        {feedback && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 flex items-center gap-2 bg-slate-900 text-white border border-slate-700">
            {isError ? (
              <span className="w-2 h-2 rounded-full bg-rose-500" />
            ) : (
              <Check size={16} className="text-[#079FE8]" />
            )}
            <span>{feedback}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-5">
          
          {/* Main Book Presentation: Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
            
            {/* Left Column: Book Cover Poster */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-44 sm:w-52 md:w-full md:max-w-[260px] lg:max-w-[280px]">
                <div className="book-cover-3d relative aspect-[1/1.42] rounded-2xl overflow-hidden bg-slate-900 ring-1 ring-black/10 shadow-2xl transition-all group">
                  {hasCover ? (
                    <Image
                      src={coverUrl}
                      alt={book.title}
                      fill
                      className="object-cover"
                      unoptimized
                      referrerPolicy="no-referrer"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 p-4 text-white flex flex-col justify-between text-center select-none">
                      <span className="text-[10px] tracking-widest text-amber-300 font-serif border-b border-white/20 pb-1">หนังสือธรรมะ</span>
                      <p className="text-sm font-bold text-white line-clamp-4 leading-snug">{book.title}</p>
                      <span className="text-[9px] text-gray-300 border-t border-white/20 pt-1">พระครูปลัดสุวัฒนโพธิคุณ</span>
                    </div>
                  )}

                  {/* Red Copyright Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-[9px] px-2.5 py-0.5 rounded-full shadow-lg z-20 border border-red-300/80 flex items-center gap-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    ลิขสิทธิ์
                  </div>

                  {/* Ribbon tag top-left in Sky Blue */}
                  <div className="absolute top-0 left-3 bg-[#079FE8] text-white text-[9.5px] font-bold px-2 py-1 rounded-b-md shadow-md z-20 uppercase tracking-wider">
                    E-Book
                  </div>
                </div>

                {/* Read Stats below cover */}
                <div className="mt-3 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1" title="ยอดเปิดอ่าน">
                    <Eye size={14} className="text-slate-400" />
                    {readCount > 0 ? `${readCount.toLocaleString()} ครั้งที่อ่าน` : 'อ่านฟรีในระบบ'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#079FE8] font-bold">
                    <ShieldCheck size={14} />
                    ฉบับสมบูรณ์ ({totalPages} หน้า)
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Sky Blue Byline, Heart & Details, Primary Borrow Button, Specs, DRM */}
            <div className="md:col-span-7 flex flex-col justify-start">
              
              {/* Book Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight mb-2">
                {book.title}
              </h1>

              {/* Byline / Metadata in Sky Blue */}
              <div className="space-y-1 text-xs sm:text-sm text-slate-600 font-medium mb-4">
                <p>
                  <span>โดย </span>
                  <span className="text-[#079FE8] hover:underline font-bold cursor-pointer">
                    {author}
                  </span>
                </p>
                <p>
                  <span>สำนักพิมพ์ </span>
                  <span className="text-[#079FE8] hover:underline font-semibold cursor-pointer">
                    {publisher}
                  </span>
                </p>
                <p>
                  <span>หมวดหมู่ </span>
                  <span className="text-[#079FE8] hover:underline font-semibold cursor-pointer">
                    {categoryName}
                  </span>
                </p>
              </div>

              {/* Quick Action Buttons: Heart + Book Details Link */}
              <div className="flex items-center gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setIsWished(!isWished)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isWished 
                      ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-xs scale-105' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-[#079FE8] hover:text-[#079FE8]'
                  }`}
                >
                  <Heart size={15} fill={isWished ? '#e11d48' : 'none'} className={isWished ? 'text-rose-600' : 'text-slate-400'} />
                  <span>{isWished ? 'บันทึกในรายการที่อยากได้แล้ว' : 'อยากได้'}</span>
                </button>

                <Link
                  href={`/books/${book.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:border-[#079FE8] hover:text-[#079FE8] transition-colors"
                >
                  <FileText size={15} className="text-slate-400" />
                  <span>หน้ารายละเอียด</span>
                </Link>
              </div>

              {/* Action Button: Signature Sky Blue Pill Button */}
              <div className="mb-4">
                {borrowed ? (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Link
                      href={`/reader/${book.id}?from=/books`}
                      className="flex-1 rounded-full bg-gradient-to-r from-[#079FE8] to-[#073B65] hover:from-[#0588c7] hover:to-[#052946] text-white px-7 py-3 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
                    >
                      <BookOpen size={18} />
                      <span>เปิดอ่านหนังสือ (ยืมแล้ว)</span>
                    </Link>

                    <button
                      onClick={handleReturn}
                      title="คืนหนังสือเพื่อเพิ่มโควตาว่าง"
                      className="px-4 py-2.5 rounded-full text-xs font-bold text-slate-500 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={13} />
                      <span>คืนหนังสือ</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleBorrow}
                    className="w-full rounded-full bg-gradient-to-r from-[#079FE8] to-[#073B65] hover:from-[#0588c7] hover:to-[#052946] text-white px-8 py-3.5 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <BookMarked size={18} />
                    <span>📘 กดยืมหนังสือเพื่อเริ่มอ่านทันที (ว่าง {maxLoans - activeLoanCount} เล่ม)</span>
                  </button>
                )}
              </div>

              {/* Specifications: Only Length & Access Rights */}
              <div className="bg-slate-50 rounded-2xl p-3.5 sm:p-4 border border-slate-200/70 space-y-2 text-xs sm:text-sm mb-3.5">
                <div className="grid grid-cols-12 gap-2 py-0.5 border-b border-slate-200/50">
                  <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">ความยาว</span>
                  <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                    {totalPages} หน้า <span className="text-slate-500 font-normal">(ฉบับเต็ม)</span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-0.5">
                  <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">สิทธิ์การเข้าถึง</span>
                  <span className="col-span-7 sm:col-span-8 text-[#079FE8] font-bold">
                    ยืมอ่านฟรี 14 วัน <span className="text-slate-500 font-normal text-xs">(ลิขสิทธิ์ถูกต้อง)</span>
                  </span>
                </div>
              </div>

              {/* DRM Explanation & Quota */}
              <div className="p-3.5 rounded-2xl bg-[#F0F8FD] border border-[#DCEAF3] text-xs text-[#073B65] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-[#079FE8] shrink-0" />
                  <span>ตามระเบียบลิขสิทธิ์ ยืมอ่านฟรีได้คราวละ {maxLoans} เล่ม (อ่านได้ 14 วัน)</span>
                </div>
                <span className="font-extrabold text-[#079FE8] bg-white px-2.5 py-1 rounded-full border border-[#DCEAF3] shrink-0">
                  โควตา {activeLoanCount}/{maxLoans} เล่ม
                </span>
              </div>

            </div>

          </div>

          {/* Copyright Box (Red Notice, เด่นชัดเจนตามระเบียบลิขสิทธิ์) */}
          <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200/90 rounded-2xl p-4 shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="font-extrabold text-red-600 text-sm tracking-wide flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                หนังสือลิขสิทธิ์
              </span>
              <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                สงวนลิขสิทธิ์ตามกฎหมาย
              </span>
              {book.isbn && (
                <span className="text-[11px] font-mono text-red-700 bg-white/80 border border-red-200 px-2 py-0.5 rounded-md font-semibold">
                  ISBN: {book.isbn}
                </span>
              )}
            </div>
            <p className="text-red-700 text-xs sm:text-sm leading-relaxed font-medium">
              หนังสือเล่มนี้เป็นลิขสิทธิ์ของ {publisher} ได้รับอนุญาตให้เผยแผ่เพื่อการศึกษาและปฏิบัติธรรม อนุญาตให้อ่านออนไลน์ในระบบหอสมุดดิจิทัล ห้ามทำซ้ำ ดัดแปลง หรือจำหน่ายในเชิงพาณิชย์
            </p>
          </div>

          {/* Custom Content: Chapters if available */}
          {customContent?.chapters && customContent.chapters.length > 0 && (
            <div className="pt-2">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>สารบัญบทเรียน ({customContent.chapters.length} บท)</span>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">เนื้อหาตรวจสอบแล้ว</span>
              </h4>
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {customContent.chapters.map((ch, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/80 border border-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {ch.chapter_number}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">{ch.title}</span>
                    </div>
                    {ch.page_start && (
                      <span className="text-[11px] text-slate-400 font-medium">หน้า {ch.page_start}{ch.page_end ? `-${ch.page_end}` : ''}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
