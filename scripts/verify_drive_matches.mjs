import fs from 'fs';

const gdrive = JSON.parse(fs.readFileSync('scripts/gdrive_files_decoded.json', 'utf8'));
const gdriveMap = new Map();
gdrive.forEach(g => gdriveMap.set(g.fileId, g.fileName));

const mock = fs.readFileSync('src/data/mockData.ts', 'utf8');
const regex = /id:\s*['"]([^'"]+)['"][\s\S]*?title:\s*['"]([^'"]+)['"][\s\S]*?reader_url:\s*['"]([^'"]+)['"]/g;
let match;
let count = 0;
while ((match = regex.exec(mock)) !== null) {
  const [_, id, title, reader] = match;
  if (reader.includes('drive.google.com')) {
    const fileIdMatch = reader.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = fileIdMatch ? fileIdMatch[1] : '';
    console.log(`[mockData] ${id.padEnd(30)} | ${title.padEnd(35)} -> ${gdriveMap.get(fileId)} (${fileId})`);
    count++;
  }
}
console.log('Total mockData books with Google Drive:', count);

