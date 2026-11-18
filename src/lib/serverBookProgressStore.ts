import fs from 'fs';
import path from 'path';

export interface BookReadingProgress {
  user_email: string;
  user_id?: string;
  book_id: string;
  book_title?: string;
  book_cover?: string;
  current_page: number;
  total_pages: number;
  progress_percent: number;
  bookmarks: number[]; // array of bookmarked page numbers
  is_finished: boolean;
  last_read_at: string;
  first_read_at: string;
}

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PROGRESS_FILE = path.join(DATA_DIR, 'bookReadingProgress.json');
const TMP_PROGRESS_FILE = path.join('/tmp', 'bookReadingProgress.json');

let inMemoryProgress: Record<string, BookReadingProgress> | null = null;

function ensureStorageExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PROGRESS_FILE)) {
      fs.writeFileSync(PROGRESS_FILE, JSON.stringify({}, null, 2), 'utf-8');
    }
  } catch {
    // Read-only filesystem fallback
  }
}

export function getAllReadingProgress(): Record<string, BookReadingProgress> {
  if (inMemoryProgress) return inMemoryProgress;
  ensureStorageExists();

  try {
    if (fs.existsSync(PROGRESS_FILE)) {
      const data = fs.readFileSync(PROGRESS_FILE, 'utf-8');
      inMemoryProgress = JSON.parse(data) || {};
      return inMemoryProgress!;
    }
  } catch (err) {
    console.warn('Failed to read bookReadingProgress from data dir:', err);
  }

  try {
    if (fs.existsSync(TMP_PROGRESS_FILE)) {
      const data = fs.readFileSync(TMP_PROGRESS_FILE, 'utf-8');
      inMemoryProgress = JSON.parse(data) || {};
      return inMemoryProgress!;
    }
  } catch {
    // ignore
  }

  inMemoryProgress = {};
  return inMemoryProgress;
}

export function saveAllReadingProgress(data: Record<string, BookReadingProgress>) {
  inMemoryProgress = data;
  ensureStorageExists();

  try {
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    try {
      fs.writeFileSync(TMP_PROGRESS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch {
      // ignore
    }
  }
}

function makeProgressKey(email: string, bookId: string): string {
  return `${email.toLowerCase().trim()}_${bookId.trim()}`;
}

export function getBookReadingProgress(userEmail: string, bookId: string): BookReadingProgress | null {
  if (!userEmail || !bookId) return null;
  const store = getAllReadingProgress();
  const key = makeProgressKey(userEmail, bookId);
  return store[key] || null;
}

export function saveBookReadingProgress(params: {
  userEmail: string;
  userId?: string;
  bookId: string;
  bookTitle?: string;
  bookCover?: string;
  currentPage: number;
  totalPages: number;
  bookmarks?: number[];
}): BookReadingProgress {
  const { userEmail, userId, bookId, bookTitle, bookCover, currentPage, totalPages, bookmarks } = params;
  const store = getAllReadingProgress();
  const key = makeProgressKey(userEmail, bookId);
  const now = new Date().toISOString();

  const safeTotal = Math.max(1, totalPages || 1);
  const safeCurrent = Math.max(1, Math.min(currentPage || 1, safeTotal));
  const progressPercent = Math.min(100, Math.round((safeCurrent / safeTotal) * 100));
  const isFinished = safeCurrent >= safeTotal || progressPercent >= 95;

  const existing = store[key];

  const updated: BookReadingProgress = {
    user_email: userEmail.toLowerCase().trim(),
    user_id: userId || existing?.user_id || userEmail,
    book_id: bookId,
    book_title: bookTitle || existing?.book_title || '',
    book_cover: bookCover || existing?.book_cover || '',
    current_page: safeCurrent,
    total_pages: safeTotal,
    progress_percent: Math.max(progressPercent, existing ? existing.progress_percent : 0),
    bookmarks: Array.isArray(bookmarks) ? bookmarks : (existing?.bookmarks || []),
    is_finished: isFinished || (existing?.is_finished ?? false),
    last_read_at: now,
    first_read_at: existing?.first_read_at || now,
  };

  store[key] = updated;
  saveAllReadingProgress(store);
  return updated;
}

export function toggleBookmark(
  userEmail: string,
  bookId: string,
  pageNumber: number,
  bookTitle?: string,
  bookCover?: string,
  totalPages = 100
): { bookmarked: boolean; bookmarks: number[] } {
  const store = getAllReadingProgress();
  const key = makeProgressKey(userEmail, bookId);
  const existing = store[key] || saveBookReadingProgress({
    userEmail,
    bookId,
    bookTitle,
    bookCover,
    currentPage: pageNumber,
    totalPages,
    bookmarks: []
  });

  const currentBookmarks = new Set(existing.bookmarks || []);
  let bookmarked = false;

  if (currentBookmarks.has(pageNumber)) {
    currentBookmarks.delete(pageNumber);
    bookmarked = false;
  } else {
    currentBookmarks.add(pageNumber);
    bookmarked = true;
  }

  const newBookmarks = Array.from(currentBookmarks).sort((a, b) => a - b);
  existing.bookmarks = newBookmarks;
  existing.last_read_at = new Date().toISOString();

  store[key] = existing;
  saveAllReadingProgress(store);

  return { bookmarked, bookmarks: newBookmarks };
}

export function getUserReadingHistory(userEmail: string): BookReadingProgress[] {
  if (!userEmail) return [];
  const store = getAllReadingProgress();
  const cleanEmail = userEmail.toLowerCase().trim();

  return Object.values(store)
    .filter(item => item.user_email === cleanEmail)
    .sort((a, b) => new Date(b.last_read_at).getTime() - new Date(a.last_read_at).getTime());
}
