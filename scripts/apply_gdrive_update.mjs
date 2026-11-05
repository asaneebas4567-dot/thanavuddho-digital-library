import fs from 'fs';
import path from 'path';

const gdriveFiles = JSON.parse(fs.readFileSync('scripts/gdrive_files_decoded.json', 'utf8'));

function superNormalize(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .replace(/\.pdf$/gi, '')
    .replace(/\.jpg$/gi, '')
    .replace(/\.png$/gi, '')
    .replace(/\u0e40\u0e40/g, '\u0e41') // replace double sara e with sara ae
    .replace(/\u0e48\u0e48/g, '\u0e48') // replace double mai ek
    .replace(/[0-9]+[\.\s\-]*/g, '')   // remove numbers at start or anywhere
    .replace(/ok$/gi, '')
    .replace(/ตอน.*/gi, '')
    .replace(/ฉบับ.*/gi, '')
    .replace(/[\(\)\[\]_\-—–\s"'\u201C\u201D\.]+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

// 1. Read persistentBooks.json
const persistentPath = path.join(process.cwd(), 'src', 'data', 'persistentBooks.json');
const pBooks = JSON.parse(fs.readFileSync(persistentPath, 'utf8'));

// 2. Read src/data/mockData.ts
const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
let mockContent = fs.readFileSync(mockDataPath, 'utf8');

// 3. Read src/lib/mock-data.ts
const libMockPath = path.join(process.cwd(), 'src', 'lib', 'mock-data.ts');
let libMockContent = fs.readFileSync(libMockPath, 'utf8');

console.log('=== MATCHING & APPLYING GOOGLE DRIVE FILES ===\n');

let pUpdated = 0;
let mockUpdated = 0;
let libMockUpdated = 0;

for (const g of gdriveFiles) {
  const gNorm = superNormalize(g.fileName);
  let matched = false;

  // A. Check persistentBooks.json
  for (const pb of pBooks) {
    const pbNorm = superNormalize(pb.title);
    if (gNorm.includes(pbNorm) || pbNorm.includes(gNorm) || (gNorm.includes('มโน') && pbNorm.includes('มโน')) || (gNorm.includes('สมดุล') && pbNorm.includes('สมดุล'))) {
      console.log(`[persistentBooks] MATCH: "${pb.title}" <= Drive: "${g.fileName}" (${g.fileId})`);
      pb.reader_url = g.reader_url;
      pb.source_url = g.source_url;
      pb.pdf_url = g.reader_url; // Set direct reader preview
      pb.drive_file_id = g.fileId;
      pUpdated++;
      matched = true;
      break;
    }
  }

  // B. Check src/data/mockData.ts
  // Find all books: { id: '...', title: '...' }
  const bookRegex = /\{\s*id:\s*['"](book_[^'"]+|b_[^'"]+)['"],\s*title:\s*['"]([^'"]+)['"]/g;
  let bMatch;
  while ((bMatch = bookRegex.exec(mockContent)) !== null) {
    const bookId = bMatch[1];
    const bookTitle = bMatch[2];
    const bNorm = superNormalize(bookTitle);

    if (
      gNorm === bNorm ||
      (gNorm.length >= 4 && bNorm.length >= 4 && (gNorm.includes(bNorm) || bNorm.includes(gNorm))) ||
      (gNorm.includes('มงคลชีวิต') && bNorm.includes('มงคลชีวิต')) ||
      (gNorm.includes('ลมหายใจ') && bNorm.includes('ลมหายใจ')) ||
      (gNorm.includes('โลกใหม่') && bNorm.includes('โลกใหม่')) ||
      (gNorm.includes('ทันโลก') && g.fileName.includes('1') && bookId.includes('1')) ||
      (gNorm.includes('ทันโลก') && g.fileName.includes('2') && bookId.includes('2')) ||
      (gNorm.includes('ทันโลก') && g.fileName.includes('3') && bookId.includes('3')) ||
      (gNorm.includes('รักแท้') && bNorm.includes('รักแท้')) ||
      (gNorm.includes('พร้อมบวก') && bNorm.includes('พร้อมบวก'))
    ) {
      console.log(`[mockData.ts] MATCH: [${bookId}] "${bookTitle}" <= Drive: "${g.fileName}" (${g.fileId})`);

      // Replace reader_url and source_url inside this book object
      // Search for the section following this match up to the closing of book object
      const startIdx = bMatch.index;
      const endIdx = mockContent.indexOf('},', startIdx);
      if (endIdx > startIdx) {
        let block = mockContent.substring(startIdx, endIdx);
        
        // Replace reader_url
        block = block.replace(/reader_url:\s*['"][^'"]*['"]/, `reader_url: '${g.reader_url}'`);
        // Replace source_url
        block = block.replace(/source_url:\s*['"][^'"]*['"]/, `source_url: '${g.source_url}'`);

        mockContent = mockContent.substring(0, startIdx) + block + mockContent.substring(endIdx);
        mockUpdated++;
        matched = true;
      }
      break;
    }
  }

  // C. Check src/lib/mock-data.ts
  const libBookRegex = /\{\s*id:\s*['"]([^'"]+)['"],\s*title:\s*['"]([^'"]+)['"]/g;
  let libMatch;
  while ((libMatch = libBookRegex.exec(libMockContent)) !== null) {
    const bookId = libMatch[1];
    const bookTitle = libMatch[2];
    const bNorm = superNormalize(bookTitle);

    if (
      gNorm === bNorm ||
      (gNorm.length >= 4 && bNorm.length >= 4 && (gNorm.includes(bNorm) || bNorm.includes(gNorm))) ||
      (gNorm.includes('มงคลชีวิต') && bNorm.includes('มงคลชีวิต')) ||
      (gNorm.includes('ลมหายใจ') && bNorm.includes('ลมหายใจ')) ||
      (gNorm.includes('โลกใหม่') && bNorm.includes('โลกใหม่'))
    ) {
      const startIdx = libMatch.index;
      const endIdx = libMockContent.indexOf('},', startIdx);
      if (endIdx > startIdx) {
        let block = libMockContent.substring(startIdx, endIdx);
        block = block.replace(/reader_url:\s*['"][^'"]*['"]/, `reader_url: '${g.reader_url}'`);
        block = block.replace(/source_url:\s*['"][^'"]*['"]/, `source_url: '${g.source_url}'`);
        libMockContent = libMockContent.substring(0, startIdx) + block + libMockContent.substring(endIdx);
        libMockUpdated++;
      }
      break;
    }
  }

  if (!matched) {
    console.log(`[Unmatched / Additional] Drive: "${g.fileName}" (${g.fileId})`);
  }
}

// Write back persistentBooks.json
fs.writeFileSync(persistentPath, JSON.stringify(pBooks, null, 2), 'utf8');
console.log(`\n✅ Saved persistentBooks.json (updated ${pUpdated} books)`);

// Write back src/data/mockData.ts
fs.writeFileSync(mockDataPath, mockContent, 'utf8');
console.log(`✅ Saved src/data/mockData.ts (updated ${mockUpdated} books)`);

// Write back src/lib/mock-data.ts
fs.writeFileSync(libMockPath, libMockContent, 'utf8');
console.log(`✅ Saved src/lib/mock-data.ts (updated ${libMockUpdated} books)`);

