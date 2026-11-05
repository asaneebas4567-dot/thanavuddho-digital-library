import fs from 'fs';

const html = fs.readFileSync('scripts/gdrive_folder.html', 'utf8');

const afMatches = [...html.matchAll(/AF_initDataCallback\s*\(\s*\{([\s\S]*?)\}\s*\)\s*;/g)];
console.log('AF_initDataCallback matches:', afMatches.length);

for (let i = 0; i < afMatches.length; i++) {
  const content = afMatches[i][1];
  console.log(`Match ${i} length: ${content.length}`);
  if (content.length > 500) {
    fs.writeFileSync(`scripts/af_data_${i}.txt`, content);
  }
}

