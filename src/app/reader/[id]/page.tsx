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

  // 1. Direct ID match
  let found = allPool.find(b => b.id === trimmedRaw || b.id === decodedId);
  if (found) return found;

  // 2. Prefix variation match
  found = allPool.find(b => b.id.replace(/^book_/, '') === cleanId || b.id === `book_${cleanId}`);
  if (found) return found;

  // 3. Exact Title match
  found = allPool.find(b => b.title === decodedId || b.title === cleanId);
  if (found) return found;

  // 4. Substring Title match
  found = allPool.find(b => b.title && (b.title.includes(cleanId) || cleanId.includes(b.title)));
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
  if (modeParam === 'embed' && (book.reader_url || book.source_url || book.pdf_url)) {
    return <PubHtml5Reader book={book} hasLocalPdf={hasLocalPdf} />;
  }
  if (modeParam === 'flip' && hasLocalPdf) {
    return <PremiumBookReader book={book} initialPage={initialPage} />;
  }

  // 2. If it is a Cloud Embed / Drive / PubHTML5 book AND has no local PDF:
  // Open directly via the Cloud Embed Reader (without PDF.js) so it NEVER errors!
  if (isEmbedBook && !hasLocalPdf && (book.reader_url || book.source_url || book.pdf_url)) {
    return <PubHtml5Reader book={book} hasLocalPdf={false} />;
  }

  // 3. If book has a verified local PDF -> use realistic 3D Flipbook Reader
  if (hasLocalPdf) {
    return <PremiumBookReader book={book} initialPage={initialPage} />;
  }

  // 4. Default fallback: If any embed link exists, use Cloud Embed Reader
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
