import fs from 'fs';
import path from 'path';

const file = path.join(process.cwd(), 'src', 'data', 'bookEasterEggQuests.ts');
let content = fs.readFileSync(file, 'utf-8');

// Insert import at top if not present
if (!content.includes('mongkol38Quests')) {
  content = "import { mongkol38Quests } from './mongkolQuestsData';\n" + content;
}

// Replace book_mongkol_chiwit_124: [ ... ] with book_mongkol_chiwit_124: mongkol38Quests,
const startMarker = "'book_mongkol_chiwit_124': [";
const endMarker = "'book_tham_jai_hai_phrom_buak': [";

const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(endMarker);

if (startIdx === -1 || endIdx === -1) {
  console.error('Markers not found', { startIdx, endIdx });
  process.exit(1);
}

const before = content.substring(0, startIdx);
const after = content.substring(endIdx);

const newContent = before + "'book_mongkol_chiwit_124': mongkol38Quests,\n\n  // หนังสือ ทำใจให้พร้อมบวก\n  " + after;
fs.writeFileSync(file, newContent, 'utf-8');
console.log('Successfully updated bookEasterEggQuests.ts!');

