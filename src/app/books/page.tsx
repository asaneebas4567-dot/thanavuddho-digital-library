'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, BookOpen, X, Sparkles, SlidersHorizontal, Flame, Clock, ArrowUpDown } from 'lucide-react';
import { books as libBooks, categories as libCategories } from '@/lib/mock-data';
import { books as dbBooks, categories as dbCategories } from '@/data/mockData';
import persistentBooks from '@/data/persistentBooks.json';
import BookCard from '@/components/books/BookCard';
import BookPreviewModal from '@/components/books/BookPreviewModal';
import { Book } from '@/types';

function BooksContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'title'>('popular');
  const [selectedBookForModal, setSelectedBookForModal] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [liveReadStats, setLiveReadStats] = useState<Record<string, number>>({});

  // Fetch live read stats from server
  useEffect(() => {
    fetch('/api/books/reads')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setLiveReadStats(data.stats);
        }
      })
      .catch(() => {});
  }, []);

  // Sync state if URL search params change
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat !== null) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  // Merge customBooks, libBooks and dbBooks
  const allBooks: Book[] = useMemo(() => {
    const customBooks: Book[] = (persistentBooks as any[]).map(b => {
      const rawCover = b.cover_image || b.cover || '/images/books/book-placeholder.jpg';
      const safeCover = rawCover ? encodeURI(decodeURI(rawCover)) : '/images/books/book-placeholder.jpg';
      return {
        ...b,
        cover: safeCover,
        cover_image: safeCover,
        pages: b.page_count || b.pages || 1,
        page_count: b.page_count || b.pages || 1,
        author_id: b.author_id || 'author_001',
        author: b.author || 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
        category_id: b.category_id || b.category_ids?.[0] || 'c2',
        is_copyright: true,
        copyright_status: 'approved',
        copyright_notice: 'หนังสือลิขสิทธิ์',
        status: 'published' as const,
        view_count: liveReadStats[b.id] ?? b.view_count ?? 0,
        read_count: liveReadStats[b.id] ?? b.read_count ?? 0,
        like_count: b.like_count || 0,
      };
    });

    const libIds = new Set([...libBooks.map((b) => b.id), ...customBooks.map(b => b.id)]);
    
    const normalizedDbBooks: Book[] = dbBooks
      .filter((b) => !libIds.has(b.id))
      .map((b) => {
        const rawCover = b.cover_image || '';
        const secureCover = rawCover.startsWith('http://online.pubhtml5.com')
          ? rawCover.replace('http://', 'https://')
          : rawCover;

        return {
          id: b.id,
          title: b.title,
          author_id: b.author_id,
          description: b.description || '',
          cover: secureCover || '/images/books/book-placeholder.jpg',
          cover_image: secureCover,
          category_id: b.category_ids?.[0] || 'cat_world_civ',
          category_ids: b.category_ids || ['cat_world_civ'],
          publication_year: b.publication_year || 2565,
          pages: b.page_count,
          page_count: b.page_count,
          language: b.language || 'th',
          tags: b.tags && b.tags.length > 0 ? b.tags : ['ประวัติศาสตร์', 'อารยธรรมโลก'],
          pdf_url: b.pdf_url,
          reader_url: b.reader_url,
          status: 'published' as const,
          is_copyright: b.is_copyright ?? true,
          copyright_status: b.copyright_status || 'approved',
          copyright_notice: b.copyright_notice || 'หนังสือลิขสิทธิ์',
          isbn: b.isbn,
          publisher: b.publisher,
          view_count: liveReadStats[b.id] ?? b.view_count ?? 0,
          read_count: liveReadStats[b.id] ?? b.read_count ?? 0,
          like_count: b.like_count || 0,
        };
      });

    const normalizedLibBooks: Book[] = (libBooks as Book[]).map(b => ({
      ...b,
      view_count: liveReadStats[b.id] ?? b.view_count ?? 0,
      read_count: liveReadStats[b.id] ?? b.read_count ?? 0,
    }));

    return [...customBooks, ...normalizedLibBooks, ...normalizedDbBooks];
  }, [liveReadStats]);

  // Merge categories list for filter pills
  const allCategories = useMemo(() => {
    const list: { id: string; name: string }[] = [...libCategories];
    
    dbCategories.forEach((dbCat) => {
      if (!list.some((c) => c.id === dbCat.id)) {
        list.push({ id: dbCat.id, name: dbCat.name });
      }
    });

    return list;
  }, []);

  // Filter & Sort books
  const filteredBooks = useMemo(() => {
    let result = allBooks.filter((book) => {
      const matchSearch =
        searchQuery.trim() === '' ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (book.tags && book.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchCategory =
        selectedCategory === '' ||
        book.category_id === selectedCategory ||
        book.category_ids?.includes(selectedCategory);

      return matchSearch && matchCategory;
    });

    if (sortBy === 'popular') {
      result.sort((a, b) => ((b.read_count ?? b.view_count ?? 0) - (a.read_count ?? a.view_count ?? 0)));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.publication_year ?? 0) - (a.publication_year ?? 0));
    } else if (sortBy === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title, 'th'));
    }

    return result;
  }, [allBooks, searchQuery, selectedCategory, sortBy]);

  const currentCategoryName = allCategories.find((c) => c.id === selectedCategory)?.name;

  const handleOpenModal = (book: Book) => {
    setSelectedBookForModal(book);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-[#fbfbfa] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200/60 inline-flex items-center gap-1.5 mb-2">
                <Sparkles size={13} className="text-amber-600" />
                คลังหนังสือธรรมะและวิชาการ
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                ห้องสมุดดิจิทัล (Digital Library)
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                รวมหนังสือธรรมะ ประวัติศาสตร์ และการพัฒนาตนเอง รวม {allBooks.length} เล่ม
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="flex items-center gap-3 text-xs text-gray-500 font-semibold bg-white px-4 py-2 rounded-2xl border border-gray-200/80 shadow-xs">
              <span>กำลังแสดง: <strong className="text-amber-700">{filteredBooks.length}</strong> เล่ม</span>
              <span>•</span>
              <span>อ่านฟรีทุกอุปกรณ์</span>
            </div>
          </div>
        </div>

        {/* Webtoon-Style Category Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 mb-6 border-b border-gray-200/60">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === ''
                ? 'bg-gray-900 text-white shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
            }`}
          >
            🌟 ทั้งหมด ({allBooks.length})
          </button>

          {allCategories.map((cat) => {
            const count = allBooks.filter(
              (b) => b.category_id === cat.id || b.category_ids?.includes(cat.id)
            ).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.id)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200/80'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Sort Controls Bar */}
        <div className="bg-white p-3.5 sm:p-4 rounded-2xl shadow-xs border border-gray-200/70 flex flex-col md:flex-row gap-3 mb-8">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อเรื่อง, ผู้แต่ง, หรือคำค้น..."
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 text-sm text-gray-800 placeholder-gray-400 font-medium transition-all"
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={17} />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Sort Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">จัดเรียง:</span>
            
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                sortBy === 'popular'
                  ? 'bg-amber-100/70 text-amber-900 border border-amber-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Flame size={13} className={sortBy === 'popular' ? 'text-amber-700' : 'text-gray-400'} />
              <span>ยอดนิยม</span>
            </button>

            <button
              onClick={() => setSortBy('newest')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                sortBy === 'newest'
                  ? 'bg-amber-100/70 text-amber-900 border border-amber-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <Clock size={13} className={sortBy === 'newest' ? 'text-amber-700' : 'text-gray-400'} />
              <span>พิมพ์ใหม่</span>
            </button>

            <button
              onClick={() => setSortBy('title')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                sortBy === 'title'
                  ? 'bg-amber-100/70 text-amber-900 border border-amber-200'
                  : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200/60'
              }`}
            >
              <ArrowUpDown size={13} className={sortBy === 'title' ? 'text-amber-700' : 'text-gray-400'} />
              <span>ชื่อ ก-ฮ</span>
            </button>
          </div>
        </div>

        {/* Books Grid */}
        {filteredBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
            {filteredBooks.map((book) => (
              <BookCard 
                key={book.id} 
                book={book} 
                onQuickView={handleOpenModal}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-200/80 p-8 shadow-xs">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">ไม่พบหนังสือที่ตรงกับเงื่อนไข</h3>
            <p className="text-gray-500 text-xs sm:text-sm mb-5">ลองเปลี่ยนคำค้นหา หรือล้างตัวกรองหมวดหมู่</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
              }}
              className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl text-xs transition-colors shadow-xs"
            >
              แสดงหนังสือทั้งหมด
            </button>
          </div>
        )}

      </div>

      {/* Webtoon Preview Modal */}
      <BookPreviewModal
        book={selectedBookForModal}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBookForModal(null);
        }}
      />

    </div>
  );
}

export default function BooksPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#fbfbfa] py-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
        </div>
      }
    >
      <BooksContent />
    </Suspense>
  );
}
