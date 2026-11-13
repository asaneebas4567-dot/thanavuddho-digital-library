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
 * Research Foundation (Brysbaert 2019, Scholar Within 2020, Rayner et al. 2016):
 * - Adult silent reading speed: ~238 WPM (Words Per Minute) globally
 * - Reflective / Dhamma / Thai analytical reading speed: ~200 WPM
 * - Standard Thai Dhamma book (A5 pocketbook): ~350 - 400 words/page
 * 
 * Mathematical Formulation (70% Discount Factor Model):
 * 1. Standard Reading Time: T_standard = (Total Words / WPM) * 60 (seconds)
 *    Example: 1 page of 400 words at 200 WPM = (400 / 200) * 60 = 120 seconds (2.0 minutes)
 * 2. Minimum Dwell Threshold (70% Factor): T_required = T_standard * 0.70
 *    Example: 120s * 0.70 = 84 seconds (1 minute 24 seconds, or ~1m 20s)
 * 
 * Anti-Skimming Dual-Criteria Rule:
 * IF (Current_Page >= Target_Page AND Reading_Time >= Minimum_Threshold) THEN Trigger_Quest()
 */
export interface ChapterDwellCalculation {
  chapterPageCount: number;
  wordCountEstimate: number;
  averageReadingSeconds: number; // e.g. 120s (2.0 min) for 1 page of 400 words
  requiredDwellSeconds: number;  // e.g. 84s (1m 24s) for 70% threshold
  minimumSecondsPerPage: number; // e.g. 84s/page
  recommendedMinutesDisplay: string; // e.g. "2.0 นาที"
  requiredMinutesDisplay: string;    // e.g. "1 นาที 24 วินาที"
  antiSkimmingExplanation: string;
}

export const ACADEMIC_READING_BENCHMARKS = {
  WPM_ENGLISH_BENCHMARK: 238, // Brysbaert (2019)
  WPM_THAI_REFLECTIVE: 200,   // Thai reflective / philosophical reading baseline
  WORDS_PER_PAGE_DEFAULT: 400, // 400 words per page standard
  DISCOUNT_FACTOR_ACADEMIC: 0.70 // 70% threshold accommodating fast & normal readers
};

export function calculateChapterRequiredDwellTime(
  pageCount: number,
  dimension: BookDimension = 'A5',
  customDwellRatio: number = 0.70, // Default to 70% Discount Factor Model
  wordsPerPage: number = 400,
  readingWpm: number = 200
): ChapterDwellCalculation {
  const safePageCount = Math.max(1, pageCount || 1);
  const totalWords = safePageCount * wordsPerPage;

  // 1. Standard Reading Time (100% thorough reading at baseline WPM)
  // T_standard = (Words / WPM) * 60
  const averageReadingSeconds = Math.round((totalWords / readingWpm) * 60);

  // 2. Minimum Dwell Time based on Academic Discount Factor (e.g. 70%)
  // T_required = T_standard * Discount_Factor
  const rawRequiredSeconds = Math.round(averageReadingSeconds * customDwellRatio);

  // Reasonable clamps:
  // - Minimum: at least 30 seconds (even for 1 page brief summary)
  // - Maximum: at most 300 seconds (5 minutes) so it never hinders advanced readers
  const requiredDwellSeconds = Math.max(30, Math.min(300, rawRequiredSeconds));
  const minimumSecondsPerPage = Math.round((requiredDwellSeconds / safePageCount) * 10) / 10;

  const avgMin = Math.floor(averageReadingSeconds / 60);
  const avgSec = averageReadingSeconds % 60;
  const reqMin = Math.floor(requiredDwellSeconds / 60);
  const reqSec = requiredDwellSeconds % 60;

  const recommendedMinutesDisplay = avgMin > 0 ? (avgSec > 0 ? `${avgMin} นาที ${avgSec} วินาที` : `${avgMin} นาที`) : `${avgSec} วินาที`;
  const requiredMinutesDisplay = reqMin > 0 ? (reqSec > 0 ? `${reqMin} นาที ${reqSec} วินาที` : `${reqMin} นาที`) : `${reqSec} วินาที`;

  return {
    chapterPageCount: safePageCount,
    wordCountEstimate: totalWords,
    averageReadingSeconds,
    requiredDwellSeconds,
    minimumSecondsPerPage,
    recommendedMinutesDisplay,
    requiredMinutesDisplay,
    antiSkimmingExplanation: `บทนี้มี ${safePageCount} หน้า (ประมาณ ${totalWords.toLocaleString()} คำ) เวลาอ่านมาตรฐาน ${recommendedMinutesDisplay} (อัตรา 200 คำ/นาที) ระบบกำหนดเวลาศึกษาจริงอย่างน้อย ${requiredMinutesDisplay} (เกณฑ์ 70% เพื่อความยืดหยุ่น) ก่อนปลดล็อกเควส`
  };
}

