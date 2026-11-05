import fs from 'fs';
import path from 'path';

// Read batch 1
const batch1File = fs.readFileSync(path.join(process.cwd(), 'scripts', 'generate_all_mongkol_quests.mjs'), 'utf-8');
const batch2File = fs.readFileSync(path.join(process.cwd(), 'scripts', 'generate_part2.mjs'), 'utf-8');

// Evaluate batches
const getBatch1 = new Function(batch1File.replace('import fs from \'fs\';', '').replace('import path from \'path\';', '') + '\nreturn allMongkols;');
const getBatch2 = new Function(batch2File.replace('import fs from \'fs\';', '').replace('import path from \'path\';', '') + '\nreturn mongkols21to38;');

const b1 = getBatch1();
const b2 = getBatch2();
const all38 = [...b1, ...b2];

console.log('Total Mongkols merged:', all38.length);

if (all38.length !== 38) {
  console.error('Error: Expected 38 Mongkols, got', all38.length);
  process.exit(1);
}

// Convert into BookEasterEggQuest array
const quests = all38.map((m) => {
  const num = m.num;
  const startP = Math.min(433, Math.floor(26 + (num - 1) * (407 / 38)));
  const endP = num === 38 ? 433 : Math.min(433, Math.floor(26 + num * (407 / 38)) - 1);
  const printStart = Math.floor(1 + (num - 1) * (380 / 38));
  const printEnd = Math.floor(num * (380 / 38));

  const questionsList = m.questions.map((qObj, qIdx) => {
    // Deterministic placement for correct option
    const targetIdx = (qIdx + num) % 4; // 0, 1, 2, or 3
    const opts = [...qObj.distractors];
    opts.splice(targetIdx, 0, qObj.a);

    // Add prefix ก., ข., ค., ง.
    const prefixes = ['ก. ', 'ข. ', 'ค. ', 'ง. '];
    const finalOptions = opts.slice(0, 4).map((text, idx) => {
      const clean = text.replace(/^[ก-ง]\.\s*/, '');
      return prefixes[idx] + clean;
    });

    return {
      questionNumber: qIdx + 1,
      question: qObj.q,
      options: finalOptions,
      correctIndex: targetIdx,
      explanation: qObj.exp
    };
  });

  const isLegendary = num === 38 || num === 5 || num === 11 || num === 27 || num === 33 || num === 34;
  const isMain = num === 1 || num === 2 || num === 3 || num === 4 || num === 38;

  let categoryTag = '📜 ภารกิจมงคลชีวิต (Life Quest)';
  let questType = 'side';
  if (isLegendary) {
    categoryTag = '🌟 เควสระดับตำนาน (Genshin Legendary Quest)';
    questType = 'legendary';
  } else if (isMain) {
    categoryTag = '👑 ภารกิจหลักสูงสุด (Main Quest)';
    questType = 'main';
  }

  const primaryQ = questionsList[0];

  return {
    id: `quest_mongkol_${num.toString().padStart(2, '0')}`,
    bookId: 'book_mongkol_chiwit_124',
    questNumber: num,
    title: m.title,
    subtitle: m.subtitle,
    categoryTag,
    questType,
    isLegendary,
    printedPageStart: printStart,
    printedPageEnd: printEnd,
    triggerPage: startP,
    triggerPageEnd: endP,
    loreStory: m.loreStory,
    hint: `เปิดอ่านและศึกษาเนื้อหาในหนังสือมงคลชีวิต 38 ประการ หมวด ${m.subtitle} (ช่วงหน้า PDF ${startP} - ${endP})`,
    question: primaryQ.question,
    options: primaryQ.options,
    correctIndex: primaryQ.correctIndex,
    explanation: primaryQ.explanation,
    questions: questionsList,
    loot: {
      points: isLegendary ? 150 : 100,
      badgeName: m.badgeName,
      badgeIcon: m.badgeIcon
    }
  };
});

// Generate TypeScript code
const tsContent = `/**
 * รายการเควสมงคลชีวิต 38 ประการ ครบทุกมงคล (มงคลที่ 1 ถึง 38)
 * แต่ละมงคลมีชุดคำถามทดสอบปัญญา 5 ข้อ (หรือ 4 ข้อ) ครบถ้วนตามคำสอนในหนังสือมงคลชีวิต ฉบับทางก้าวหน้า
 * สร้างขึ้นอัตโนมัติตามโครงสร้าง BookEasterEggQuest
 */

import { BookEasterEggQuest } from './bookEasterEggQuests';

export const mongkol38Quests: BookEasterEggQuest[] = ${JSON.stringify(quests, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), 'src', 'data', 'mongkolQuestsData.ts'), tsContent, 'utf-8');
console.log('Successfully written src/data/mongkolQuestsData.ts with 38 quests!');

