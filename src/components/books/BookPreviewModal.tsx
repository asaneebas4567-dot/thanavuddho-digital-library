'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  X, 
  BookOpen, 
  Eye, 
  Star, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Bookmark,
  FileCheck,
  Award,
  Layers,
  Calendar,
  BookMarked
} from 'lucide-react';
import { Book } from '@/types';
import BorrowButton from '@/components/common/BorrowButton';
import { getBookCustomContent } from '@/data/bookCustomData';

interface BookPreviewModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookPreviewModal({ book, isOpen, onClose }: BookPreviewModalProps) {
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

  const customContent = getBookCustomContent(book.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog (Webtoon Style Series Window) */}
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#DCEAF3] flex flex-col overflow-hidden z-10 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-[#DCEAF3] bg-white/95 backdrop-blur-md z-20">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F0F8FD] text-[#073B65] border border-[#DCEAF3]">
              <BookMarked size={14} className="text-[#079FE8]" />
              ข้อมูลหนังสือดิจิทัล
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

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-5 sm:space-y-6">
          
          {/* Main Book Hero Info */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-7 items-start">
            
            {/* Book Cover (3D Spine & Shadow) */}
            <div className="shrink-0 w-36 sm:w-44 mx-auto sm:mx-0">
              <div className="book-cover-3d relative aspect-[1/1.42] rounded-xl overflow-hidden bg-slate-900 ring-1 ring-black/10 shadow-lg">
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
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-indigo-950 p-3 text-white flex flex-col justify-between text-center select-none">
                    <span className="text-[9px] tracking-widest text-amber-300 font-serif border-b border-white/20 pb-1">หนังสือธรรมะ</span>
                    <p className="text-xs font-bold text-white line-clamp-4 leading-snug">{book.title}</p>
                    <span className="text-[8px] text-gray-300 border-t border-white/20 pt-1">พระครูปลัดสุวัฒนโพธิคุณ</span>
                  </div>
                )}

                {/* Red Copyright Badge */}
                {(book.is_copyright || book.copyright_status === 'approved' || (book as any).copyright_notice) && (
                  <div className="absolute top-2 right-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-extrabold text-[8.5px] px-2 py-0.5 rounded-full shadow-md z-20 border border-red-300/80 flex items-center gap-1 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    หนังสือลิขสิทธิ์
                  </div>
                )}
              </div>

              {/* Status Stats */}
              <div className="mt-3 flex items-center justify-center gap-3 text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1" title="ยอดผู้เปิดอ่านจริง">
                  <Eye size={13} className="text-gray-400" />
                  {readCount > 0 ? `${readCount.toLocaleString()} ครั้งที่อ่าน` : '0 ครั้งที่อ่าน'}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 text-[#D9A441] font-bold">
                  <Star size={13} fill="currentColor" />
                  4.9
                </span>
              </div>
            </div>

            {/* Book Details */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-gray-500 font-medium">
                <span className="font-bold px-2.5 py-0.5 rounded-md bg-[#F0F8FD] text-[#073B65] border border-[#DCEAF3]">
                  ธรรมบรรณาการ
                </span>
                <span>•</span>
                <span>ปีพิมพ์ {year}</span>
                <span>•</span>
                <span className="font-semibold text-slate-800">{totalPages} หน้า</span>
                <span>•</span>
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">ฉบับสมบูรณ์</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[#073B65] leading-snug tracking-tight mb-2">
                {book.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium mb-4 flex items-center gap-1.5">
                <span>ประพันธ์โดย:</span>
                <span className="text-slate-900 font-bold">{author}</span>
                <CheckCircle2 size={15} className="text-[#079FE8]" />
              </p>

              {/* Copyright Notice Banner - เด่นสะดุดตา ตัวแดงชัดเจน */}
              <div className="bg-gradient-to-r from-red-50 via-rose-50 to-red-50 border-2 border-red-200/90 rounded-2xl p-3.5 mb-4 shadow-2xs">
                <div className="flex items-center gap-2 flex-wrap mb-1">
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
                <p className="text-red-700 text-xs leading-relaxed font-medium">
                  หนังสือเล่มนี้เป็นลิขสิทธิ์ของ {book.publisher || 'มูลนิธิธรรมะคุ้มครองโลก'} ได้รับอนุญาตให้เผยแผ่เพื่อการศึกษาและพัฒนาจิตใจ อนุญาตให้อ่านออนไลน์ในระบบ ห้ามทำซ้ำ ดัดแปลง หรือจำหน่ายในเชิงพาณิชย์
                </p>
              </div>

              {/* Synopsis / Description from Real Book Data */}
              <div className="bg-slate-50 rounded-2xl p-4 text-xs sm:text-sm text-slate-700 leading-relaxed mb-5 border border-slate-200/60">
                <h4 className="font-bold text-xs text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <FileCheck size={14} className="text-slate-600" />
                  เกี่ยวกับหนังสือเล่มนี้
                </h4>
                <p className="line-clamp-5">
                  {book.description || 'รวบรวมหลักธรรมคำสอนและแนวทางการดำเนินชีวิตอย่างมีความสุขและสงบใจ เพื่อการศึกษาและพัฒนาจิตใจ'}
                </p>
              </div>

              {/* Call to Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href={`/reader/${book.id}?from=/books`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#079FE8] hover:bg-[#0588c7] text-white font-extrabold text-xs sm:text-sm shadow-md transition-all cursor-pointer active:scale-95"
                >
                  <BookOpen size={16} />
                  <span>เปิดอ่านฉบับเต็ม ({totalPages} หน้า)</span>
                </Link>

                <BorrowButton
                  mediaId={book.id}
                  mediaTitle={book.title}
                  mediaType="book"
                  mediaCover={coverUrl}
                  className="py-3 px-4 text-xs sm:text-sm"
                />

                <Link
                  href={`/books/${book.id}`}
                  className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm transition-colors"
                >
                  <span>หน้ารายละเอียด</span>
                  <ArrowRight size={14} />
                </Link>
              </div>

            </div>

          </div>

          {/* Custom Content: Chapters (if added by user in bookCustomData.ts) */}
          {customContent?.chapters && customContent.chapters.length > 0 && (
            <div className="pt-4 border-t border-slate-100">
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

          {/* Custom Content: Quiz (if added by user in bookCustomData.ts) */}
          {customContent?.questions && customContent.questions.length > 0 && (
            <div className="p-4 rounded-2xl bg-sky-50/80 border border-sky-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Award size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-slate-900">แบบทดสอบประจำเล่มนี้</h5>
                  <p className="text-[11px] text-slate-600">มีทั้งหมด {customContent.questions.length} ข้อ • ทำผ่านเกณฑ์ 70% รับแต้ม XP และบันทึกผลงาน</p>
                </div>
              </div>
              <Link
                href={`/quiz?book=${book.id}`}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <span>เริ่มทำแบบทดสอบ</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {/* Real Reading Specs & Features Box (Replacing Fake Chapters) */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-3">
              คุณสมบัติการเปิดอ่านและศึกษาในระบบ
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                  <BookOpen size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">Digital Reader</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">เปิดอ่านออนไลน์ทั้งบนมือถือ แท็บเล็ต และคอมพิวเตอร์ ไม่ต้องติดตั้งแอป</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Bookmark size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">ยืมอ่าน 14 วัน</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">บันทึกเข้าชั้นหนังสือส่วนตัวเพื่อความสะดวกในการกลับมาศึกษาต่อ</p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                  <Award size={16} />
                </div>
                <div>
                  <h5 className="font-bold text-xs text-slate-900">แบบทดสอบปัญญาธรรม</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5">ทำแบบทดสอบประเมินความเข้าใจ สะสมคะแนน XP และรับวุฒิบัตร</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
