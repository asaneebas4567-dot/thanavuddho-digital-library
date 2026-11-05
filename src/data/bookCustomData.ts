import { Quiz } from '@/types';
import { books } from '@/data/mockData';

/**
 * ไฟล์สำหรับกรอกเนื้อหาสารบัญบทเรียน และคำถามแบบทดสอบประจำแต่ละเล่ม
 * คุณสามารถเพิ่มคำถามและสารบัญของหนังสือแต่ละเล่มได้ที่นี่
 */

export interface BookChapterItem {
  chapter_number: number;
  title: string;
  page_start?: number;
  page_end?: number;
  description?: string;
}

export interface BookQuestionItem {
  id?: string;
  question: string;
  options: [string, string, string, string]; // 4 ตัวเลือก: [ก, ข, ค, ง]
  correct_index: number; // 0 = ก, 1 = ข, 2 = ค, 3 = ง
  explanation?: string; // คำอธิบายเฉลยเหตุผล
}

export interface BookCustomEntry {
  book_id: string;
  chapters?: BookChapterItem[];
  questions?: BookQuestionItem[];
}

/**
 * คลังข้อมูลบทเรียนและคำถามของแต่ละเล่มที่ผู้ใช้กรอก
 * หากเล่มไหนยังไม่ได้ใส่ข้อมูล ระบบจะแสดงเฉพาะภาพรวมและปุ่มอ่านฉบับเต็มอย่างสวยงาม โดยไม่แสดงข้อมูลหลอก
 */
export const bookCustomData: Record<string, BookCustomEntry> = {
  'book_mongkol_chiwit_124': {
    book_id: 'book_mongkol_chiwit_124',
    chapters: [
      { chapter_number: 0, title: 'สารบัญ & บทนำฉบับทางก้าวหน้า', page_start: 1, page_end: 36, description: 'หน้าสารบัญ คำนำ และวิธีใช้หนังสือ (PDF 1–36)' },
      { chapter_number: 1, title: 'มงคลที่ 1: การไม่คบคนพาล (หนังสือ น. 12–21)', page_start: 37, page_end: 46, description: 'พฤติกรรมการคบ 3 ระดับ และพาลภายในตนเอง' },
      { chapter_number: 2, title: 'มงคลที่ 2: การคบบัณฑิต (หนังสือ น. 22–27)', page_start: 47, page_end: 52, description: 'ลักษณะบัณฑิตแท้และการเลือกกัลยาณมิตร' },
      { chapter_number: 3, title: 'มงคลที่ 3: การบูชาบุคคลที่ควรบูชา (หนังสือ น. 28–33)', page_start: 53, page_end: 58, description: 'การแสดงความเคารพและการปฏิบัติบูชา' },
      { chapter_number: 4, title: 'มงคลที่ 4: อยู่ในถิ่นที่เหมาะสม [เควสตำนาน] (หนังสือ น. 34–41)', page_start: 59, page_end: 66, description: 'ถิ่นสบาย 4 ด้านและการจัดลำดับความสำคัญ' },
      { chapter_number: 5, title: 'มงคลที่ 8: มีศิลปะ (หนังสือ น. 64–70)', page_start: 89, page_end: 95, description: 'ศิลปะคิดเป็น พูดเป็น ทำเป็น และปริศนาผลมะม่วง' },
      { chapter_number: 6, title: 'มงคลที่ 9: มีวินัย (หนังสือ น. 71–81)', page_start: 96, page_end: 106, description: 'วินัยทางโลก ศีล 5 และวินัยทางธรรมของนักบวช' },
      { chapter_number: 7, title: 'มงคลที่ 10: มีวาจาสุภาษิต (หนังสือ น. 82–93)', page_start: 107, page_end: 118, description: 'ลักษณะเสียง 8 ประการของมหาบุรุษ' },
      { chapter_number: 8, title: 'มงคลที่ 13: สงเคราะห์ภรรยา-สามี [เควสตำนาน] (หนังสือ น. 111–118)', page_start: 136, page_end: 143, description: 'รากศัพท์สามี-ภรรยา และสมชีวิธรรม 4' },
      { chapter_number: 9, title: 'มงคลที่ 14: ทำงานไม่คั่งค้าง (หนังสือ น. 119–125)', page_start: 144, page_end: 150, description: 'อิทธิบาท 4 สลายความเกียจคร้านและงานคั่งค้าง' },
      { chapter_number: 10, title: 'มงคลที่ 18: ทำงานไม่มีโทษ (หนังสือ น. 153–162)', page_start: 178, page_end: 187, description: 'งานไม่มีโทษ 4 สถาน และมิจฉาวณิชชา 5 อาชีพต้องห้าม' },
    ]
  }
};

/**
 * ดึงข้อมูลที่กำหนดเองของหนังสือเล่มที่ระบุ
 */
export function getBookCustomContent(bookId: string): BookCustomEntry | null {
  return bookCustomData[bookId] || null;
}

/**
 * แปลงคำถามที่ผู้ใช้กรอกในแต่ละเล่ม ให้กลายเป็นแบบทดสอบในระบบ Quiz ของเว็บโดยอัตโนมัติ
 */
export function getCustomBookQuizzes(): Quiz[] {
  const result: Quiz[] = [];

  for (const [bookId, entry] of Object.entries(bookCustomData)) {
    if (entry.questions && entry.questions.length > 0) {
      const foundBook = books.find(b => b.id === bookId);
      const title = foundBook?.title || bookId;

      result.push({
        id: `quiz-custom-${bookId}`,
        title: `แบบทดสอบประจำเล่ม: ${title}`,
        description: `ทดสอบประเมินความเข้าใจเนื้อหาจากหนังสือ "${title}"`,
        level: 'book',
        level_label: 'ระดับที่ 2: จบ 1 เล่ม (Book Quiz)',
        target_id: bookId,
        target_title: title,
        time_limit_minutes: Math.max(5, entry.questions.length * 2),
        xp_reward: entry.questions.length * 25,
        passing_score: 70,
        badge_id: 'badge-book-master',
        questions: entry.questions.map((q, idx) => ({
          id: q.id || `q-${bookId}-${idx + 1}`,
          question: q.question,
          options: q.options,
          correct_index: q.correct_index,
          explanation: q.explanation || 'เฉลยตามหลักเนื้อหาในหนังสือ',
          source_ref: `หนังสือ ${title}`
        }))
      });
    }
  }

  return result;
}
