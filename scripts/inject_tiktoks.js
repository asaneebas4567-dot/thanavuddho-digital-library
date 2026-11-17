const fs = require('fs');

const items = [
  { id: '7708248719312817429', title: 'ธรรมะรอบตัว EP.12 | TikTok @udornsharo', desc: 'ข้อคิดธรรมะเตือนใจสั้นกระชับ ถ่ายทอดหลักคิดและคำสอนในการดำเนินชีวิต' },
  { id: '7708038788345367860', title: 'ธรรมะรอบตัว EP.11 | TikTok @udornsharo', desc: 'ข้อคิดเตือนใจสั้นกระชับจากช่อง TikTok @udornsharo (ธรรมะรอบตัว) นำหลักธรรมมาปรับใช้ในชีวิตประจำวัน' },
  { id: '7708038885179182342', title: 'ธรรมะรอบตัว EP.10 | TikTok @udornsharo', desc: 'หลักคิดในการดำเนินชีวิตจาก TikTok @udornsharo เสริมสร้างกำลังใจและความสงบสุข' },
  { id: '7708038069219282196', title: 'ธรรมะรอบตัว EP.09 | TikTok @udornsharo', desc: 'ข้อคิดเตือนใจเพื่อการพัฒนาจิตใจและสร้างความสุขในการทำงาน' },
  { id: '7708038005012843796', title: 'ธรรมะรอบตัว EP.08 | TikTok @udornsharo', desc: 'ธรรมะสั้นกระชับเข้าใจง่าย นำไปปฏิบัติจริงได้ในชีวิตประจำวัน' },
  { id: '7708037807423524116', title: 'ธรรมะรอบตัว EP.07 | TikTok @udornsharo', desc: 'วิธีวางใจให้เป็นสุขและปล่อยวางความกังวลใจ โดยธรรมะรอบตัว @udornsharo' },
  { id: '7708037391382056198', title: 'ธรรมะรอบตัว EP.06 | TikTok @udornsharo', desc: 'หลักธรรมสร้างพลังใจ เปลี่ยนมุมมองความคิดสู่ความสุขที่แท้จริง' },
  { id: '7707941318055431476', title: 'ธรรมะรอบตัว EP.05 | TikTok @udornsharo', desc: 'ธรรมะเตือนใจสั้นเพื่อการดำเนินชีวิตอย่างมีสติและปัญญา' },
  { id: '7707939516614577428', title: 'ธรรมะรอบตัว EP.04 | TikTok @udornsharo', desc: 'ข้อคิดสอนใจสั้นๆ จากช่อง TikTok @udornsharo ช่วยสร้างความสุขในใจ' },
  { id: '7707938953004993813', title: 'ธรรมะรอบตัว EP.03 | TikTok @udornsharo', desc: 'หลักคิดสลายความเครียดและสร้างพลังบวกในชีวิตประจำวัน' },
  { id: '7707938259275418886', title: 'ธรรมะรอบตัว EP.02 | TikTok @udornsharo', desc: 'วิธีคิดเปลี่ยนชีวิตให้เป็นสุขและการฝึกสติในชีวิตจริง' },
  { id: '7707937428224478485', title: 'ธรรมะรอบตัว EP.01 | TikTok @udornsharo', desc: 'จุดเริ่มต้นแห่งความสุขและข้อคิดธรรมะเตือนใจจากช่อง @udornsharo' }
];

const thumbs = [
  'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=600'
];

const entries = items.map((item, idx) => {
  const thumb = thumbs[idx % thumbs.length];
  const views = 1500 + (idx * 280);
  return `  {
    id: 'vid-tiktok-${item.id}',
    title: '${item.title}',
    description: '${item.desc}',
    video_url: 'https://www.tiktok.com/@udornsharo/video/${item.id}',
    platform: 'tiktok',
    tiktokId: '${item.id}',
    thumbnail: '${thumb}',
    duration: '01:00',
    video_type: 'tiktok_short',
    orientation: 'vertical',
    aspect_ratio: '9:16',
    category_ids: ['cat_001', 'cat_006'],
    tags: ['TikTok', 'คลิปติ๊กต๊อก', 'ธรรมะรอบตัว', 'udornsharo', 'ข้อคิดเตือนใจ'],
    related_book_ids: ['book_tam_jai_hai_prom_buak'],
    source_url: 'https://www.tiktok.com/@udornsharo/video/${item.id}',
    copyright_status: 'official',
    published_date: '2026-11-17',
    view_count: ${views},
    author: 'ธรรมะรอบตัว (TikTok @udornsharo)',
    channel_handle: '@udornsharo',
    is_available: true
  }`;
}).join(',\n');

const p = 'src/data/videoData.ts';
let code = fs.readFileSync(p, 'utf8');
const targetIndex = code.indexOf("id: 'vid-tiktok-7708248719312817429'");
if (targetIndex !== -1) {
  const openBrace = code.lastIndexOf('{', targetIndex);
  const closeArray = code.indexOf('];', targetIndex);
  const updated = code.slice(0, openBrace) + entries + '\n];' + code.slice(closeArray + 2);
  fs.writeFileSync(p, updated, 'utf8');
  console.log('Successfully injected all 12 TikTok videos');
} else {
  console.error('Target not found in videoData.ts');
}
