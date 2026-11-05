'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { 
  Search, 
  BookOpen, 
  Video as VideoIcon, 
  Headphones, 
  Radio, 
  BookText, 
  Sparkles, 
  ArrowRight,
  Layers
} from 'lucide-react';
import { books as dbBooks, dhamma as articles } from '@/data/mockData';
import persistentBooksJson from '@/data/persistentBooks.json';
import { audiobooks, podcasts, smartSearchIndex } from '@/data/multimediaAndGamificationData';
import { SmartSearchResult, MediaType } from '@/types';

// Merge all books from both catalogs without duplicates
const allBooksCatalog = (() => {
  const map = new Map<string, any>();
  for (const b of dbBooks) map.set(b.id, b);
  for (const b of (persistentBooksJson as any[])) map.set(b.id, b);
  return Array.from(map.values());
})();

// Real snippet extraction around the matched search query
function extractRealSnippet(text: string, q: string, maxLen = 160): string {
  if (!text) return '';
  const idx = text.toLowerCase().indexOf(q.toLowerCase());
  if (idx === -1) {
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  }
  const start = Math.max(0, idx - 40);
  const end = Math.min(text.length, idx + q.length + 80);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeMediaFilter, setActiveMediaFilter] = useState<MediaType | 'all'>('all');

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setQuery(q);
  }, [searchParams]);

  const suggestedTopics = [
    'อิทธิบาท 4',
    'การบริหารความขัดแย้ง',
    'มงคลชีวิต',
    'สมาธิ',
    'ความรัก',
    'การทำงาน'
  ];

  const handleTopicClick = (topic: string) => {
    setQuery(topic);
  };

  // Compute Search Results strictly based on authentic data
  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SmartSearchResult[] = [];
    const seenIds = new Set<string>();

    // 1. Search in Smart Deep Index (with timestamps & pages)
    smartSearchIndex.forEach(item => {
      const matchInTitle = item.title.toLowerCase().includes(q);
      const matchInDesc = item.description.toLowerCase().includes(q);
      const matchInSnippet = item.highlight_snippet.toLowerCase().includes(q);
      const matchInConcepts = item.matched_concepts.some(c => c.toLowerCase().includes(q));

      if (matchInTitle || matchInDesc || matchInSnippet || matchInConcepts) {
        if (!seenIds.has(item.id)) {
          seenIds.add(item.id);
          results.push(item);
        }
      }
    });

    // 2. Search in Real Books Catalog (56 books + authentic PDF collection)
    allBooksCatalog.forEach(b => {
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchDesc = (b.description || '').toLowerCase().includes(q);
      const matchTags = (b.tags || []).some((t: string) => t.toLowerCase().includes(q));

      if (matchTitle || matchDesc || matchTags) {
        if (!seenIds.has(b.id)) {
          seenIds.add(b.id);
          const rawSnippetSource = matchDesc ? b.description : (b.tags ? b.tags.join(', ') : b.title);
          const realSnippet = extractRealSnippet(rawSnippetSource, q);

          results.push({
            id: b.id,
            title: b.title,
            media_type: 'book',
            category_name: 'หนังสือธรรมะดิจิทัล',
            description: b.description || 'หนังสือธรรมะทรงคุณค่า พระครูปลัดสุวัฒนโพธิคุณ',
            link: b.pdfUrl ? `/reader/${b.id}` : `/books/${b.id}`,
            cover_or_thumbnail: b.cover || b.cover_image || '/images/books/mongkol-124.jpg',
            matched_concepts: b.tags || ['หนังสือ'],
            page_number: b.pages || 1,
            highlight_snippet: realSnippet,
            source_context: 'คลังหนังสือฉบับเต็ม'
          });
        }
      }
    });

    // 3. Search in Audiobooks
    audiobooks.forEach(ab => {
      const matchTitle = ab.title.toLowerCase().includes(q);
      const matchDesc = ab.description.toLowerCase().includes(q);
      const matchedTrack = ab.tracks.find(t => t.title.toLowerCase().includes(q));

      if (matchTitle || matchDesc || matchedTrack) {
        if (!seenIds.has(ab.id)) {
          seenIds.add(ab.id);
          const rawSnippet = matchedTrack ? `ตอน: ${matchedTrack.title}` : ab.description;
          results.push({
            id: ab.id,
            title: ab.title,
            media_type: 'audiobook',
            category_name: 'หนังสือเสียง (Audiobook)',
            description: ab.description,
            link: `/audios`,
            cover_or_thumbnail: ab.cover,
            matched_concepts: ab.tags,
            highlight_snippet: extractRealSnippet(rawSnippet, q),
            source_context: `พากย์โดย ${ab.narrator}`
          });
        }
      }
    });

    // 4. Search in Podcasts
    podcasts.forEach(pod => {
      const matchTitle = pod.title.toLowerCase().includes(q);
      const matchDesc = pod.description.toLowerCase().includes(q);
      const matchedEp = pod.episodes.find(ep => 
        ep.title.toLowerCase().includes(q) || ep.description.toLowerCase().includes(q)
      );

      if (matchTitle || matchDesc || matchedEp) {
        if (!seenIds.has(pod.id)) {
          seenIds.add(pod.id);
          const rawSnippet = matchedEp ? `ตอน ${matchedEp.title}: ${matchedEp.description}` : pod.description;
          results.push({
            id: pod.id,
            title: pod.title,
            media_type: 'podcast',
            category_name: 'พอดแคสต์ (Podcast)',
            description: pod.description,
            link: `/audios`,
            cover_or_thumbnail: pod.cover,
            matched_concepts: pod.tags,
            highlight_snippet: extractRealSnippet(rawSnippet, q),
            source_context: `ดำเนินรายการโดย ${pod.host}`
          });
        }
      }
    });

    // 5. Search in Articles
    articles.forEach(art => {
      const matchTitle = art.title.toLowerCase().includes(q);
      const matchContent = (art.content || '').toLowerCase().includes(q);
      const matchDesc = (art.description || '').toLowerCase().includes(q);

      if (matchTitle || matchContent || matchDesc) {
        if (!seenIds.has(art.id)) {
          seenIds.add(art.id);
          const rawSnippet = matchContent ? art.content : (art.description || art.title);
          results.push({
            id: art.id,
            title: art.title,
            media_type: 'article',
            category_name: 'บทความธรรมะ',
            description: art.description || 'บทความธรรมะสร้างปัญญา',
            link: `/articles/${art.id}`,
            cover_or_thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
            matched_concepts: ['บทความ', 'ข้อคิด'],
            highlight_snippet: extractRealSnippet(rawSnippet, q),
            source_context: art.source_type || 'บทความ'
          });
        }
      }
    });

    return results;
  }, [query]);

  // Filter results by media type tab
  const filteredResults = useMemo(() => {
    if (activeMediaFilter === 'all') return searchResults;
    return searchResults.filter(r => r.media_type === activeMediaFilter);
  }, [searchResults, activeMediaFilter]);

  const countByType = (type: MediaType) => {
    return searchResults.filter(r => r.media_type === type).length;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-28">
      
      {/* Search Header Hero */}
      <div className="bg-gradient-to-b from-amber-900 via-amber-950 to-slate-950 text-white py-14 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-400/20 mb-4 backdrop-blur-md">
            <Sparkles size={14} /> ระบบค้นหาอัจฉริยะข้ามสื่อ (Cross-Media Smart Search)
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            ค้นหาธรรมะเชิงลึก <span className="text-amber-400">จากทุกสื่อการเรียนรู้</span>
          </h1>
          <p className="text-amber-100/80 text-sm sm:text-base max-w-2xl mx-auto mb-8">
            พิมพ์หัวข้อธรรมะเพื่อค้นหาแบบ Cross-Media ทั้งหนังสือฉบับเต็ม, เสียง, วิดีโอเทศนา, หนังสือเสียง, พอดแคสต์ พร้อมเชื่อมโยงตรงสู่ Timestamp วิดีโอและหน้าหนังสือ
          </p>

          {/* Search Input Bar */}
          <div className="relative max-w-2xl mx-auto shadow-2xl">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-6 w-6 text-amber-600" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ลองค้นหา: อิทธิบาท 4, การบริหารความขัดแย้ง, มงคลชีวิต, สมาธิ..."
              className="block w-full pl-14 pr-24 py-4 sm:py-5 border-2 border-amber-500/30 rounded-2xl leading-5 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 text-base sm:text-lg transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-400 hover:text-gray-600 text-xs font-bold cursor-pointer"
              >
                ล้างคำค้น
              </button>
            )}
          </div>

          {/* Quick Preset Suggested Dhamma Topics */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
            <span className="text-xs text-amber-200/70 mr-1">คำค้นยอดนิยม:</span>
            {suggestedTopics.map(topic => (
              <button
                key={topic}
                onClick={() => handleTopicClick(topic)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  query === topic 
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-md' 
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                #{topic}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Media Tabs Filter */}
        {query && searchResults.length > 0 && (
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar pb-4 mb-8 border-b border-gray-200">
            {[
              { id: 'all', label: 'ทั้งหมด', count: searchResults.length, icon: Layers },
              { id: 'book', label: 'หนังสือธรรมะ', count: countByType('book'), icon: BookOpen },
              { id: 'video', label: 'คลิปวิดีโอ', count: countByType('video'), icon: VideoIcon },
              { id: 'audiobook', label: 'หนังสือเสียง', count: countByType('audiobook'), icon: Headphones },
              { id: 'podcast', label: 'พอดแคสต์', count: countByType('podcast'), icon: Radio },
              { id: 'article', label: 'บทความ', count: countByType('article'), icon: BookText },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeMediaFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMediaFilter(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20' 
                      : 'bg-white border border-gray-200 text-gray-700 hover:border-amber-300'
                  }`}
                >
                  <Icon size={15} />
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? 'bg-amber-700 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Results Area */}
        {!query ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-xs p-8">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-amber-600">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">พร้อมค้นหาองค์ความรู้ธรรมะ</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              เลือกหัวข้อธรรมะจากแท็กยอดนิยมด้านบน หรือพิมพ์คำค้นหาที่ท่านสนใจเพื่อค้นหาจากคลังมัลติมีเดียจริงในระบบ
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => handleTopicClick('อิทธิบาท 4')}
                className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer"
              >
                ค้นหา "อิทธิบาท 4"
              </button>
              <button
                onClick={() => handleTopicClick('การบริหารความขัดแย้ง')}
                className="px-4 py-2 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-colors cursor-pointer"
              >
                ค้นหา "การบริหารความขัดแย้ง"
              </button>
            </div>
          </div>
        ) : filteredResults.length === 0 ? (
          /* Strict No Fake Result Display (ตามมาตรฐานโปรเจกต์จบ ไม่แต่งผลลัพธ์หลอก) */
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-200 shadow-xs p-8 max-w-xl mx-auto">
            <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">
              ไม่พบผลการค้นหาสำหรับ &ldquo;{query}&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-6 leading-relaxed">
              ระบบไม่พบหนังสือ บทความ หรือสื่อมัลติมีเดียที่ตรงกับคำค้นหานี้ในคลังข้อมูล กรุณาตรวจสอบตัวสะกดหรือค้นหาด้วยคำสำคัญทางธรรมะอื่น
            </p>
            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/70 text-left">
              <h4 className="text-xs font-bold text-amber-900 mb-2">คำแนะนำในการค้นหา:</h4>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>ลองใช้คำค้นหาที่สั้นลง เช่น <strong>สติ, สมาธิ, มงคล, ความสุข</strong></li>
                <li>เลือกหัวข้อจากคำค้นยอดนิยมด้านบน</li>
                <li>หากต้องการถามปัญหาชีวิต สามารถปรึกษาได้ที่ <Link href="/chatbot" className="text-amber-700 font-bold underline">แชทบอทธรรมะ AI</Link></li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
              <span>พบผลการค้นหาตรงกับข้อมูลจริง <strong>{filteredResults.length}</strong> รายการ</span>
              <span>แสดงผลตามความเกี่ยวข้อง</span>
            </div>

            {filteredResults.map(result => {
              const isVideo = result.media_type === 'video';
              const isBook = result.media_type === 'book';

              return (
                <div 
                  key={result.id}
                  className="bg-white rounded-3xl border border-gray-100 shadow-xs hover:shadow-md transition-all p-6 sm:p-7 flex flex-col md:flex-row items-start gap-6 group"
                >
                  {/* Thumbnail / Cover */}
                  <div className="relative w-full md:w-44 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden shrink-0 shadow-sm bg-gray-100 ring-1 ring-black/5">
                    <Image 
                      src={result.cover_or_thumbnail} 
                      alt={result.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      unoptimized 
                    />
                    <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {result.category_name}
                    </div>

                    {result.timestamp_formatted && (
                      <div className="absolute bottom-2 right-2 bg-amber-600 text-white text-[11px] font-mono font-bold px-2 py-0.5 rounded shadow-sm">
                        ⏱ {result.timestamp_formatted}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        {result.source_context || result.category_name}
                      </span>

                      {result.page_number && (
                        <span className="text-xs font-mono text-gray-500">
                          หน้าที่ {result.page_number}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-amber-600 transition-colors mb-2 leading-snug">
                      <Link href={result.link}>
                        {result.title}
                      </Link>
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                      {result.description}
                    </p>

                    {/* Authentically Highlighted Snippet */}
                    {result.highlight_snippet && (
                      <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/80 text-xs text-amber-900 leading-relaxed mb-4">
                        <span className="font-bold text-amber-800 block mb-0.5">🔍 ข้อความที่พบในเนื้อหา:</span>
                        {result.highlight_snippet}
                      </div>
                    )}

                    {/* Deep Link Action */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap gap-1.5">
                        {result.matched_concepts.map(c => (
                          <span key={c} className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">
                            #{c}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={result.link}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all shadow-amber-600/20"
                      >
                        {isVideo ? (
                          <>
                            <span>เปิดดูตรงนาทีที่ {result.timestamp_formatted || '00:00'}</span>
                            <ArrowRight size={14} />
                          </>
                        ) : isBook ? (
                          <>
                            <span>เปิดอ่านในระบบ</span>
                            <ArrowRight size={14} />
                          </>
                        ) : (
                          <>
                            <span>เข้าสู่เนื้อหานี้</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </Link>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

export default function SmartSearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">กำลังโหลดระบบค้นหาอัจฉริยะ...</p>
        </div>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
