/**
 * READING PACING & GAMIFIED POINT CALCULATION ENGINE
 * Handles:
 * 1. Time per page tracking & anti-cheating validation
 * 2. Book dimension detection (A4, A5, B5, Pocket Book)
 * 3. Extensible formula for reward point calculation
 */

export type BookDimension = 'A4' | 'A5' | 'B5' | 'Pocket' | 'Letter' | 'Custom';

export interface BookDimensionInfo {
  code: BookDimension;
  labelTh: string;
  widthMm: number;
  heightMm: number;
  aspectRatio: number; // width / height
  recommendedReadingSpeedSecondsPerPage: number;
  descriptionTh: string;
}

export const BOOK_DIMENSIONS: Record<BookDimension, BookDimensionInfo> = {
  A4: {
    code: 'A4',
    labelTh: 'A4 (หนังสือฉบับเต็ม / เอกสารวิชาการ)',
    widthMm: 210,
    heightMm: 297,
    aspectRatio: 210 / 297, // ~0.707
    recommendedReadingSpeedSecondsPerPage: 45,
    descriptionTh: 'ขนาดใหญ่ จุตัวอักษรมาก เหมาะกับการแสดงผลแบบหน้าเดี่ยว ซูมอ่านชัดเจน'
  },
  A5: {
    code: 'A5',
    labelTh: 'A5 (พ็อกเก็ตบุ๊กธรรมะมาตรฐาน)',
    widthMm: 148,
    heightMm: 210,
    aspectRatio: 148 / 210, // ~0.705
    recommendedReadingSpeedSecondsPerPage: 30,
    descriptionTh: 'ขนาดพ็อกเก็ตบุ๊กยอดนิยม เหมาะสำหรับการเปิดอ่านแบบ 2 หน้าคู่ (Flipbook Spread)'
  },
  B5: {
    code: 'B5',
    labelTh: 'B5 (หนังสือกึ่งตำรา / อนุสรณ์)',
    widthMm: 176,
    heightMm: 250,
    aspectRatio: 176 / 250, // ~0.704
    recommendedReadingSpeedSecondsPerPage: 35,
    descriptionTh: 'ขนาดกึ่งตำรา พิมพ์ใหญ่ สบายตา'
  },
  Pocket: {
    code: 'Pocket',
    labelTh: 'Pocket Book (16 หน้ายก / ขนาดพกพา)',
    widthMm: 120,
    heightMm: 185,
    aspectRatio: 120 / 185, // ~0.648
    recommendedReadingSpeedSecondsPerPage: 20,
    descriptionTh: 'เล่มกะทัดรัด พกพาสะดวก เหมาะกับการอ่านบนสมาร์ตโฟน'
  },
  Letter: {
    code: 'Letter',
    labelTh: 'US Letter (เอกสารมาตรฐานสากล)',
    widthMm: 215.9,
    heightMm: 279.4,
    aspectRatio: 215.9 / 279.4,
    recommendedReadingSpeedSecondsPerPage: 40,
    descriptionTh: 'มาตรฐานเอกสารสากล'
  },
  Custom: {
    code: 'Custom',
    labelTh: 'ขนาดกำหนดเอง',
    widthMm: 150,
    heightMm: 210,
    aspectRatio: 0.71,
    recommendedReadingSpeedSecondsPerPage: 30,
    descriptionTh: 'ขนาดตามต้นฉบับของผู้จัดพิมพ์'
  }
};

/**
 * Detect book dimension based on PDF page width and height in points
 * (1 pt = 1/72 inch, 25.4 mm = 72 pt)
 */
export function detectBookDimension(widthPt: number, heightPt: number): BookDimensionInfo {
  if (!widthPt || !heightPt) return BOOK_DIMENSIONS.A5;

  const wMm = (widthPt * 25.4) / 72;
  const hMm = (heightPt * 25.4) / 72;
  const isLandscape = wMm > hMm;
  const shortMm = isLandscape ? hMm : wMm;
  const longMm = isLandscape ? wMm : hMm;

  // Compare closest to known standards
  if (Math.abs(shortMm - 210) < 20 && Math.abs(longMm - 297) < 25) {
    return BOOK_DIMENSIONS.A4;
  }
  if (Math.abs(shortMm - 148) < 15 && Math.abs(longMm - 210) < 20) {
    return BOOK_DIMENSIONS.A5;
  }
  if (Math.abs(shortMm - 176) < 15 && Math.abs(longMm - 250) < 20) {
    return BOOK_DIMENSIONS.B5;
  }
  if (shortMm <= 130 && longMm <= 190) {
    return BOOK_DIMENSIONS.Pocket;
  }

  return BOOK_DIMENSIONS.A5;
}

/**
 * FORMULA FOR READING POINT CALCULATION
 * Ready to receive user's custom formula.
 *
 * Current Baseline Logic:
 * - Base points: 2 points per completed valid page read (spent >= minimum recommended reading time)
 * - Time bonus: +1 point per 60 seconds of focused active reading
 * - Streak multiplier: 1 day = 1.0x, 2 days = 1.1x, 3 days = 1.2x, 5+ days = 1.5x, 7+ days = 2.0x
 * - Dimension factor: A4 reading yields 1.25x (due to dense text per page)
 */
export interface ReadingPointParams {
  secondsSpent: number;
  pagesRead: number;
  dimension?: BookDimension;
  streakDays?: number;
}

export interface ReadingPointResult {
  totalPoints: number;
  basePoints: number;
  timeBonusPoints: number;
  streakBonus: number;
  streakMultiplier: number;
  formulaNote: string;
}

export function calculateReadingPoints(params: ReadingPointParams): ReadingPointResult {
  const { secondsSpent, pagesRead, dimension = 'A5', streakDays = 1 } = params;

  // 1. Base points per page (adjusted by book size)
  const sizeMultiplier = dimension === 'A4' ? 1.25 : dimension === 'Pocket' ? 0.8 : 1.0;
  const basePoints = Math.round(pagesRead * 2 * sizeMultiplier);

  // 2. Focused reading time bonus (1 point per full minute)
  const minutes = Math.floor(secondsSpent / 60);
  const timeBonusPoints = Math.min(30, minutes * 1);

  // 3. Streak multiplier (Gamified boost)
  let streakMultiplier = 1.0;
  if (streakDays >= 7) streakMultiplier = 2.0;
  else if (streakDays >= 5) streakMultiplier = 1.5;
  else if (streakDays >= 3) streakMultiplier = 1.2;
  else if (streakDays >= 2) streakMultiplier = 1.1;

  const rawTotal = (basePoints + timeBonusPoints) * streakMultiplier;
  const totalPoints = Math.max(1, Math.round(rawTotal));
  const streakBonus = Math.max(0, totalPoints - (basePoints + timeBonusPoints));

  return {
    totalPoints,
    basePoints,
    timeBonusPoints,
    streakBonus,
    streakMultiplier,
    formulaNote: `สูตร: (หน้า(${pagesRead}) x 2 + เวลา(${minutes}น.)) x สตรีค(${streakMultiplier}x)`
  };
}

/**
 * ============================================================================
 * CHAPTER READING PACING & GENUINE STUDY VERIFICATION ENGINE
 * ============================================================================
 * Research Foundation (Brysbaert 2019, Cambridge, UCSD, UT Austin):
 * - Adult silent reading speed: ~238 WPM (Words Per Minute)
 * - Academic textbook: ~800 words/page (3.2 min/page)
 * - Thai pocketbook / Dhamma book (A5): ~150 - 250 words/page (font & layout spacing)
 * - Standard chapter (e.g. 10 pages): ~1,500 words => Average read time = ~5.0 minutes (300s)
 * 
 * Anti-Skimming Quest Unlock Rule (User Formula: 1.5 in 5 minutes ratio = 30%):
 * - Minimum required study dwell time = 30% of average reading time.
 * - For a 10-page chapter: 300s * 0.30 = 90s (1.5 minutes) minimum dwell.
 * - Rate: ~9 seconds per page minimum active presence.
 * - Prevents users from rapid-skimming ("เปิดคลิกๆ ไปแล้วเควสเด้ง").
 */
export interface ChapterDwellCalculation {
  chapterPageCount: number;
  averageReadingSeconds: number; // e.g. 300s (5.0 min) for 10 pages
  requiredDwellSeconds: number;  // e.g. 90s (1.5 min) for 10 pages (30% threshold)
  minimumSecondsPerPage: number; // e.g. 9.0s/page
  recommendedMinutesDisplay: string; // e.g. "5.0 นาที"
  requiredMinutesDisplay: string;    // e.g. "1.5 นาที"
  antiSkimmingExplanation: string;
}

export function calculateChapterRequiredDwellTime(
  pageCount: number,
  dimension: BookDimension = 'A5',
  customDwellRatio: number = 0.30 // 1.5 out of 5 minutes = 30%
): ChapterDwellCalculation {
  const safePageCount = Math.max(1, pageCount || 1);
  const dimensionInfo = BOOK_DIMENSIONS[dimension] || BOOK_DIMENSIONS.A5;
  const secondsPerPage = dimensionInfo.recommendedReadingSpeedSecondsPerPage || 30;

  // Average reading time (100% thorough read)
  // e.g. 10 pages * 30s = 300s = 5 minutes
  const averageReadingSeconds = safePageCount * secondsPerPage;

  // Required Dwell Time (User rule: 1.5 in 5 minutes ratio = 30%)
  // e.g. 10 pages * 30s * 0.30 = 90s = 1.5 minutes
  const rawRequiredSeconds = Math.round(averageReadingSeconds * customDwellRatio);

  // Reasonable clamps:
  // - Minimum: at least 30 seconds (even for 1-2 page short intro)
  // - Maximum: at most 300 seconds (5 minutes) so it never frustrates fast readers
  const requiredDwellSeconds = Math.max(30, Math.min(300, rawRequiredSeconds));
  const minimumSecondsPerPage = Math.round((requiredDwellSeconds / safePageCount) * 10) / 10;

  const averageMinutes = (averageReadingSeconds / 60).toFixed(1);
  const requiredMinutes = (requiredDwellSeconds / 60).toFixed(1);

  return {
    chapterPageCount: safePageCount,
    averageReadingSeconds,
    requiredDwellSeconds,
    minimumSecondsPerPage,
    recommendedMinutesDisplay: `${averageMinutes} นาที`,
    requiredMinutesDisplay: `${requiredMinutes} นาที`,
    antiSkimmingExplanation: `บทนี้มี ${safePageCount} หน้า เวลาอ่านเฉลี่ย ${averageMinutes} นาที (238 คำ/นาที) ระบบกำหนดเวลาศึกษาจริงอย่างน้อย ${requiredMinutes} นาที (1.5 ใน 5 ส่วน) เพื่อปลดล็อกเควส`
  };
}

