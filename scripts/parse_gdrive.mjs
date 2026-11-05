import fs from 'fs';

const html = fs.readFileSync('scripts/gdrive_folder.html', 'utf8');
console.log('HTML length:', html.length);

// Search for any .pdf occurrences
const pdfRegex = /([a-zA-Z0-9_\u0E00-\u0E7F\s\-()]+?\.pdf)/gi;
const pdfMatches = new Set();
let match;
while ((match = pdfRegex.exec(html)) !== null) {
  pdfMatches.add(match[1]);
}
console.log('Unique PDF names found in HTML:', Array.from(pdfMatches));

// Also let's search for drive file IDs
// Usually Google Drive HTML embeds data in `window['_DRIVE_ivd']` or `_initData` or similar
const idRegex = /"([a-zA-Z0-9_-]{28,45})"/g;
const ids = new Set();
while ((match = idRegex.exec(html)) !== null) {
  ids.add(match[1]);
}
console.log('Potential File IDs count:', ids.size);

