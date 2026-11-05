import fs from 'fs';

// Read all videos from src/data/videoData.ts
const content = fs.readFileSync('src/data/videoData.ts', 'utf8');
const regex = /id:\s*'([^']+)'[\s\S]*?youtubeId:\s*'([^']+)'[\s\S]*?title:\s*'([^']+)'/g;

const list = [];
let m;
while ((m = regex.exec(content)) !== null) {
  list.push({ id: m[1], youtubeId: m[2], currentTitle: m[3] });
}

console.log(`Checking ${list.length} videos from YouTube oEmbed...`);

async function checkAll() {
  const results = [];
  for (const item of list) {
    const url = `https://www.youtube.com/watch?v=${item.youtubeId}`;
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
      if (res.ok) {
        const json = await res.json();
        results.push({
          id: item.id,
          youtubeId: item.youtubeId,
          configuredTitle: item.currentTitle,
          actualTitle: json.title,
          authorName: json.author_name,
          authorUrl: json.author_url,
          isThanavuddho: json.author_name.includes('ฐานวุฑ') || json.author_url.includes('Thanavuddho')
        });
      } else {
        results.push({
          id: item.id,
          youtubeId: item.youtubeId,
          configuredTitle: item.currentTitle,
          error: `HTTP ${res.status}`,
          isThanavuddho: false
        });
      }
    } catch (e) {
      results.push({
        id: item.id,
        youtubeId: item.youtubeId,
        configuredTitle: item.currentTitle,
        error: e.message,
        isThanavuddho: false
      });
    }
  }

  console.log('\n=== RESULTS ===');
  let nonThanavuddho = 0;
  for (const r of results) {
    if (r.isThanavuddho) {
      console.log(`✅ [${r.youtubeId}] ${r.authorName} -> "${r.actualTitle}"`);
    } else {
      console.log(`❌ [${r.youtubeId}] NOT THANAVUDDHO! Author: "${r.authorName}" | Title: "${r.actualTitle}" (Configured: "${r.configuredTitle}")`);
      nonThanavuddho++;
    }
  }
  console.log(`\nTotal: ${results.length}, Valid Thanavuddho: ${results.length - nonThanavuddho}, Invalid: ${nonThanavuddho}`);

  fs.writeFileSync('scripts/video_check_results.json', JSON.stringify(results, null, 2), 'utf8');
}

checkAll().catch(console.error);

