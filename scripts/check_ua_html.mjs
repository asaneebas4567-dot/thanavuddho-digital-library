import fs from 'fs';

const html = fs.readFileSync('scripts/gdrive_with_ua.html', 'utf8');
console.log('HTML length:', html.length);

if (html.includes('ServiceLogin')) {
  console.log('Redirected to ServiceLogin!');
} else {
  console.log('Not redirected to ServiceLogin.');
  // Check for folder contents or title
  const title = html.match(/<title>(.*?)<\/title>/i);
  console.log('Page Title:', title ? title[1] : 'No title');
}

