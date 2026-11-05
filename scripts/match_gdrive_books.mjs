import fs from 'fs';

const gdriveFiles = JSON.parse(fs.readFileSync('scripts/gdrive_files_decoded.json', 'utf8'));

// Load persistentBooks
const pBooks = JSON.parse(fs.readFileSync('src/data/persistentBooks.json', 'utf8'));

// Load mockData
const rawMock = fs.readFileSync('src/data/mockData.ts', 'utf8');
const mockBooks = [];
const mockRegex = /id:\s*['"](.*?)['"],[\s\S]*?title:\s*['"](.*?)['"],/g;
let m;
while ((m = mockRegex.exec(rawMock)) !== null) {
  mockBooks.push({ id: m[1], title: m[2] });
}

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[0-9]+\.\s*/g, '')
    .replace(/^[0-9]+/g, '')
    .replace(/[\(\)\[\]_\-—–\s"'\u201C\u201D]+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

console.log('=== MATCHING GOOGLE DRIVE FILES WITH DATABASE BOOKS ===\n');

const matchedList = [];
const unmatchedFiles = [];

for (const g of gdriveFiles) {
  const gNorm = normalizeTitle(g.fileName);
  
  // Try match persistentBooks first
  let found = pBooks.find(b => {
    const bNorm = normalizeTitle(b.title);
    return gNorm.includes(bNorm) || bNorm.includes(gNorm);
  });

  if (found) {
    matchedList.push({
      driveFile: g.fileName,
      driveId: g.fileId,
      bookId: found.id,
      bookTitle: found.title,
      source: 'persistentBooks.json'
    });
    continue;
  }

  // Try match mockData
  found = mockBooks.find(b => {
    const bNorm = normalizeTitle(b.title);
    return gNorm.includes(bNorm) || bNorm.includes(gNorm);
  });

  if (found) {
    matchedList.push({
      driveFile: g.fileName,
      driveId: g.fileId,
      bookId: found.id,
      bookTitle: found.title,
      source: 'mockData.ts'
    });
    continue;
  }

  unmatchedFiles.push(g);
}

console.log(`Matched ${matchedList.length} of ${gdriveFiles.length} files:`);
matchedList.forEach((m, i) => {
  console.log(`${i + 1}. [${m.source}] "${m.bookTitle}" (id: ${m.bookId}) <= Drive: "${m.driveFile}" (${m.driveId})`);
});

console.log(`\nUnmatched files (${unmatchedFiles.length}):`);
unmatchedFiles.forEach((u, i) => {
  console.log(`${i + 1}. "${u.fileName}" (${u.fileId})`);
});

