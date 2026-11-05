import fs from 'fs';
import path from 'path';
import { BookEasterEggQuest, bookEasterEggQuests } from '@/data/bookEasterEggQuests';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const QUESTS_FILE = path.join(DATA_DIR, 'customQuests.json');

function ensureStorageExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(QUESTS_FILE)) {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

/**
 * อ่านรายการเควสที่สร้างขึ้นเองจาก Quest Editor
 */
export function getCustomQuests(): BookEasterEggQuest[] {
  ensureStorageExists();
  try {
    const raw = fs.readFileSync(QUESTS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to read customQuests.json:', err);
    return [];
  }
}

/**
 * บันทึกหรืออัปเดตเควส (หากมี ID เดิมจะแก้ไข หากไม่มีจะเพิ่มใหม่)
 */
export function saveCustomQuest(quest: BookEasterEggQuest): BookEasterEggQuest {
  ensureStorageExists();
  const list = getCustomQuests();
  const existingIdx = list.findIndex(q => q.id === quest.id);

  if (existingIdx >= 0) {
    list[existingIdx] = quest;
  } else {
    list.push(quest);
  }

  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write customQuests.json:', err);
  }

  return quest;
}

/**
 * ลบเควสที่กำหนดโดย ID
 */
export function deleteCustomQuest(questId: string): boolean {
  ensureStorageExists();
  const list = getCustomQuests();
  const filtered = list.filter(q => q.id !== questId);

  if (filtered.length === list.length) {
    return false; // ไม่พบเควส
  }

  try {
    fs.writeFileSync(QUESTS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed to delete custom quest:', err);
    return false;
  }
}

/**
 * รวมเควสประจำเล่มทั้งที่เป็น Built-in และที่สร้างเพิ่มใหม่
 */
export function getMergedBookQuests(bookId: string): BookEasterEggQuest[] {
  const builtIn = bookEasterEggQuests[bookId] || [];
  const custom = getCustomQuests().filter(q => q.bookId === bookId);

  // ให้เควส custom ทับหรือต่อท้าย built-in
  const customIds = new Set(custom.map(q => q.id));
  const merged = [
    ...builtIn.filter(q => !customIds.has(q.id)),
    ...custom
  ];

  // เรียงลำดับตาม triggerPage และ questNumber
  return merged.sort((a, b) => {
    if (a.triggerPage !== b.triggerPage) return a.triggerPage - b.triggerPage;
    return a.questNumber - b.questNumber;
  });
}

/**
 * ดึงเควสทั้งหมดจากทุกเล่ม (Built-in + Custom)
 */
export function getAllMergedQuests(): BookEasterEggQuest[] {
  const custom = getCustomQuests();
  const customIds = new Set(custom.map(q => q.id));

  const builtInAll: BookEasterEggQuest[] = [];
  for (const list of Object.values(bookEasterEggQuests)) {
    list.forEach(q => {
      if (!customIds.has(q.id)) {
        builtInAll.push(q);
      }
    });
  }

  return [...builtInAll, ...custom].sort((a, b) => a.triggerPage - b.triggerPage);
}
