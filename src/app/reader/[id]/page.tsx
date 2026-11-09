'use client';

import { use, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { books as mockBooks } from '@/lib/mock-data';
import { books as dbBooks } from '@/data/mockData';
import persistentBooks from '@/data/persistentBooks.json';
import PremiumBookReader from '@/components/reader/PremiumBookReader';
import PubHtml5Reader from '@/components/reader/PubHtml5Reader';
import { Loader2 } from 'lucide-react';

function resolveReaderBook(rawId: string): any {
  if (!rawId) return null;
  const decodedId = decodeURIComponent(rawId).trim();
  const trimmedRaw = rawId.trim();
  const cleanId = decodedId.replace(/^book_/, '');

  const customList = (persistentBooks as any[]) || [];
  const allPool: any[] = [...customList, ...dbBooks, ...mockBooks];

  // Helper to merge multiple matching entries so cloud URLs / PDF URLs are fully preserved
  const mergeMatches = (matches: any[]) => {
    let merged: any = {};
    for (let i = matches.length - 1; i >= 0; i--) {
      merged = { ...merged, ...matches[i] };
    }
    return merged;
  };

  // 1. Direct ID match
  const idMatches = allPool.filter(b => b.id === trimmedRaw || b.id === decodedId);
  if (idMatches.length > 0) return mergeMatches(idMatches);

  // 2. Prefix variation match
  const prefixMatches = allPool.filter(b => b.id.replace(/^book_/, '') === cleanId || b.id === `book_${cleanId}`);
  if (prefixMatches.length > 0) return mergeMatches(prefixMatches);

  // 3. Exact Title match
  const titleMatches = allPool.filter(b => b.title === decodedId || b.title === cleanId);
  if (titleMatches.length > 0) return mergeMatches(titleMatches);

  // 4. Substring Title match
  let found = allPool.find(b => b.title && (b.title.includes(cleanId) || cleanId.includes(b.title)));
  if (found) return found;

  // 5. Normalized match
  const normId = cleanId.toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
  if (normId.length >= 2) {
    found = allPool.find(b => {
      const bNorm = ((b.id || '') + ' ' + (b.title || '')).toLowerCase().replace(/[^a-z0-9\u0E00-\u0E7F]/g, '');
      return bNorm.includes(normId) || normId.includes(bNorm);
    });
    if (found) return found;
  }

  // 6. Safe fallback: first available book instead of throwing 404
  return allPool[0] || null;
}

function BookReaderContent({ bookId }: { bookId: string }) {
  const { user } = useAuth();
  const foundBook = resolveReaderBook(bookId);

  const rawCover = foundBook?.cover_image || foundBook?.cover || '';
  const secureCover = rawCover.startsWith('http://online.pubhtml5.com')
    ? rawCover.replace('http://', 'https://')
    : (rawCover || '/images/books/book-placeholder.jpg');

  const book = {
    ...foundBook,
    category_id: foundBook?.category_id || foundBook?.category_ids?.[0] || 'cat_001',
    cover: secureCover,
    pages: foundBook?.pages || foundBook?.page_count || 1,
    tags: foundBook?.tags || [],
  };

  // Record real reading session (referenced from real user/member reading)
  useEffect(() => {
    if (book?.id) {
      fetch('/api/books/reads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book.id,
          userEmail: user?.email,
          userName: user?.name,
        }),
      }).catch(() => {});
    }
  }, [book?.id, user?.email]);

  const searchParams = useSearchParams();
  const pageParam = parseInt(searchParams.get('page') || '1', 10);
  const initialPage = !isNaN(pageParam) && pageParam >= 1 ? pageParam : 1;
  const modeParam = searchParams.get('mode'); // 'flip' | 'embed'

  // Check if book has an authentic local PDF file in the repository
  const rawId = (book.id || '').toLowerCase();
  const rawTitle = (book.title || '').toLowerCase();
  const hasLocalPdf = Boolean(
    rawId.includes('tam_jai') ||
    rawId.includes('tham_jai') ||
    rawTitle.includes('ทำใจให้พร้อมบวก') ||
    rawId.includes('mongkol') ||
    rawTitle.includes('มงคลชีวิต') ||
    rawId.includes('lom_hai_jai') ||
    rawTitle.includes('ลมหายใจ') ||
    rawId.includes('khao_kor_sook') ||
    rawTitle.includes('เขาก็สุข') ||
    rawId.includes('rak_thae') ||
    rawTitle.includes('รักแท้') ||
    rawId.includes('hope_for_life') ||
    rawId.includes('kho_khit') ||
    rawTitle.includes('ข้อคิดรอบตัว') ||
    rawId.includes('the_science_of_meditation') ||
    rawTitle.includes('ศาสตร์แห่งสมาธิ') ||
    rawId.includes('phoo_soon_sia') ||
    rawTitle.includes('ผู้สูญเสีย') ||
    rawId.includes('phro_mai_roo') ||
    rawTitle.includes('เพราะไม่รู้') ||
    rawId.includes('secret_of_love') ||
    rawTitle.includes('รักลูก') ||
    rawId.includes('love_myself') ||
    rawTitle.includes('รักในตัวตน') ||
    rawId.includes('perd_promdan') ||
    rawTitle.includes('เปิดพรมแดน') ||
    rawId.includes('the_lover') ||
    rawTitle.includes('รักเป็นจะเห็นใจ') ||
    rawId.includes('yoo_nai_lok_mai') ||
    rawTitle.includes('อยู่ในโลกใหม่') ||
    rawTitle.includes('อย่ามโน') ||
    (book.pdf_url && (book.pdf_url.startsWith('/books/pdf/') || book.pdf_url.endsWith('.pdf')) && !book.pdf_url.includes('drive.google.com'))
  );

  // Check if book has an embed link (PubHTML5, Google Drive /preview, World Civ courseware, etc.)
  const isEmbedBook = Boolean(
    book.id?.startsWith('pubhtml5_') ||
    book.reader_url?.includes('pubhtml5.com') ||
    book.source_url?.includes('pubhtml5.com') ||
    book.reader_url?.includes('drive.google.com') ||
    book.source_url?.includes('drive.google.com') ||
    book.pdf_url?.includes('drive.google.com') ||
    book.reader_url?.includes('docs.google.com') ||
    book.category_id === 'cat_world_civ' ||
    (book.category_ids && book.category_ids.includes('cat_world_civ'))
  );

  // 1. Explicit mode requested via query parameter
  if (modeParam === 'flip' && hasLocalPdf) {
    return <PremiumBookReader book={book} initialPage={initialPage} />;
  }
  if (modeParam === 'embed' && (book.reader_url || book.source_url || book.pdf_url)) {
    return <PubHtml5Reader book={book} hasLocalPdf={hasLocalPdf} />;
  }

  // 2. Default: If book has ANY Cloud Embed / Google Drive / PubHTML5 link,
  // open directly in Cloud Viewer (without loading heavy PDF.js) so it NEVER errors!
  if (isEmbedBook && (book.reader_url || book.source_url || book.pdf_url)) {
    return <PubHtml5Reader book={book} hasLocalPdf={hasLocalPdf} />;
  }

  // 3. If book has a verified local PDF and no cloud link, use 3D Flipbook Reader
  if (hasLocalPdf) {
    return <PremiumBookReader book={book} initialPage={initialPage} />;
  }

  // 4. Default fallback: If any URL exists at all, try Cloud Viewer first
  if (book.reader_url || book.source_url || book.pdf_url) {
    return <PubHtml5Reader book={book} hasLocalPdf={hasLocalPdf} />;
  }

  return <PremiumBookReader book={book} initialPage={initialPage} />;
}

export default function BookReaderPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#fbf9f4] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-amber-600 animate-spin mb-3" />
          <p className="text-sm font-medium text-amber-950/70">กำลังเปิดห้องสมุดดิจิทัล...</p>
        </div>
      }
    >
      <BookReaderContent bookId={resolvedParams.id} />
    </Suspense>
  );
}
