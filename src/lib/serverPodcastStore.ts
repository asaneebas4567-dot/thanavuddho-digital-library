import fs from 'fs';
import path from 'path';
import { PodcastItem, PodcastListeningProgress, PodcastListeningSession } from '@/types/podcast';
import { getSupabase } from './supabaseClient';
import { processEarnPoints } from './learningPointsServer';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const PODCASTS_FILE = path.join(DATA_DIR, 'persistentPodcasts.json');
const PROGRESS_FILE = path.join(DATA_DIR, 'persistentPodcastProgress.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'persistentPodcastSessions.json');

// Initial default podcasts (including 8 YouTube episodes and MP3 entries)
const DEFAULT_PODCASTS: PodcastItem[] = [
  {
    id: 'pod-tj-01',
    title: 'ตอนพิเศษ: คิดบวกไม่ใช่การหลอกตัวเอง',
    description: 'ชวนคุณมาพักสายตาจิบกาแฟอุ่นๆ ไปกับพอดแคสต์ฟังสบายที่จะช่วยเติมพลังบวกให้กับชีวิต เพราะการคิดบวกไม่ใช่การหลอกตัวเอง แต่คือการมองหาโอกาสและแง่คิดดีๆ ในทุกสถานการณ์',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=COag-KtzVmY',
    youtube_video_id: 'COag-KtzVmY',
    duration_seconds: 1471,
    duration_formatted: '24:31',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '09 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 1,
    transcript: [
      { time: '00:00', speaker: 'ผู้บรรยาย & พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขอต้อนรับเข้าสู่ "ทำใจให้พร้อมบวก Podcast" ตอนพิเศษ: คิดบวกไม่ใช่การหลอกตัวเอง ผลงานธรรมะประพันธ์โดย พระครูปลัดสุวัฒนโพธิคุณ' },
      { time: '01:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การคิดบวกไม่ใช่การหลอกตัวเอง ไม่ใช่การปฏิเสธความจริง แต่คือการมองหาโอกาสและแง่คิดดีๆ ในทุกสถานการณ์' },
      { time: '03:45', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ใจของเราเปรียบเสมือนแม่ทัพ หากใจมีพลัง สติปัญญาและความสงบเย็นย่อมเป็นเกราะคุ้มกันอุปสรรคทั้งปวง' },
      { time: '07:20', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยอมรับ เข้าใจ เกิดประโยชน์ เมื่อเรายอมรับความจริง เข้าใจความเป็นไป และนำมาใช้ให้เกิดประโยชน์ ใจจะเบาสบาย' }
    ]
  },
  {
    id: 'pod-tj-02',
    title: 'บทที่ 1: ปกติของมนุษย์ ปกติของผู้มีศีล',
    description: 'เรียนรู้ธรรมชาติความเป็นจริงของมนุษย์ ความสำคัญของการรักษาศีลเพื่อเป็นเกราะคุ้มครองใจให้สงบเย็นและมั่นคงในทุกการดำเนินชีวิต',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=0-MHKservjk',
    youtube_video_id: '0-MHKservjk',
    duration_seconds: 1178,
    duration_formatted: '19:38',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '09 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 2,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 1: ปกติของมนุษย์ ปกติของผู้มีศีล' },
      { time: '02:15', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ศีลไม่ได้เป็นข้อห้ามที่จำกัดอิสรภาพ แต่คือเกราะคุ้มครองใจให้สงบเย็นและไม่เดือดร้อนใจในภายหลัง' },
      { time: '05:40', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'คนที่มีปกติใจมั่นคง จะไม่หวั่นไหวไปกับกระแสโลก เพราะรู้เท่าทันความเป็นจริงของสังขาร' }
    ]
  },
  {
    id: 'pod-tj-03',
    title: 'บทที่ 2: วิกฤต เป็น โอกาส',
    description: 'ชวนคุยสบายๆ เติมพลังใจ เปลี่ยนมุมมองเมื่อเผชิญหน้ากับอุปสรรค ทุกวิกฤตมีเมล็ดพันธุ์แห่งโอกาสซ่อนอยู่เสมอ',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=KM6twDHD6yQ',
    youtube_video_id: 'KM6twDHD6yQ',
    duration_seconds: 1328,
    duration_formatted: '22:08',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '09 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 3,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 2: วิกฤต เป็น โอกาส' },
      { time: '02:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ในทุกวิกฤต มีเมล็ดพันธุ์แห่งโอกาสซ่อนอยู่เสมอ อยู่ที่ว่าเรามองด้วยสายตาของปัญหา หรือมองด้วยสายตาของปัญญา' },
      { time: '06:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ความล้มเหลวไม่ใช่จุดจบ แต่คือบทเรียนที่สอนให้เราแข็งแกร่งและก้าวข้ามขีดจำกัดเดิม' }
    ]
  },
  {
    id: 'pod-tj-04',
    title: 'บทที่ 3: ความลับของความสุข',
    description: 'ค้นพบความลับของสิ่งที่ทุกคนปรารถนา นั่นคือเรื่องของ "ความสุข" ที่ไม่ได้อยู่ไกลตัว แต่อยู่ที่ใจที่สงบ นิ่ง และรู้จักพอดีจากภายใน',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=bUHJ_fzyJBU',
    youtube_video_id: 'bUHJ_fzyJBU',
    duration_seconds: 1305,
    duration_formatted: '21:45',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '09 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 4,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 3: ความลับของความสุข' },
      { time: '03:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ความสุขที่แท้จริงไม่ได้ขึ้นอยู่กับวัตถุภายนอก แต่อยู่ที่ความนิ่ง สงบ และความพอดีภายในใจเราเอง' },
      { time: '07:05', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เมื่อใจหยุดนิ่ง ณ ศูนย์กลางกาย ความสว่างและปีติจะเกิดขึ้นอย่างเป็นธรรมชาติ' }
    ]
  },
  {
    id: 'pod-tj-05',
    title: 'บทที่ 4: คนสุข คนไม่หลงโลก',
    description: 'สำรวจการใช้ชีวิตในสังคมปัจจุบันที่เต็มไปด้วยความวุ่นวายและการแข่งขัน ใช้ชีวิตอย่างมีความสุขโดยไม่หลงใหลไปตามกระแสกิเลสของโลก',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=CigtAiorDEI',
    youtube_video_id: 'CigtAiorDEI',
    duration_seconds: 1262,
    duration_formatted: '21:02',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '09 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 5,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 4: คนสุข คนไม่หลงโลก' },
      { time: '02:50', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การใช้ชีวิตในโลกปัจจุบัน ต้องมีหลักยึด ไม่ไหลไปตามกระแสกิเลสและค่านิยมชั่วคราว' },
      { time: '06:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'อยู่อย่างเข้าใจ ปล่อยวางในสิ่งที่ควบคุมไม่ได้ และทำหน้าที่ของตนเองให้ดีที่สุดในทุกปัจจุบันขณะ' }
    ]
  },
  {
    id: 'pod-tj-06',
    title: 'บทที่ 5: มองข้าม ปัญหาเล็กๆ',
    description: 'การฝึกใจให้มองข้ามเรื่องหยุมหยิม ปัญหาเล็กๆ น้อยๆ ที่คอยบั่นทอนสมาธิและพลังใจ ให้ความสำคัญกับเป้าหมายชีวิตและรักษาใจให้ผ่องใสเสมอ',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=N_ruzGNnZUI',
    youtube_video_id: 'N_ruzGNnZUI',
    duration_seconds: 796,
    duration_formatted: '13:16',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '10 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 6,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 5: มองข้าม ปัญหาเล็กๆ' },
      { time: '02:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ปัญหาเล็กๆ น้อยๆ ในชีวิตประจำวัน ถ้าเราเก็บมาคิดทุกเรื่อง ใจเราจะหนักและไม่มีพื้นที่สำหรับสิ่งที่ดีกว่า' },
      { time: '05:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'มองข้ามเรื่องไม่เป็นเรื่อง แล้วโฟกัสที่เป้าหมายที่แท้จริง คือการทำความดีและรักษาใจให้บริสุทธิ์' }
    ]
  },
  {
    id: 'pod-tj-07',
    title: 'บทที่ 6: คิดบวก สร้างโลกบวก',
    description: 'พลังของการคิดบวกและการแผ่เมตตา พลังบวกจากใจหนึ่งดวงสามารถส่งต่อและสร้างแรงบันดาลใจให้คนรอบข้างและสังคมน่าอยู่ยิ่งขึ้น',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=IMzgMRQ71u8',
    youtube_video_id: 'IMzgMRQ71u8',
    duration_seconds: 984,
    duration_formatted: '16:24',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '10 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 7,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 6: คิดบวก สร้างโลกบวก' },
      { time: '02:40', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'พลังความคิดของเราส่งผลต่อโลกรอบตัว เมื่อใจเราสว่างไสว ย่อมส่งต่อรอยยิ้ม ความเมตตา และพลังบวกให้ผู้คนรอบข้าง' },
      { time: '06:15', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'การคิดดี พูดดี ทำดี คือการร่วมกันสร้างสิ่งแวดล้อมที่น่าอยู่และงดงามให้กับโลกใบนี้' }
    ]
  },
  {
    id: 'pod-tj-08',
    title: 'บทสรุปส่งท้าย: เคล็ดลับสูงสุด... ใจพร้อมบวกตลอดไป',
    description: 'บทสรุปส่งท้ายและเคล็ดลับสำคัญในการประคองใจให้สว่างไสว พร้อมเผชิญทุกความท้าทายด้วยใจที่เป็นบวก มีสติ และมั่นคงในธรรมะตลอดเส้นทางชีวิต',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=XkdXhU_EA1o',
    youtube_video_id: 'XkdXhU_EA1o',
    duration_seconds: 1168,
    duration_formatted: '19:28',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '10 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 8,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทสรุปส่งท้าย: เคล็ดลับสูงสุด... ใจพร้อมบวกตลอดไป' },
      { time: '03:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เคล็ดลับสำคัญที่สุดคือ "ความต่อเนื่อง" การฝึกใจให้หยุดนิ่งที่ศูนย์กลางกายทุกวัน วันละเล็กวันละน้อย' },
      { time: '07:20', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขออำนวยอวยพรให้ทุกท่านมีใจที่พร้อมบวก มีสติ ปัญญา และความสุขความเจริญรุ่งเรืองในชีวิตทุกประการเทอญ' }
    ]
  },
  // MP3 Audio Example (Supabase Storage Compatible)
  {
    id: 'pod-mp3-01',
    title: 'เสียงนำนั่งสมาธิและแผ่เมตตา (MP3 High Quality)',
    description: 'เสียงบรรยายนำนั่งสมาธิ ปรับสรีระ ผ่อนคลายร่างกาย และน้อมใจหยุดนิ่งที่ศูนย์กลางกายฐานที่ 7 เพื่อความสงบเย็นแห่งจิตวิญญาณ ฟังต่อเนื่องขณะดับหน้าจอได้',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800',
    source_type: 'mp3',
    audio_file_path: 'podcasts/meditation-guided-hq.mp3',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/outdoor_morning.ogg',
    duration_seconds: 900,
    duration_formatted: '15:00',
    category_id: 'cat_meditation',
    category_name: 'สมาธิ & จิตสงบ',
    is_published: true,
    published_at: '11 พ.ย. 2569',
    order: 9,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ขอเจริญพร ให้ทุกท่านนั่งในท่าที่สบาย ผ่อนคลายกล้ามเนื้อทุกส่วน' },
      { time: '03:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'วางใจเบาๆ ไว้ที่ศูนย์กลางกายฐานที่ 7 เหนือระดับสะดือขึ้นมา 2 นิ้วมือ' },
      { time: '08:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'นึกนิมิตเป็นดวงแก้วใสบริสุทธิ์ หยุดนิ่งอย่างสบายๆ' }
    ]
  }
];

// Helper: Ensure directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// -----------------------------------------------------------------------------
// 1. PODCASTS CRUD
// -----------------------------------------------------------------------------
export function getAllPodcasts(): PodcastItem[] {
  try {
    ensureDataDir();
    if (fs.existsSync(PODCASTS_FILE)) {
      const data = JSON.parse(fs.readFileSync(PODCASTS_FILE, 'utf-8'));
      if (Array.isArray(data) && data.length > 0) {
        // Merge or return
        return data;
      }
    }
    // Write defaults
    fs.writeFileSync(PODCASTS_FILE, JSON.stringify(DEFAULT_PODCASTS, null, 2), 'utf-8');
    return DEFAULT_PODCASTS;
  } catch {
    return DEFAULT_PODCASTS;
  }
}

export function savePodcasts(podcasts: PodcastItem[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PODCASTS_FILE, JSON.stringify(podcasts, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving podcasts:', err);
  }
}

export function getPodcastById(id: string): PodcastItem | null {
  const podcasts = getAllPodcasts();
  return podcasts.find(p => p.id === id || p.youtube_video_id === id) || null;
}

// -----------------------------------------------------------------------------
// 2. LISTENING PROGRESS (PHASE 7)
// -----------------------------------------------------------------------------
function readProgressStore(): Record<string, PodcastListeningProgress> {
  try {
    ensureDataDir();
    if (fs.existsSync(PROGRESS_FILE)) {
      return JSON.parse(fs.readFileSync(PROGRESS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function writeProgressStore(store: Record<string, PodcastListeningProgress>): void {
  try {
    ensureDataDir();
    fs.writeFileSync(PROGRESS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing podcast progress:', err);
  }
}

export function getListeningProgress(userEmail: string, podcastId: string): PodcastListeningProgress | null {
  if (!userEmail || !podcastId) return null;
  const key = `${userEmail.toLowerCase()}_${podcastId}`;
  const store = readProgressStore();
  return store[key] || null;
}

export function saveListeningProgress(
  userEmail: string,
  userId: string,
  podcastId: string,
  currentPositionSeconds: number,
  durationSeconds: number
): PodcastListeningProgress {
  const store = readProgressStore();
  const key = `${userEmail.toLowerCase()}_${podcastId}`;
  const isCompleted = durationSeconds > 0 && currentPositionSeconds >= durationSeconds * 0.9;

  const record: PodcastListeningProgress = {
    user_id: userId || userEmail,
    user_email: userEmail.toLowerCase(),
    podcast_id: podcastId,
    current_position_seconds: Math.max(0, Math.floor(currentPositionSeconds)),
    duration_seconds: Math.max(0, Math.floor(durationSeconds)),
    last_listened_at: new Date().toISOString(),
    completed_status: isCompleted
  };

  store[key] = record;
  writeProgressStore(store);

  // Also sync to Supabase if available
  const supabase = getSupabase();
  if (supabase) {
    Promise.resolve(
      supabase
        .from('podcast_listening_progress')
        .upsert({
          user_email: record.user_email,
          podcast_id: record.podcast_id,
          current_position_seconds: record.current_position_seconds,
          duration_seconds: record.duration_seconds,
          last_listened_at: record.last_listened_at,
          completed_status: record.completed_status
        })
    ).catch(() => {});
  }

  return record;
}

// -----------------------------------------------------------------------------
// 3. POINT INTEGRATION & SESSION HEARTBEAT (PHASE 8)
// Rule: Listen 10 minutes (600 seconds) = 5 points
// -----------------------------------------------------------------------------
const SECONDS_PER_CYCLE = 600; // 10 minutes
const POINTS_PER_CYCLE = 5;

function readSessionsStore(): Record<string, PodcastListeningSession> {
  try {
    ensureDataDir();
    if (fs.existsSync(SESSIONS_FILE)) {
      return JSON.parse(fs.readFileSync(SESSIONS_FILE, 'utf-8'));
    }
  } catch {}
  return {};
}

function writeSessionsStore(store: Record<string, PodcastListeningSession>): void {
  try {
    ensureDataDir();
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing podcast sessions:', err);
  }
}

export interface PingListeningSessionResult {
  success: boolean;
  message?: string;
  accumulatedSeconds: number;
  secondsRemainingInCycle: number;
  pointsAwarded: number;
  newTotalPoints?: number;
  isDailyCapReached?: boolean;
}

export function pingListeningSession(params: {
  sessionId?: string;
  userEmail: string;
  podcastId: string;
  sourceType: 'youtube' | 'mp3';
  deltaSeconds: number; // typically 15-30s
}): PingListeningSessionResult {
  const { userEmail, podcastId, sourceType, deltaSeconds } = params;
  if (!userEmail || !podcastId) {
    return {
      success: false,
      message: 'ข้อมูลไม่ครบถ้วน',
      accumulatedSeconds: 0,
      secondsRemainingInCycle: SECONDS_PER_CYCLE,
      pointsAwarded: 0
    };
  }

  // Server Anti-Cheat: deltaSeconds cannot be unreasonably high
  const verifiedDelta = Math.min(Math.max(0, Math.floor(deltaSeconds)), 45);
  if (verifiedDelta <= 0) {
    return {
      success: true,
      accumulatedSeconds: 0,
      secondsRemainingInCycle: SECONDS_PER_CYCLE,
      pointsAwarded: 0
    };
  }

  const sessions = readSessionsStore();
  const sessionKey = `${userEmail.toLowerCase()}_${podcastId}_${new Date().toISOString().split('T')[0]}`;
  let session = sessions[sessionKey];

  if (!session) {
    session = {
      id: `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      user_email: userEmail.toLowerCase(),
      podcast_id: podcastId,
      source_type: sourceType,
      started_at: new Date().toISOString(),
      last_ping_at: new Date().toISOString(),
      accumulated_seconds: 0,
      points_awarded: 0
    };
  }

  session.accumulated_seconds += verifiedDelta;
  session.last_ping_at = new Date().toISOString();

  let awardedPoints = 0;
  let earnResult: any = null;

  // Check if completed a 10-minute cycle
  if (session.accumulated_seconds >= SECONDS_PER_CYCLE) {
    awardedPoints = POINTS_PER_CYCLE;
    session.accumulated_seconds -= SECONDS_PER_CYCLE;
    session.points_awarded += awardedPoints;

    // Credit to main learning points system
    earnResult = processEarnPoints({
      userEmail: userEmail.toLowerCase(),
      type: 'listen_podcast',
      sourceId: podcastId,
      durationSeconds: SECONDS_PER_CYCLE
    });
  }

  sessions[sessionKey] = session;
  writeSessionsStore(sessions);

  const secondsRemaining = Math.max(0, SECONDS_PER_CYCLE - session.accumulated_seconds);

  return {
    success: true,
    accumulatedSeconds: session.accumulated_seconds,
    secondsRemainingInCycle: secondsRemaining,
    pointsAwarded: awardedPoints,
    newTotalPoints: earnResult?.pointsSummary?.availablePoints,
    isDailyCapReached: earnResult?.isDailyCapReached
  };
}
