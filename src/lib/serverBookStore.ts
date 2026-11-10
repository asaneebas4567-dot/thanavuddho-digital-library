import fs from 'fs';
import path from 'path';
import { Book } from '@/types';
import { books as baseBooks } from '@/data/mockData';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const BOOKS_FILE = path.join(DATA_DIR, 'persistentBooks.json');

// Ensure persistent storage exists
function ensureStorageExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(BOOKS_FILE)) {
      fs.writeFileSync(BOOKS_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch {
    // Read-only filesystem on Vercel / AWS Lambda
  }
}

let inMemoryCustomBooks: Book[] | null = null;

// Read all custom imported books
export function getCustomBooks(): Book[] {
  if (inMemoryCustomBooks) {
    return inMemoryCustomBooks;
  }
  ensureStorageExists();
  try {
    if (fs.existsSync(BOOKS_FILE)) {
      const data = fs.readFileSync(BOOKS_FILE, 'utf-8');
      inMemoryCustomBooks = JSON.parse(data) || [];
      return inMemoryCustomBooks!;
    }
  } catch (err) {
    console.warn('Failed to read persistentBooks file:', err);
  }
  inMemoryCustomBooks = [];
  return [];
}

// Save custom books
export function saveCustomBooks(books: Book[]) {
  inMemoryCustomBooks = books;
  ensureStorageExists();
  try {
    fs.writeFileSync(BOOKS_FILE, JSON.stringify(books, null, 2), 'utf-8');
  } catch (err) {
    try {
      const tmpPath = path.join('/tmp', 'persistentBooks.json');
      fs.writeFileSync(tmpPath, JSON.stringify(books, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }
}

// Normalize text for duplicate comparison
export function normalizeText(text: string): string {
  return (text || '')
    .toLowerCase()
    .replace(/[\u0E48-\u0E4C]+/g, m => m[0])
    .replace(/[^\u0E00-\u0E7Fa-z0-9]/g, '')
    .replace(/^1[0-9]{2,3}/, '')
    .replace(/^(ฉบับ|ตอน)/, '')
    .trim();
}

// Read combined books (base + custom) with strict title & ID deduplication
export function getAllCombinedBooks(): Book[] {
  const custom = getCustomBooks();
  const seenIds = new Set<string>();
  const seenTitles = new Set<string>();
  const result: Book[] = [];

  // Add custom books first (priority)
  for (const b of custom) {
    if (!b || !b.id) continue;
    const norm = normalizeText(b.title);
    seenIds.add(b.id);
    if (norm) seenTitles.add(norm);
    result.push(b);
  }

  // Add base books that aren't duplicates
  for (const b of (baseBooks as Book[])) {
    if (!b || !b.id) continue;
    if (seenIds.has(b.id)) continue;
    const norm = normalizeText(b.title);
    if (norm && seenTitles.has(norm)) continue;

    seenIds.add(b.id);
    if (norm) seenTitles.add(norm);
    result.push(b);
  }

  return result;
}

// Check if a book is duplicate
export function checkDuplicateBook(title: string, isbn?: string, id?: string): { isDuplicate: boolean; matchedBook?: Book; reason?: string } {
  const all = getAllCombinedBooks();
  const normTitle = normalizeText(title);
  const cleanIsbn = (isbn || '').replace(/[^0-9]/g, '');

  for (const b of all) {
    if (id && b.id === id) {
      return { isDuplicate: true, matchedBook: b, reason: 'รหัสหนังสือ (ID) ตรงกันในระบบ' };
    }
    if (cleanIsbn && b.isbn && b.isbn.replace(/[^0-9]/g, '') === cleanIsbn) {
      return { isDuplicate: true, matchedBook: b, reason: `หมายเลข ISBN ตรงกับ "${b.title}"` };
    }
    const bNorm = normalizeText(b.title);
    if (normTitle && bNorm && (normTitle === bNorm || normTitle.includes(bNorm) || bNorm.includes(normTitle))) {
      return { isDuplicate: true, matchedBook: b, reason: `ชื่อหนังสือตรงหรือใกล้เคียงกับ "${b.title}"` };
    }
  }

  return { isDuplicate: false };
}

// Add or update a book
export function upsertCustomBook(book: Book): { success: boolean; book: Book } {
  const custom = getCustomBooks();
  const existingIndex = custom.findIndex(b => b.id === book.id || normalizeText(b.title) === normalizeText(book.title));

  if (existingIndex >= 0) {
    custom[existingIndex] = { ...custom[existingIndex], ...book };
  } else {
    custom.unshift(book);
  }

  saveCustomBooks(custom);
  return { success: true, book };
}

// ----------------------------------------------------
// Real-time Book Read Statistics Tracking (Persistent)
// ----------------------------------------------------
const STATS_FILE = path.join(DATA_DIR, 'bookReadStats.json');

export interface BookReadStatItem {
  readCount: number;
  readers: string[]; // List of user emails or user IDs who opened to read
  lastReadAt: string;
}

export function getBookReadStats(): Record<string, BookReadStatItem> {
  ensureStorageExists();
  try {
    if (!fs.existsSync(STATS_FILE)) {
      fs.writeFileSync(STATS_FILE, JSON.stringify({}, null, 2), 'utf-8');
      return {};
    }
    const data = fs.readFileSync(STATS_FILE, 'utf-8');
    return JSON.parse(data) || {};
  } catch (err) {
    console.error('Failed to read bookReadStats:', err);
    return {};
  }
}

export function recordBookRead(bookId: string, userEmail?: string, userName?: string): { success: boolean; readCount: number } {
  if (!bookId) return { success: false, readCount: 0 };
  ensureStorageExists();
  const stats = getBookReadStats();

  const currentItem = stats[bookId] || {
    readCount: 0,
    readers: [],
    lastReadAt: new Date().toISOString()
  };

  // Increment real read count
  currentItem.readCount = (currentItem.readCount || 0) + 1;
  currentItem.lastReadAt = new Date().toISOString();

  const readerIdentifier = userEmail || userName || 'guest';
  if (!currentItem.readers.includes(readerIdentifier)) {
    currentItem.readers.push(readerIdentifier);
  }

  stats[bookId] = currentItem;

  try {
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save bookReadStats:', err);
  }

  return { success: true, readCount: currentItem.readCount };
}

