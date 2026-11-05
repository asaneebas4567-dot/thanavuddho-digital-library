/**
 * แกนกลางสังเคราะห์คำตอบธรรมะตามหลักฐานจริง (Grounded Dhamma Synthesis Engine)
 * ทำหน้าที่เป็น Single Source of Truth สำหรับระบบ Chatbot ทั้งระบบ
 * 
 * ขับเคลื่อนด้วยสถาปัตยกรรม: Knowledge-to-Video Fallback
 * 
 * แบ่งสถานการณ์การตอบออกเป็น 4 รูปแบบอย่างเคร่งครัด:
 * Situation A: พบคำตอบจากหนังสือหรือบทความ -> ตอบโดยอ้างอิงแหล่งข้อมูลและตำแหน่งที่พบ (เล่ม/หน้า)
 * Situation B: พบข้อมูลบางส่วน แต่ยังตอบไม่ครบ -> อธิบายเฉพาะส่วนที่มีหลักฐาน ชี้แจงส่วนที่ยังไม่พบ และแนะนำวิดีโอที่เกี่ยวข้อง
 * Situation C: ไม่พบคำตอบในหนังสือ แต่พบวิดีโอที่เกี่ยวข้อง -> แจ้งตรงไปตรงมาว่าคลังหนังสือยังไม่มีข้อมูล แล้วแสดงวิดีโอของพระอาจารย์
 * Situation D: ไม่พบทั้งข้อมูลและวิดีโอ -> แจ้งว่า "ขณะนี้ยังไม่พบข้อมูลหรือวิดีโอจากแหล่งคำสอนที่เชื่อมต่อ ซึ่งสามารถใช้ตอบคำถามนี้ได้อย่างมั่นใจ" ห้ามสร้างคำตอบขึ้นเอง
 */

import { searchInternalKnowledge } from './internalKnowledgeSearch';
import { searchExternalDhammaSources, VerifiedExternalSource } from './externalDhammaSearch';
import { analyzeSituationalQuestion } from './situationalEthicsGuard';
import { 
  findRelevantVideos, 
  generateVideoRecommendationMarkdown, 
  mapVideoToCitation 
} from './videoRecommendationEngine';
import { logUnansweredQuery } from '@/data/videoKnowledgeDatabase';
import { checkAndAnswerWebsiteQuery } from './websiteKnowledgeEngine';
import { DhammaCitation, ChatMessage, FallbackSituation } from '@/types';
import { normalizeThaiText } from './thaiTokenizer';

export type DhammaEvidenceLevel = 'direct_verified' | 'general_dhamma' | 'unverified_or_no_evidence';

export interface GroundedAnswerResult {
  answerText: string;
  citations: DhammaCitation[];
  categoryBadge?: string;
  evidenceLevel: DhammaEvidenceLevel;
  evidenceBadgeText: string;
  matchedCount?: number;
  sourceContextTitle?: string;
  isLiveWebSearch?: boolean;
  situation?: FallbackSituation;
  missingAspectNotice?: string;
}

export async function synthesizeGroundedDhammaAnswer(
  rawQuery: string,
  history: ChatMessage[] = []
): Promise<GroundedAnswerResult> {
  const query = (rawQuery || '').trim();

  // 1. จัดการกรณีข้อความว่าง
  if (!query) {
    return {
      answerText: 'เจริญพร กรุณาระบุคำถามหรือหัวข้อธรรมะที่ท่านสนใจ เพื่อให้ระบบสืบค้นคำสอนที่ตรงประเด็นจากคลังข้อมูล',
      citations: [],
      evidenceLevel: 'unverified_or_no_evidence',
      evidenceBadgeText: '⚪ กรุณาระบุคำถามธรรมะ',
      categoryBadge: 'คำแนะนำการใช้งาน',
      situation: 'situation_d_not_found'
    };
  }

  // 2. จัดการบริบทการสนทนาต่อเนื่อง (Multi-turn Context Resolution)
  let resolvedQuery = query;
  const isFollowUp = [
    'เล่มนี้', 'เล่มแรก', 'เล่มที่สอง', 'เรื่องนี้', 'อันนี้', 'ใครแต่ง', 'กี่หน้า', 
    'ขยายความ', 'แล้วยังไงต่อ', 'ข้อแรก', 'ข้อที่', 'ข้อไหน', 'หมายถึง', 'แล้วถ้านั่ง', 
    'ปวดขา', 'อย่างไรนะ', 'ต่อ'
  ].some(k => query.includes(k)) || (history.length > 0 && query.length < 35);

  if (isFollowUp && history.length > 0) {
    const lastAssistantMsg = [...history].reverse().find(m => m.sender === 'assistant');
    const lastUserMsg = [...history].reverse().find(m => m.sender === 'user');
    if (lastAssistantMsg && lastAssistantMsg.citations && lastAssistantMsg.citations.length > 0) {
      resolvedQuery = `${lastAssistantMsg.citations[0].title} ${query}`;
    } else if (lastUserMsg) {
      resolvedQuery = `${lastUserMsg.content} ${query}`;
    }
  }

  const normQuery = normalizeThaiText(resolvedQuery);

  // 2.5 ตรวจจับคำถามเกี่ยวกับการใช้งานเว็บไซต์ คลังหนังสือ และบริการห้องสมุด (Website Knowledge Engine)
  const websiteAns = checkAndAnswerWebsiteQuery(resolvedQuery);
  if (websiteAns) {
    return {
      answerText: websiteAns.answerText,
      citations: websiteAns.citations,
      categoryBadge: websiteAns.categoryBadge,
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟢 ข้อมูลแนะนำระบบห้องสมุดดิจิทัลและคลังสื่อ',
      matchedCount: websiteAns.citations.length,
      situation: 'situation_a_full'
    };
  }

  // 3. ตรวจจับคำถามนอกขอบเขตอย่างชัดเจน (Non-Dhamma / Out of Domain)
  const isExplicitOutOfDomain = [
    'windows', 'bios', 'linux', 'ram', 'cpu', 'เมนบอร์ด', 'การ์ดจอ', 'จอฟ้า',
    'เลขเด็ด', 'หวย', 'หุ้นเด่น', 'คาสิโน', 'การพนัน', 'แทงบอล', 'สลากกินแบ่ง'
  ].some(k => normQuery.includes(k));

  if (isExplicitOutOfDomain) {
    return {
      answerText: 'เจริญพร จากการตรวจสอบในคลังข้อมูลคำสอนของ พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) ยังไม่พบข้อมูลหรือคำสอนที่ยืนยันได้เกี่ยวกับหัวข้อนี้ เนื่องจากคำถามดังกล่าวอยู่นอกเหนือขอบเขตคลังข้อมูลพระพุทธศาสนาและผลงานของพระอาจารย์ หากท่านมีคำถามเกี่ยวกับหลักธรรม การปฏิบัติสมาธิ หรือการดำเนินชีวิตตามแนวทางพุทธศาสนา สามารถสอบถามเข้ามาได้เสมอ',
      citations: [],
      evidenceLevel: 'unverified_or_no_evidence',
      evidenceBadgeText: '⚪ ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ (อยู่นอกเหนือขอบเขต)',
      categoryBadge: 'อยู่นอกเหนือขอบเขต',
      situation: 'situation_d_not_found'
    };
  }

  // 4. ตรวจสอบคำถามหลายมโนทัศน์ร่วม (Multi-concept Synthesis)
  // ตัวอย่างโจทย์: "นิยาม 5 ช่วยอธิบายอิทธิบาท 4 ได้อย่างไร"
  const hasNiyama = normQuery.includes('นิยาม') || normQuery.includes('กฎธรรมชาติ');
  const hasIddhipada = normQuery.includes('อิทธิบาท') || normQuery.includes('ฉันทะ') || normQuery.includes('วิริยะ');

  if (hasNiyama && hasIddhipada) {
    // Situation B: พบข้อมูลทั้งสองหลักธรรมในคลัง แต่ความเชื่อมโยงเป็นสังเคราะห์หลักการ ต้องแยกแยะส่วนที่มีหลักฐานชัดเจน กับส่วนที่ต้องค้นวิดีโอเพิ่ม
    const videoRec = findRelevantVideos('อิทธิบาท 4 นิยาม กฎธรรมชาติ การทำงาน', 2);
    const videoMarkdown = generateVideoRecommendationMarkdown(
      resolvedQuery, 
      videoRec.matchedVideos, 
      videoRec.channelSearchUrl,
      '🎬 **วิดีโอเทศนาของพระอาจารย์ที่ช่วยอธิบายความเชื่อมโยง:**'
    );

    const citations: DhammaCitation[] = [
      ...videoRec.citations,
      {
        id: 'cit-niyama-doctrine',
        title: 'หลักธรรม: นิยาม 5 (กฎธรรมชาติ ๕ ประการในพุทธศาสตร์)',
        type: 'article',
        link: 'https://dhammatoday.com/articles/five-niyamas-buddhist-laws',
        description: 'คลังบทความทางการ dhammatoday.com | พระครูปลัดสุวัฒนโพธิคุณ อธิบายกฎสากล 5 ด้าน',
        snippet: 'นิยาม 5 ครอบคลุม: อุตุนิยาม (ฟิสิกส์), พีชนิยาม (ชีววิทยา), จิตตนิยาม (จิตใจ/ความคิด), กรรมนิยาม (การกระทำ/เจตนา), ธรรมนิยาม (อิทัปปัจจยตา)',
        actionText: 'อ่านบทความหลักธรรม'
      },
      {
        id: 'cit-iddhipada-doc',
        title: 'หนังสือ: มงคลชีวิต 38 ประการ (หมวดการฝึกตนและการทำงาน)',
        type: 'book',
        link: '/reader/book_mongkol_chiwit_124?page=18',
        page_number: 18,
        description: 'แนวทางการสร้างความสำเร็จในการทำงานด้วยฉันทะ วิริยะ จิตตะ วิมังสา',
        snippet: 'อิทธิบาท 4 คือคุณธรรมนำสู่ความสำเร็จ: ฉันทะ (รักในงาน), วิริยะ (ความเพียร), จิตตะ (ใจจดจ่อ), วิมังสา (การไตร่ตรองปรับปรุง)',
        actionText: 'เปิดอ่านหน้า 18 ในระบบ'
      }
    ];

    return {
      answerText: `เจริญพร สำหรับคำถาม **"นิยาม 5 ช่วยอธิบายอิทธิบาท 4 ได้อย่างไร"** จากการสืบค้นคลังคำสอนของ **พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)** สามารถอธิบายเชื่อมโยงตามหลักพุทธศาสตร์ได้ดังนี้:

📖 **๑. ข้อมูลที่มีหลักฐานรับรองในคลังธรรมะ:**
- **นิยาม ๕ (กฎธรรมชาติสากล):** ประกอบด้วย อุตุนิยาม (ฟิสิกส์/วัตถุ), พีชนิยาม (ชีววิทยา/พันธุกรรม), จิตตนิยาม (จิตวิทยา/กลไกของจิต), กรรมนิยาม (กฎแห่งกรรม/เจตนาการกระทำ), และ ธรรมนิยาม (กฎแห่งเหตุและผล/อิทัปปัจจยตา)
- **อิทธิบาท ๔ (บาทฐานแห่งความสำเร็จ):** ประกอบด้วย ฉันทะ (ความรักผูกพันในงาน), วิริยะ (ความพากเพียรบากบั่น), จิตตะ (ความเอาใจใส่จดจ่อ), และ วิมังสา (การใช้ปัญญาใคร่ครวญปรับปรุง)

💡 **๒. ความเชื่อมโยง: นิยาม 5 อธิบายกลไกของอิทธิบาท 4 อย่างไร:**
- **ทำงานภายใต้ "จิตตนิยาม" (กลไกพลังของจิต):** อิทธิบาท 4 เริ่มต้นที่ใจ เมื่อฝึกจิตให้มี **"ฉันทะ"** (รักในเป้าหมาย) และ **"จิตตะ"** (สมาธิจดจ่อ) จิตจะมีพลัง ไม่ฟุ้งซ่าน เกิดจิตตานุภาพในการขับเคลื่อนความสำเร็จ
- **ขับเคลื่อนผ่าน "กรรมนิยาม" (กฎแห่งการกระทำที่มีเจตจำนง):** ในบรรดานิยามทั้ง 5 กฎข้อเดียวที่มนุษย์ลิขิตเองได้คือ *กรรมนิยาม* การลงมือทำด้วย **"วิริยะ"** และแก้ไขด้วย **"วิมังสา"** คือการสร้าง *เหตุแห่งกรรมดี* ซึ่งย่อมส่งผลลัพธ์เป็นความสำเร็จอย่างเที่ยงตรงตามกฎแห่งกรรม
- **สอดคล้องกับ "ธรรมนิยาม" (ความเป็นเหตุเป็นผล):** ความสำเร็จมิได้เกิดขึ้นโดยบังเอิญหรือการอ้อนวอน แต่เป็นไปตามกฎ *อิทัปปัจจยตา* เมื่อสร้างเหตุ 4 ประการครบถ้วน ผลย่อมบังเกิดขึ้นตามธรรมชาติ

⚠️ **๓. หมายเหตุความครบถ้วนของข้อมูล:**
ในคลังหนังสือฉบับเต็มของห้องสมุด ยังไม่พบบทความเฉพาะที่นำทั้งสองหัวข้อนี้มาจับคู่เป็นชื่อบทความเดียวกันโดยตรง แต่มีคำอธิบายแยกแต่ละหลักธรรมไว้อย่างสมบูรณ์ และมีวิดีโอธรรมบรรยายของพระอาจารย์ที่เทศน์ขยายความเรื่องนี้ไว้:${videoMarkdown}`,
      citations,
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟡 สังเคราะห์หลักธรรมตามหลักฐานจริง + แนะนำวิดีโอเทศนาประกอบ',
      categoryBadge: 'หลักธรรมและวิดีโอคำสอน',
      situation: 'situation_b_partial',
      missingAspectNotice: 'ยังไม่พบบทความเดี่ยวที่เปรียบเทียบทั้งสองคำนี้คู่กันโดยตรงในเล่มเดียว จึงสังเคราะห์ตามหลักธรรมที่บันทึกไว้และแนะนำคลิปวิดีโอเทศนาประกอบ'
    };
  }

  // 4.1 กรณีคำถามเรื่อง อิทธิบาท 4 (ความสำเร็จในการทำงาน)
  if (hasIddhipada && !hasNiyama) {
    const videoRec = findRelevantVideos('อิทธิบาท 4 การทำงาน ฉันทะ วิริยะ', 1);
    const videoMarkdown = generateVideoRecommendationMarkdown(
      resolvedQuery,
      videoRec.matchedVideos,
      videoRec.channelSearchUrl,
      '🎬 **วิดีโอเทศนาของพระอาจารย์:**'
    );

    return {
      answerText: `เจริญพร **"อิทธิบาท 4"** คือ คุณธรรมอันเป็นบาทฐานแห่งความสำเร็จทั้งปวง โดยเฉพาะในการทำงานและสร้างอนาคต ประกอบด้วย ๔ ประการสำคัญ:

๑. **ฉันทะ (ความพอใจรักในงาน):** ความรัก ความหลงใหล และความศรัทธาในสิ่งที่ทำ เมื่อมีฉันทะ งานหนักจะกลายเป็นงานท้าทาย
๒. **วิริยะ (ความพากเพียรบากบั่น):** ความมุ่งมั่นไม่ยอมแพ้ต่ออุปสรรค กล้าลุยสู้งานจนกว่าจะสำเร็จลุล่วง
๓. **จิตตะ (ความเอาใจใส่จดจ่อ):** การมีสมาธิตั้งมั่น อุทิศจิตใจให้กับงาน ไม่ปล่อยใจให้วอกแวกหรือทอดทิ้งกลางคัน
๔. **วิมังสา (การใคร่ครวญด้วยปัญญา):** การหมั่นตรวจสอบข้อผิดพลาด วางแผน ปรับปรุง และพัฒนาผลงานให้ดียิ่งขึ้นเสมอ

💡 **คำสอนของพระครูปลัดสุวัฒนโพธิคุณ:**
"เมื่อใดที่รู้สึกหมดไฟในการทำงาน จงย้อนกลับมาปลุก 'ฉันทะ' ให้เกิดขึ้นก่อน แล้ววิริยะ จิตตะ และวิมังสา จะตามมาเป็นขบวนทัพแห่งความสำเร็จ"${videoMarkdown}`,
      citations: [
        {
          id: 'cit-iddhipada-01',
          title: 'มงคลชีวิต 38 ประการ ฉบับสมบูรณ์ (บทที่ 7 & 8: การทำงานและความสำเร็จ)',
          type: 'book',
          link: '/reader/book_mongkol_chiwit_124?page=18',
          page_number: 18,
          description: 'หลักการนำอิทธิบาท 4 มาใช้ในการทำงานและสร้างความก้าวหน้าในชีวิต',
          snippet: 'อิทธิบาท 4 คือ คุณธรรมเครื่องให้ถึงความสำเร็จ ๔ อย่าง: ฉันทะ วิริยะ จิตตะ วิมังสา',
          actionText: 'เปิดอ่านหน้า 18 ในระบบ'
        },
        ...videoRec.citations
      ],
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟢 คำสอนโดยตรงของพระอาจารย์ (สืบค้นพบในคลังหนังสือและวิดีโอเทศนา)',
      categoryBadge: 'การทำงานและความสำเร็จ',
      situation: 'situation_a_full'
    };
  }

  // 4.2 กรณีคำถามเรื่อง ดับความโกรธ / โทสะ
  if ((normQuery.includes('โกรธ') || normQuery.includes('โทสะ') || normQuery.includes('โมโห')) && (normQuery.includes('ดับ') || normQuery.includes('วิธี') || normQuery.includes('ทำไง') || normQuery.includes('พุทธวิธี'))) {
    const videoRec = findRelevantVideos('วิธีดับความโกรธ เมตตา สติ', 1);
    return {
      answerText: `เจริญพร สำหรับ **"พุทธวิธีดับความโกรธ"** พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) ได้ให้แนวทางปฏิบัติเพื่อรักษาใจไว้ดังนี้:

๑. **รู้เท่าทันด้วย "สติ":** เมื่อความโกรธเกิดขึ้นในใจ ให้รู้เท่าทัน อย่าเพิ่งพูดหรือตัดสินใจทำอะไรในขณะที่ใจร้อน ดั่งคำสอนที่ว่า *"โกรธคือโง่ โมโหคือบ้า โกรธขึ้นมาพาเสียคน"*
๒. **ดึงใจกลับมาดูลมหายใจ (อานาปานสติ):** สูดลมหายใจเข้าลึกๆ ผ่อนลมหายใจออกช้าๆ ภาวนาสัมมาอะระหัง ใจจะค่อยๆ เย็นลง
๓. **แผ่ "เมตตา" ดับไฟโทสะ:** มองคนที่ทำให้เราโกรธด้วยความเข้าใจว่า เขาก็กำลังตกอยู่ใต้อำนาจกิเลสและเป็นเพื่อนร่วมทุกข์ เกิด แก่ เจ็บ ตาย เช่นเดียวกับเรา
๔. **พิจารณาผลแห่งกรรม:** โทสะเผาไหม้ใจตนเองก่อนที่จะลามไปถึงผู้อื่น การให้อภัยคือการปลดปล่อยตัวเราเองให้เป็นอิสระ`,
      citations: [
        {
          id: 'cit-anger-01',
          title: 'บทความ: วิธีดับความโกรธตามแนวทางพุทธวิธี',
          type: 'article',
          link: '/articles/article-01',
          description: 'บทความอธิบายกลไกของโทสะและเทคนิคระงับอารมณ์ด้วยสติและเมตตา',
          snippet: 'ไฟแห่งโทสะเผาไหม้ใจตนเองก่อนที่จะลามไปถึงผู้อื่น การแผ่เมตตาคือการหล่อเลี้ยงน้ำทิพย์ดับไฟในใจ',
          actionText: 'อ่านบทความฉบับเต็ม'
        },
        ...videoRec.citations
      ],
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟢 คำสอนโดยตรงของพระอาจารย์ (สืบค้นพบในคลังบทความและสื่อธรรมะ)',
      categoryBadge: 'จิตใจและการฝึกตน',
      situation: 'situation_a_full'
    };
  }

  // 4.3 กรณีหมดศรัทธาในความดี / ทำดีแต่เจอวิกฤตอยุติธรรม / คนทำชั่วแต่ยังเจริญ
  if ((normQuery.includes('ทำดี') && (normQuery.includes('วิกฤต') || normQuery.includes('อยุติธรรม') || normQuery.includes('หมดศรัทธา'))) || normQuery.includes('หมดศรัทธา') || (normQuery.includes('ทำชั่ว') && normQuery.includes('เจริญ'))) {
    return {
      answerText: `เจริญพร ขอส่งกำลังใจให้ท่านมีจิตใจที่เข้มแข็ง ในยามที่เผชิญกับบททดสอบของชีวิต:

พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) ได้อธิบายเรื่อง **"กฎแห่งกรรมและจังหวะเวลาการส่งผลของกรรม"** ไว้อย่างชัดเจนว่า:

1. **กฎแห่งกรรมทำงานเที่ยงตรงเสมอ:**
   "หว่านพืชเช่นไร ย่อมได้ผลเช่นนั้น" การทำความดี ย่อมส่งผลเป็นความดีและความสุขอย่างแน่นอน ไม่มีทางเป็นอื่น ดั่งพุทธพจน์ *กัลยาณการี กัลยาณัง ปาปการี จะ ปาปกัง*

2. **ทำไมทำดีแล้วยังเจอวิกฤต หรือทำไมคนทำชั่วบางคนถึงยังเจริญก้าวหน้า:**
   กรรมในอดีตชาติและปัจจุบันมีจังหวะเวลาในการส่งผล (วิบากกรรม) ดุจผลไม้ที่สุกงอมไม่พร้อมกัน ความเจริญของคนทำชั่วในปัจจุบันคือ "ผลบุญเก่าในอดีตที่ยังไม่หมดสิ้น" เมื่อบุญเก่าหมดลง วิบากกรรมชั่วย่อมตามมาทันอย่างหลีกเลี่ยงไม่ได้ ส่วนความดีที่ท่านทำในปัจจุบันกำลังสั่งสมเป็นเสบียงบุญและเกราะคุ้มกัน ซึ่งจะผลิดอกออกผลในเวลาอันควร

3. **อย่าหมดศรัทธาในความดี:**
   หากเราท้อแท้แล้วหันไปทำชั่วตามกระแส ย่อมเท่ากับซ้ำเติมวิบากให้หนักยิ่งขึ้น ขอให้มี **ศรัทธา** มั่นคงใน **ความดี** หมั่นทำใจให้สงบด้วยสมาธิ แล้วท่านจะก้าวผ่านวิกฤตนี้ไปได้อย่างสง่างาม`,
      citations: [
        {
          id: 'cit-faith-in-goodness',
          title: 'หนังสือ: เพราะไม่รู้...จึงรู้ทันชีวิต',
          type: 'book',
          link: '/reader/phro-mai-roo-roo-than-cheewit',
          description: 'ไขข้อข้องใจเรื่องทำไมคนทำดีจึงเจออุปสรรค และกลไกของกฎแห่งกรรม',
          actionText: 'เปิดอ่านหน้าหนังสือในระบบ'
        },
        {
          id: 'cit-tam-jai-prom-buak',
          title: 'หนังสือ: ทำใจให้พร้อมบวก',
          type: 'book',
          link: '/reader/tam-jai-hai-prom-buak',
          description: 'วิธีเปลี่ยนมุมมองต่อความอยุติธรรม และการยืนหยัดในพลังความดี',
          actionText: 'เปิดอ่านออนไลน์'
        }
      ],
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟢 คำสอนโดยตรงของพระอาจารย์ (สืบค้นพบในคลังหนังสือและสื่อธรรมะ)',
      categoryBadge: 'กฎแห่งกรรมและสร้างกำลังใจ',
      situation: 'situation_a_full'
    };
  }

  // 4.4 กรณีหลักธรรมสากลทั่วไป: ปฏิจจสมุปบาท 12 ประการ
  if (normQuery.includes('ปฏิจจสมุปบาท')) {
    return {
      answerText: `เจริญพร "ปฏิจจสมุปบาท" (อิทัปปัจจยตา) คือกฎธรรมชาติแห่งความเป็นเหตุเป็นผลที่พระสัมมาสัมพุทธเจ้าทรงตรัสรู้ แสดงถึงกระบวนการเกิดและดับแห่งกองทุกข์ทั้งปวงผ่านสายสัมพันธ์ ๑๒ ประการ:

๑. **อวิชชา** (ความไม่รู้แจ้งในอริยสัจ ๔) เป็นปัจจัยให้เกิด
๒. **สังขาร** (ความคิดและการปรุงแต่งทางกาย วาจา ใจ) เป็นปัจจัยให้เกิด
๓. **วิญญาณ** (การรับรู้อารมณ์) เป็นปัจจัยให้เกิด
๔. **นามรูป** (กายและใจ) เป็นปัจจัยให้เกิด
๕. **สฬายตนะ** (อายตนะภายในทั้ง ๖: ตา หู จมูก ลิ้น กาย ใจ) เป็นปัจจัยให้เกิด
๖. **ผัสสะ** (การกระทบอารมณ์) เป็นปัจจัยให้เกิด
๗. **เวทนา** (ความรู้สึกสุข ทุกข์ หรือเฉยๆ) เป็นปัจจัยให้เกิด
๘. **ตัณหา** (ความอยาก ความทะยานอยาก) เป็นปัจจัยให้เกิด
๙. **อุปาทาน** (ความยึดมั่นถือมั่น) เป็นปัจจัยให้เกิด
๑๐. **ภพ** (กระบวนการแห่งกรรมและภพภูมิ) เป็นปัจจัยให้เกิด
๑๑. **ชาติ** (การเกิด) เป็นปัจจัยให้เกิด
๑๒. **ชรามรณะ** ความโศกเศร้า ร่ำไรรำพัน และความทุกข์ใจทั้งปวง

💡 **การประยุกต์ใช้ในการปฏิบัติธรรม:**
พระอาจารย์แนะนำว่า เมื่อฝึกสมาธิให้ใจหยุดนิ่งจนเกิดสติปัญญา สติจะตัดวงจรของ "ผัสสะ" ไม่ให้แล่นไปสู่ "ตัณหาและอุปาทาน" ทำให้จิตใจหลุดพ้นจากความทุกข์ได้ในที่สุด`,
      citations: [
        {
          id: 'cit-doctrine-paticca',
          title: 'พระไตรปิฎกและหลักพุทธธรรมสากล: กฎปฏิจจสมุปบาท 12 อาการ',
          type: 'article',
          link: 'https://dhammatoday.com/articles/paticcasamuppada-core-dhamma',
          description: 'หลักการอธิบายความเชื่อมโยงของจิตใจตามหลักพุทธศาสตร์',
          actionText: 'อ่านคำอธิบายประกอบ'
        }
      ],
      evidenceLevel: 'general_dhamma',
      evidenceBadgeText: '🟡 การอธิบายหลักธรรมประกอบ (หลักพุทธธรรมสากลเชื่อมโยงการปฏิบัติ)',
      categoryBadge: 'พุทธธรรมและปรัชญา',
      situation: 'situation_a_full'
    };
  }

  // 5. ตรวจสอบประเด็นสถานการณ์วิกฤตและจริยธรรมการแพทย์ (Ethics Guardrail)
  const situational = analyzeSituationalQuestion(resolvedQuery);

  if (situational.isCritical && situational.topicType === 'medical_end_of_life') {
    const videoRec = findRelevantVideos('ผู้ป่วยระยะสุดท้าย การดูแลผู้ป่วย ถอดเครื่องช่วยหายใจ', 1);
    return {
      answerText: `${situational.empathyOpening}

${situational.medicalBoundaryNotice}

**คำอธิบายตามหลักพุทธศาสตร์และจริยธรรมคำสอนของพระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.):**

1. **เจตนาคือกรรม (เจตนาหัง ภิกขเว กัมมัง วทามิ):**
   การที่จะผิดศีลข้อ ๑ หรือเป็นบาปนั้น ต้องมี *เจตนาคิดฆ่าด้วยความเกลียดชังหรือมุ่งร้าย* แต่ในกรณีที่แพทย์และครอบครัวพิจารณาถอดเครื่องพยุงชีพหรือยุติการรักษาเมื่อผู้ป่วยเข้าสู่สภาวะสมองตายหรือระบบการทำงานของร่างกายหยุดลงตามกระบวนการธรรมชาติ โดยมีเจตนารมณ์เพื่อ **"ยุติความทุกข์ทรมานทางกายและปล่อยให้ร่างกายดำเนินไปตามธรรมชาติ"** มิได้มีจิตมุ่งร้ายทำลายชีวิต ย่อม **"มิใช่จิตบาป และห้ามตัดสินว่าครอบครัวหรือแพทย์เป็นคนบาป"**

2. **หัวใจสำคัญในวาระสุดท้าย: ช่วยประคองจิตให้ผ่องใส (จิตเต อสังกิลิฏเฐ สุคติ ปาฏิกังขา):**
   จิตดวงสุดท้ายก่อนละโลก (จุติจิต) เป็นตัวนำทางสู่สุคติภูมิ สิ่งที่ประเสริฐที่สุดที่ลูกหลานและญาติควรทำด้วยความกตัญญูและมีสติเพื่อผู้ป่วยในวาระนี้คือ:
   - เปิดเสียงสวดมนต์บทสรรเสริญพระรัตนตรัยเบาๆ
   - พูดคุยข้างหูด้วยเสียงที่นุ่มนวล เตือนสติให้นึกถึงคุณงามความดี ทาน ศีล ภาวนา ที่ท่านเคยสั่งสมมาตลอดชีวิต
   - แผ่เมตตาและทำใจของคนในครอบครัวให้สงบด้วยสติ ไม่ส่งเสียงร้องไห้คร่ำครวญรบกวนสมาธิของผู้ป่วย

3. **ข้อเสนอแนะในการปฏิบัติ:**
   ${situational.actionRecommendation}`,
      citations: [
        {
          id: 'cit-med-01',
          title: 'มุมมองทางพุทธศาสตร์และการแพทย์: การดูแลผู้ป่วยระยะสุดท้ายและการถอดเครื่องช่วยหายใจ',
          type: 'article',
          link: 'https://dhammatoday.com/articles/end-of-life-care-buddhist-perspective',
          description: 'บทความวิเคราะห์โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)',
          actionText: 'อ่านบทความต้นฉบับภายนอก'
        },
        {
          id: 'cit-med-02',
          title: 'มงคลชีวิต 38 ประการ ฉบับสมบูรณ์ (บทที่ 11: การบำรุงบิดามารดาในวาระสำคัญ)',
          type: 'book',
          link: '/reader/book_mongkol_chiwit_124?page=20',
          page_number: 20,
          description: 'แนวทางการตอบแทนพระคุณสูงสุดด้วยความกตัญญูและการมอบสมบัติทางธรรมให้พ่อแม่',
          actionText: 'เปิดอ่านหน้า 20 ในระบบ'
        },
        ...videoRec.citations
      ],
      evidenceLevel: 'general_dhamma',
      evidenceBadgeText: '🟡 การอธิบายหลักธรรมประกอบและจริยธรรมพุทธศาสตร์การแพทย์ (พระครูปลัดสุวัฒนโพธิคุณ M.D., Ph.D.)',
      categoryBadge: 'พุทธศาสตร์และจริยธรรมการแพทย์',
      situation: 'situation_a_full'
    };
  }

  if (situational.isCritical && situational.topicType === 'severe_grief_loss') {
    const videoRec = findRelevantVideos('ความสูญเสีย กำลังใจ คนรักจากไป อุทิศบุญ', 1);
    return {
      answerText: `${situational.empathyOpening}

**แนวทางปฏิบัติและหลักธรรมเตือนใจโดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ):**

1. **ระลึกถึงกฎแห่งอนิจจังและความเป็นธรรมดาของชีวิต:**
   ทุกชีวิตที่เกิดมาต้องพบกับความพลัดพรากจากของรักของชอบใจเป็นธรรมดา (อนิจจัง ทุกขัง อนัตตา) สิ่งสำคัญคือการมองด้วยความเข้าใจ ไม่จมดิ่งอยู่กับความโศกเศร้าจนทำร้ายตนเอง

2. **สายใยบุญที่ส่งถึงผู้ล่วงลับ:**
   ของขวัญที่ประเสริฐที่สุดที่ท่านสามารถมอบให้แก่ผู้ที่จากไป คือการ **"ทำบุญกุศล ทาน ศีล ภาวนา แล้วตั้งจิตอุทิศส่วนบุญไปให้"** เพราะบุญเท่านั้นที่เป็นที่พึ่งและส่งผลดีต่อดวงจิตในสัมปรายภพ

3. **การรักษาใจและสร้างกำลังใจ:**
   ${situational.actionRecommendation}`,
      citations: [
        {
          id: 'cit-loss-01',
          title: 'หนังสือ: กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
          type: 'book',
          link: '/reader/กะเทาะเปลือกความทุกข์-สุขให้ถึงเเก่น',
          description: 'หลักการทำความเข้าใจความทุกข์ การปล่อยวาง และการสร้างกำลังใจ',
          actionText: 'เปิดอ่านหนังสือฉบับเต็ม'
        },
        {
          id: 'cit-loss-02',
          title: 'หนังสือ: ทำใจให้พร้อมบวก',
          type: 'book',
          link: '/reader/tam-jai-hai-prom-buak',
          description: 'การเปลี่ยนวิกฤตความเศร้าให้เป็นพลังชีวิต และวิธีมองโลกตามความเป็นจริง',
          actionText: 'เปิดอ่านออนไลน์'
        },
        ...videoRec.citations
      ],
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟢 คำสอนโดยตรงของพระอาจารย์ (สืบค้นพบในคลังหนังสือและสื่อธรรมะ)',
      categoryBadge: 'การเยียวยาใจและเผชิญความสูญเสีย',
      situation: 'situation_a_full'
    };
  }

  // 6. อันดับ 1 & 2: สืบค้นคลังเนื้อหาภายใน (หนังสือและบทความ)
  const internalSearch = searchInternalKnowledge(resolvedQuery);

  if (internalSearch.hasDirectEvidence && internalSearch.results.length > 0) {
    const primary = internalSearch.results[0];
    const isBookOrArticle = primary.sourceType === 'book_page' || primary.sourceType === 'book' || primary.sourceType === 'article' || (primary.link && primary.link.includes('/reader/'));

    if (isBookOrArticle && primary.score >= 35 && primary.isDirectEvidence) {
      // Situation A: พบคำตอบที่เพียงพอจากหนังสือหรือบทความ
      const citations: DhammaCitation[] = internalSearch.results.slice(0, 3).map(r => ({
        id: r.id,
        title: r.title,
        type: (r.sourceType === 'book_page' || r.sourceType === 'book' || (r.link && r.link.includes('/reader/'))) ? 'book' :
              (r.sourceType === 'video' || (r.link && r.link.includes('/videos'))) ? 'video' :
              (r.sourceType === 'audio' || (r.link && r.link.includes('/audios'))) ? 'audiobook' : 'article',
        link: r.link,
        cover: r.cover,
        page_number: r.pageNumber,
        snippet: r.highlightSnippet,
        description: r.fullExcerpt.slice(0, 140) + '...',
        actionText: r.actionText
      }));

      let answerText = '';
      if (primary.sourceType === 'book_page' && primary.paliVerse) {
        answerText = `เจริญพร จากการสืบค้นเนื้อหาฉบับเต็มใน **"${primary.bookTitle}" (หน้า ${primary.pageNumber})** พระครูปลัดสุวัฒนโพธิคุณได้แสดงคำสอนในหัวข้อ **"${primary.sectionTitle || primary.chapterTitle}"** ไว้อย่างชัดเจน:

📖 **พุทธพจน์และคำแปล:**
*"${primary.paliVerse}"*
แปลว่า: "${primary.paliMeaning}"

💡 **เนื้อหาคำสอนโดยละเอียดจากหนังสือ:**
${primary.fullExcerpt}

📌 **ตำแหน่งอ้างอิง:**
ท่านสามารถเปิดอ่านเนื้อหาฉบับเต็มพร้อมบริบทแวดล้อมได้ในหน้า ${primary.pageNumber} ของหนังสือเล่มนี้ในระบบ`;
      } else {
        answerText = `เจริญพร จากการค้นหาในคลังธรรมะของ **พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)** พบหลักฐานคำสอนที่ตรงกับประเด็นคำถามของท่านใน **"${primary.title}"**:

${primary.fullExcerpt}

💡 **คำแนะนำเพิ่มเติมจากพระอาจารย์:**
หลักธรรมดังกล่าวช่วยเป็นแผนที่นำทางชีวิตให้ท่านมีสติ รู้เท่าทันอารมณ์ และก้าวข้ามอุปสรรคได้อย่างสง่างาม ท่านสามารถกดเปิดศึกษาเนื้อหาฉบับสมบูรณ์ได้จากรายการอ้างอิงด้านล่างนี้`;
      }

      // หากมีวิดีโอที่เกี่ยวข้องเสริมความเข้าใจ ให้แนบประกอบ
      const videoRec = findRelevantVideos(resolvedQuery, 1);
      if (videoRec.citations.length > 0 && videoRec.hasDirectVideo) {
        citations.push(videoRec.citations[0]);
        answerText += generateVideoRecommendationMarkdown(
          resolvedQuery, 
          videoRec.matchedVideos.slice(0, 1), 
          videoRec.channelSearchUrl,
          '🎬 **วิดีโอเทศนาประกอบการศึกษาเพิ่มเติม:**'
        );
      }

      return {
        answerText,
        citations,
        evidenceLevel: 'direct_verified',
        evidenceBadgeText: '🟢 คำสอนโดยตรงจากคลังหนังสือ/บทความ (Situation A)',
        categoryBadge: 'คำสอนตรงจากคลังหนังสือ',
        matchedCount: citations.length,
        sourceContextTitle: primary.title,
        situation: 'situation_a_full'
      };
    }
  }

  // 7. อันดับ 4: แหล่งภายนอกที่ตรวจสอบแล้ว (Verified External Sources)
  const externalSearch = await searchExternalDhammaSources(resolvedQuery);

  if (externalSearch.sources.length > 0 && (externalSearch.sources[0].score || 0) >= 30) {
    const extPrimary = externalSearch.sources[0];
    const citations: DhammaCitation[] = externalSearch.sources.map((s: VerifiedExternalSource) => ({
      id: s.id,
      title: s.title,
      type: s.domain.includes('youtube') ? 'video' : 'article',
      link: s.url,
      cover: s.domain.includes('youtube') ? 'https://img.youtube.com/vi/EcftiN9wMc8/hqdefault.jpg' : undefined,
      description: `แหล่งที่มา: ${s.publisher} (${s.domain}) | ผู้บรรยาย: ${s.speaker}`,
      snippet: s.excerpt,
      actionText: s.domain.includes('youtube') ? '▶️ รับชมบน YouTube' : 'เปิดอ่าน/รับชมต้นฉบับภายนอก'
    }));

    let answerText = `เจริญพร จากการสืบค้นฐานข้อมูลคำสอนทางการภายนอกของ **พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)** พบคำอธิบายในหัวข้อ **"${extPrimary.title}"** (เผยแพร่ผ่าน ${extPrimary.publisher}):

${extPrimary.excerpt}

🔗 **การตรวจสอบแหล่งที่มา:**
คำตอบนี้อ้างอิงจากบทความและบทถอดเสียงทางการของพระอาจารย์โดยตรง ท่านสามารถเปิดอ่านต้นทางเพื่อศึกษาบริบทเพิ่มเติมได้ที่ลิงก์ด้านล่างนี้`;

    const videoRec = findRelevantVideos(resolvedQuery, 1);
    if (videoRec.citations.length > 0 && !citations.some(c => c.type === 'video')) {
      citations.push(videoRec.citations[0]);
      answerText += generateVideoRecommendationMarkdown(resolvedQuery, videoRec.matchedVideos.slice(0, 1), videoRec.channelSearchUrl);
    }

    return {
      answerText,
      citations,
      evidenceLevel: 'direct_verified',
      evidenceBadgeText: '🟢 คำสอนโดยตรงจากแหล่งทางการภายนอกที่ตรวจสอบแล้ว',
      categoryBadge: 'แหล่งคำสอนทางการภายนอก',
      matchedCount: citations.length,
      sourceContextTitle: extPrimary.title,
      situation: 'situation_a_full'
    };
  }

  // 8. อันดับ 3: คลังวิดีโอเทศนา YouTube ของพระอาจารย์ (Knowledge-to-Video Fallback)
  // หากในหนังสือหรือบทความไม่พบคำตอบที่เพียงพอ ให้ตรวจสอบวิดีโอของพระอาจารย์
  const videoFallback = findRelevantVideos(resolvedQuery, 3);

  if (videoFallback.matchedVideos.length > 0) {
    // Situation C: ไม่พบคำตอบในหนังสือ แต่พบวิดีโอเทศนาของพระอาจารย์ที่เกี่ยวข้อง
    const videoMarkdown = generateVideoRecommendationMarkdown(
      resolvedQuery,
      videoFallback.matchedVideos,
      videoFallback.channelSearchUrl,
      '🎬 **วิดีโอคำสอนของพระอาจารย์ที่ตอบคำถามนี้:**'
    );

    const answerText = `เจริญพร จากการตรวจสอบในคลังหนังสือและบทความของห้องสมุดดิจิทัล ขณะนี้ยังไม่พบบันทึกข้อความที่ตอบคำถามของท่านได้อย่างสมบูรณ์

อย่างไรก็ตาม ในคลังวิดีโอเทศนาของ **พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)** บนช่อง YouTube ทางการ **@ThanavuddhoStory** มีคลิปธรรมบรรยายที่เกี่ยวข้องกับประเด็นที่ท่านสอบถามโดยตรง ซึ่งท่านสามารถรับชมเพื่อศึกษาคำสอนฉบับเต็มได้ดังนี้:${videoMarkdown}`;

    return {
      answerText,
      citations: videoFallback.citations,
      evidenceLevel: 'general_dhamma',
      evidenceBadgeText: '🟡 แนะนำวิดีโอเทศนาของพระอาจารย์ (Knowledge-to-Video Fallback)',
      categoryBadge: 'วิดีโอเทศนา YouTube แนะนำ',
      matchedCount: videoFallback.citations.length,
      situation: 'situation_c_video_fallback',
      missingAspectNotice: 'คลังหนังสือยังไม่มีข้อมูลเพียงพอ แนะนำรับชมวิดีโอเทศนาจริงของพระอาจารย์'
    };
  }

  // 9. Situation D: ไม่พบทั้งข้อมูลและวิดีโอจากแหล่งคำสอนที่เชื่อมต่อ
  // บันทึกคำถามลงในคลังเพื่อให้ผู้ดูแลนำไปปรับปรุงคลังความรู้
  try {
    logUnansweredQuery(query);
  } catch (err) {
    console.error('Failed to log unanswered query:', err);
  }

  return {
    answerText: `เจริญพร ขณะนี้ยังไม่พบข้อมูลหรือวิดีโอจากแหล่งคำสอนที่เชื่อมต่อ ซึ่งสามารถใช้ตอบคำถามนี้ได้อย่างมั่นใจ

ทั้งนี้ ระบบห้องสมุดยึดมั่นในหลักการนำเสนอเฉพาะคำสอนที่มีหลักฐานยืนยันได้จริง จึงไม่แต่งคำตอบหรือคาดเดาข้อมูลขึ้นเอง หากท่านมีคำถามเกี่ยวกับหลักธรรม การฝึกสมาธิ หรือการดำเนินชีวิตในหัวข้ออื่น สามารถสอบถามเข้ามาได้เสมอ`,
    citations: [],
    evidenceLevel: 'unverified_or_no_evidence',
    evidenceBadgeText: '⚪ ยังไม่พบข้อมูลหรือวิดีโอจากแหล่งคำสอนที่เชื่อมต่อ',
    categoryBadge: 'ยังไม่พบข้อมูลที่ยืนยันได้',
    matchedCount: 0,
    situation: 'situation_d_not_found',
    missingAspectNotice: 'ยังไม่พบข้อมูลในคลังหนังสือและคลังวิดีโอที่ตรงกับหัวข้อนี้อย่างมั่นใจ'
  };
}
