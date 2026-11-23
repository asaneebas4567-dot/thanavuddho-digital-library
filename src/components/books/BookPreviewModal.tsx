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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-[#00ba70] border border-emerald-200/80">
              <BookMarked size={14} className="text-[#00ba70]" />
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
              <Check size={16} className="text-emerald-400" />
            )}
            <span>{feedback}</span>
          </div>
        )}

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
          
          {/* Main Book Presentation: MEB Two-Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-start">
            
            {/* Left Column: Book Cover Poster (Desktop: w-72 to w-80 large poster, Mobile: w-44 to w-52 compact & normal) */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-44 sm:w-52 md:w-full md:max-w-[300px] lg:max-w-[320px]">
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

                  {/* Ribbon tag top-left */}
                  <div className="absolute top-0 left-3 bg-[#00ba70] text-white text-[9.5px] font-bold px-2 py-1 rounded-b-md shadow-md z-20 uppercase tracking-wider">
                    E-Book
                  </div>
                </div>

                {/* Read Stats below cover */}
                <div className="mt-3.5 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                  <span className="flex items-center gap-1" title="ยอดเปิดอ่าน">
                    <Eye size={14} className="text-slate-400" />
                    {readCount > 0 ? `${readCount.toLocaleString()} ครั้งที่อ่าน` : 'อ่านฟรีในระบบ'}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-bold">
                    <ShieldCheck size={14} />
                    ฉบับสมบูรณ์
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: MEB Metadata, Action Buttons, Ratings, Icons & Specs */}
            <div className="md:col-span-7 flex flex-col justify-start">
              
              {/* Book Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-tight tracking-tight mb-2">
                {book.title}
              </h1>

              {/* Byline / Metadata in MEB Link Style */}
              <div className="space-y-1.5 text-xs sm:text-sm text-slate-600 font-medium mb-5">
                <p>
                  <span>โดย </span>
                  <span className="text-[#00ba70] hover:underline font-bold cursor-pointer">
                    {author}
                  </span>
                </p>
                <p>
                  <span>สำนักพิมพ์ </span>
                  <span className="text-[#00ba70] hover:underline font-semibold cursor-pointer">
                    {publisher}
                  </span>
                </p>
                <p>
                  <span>หมวดหมู่ </span>
                  <span className="text-[#00ba70] hover:underline font-semibold cursor-pointer">
                    {categoryName}
                  </span>
                </p>
              </div>

              {/* Action Buttons: MEB Twin Pills (ทดลองอ่าน + ยืมหนังสือ/อ่านเลย) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
                {/* 1. ทดลองอ่าน (White with green border pill) */}
                <Link
                  href={`/reader/${book.id}?from=/books`}
                  className="rounded-full border-2 border-[#00ba70] text-[#00ba70] hover:bg-emerald-50 px-6 py-2.5 sm:py-3 font-extrabold text-sm sm:text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
                >
                  <BookOpen size={18} />
                  <span>ทดลองอ่าน</span>
                </Link>

                {/* 2. ยืมหนังสือ (อ่านฟรี) หรือ เปิดอ่านหนังสือ (ยืมแล้ว) - Solid Green Pill */}
                {borrowed ? (
                  <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <Link
                      href={`/reader/${book.id}?from=/books`}
                      className="flex-1 rounded-full bg-[#00ba70] hover:bg-[#00a362] text-white px-7 py-2.5 sm:py-3 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-center"
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
                    className="flex-1 rounded-full bg-[#00ba70] hover:bg-[#00a362] text-white px-8 py-2.5 sm:py-3 font-extrabold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <BookMarked size={18} />
                    <span>ยืมหนังสือ (อ่านฟรี)</span>
                  </button>
                )}
              </div>

              {/* Rating Row (MEB Pink Hearts & Score) */}
              <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-600 font-medium mb-5 pb-4 border-b border-slate-100">
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">5.00</span>
                <div className="flex items-center gap-0.5 text-rose-500" aria-label="5 Hearts">
                  <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                  <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                  <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                  <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                  <Heart size={15} fill="#f43f5e" className="text-rose-500" />
                </div>
                <span className="text-slate-400 font-normal">4.9 Rating (ธรรมบรรณาการ)</span>
              </div>

              {/* Quick Action Icons Row (MEB Style: อยากได้, คั่นหน้า, แชร์) */}
              <div className="flex items-center justify-around sm:justify-start sm:gap-8 mb-6 py-2 text-slate-600">
                <button
                  onClick={() => setIsWished(!isWished)}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                    isWished 
                      ? 'bg-rose-50 border-rose-300 text-rose-500 scale-105' 
                      : 'border-slate-200 text-slate-600 group-hover:border-[#00ba70] group-hover:text-[#00ba70]'
                  }`}>
                    <Heart size={18} fill={isWished ? '#f43f5e' : 'none'} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    {isWished ? 'บันทึกแล้ว' : 'อยากได้'}
                  </span>
                </button>

                <Link
                  href={`/books/${book.id}`}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 group-hover:border-[#00ba70] group-hover:text-[#00ba70] flex items-center justify-center transition-all">
                    <FileText size={18} />
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">หน้ารายละเอียด</span>
                </Link>

                {customContent?.questions && customContent.questions.length > 0 && (
                  <Link
                    href={`/quiz?book=${book.id}`}
                    className="flex flex-col items-center gap-1 group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full border border-slate-200 text-amber-600 group-hover:border-amber-500 group-hover:bg-amber-50 flex items-center justify-center transition-all">
                      <Award size={18} />
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">แบบทดสอบ</span>
                  </Link>
                )}

                <button
                  onClick={handleShare}
                  className="flex flex-col items-center gap-1 group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full border border-slate-200 text-slate-600 group-hover:border-[#00ba70] group-hover:text-[#00ba70] flex items-center justify-center transition-all">
                    {copied ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                  </div>
                  <span className="text-[11px] font-medium text-slate-600">
                    {copied ? 'คัดลอกแล้ว' : 'แชร์'}
                  </span>
                </button>
              </div>

              {/* MEB 2-Column Key-Value Specifications Table */}
              <div className="bg-slate-50/70 rounded-2xl p-4 sm:p-5 border border-slate-200/70 space-y-2.5 text-xs sm:text-sm">
                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-200/50">
                  <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">ประเภทไฟล์</span>
                  <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                    pdf, 3D Flipbook <span className="text-emerald-600 font-normal">(เปิดอ่านออนไลน์)</span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-200/50">
                  <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">วันที่เผยแพร่</span>
                  <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                    ปี พ.ศ. {year}
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1 border-b border-slate-200/50">
                  <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">ความยาว</span>
                  <span className="col-span-7 sm:col-span-8 text-slate-900 font-semibold">
                    {totalPages} หน้า <span className="text-slate-500 font-normal">(ฉบับเต็ม)</span>
                  </span>
                </div>

                <div className="grid grid-cols-12 gap-2 py-1">
                  <span className="col-span-5 sm:col-span-4 text-slate-500 font-medium">สิทธิ์การเข้าถึง</span>
                  <span className="col-span-7 sm:col-span-8 text-[#00ba70] font-bold">
                    ยืมอ่านฟรี 14 วัน <span className="text-slate-500 font-normal text-xs">(ลิขสิทธิ์ถูกต้อง)</span>
                  </span>
                </div>
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

          {/* Synopsis / เรื่องย่อ */}
          <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-200/70">
            <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center gap-2">
              <FileCheck size={16} className="text-[#00ba70]" />
              เรื่องย่อ / เกี่ยวกับหนังสือเล่มนี้
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              {book.description || 'รวบรวมหลักธรรมคำสอนและแนวทางการดำเนินชีวิตอย่างมีความสุขและสงบใจ เพื่อการศึกษาและพัฒนาจิตใจ ผสานมุมมองพุทธศาสตร์เข้ากับชีวิตประจำวัน'}
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
