import fs from 'fs';

const d = JSON.parse(fs.readFileSync('scripts/ytInitialData.json', 'utf8'));
const tr = d.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer;
const contents = tr.content.richGridRenderer.contents;

const videos = [];

for (const c of contents) {
  const model = c.richItemRenderer?.content?.lockupViewModel;
  if (!model) continue;

  const videoId = model.contentId;
  const title = model.metadata?.lockupMetadataViewModel?.title?.content || '';
  
  // Extract duration badge
  let duration = '';
  const badges = model.contentImage?.thumbnailViewModel?.overlays?.[0]?.thumbnailBottomOverlayViewModel?.badges;
  if (badges && badges.length > 0) {
    duration = badges[0]?.thumbnailBadgeViewModel?.text || '';
  }

  // Extract views & time
  let views = '';
  let timeAgo = '';
  const metadataParts = model.metadata?.lockupMetadataViewModel?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts;
  if (metadataParts && metadataParts.length > 0) {
    views = metadataParts[0]?.text?.content || '';
    if (metadataParts.length > 1) {
      timeAgo = metadataParts[1]?.text?.content || '';
    }
  }

  videos.push({
    videoId,
    title,
    duration,
    views,
    timeAgo
  });
}

console.log(`Extracted ${videos.length} videos from @ThanavuddhoStory:`);
videos.forEach((v, i) => {
  console.log(`${(i+1).toString().padStart(2, ' ')}. [${v.videoId}] (${v.duration.padStart(5, ' ')}) ${v.title} [${v.views} views, ${v.timeAgo}]`);
});

fs.writeFileSync('scripts/extracted_thanavuddho_videos.json', JSON.stringify(videos, null, 2), 'utf8');

