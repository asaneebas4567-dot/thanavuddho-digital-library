import fs from 'fs';

const raw = fs.readFileSync('src/data/mockData.ts', 'utf8');

const bookMatches = [...raw.matchAll(/id:\s*['"](.*?)['"],[\s\S]*?title:\s*['"](.*?)['"],[\s\S]*?reader_url:\s*['"](.*?)['"]/g)];

console.log('Total books with reader_url:', bookMatches.length);
bookMatches.forEach(b => {
  if (b[3].includes('drive.google.com')) {
    console.log(`- [${b[1]}] "${b[2]}" => ${b[3]}`);
  }
});

