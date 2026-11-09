/**
 * ระบบสืบค้นคลังความรู้ภายในเว็บไซต์ (Internal Knowledge Search Engine)
 * ค้นหาลึกถึงเนื้อหาจริงในหน้าหนังสือ (Full-Text Page Content), บทความ, เสียง, วิดีโอ และคำสำคัญ
 */

import { bookPagesContentDatabase, BookPageData } from '@/data/bookPagesContent';
import { books as dbBooks, dhamma as dbArticles, videos as dbVideos, audios as dbAudios } from '@/data/mockData';
import persistentBooksJson from '@/data/persistentBooks.json';
import { smartSearchIndex } from '@/data/multimediaAndGamificationData';
import { tokenizeThai, normalizeThaiText, expandKeywordsWithSynonyms } from './thaiTokenizer';

export interface InternalKnowledgeItem {
  id: string;
  title: string;
  sourceType: 'book_page' | 'book' | 'article' | 'video' | 'audio' | 'smart_index';
  bookId?: string;
  bookTitle?: string;
  pageNumber?: number;
  chapterTitle?: string;
  sectionTitle?: string;
  paliVerse?: string;
  paliMeaning?: string;
  highlightSnippet: string;
  fullExcerpt: string;
  link: string;
  cover?: string;
  actionText: string;
  score: number;
  isDirectEvidence: boolean;
}

export interface InternalSearchOutput {
  results: InternalKnowledgeItem[];
  hasDirectEvidence: boolean;
  topEvidenceSnippet?: string;
  primaryCitation?: InternalKnowledgeItem;
}

// รวมหนังสือทั้งหมด (56 เล่มเดิม + 14 เล่มลิขสิทธิ์)
const allMergedBooks = (() => {
  const map = new Map<string, any>();
  for (const b of dbBooks) map.set(b.id, b);
  for (const b of (persistentBooksJson as any[])) map.set(b.id, b);
  return Array.from(map.values());
})();

/**
 * ตัด Snippet ข้อความรอบๆ คำสำคัญที่พบ
 */
function extractSnippetAround(text: string, tokens: string[], maxLen = 180): string {
  if (!text) return '';
  const norm = text.toLowerCase();
  let bestIdx = -1;

  for (const t of tokens) {
    const idx = norm.indexOf(t.toLowerCase());
    if (idx !== -1) {
      bestIdx = idx;
      break;
    }
  }

  if (bestIdx === -1) {
    return text.length > maxLen ? text.slice(0, maxLen) + '...' : text;
  }

  const start = Math.max(0, bestIdx - 40);
  const end = Math.min(text.length, bestIdx + maxLen - 40);
  let snippet = text.slice(start, end).trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

/**
 * ฟังก์ชันหลักในการค้นหาเนื้อหาภายในเว็บไซต์ (Tier 1: Internal Knowledge)
 */
export function searchInternalKnowledge(query: string, maxResults = 6): InternalSearchOutput {
  const normQ = normalizeThaiText(query);
  if (!normQ) {
    return { results: [], hasDirectEvidence: false };
  }

  const tokens = tokenizeThai(normQ);
  if (tokens.length === 0) {
    return { results: [], hasDirectEvidence: false };
  }
  const expandedTokens = expandKeywordsWithSynonyms(tokens);
  const candidates: InternalKnowledgeItem[] = [];
  const seenKeys = new Set<string>();

  // ========================================================
  // 1. ค้นหาในเนื้อหารายหน้าของหนังสือ (Book Pages Full-Text) - ความสำคัญสูงสุด
  // ========================================================
  for (const [bookId, pages] of Object.entries(bookPagesContentDatabase)) {
    const parentBook = allMergedBooks.find(b => b.id === bookId);
    const bookTitle = parentBook ? parentBook.title : 'มงคลชีวิต 38 ประการ';

    for (const [pageNumStr, pageData] of Object.entries(pages as Record<number, BookPageData>)) {
      const pageNum = parseInt(pageNumStr, 10);
      let pageScore = 0;
      let matchedPassages: string[] = [];

      const fullPageText = [
        pageData.chapterTitle,
        pageData.sectionTitle,
        pageData.paliMeaning || '',
        ...(pageData.contentParagraphs || []),
        ...(pageData.keyTakeaways || [])
      ].join(' ');

      const normPageText = normalizeThaiText(fullPageText);

      // ตรวจสอบความตรงตัวของวลีเต็ม
      if (normPageText.includes(normQ)) {
        pageScore += 60;
      }

      // ตรวจสอบคำจาก Tokenizer
      for (const t of expandedTokens) {
        if (normPageText.includes(t)) {
          pageScore += 12;
          // เก็บบทความที่พบ
          for (const p of pageData.contentParagraphs) {
            if (p.toLowerCase().includes(t) && !matchedPassages.includes(p)) {
              matchedPassages.push(p);
            }
          }
        }
      }

      // ตรวจสอบชื่อบทและหัวข้อ
      if (pageData.chapterTitle && normQ.split(' ').some(w => pageData.chapterTitle.includes(w))) {
        pageScore += 25;
      }
      if (pageData.sectionTitle && normQ.split(' ').some(w => pageData.sectionTitle.includes(w))) {
        pageScore += 30;
      }

      if (pageScore >= 20) {
        const itemKey = `page_${bookId}_${pageNum}`;
        if (!seenKeys.has(itemKey)) {
          seenKeys.add(itemKey);
          const excerpt = matchedPassages.length > 0 ? matchedPassages.join('\n\n') : pageData.contentParagraphs[0] || '';
          candidates.push({
            id: itemKey,
            title: `${bookTitle} — ${pageData.sectionTitle || pageData.chapterTitle} (หน้า ${pageNum})`,
            sourceType: 'book_page',
            bookId,
            bookTitle,
            pageNumber: pageNum,
            chapterTitle: pageData.chapterTitle,
            sectionTitle: pageData.sectionTitle,
            paliVerse: pageData.paliVerse,
            paliMeaning: pageData.paliMeaning,
            highlightSnippet: extractSnippetAround(excerpt, tokens, 160),
            fullExcerpt: excerpt,
            link: `/reader/${bookId}?page=${pageNum}`,
            cover: parentBook?.cover_image || parentBook?.cover,
            actionText: `เปิดอ่านหน้า ${pageNum}`,
            score: pageScore,
            isDirectEvidence: pageScore >= 35
          });
        }
      }
    }
  }

  // ========================================================
  // 2. ค้นหาใน Smart Search Index (ดัชนีพร้อมบริบทและคำสำคัญเฉพาะจุด)
  // ========================================================
  for (const item of smartSearchIndex) {
    let score = 0;
    const titleNorm = normalizeThaiText(item.title);
    const descNorm = normalizeThaiText(item.description);
    const snippetNorm = normalizeThaiText(item.highlight_snippet);
    const concepts = (item.matched_concepts || []).map(c => normalizeThaiText(c));

    if (titleNorm.includes(normQ)) score += 45;
    if (snippetNorm.includes(normQ)) score += 40;
    if (concepts.some(c => c.includes(normQ) || normQ.includes(c))) score += 35;

    for (const t of expandedTokens) {
      if (titleNorm.includes(t)) score += 10;
      if (concepts.some(c => c.includes(t))) score += 8;
      if (descNorm.includes(t)) score += 5;
      if (snippetNorm.includes(t)) score += 7;
    }

    if (score >= 20 && !seenKeys.has(item.id)) {
      seenKeys.add(item.id);
      candidates.push({
        id: item.id,
        title: item.title,
        sourceType: 'smart_index',
        highlightSnippet: item.highlight_snippet,
        fullExcerpt: `${item.description}\n\nข้อความสำคัญ: ${item.highlight_snippet}`,
        link: item.link,
        cover: item.cover_or_thumbnail,
        actionText: item.media_type === 'book' ? 'เปิดอ่านเล่มนี้' :
                    item.media_type === 'video' ? 'ชมคลิปวิดีโอ' : 'รับฟังเสียงบรรยาย',
        score,
        isDirectEvidence: score >= 35
      });
    }
  }

  // ========================================================
  // 3. ค้นหาในบทความธรรมะ (Dhamma Articles)
  // ========================================================
  for (const art of dbArticles) {
    let score = 0;
    const titleNorm = normalizeThaiText(art.title);
    const descNorm = normalizeThaiText(art.description || '');
    const contentNorm = normalizeThaiText(art.content || '');

    if (titleNorm.includes(normQ)) score += 40;
    if (contentNorm.includes(normQ)) score += 30;

    for (const t of expandedTokens) {
      if (titleNorm.includes(t)) score += 10;
      if (descNorm.includes(t)) score += 5;
      if (contentNorm.includes(t)) score += 4;
    }

    if (score >= 20 && !seenKeys.has(art.id)) {
      seenKeys.add(art.id);
      candidates.push({
        id: art.id,
        title: `ข้อคิดธรรมะ: ${art.title}`,
        sourceType: 'article',
        highlightSnippet: extractSnippetAround(art.content || art.description || '', tokens, 160),
        fullExcerpt: art.content,
        link: `/articles/${art.id}`,
        actionText: 'อ่านข้อคิดธรรมะฉบับเต็ม',
        score,
        isDirectEvidence: score >= 35
      });
    }
  }

  // ========================================================
  // 4. ค้นหาในรายการหนังสือทั้งหมด (Books Catalog 56+ เล่ม)
  // ========================================================
  for (const book of allMergedBooks) {
    let score = 0;
    const titleNorm = normalizeThaiText(book.title);
    const descNorm = normalizeThaiText(book.description || '');
    const tags: string[] = (book.tags || []).map((t: string) => normalizeThaiText(t));

    if (titleNorm.includes(normQ)) score += 50;
    if (tags.some((t: string) => t.includes(normQ) || normQ.includes(t))) score += 30;

    for (const t of expandedTokens) {
      if (titleNorm.includes(t)) score += 12;
      if (tags.some((tag: string) => tag.includes(t))) score += 8;
      if (descNorm.includes(t)) score += 4;
    }

    if (score >= 20 && !seenKeys.has(book.id)) {
      seenKeys.add(book.id);
      candidates.push({
        id: book.id,
        title: `หนังสือ: ${book.title}`,
        sourceType: 'book',
        bookId: book.id,
        bookTitle: book.title,
        highlightSnippet: extractSnippetAround(book.description || `หนังสือ ${book.page_count || book.pages || ''} หน้า โดย พระครูปลัดสุวัฒนโพธิคุณ`, tokens, 150),
        fullExcerpt: book.description || '',
        link: `/reader/${book.id}`,
        cover: book.cover_image || book.cover,
        actionText: 'เปิดอ่านออนไลน์ในระบบ',
        score,
        isDirectEvidence: score >= 45
      });
    }
  }

  // ========================================================
  // 5. ค้นหาในวิดีโอและเสียงบรรยาย (Videos & Audios)
  // ========================================================
  for (const vid of dbVideos) {
    let score = 0;
    const titleNorm = normalizeThaiText(vid.title);
    const descNorm = normalizeThaiText(vid.description);
    if (titleNorm.includes(normQ)) score += 35;
    for (const t of expandedTokens) {
      if (titleNorm.includes(t)) score += 8;
      if (descNorm.includes(t)) score += 4;
    }
    if (score >= 20 && !seenKeys.has(vid.id)) {
      seenKeys.add(vid.id);
      candidates.push({
        id: vid.id,
        title: `วิดีโอ: ${vid.title}`,
        sourceType: 'video',
        highlightSnippet: extractSnippetAround(vid.description, tokens, 150),
        fullExcerpt: vid.description,
        link: `/videos?id=${vid.id}`,
        cover: vid.thumbnail,
        actionText: 'รับชมวิดีโอเทศนา',
        score,
        isDirectEvidence: score >= 35
      });
    }
  }

  for (const aud of dbAudios) {
    let score = 0;
    const titleNorm = normalizeThaiText(aud.title);
    const descNorm = normalizeThaiText(aud.description);
    if (titleNorm.includes(normQ)) score += 35;
    for (const t of expandedTokens) {
      if (titleNorm.includes(t)) score += 8;
      if (descNorm.includes(t)) score += 4;
    }
    if (score >= 20 && !seenKeys.has(aud.id)) {
      seenKeys.add(aud.id);
      candidates.push({
        id: aud.id,
        title: `เสียงบรรยาย: ${aud.title}`,
        sourceType: 'audio',
        highlightSnippet: extractSnippetAround(aud.description, tokens, 150),
        fullExcerpt: aud.description,
        link: `/audios?id=${aud.id}`,
        cover: aud.thumbnail,
        actionText: 'รับฟังเสียงบรรยาย',
        score,
        isDirectEvidence: score >= 35
      });
    }
  }

  // เรียงลำดับตามคะแนนความเกี่ยวข้อง (Descending)
  candidates.sort((a, b) => b.score - a.score);
  const topResults = candidates.slice(0, maxResults);
  const hasDirectEvidence = topResults.some(r => r.isDirectEvidence);

  return {
    results: topResults,
    hasDirectEvidence,
    topEvidenceSnippet: topResults[0]?.highlightSnippet,
    primaryCitation: topResults[0]
  };
}
