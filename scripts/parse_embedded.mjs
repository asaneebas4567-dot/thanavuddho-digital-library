import fs from 'fs';

const html = fs.readFileSync('scripts/embedded_view.html', 'utf8');
console.log('HTML length:', html.length);

// Extract title
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('Folder title:', titleMatch ? titleMatch[1] : 'Unknown');

// Extract all <a href="..."> tags
const aTagRegex = /<a\s+[^>]*?href=["']([^"']+)["'][^>]*?>([\s\S]*?)<\/a>/gi;
const files = [];
let match;
while ((match = aTagRegex.exec(html)) !== null) {
  const href = match[1];
  const rawText = match[2].replace(/<[^>]+>/g, '').trim();

  // match file view
  const fileMatch = href.match(/https:\/\/drive\.google\.com\/file\/d\/([-\w]{25,})\/view/);
  if (fileMatch) {
    files.push({
      id: fileMatch[1],
      name: rawText,
      viewUrl: href,
      previewUrl: `https://drive.google.com/file/d/${fileMatch[1]}/preview`
    });
  } else {
    // Check if docs or folder
    const folderMatch = href.match(/id=([-\w]{25,})/);
    if (folderMatch && rawText) {
      console.log('Subfolder / item:', rawText, href);
    }
  }
}

console.log(`Found ${files.length} files:`);
files.forEach((f, idx) => {
  console.log(`${idx + 1}. [${f.id}] ${f.name}`);
});

fs.writeFileSync('scripts/parsed_files.json', JSON.stringify(files, null, 2), 'utf8');

