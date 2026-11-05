/**
 * ระบบสืบค้นและประเมินความเกี่ยวข้องของวิดีโอ YouTube (Knowledge-to-Video Fallback Engine)
 * ทำหน้าที่ค้นหาวิดีโอคำสอนของพระอาจารย์จากคลัง Video Knowledge Index
 * ตรวจสอบความสอดคล้องของหัวข้อ ประเมินหลักฐาน และเชื่อมโยง Deep Link ไปยัง YouTube จริง
 * 
 * ข้อกำหนดเคร่งครัด:
 * 1. หากไม่มี Transcript ให้ค้นจากชื่อและคำอธิบาย แต่ต้องระบุว่าตรวจสอบเนื้อหาภายในวิดีโอไม่ได้
 * 2. ห้ามแต่ง Transcript หรือเวลาเริ่มต้นของวิดีโอขึ้นเอง
 * 3. หากวิดีโอไม่เกี่ยวข้องกับคำถาม ห้ามนำมาแนะนำเพียงเพื่อให้มีผลลัพธ์ (Zero False Recommendation)
 */

import { getAllVideoKnowledge, incrementVideoRecommendCount } from '@/data/videoKnowledgeDatabase';
import { VideoKnowledgeItem, DhammaCitation } from '@/types';
import { normalizeThaiText, tokenizeThai, expandKeywordsWithSynonyms } from './thaiTokenizer';

export interface VideoRecommendationResult {
  matchedVideos: VideoKnowledgeItem[];
  citations: DhammaCitation[];
  channelSearchUrl: string;
  hasDirectVideo: boolean;
  topVideoSnippet?: string;
  relevanceReason?: string;
}

const OFFICIAL_CHANNEL_HANDLE = '@ThanavuddhoStory';
const OFFICIAL_SEARCH_BASE = 'https://www.youtube.com/@ThanavuddhoStory/search?query=';

const HONORIFIC_AND_META_WORDS = new Set([
  'พระอาจารย์', 'อาจารย์', 'หลวงพี่', 'หลวงพ่อ', 'สอน', 'วิธี', 'เรื่อง', 'บอก', 'แนะนำ', 
  'อธิบาย', 'ถาม', 'ตอบ', 'คลิป', 'วิดีโอ', 'ยูทูป', 'youtube', 'อย่างไร', 'ทำไม', 'อะไร',
  'บ้าง', 'ไหน', 'คือ', 'ช่วย', 'หน่อย', 'ครับ', 'ค่ะ', 'ไหม', 'มั้ย', 'หรือเปล่า', 'หรือไม่',
  'ใช่ไหม', 'จริงไหม', 'มีไหม', 'ได้ไหม', 'เท่าไหร่', 'เท่าใด', 'เมื่อไหร่'
]);

/**
 * คำนวณคะแนนความเกี่ยวข้องระหว่างคำถามและวิดีโอในคลัง
 */
interface ScoredVideo {
  video: VideoKnowledgeItem;
  score: number;
  relevanceReason: string;
  matchedKeywords: string[];
}

export function findRelevantVideos(rawQuery: string, maxResults = 3): VideoRecommendationResult {
  const query = (rawQuery || '').trim();
  const normQ = normalizeThaiText(query);
  const channelSearchUrl = `${OFFICIAL_SEARCH_BASE}${encodeURIComponent(query || 'ธรรมะ')}`;

  if (!normQ) {
    return {
      matchedVideos: [],
      citations: [],
      channelSearchUrl,
      hasDirectVideo: false
    };
  }

  const tokens = tokenizeThai(normQ);
  const expandedTokens = expandKeywordsWithSynonyms(tokens);
  // คัดกรองคำทั่วไป เช่น พระอาจารย์, วิธี, สอน ออก เพื่อป้องกันการแนะนำมั่วข้ามเรื่อง
  const meaningfulTokens = expandedTokens.filter(t => !HONORIFIC_AND_META_WORDS.has(t) && t.length >= 2);

  if (meaningfulTokens.length === 0) {
    return {
      matchedVideos: [],
      citations: [],
      channelSearchUrl,
      hasDirectVideo: false
    };
  }

  const allVideos = getAllVideoKnowledge().filter(v => v.status === 'published' && v.isOfficialChannel);

  const scoredList: ScoredVideo[] = [];

  for (const video of allVideos) {
    let score = 0;
    const matchedTokens: string[] = [];
    const titleNorm = normalizeThaiText(video.title);
    const descNorm = normalizeThaiText(video.description);
    const tagsNorm = (video.tags || []).map(t => normalizeThaiText(t));
    const keywordsNorm = (video.keywords || []).map(k => normalizeThaiText(k));
    const transcriptNorm = video.transcript ? normalizeThaiText(video.transcript) : '';

    // 1. ความตรงตัวของประโยคเต็มในชื่อเรื่องหรือคำอธิบาย (ต้องไม่ใช่คำทั่วไป)
    if (meaningfulTokens.some(m => normQ.includes(m))) {
      if (titleNorm.includes(normQ)) {
        score += 70;
        matchedTokens.push(normQ);
      } else if (descNorm.includes(normQ)) {
        score += 40;
        matchedTokens.push(normQ);
      }
    }

    // 2. การจับคู่เฉพาะคำสำคัญที่มีความหมายตรงประเด็น (Meaningful Content Tokens)
    for (const t of meaningfulTokens) {
      let tokenMatched = false;
      if (titleNorm.includes(t)) {
        score += 25;
        tokenMatched = true;
      }
      if (tagsNorm.some(tag => tag === t || tag.includes(t))) {
        score += 20;
        tokenMatched = true;
      }
      if (keywordsNorm.some(kw => kw === t || kw.includes(t))) {
        score += 15;
        tokenMatched = true;
      }
      if (descNorm.includes(t)) {
        score += 8;
        tokenMatched = true;
      }

      // 3. ตรวจสอบ Transcript จริง (ถ้ามี)
      if (video.hasVerifiedTranscript && transcriptNorm && transcriptNorm.includes(t)) {
        score += 30; // โบนัสหลักฐานจาก Transcript จริง
        tokenMatched = true;
      }

      if (tokenMatched && !matchedTokens.includes(t)) {
        matchedTokens.push(t);
      }
    }

    // 4. กรณีประเด็นเฉพาะเจาะจง (Domain-Specific Nuances)
    // กรณีถามเชื่อมโยง: อิทธิบาท 4 กับ นิยาม 5 / การทำงาน / ความสำเร็จ
    if (
      (normQ.includes('อิทธิบาท') || normQ.includes('ฉันทะ') || normQ.includes('วิริยะ')) &&
      (normQ.includes('ทำงาน') || normQ.includes('นิยาม') || normQ.includes('สำเร็จ'))
    ) {
      if (video.id === 'vid-h-01' || video.tags.includes('อิทธิบาท 4')) {
        score += 50;
      }
    }

    // กรณีถามเรื่อง ยมทูต / นรก / ภพภูมิ
    if (normQ.includes('ยมทูต') || normQ.includes('นรก') || normQ.includes('ภพภูมิ')) {
      if (video.id === 'vid-h-03' || video.tags.includes('ยมทูต')) {
        score += 60;
      }
    }

    // กรณีถามเรื่อง สวรรค์ / คตินิมิต / ฝันเห็นสวรรค์
    if (normQ.includes('สวรรค์') || normQ.includes('คตินิมิต') || normQ.includes('ก่อนตาย')) {
      if (video.id === 'vid-h-05' || video.tags.includes('คตินิมิต')) {
        score += 60;
      }
    }

    // กรณีถามเรื่อง อุทิศบุญ / งานศพ / ให้อภัย
    if (normQ.includes('งานศพ') || normQ.includes('อโหสิกรรม') || normQ.includes('ไม่ถูกกัน')) {
      if (video.id === 'vid-h-08') {
        score += 60;
      }
    }

    // 5. เกณฑ์ขั้นต่ำในการพิจารณาความเกี่ยวข้อง (Relevance Threshold)
    // หากคะแนนต่ำกว่า 30 ถือว่าไม่มีความสัมพันธ์ที่เพียงพอ
    if (score >= 30) {
      let reason = '';
      if (video.hasVerifiedTranscript && video.startFormatted) {
        reason = `วิดีโอนี้อธิบายประเด็นตรงกับคำถาม โดยเฉพาะในนาทีที่ ${video.startFormatted} ซึ่งพระอาจารย์ได้ให้คำแนะนำโดยตรง`;
      } else if (matchedTokens.length > 0) {
        reason = `วิดีโอนี้เกี่ยวข้องกับหัวข้อ "${matchedTokens.slice(0, 3).join(', ')}" ที่ท่านสอบถาม โดยคัดกรองจากชื่อเรื่องและคำอธิบายคลิปของพระอาจารย์`;
      } else {
        reason = `วิดีโอเทศนาของพระอาจารย์ที่มีเนื้อหาเชื่อมโยงกับหลักธรรมข้อนี้`;
      }

      scoredList.push({
        video,
        score,
        relevanceReason: reason,
        matchedKeywords: matchedTokens
      });
    }
  }

  // เรียงลำดับตามคะแนนความเกี่ยวข้องสูงสุด
  scoredList.sort((a, b) => b.score - a.score);

  // เลือกเฉพาะวิดีโอที่ผ่านเกณฑ์ (1 - maxResults รายการ)
  // หากไม่มีวิดีโอใดผ่านเกณฑ์ จะส่งคืนอาเรย์ว่าง (ห้ามแต่งผลลัพธ์มั่ว)
  const topMatched = scoredList.slice(0, maxResults);

  if (topMatched.length === 0) {
    return {
      matchedVideos: [],
      citations: [],
      channelSearchUrl,
      hasDirectVideo: false
    };
  }

  // เพิ่มสถิติการถูกแนะนำสำหรับวิดีโอที่ผ่านเกณฑ์
  topMatched.forEach(item => {
    try {
      incrementVideoRecommendCount(item.video.id);
    } catch {
      // safe fallback
    }
  });

  const matchedVideos = topMatched.map(item => ({
    ...item.video,
    relevanceReason: item.relevanceReason
  }));

  const citations: DhammaCitation[] = topMatched.map(item => mapVideoToCitation(item.video, item.relevanceReason));

  return {
    matchedVideos,
    citations,
    channelSearchUrl,
    hasDirectVideo: topMatched[0].score >= 45,
    topVideoSnippet: topMatched[0].video.description,
    relevanceReason: topMatched[0].relevanceReason
  };
}

/**
 * แปลง VideoKnowledgeItem เป็น DhammaCitation
 */
export function mapVideoToCitation(video: VideoKnowledgeItem, customReason?: string): DhammaCitation {
  const isDirectYt = !!(video.url && (video.url.includes('youtube.com') || video.url.includes('youtu.be')));
  
  // สร้าง YouTube URL พร้อมเวลาเริ่มต้นจริง (ถ้ามี)
  let watchUrl = video.url;
  if (video.startSeconds && video.startSeconds > 0) {
    watchUrl = watchUrl.includes('?') 
      ? `${watchUrl}&t=${video.startSeconds}s` 
      : `${watchUrl}?t=${video.startSeconds}s`;
  }

  const unverifiedNotice = !video.hasVerifiedTranscript 
    ? 'สืบค้นจากชื่อและคำอธิบายคลิป (เนื่องจากยังไม่มีบทถอดเสียง Transcript ภายในคลิป)'
    : undefined;

  return {
    id: `cit-vid-${video.id}`,
    title: video.title,
    type: 'video',
    link: watchUrl,
    youtubeId: video.youtubeId,
    cover: video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
    timestamp_formatted: video.startFormatted ? `นาที ${video.startFormatted}` : undefined,
    snippet: video.transcript || video.description,
    description: `ช่องทางการ: ${video.channelName || '@ThanavuddhoStory'}`,
    actionText: '▶️ รับชมวิดีโอบน YouTube',
    relevanceReason: customReason || video.relevanceReason,
    hasVerifiedTranscript: video.hasVerifiedTranscript,
    unverifiedContentNotice: unverifiedNotice
  };
}

/**
 * สร้างมาร์กดาวน์แสดงรายการวิดีโอแนะนำอย่างเป็นระเบียบในคำตอบ
 */
export function generateVideoRecommendationMarkdown(
  query: string,
  matchedVideos: VideoKnowledgeItem[],
  channelSearchUrl: string,
  introHeading = '🎬 **วิดีโอคำสอนของพระอาจารย์ที่เกี่ยวข้อง:**'
): string {
  if (!matchedVideos || matchedVideos.length === 0) {
    return '';
  }

  const lines = matchedVideos.map((v, idx) => {
    let watchUrl = v.url;
    if (v.startSeconds && v.startSeconds > 0) {
      watchUrl = watchUrl.includes('?') ? `${watchUrl}&t=${v.startSeconds}s` : `${watchUrl}?t=${v.startSeconds}s`;
    }

    const timeBadge = v.startFormatted ? ` ⏱️ *จุดเริ่มบรรยาย: นาทีที่ ${v.startFormatted}*` : '';
    const transcriptNotice = !v.hasVerifiedTranscript 
      ? `\n  *(หมายเหตุ: ระบบสืบค้นจากชื่อเรื่องและคำอธิบาย เนื่องจากยังไม่มีบทถอดเสียง Transcript ภายในคลิป)*` 
      : '';
    const reasonText = v.relevanceReason ? `\n  💡 **เหตุผลที่เกี่ยวข้อง:** ${v.relevanceReason}` : '';

    return `${idx + 1}. 🎥 **[${v.title}](${watchUrl})**${timeBadge}${reasonText}${transcriptNotice}\n  📖 ${v.description.slice(0, 140)}...`;
  }).join('\n\n');

  return `\n\n${introHeading}\n${lines}\n\n🔍 *ท่านสามารถสืบค้นคลิปเทศนาอื่นเพิ่มเติมได้ที่ [ช่อง YouTube @ThanavuddhoStory](${channelSearchUrl})*`;
}
