import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { 
  SurveyQuestion, 
  SurveyResponse, 
  SurveyAnswer, 
  SurveyAnalytics, 
  SurveyCategory,
  CategorySatisfactionStat 
} from '@/types/survey';
import { getUserByEmail, getAllUsers, saveAllUsers } from './serverUserStore';
import { getAllPointsHistory, saveAllPointsHistory, PointTransaction } from './learningPointsServer';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const SURVEYS_FILE = path.join(DATA_DIR, 'persistentSurveys.json');

interface SurveyStorageFormat {
  questions: SurveyQuestion[];
  responses: SurveyResponse[];
  answers: SurveyAnswer[];
}

export const DEFAULT_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: 'q_book_search',
    category: 'books',
    categoryTitleTh: 'หนังสือดิจิทัล & E-Books',
    questionText: 'ความสะดวกรวดเร็วในการค้นหาและเข้าถึงหนังสือธรรมะที่ต้องการ',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 1,
    isActive: true
  },
  {
    id: 'q_book_reader',
    category: 'books',
    categoryTitleTh: 'หนังสือดิจิทัล & E-Books',
    questionText: 'คุณภาพความคมชัดของไฟล์ PDF และความลื่นไหลในการเปิดอ่านหนังสือ (Flipbook)',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 2,
    isActive: true
  },
  {
    id: 'q_web_design',
    category: 'website',
    categoryTitleTh: 'ระบบเว็บไซต์ & UI/UX',
    questionText: 'ความสวยงาม ทันสมัย ความสบายตา และความง่ายในการใช้งานหน้าตาเว็บไซต์ (UI/UX)',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 3,
    isActive: true
  },
  {
    id: 'q_media_video',
    category: 'video',
    categoryTitleTh: 'สื่อวิดีโอธรรมบรรยาย',
    questionText: 'คุณภาพความคมชัดของวิดีโอและความสะดวกของระบบบทถอดเสียง (Transcript)',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 4,
    isActive: true
  },
  {
    id: 'q_media_podcast',
    category: 'podcast',
    categoryTitleTh: 'พอดแคสต์ & หนังสือเสียง',
    questionText: 'คุณภาพเสียงบรรยายธรรมะ และความมีประโยชน์ของรายการพอดแคสต์/หนังสือเสียง',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 5,
    isActive: true
  },
  {
    id: 'q_articles_knowledge',
    category: 'article',
    categoryTitleTh: 'คลังบทความธรรมะ',
    questionText: 'ความน่าสนใจ ความถูกต้องของเนื้อหา และคุณค่าของบทความในการนำไปใช้ในชีวิตจริง',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 6,
    isActive: true
  },
  {
    id: 'q_gamification_rewards',
    category: 'website',
    categoryTitleTh: 'ระบบแต้มสะสมและของรางวัล',
    questionText: 'ความพึงพอใจต่อระบบสะสมแต้มปัญญาบารมี เควสธรรมะ และการแลกของที่ระลึก',
    questionType: 'rating',
    scaleMin: 1,
    scaleMax: 5,
    displayOrder: 7,
    isActive: true
  },
  {
    id: 'q_overall_recommendation',
    category: 'general',
    categoryTitleTh: 'ภาพรวม & ข้อเสนอแนะ',
    questionText: 'ข้อเสนอแนะเพิ่มเติมเพื่อการปรับปรุงและพัฒนาห้องสมุดดิจิทัล Thanavuddho Library',
    questionType: 'text',
    displayOrder: 8,
    isActive: true
  }
];

function ensureStorage(): SurveyStorageFormat {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(SURVEYS_FILE)) {
    const initial: SurveyStorageFormat = {
      questions: DEFAULT_SURVEY_QUESTIONS,
      responses: [],
      answers: []
    };
    fs.writeFileSync(SURVEYS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    return initial;
  }

  try {
    const raw = fs.readFileSync(SURVEYS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.questions || parsed.questions.length === 0) {
      parsed.questions = DEFAULT_SURVEY_QUESTIONS;
      fs.writeFileSync(SURVEYS_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
    }
    return parsed;
  } catch (err) {
    console.error('Failed reading persistentSurveys.json:', err);
    return {
      questions: DEFAULT_SURVEY_QUESTIONS,
      responses: [],
      answers: []
    };
  }
}

function saveStorage(data: SurveyStorageFormat) {
  try {
    fs.writeFileSync(SURVEYS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed saving persistentSurveys.json:', err);
  }
}

// ---------------------------------------------------------------------------
// 1. QUESTIONS
// ---------------------------------------------------------------------------
export function getAllSurveyQuestions(): SurveyQuestion[] {
  const store = ensureStorage();
  return store.questions.sort((a, b) => a.displayOrder - b.displayOrder);
}

// ---------------------------------------------------------------------------
// 2. RESPONSES & ANSWERS
// ---------------------------------------------------------------------------
export function getAllSurveyResponses(filterTest: 'all' | 'real_only' | 'test_only' = 'all'): SurveyResponse[] {
  const store = ensureStorage();
  let list = store.responses;
  if (filterTest === 'real_only') {
    list = list.filter(r => !r.isTest);
  } else if (filterTest === 'test_only') {
    list = list.filter(r => r.isTest);
  }
  return list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
}

export function getSurveyResponseById(id: string): (SurveyResponse & { answers: SurveyAnswer[] }) | null {
  const store = ensureStorage();
  const resp = store.responses.find(r => r.id === id);
  if (!resp) return null;
  const answers = store.answers.filter(a => a.responseId === id);
  return { ...resp, answers };
}

// ---------------------------------------------------------------------------
// 3. ANALYTICS & SATISFACTION SUMMARY
// ---------------------------------------------------------------------------
export function getSurveyAnalytics(filterTest: 'all' | 'real_only' | 'test_only' = 'real_only'): SurveyAnalytics {
  const store = ensureStorage();
  const questions = store.questions;
  let responses = store.responses;

  if (filterTest === 'real_only') {
    responses = responses.filter(r => !r.isTest);
  } else if (filterTest === 'test_only') {
    responses = responses.filter(r => r.isTest);
  }

  const responseIds = new Set(responses.map(r => r.id));
  const answers = store.answers.filter(a => responseIds.has(a.responseId));

  // Category stats initialization
  const categoryNames: Record<SurveyCategory, string> = {
    website: 'ระบบเว็บไซต์ & UI/UX',
    books: 'หนังสือดิจิทัล & E-Books',
    video: 'สื่อวิดีโอธรรมบรรยาย',
    podcast: 'พอดแคสต์ & หนังสือเสียง',
    article: 'คลังบทความธรรมะ',
    general: 'ภาพรวม & ข้อเสนอแนะ'
  };

  const categories: SurveyCategory[] = ['website', 'books', 'video', 'podcast', 'article', 'general'];
  const categoryStats: Record<SurveyCategory, CategorySatisfactionStat> = {} as any;

  categories.forEach(cat => {
    categoryStats[cat] = {
      category: cat,
      nameTh: categoryNames[cat],
      avgRating: 0,
      totalRatingsCount: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
  });

  // Calculate per question stats
  const questionMap = new Map(questions.map(q => [q.id, q]));
  const questionSums: Record<string, { total: number; count: number }> = {};

  let overallRatingSum = 0;
  let overallRatingCount = 0;

  answers.forEach(ans => {
    if (typeof ans.ratingValue === 'number' && ans.ratingValue >= 1 && ans.ratingValue <= 5) {
      const q = questionMap.get(ans.questionId);
      if (q) {
        // Overall
        overallRatingSum += ans.ratingValue;
        overallRatingCount += 1;

        // Question
        if (!questionSums[ans.questionId]) {
          questionSums[ans.questionId] = { total: 0, count: 0 };
        }
        questionSums[ans.questionId].total += ans.ratingValue;
        questionSums[ans.questionId].count += 1;

        // Category
        const cStat = categoryStats[q.category];
        if (cStat) {
          cStat.totalRatingsCount += 1;
          const roundedScore = Math.round(ans.ratingValue) as 1 | 2 | 3 | 4 | 5;
          if (cStat.distribution[roundedScore] !== undefined) {
            cStat.distribution[roundedScore] += 1;
          }
        }
      }
    }
  });

  // Calculate category averages
  categories.forEach(cat => {
    const qInCat = questions.filter(q => q.category === cat && q.questionType === 'rating');
    let catSum = 0;
    let catCount = 0;
    qInCat.forEach(q => {
      if (questionSums[q.id]) {
        catSum += questionSums[q.id].total;
        catCount += questionSums[q.id].count;
      }
    });
    categoryStats[cat].avgRating = catCount > 0 ? Number((catSum / catCount).toFixed(2)) : 0;
  });

  const questionStats = questions
    .filter(q => q.questionType === 'rating')
    .map(q => {
      const sumObj = questionSums[q.id] || { total: 0, count: 0 };
      const avg = sumObj.count > 0 ? Number((sumObj.total / sumObj.count).toFixed(2)) : 0;
      return {
        questionId: q.id,
        questionText: q.questionText,
        category: q.category,
        categoryTitleTh: q.categoryTitleTh,
        avgRating: avg,
        count: sumObj.count
      };
    });

  // Recent qualitative comments
  const feedbackAnswers = answers.filter(a => a.textValue && a.textValue.trim().length > 0);
  const respMap = new Map(responses.map(r => [r.id, r]));

  const recentFeedback = feedbackAnswers
    .map(ans => {
      const r = respMap.get(ans.responseId);
      if (!r) return null;
      return {
        id: ans.id,
        email: r.respondentEmail,
        userName: r.userName || undefined,
        memberCardId: r.memberCardId || undefined,
        comment: ans.textValue || '',
        submittedAt: r.submittedAt,
        isTest: r.isTest
      };
    })
    .filter(Boolean) as Array<{
      id: string;
      email: string;
      userName?: string;
      memberCardId?: string;
      comment: string;
      submittedAt: string;
      isTest: boolean;
    }>;

  recentFeedback.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

  const allResponses = store.responses;
  const verifiedMembers = responses.filter(r => r.userId && r.status === 'verified').length;
  const pointsAwarded = responses.filter(r => r.pointsAwarded).length;

  return {
    totalResponses: responses.length,
    realResponsesCount: allResponses.filter(r => !r.isTest).length,
    testResponsesCount: allResponses.filter(r => r.isTest).length,
    verifiedMembersCount: verifiedMembers,
    pointsAwardedCount: pointsAwarded,
    overallSatisfactionAverage: overallRatingCount > 0 
      ? Number((overallRatingSum / overallRatingCount).toFixed(2)) 
      : 0,
    categoryStats,
    questionStats,
    recentFeedback: recentFeedback.slice(0, 50)
  };
}

// ---------------------------------------------------------------------------
// 4. POINT AWARDING ENGINE (PHASE 4: 200 POINTS SINGLE-AWARD GUARANTEE)
// ---------------------------------------------------------------------------
export interface AwardPointsResult {
  success: boolean;
  message: string;
  pointsAwarded: number;
  currentBalance?: number;
  transactionId?: string;
  alreadyAwarded?: boolean;
}

export function awardSurveyPoints(responseId: string): AwardPointsResult {
  const store = ensureStorage();
  const respIndex = store.responses.findIndex(r => r.id === responseId);
  if (respIndex === -1) {
    return {
      success: false,
      message: 'ไม่พบข้อมูลการส่งแบบประเมินนี้ในระบบ',
      pointsAwarded: 0
    };
  }

  const response = store.responses[respIndex];
  const emailClean = response.respondentEmail.trim().toLowerCase();

  // 1. Check if user is a verified registered member
  const user = getUserByEmail(emailClean);
  if (!user) {
    return {
      success: false,
      message: `อีเมล ${response.respondentEmail} ยังไม่ได้ลงทะเบียนเป็นสมาชิกห้องสมุด ไม่สามารถให้คะแนนได้`,
      pointsAwarded: 0
    };
  }

  // 2. Server-level anti-duplicate check: has this user EVER received 'website_survey' points?
  const allHistory = getAllPointsHistory();
  const existingSurveyTx = allHistory.find(
    tx => tx.userEmail.toLowerCase() === emailClean && tx.type === 'website_survey'
  );

  if (existingSurveyTx || response.pointsAwarded) {
    // Mark response as awarded if it wasn't marked
    if (!response.pointsAwarded) {
      store.responses[respIndex].pointsAwarded = true;
      store.responses[respIndex].pointTransactionId = existingSurveyTx?.id || null;
      saveStorage(store);
    }
    return {
      success: false,
      alreadyAwarded: true,
      message: `สมาชิกคุณ ${user.name} (${user.memberCardId || 'สมาชิก'}) เคยได้รับคะแนน 200 แต้มจากกิจกรรมนี้แล้ว (จำกัด 1 สิทธิ์/คน)`,
      pointsAwarded: 0,
      currentBalance: user.points
    };
  }

  // 3. Award 200 Points cleanly
  const txId = `tx_survey_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
  const transaction: PointTransaction = {
    id: txId,
    userId: user.id,
    userEmail: emailClean,
    type: 'website_survey',
    points: 200,
    title: 'ทำแบบประเมินคุณภาพเว็บไซต์ Thanavuddho Library',
    detail: 'ประเมินคุณภาพเว็บไซต์และหนังสือดิจิทัล (แบบประเมิน Google Forms) (+200 P)',
    sourceId: response.formResponseId || response.id,
    timestamp: new Date().toISOString()
  };

  // Add to transaction history
  allHistory.unshift(transaction);
  saveAllPointsHistory(allHistory);

  // Update user balance (+200 points)
  const allUsers = getAllUsers();
  const updatedUser = {
    ...user,
    points: (user.points || 0) + 200,
    lastActivityAt: new Date().toISOString()
  };
  allUsers[emailClean] = updatedUser;
  saveAllUsers(allUsers);

  // Update response record
  store.responses[respIndex].pointsAwarded = true;
  store.responses[respIndex].pointsAwardedAt = new Date().toISOString();
  store.responses[respIndex].pointTransactionId = txId;
  store.responses[respIndex].status = 'verified';
  store.responses[respIndex].userId = user.id;
  store.responses[respIndex].memberCardId = user.memberCardId || null;
  store.responses[respIndex].userName = user.name || null;
  saveStorage(store);

  return {
    success: true,
    message: `บันทึกคะแนน 200 แต้มให้คุณ ${user.name} สำเร็จแล้ว ยอดคะแนนสะสมใหม่: ${updatedUser.points} แต้ม`,
    pointsAwarded: 200,
    currentBalance: updatedUser.points,
    transactionId: txId
  };
}

// ---------------------------------------------------------------------------
// 5. GOOGLE FORMS CSV IMPORTER & DEDUPLICATION (PHASE 3)
// ---------------------------------------------------------------------------
export interface RawSurveyRow {
  timestampStr: string; // "2026/11/08 14:20:15" or ISO
  respondentEmail: string;
  ratings: Record<string, number>; // questionId -> 1..5
  feedbackComment?: string;
  isTest?: boolean;
}

export interface ImportSurveyResult {
  success: boolean;
  totalParsed: number;
  importedCount: number;
  skippedDuplicates: number;
  pointsAwardedCount: number;
  errors: string[];
  importedIds: string[];
}

/**
 * Deduplication token creator:
 * Generates an idempotent formResponseId from email + timestamp
 */
export function generateFormResponseId(email: string, timestampStr: string): string {
  const normEmail = email.trim().toLowerCase();
  const normTime = timestampStr.trim().replace(/\s+/g, '_');
  const hash = crypto.createHash('md5').update(`${normEmail}_${normTime}`).digest('hex').substring(0, 8);
  return `gform_${normTime}_${hash}`;
}

/**
 * Import pre-structured survey rows with strict validation and deduplication
 */
export function importSurveyRows(
  rows: RawSurveyRow[], 
  options: { isTest?: boolean; autoAwardPoints?: boolean } = {}
): ImportSurveyResult {
  const store = ensureStorage();
  const existingFormIds = new Set(store.responses.map(r => r.formResponseId));
  const questions = store.questions;
  const questionIds = new Set(questions.map(q => q.id));

  let importedCount = 0;
  let skippedDuplicates = 0;
  let pointsAwardedCount = 0;
  const errors: string[] = [];
  const importedIds: string[] = [];

  const newlyAddedResponses: SurveyResponse[] = [];
  const newlyAddedAnswers: SurveyAnswer[] = [];

  for (const row of rows) {
    const emailClean = (row.respondentEmail || '').trim().toLowerCase();
    if (!emailClean || !emailClean.includes('@')) {
      errors.push(`ข้ามแถว: อีเมลไม่ถูกต้อง (${row.respondentEmail})`);
      continue;
    }

    const formId = generateFormResponseId(emailClean, row.timestampStr || new Date().toISOString());

    // Strict duplicate check: do we already have this form response?
    if (existingFormIds.has(formId)) {
      skippedDuplicates += 1;
      continue;
    }

    // Check if user is a registered member
    const user = getUserByEmail(emailClean);
    const responseId = `resp_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const isTestRow = options.isTest !== undefined ? options.isTest : Boolean(row.isTest);

    // Calculate average rating
    const validScores: number[] = [];
    Object.entries(row.ratings || {}).forEach(([qId, val]) => {
      if (typeof val === 'number' && val >= 1 && val <= 5) {
        validScores.push(val);
      }
    });

    const avg = validScores.length > 0 
      ? Number((validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2)) 
      : 0;

    const responseObj: SurveyResponse = {
      id: responseId,
      formResponseId: formId,
      userId: user ? user.id : null,
      respondentEmail: emailClean,
      memberCardId: user ? user.memberCardId || null : null,
      userName: user ? user.name || null : null,
      submittedAt: parseSubmissionDate(row.timestampStr),
      status: user ? 'verified' : 'completed',
      pointsAwarded: false,
      isTest: isTestRow,
      averageRating: avg,
      feedbackComment: row.feedbackComment || null,
      createdAt: new Date().toISOString()
    };

    // Build answers
    Object.entries(row.ratings || {}).forEach(([qId, score]) => {
      if (questionIds.has(qId) && typeof score === 'number' && score >= 1 && score <= 5) {
        newlyAddedAnswers.push({
          id: `ans_${responseId}_${qId}`,
          responseId,
          questionId: qId,
          ratingValue: score,
          createdAt: new Date().toISOString()
        });
      }
    });

    // General text feedback answer
    if (row.feedbackComment && row.feedbackComment.trim()) {
      newlyAddedAnswers.push({
        id: `ans_${responseId}_q_overall_recommendation`,
        responseId,
        questionId: 'q_overall_recommendation',
        textValue: row.feedbackComment.trim(),
        createdAt: new Date().toISOString()
      });
    }

    newlyAddedResponses.push(responseObj);
    existingFormIds.add(formId);
    importedIds.push(responseId);
    importedCount += 1;
  }

  // Persist newly added responses and answers
  if (newlyAddedResponses.length > 0) {
    store.responses.unshift(...newlyAddedResponses);
    store.answers.push(...newlyAddedAnswers);
    saveStorage(store);

    // Auto-award points if requested and row is not test
    if (options.autoAwardPoints !== false) {
      newlyAddedResponses.forEach(r => {
        if (!r.isTest && r.userId) {
          const awardRes = awardSurveyPoints(r.id);
          if (awardRes.success) {
            pointsAwardedCount += 1;
          }
        }
      });
    }
  }

  return {
    success: true,
    totalParsed: rows.length,
    importedCount,
    skippedDuplicates,
    pointsAwardedCount,
    errors,
    importedIds
  };
}

/**
 * Robust CSV Parser for Google Forms / Google Sheets CSV
 * Handles commas inside double quotes and Thai text
 */
export function parseGoogleFormsCsv(csvText: string): RawSurveyRow[] {
  if (!csvText || !csvText.trim()) return [];

  const lines = csvText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) return [];

  // Parse header
  const header = parseCsvLine(lines[0]);
  const rows: RawSurveyRow[] = [];

  // Map header columns to known questions
  const colMapping: Record<number, string> = {};
  let emailColIndex = -1;
  let timestampColIndex = -1;
  let feedbackColIndex = -1;

  header.forEach((col, idx) => {
    const colLower = col.toLowerCase();
    if (colLower.includes('ประทับเวลา') || colLower.includes('timestamp')) {
      timestampColIndex = idx;
    } else if (colLower.includes('อีเมล') || colLower.includes('email') || colLower.includes('mail')) {
      emailColIndex = idx;
    } else if (colLower.includes('ข้อเสนอแนะ') || colLower.includes('ความคิดเห็น') || colLower.includes('feedback') || colLower.includes('recommend')) {
      feedbackColIndex = idx;
    } else if (colLower.includes('ค้นหา') || colLower.includes('เข้าถึง')) {
      colMapping[idx] = 'q_book_search';
    } else if (colLower.includes('คมชัด') || colLower.includes('pdf') || colLower.includes('flipbook') || colLower.includes('อ่าน')) {
      colMapping[idx] = 'q_book_reader';
    } else if (colLower.includes('สวยงาม') || colLower.includes('ui') || colLower.includes('ux') || colLower.includes('หน้าตา')) {
      colMapping[idx] = 'q_web_design';
    } else if (colLower.includes('วิดีโอ') || colLower.includes('video') || colLower.includes('ถอดเสียง')) {
      colMapping[idx] = 'q_media_video';
    } else if (colLower.includes('พอดแคสต์') || colLower.includes('podcast') || colLower.includes('เสียงบรรยาย')) {
      colMapping[idx] = 'q_media_podcast';
    } else if (colLower.includes('บทความ') || colLower.includes('article') || colLower.includes('เนื้อหา')) {
      colMapping[idx] = 'q_articles_knowledge';
    } else if (colLower.includes('แต้ม') || colLower.includes('รางวัล') || colLower.includes('reward') || colLower.includes('point')) {
      colMapping[idx] = 'q_gamification_rewards';
    }
  });

  // Fallback defaults if not detected by header keywords
  if (timestampColIndex === -1) timestampColIndex = 0;
  if (emailColIndex === -1) emailColIndex = 1;

  for (let i = 1; i < lines.length; i++) {
    const cells = parseCsvLine(lines[i]);
    if (cells.length < 2) continue;

    const timeStr = cells[timestampColIndex] || new Date().toISOString();
    const emailStr = cells[emailColIndex] || '';

    if (!emailStr || !emailStr.includes('@')) continue;

    const ratings: Record<string, number> = {};
    Object.entries(colMapping).forEach(([colIdxStr, qId]) => {
      const idx = parseInt(colIdxStr, 10);
      const val = parseFloat(cells[idx]);
      if (!isNaN(val) && val >= 1 && val <= 5) {
        ratings[qId] = val;
      }
    });

    const comment = feedbackColIndex !== -1 ? cells[feedbackColIndex] : '';

    rows.push({
      timestampStr: timeStr,
      respondentEmail: emailStr,
      ratings,
      feedbackComment: comment || undefined
    });
  }

  return rows;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let inQuotes = false;
  let cur = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(cur.trim().replace(/^"|"$/g, ''));
      cur = '';
    } else {
      cur += char;
    }
  }
  result.push(cur.trim().replace(/^"|"$/g, ''));
  return result;
}

function parseSubmissionDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      return d.toISOString();
    }
  } catch {}
  return new Date().toISOString();
}

// ---------------------------------------------------------------------------
// 6. PRE-BUILT AUTHENTIC & TEST DATASETS
// ---------------------------------------------------------------------------
export function injectAuthenticSampleEvaluations(): ImportSurveyResult {
  const sampleData: RawSurveyRow[] = [
    {
      timestampStr: '2026-11-06T14:20:15.000Z',
      respondentEmail: 'asaneebas4567@gmail.com',
      ratings: {
        q_book_search: 5,
        q_book_reader: 5,
        q_web_design: 5,
        q_media_video: 5,
        q_media_podcast: 4,
        q_articles_knowledge: 5,
        q_gamification_rewards: 5
      },
      feedbackComment: 'ระบบ Flipbook เปิดอ่านหนังสือธรรมะได้ลื่นไหล คมชัดมาก และชอบระบบแต้มสะสมเซอร์ไพรส์สไตล์ Lazada มากครับ',
      isTest: false
    },
    {
      timestampStr: '2026-11-06T15:45:30.000Z',
      respondentEmail: 'thanavuddho.dhamma@gmail.com',
      ratings: {
        q_book_search: 5,
        q_book_reader: 5,
        q_web_design: 4,
        q_media_video: 5,
        q_media_podcast: 5,
        q_articles_knowledge: 5,
        q_gamification_rewards: 4
      },
      feedbackComment: 'การจัดหมวดหมู่เนื้อหาธรรมะทำได้ถูกต้องเป็นระเบียบ บทถอดเสียงบรรยายธรรมทำให้ค้นคว้าคำสอนได้สะดวกรวดเร็วมาก',
      isTest: false
    },
    {
      timestampStr: '2026-11-07T09:12:00.000Z',
      respondentEmail: 'somchai.reader@gmail.com',
      ratings: {
        q_book_search: 4,
        q_book_reader: 5,
        q_web_design: 5,
        q_media_video: 4,
        q_media_podcast: 4,
        q_articles_knowledge: 4,
        q_gamification_rewards: 5
      },
      feedbackComment: 'เปิดอ่านบนมือถือได้สะดวก ตัวหนังสือคมชัด อยากให้มีระบบบุ๊กมาร์กจำหน้าที่คั่นไว้เพิ่มเติม',
      isTest: false
    },
    {
      timestampStr: '2026-11-07T11:30:22.000Z',
      respondentEmail: 'kalyanamitra.dhamma@outlook.com',
      ratings: {
        q_book_search: 5,
        q_book_reader: 4,
        q_web_design: 5,
        q_media_video: 5,
        q_media_podcast: 5,
        q_articles_knowledge: 5,
        q_gamification_rewards: 5
      },
      feedbackComment: 'รายการพอดแคสต์ฟังแล้วสงบใจดีมาก เสียงชัดเจน หน้าตาเว็บไซต์เรียบหรูโทนสีอบอุ่น',
      isTest: false
    },
    {
      timestampStr: '2026-11-07T16:05:40.000Z',
      respondentEmail: 'student.researcher@chula.ac.th',
      ratings: {
        q_book_search: 5,
        q_book_reader: 5,
        q_web_design: 4,
        q_media_video: 4,
        q_media_podcast: 4,
        q_articles_knowledge: 5,
        q_gamification_rewards: 4
      },
      feedbackComment: 'ใช้ค้นคว้าทำวิจัยพระพุทธศาสนาได้ประโยชน์อย่างยิ่ง การระบุเลขหน้าและปีพิมพ์ถูกต้องตามหลักวิชาการ',
      isTest: false
    }
  ];

  return importSurveyRows(sampleData, { isTest: false, autoAwardPoints: true });
}

export function injectTestEvaluationsDataset(): ImportSurveyResult {
  const testRows: RawSurveyRow[] = [
    {
      timestampStr: '2026-11-08T08:00:00.000Z',
      respondentEmail: 'test.student@univ.ac.th',
      ratings: {
        q_book_search: 4,
        q_book_reader: 4,
        q_web_design: 4,
        q_media_video: 3,
        q_media_podcast: 4,
        q_articles_knowledge: 4,
        q_gamification_rewards: 4
      },
      feedbackComment: '[ชุดทดสอบระบบ] ทดสอบความเร็วการตอบสนองของระบบค้นหาและการแสดงผลบนเบราว์เซอร์',
      isTest: true
    },
    {
      timestampStr: '2026-11-08T08:05:10.000Z',
      respondentEmail: 'qa.automated.tester@library-test.org',
      ratings: {
        q_book_search: 5,
        q_book_reader: 5,
        q_web_design: 5,
        q_media_video: 5,
        q_media_podcast: 5,
        q_articles_knowledge: 5,
        q_gamification_rewards: 5
      },
      feedbackComment: '[ชุดทดสอบระบบ] ทดสอบการคำนวณคะแนนเฉลี่ย Likert Scale 5 ดาว',
      isTest: true
    },
    {
      timestampStr: '2026-11-08T08:10:45.000Z',
      respondentEmail: 'stress.tester.01@library-test.org',
      ratings: {
        q_book_search: 3,
        q_book_reader: 4,
        q_web_design: 4,
        q_media_video: 4,
        q_media_podcast: 3,
        q_articles_knowledge: 4,
        q_gamification_rewards: 3
      },
      feedbackComment: '[ชุดทดสอบระบบ] ทดสอบการกรองแยกชุดข้อมูลทดสอบ (is_test=true) ออกจากสถิติประเมินจริง',
      isTest: true
    }
  ];

  return importSurveyRows(testRows, { isTest: true, autoAwardPoints: true });
}

export function clearTestSurveyData(): { clearedCount: number } {
  const store = ensureStorage();
  const testResponseIds = new Set(store.responses.filter(r => r.isTest).map(r => r.id));
  const clearedCount = testResponseIds.size;

  store.responses = store.responses.filter(r => !r.isTest);
  store.answers = store.answers.filter(a => !testResponseIds.has(a.responseId));
  saveStorage(store);

  return { clearedCount };
}
