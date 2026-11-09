'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  BookOpen, 
  Eye, 
  Sparkles, 
  Shuffle, 
  ArrowRight,
  ExternalLink,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { books, categories } from '@/lib/mock-data';
import persistentBooks from '@/data/persistentBooks.json';
import BookCard from '@/components/books/BookCard';

export default function PdfBooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [randomPicks, setRandomPicks] = useState<any[]>([]);

  // Filter all books that have PDF access, including persistent uploaded books
  const allPdfBooks = useMemo(() => {
    const customPdfBooks: any[] = (persistentBooks as any[]).map(b => ({
      ...b,
      cover: b.cover_image || b.cover || '/images/books/book-placeholder.jpg',
      pages: b.page_count || b.pages || 1,
      author: b.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
      category_id: b.category_id || b.category_ids?.[0] || 'c2',
      is_copyright: true,
      copyright_status: 'approved',
      copyright_notice: 'หนังสือลิขสิทธิ์',
      status: 'published' as const,
      view_count: b.view_count || 1200,
      read_count: b.read_count || 650,
      like_count: 320,
    }));

    const existingIds = new Set(customPdfBooks.map(b => b.id));
    const libPdfBooks = books.filter((b) => Boolean(b.pdf_url) && !existingIds.has(b.id));

    return [...customPdfBooks, ...libPdfBooks];
  }, []);

  // Pick 3 random recommended PDF books
  const refreshRandomPicks = () => {
    if (allPdfBooks.length === 0) return;
    const shuffled = [...allPdfBooks].sort(() => 0.5 - Math.random());
    setRandomPicks(shuffled.slice(0, 3));
  };

  useEffect(() => {
    refreshRandomPicks();
  }, [allPdfBooks]);

  // Filtered books based on search & category
  const filteredBooks = useMemo(() => {
    return allPdfBooks.filter((book) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.tags && book.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCategory =
        selectedCategory === '' || book.category_id === selectedCategory;

      return matchSearch && matchCategory;
    });
  }, [allPdfBooks, searchQuery, selectedCategory]);

  return (
    <div className="bg-[#F0F8FD]/40 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Banner Header (Deep Navy to Primary Blue) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#073B65] via-[#0B4E85] to-[#079FE8] text-white p-8 md:p-12 mb-10 shadow-xl shadow-sky-950/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold mb-4 border border-white/30">
              <FileText size={15} className="text-sky-200" />
              <span>คลังเอกสาร & หนังสือ PDF ออนไลน์</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4 drop-shadow">
              ศูนย์รวมหนังสือ PDF ธรรมะ
            </h1>
            
            <p className="text-white/90 text-base sm:text-lg leading-relaxed mb-6 font-medium">
              รวบรวมหนังสือธรรมะคำสอนฉบับ PDF ครบถ้วน รองรับการเปิดอ่านบนเว็บแบบเต็มเล่ม หรือเปิดอ่านผ่าน Google Drive พร้อมใช้งานทั้งบนมือถือและคอมพิวเตอร์
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-white/90">
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <Layers size={16} className="text-sky-300" /> หนังสือทั้งหมด {allPdfBooks.length} เล่ม
              </span>
              <span className="flex items-center gap-1.5 bg-black/20 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                <CheckCircle2 size={16} className="text-emerald-300" /> หนังสือลิขสิทธิ์ถูกต้อง
              </span>
            </div>
          </div>
        </div>

        {/* 3-Slot Recommended Section (สุ่ม 3 เล่มเด่น) */}
        <section className="mb-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#DCEAF3] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#DCEAF3]">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-[#F0F8FD] text-[#079FE8] flex items-center justify-center">
                  <Sparkles size={18} />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#073B65]">
                  หนังสือแนะนำ (สุ่ม 3 เล่มเด่น)
                </h2>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                สุ่มแนะนำจากหนังสือ PDF ในคลัง เพื่อให้คุณค้นพบธรรมะเล่มใหม่ๆ ได้ทุกครั้ง
              </p>
            </div>

            <button
              onClick={refreshRandomPicks}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-xl transition-all self-start sm:self-auto cursor-pointer border border-sky-200/60 active:scale-95"
            >
              <Shuffle size={16} />
              <span>สุ่มเล่มใหม่</span>
            </button>
          </div>

          {/* 3 Featured Recommendation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {randomPicks.map((book, index) => (
              <div 
                key={`${book.id}-${index}`}
                className="group relative bg-gradient-to-br from-white to-sky-50/40 rounded-2xl p-5 border border-sky-100/80 shadow-sm hover:shadow-lg hover:border-sky-300 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex gap-4 items-start mb-4">
                  <div className="relative w-20 h-28 shrink-0 rounded-md overflow-hidden shadow-md border-l-4 border-sky-700 bg-gray-100">
                    {book.cover && book.cover !== '/images/books/book-placeholder.jpg' ? (
                      <img 
                        src={book.cover} 
                        alt={book.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-sky-900 text-white p-2 flex flex-col justify-between text-center">
                        <span className="text-[8px] text-sky-300">PDF</span>
                        <span className="text-[10px] font-bold line-clamp-3 leading-tight">{book.title}</span>
                        <span className="text-[7px] text-sky-200">พระอาจารย์</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="inline-block bg-sky-100 text-sky-800 text-[10px] font-bold px-2 py-0.5 rounded-full mb-1">
                      แนะนำลำดับที่ {index + 1}
                    </span>
                    <h3 className="font-bold text-gray-900 text-base line-clamp-2 group-hover:text-sky-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {book.description}
                    </p>
                    <div className="text-xs text-gray-500 mt-2 font-medium">
                      📖 {book.pages || 0} หน้า
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-sky-100/60 flex items-center justify-between gap-2 mt-auto">
                  <Link
                    href={`/reader/${book.id}?from=/pdf-books`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 group-hover:text-sky-700 group-hover:translate-x-1 transition-all"
                  >
                    <span>เปิดอ่าน PDF</span>
                    <ArrowRight size={14} />
                  </Link>

                  <Link
                    href={`/books/${book.id}`}
                    className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    รายละเอียด
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Search & Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อหนังสือ PDF, คำสำคัญ, หรือเนื้อหา..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 text-gray-800 placeholder-gray-400"
            />
            <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
          </div>

          <div className="flex gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white min-w-[170px] text-gray-700"
            >
              <option value="">ทุกหมวดหมู่ ({categories.length})</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {(searchQuery || selectedCategory) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('');
                }}
                className="px-4 py-3 text-sm font-medium text-sky-600 hover:text-sky-700 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer"
              >
                ล้างตัวกรอง
              </button>
            )}
          </div>
        </div>

        {/* Header Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-medium text-gray-600">
            แสดงผลลัพธ์หนังสือ PDF: <span className="font-bold text-gray-900">{filteredBooks.length}</span> เล่ม
          </p>
        </div>

        {/* PDF Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">ไม่พบหนังสือ PDF ที่ตรงกับเงื่อนไข</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-md mx-auto">
              ลองพิมพ์ค้นหาด้วยคำอื่น หรือกดปุ่มด้านล่างเพื่อแสดงหนังสือ PDF ทั้งหมด
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-sky-600/20"
            >
              ดูหนังสือ PDF ทั้งหมด ({allPdfBooks.length} เล่ม)
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
