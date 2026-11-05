import fs from 'fs';

const html = fs.readFileSync('scripts/gdrive_folder.html', 'utf8');

const scriptMatches = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/gi)];
console.log('Total script tags:', scriptMatches.length);

scriptMatches.forEach((s, idx) => {
  const text = s[1].trim();
  if (text.length > 50) {
    console.log(`Script ${idx}: length=${text.length}, starts with=${text.substring(0, 100).replace(/\n/g, ' ')}`);
    if (text.includes('16W_-sDVKcuGxiXL3u7kQECFjpkoLmdoC') || text.includes('drive.google.com') || text.includes('items') || text.includes('title')) {
      fs.writeFileSync(`scripts/script_${idx}.js`, text);
    }
  }
});

