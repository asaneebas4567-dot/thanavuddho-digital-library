import { VideoKnowledgeItem, UnansweredQueryLog } from '@/types';
import fallbackData from './persistentVideoKnowledge.json';

interface StorageSchema {
  version: string;
  lastUpdated: string;
  videos: VideoKnowledgeItem[];
  unansweredQueriesLog: UnansweredQueryLog[];
}

function getFs() {
  if (typeof window === 'undefined') {
    try {
      return eval('require')('fs');
    } catch {
      return null;
    }
  }
  return null;
}

function getPath() {
  if (typeof window === 'undefined') {
    try {
      return eval('require')('path');
    } catch {
      return null;
    }
  }
  return null;
}

function getDataFilePath(): string | null {
  const pathModule = getPath();
  if (!pathModule) return null;
  return pathModule.join(process.cwd(), 'src', 'data', 'persistentVideoKnowledge.json');
}

function readStorage(): StorageSchema {
  const fsModule = getFs();
  const filePath = getDataFilePath();

  if (fsModule && filePath) {
    try {
      if (fsModule.existsSync(filePath)) {
        const raw = fsModule.readFileSync(filePath, 'utf8');
        return JSON.parse(raw) as StorageSchema;
      }
    } catch (err) {
      console.error('Error reading persistentVideoKnowledge.json:', err);
    }
  }

  return fallbackData as StorageSchema;
}

function writeStorage(data: StorageSchema): boolean {
  const fsModule = getFs();
  const filePath = getDataFilePath();

  if (fsModule && filePath) {
    try {
      data.lastUpdated = new Date().toISOString();
      fsModule.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
      return true;
    } catch (err) {
      console.error('Error writing persistentVideoKnowledge.json:', err);
      return false;
    }
  }

  return false;
}

/**
 * ดึงรายการ Video Knowledge ทั้งหมดในระบบ
 */
export function getAllVideoKnowledge(): VideoKnowledgeItem[] {
  const data = readStorage();
  return data.videos || [];
}

/**
 * ดึงวิดีโอตาม ID
 */
export function getVideoKnowledgeById(id: string): VideoKnowledgeItem | undefined {
  const videos = getAllVideoKnowledge();
  return videos.find(v => v.id === id || v.youtubeId === id);
}

/**
 * บันทึกหรืออัปเดตวิดีโอในคลัง
 */
export function saveVideoKnowledgeItem(item: VideoKnowledgeItem): VideoKnowledgeItem {
  const data = readStorage();
  const index = data.videos.findIndex(v => v.id === item.id || (item.youtubeId && v.youtubeId === item.youtubeId));

  if (index >= 0) {
    data.videos[index] = {
      ...data.videos[index],
      ...item,
      publishedDate: item.publishedDate || data.videos[index].publishedDate
    };
  } else {
    data.videos.unshift(item);
  }

  writeStorage(data);
  return item;
}

/**
 * ลบวิดีโอออกจากคลัง
 */
export function deleteVideoKnowledgeItem(id: string): boolean {
  const data = readStorage();
  const initialLen = data.videos.length;
  data.videos = data.videos.filter(v => v.id !== id && v.youtubeId !== id);

  if (data.videos.length !== initialLen) {
    writeStorage(data);
    return true;
  }
  return false;
}

/**
 * เพิ่มสถิติจำนวนครั้งที่วิดีโอถูกแนะนำให้กับผู้ใช้
 */
export function incrementVideoRecommendCount(id: string): void {
  const data = readStorage();
  const target = data.videos.find(v => v.id === id || v.youtubeId === id);
  if (target) {
    target.recommendCount = (target.recommendCount || 0) + 1;
    target.lastRecommendedAt = new Date().toISOString();
    writeStorage(data);
  }
}

/**
 * บันทึกคำถามที่ระบบไม่สามารถค้นหาคำตอบหรือวิดีโอที่มั่นใจได้ (Situation D)
 */
export function logUnansweredQuery(query: string): void {
  const cleanQ = (query || '').trim();
  if (!cleanQ || cleanQ.length < 3) return;

  const data = readStorage();
  if (!data.unansweredQueriesLog) {
    data.unansweredQueriesLog = [];
  }

  const existing = data.unansweredQueriesLog.find(q => q.query.toLowerCase() === cleanQ.toLowerCase());
  if (existing) {
    existing.hitCount = (existing.hitCount || 1) + 1;
    existing.timestamp = new Date().toISOString();
  } else {
    data.unansweredQueriesLog.unshift({
      id: `uq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      query: cleanQ,
      timestamp: new Date().toISOString(),
      hitCount: 1,
      resolved: false
    });
  }

  writeStorage(data);
}

/**
 * ดึงรายการคำถามที่ระบบตอบไม่ได้
 */
export function getUnansweredQueries(): UnansweredQueryLog[] {
  const data = readStorage();
  return data.unansweredQueriesLog || [];
}

/**
 * ปรับสถานะคำถามว่าได้รับการเพิ่มเนื้อหาแล้ว
 */
export function resolveUnansweredQuery(id: string): boolean {
  const data = readStorage();
  const target = (data.unansweredQueriesLog || []).find(q => q.id === id);
  if (target) {
    target.resolved = true;
    writeStorage(data);
    return true;
  }
  return false;
}

/**
 * ลบประวัติคำถาม
 */
export function deleteUnansweredQuery(id: string): boolean {
  const data = readStorage();
  const initLen = (data.unansweredQueriesLog || []).length;
  data.unansweredQueriesLog = (data.unansweredQueriesLog || []).filter(q => q.id !== id);
  if (data.unansweredQueriesLog.length !== initLen) {
    writeStorage(data);
    return true;
  }
  return false;
}
