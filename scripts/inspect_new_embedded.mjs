import fs from 'fs';

const html = fs.readFileSync('scripts/new_embedded.html', 'utf8');
console.log('HTML size:', html.length);
const titleMatch = html.match(/<title>(.*?)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

// Find all hrefs
const hrefMatches = [...html.matchAll(/href=["']([^"']+)["']/gi)];
console.log('Found hrefs count:', hrefMatches.length);
hrefMatches.slice(0, 30).forEach(m => console.log('Href:', m[1]));

// Search for any id= or drive or google string
fs.writeFileSync('scripts/new_embedded_sample.txt', html.substring(0, 5000), 'utf8');

