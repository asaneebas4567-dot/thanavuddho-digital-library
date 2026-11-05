import fs from 'fs';

async function fetchChannelVideos() {
  const url = 'https://www.youtube.com/@ThanavuddhoStory/videos';
  console.log('Fetching', url, '...');
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept-Language': 'th,en-US;q=0.9,en;q=0.8'
    }
  });
  const html = await res.text();
  
  // Extract ytInitialData
  const match = html.match(/var ytInitialData = ({.*?});<\/script>/);
  if (!match) {
    console.log('ytInitialData not found via regex, searching alternative...');
    const match2 = html.match(/window\["ytInitialData"\] = ({.*?});/);
    if (!match2) {
      console.log('Alternative not found either.');
      return;
    }
  }

  const jsonStr = match ? match[1] : '';
  const data = JSON.parse(jsonStr);

  const videoList = [];

  function traverse(obj) {
    if (!obj || typeof obj !== 'object') return;
    if (obj.richItemRenderer && obj.richItemRenderer.content && obj.richItemRenderer.content.videoRenderer) {
      const vr = obj.richItemRenderer.content.videoRenderer;
      const videoId = vr.videoId;
      const title = vr.title?.runs?.[0]?.text || vr.title?.simpleText || '';
      const lengthText = vr.lengthText?.simpleText || vr.lengthText?.runs?.[0]?.text || '';
      const viewCountText = vr.viewCountText?.simpleText || vr.viewCountText?.runs?.[0]?.text || '';
      const publishedTimeText = vr.publishedTimeText?.simpleText || '';
      const description = vr.descriptionSnippet?.runs?.map(r => r.text).join('') || '';

      videoList.push({
        videoId,
        title,
        lengthText,
        viewCountText,
        publishedTimeText,
        description
      });
    }

    if (obj.videoRenderer) {
      const vr = obj.videoRenderer;
      const videoId = vr.videoId;
      const title = vr.title?.runs?.[0]?.text || vr.title?.simpleText || '';
      const lengthText = vr.lengthText?.simpleText || vr.lengthText?.runs?.[0]?.text || '';
      const viewCountText = vr.viewCountText?.simpleText || vr.viewCountText?.runs?.[0]?.text || '';
      const publishedTimeText = vr.publishedTimeText?.simpleText || '';
      const description = vr.descriptionSnippet?.runs?.map(r => r.text).join('') || '';

      if (!videoList.some(v => v.videoId === videoId)) {
        videoList.push({
          videoId,
          title,
          lengthText,
          viewCountText,
          publishedTimeText,
          description
        });
      }
    }

    for (const key of Object.keys(obj)) {
      traverse(obj[key]);
    }
  }

  traverse(data);

  console.log(`Found ${videoList.length} videos from @ThanavuddhoStory:`);
  fs.writeFileSync('scripts/youtube_videos.json', JSON.stringify(videoList, null, 2), 'utf8');
  videoList.forEach((v, i) => {
    console.log(`${i + 1}. [${v.videoId}] (${v.lengthText}) "${v.title}"`);
  });
}

fetchChannelVideos().catch(console.error);

