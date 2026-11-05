import fs from 'fs';

const videoDataText = fs.readFileSync('src/data/videoData.ts', 'utf8');

// Extract all youtubeId
const idMatches = [...videoDataText.matchAll(/youtubeId:\s*'([^']+)'/g)].map(m => m[1]);
console.log('Total youtubeIds in videoData.ts:', idMatches.length);

async function checkAll() {
  const verified = [];
  const rejected = [];

  for (const yid of idMatches) {
    const url = `https://www.youtube.com/watch?v=${yid}`;
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) {
        const json = await res.json();
        const isThanavuddho = json.author_name.includes('ฐานวุฑ') || json.author_url.includes('Thanavuddho');
        const item = {
          youtubeId: yid,
          actualTitle: json.title,
          authorName: json.author_name,
          authorUrl: json.author_url,
          isThanavuddho
        };
        if (isThanavuddho) {
          verified.push(item);
        } else {
          rejected.push(item);
        }
      } else {
        rejected.push({ youtubeId: yid, error: `HTTP ${res.status}` });
      }
    } catch (e) {
      rejected.push({ youtubeId: yid, error: e.message });
    }
  }

  console.log(`\nVerified Thanavuddho: ${verified.length}`);
  verified.forEach((v, i) => console.log(`${i+1}. [${v.youtubeId}] ${v.authorName} -> "${v.actualTitle}"`));

  console.log(`\nRejected (NOT Thanavuddho or Error): ${rejected.length}`);
  rejected.forEach((v, i) => console.log(`${i+1}. [${v.youtubeId}] ${v.authorName || v.error} -> "${v.actualTitle || ''}"`));

  fs.writeFileSync('scripts/verified_thanavuddho_videos.json', JSON.stringify({ verified, rejected }, null, 2), 'utf8');
}

checkAll().catch(console.error);

