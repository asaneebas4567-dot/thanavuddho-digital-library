import fs from 'fs';

async function parseYt() {
  const r = await fetch('https://www.youtube.com/@ThanavuddhoStory/videos', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'th-TH,th;q=0.9,en;q=0.8'
    }
  });
  const html = await r.text();
  const m = html.match(/ytInitialData\s*=\s*({.+?});<\/script>/);
  if (!m) {
    console.error('Cannot match ytInitialData');
    return;
  }
  const data = JSON.parse(m[1]);
  fs.writeFileSync('scripts/ytInitialData.json', JSON.stringify(data, null, 2), 'utf8');
  console.log('Saved ytInitialData.json, keys:', Object.keys(data));

  // Search recursively for any object with videoId
  const found = [];
  function search(node) {
    if (!node || typeof node !== 'object') return;
    if (node.videoId && (node.title || node.headline)) {
      found.push(node);
    }
    for (const k of Object.keys(node)) {
      search(node[k]);
    }
  }
  search(data);
  console.log('Total nodes with videoId:', found.length);
  if (found.length > 0) {
    console.log('Sample node keys:', Object.keys(found[0]));
    console.log('Sample 0:', JSON.stringify(found[0], null, 2).substring(0, 300));
  }
}

parseYt().catch(console.error);

