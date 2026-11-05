import fs from 'fs';

const html = fs.readFileSync('scripts/new_embedded.html', 'utf8');

// Match <a> tags
const aMatches = [...html.matchAll(/<a\s+[^>]*?href=["'](https:\/\/drive\.google\.com\/file\/d\/([-\w]{25,})\/[^"']+)["'][^>]*?>([\s\S]*?)<\/a>/gi)];

console.log('Total file links found:', aMatches.length);

const items = aMatches.map(m => {
  const fullUrl = m[1];
  const fileId = m[2];
  const rawHtml = m[3];
  // extract text or title attribute
  const titleAttr = m[0].match(/title=["']([^"']+)["']/i);
  const text = rawHtml.replace(/<[^>]+>/g, '').trim();
  const name = titleAttr ? titleAttr[1] : text;
  return { fileId, name, fullUrl };
});

console.log('Sample parsed items:');
items.forEach((item, idx) => {
  console.log(`${idx + 1}. [${item.fileId}] => "${item.name}"`);
});

fs.writeFileSync('scripts/parsed_gdrive_files.json', JSON.stringify(items, null, 2), 'utf8');

