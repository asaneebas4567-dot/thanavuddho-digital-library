import fs from 'fs';
import path from 'path';

const FOLDER_ID = '16W_-sDVKcuGxiXL3u7kQECFjpkoLmdoC';

async function main() {
  console.log('Fetching Google Drive folder via Node fetch...');
  const res = await fetch(`https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();
  console.log('HTML length:', html.length);

  const aMatches = [...html.matchAll(/<a\s+[^>]*?href=["'](https:\/\/drive\.google\.com\/file\/d\/([-\w]{25,})\/[^"']+)["'][^>]*?>([\s\S]*?)<\/a>/gi)];
  console.log(`Found ${aMatches.length} raw file entries.`);

  const files = [];
  for (const m of aMatches) {
    const fileId = m[2];
    const rawHtml = m[3];
    const text = rawHtml.replace(/<[^>]+>/g, '').trim();
    const titleAttr = m[0].match(/title=["']([^"']+)["']/i);
    const fileName = titleAttr ? titleAttr[1] : text;

    files.push({
      fileId,
      fileName,
      reader_url: `https://drive.google.com/file/d/${fileId}/preview`,
      source_url: `https://drive.google.com/file/d/${fileId}/view`
    });
  }

  console.log('\n--- ALL PARSED GOOGLE DRIVE FILES ---');
  files.forEach((f, idx) => {
    console.log(`${idx + 1}. [${f.fileId}] => "${f.fileName}"`);
  });

  fs.writeFileSync('scripts/gdrive_files_decoded.json', JSON.stringify(files, null, 2), 'utf8');
}

main().catch(console.error);

