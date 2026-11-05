import fs from 'fs';
import path from 'path';
import { getUserByEmail, updateUserLoansAndPoints, getAllUsers, saveAllUsers } from './serverUserStore';
import { UserSession } from '@/types/auth';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const REWARDS_CATALOG_FILE = path.join(DATA_DIR, 'rewardsCatalog.json');
const REDEMPTIONS_FILE = path.join(DATA_DIR, 'rewardRedemptions.json');
const POINTS_HISTORY_FILE = path.join(DATA_DIR, 'persistentPointsHistory.json');
const DAILY_ACTIVITY_FILE = path.join(DATA_DIR, 'userDailyActivity.json');
const MEDIA_PROGRESS_FILE = path.join(DATA_DIR, 'userMediaProgress.json');

export interface RewardItem {
  id: string;
  title: string;
  tier: 1000 | 2500 | 4000 | 5000 | 7000 | 10000;
  category: 'souvenir' | 'special_souvenir' | 'sacred_gift' | 'book' | 'signed_book' | 'vip';
  points: number;
  description: string;
  image: string;
  stock: number;
  isActive: boolean;
  requiresShipping: boolean;
  badge?: string;
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  rewardTitle: string;
  rewardImage: string;
  rewardCategory: string;
  pointsDeducted: number;
  userId: string;
  userEmail: string;
  userName: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
  status: 'pending' | 'approved' | 'shipped' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PointTransaction {
  id: string;
  userId: string;
  userEmail: string;
  type: 
    | 'read_chapter' 
    | 'read_book_finish' 
    | 'read_article' 
    | 'watch_video' 
    | 'listen_podcast' 
    | 'quiz_chapter' 
    | 'quiz_book_finish' 
    | 'redeem_reward' 
    | 'admin_adjust';
  points: number; // positive = earn, negative = spend
  title: string;
  detail?: string;
  sourceId?: string;
  timestamp: string;
}

export interface UserDailyActivity {
  date: string; // YYYY-MM-DD
  userEmail: string;
  chaptersRead: string[];
  articlesRead: string[];
  videoSeconds: number;
  audioSeconds: number;
  quizzesCompleted: string[];
  pointsEarnedToday: number; // Total points earned today (including quests/quizzes)
  dailyLearningPoints: number; // Points earned today specifically from daily learning activities (chapters, articles, videos, audio), max 100/day
}

export const DAILY_LEARNING_CAP = 100;

export interface MediaProgressRecord {
  currentCycleSeconds: number; // 0 to 600
  totalSeconds: number;
  completedCycles: number;
  lastActive: string;
}

// ---------------------------------------------------------
// Helper: File Reads & Writes
// ---------------------------------------------------------
function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
    return fallback;
  }
}

function writeJson(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

// ---------------------------------------------------------
// Rewards Catalog
// ---------------------------------------------------------
export function getRewardsCatalog(): RewardItem[] {
  return readJson<RewardItem[]>(REWARDS_CATALOG_FILE, []);
}

export function saveRewardsCatalog(catalog: RewardItem[]) {
  writeJson(REWARDS_CATALOG_FILE, catalog);
}

// ---------------------------------------------------------
// Redemptions
// ---------------------------------------------------------
export function getAllRedemptions(): RewardRedemption[] {
  return readJson<RewardRedemption[]>(REDEMPTIONS_FILE, []);
}

export function saveAllRedemptions(redemptions: RewardRedemption[]) {
  writeJson(REDEMPTIONS_FILE, redemptions);
}

export function getUserRedemptions(userEmail: string): RewardRedemption[] {
  const all = getAllRedemptions();
  const emailLower = userEmail.toLowerCase();
  return all
    .filter(r => r.userEmail.toLowerCase() === emailLower)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

// ---------------------------------------------------------
// Points Transactions History
// ---------------------------------------------------------
export function getAllPointsHistory(): PointTransaction[] {
  return readJson<PointTransaction[]>(POINTS_HISTORY_FILE, []);
}

export function saveAllPointsHistory(history: PointTransaction[]) {
  writeJson(POINTS_HISTORY_FILE, history);
}

export function getUserPointsHistory(userEmail: string): PointTransaction[] {
  const all = getAllPointsHistory();
  const emailLower = userEmail.toLowerCase();
  return all
    .filter(h => h.userEmail.toLowerCase() === emailLower)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

// ---------------------------------------------------------
// Daily Activity Store
// ---------------------------------------------------------
export function getAllDailyActivities(): Record<string, UserDailyActivity> {
  return readJson<Record<string, UserDailyActivity>>(DAILY_ACTIVITY_FILE, {});
}

export function saveAllDailyActivities(data: Record<string, UserDailyActivity>) {
  writeJson(DAILY_ACTIVITY_FILE, data);
}

export function getUserDailyActivity(userEmail: string, dateStr: string = getTodayDateString()): UserDailyActivity {
  const all = getAllDailyActivities();
  const key = `${userEmail.toLowerCase()}_${dateStr}`;
  if (all[key]) {
    const act = all[key];
    if (act.dailyLearningPoints === undefined) {
      act.dailyLearningPoints = Math.min(DAILY_LEARNING_CAP, act.pointsEarnedToday || 0);
    }
    return act;
  }
  return {
    date: dateStr,
    userEmail: userEmail.toLowerCase(),
    chaptersRead: [],
    articlesRead: [],
    videoSeconds: 0,
    audioSeconds: 0,
    quizzesCompleted: [],
    pointsEarnedToday: 0,
    dailyLearningPoints: 0
  };
}

export function updateUserDailyActivity(userEmail: string, update: Partial<UserDailyActivity>) {
  const all = getAllDailyActivities();
  const dateStr = getTodayDateString();
  const key = `${userEmail.toLowerCase()}_${dateStr}`;
  const current = getUserDailyActivity(userEmail, dateStr);

  const updated: UserDailyActivity = {
    ...current,
    ...update,
    chaptersRead: update.chaptersRead || current.chaptersRead,
    articlesRead: update.articlesRead || current.articlesRead,
    quizzesCompleted: update.quizzesCompleted || current.quizzesCompleted
  };

  all[key] = updated;
  saveAllDailyActivities(all);
  return updated;
}

// ---------------------------------------------------------
// Media Progress (Video & Podcast / Audio Watch-to-Earn)
// ---------------------------------------------------------
export function getAllMediaProgress(): Record<string, MediaProgressRecord> {
  return readJson<Record<string, MediaProgressRecord>>(MEDIA_PROGRESS_FILE, {});
}

export function saveAllMediaProgress(data: Record<string, MediaProgressRecord>) {
  writeJson(MEDIA_PROGRESS_FILE, data);
}

export function getUserMediaProgress(userEmail: string, mediaType: 'video' | 'audio'): MediaProgressRecord {
  const all = getAllMediaProgress();
  const key = `${userEmail.toLowerCase()}_${mediaType}`;
  return all[key] || {
    currentCycleSeconds: 0,
    totalSeconds: 0,
    completedCycles: 0,
    lastActive: new Date().toISOString()
  };
}

// ---------------------------------------------------------
// Core Business Logic: Record Earn Event
// ---------------------------------------------------------
export interface EarnEventParams {
  userEmail: string;
  type: 
    | 'read_chapter' 
    | 'read_book_finish' 
    | 'read_article' 
    | 'watch_video' 
    | 'listen_podcast' 
    | 'quiz_chapter' 
    | 'quiz_book_finish';
  sourceId?: string; // e.g. book_mongkol_chiwit_124, article_001
  chapterIndex?: number;
  chapterTitle?: string;
  chapterPageCount?: number;
  durationSeconds?: number; // for heartbeat
}

export interface EarnEventResult {
  success: boolean;
  pointsEarned: number;
  currentBalance: number;
  alreadyEarned?: boolean;
  dailyCapReached?: boolean;
  dailyLearningPoints?: number;
  dailyLearningCap?: number;
  remainingDailyQuota?: number;
  message: string;
  mediaProgress?: {
    currentCycleSeconds: number;
    targetSeconds: number;
    remainingSeconds: number;
    completedCycles: number;
    cycleJustFinished: boolean;
  };
}

export function processEarnPoints(params: EarnEventParams): EarnEventResult {
  const emailLower = params.userEmail.toLowerCase();
  const existingUser = getUserByEmail(emailLower);
  let user: UserSession;

  if (existingUser) {
    user = existingUser;
  } else {
    const allUsers = getAllUsers();
    user = {
      id: `usr_${Date.now()}`,
      memberCardId: `GUEST-${Math.floor(1000 + Math.random() * 9000)}`,
      email: emailLower,
      name: emailLower.startsWith('guest_') ? 'ผู้ศึกษาธรรม' : emailLower.split('@')[0],
      picture: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(emailLower)}`,
      email_verified: false,
      points: 0,
      loans: [],
      boundType: 'email',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString()
    };
    allUsers[emailLower] = user;
    saveAllUsers(allUsers);
  }

  const allHistory = getAllPointsHistory();
  const dateStr = getTodayDateString();
  const daily = getUserDailyActivity(emailLower, dateStr);

  let pointsToAward = 0;
  let transactionTitle = '';
  let transactionDetail = '';
  let mediaProgressData: EarnEventResult['mediaProgress'] | undefined = undefined;

  // 1. Book Chapter Reading
  if (params.type === 'read_chapter') {
    const chapterKey = `${params.sourceId}_ch_${params.chapterIndex}`;
    // Check if already claimed
    const existing = allHistory.find(h => 
      h.userEmail.toLowerCase() === emailLower && 
      h.type === 'read_chapter' && 
      h.sourceId === chapterKey
    );
    if (existing) {
      return {
        success: true,
        pointsEarned: 0,
        currentBalance: user.points,
        alreadyEarned: true,
        message: 'ท่านเคยได้รับคะแนนจากการอ่านบทนี้แล้ว'
      };
    }

    // Determine points by chapter page count
    const pages = params.chapterPageCount || 10;
    if (pages <= 10) pointsToAward = 5;
    else if (pages <= 25) pointsToAward = 8;
    else if (pages <= 50) pointsToAward = 12;
    else pointsToAward = 15;

    transactionTitle = `อ่านจบบท: ${params.chapterTitle || `บทที่ ${params.chapterIndex || 1}`}`;
    transactionDetail = `ความยาวบท ${pages} หน้า (+${pointsToAward} P)`;

    if (!daily.chaptersRead.includes(chapterKey)) {
      daily.chaptersRead.push(chapterKey);
    }
  }

  // 2. Book Finish Bonus
  else if (params.type === 'read_book_finish') {
    const bookFinishKey = `${params.sourceId}_finished`;
    const existing = allHistory.find(h => 
      h.userEmail.toLowerCase() === emailLower && 
      h.type === 'read_book_finish' && 
      h.sourceId === bookFinishKey
    );
    if (existing) {
      return {
        success: true,
        pointsEarned: 0,
        currentBalance: user.points,
        alreadyEarned: true,
        message: 'ท่านเคยได้รับโบนัสอ่านจบเล่มนี้แล้ว'
      };
    }
    pointsToAward = 50;
    transactionTitle = `โบนัสพิเศษ: อ่านจบหนังสือทั้งเล่ม`;
    transactionDetail = `สำเร็จการอ่านหนังสือ ${params.sourceId} ครบทุกหน้า (+50 P)`;
  }

  // 3. Article Reading
  else if (params.type === 'read_article') {
    const articleKey = params.sourceId || 'article_generic';
    const existing = allHistory.find(h => 
      h.userEmail.toLowerCase() === emailLower && 
      h.type === 'read_article' && 
      h.sourceId === articleKey
    );
    if (existing) {
      return {
        success: true,
        pointsEarned: 0,
        currentBalance: user.points,
        alreadyEarned: true,
        message: 'ท่านเคยได้รับคะแนนจากการอ่านบทความนี้แล้ว'
      };
    }
    pointsToAward = 2;
    transactionTitle = `อ่านจบบทความ: ${params.chapterTitle || 'บทความธรรมะ'}`;
    transactionDetail = `อ่านเนื้อหาครบถ้วนตามเกณฑ์ (+2 P)`;

    if (!daily.articlesRead.includes(articleKey)) {
      daily.articlesRead.push(articleKey);
    }
  }

  // 4. Chapter Quiz
  else if (params.type === 'quiz_chapter') {
    const quizKey = params.sourceId || 'quiz_generic';
    const existing = allHistory.find(h => 
      h.userEmail.toLowerCase() === emailLower && 
      h.type === 'quiz_chapter' && 
      h.sourceId === quizKey
    );
    if (existing) {
      return {
        success: true,
        pointsEarned: 0,
        currentBalance: user.points,
        alreadyEarned: true,
        message: 'ท่านเคยได้รับคะแนนจากแบบทดสอบนี้แล้ว'
      };
    }
    // Mongkol quests award 10 points as requested; other chapter quizzes award 5 points
    const isMongkol = quizKey.includes('mongkol');
    pointsToAward = isMongkol ? 10 : 5;
    transactionTitle = `ผ่านแบบทดสอบ: ${params.chapterTitle || 'เควสธรรมะ'}`;
    transactionDetail = `ตอบคำถามผ่านเกณฑ์ (+${pointsToAward} P)`;

    if (!daily.quizzesCompleted.includes(quizKey)) {
      daily.quizzesCompleted.push(quizKey);
    }
  }

  // 5. Book Finish Quiz
  else if (params.type === 'quiz_book_finish') {
    const quizKey = `${params.sourceId}_final_quiz`;
    const existing = allHistory.find(h => 
      h.userEmail.toLowerCase() === emailLower && 
      h.type === 'quiz_book_finish' && 
      h.sourceId === quizKey
    );
    if (existing) {
      return {
        success: true,
        pointsEarned: 0,
        currentBalance: user.points,
        alreadyEarned: true,
        message: 'ท่านเคยได้รับคะแนนจากแบบทดสอบท้ายเล่มนี้แล้ว'
      };
    }
    pointsToAward = 30;
    transactionTitle = `โบนัสผ่านแบบทดสอบท้ายเล่ม`;
    transactionDetail = `ทดสอบความเข้าใจครบถ้วน (+30 P)`;
  }

  // 6 & 7. Melolo-style Video / Audio Watch/Listen to Earn
  else if (params.type === 'watch_video' || params.type === 'listen_podcast') {
    const mediaType = params.type === 'watch_video' ? 'video' : 'audio';
    const allMedia = getAllMediaProgress();
    const mediaKey = `${emailLower}_${mediaType}`;
    const record = allMedia[mediaKey] || {
      currentCycleSeconds: 0,
      totalSeconds: 0,
      completedCycles: 0,
      lastActive: new Date().toISOString()
    };

    // Incremental heartbeat seconds (defensive limit: 1 to 30 seconds per ping)
    const incSeconds = Math.min(30, Math.max(1, params.durationSeconds || 15));
    record.currentCycleSeconds += incSeconds;
    record.totalSeconds += incSeconds;
    record.lastActive = new Date().toISOString();

    if (mediaType === 'video') {
      daily.videoSeconds += incSeconds;
    } else {
      daily.audioSeconds += incSeconds;
    }

    let cycleJustFinished = false;
    // TARGET: 10 minutes = 600 seconds
    const TARGET_CYCLE = 600;

    if (record.currentCycleSeconds >= TARGET_CYCLE) {
      record.currentCycleSeconds -= TARGET_CYCLE;
      record.completedCycles += 1;
      pointsToAward = 5;
      cycleJustFinished = true;

      const mediaName = mediaType === 'video' ? 'วิดีโอธรรมะ' : 'พอดแคสต์ธรรมะ';
      transactionTitle = `รับชม/รับฟัง${mediaName}ครบ 10 นาที`;
      transactionDetail = `สะสมเวลารับชมครบ 10 นาทีตามกติกา Thanavuddho Learning Points (+5 P)`;
    }

    allMedia[mediaKey] = record;
    saveAllMediaProgress(allMedia);

    mediaProgressData = {
      currentCycleSeconds: record.currentCycleSeconds,
      targetSeconds: TARGET_CYCLE,
      remainingSeconds: Math.max(0, TARGET_CYCLE - record.currentCycleSeconds),
      completedCycles: record.completedCycles,
      cycleJustFinished
    };
  }

  const isDailyLearningActivity = ['read_chapter', 'read_article', 'watch_video', 'listen_podcast'].includes(params.type);

  // Daily learning cap enforcement (Max 100 P / day for casual learning activities without answering questions)
  if (pointsToAward > 0 && isDailyLearningActivity) {
    const currentDailyLearning = daily.dailyLearningPoints || 0;
    const remainingQuota = Math.max(0, DAILY_LEARNING_CAP - currentDailyLearning);

    if (remainingQuota <= 0) {
      // User has reached the 100 P daily limit
      pointsToAward = 0;

      // Update daily activity record so progress/timestamp is saved
      const allDaily = getAllDailyActivities();
      allDaily[`${emailLower}_${dateStr}`] = daily;
      saveAllDailyActivities(allDaily);

      const refreshedUser = getUserByEmail(emailLower);

      return {
        success: true,
        pointsEarned: 0,
        currentBalance: refreshedUser ? refreshedUser.points : user.points,
        dailyCapReached: true,
        dailyLearningPoints: daily.dailyLearningPoints || 0,
        dailyLearningCap: DAILY_LEARNING_CAP,
        remainingDailyQuota: 0,
        message: 'คุณสะสมคะแนนกิจกรรมการเรียนรู้ประจำวันครบโควตา 100 P ของวันนี้แล้ว! (พรุ่งนี้มาร่วมเรียนรู้ใหม่นะ)',
        mediaProgress: mediaProgressData
      };
    } else if (pointsToAward > remainingQuota) {
      // Award partial points to hit exactly 100 P cap
      const originalPoints = pointsToAward;
      pointsToAward = remainingQuota;
      transactionDetail = `${transactionDetail} (จำกัดโควตาประจำวัน 100 P ได้รับเพิ่ม +${pointsToAward} P จากปกติ ${originalPoints} P)`;
    }
  }

  // If points were earned, record transaction & update user
  if (pointsToAward > 0) {
    const newTransaction: PointTransaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      userId: user.id,
      userEmail: emailLower,
      type: params.type,
      points: pointsToAward,
      title: transactionTitle,
      detail: transactionDetail,
      sourceId: params.sourceId,
      timestamp: new Date().toISOString()
    };

    allHistory.unshift(newTransaction);
    saveAllPointsHistory(allHistory);

    updateUserLoansAndPoints(emailLower, user.loans || [], pointsToAward);
    daily.pointsEarnedToday = (daily.pointsEarnedToday || 0) + pointsToAward;

    if (isDailyLearningActivity) {
      daily.dailyLearningPoints = (daily.dailyLearningPoints || 0) + pointsToAward;
    }
  }

  // Update daily activity
  const allDaily = getAllDailyActivities();
  allDaily[`${emailLower}_${dateStr}`] = daily;
  saveAllDailyActivities(allDaily);

  // Read updated user points
  const refreshedUser = getUserByEmail(emailLower);
  const currentLearning = daily.dailyLearningPoints || 0;
  const isCapReached = currentLearning >= DAILY_LEARNING_CAP;

  return {
    success: true,
    pointsEarned: pointsToAward,
    currentBalance: refreshedUser ? refreshedUser.points : user.points + pointsToAward,
    dailyCapReached: isCapReached,
    dailyLearningPoints: currentLearning,
    dailyLearningCap: DAILY_LEARNING_CAP,
    remainingDailyQuota: Math.max(0, DAILY_LEARNING_CAP - currentLearning),
    message: pointsToAward > 0 
      ? (isCapReached && isDailyLearningActivity
          ? `ยินดีด้วย! คุณได้รับ +${pointsToAward} แต้ม และสะสมครบโควตากิจกรรม 100 P ของวันนี้แล้ว 🎉` 
          : `ยินดีด้วย! คุณได้รับ +${pointsToAward} แต้ม (วันนี้สะสมแล้ว ${currentLearning}/${DAILY_LEARNING_CAP} P)`)
      : 'บันทึกความคืบหน้าแล้ว',
    mediaProgress: mediaProgressData
  };
}

// ---------------------------------------------------------
// Redeem Reward Logic
// ---------------------------------------------------------
export interface RedeemRewardParams {
  userEmail: string;
  rewardId: string;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  note?: string;
}

export interface RedeemRewardResult {
  success: boolean;
  message: string;
  redemption?: RewardRedemption;
  remainingPoints?: number;
}

export function redeemReward(params: RedeemRewardParams): RedeemRewardResult {
  const emailLower = params.userEmail.toLowerCase();
  const user = getUserByEmail(emailLower);
  if (!user) {
    return { success: false, message: 'ไม่พบผู้ใช้ในระบบ กรุณาเข้าสู่ระบบก่อนทำการแลกรางวัล' };
  }

  const catalog = getRewardsCatalog();
  const rewardIndex = catalog.findIndex(r => r.id === params.rewardId);
  if (rewardIndex === -1) {
    return { success: false, message: 'ไม่พบของรางวัลที่เลือก' };
  }

  const reward = catalog[rewardIndex];
  if (!reward.isActive) {
    return { success: false, message: 'ของรางวัลรายการนี้ปิดการแลกชั่วคราว' };
  }

  if (reward.stock <= 0) {
    return { success: false, message: 'ขออภัย ของรางวัลนี้หมดสต็อกชั่วคราว' };
  }

  if (user.points < reward.points) {
    const needed = reward.points - user.points;
    return { 
      success: false, 
      message: `คะแนนสะสมไม่เพียงพอ (ต้องการ ${reward.points.toLocaleString()} P, คุณมี ${user.points.toLocaleString()} P ขาดอีก ${needed.toLocaleString()} P)` 
    };
  }

  // Atomic deduction
  catalog[rewardIndex].stock -= 1;
  saveRewardsCatalog(catalog);

  // Create Redemption Record
  const redemption: RewardRedemption = {
    id: `rdm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    rewardId: reward.id,
    rewardTitle: reward.title,
    rewardImage: reward.image,
    rewardCategory: reward.category,
    pointsDeducted: reward.points,
    userId: user.id,
    userEmail: emailLower,
    userName: user.name,
    recipientName: params.recipientName.trim(),
    recipientPhone: params.recipientPhone.trim(),
    shippingAddress: params.shippingAddress.trim(),
    note: params.note?.trim(),
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const redemptions = getAllRedemptions();
  redemptions.unshift(redemption);
  saveAllRedemptions(redemptions);

  // Record point spend in history
  const allHistory = getAllPointsHistory();
  const tx: PointTransaction = {
    id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    userId: user.id,
    userEmail: emailLower,
    type: 'redeem_reward',
    points: -reward.points,
    title: `แลกของรางวัล: ${reward.title}`,
    detail: `หักคะแนนสำหรับคำสั่งแลกรางวัล #${redemption.id}`,
    sourceId: reward.id,
    timestamp: new Date().toISOString()
  };
  allHistory.unshift(tx);
  saveAllPointsHistory(allHistory);

  // Deduct user balance
  updateUserLoansAndPoints(emailLower, user.loans || [], -reward.points);
  const refreshedUser = getUserByEmail(emailLower);

  return {
    success: true,
    message: `แลกของรางวัลสำเร็จแล้ว! ทางระบบจะดำเนินการตรวจสอบและจัดส่งให้ต่อไป`,
    redemption,
    remainingPoints: refreshedUser ? refreshedUser.points : user.points - reward.points
  };
}

// ---------------------------------------------------------
// Admin Helpers
// ---------------------------------------------------------
export function updateRedemptionStatus(
  redemptionId: string, 
  status: 'pending' | 'approved' | 'shipped' | 'cancelled',
  trackingNumber?: string
): RewardRedemption | null {
  const redemptions = getAllRedemptions();
  const rIdx = redemptions.findIndex(r => r.id === redemptionId);
  if (rIdx === -1) return null;

  redemptions[rIdx].status = status;
  if (trackingNumber !== undefined) {
    redemptions[rIdx].trackingNumber = trackingNumber;
  }
  redemptions[rIdx].updatedAt = new Date().toISOString();
  saveAllRedemptions(redemptions);

  return redemptions[rIdx];
}

export function updateCatalogRewardItem(item: RewardItem): RewardItem {
  const catalog = getRewardsCatalog();
  const idx = catalog.findIndex(r => r.id === item.id);
  if (idx !== -1) {
    catalog[idx] = item;
  } else {
    catalog.push(item);
  }
  saveRewardsCatalog(catalog);
  return item;
}
