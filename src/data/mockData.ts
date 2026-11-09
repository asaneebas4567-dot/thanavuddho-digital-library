import * as T from '../types';

export const author: T.Author = {
  id: 'author_001',
  display_name: 'พระครูปลัดสุวัฒนโพธิคุณ',
  name: 'พระอาจารย์สมชาย ฐานวุฑฺโฒ',
  pali_name: '',
  title: 'พระครูปลัดสุวัฒนโพธิคุณ',
  short_description: 'ผู้ก่อตั้ง Thanavuddho Library',
  biography: 'ประวัติพระอาจารย์สมชาย ฐานวุฑฺโฒ...',
  profile_image: '/images/author-placeholder.jpg',
  official_sources: [],
  verified: true
};

export const categories: T.Category[] = [
  { id: 'cat_world_civ', name: 'ห้องเรียน อารยธรรมโลก', description: 'หนังสือชุดประวัติศาสตร์ อารยธรรมโลก' },

  { id: 'cat_001', name: 'การดำเนินชีวิต', description: 'ธรรมะเพื่อการดำเนินชีวิตประจำวัน' },
  { id: 'cat_002', name: 'การพัฒนาตนเอง', description: 'ธรรมะเพื่อการพัฒนาตนเอง' },
  { id: 'cat_003', name: 'สมาธิและการปฏิบัติธรรม', description: 'แนวทางการฝึกสมาธิ' },
  { id: 'cat_004', name: 'ความสุข', description: 'วิธีสร้างความสุขจากภายใน' },
  { id: 'cat_005', name: 'จิตใจและความคิด', description: 'การจัดการกับความคิดและจิตใจ' },
  { id: 'cat_006', name: 'พระพุทธศาสนา', description: 'หลักธรรมคำสอนในพระพุทธศาสนา' },
  { id: 'cat_007', name: 'การศึกษาและการเรียนรู้', description: 'ธรรมะกับการศึกษา' }
];
 
export const tags: T.Tag[] = [
  { id: 'tag_001', name: 'สมาธิ' },
  { id: 'tag_002', name: 'ความสำเร็จ' },
  { id: 'tag_003', name: 'ครอบครัว' }
];

export const books: T.Book[] = [
  {
    id: 'book_tam_jai_hai_prom_buak',
    title: 'ทำใจให้พร้อมบวก',
    author_id: 'author_001',
    description: 'สร้างสุขที่แท้จริง ด้วยการสร้างความคิดดี ๆ จากการมองสิ่งต่าง ๆ อย่างเข้าใจ Positive Thinking "ยอมรับ เข้าใจ เกิดประโยชน์" มุมมองที่จะทำให้เรามีแง่คิดดี และมีความสุขบนพื้นฐานของการดำเนินชีวิต โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    content_type: 'book',
    category_ids: ['cat_002', 'cat_004', 'cat_005'],
    tags: ['ทำใจให้พร้อมบวก', 'คิดบวก', 'กำลังใจ', 'พัฒนาตนเอง', 'การดำเนินชีวิต', 'สมาธิ', 'ความสุข'],
    publication_year: 2566,
    page_count: 130,
    language: 'th',
    pdf_url: '/books/pdf/tam-jai-hai-prom-buak.pdf',
    reader_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/preview',
    source_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/view',
    audio_id: 'pod-tam-jai-hai-prom-buak',
    video_ids: [],
    copyright_status: 'approved',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    isbn: '978-616-7803-32-6',
    publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_khao_kor_sook_rao_kor_sook',
    title: 'เขาก็สุข เราก็สุข',
    author_id: 'author_001',
    description: 'นิยามของ "ความสุข" เกิดจากอะไร ตัวเราหรือคนอื่น หนังสือ "เขาก็สุข เราก็สุข" จะมอบคำตอบที่ทุกคนตามหา ทั้งการเปลี่ยนศัตรูให้เป็นมิตร การพูดความจริง ศิลปะป้องกันใจ และความสุขที่ไม่รู้โรย โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_004', 'cat_005'],
    tags: ['เขาก็สุข เราก็สุข', 'ความสุข', 'มิตรภาพ', 'ศิลปะป้องกันใจ', 'ธรรมะบำบัด', 'ความสัมพันธ์'],
    publication_year: 2564,
    page_count: 63,
    language: 'th',
    pdf_url: '/books/pdf/khao-kor-sook-rao-kor-sook.pdf',
    reader_url: 'https://drive.google.com/file/d/1JNmEozB38Vd013Gns8-5H0JREqNsJiDY/preview',
    source_url: 'https://drive.google.com/file/d/1JNmEozB38Vd013Gns8-5H0JREqNsJiDY/view',
    audio_id: null,
    video_ids: [],
    copyright_status: 'approved',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    isbn: '978-616-7803-24-1',
    publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_lom_hai_jai_khao_ok',
    title: 'ลมหายใจเข้าออก ของพระพุทธศาสนา',
    author_id: 'author_001',
    description: 'ธรรมบรรยายว่าด้วยหัวใจของการปฏิบัติและการเผยแผ่พระพุทธศาสนา ดั่งลมหายใจเข้าออกที่หล่อเลี้ยงชีวิตและสร้างแสงสว่างแห่งปัญญา โดย พระมหาสมชาย ฐานวุฑโฒ M.D., Ph.D.',
    cover_image: '/images/books/lom-hai-jai-khao-ok.jpg',
    content_type: 'book',
    category_ids: ['cat_003', 'cat_006'],
    tags: ['ลมหายใจเข้าออก', 'การปฏิบัติธรรม', 'พระพุทธศาสนา', 'สมาธิ', 'การเผยแผ่'],
    publication_year: 2558,
    page_count: 29,
    language: 'th',
    pdf_url: '/books/pdf/lom-hai-jai-khao-ok.pdf',
    reader_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/preview',
    source_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/view',
    audio_id: null,
    video_ids: [],
    copyright_status: 'approved',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    publisher: 'ขบวนการพุทธศาสตร์สากล',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_phoo_soon_sia_tee_mai_sin_soon',
    title: 'ผู้สูญเสีย ที่ไม่เสียศูนย์',
    author_id: 'author_001',
    description: 'ธรรมะเยียวยาใจเมื่อต้องเผชิญกับความพลัดพรากและการสูญเสียบุคคลอันเป็นที่รัก หลักคิดในการดึงสติกลับมาตั้งมั่น ไม่ให้ชีวิตต้อง "เสียศูนย์" เปลี่ยนความโศกเศร้าให้เป็นพลังแห่งความดีและกำลังใจในการก้าวต่อไปข้างหน้าตามหลักพุทธธรรม โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: '/images/books/phoo-soon-sia-tee-mai-sin-soon.png',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_003', 'cat_004'],
    tags: ['ผู้สูญเสีย ที่ไม่เสียศูนย์', 'กำลังใจ', 'เยียวยาจิตใจ', 'ความสูญเสีย', 'การพลัดพราก', 'สติ', 'สมาธิ', 'การดำเนินชีวิต'],
    publication_year: 2560,
    page_count: 170,
    language: 'th',
    pdf_url: '/books/pdf/phoo-soon-sia-tee-mai-sin-soon.pdf',
    reader_url: 'https://drive.google.com/file/d/1aosykTVkrW-HNNqyolvTUEyK_EGY5V7L/preview',
    source_url: 'https://drive.google.com/file/d/1aosykTVkrW-HNNqyolvTUEyK_EGY5V7L/view',
    audio_id: null,
    video_ids: [],
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_secret_of_love_rak_look_yang_rai',
    title: 'Secret of Love "รักลูกอย่างไรไม่ให้เสียน้ำตา"',
    author_id: 'author_001',
    description: 'เรียนรู้วิธีการประคับประคองชีวิตคู่เพื่อลูก และสร้างความสุขในครอบครัว บทพิสูจน์ความรักเมื่อมีอีกคนเพิ่มเข้ามาเติมเต็มคำว่า ครอบครัว ข้อคิดและแนวทางการเลี้ยงลูกตามหลักพุทธศาสนา โดย พระมหาสมชาย ฐานวุฑฺโฒ (พระครูปลัดสุวัฒนโพธิคุณ)',
    cover_image: '/images/books/secret-of-love-rak-look-yang-rai.png',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_002', 'cat_004'],
    tags: ['Secret of Love', 'รักลูกอย่างไรไม่ให้เสียน้ำตา', 'เลี้ยงลูก', 'ครอบครัว', 'ความรัก', 'ชีวิตคู่', 'ทันโลกทันธรรม', 'การดำเนินชีวิต', 'การพัฒนาตนเอง'],
    publication_year: 2559,
    page_count: 134,
    language: 'th',
    pdf_url: '/books/pdf/secret-of-love-rak-look.pdf',
    reader_url: 'https://drive.google.com/file/d/1XR72V9gqIEI24hn8PUrgBUbQAHKA7E5W/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1XR72V9gqIEI24hn8PUrgBUbQAHKA7E5W/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_the_lover_rak_pen_ja_hen_jai',
    title: 'The Lover "รักเป็นจะเห็นใจ"',
    author_id: 'author_001',
    description: 'บทเรียนพิเศษที่ต้องรู้ก่อนรัก การอยู่ร่วมกับความต่างอย่างลงตัว และการสร้างชีวิตคู่ผาสุก ข้อคิดเตือนสติสำหรับผู้ที่คิดจะแต่งงานเพื่อมองโลกตามความเป็นจริง เรียบเรียงจากรายการทันโลกทันธรรม โดย พระมหาสมชาย ฐานวุฑฺโฒ (พระครูปลัดสุวัฒนโพธิคุณ)',
    cover_image: '/images/books/the-lover-rak-pen-ja-hen-jai.png',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_002', 'cat_004'],
    tags: ['The Lover', 'รักเป็นจะเห็นใจ', 'ความรัก', 'ครอบครัว', 'ชีวิตคู่', 'ทันโลกทันธรรม', 'การดำเนินชีวิต', 'การพัฒนาตนเอง'],
    publication_year: 2559,
    page_count: 134,
    language: 'th',
    pdf_url: '/books/pdf/the-lover-rak-pen-ja-hen-jai.pdf',
    reader_url: 'https://drive.google.com/file/d/1xNorlpcHvz7h1pUfdmomHqllOd8ziTwN/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1xNorlpcHvz7h1pUfdmomHqllOd8ziTwN/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_yoo_nai_lok_mai_yang_mai_pen_rok',
    title: 'อยู่ในโลกใหม่อย่างไม่เป็นโรค',
    author_id: 'author_001',
    description: 'ข้อคิดการดูแลสุขภาพกายและใจให้แข็งแรงท่ามกลางความเปลี่ยนแปลงของโลกยุคใหม่ ด้วยหลักธรรมคำสอนและมุมมองทางการแพทย์ โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.) เพื่อให้ใช้ชีวิตอย่างมีความสุข ปลอดภัย และห่างไกลจากโรคภัยไข้เจ็บทั้งกายและใจ',
    cover_image: '/images/books/yoo-nai-lok-mai-yang-mai-pen-rok.png',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_002', 'cat_005'],
    tags: ['อยู่ในโลกใหม่อย่างไม่เป็นโรค', '1147 อยู่บนโลกใหม่อย่างไม่เป็นโรค', 'สุขภาพ', 'โลกยุคใหม่', 'การดำเนินชีวิต', 'การพัฒนาตนเอง'],
    publication_year: 2565,
    page_count: 48,
    language: 'th',
    pdf_url: '/books/pdf/yoo-nai-lok-mai.pdf',
    reader_url: 'https://drive.google.com/file/d/1-ODFFY1OLoegO149gtBQ5L5ESTlr2mhX/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1-ODFFY1OLoegO149gtBQ5L5ESTlr2mhX/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_tham_jai_hai_phrom_buak',
    title: 'ทำใจให้พร้อมบวก',
    author_id: 'author_001',
    description: 'วางพื้นฐานและปรับมุมมองความคิดสู่การเป็นคนคิดบวก (Positive Thinking) ในแบบพุทธะ ด้วยหลักธรรมและแนวทางที่เรียบง่ายแต่ทรงพลัง สามารถนำไปปรับใช้ในชีวิตประจำวันเพื่อสร้างความสุข ความสงบใจ และความสำเร็จในทุกสถานการณ์',
    cover_image: '/images/books/tham-jai-hai-phrom-buak.png',
    content_type: 'book',
    category_ids: ['cat_002', 'cat_004', 'cat_005'],
    tags: ['ทำใจให้พร้อมบวก', '1200 ทำใจให้พร้อมบวก', 'การคิดบวก', 'การพัฒนาตนเอง', 'ความสุข', 'จิตใจและความคิด'],
    publication_year: 2561,
    page_count: 141,
    language: 'th',
    pdf_url: '/books/pdf/tam-jai-hai-prom-buak.pdf',
    reader_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_lom_hai_jai_khao_ok_123',
    title: '123.ลมหายใจเข้าออกของพระพุทธศาสนา',
    author_id: 'author_001',
    description: 'ลมหายใจเข้าออกของพระพุทธศาสนา ผลงานธรรมบรรยายและข้อคิดธรรมะโดย พระมหาสมชาย ฐานวุฑฺโฒ (M.D., Ph.D.) ว่าด้วยการศึกษาความสำคัญและลมหายใจแห่งการดำรงอยู่ของพระพุทธศาสนา ประวัติศาสตร์การเผยแผ่ และการฝึกจิตเจริญสมาธิภาวนา',
    cover_image: '/images/books/lom-hai-jai-khao-ok.png',
    content_type: 'book',
    category_ids: ['cat_006', 'cat_003'],
    tags: ['ลมหายใจเข้าออกของพระพุทธศาสนา', 'พระพุทธศาสนา', 'สมาธิ', 'การปฏิบัติธรรม', 'อานาปานสติ'],
    publication_year: 2549,
    page_count: 29,
    language: 'th',
    pdf_url: '/books/pdf/lom-hai-jai-khao-ok-123.pdf',
    reader_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_mongkol_chiwit_124',
    title: '124.มงคลชีวิตฉบับทางก้าวหน้า',
    author_id: 'author_001',
    description: 'มงคลชีวิตฉบับทางก้าวหน้า',
    cover_image: '/images/books/mongkol-124.jpg',
    content_type: 'book',
    category_ids: ['cat_006'],
    tags: [],
    publication_year: 2567,
    page_count: 433,
    language: 'th',
    pdf_url: '/books/pdf/mongkol-chiwit-124.pdf',
    reader_url: 'https://drive.google.com/file/d/14-lngyqUQ8rR-yGmTxtgxLjjMgojzo5X/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/14-lngyqUQ8rR-yGmTxtgxLjjMgojzo5X/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_perd_promdan_dhamma',
    title: 'เปิดพรมแดนโลกแห่งธรรม',
    author_id: 'author_001',
    description: '“ไขความลับพระพุทธศาสนา” แนะนำทางมาแห่งบุญ และวิธีหลบเลี่ยงความเสื่อมในชีวิต เปิดโลกทัศน์กว้างไกลเพื่อนำพาชีวิตให้ก้าวไปในยุคของโลกไร้พรมแดนได้อย่างมีความสุข โดยมีธรรมะของพระสัมมาสัมพุทธเจ้าเป็นเครื่องคุ้มครอง',
    cover_image: '/images/books/perd-promdan.jpg',
    content_type: 'book',
    category_ids: ['cat_006'],
    tags: ['เปิดพรมแดนโลกแห่งธรรม', 'ไขความลับพระพุทธศาสนา', 'บุญ', 'พระพุทธศาสนา'],
    publication_year: 2555,
    page_count: 180,
    language: 'th',
    pdf_url: '/books/pdf/perd-promdan-dhamma.pdf',
    reader_url: 'https://drive.google.com/file/d/1XfYQuvNBU7GN4M7hsJ4O7kjKZUFpqI-h/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1XfYQuvNBU7GN4M7hsJ4O7kjKZUFpqI-h/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_phro_mai_roo_roo_than_cheewit',
    title: 'เพราะไม่รู้สินะ ตอน รู้ทันชีวิต',
    author_id: 'author_001',
    description: 'โรคเกิดจากวิบากกรรมในอดีต 30% อีก 70% อยู่ที่เรา!! ไขข้อข้องใจเรื่องสุขภาพและชีวิตด้วยมุมมองธรรมะและการแพทย์ รู้ทันกาย รู้ทันใจ เพื่อชีวิตที่สมบูรณ์และมีความสุขอย่างแท้จริง',
    cover_image: '/images/books/phro-mai-roo-roo-than-cheewit.jpg',
    content_type: 'book',
    category_ids: ['cat_002'],
    tags: ['เพราะไม่รู้สินะ', 'รู้ทันชีวิต', 'สุขภาพ', 'วิบากกรรม', 'การพัฒนาตนเอง', 'การดำเนินชีวิต', 'ทันโลกทันธรรม'],
    publication_year: 2558,
    page_count: 178,
    language: 'th',
    pdf_url: '/books/pdf/phro-mai-roo-roo-than-cheewit.pdf',
    reader_url: 'https://drive.google.com/file/d/1OSwySM_byJ0ay-UIkW60fXtmRdQxaIQ6/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1OSwySM_byJ0ay-UIkW60fXtmRdQxaIQ6/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_rak_thae_mai_dai_mee_khae_nai_niyai',
    title: 'รักแท้ไม่ได้มีแค่ในนิยาย',
    author_id: 'author_001',
    description: 'เปิดอ่านเรื่องราวความรักใกล้ตัวที่จับต้องได้ ที่จะทำให้หัวใจของคุณเต็มเปี่ยมไปด้วยคำว่า “แม่” เรื่องราวความรักอันบริสุทธิ์ พระคุณอันยิ่งใหญ่ และสายใยแห่งความผูกพันของแม่',
    cover_image: '/images/books/rak-thae-mai-dai-mee-khae-nai-niyai.jpg',
    content_type: 'book',
    category_ids: ['cat_001'],
    tags: ['รักแท้ไม่ได้มีแค่ในนิยาย', 'แม่', 'ความรัก', 'ครอบครัว', 'ความกตัญญู', 'ทันโลกทันธรรม'],
    publication_year: 2558,
    page_count: 178,
    language: 'th',
    pdf_url: '/books/pdf/rak-thae-mai-dai-mee-khae-nai-niyai.pdf',
    reader_url: 'https://drive.google.com/file/d/1AgWpiPrWjsvXK8Uq_wUAuPUCQM97ou5L/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1AgWpiPrWjsvXK8Uq_wUAuPUCQM97ou5L/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_love_myself_rak_nai_tua_ton',
    title: 'Love Myself "รักในตัวตน"',
    author_id: 'author_001',
    description: '4 บทพิเศษ เพิ่มเติมพลังชีวิต สร้างคุณให้เป็นที่รักในชั่วข้ามคืน เริ่มต้นที่รักตนเองเป็น มองเห็นตนเองก่อน แล้วคนอื่นจะมองเห็นและหลงรักคุณ',
    cover_image: '/images/books/love-myself-rak-nai-tua-ton.jpg',
    content_type: 'book',
    category_ids: ['cat_002'],
    tags: ['Love Myself', 'รักในตัวตน', 'การพัฒนาตนเอง', 'ความสุข', 'พลังชีวิต', 'Dhamma for the World'],
    publication_year: 2558,
    page_count: 134,
    language: 'th',
    pdf_url: '/books/pdf/love-myself-rak-nai-tua-ton.pdf',
    reader_url: 'https://drive.google.com/file/d/1z7k4gJX--j24YI8-t0BjWd3Q6PyMghRO/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1z7k4gJX--j24YI8-t0BjWd3Q6PyMghRO/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_hope_for_life_vol_04',
    title: 'HOPE for life Vol. 04 (Pray for Nepal)',
    author_id: 'author_001',
    description: 'วารสารเพื่อจุดประกายความหวังสำหรับทุกชีวิต ฉบับพิเศษ Pray for Nepal: เจาะลึกแผ่นดินไหวเนปาลเกิดขึ้นจากอะไร พร้อมเรื่องราวสร้างแรงบันดาลใจ กำลังใจจากชายพิการ และข้อคิด “ดีหรือไม่ดี ยากที่จะบอก”',
    cover_image: '/images/books/hope-for-life-vol-04-pray-for-nepal.jpg',
    content_type: 'book',
    category_ids: ['cat_002'],
    tags: ['HOPE for life', 'Pray for Nepal', 'วารสาร', 'แรงบันดาลใจ', 'กำลังใจ', 'ทันโลกทันธรรม'],
    publication_year: 2558,
    page_count: 64,
    language: 'th',
    pdf_url: '/books/pdf/hope-for-life-vol-04.pdf',
    reader_url: 'https://drive.google.com/file/d/0B6DDSmuXRb72a01Eb2JhaHhEbGs/preview?resourcekey=0-wzrHiJ_ZRAuwREfqKSfEuw',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/0B6DDSmuXRb72a01Eb2JhaHhEbGs/view?resourcekey=0-wzrHiJ_ZRAuwREfqKSfEuw',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_yoo_sook_nai_yook_digital',
    title: 'อยู่สุข ในยุคดิจิทัล',
    author_id: 'author_001',
    description: 'ศิลปะในการเรียนรู้ และรับมือผู้คนบนโลกออนไลน์ อย่างมีความสุข แนะนำหลักคิดการใช้ชีวิตท่ามกลางเทคโนโลยี โซเชียลมีเดีย และโลกออนไลน์ด้วยจิตใจที่สงบและรู้เท่าทัน',
    cover_image: '/images/books/yoo-sook-nai-yook-digital.jpg',
    content_type: 'book',
    category_ids: ['cat_004'],
    tags: ['อยู่สุข ในยุคดิจิทัล', 'ยุคดิจิทัล', 'ออนไลน์', 'ความสุข', 'การดำเนินชีวิต', 'พัฒนาตนเอง'],
    publication_year: 2562,
    page_count: 187,
    language: 'th',
    pdf_url: '/books/pdf/yoo-sook-nai-yook-digital.pdf',
    reader_url: 'https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'b_htht',
    title: 'ศาสตร์แห่งสมาธิ (The Science of Meditation)',
    author_id: 'author_001',
    description: 'ผู้ที่รักษาศีลดี ใจย่อมปลอดโปร่ง ไม่มีความเดือดร้อนใจ ทำให้ใจเป็นสมาธิได้ง่ายและสมาธิทำให้เกิดปัญญา จะเห็นได้ว่าสมาธิอยู่ในฐานะเป็นแกนกลาง นำเสนอหลักการทำสมาธิเชิงวิทยาศาสตร์และการปฏิบัติที่เข้าใจง่าย',
    cover_image: '/images/books/the-science-of-meditation.jpg',
    content_type: 'book',
    category_ids: ['cat_003'],
    tags: ['ศาสตร์แห่งสมาธิ', 'The Science of Meditation', 'สมาธิ', 'การปฏิบัติธรรม', 'จิตตภาวนา'],
    publication_year: 2555,
    page_count: 97,
    language: 'th',
    pdf_url: '/books/pdf/the-science-of-meditation.pdf',
    reader_url: 'https://drive.google.com/file/d/1ceambiyI8bjEqvGmXrkpKHpksCl6KIN_/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1ceambiyI8bjEqvGmXrkpKHpksCl6KIN_/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'b_xith',
    title: 'ข้อคิดรอบตัว',
    author_id: 'author_001',
    description: 'ในการดำเนินชีวิตประกอบธุรกิจการงาน ให้ประสบความสำเร็จเท่านั้น แต่ยังช่วยเปิดโลกทัศน์ให้กับผู้อ่านได้อย่างกว้างขวาง อีกทั้งยังสามารถนำพาชีวิต ให้ก้าวไปในยุคโลกไร้พรมแดน ได้อย่างมีความสุข',
    cover_image: '/images/books/kho-khit-rop-tua.jpg',
    content_type: 'book',
    category_ids: ['cat_001'],
    tags: ['ข้อคิดรอบตัว', 'การดำเนินชีวิต', 'ธุรกิจ', 'พัฒนาตนเอง'],
    publication_year: 2555,
    page_count: 82,
    language: 'th',
    pdf_url: '/books/pdf/kho-khit-rob-tua.pdf',
    reader_url: 'https://drive.google.com/file/d/117Q4npBCsTVMGxRt30TGI1RnBCDDdTWQ/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/117Q4npBCsTVMGxRt30TGI1RnBCDDdTWQ/view',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_99201494',
    title: 'ปก คำนำ สารบัญ',
    author_id: 'author_001',
    description: 'ปก คำนำ สารบัญ',
    cover_image: '/images/books/pubhtml5/pubhtml5_99201494.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 13,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/pzdt/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/pzdt/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_84240339',
    title: 'บทที่ 1 กลไกการเกิดขึ้นของอารยธรรมและระบบการปกครอง',
    author_id: 'author_001',
    description: 'อารยธรรมและระบอบการปกครองในโลกนี้เกิดขึ้นโดยสัมพันธ์กับวิถีชีวิตของมนุษย์ในยุคนั้น อาจกล่าวได้ว่าเงื่อนไขสำคัญที่สุดที่ส่งผลต่อการเกิดขึ้นของอารยธรรมและระบอบการปกครองในโลกนี้ คือ วิถีชีวิตมนุษย์ วิถีการทำมาหากิน และการใช้ชีวิตในแต่ละวัน',
    cover_image: '/images/books/pubhtml5/pubhtml5_84240339.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 39,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/obpt/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/obpt/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_72197415',
    title: 'บทที่ 2  อารยธรรมจีน',
    author_id: 'author_001',
    description: 'แหล่งชุมชนใหญ่อันเป็นแหล่งกำเนิดอารยธรรมหลักของโลกมักเกิดบริเวณลุ่มแม่น้ำใหญ่ในเขตอบอุ่น เพราะโรคภัยไข้เจ็บน้อยกว่าเขตร้อน ดังเช่น อารยธรรมจีนเกิดที่ลุ่มแม่น้ำฮวงโหเมื่อประมาณ 5,000 ปีก่อน',
    cover_image: '/images/books/pubhtml5/pubhtml5_72197415.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 77,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/bqch/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/bqch/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_24989611',
    title: 'บที่ 3  อารยธรรมอินเดีย',
    author_id: 'author_001',
    description: 'อารยธรรมอินเดีย เป็นอารยธรรมเก่าแก่ของโลกซึ่งส่งผลต่ออารยธรรมและประวัติศาสตร์ของไทยอย่างมาก ดังจะเห็นว่ามีเรื่องราวอารยธรรมอินเดียสอดแทรกอยู่ในสังคมไทยมากมาย และอินเดียยังเป็นแดนเกิดของพระพุทธศาสนาอีกด้วย',
    cover_image: '/images/books/pubhtml5/pubhtml5_24989611.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 93,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/cjvw/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/cjvw/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_72929559',
    title: 'บทที่ 4  อายธรรมอียิปต์',
    author_id: 'author_001',
    description: 'อารยธรรมที่เก่าแก่ของโลกมีแหล่งกำเนิดในดินแดนเมโสโปเตเมีย ในแถบแม่น้ำไทกรีสและยูเฟรติส ปัจจุบันอยู่บริเวณประเทศอิรัก และลุ่มแม่น้ำไนล์ในประเทศอียิปต์ ตั้งอยู่ตอนเหนือของทวีปแอฟริกา สามารถแบ่งตามเส้นเวลาได้ 3 ยุค',
    cover_image: '/images/books/pubhtml5/pubhtml5_72929559.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 43,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/yozs/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/yozs/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_49603169',
    title: 'บทที่ 5 จักรวรรดิโรมัน',
    author_id: 'author_001',
    description: 'จักรวรรดิโรมัน (509 ปีก่อน ค.ศ.-ค.ศ. 1453) เป็นจักรวรรดิที่มีอิทธิพลต่อโลกปัจจุบันมาก เพราะเป็นต้นแบบของระบอบการเมืองและการปกครองของประเทศต่าง ๆ จำนวนมากในทวีปยุโรปและอเมริกา จักรวรรดิโรมันเกิดขึ้นเมื่อปี 509 ก่อนค.ศ. (21 ปี หลังการตรัสรู้ธรรมของพระสัมมาสัมพุทธเจ้า) โดยเริ่มต้นที่กรุงโรมเป็นนครรัฐเล็ก ๆ และขยายตัวตามลำดับ',
    cover_image: '/images/books/pubhtml5/pubhtml5_49603169.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 43,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/hqml/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/hqml/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_57733966',
    title: 'บทที่ 6 ยุโรป',
    author_id: 'author_001',
    description: 'ภาพลักษณ์ของยุโรปในสายตาชาวโลกปัจจุบันจะถูกมองว่าเป็นแหล่งความเจริญก้าวหน้าของโลก แต่ความจริงในประวัติศาสตร์ที่ผ่านมาเอเชียมีความเจริญมากกว่ายุโรปมาโดยตลอด ยุโรปในอดีตถือเป็นดินแดนที่ล้าหลัง แม้แต่ในยุคของจักรวรรดิโรมันเองเมื่อแบ่งเป็น 2 ส่วน บริเวณที่มีความรุ่งเรืองมากกว่าคือจักรวรรดิโรมันตะวันออก ซึ่งมีศูนย์กลางอยู่ที่กรุงคอนสแตนติโนเปิล (Constantinople) หรือเมืองอิสตันบูล (Istanbul) เมืองหลวงของประเทศตุรกีในยุคปัจจุบัน',
    cover_image: '/images/books/pubhtml5/pubhtml5_57733966.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 67,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/cpek/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/cpek/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_52963837',
    title: 'บทที่ 7  ประเทศอังกฤษ',
    author_id: 'author_001',
    description: 'อังกฤษที่คนส่วนใหญ่คุ้นชื่อกัน ความจริงเป็นชื่อของ 1 ใน 4 ประเทศที่ประกอบกันเป็น สหราชอาณาจักร(United Kingdom หรือ UK) มีชื่ออย่างเป็นทางการว่า สหราชอาณาจักรบริเตนใหญ่และไอร์แลนด์เหนือ(United Kingdom of Great Britain and Northern Ireland)ประกอบด้วย 4 ประเทศ ได้แก่ อังกฤษ (England) สกอตแลนด์(Scotland) และเวลส์ (Wales) อยู่บนเกาะบริเตนใหญ่ และไอร์แลนด์เหนือ (Northern Ireland) โดยมีรัฐบาลกลางบริหารส่วนแต่ละประเทศย่อยก็มีอำนาจปกครองตนเอง',
    cover_image: '/images/books/pubhtml5/pubhtml5_52963837.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 33,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/cydy/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/cydy/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_12462724',
    title: 'บทที่ 8 ประเทศฝรั่งเศส',
    author_id: 'author_001',
    description: 'ฝรั่งเศส ตั้งอยู่ทางทิศตะวันตกของทวีปยุโรปมีพื้นที่ 543,935 ตารางกิโลเมตร (มีดินแดนในทวีปอเมริกาใต้ ทะเลแคริบเบียน และที่อื่น ๆ อีกรวม 96,744 ตารางกิโลเมตร) มีเทือกเขาอยู่ริมประเทศ เช่น เทือกเขาแอลป์ (Alps)ทางตะวันออก กั้นระหว่างพรมแดนประเทศฝรั่งเศสกับประเทศอิตาลี ส่วนทางทิศใต้มีเทือกเขาพิเรนีส (Pyrenees) กั้นระหว่างประเทศฝรั่งเศสกับประเทศสเปน พื้นที่ส่วนใหญ่ของประเทศเป็นที่ราบอุดมสมบูรณ์ อากาศไม่หนาวจัด เหมาะแก่การผลิตพืชพันธุ์ธัญญาหารและเลี้ยงสัตว์หล่อเลี้ยงผู้คน ทำให้ฝรั่งเศสมีประชากรมากที่สุดในยุโรปในคริสต์ศตวรรษที่ 17-18 ซึ่งเป็นที่มาสำคัญของพลังอำนาจของฝรั่งเศสในประวัติศาสตร์',
    cover_image: '/images/books/pubhtml5/pubhtml5_12462724.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 25,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/qvor/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/qvor/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_47227917',
    title: 'บทที่ 9 ประเทศเยอรมัน',
    author_id: 'author_001',
    description: 'อนารยชนชาวเจอร์มานิกซึ่งเป็นบรรพบุรุษชนชาติเยอรมันได้อพยพจากตอนใต้ของสแกนดิเนเวีย (นอร์เวย์ สวีเดน ฟินแลนด์ เดนมาร์กในปัจจุบัน) กระจายลงไปตั้งรกรากทาง ดินแดนตอนใต้ทั้งด้านตะวันตกตอนกลางแถบแม่น้ำไรน์และทางตะวันออกไปจนถึงเทือกเขาอูราล (Ural Mountains) ขณะเดียวกันจักรวรรดิโรมันก็พยายามขยายดินแดนขึ้นมาตอนเหนือเพราะพื้นที่เหมาะแก่การทำการเกษตร เป็นแหล่งอาหารอุดมสมบูรณ์เพียงพอจะเลี้ยงคนจำนวนมาก',
    cover_image: '/images/books/pubhtml5/pubhtml5_47227917.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 47,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/aewx/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/aewx/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_27105200',
    title: 'บทที่ 10 ประเทศสหรัฐอเมริกา',
    author_id: 'author_001',
    description: 'ชาวเอเชียได้ทยอยอพยพผ่านช่องแคบเบริงเข้าทวีป อเมริกาเมื่อราว 40,000-12,000 ปีก่อน ซึ่งเป็นช่วงยุคนน้ำแข็ง (Glacial Period) ระดับน้ำทะเล ในยุคนั้นต่ำกว่าปัจจุบันมาก เพราะน้ำจำนวนมากเป็นน้ำแข็งสะสมอยู่บนพื้นดินส่วนใหญ่ของโลก ช่องแคบเบริง (Bering Strait) ซึ่งเป็นรอยต่อของทวีป เอเชียและอเมริกาเหนือระดับน้ำลงต่ำจนสามารถเดินถึงกันได้ เรียกว่า Beringia',
    cover_image: '/images/books/pubhtml5/pubhtml5_27105200.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 57,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/moxu/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/moxu/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_85416563',
    title: 'บทที่ 11 ประเทศรัสเซีย',
    author_id: 'author_001',
    description: 'รัสเซีย เป็นประเทศอภิมหาอำนาจคู่กับสหรัฐอเมริกาในช่วงหลังสงครามโลกครั้งที่ 2 อีกทั้งเป็นประเทศที่มีพื้นที่ใหญ่เป็นอันดับ 1 ของโลก (อันดับ 2 คือแคนาดา อันดับ 3 คือ สหรัฐอเมริกา และอันดับ 4 คือจีน แต่ขนาดพื้นที่ของจีนและอเมริกาใกล้เคียงกันมาก บ้างก็บอกว่าพื้นที่จีนใหญ่กว่าอเมริกาขึ้นอยู่กับวิธีการวัดพื้นที่บริเวณไหล่ทวีป) รัสเซียในตอนที่ยังไม่แตกเป็น 15 ประเทศ มีพื้นที่ใหญ่กว่าสหรัฐอเมริกา 2 เท่ากว่าแม้ตอนที่แตกเป็น 15 ประเทศแล้ว เฉพาะประเทศรัสเซียก็ยังมีพื้นที่ใหญ่กว่าสหรัฐอเมริกาเกือบ 1.8 เท่า',
    cover_image: '/images/books/pubhtml5/pubhtml5_85416563.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 33,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/vqqd/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/vqqd/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_95480492',
    title: 'บทที่ 12 ประเทศญี่ปุ่น',
    author_id: 'author_001',
    description: 'ญี่ปุ่นเป็นประเทศในทวีปเอเชียเพียงประเทศเดียวที่สามารถพัฒนาทันประเทศมหาอำนาจตะวันตกในเวลาไม่กี่สิบปี จนกลายเป็นหนึ่งในมหาอำนาจของโลกในยุคที่ชาวตะวันตกขยายอาณานิคมไปทั่วโลก และยังเป็นประเทศเดียวที่จักรพรรดิอยู่ในราชวงศ์เดียวไม่มีการเปลี่ยนราชวงศ์มาตลอด 2,000 ปี',
    cover_image: '/images/books/pubhtml5/pubhtml5_95480492.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 63,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/opfj/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/opfj/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_82203972',
    title: 'บทที่ 13 จีนยุคราชวงศ์ชิงถึงปัจจุบัน',
    author_id: 'author_001',
    description: 'ราชวงศ์ชิง คือพวกไต้กิมหรือแมนจูนั่นเอง อยู่ทางตะวันออกเฉียงเหนือของประเทศจีน พวกแมนจูถูกมองโกลพิชิตรวมเข้าในอาณาจักรมองโกลในยุคราชวงศ์หยวน เมื่อมองโกลถูกจูหยวนจางปฐมฮ่องเต้ราชวงศ์หมิงของจีนขับไล่ ออกไปได้ แมนจูก็ได้อิสระไปด้วยและค่อย ๆ สะสมกําลังเพิ่มจำนวนประชากรและขยายอำนาจ โดยอาศัยจังหวะช่วงปลายราชวงศ์หมิงฮ่องเต้อ่อนแอติดต่อกันหลายพระองค์ ประกอบกับเกิดทุพภิกขภัยแต่ทางการก็ยังรีดภาษีจากประชาชน เป็นเหตุ ให้บ้านเมืองระสส่ำระสาย ชาวไร่ชาวนาทุกข์ยากลำบากมากจนลุกฮือ หลี่จื้อเฉิง (李自成) ได้เป็นผู้นำกบฏชาวนายึดกรุงปักกิ่งได้ หมิงซือจงฮ่องเต้องค์สุดท้ายของราชวงศ์หมิงผูกคอตายเป็นอันสนสุดราชวงศ์หมิงของจีน',
    cover_image: '/images/books/pubhtml5/pubhtml5_82203972.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 49,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/ofew/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/ofew/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_61211488',
    title: 'บทที่ 14 ใครจะเป็นมหาอำนาจโลกในรอบ 100 ปี',
    author_id: 'author_001',
    description: 'ตอนก่อน ๆ เราได้ศึกษาประวัติศาสตร์เป็นหลัก แต่ตอนสุดท้ายนี้จะเป็นเรื่องในปัจจุบัน และพยากรณ์ถึงอนาคตเพื่อการมองโลกของเราจะได้กว้างขวางขึ้น เราจะมาศึกษาเงื่อนไขต่าง ๆ ที่จะเป็นตัวกำหนดว่าใครจะเป็นอภิมหาอำนาจโลกในรอบ 100 ปีต่อไป',
    cover_image: '/images/books/pubhtml5/pubhtml5_61211488.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 65,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/wqsm/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/wqsm/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_85353008',
    title: 'บรรณานุกรม ประวัติผู้เขียน ผู้จัดทำ',
    author_id: 'author_001',
    description: 'บรรณานุกรม ประวัติผู้เขียน ผู้จัดทำ',
    cover_image: '/images/books/pubhtml5/pubhtml5_85353008.jpg',
    content_type: 'book',
    category_ids: ['cat_world_civ'],
    tags: [],
    publication_year: 2565,
    page_count: 36,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/tpxal/yvzr/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/tpxal/yvzr/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },

  {
    id: 'book_001',
    title: 'มงคล 38 ประการ',
    author_id: 'author_001',
    description: 'หนังสือทรงคุณค่าที่เขียนตั้งแต่ช่วงแรกของการบวช อธิบายหลักมงคลชีวิต 38 ประการอย่างละเอียด เข้าใจง่าย และนำไปปฏิบัติได้จริง',
    cover_image: '/images/books/mongkol-38.jpg',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_006'],
    tags: ['tag_001'],
    publication_year: 2530,
    page_count: 350,
    language: 'th',
    pdf_url: '/pdfs/mongkol-38.pdf',
    reader_url: '/reader/book_001',
    audio_id: null,
    video_ids: [],
    source_url: '',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_002',
    title: 'อารยธรรมโลก',
    author_id: 'author_001',
    description: 'เจาะลึกความเป็นมาของอารยธรรมโลกในมุมมองที่เชื่อมโยงกับหลักธรรมและสัจธรรมของชีวิต เหมาะสำหรับผู้ที่ต้องการศึกษาอย่างลึกซึ้ง',
    cover_image: '/images/books/world-civilization.jpg',
    content_type: 'book',
    category_ids: ['cat_007'],
    tags: ['tag_002'],
    publication_year: 2545,
    page_count: 800,
    language: 'th',
    pdf_url: '/pdfs/world-civilization.pdf',
    reader_url: '/reader/book_002',
    audio_id: null,
    video_ids: [],
    source_url: '',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_003',
    title: 'ความสุขเริ่มต้นที่ตัวเรา',
    author_id: 'author_001',
    description: 'หนังสือที่จะพาคุณไปค้นหาความสุขที่แท้จริงจากภายใน',
    cover_image: '/images/books/book-1.jpg',
    content_type: 'book',
    category_ids: ['cat_004', 'cat_005'],
    tags: ['tag_001'],
    publication_year: 2565,
    page_count: 120,
    language: 'th',
    pdf_url: '/pdfs/sample.pdf',
    reader_url: '/reader/book_003',
    audio_id: null,
    video_ids: [],
    source_url: '',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_004',
    title: 'ทันโลก ทันธรรม',
    author_id: 'author_001',
    description: 'การนำหลักธรรมทางพระพุทธศาสนามาประยุกต์ใช้ในการดำเนินชีวิตท่ามกลางความเปลี่ยนแปลงของโลกยุคปัจจุบัน',
    cover_image: '/images/books/book-placeholder.jpg',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_002'],
    tags: ['tag_002'],
    publication_year: 2555,
    page_count: 245,
    language: 'th',
    pdf_url: '/pdfs/sample.pdf',
    reader_url: '/reader/book_004',
    audio_id: null,
    video_ids: [],
    source_url: '',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_005',
    title: 'วิถีแห่งความสุข',
    author_id: 'author_001',
    description: 'คู่มือการสร้างความสุขง่ายๆ ในชีวิตประจำวัน ด้วยการฝึกสติและปรับมุมมองความคิด',
    cover_image: '/images/books/book-placeholder.jpg',
    content_type: 'book',
    category_ids: ['cat_004'],
    tags: ['tag_001'],
    publication_year: 2560,
    page_count: 180,
    language: 'th',
    pdf_url: '/pdfs/sample.pdf',
    reader_url: '/reader/book_005',
    audio_id: null,
    video_ids: [],
    source_url: '',
    copyright_status: 'approved',
    verified: true,
    featured: true,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'book_006',
    title: 'ข้อคิดเพื่อการดำเนินชีวิต',
    author_id: 'author_001',
    description: 'รวมข้อคิดเตือนใจสั้นๆ ที่อ่านง่าย เข้าใจลึกซึ้ง เหมาะสำหรับพกพาและอ่านเพื่อสร้างกำลังใจ',
    cover_image: '/images/books/book-placeholder.jpg',
    content_type: 'book',
    category_ids: ['cat_001', 'cat_005'],
    tags: ['tag_003'],
    publication_year: 2562,
    page_count: 150,
    language: 'th',
    pdf_url: '/pdfs/sample.pdf',
    reader_url: '/reader/book_006',
    audio_id: null,
    video_ids: [],
    source_url: '',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },

  {
    id: 'pubhtml5_41000906',
    title: '“ดีชั่ว” เกิดด้วยกรรมหรือบังเอิญ ไทย-จีน',
    author_id: 'author_001',
    description: '“ดีชั่ว” เกิดด้วยกรรมหรือบังเอิญ ไทย-จีน',
    cover_image: '/images/books/pubhtml5/pubhtml5_41000906.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2569,
    page_count: 212,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/vasxl/zjdd/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/vasxl/zjdd/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_64695646',
    title: 'สมดุล=ดี ,  平衡=好',
    author_id: 'author_001',
    description: 'หนังสือ “สมดุล = ดี” เล่มนี้ คณะบรรณาธิการได้รวบรวมเรียบเรียงขึ้นจากพระธรรมเทศนาที่อาตมภาพได้แสดงไว้ในวาระโอกาสต่าง ๆ เพื่อกระตุ้นผู้ฟังและผู้อ่านได้ฉุกใจคิดในประเด็นที่สำคัญซึ่งส่งผลต่อความสุขความสำเร็จในชีวิต และมูลนิธิธรรมะคุ้มครองโลกได้ขออนุญาตจัดพิมพ์เผยแพร่เป็นธรรมบรรณาการแก่ท่านสาธุชนที่สนใจ และในวาระที่อาตมภาพอุปสมบทครบ 40 พรรษา อ.จางฉ่ายหวิน และคณะ มีกุศลจิตแปลหนังสือเล่มนี้เป็นภาษาจีน',
    cover_image: '/images/books/pubhtml5/pubhtml5_64695646.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 228,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/vasxl/jopa/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/vasxl/jopa/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_81852783',
    title: 'ศาสตร์เเห่งสมาธิ',
    author_id: 'author_001',
    description: 'ผู้ที่รักษาสิลดี ใจย่อมปลอดโปร่ง ไม่มีความเดือดรัอนใจ ทําให้ใจเป็นสมาธิได้ง่ายและสมาธิ ทําให้เกิดปัญญาจะเห็นได้ว่าสมาธิอยู่ในฐานะเป็นแกนกลาง',
    cover_image: '/images/books/pubhtml5/pubhtml5_81852783.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 97,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/vasxl/htht/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/vasxl/htht/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_18438372',
    title: 'มังกรสอนใจ',
    author_id: 'author_001',
    description: 'กว่า 5,000 ปีที่ผ่านมา ประเทศจีนเป็นหนึ่งใน 4 อาณาจักร โบราณ ที่มีวัฒนธรรมสืบทอดมายาวนาน ซึ่งสิ่งที่ทาให้จีน สามารถรักษาเอกลักษณ์และยิ่งใหญ่มาได้จนจวบเท่าทุกวันนี้ก็คือ “คำสอน” ที่สืบทอดมารุ่นแล้วรุ่นเล่า',
    cover_image: '/images/books/pubhtml5/pubhtml5_18438372.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 112,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/1Lt058orFaz1M1fGkIDc1KstQdNO24CaI/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1Lt058orFaz1M1fGkIDc1KstQdNO24CaI/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_23054983',
    title: 'ข้อคิดรอบตัว',
    author_id: 'author_001',
    description: 'ในการดําเนินชีวิตประกอบธุรกิจการงาน ให้ประสบความสําเร็จเท่านั้น แต่ยังข่วยเปีดโลกทัศน์ให้กับผู้อ่านได้อย่างกว้างขวาง อีกทั้งยังสามารถนําพาชีวิต ให้ก้าวไปในยุคโลกไร้พรมแดน ได้อย่างมีความสุข',
    cover_image: '/images/books/pubhtml5/pubhtml5_23054983.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 82,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/117Q4npBCsTVMGxRt30TGI1RnBCDDdTWQ/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/117Q4npBCsTVMGxRt30TGI1RnBCDDdTWQ/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_68005005',
    title: 'อย่ามโน รักแท้มันใหญ่มาก',
    author_id: 'author_001',
    description: 'ความรักเป็นสิ่งที่มีผลต่อชีวิตมาก บางคนรักเป็น ได้คู่ครองดี เสริมส่งชีวิตให้เจริญรุ่งเรือง บางคนรักไม่เป็น ทำให้มีปัญหาชีวิตมากมาย บ้างเรียนไม่จบ บ้างบ้านแตกต้องหย่าร้าง หนังสือเล่มนี้ จึงตั้งใจนำหลักธรรมของพระสัมมาสัมพุทธเจ้ามาเป็นแสงธรรมนำทาง',
    cover_image: '/images/books/pubhtml5/pubhtml5_68005005.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 158,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/10qPuIeb6qDu_yBvy5hfW2NVz90CTL4Bw/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/10qPuIeb6qDu_yBvy5hfW2NVz90CTL4Bw/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_89853151',
    title: 'พระไตรปิฎก ฉบับธรรมชัยpdf',
    author_id: 'author_001',
    description: 'พระไตรปิฎกฉบับธรรมชัยนี้จึงเป็นเสมือนการรวมานควา มวิริยอุตสาหะของพระเถรานุเถระและชาวพุทธในอดีตที่สืบ ทอดคำสอนมาถึงเราประสานเข้ากับความรู้ ความสามารถของนักวิชาการบาลีจากทั่วโลกในยุค ปัจจุบันเพื่อรักษามรดกธรรมของพระสัมมาสัมพุทธเจ้า ให้บริสุทธิ์บริบูรณ์อยู่คู่โลกไปตลอดกาลนาน',
    cover_image: '/images/books/pubhtml5/pubhtml5_89853151.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 58,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/1QEioFQhAdUbaf2Izy4MGUBS-XKY3LrUp/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1QEioFQhAdUbaf2Izy4MGUBS-XKY3LrUp/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_33738617',
    title: 'ขัดเกลาความคิด',
    author_id: 'author_001',
    description: '“ขัดเกลาความคิด” คือ หนังสือที่เรียบเรียงมาจาก รายการเทศนาธรรม “ทันโลกทันธรรม” และ “ข้อคิดรอบ ตัว” โดยพระมหาสมชาย ฐานวุฑโฒ มีเนื้อหาเกี่ยวกับหลัคิด ในการปรับทัศนคติเพื่อการดำ าเนินชีวิตที่ดีขึ้น การบริหารสมองด้วยหลักทางโลก และทางธรรม ที่ส่งผลต่อสุขภาพร่างกายความคิด และจิตใจ',
    cover_image: '/images/books/pubhtml5/pubhtml5_33738617.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 120,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/1i_lROJUFHQkTqGI6nU_Y59xkHjr_YJLE/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1i_lROJUFHQkTqGI6nU_Y59xkHjr_YJLE/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_16604262',
    title: 'เส้นทางพระบรมโพธิสัตว์',
    author_id: 'author_001',
    description: 'หนังสือเล่มนี้ จะสร้างแรงบันดาลใจให้เรา ใช้ชีวิตที่เกิดมาเป็นคนให้คุ้มค่า เป็นการเริ่มต้นวิ่งมาราธอนแบบศิษย์มีครู แล้วเราก็จะได้เริ่มเข้าสู่เส้นทางพระบรมโพธิสัตว์”',
    cover_image: '/images/books/pubhtml5/pubhtml5_16604262.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 96,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/vasxl/lsrx/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/vasxl/lsrx/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_10811287',
    title: 'ไขปัญหาความเชื่อ',
    author_id: 'author_001',
    description: '“ไขปัญหาความเชื่อ” คือ หนังสือที่รวบรวมเนื้อหาจากรายการธรรมเทศนาของพระมหาสมชาย   ฐานวุฑโฒ M.D.; Ph.D. ที่มีเนื้อหาเกี่ยวเนื่องกันในเรื่องความเชื่อ   อดีตชาติ การแก้กรรมชีวิตหลัง ความตาย และข้อคิดจากความตาย เป็นต้น',
    cover_image: '/images/books/pubhtml5/pubhtml5_10811287.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 140,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/1L7Ld6hb265P4zoz6Lw32uRqdvk2FcF31/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1L7Ld6hb265P4zoz6Lw32uRqdvk2FcF31/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_63142465',
    title: 'ทันโลกทันธรรม เล่ม 5',
    author_id: 'author_001',
    description: 'โลกแห่งเทคโนโลยีก้าวลํ้านํายุคเพียงใด ธรรมกลับดารงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    cover_image: '/images/books/pubhtml5/pubhtml5_63142465.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 117,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/vasxl/coyx/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/vasxl/coyx/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_60413169',
    title: 'ทันโลกทันธรรม เล่ม 4',
    author_id: 'author_001',
    description: 'โลกแห่งเทคโนโลยีก้าวลํ้านํายุคเพียงใด ธรรมกลับดารงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    cover_image: '/images/books/pubhtml5/pubhtml5_60413169.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 105,
    language: 'th',
    pdf_url: '',
    reader_url: 'http://online.pubhtml5.com/vasxl/rlag/',
    audio_id: null,
    video_ids: [],
    source_url: 'http://online.pubhtml5.com/vasxl/rlag/',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_86887339',
    title: 'ทันโลกทันธรรม เล่ม 3',
    author_id: 'author_001',
    description: 'โลกแห่งเทคโนโลยีก้าวลํ้านํายุคเพียงใด ธรรมกลับดารงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    cover_image: '/images/books/pubhtml5/pubhtml5_86887339.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 108,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/123Hi9ITJn3vKNncVTuJMkCw_fi8YL3P2/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/123Hi9ITJn3vKNncVTuJMkCw_fi8YL3P2/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_26910324',
    title: 'ทันโลกทันธรรม เล่ม 2',
    author_id: 'author_001',
    description: 'โลกแห่งเทคโนโลยีก้าวลํ้านํายุคเพียงใด ธรรมกลับดารงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    cover_image: '/images/books/pubhtml5/pubhtml5_26910324.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 107,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/196lVD54DoTt7t75O-NdNTC_QxiJVbktx/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/196lVD54DoTt7t75O-NdNTC_QxiJVbktx/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_76550937',
    title: 'ทันโลกทันธรรม เล่ม 1',
    author_id: 'author_001',
    description: 'โลกแห่งเทคโนโลยีก้าวลํ้านํายุคเพียงใด ธรรมกลับดารงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งใน โลกล้วนเปลี่ยนแปลงไป',
    cover_image: '/images/books/pubhtml5/pubhtml5_76550937.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 101,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/1SRz5ymp-JERKZ1gAdXZrPexn7SBsjZGF/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/1SRz5ymp-JERKZ1gAdXZrPexn7SBsjZGF/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  },
  {
    id: 'pubhtml5_45477721',
    title: 'อายุวัฒนมงคล 63 ปี 40 พรรษา',
    author_id: 'author_001',
    description: 'อายุวัฒนมงคล 63 ปี 40 พรรษา พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑโฒ)',
    cover_image: '/images/books/pubhtml5/pubhtml5_45477721.jpg',
    content_type: 'book',
    category_ids: ['cat_006'], // Default to Buddhism category
    tags: [],
    publication_year: 2567,
    page_count: 52,
    language: 'th',
    pdf_url: '',
    reader_url: 'https://drive.google.com/file/d/183jGD-_M7kHCrLY1AzTo0rEa4IBrT89c/preview',
    audio_id: null,
    video_ids: [],
    source_url: 'https://drive.google.com/file/d/183jGD-_M7kHCrLY1AzTo0rEa4IBrT89c/view',
    copyright_status: 'approved',
    verified: true,
    featured: false,
    view_count: 0,
    read_count: 0
  }
];

export const dhamma: T.Dhamma[] = [
  {
    id: 'dhamma_037',
    title: 'สำนึกผิดอย่างไรให้เกิดผล | พระไตรปิฎกยามเช้า EP.730',
    description: 'สรุปหลักการสำนึกผิดอย่างถูกต้องที่ไม่ใช่การจมอยู่กับความรู้สึกผิด แต่คือการยอมรับ ปรับปรุง และให้อภัยตัวเอง ผสานกับมุมมองทางจิตวิทยา',
    content: `สรุปเนื้อหาจากวิดีโอรายการ พระไตรปิฎกยามเช้า EP.730 หัวข้อ "สำนึกผิดอย่างไรให้เกิดผล" (ช่อง หลวงพี่สัจจา สัจจาธิโก) แบบละเอียดให้ดังนี้ครับ

บทสรุปโดยย่อ (Key Concept)
การสำนึกผิดที่ดีไม่ใช่การจมอยู่กับ "ความรู้สึกผิด" หรือการลงโทษตัวเอง แต่คือการ ยอมรับความจริงอย่างกล้าหาญ เรียนรู้บทเรียน และ ปรับเปลี่ยนการกระทำใหม่ เพื่อเดินหน้าต่อไปอย่างมีสติ

สรุปเนื้อหาสำคัญตามลำดับการเทศน์และการเสวนา

1. โอวาทจากพระอาจารย์พระมหา มิน
ต้องเปลี่ยนวิธีทำใหม่: หากสำนึกผิดแล้วแต่ยังทำด้วยวิธีการเดิม ผลลัพธ์ก็จะออกมาแบบเดิม หากต้องการเปลี่ยนผลลัพธ์ ต้องแก้ที่วิธีการและลงมือทำสิ่งใหม่
ใช้หลัก "โยนิโสมนสิการ": พิจารณาต้นเหตุ กลางเหตุ และปลายเหตุอย่างรอบคอบ แล้วจึงลงมือปฏิบัติ
ความไม่ประมาทและความพอดี:
ความไม่ประมาทมีหลายระดับ ตั้งแต่ระดับหยาบ (ระวังอุบัติเหตุ/ข้าวของ), ระดับกลาง (ระวัง กาย วาจา ไม่ทำร้ายใคร), ไปจนถึงระดับสูง (การรักษาจิตให้สงบ อบรมสติอยู่เสมอ)
ทางสายกลางในการปฏิบัติ: การตึงเกินไป (เพ่ง เร่ง ลุ้น จนเกิดบาดแผลเหมือนพระโสณโกฬิวิสะ) หรือหย่อนเกินไป ก็ไม่ส่งผลดี ต้องมีความ "พอดี" รู้ตัวอย่างสดใสร่าเริง สติและความสบายจึงจะเกิดขึ้นพร้อมกัน

2. โอวาทจากพระอาจารย์สัจจาธิโก
สำนึกผิด ≠ รู้สึกผิด: ความรู้สึกผิด (Guilt) ที่ทำให้จิตใจห่อเหี่ยว จมทุกข์ หรือรู้สึกว่าตัวเองไม่ดีพอ ถือเป็น "เรื่องสิ้นเปลือง" เพราะมักไม่นำไปสู่การแก้ไข
สำนึกผิดที่แท้จริง: คือการยอมรับตามจริงว่าสิ่งที่ทำนั้นไม่สอดคล้องกับเส้นทางแห่งความสุข/พระนิพพาน กล้ารับฟังคำตักเตือน กล้าเปิดเผยความผิดเพื่อแก้ไขด้วยอารมณ์ที่เบิกบาน
ธรรมชาติของมนุษย์: มนุษย์ทุกคนมีโอกาสทำผิดพลาดซ้ำได้ การคาดหวังว่าจะ "ไม่ผิดอีกเลย" เป็นความเอาแต่ใจที่ไม่ยอมรับกฎไตรลักษณ์ สิ่งสำคัญคือเมื่อพลาดแล้วต้องเรียนรู้ ปรับปรุง และรู้จักให้อภัยตัวเอง

3. สรุปแนวคิดทางจิตวิทยา (คุณอุ้ม)
มีการนำหลักจิตวิทยาเรื่องความรู้สึกผิด 2 รูปแบบมาเปรียบเทียบ
Healthy Guilt (ความรู้สึกผิดแบบสมเหตุสมผล):
เกิดจากการกระทำที่ไม่ดีของเราจริงๆ
แนวทางแก้ไข: ขอโทษทันทีอย่างไม่มีเงื่อนไข -> รีบแก้ไขปัญหา -> ปรับเปลี่ยนพฤติกรรม -> ยอมรับและเดินหน้าต่อ
Unhealthy Guilt (ความรู้สึกผิดที่ไม่สมเหตุสมผล):
รู้สึกผิดกับสิ่งที่ตนเองไม่สามารถควบคุมได้ (เช่น เพื่อนตกงานแต่เราได้เลื่อนขั้น)
แนวทางแก้ไข: แยกแยะสิ่งที่ควบคุมได้และไม่ได้ -> ปรับนิยามความสมบูรณ์แบบ (Perfectionism) -> กล้าสื่อสารและแสดงออกอย่างเหมาะสม

4. คำถาม-ตอบ ในรายการ
การขอขมาผู้ที่ล่วงลับไปแล้ว: หากรู้สึกผิดกับคนที่เสียชีวิตไปแล้ว ให้ใช้วิธีเขียนจดหมายสื่อสาร พูดคุยหน้าหลุมศพ ทำบุญอุทิศให้ หรือพูดคุยปรับความเข้าใจกับญาติ/คนที่เกี่ยวข้อง สิ่งสำคัญที่สุดคือการปลดล็อกและยอมรับจากใจของเราเอง
การยืนยันพลังบวก (Positive Affirmation): หากเป็นการยืนยันในสิ่งที่เรามีอยู่แล้ว หรือเชื่อมั่นในสิ่งดีๆ ที่จะเกิดขึ้นในอนาคต ไม่ถือเป็นการหลอกตัวเอง

สรุปสั้นๆ สำหรับนำไปใช้: "สำนึกในความผิด ยอมรับ ปรับแผนใหม่ แต่อย่าเอาความรู้สึกผิดมาด่าทอหรือกดทับตัวเอง"

รับชมวิดีโอเต็มได้ที่
https://youtu.be/yIqJ58lAB4A`,
    category_ids: ['cat_005'],
    tags: ['การสำนึกผิด', 'ความรู้สึกผิด', 'จิตวิทยา', 'การพัฒนาตนเอง', 'พระไตรปิฎกยามเช้า', 'ให้อภัยตัวเอง'],
    source_type: 'video',
    source_url: 'https://youtu.be/yIqJ58lAB4A?si=cSnioNog4an200Kb',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_036',
    title: 'ทำไมพม่าถอดรองเท้าเข้าวัด | EP 2574',
    description: 'สรุปเนื้อหาและอธิบายประเพณีการถอดรองเท้าเข้าวัดของชาวพม่า เหตุผลทางพระวินัย และวิบากกรรมที่ต้องระวังในการเข้าศาสนสถาน',
    content: `สรุปเนื้อหาเชิงลึกและรายละเอียดอย่างครอบคลุมจากวิดีโอ "ทำไมพม่าถอดรองเท้าเข้าวัด | EP 2574" โดย พระมหาสมชาย ฐานวุฑโฒ (ThanavuddhoStoryOfficial)

ประเด็นคำถามหลักจากทางบ้าน
มีผู้ถามปรึกษาทางรายการในหลายมิติเกี่ยวกับประเพณีและข้อปฏิบัติเรื่องการถอดรองเท้าเข้าวัด ดังนี้:
ทำไมชาวพม่าจึงมีความเคร่งครัดถึงขั้นต้องถอดรองเท้าตั้งแต่เขตนอกวัด?
ในสมัยพุทธกาลมีการบัญญัติเรื่องการถอดรองเท้านอกวัดไว้หรือไม่?
การที่เราใส่รองเท้าเดินในเขตวัดโดยไม่ได้ถอดไว้ข้างนอกแบบพม่า ถือว่าเป็นบาปหรือไม่?
การใส่หรือไม่ใส่รองเท้าเข้าวัดจะส่งผลเป็นอานิสงส์หรือวิบากกรรมอย่างไรต่อผู้ปฏิบัติ?

สาระสำคัญและการอธิบายเชิงลึกตามหลักธรรมะ

๑. รากฐานทางพระวินัยและธรรมเนียมการแสดงความเคารพ
พระวินัยในสมัยพุทธกาล: พระสัมมาสัมพุทธเจ้าทรงวางหลักพระวินัยไว้ชัดเจนว่า พระภิกษุสงฆ์จะไม่แสดงธรรมแก่บุคคลผู้ยืน นั่ง หรือนอนอยู่ในที่สูงกว่า หรือบุคคลที่สวมรองเท้า สวมหมวก หรือถือร่ม เพราะการกระทำดังกล่าวสะท้อนถึงกิริยาที่ไม่เคารพต่อพระธรรมและพระรัตนตรัย
การตักบาตรในชีวิตประจำวัน: เมื่อพระภิกษุเดินบิณฑบาตด้วยเท้าเปล่า การที่พุทธศาสนิกชนสวมรองเท้ายืนตักบาตรจะทำให้ระดับร่างกายและศีรษะของเราอยู่สูงกว่าพระภิกษุ โบราณจารย์จึงนิยมให้ถอดรองเท้า ถอดหมวก คุกเข่า หรือย่อตัวลงกับพื้นเพื่อแสดงความนอบน้อมสูงสุด
ข้อยกเว้นและอนุโลมตามสภาพแวดล้อม: หากสถานที่นั้นไม่เอื้ออำนวย เช่น พื้นเป็นโคลน ตลาดสดที่เปียกและเลอะเทอะ การถอดรองเท้าจะทำให้เท้าหรือถุงเท้าเลอะเทอะและเป็นอุปสรรค กรณีนี้ถือเป็นเหตุจำเป็นทางสถานที่ ไม่ได้เกิดจากใจที่ลบหลู่ สามารถสวมรองเท้าตักบาตรได้ แต่ต้องชดเชยด้วยการย่อตัวลงและวางจิตใจให้อ่อนน้อมเคารพพระรัตนตรัยอย่างเต็มที่

๒. พลังศรัทธาและความเคารพของชาวพม่า (กรณีประวัติศาสตร์เจดีย์ชเวดากอง)
การนำพระวินัยมาประยุกต์ใช้: ชาวพม่าได้นำหลักการแสดงความเคารพต่อพระรัตนตรัยมาปฏิบัติตามอย่างเข้มงวดและเด็ดขาด โดยถือว่าพื้นที่ทั้งหมดของวัดและศาสนสถานเป็นเขตศักดิ์สิทธิ์ จึงกำหนดให้ทุกคนต้องถอดรองเท้าถุงเท้าออกตั้งแต่ก้าวเข้าสู่เขตนอกวัด
วีรกรรมแห่งศรัทธาสู้กับมหาอำนาจ: ในยุคที่พม่าตกเป็นเมืองขึ้นของจักรวรรดิอังกฤษ ข้าหลวงใหญ่ชาวอังกฤษซึ่งเป็นผู้ปกครองสูงสุด ต้องการใส่รองเท้าบูทเดินเข้าไปในเขตพระเจดีย์ชเวดากองเพื่อแสดงอำนาจ ชาวพม่านับหมื่นคนจึงมารวมตัวกันและพร้อมใจกันนอนเรียงรายนอนนอนทับทาบบนลานเจดีย์ พร้อมกับประกาศว่า หากข้าหลวงอังกฤษจะใส่รองเท้าเข้าไป ก็ให้เหยียบย่ำไปบนเรือนร่างของพวกตน แต่อย่าได้ให้รองเท้าได้แตะต้องพื้นลานพระเจดีย์เป็นอันขาด
ชัยชนะแห่งความนอบน้อม: ด้วยพลังศรัทธาอันยิ่งใหญ่ที่ยอมสละได้แม้ชีวิต ทำให้ข้าหลวงใหญ่อังกฤษยอมถอดรองเท้าก่อนก้าวเข้าสู่เขตเจดีย์ ซึ่งเป็นเหตุการณ์ประวัติศาสตร์ที่สะท้อนให้เห็นถึงความเคารพในพระรัตนตรัยอย่างสูงสุดของชาวพม่า

๓. ใส่รองเท้าเข้าวัดบาปหรือไม่? และวิบากกรรมที่ต้องระวัง
พื้นที่ทั่วไปในวัด (อนุโลมได้): การใส่รองเท้าเดินในพื้นที่ทั่วไป เช่น ถนน ลานจอดรถ หรืออาคารสำนักงานภายในวัด ไม่ถือว่าเป็นบาป สามารถสวมใส่ได้ตามความเหมาะสมและความสะดวกของสถานที่
เขตพัทธสีมาและพระอุโบสถ (ห้ามเด็ดขาด): พื้นที่ภายใน "พระอุโบสถ" หรือ "เขตพัทธสีมา" ถือเป็นเขตแดนเฉพาะของพระพุทธเจ้าที่ได้รับการประทับตราผูกสีมาไว้แล้ว ในเขตนี้ ต้องถอดรองเท้าออกทุกครั้งโดยไม่มีข้อยกเว้น
กรณีศึกษาเรื่องวิบากกรรม (พระเจ้าพิมพิสาร): การสวมรองเท้าเข้าไปในเขตอุโบสถถือเป็นการขาดความเคารพต่อสถานที่ศักดิ์สิทธิ์อย่างร้ายแรง ในพุทธประวัติได้บันทึกไว้ว่า พระเจ้าพิมพิสาร ในอดีตชาติเคยสวมรองเท้าเดินเข้าไปในเขตพระอุโบสถ ด้วยวิบากกรรมนั้น แม้ในชาติสุดท้ายท่านจะบรรลุธรรมเป็นพระโสดาบันและเป็นพระมหาทายกผู้มีบุญมาก แต่ก็ยังต้องรับผลกรรมอันเผ็ดร้อน โดยถูกพระเจ้าอชาตศัตรู (พระราชโอรส) สั่งให้เฆี่ยนและใช้มีดโกนกรีดฝ่าพระบาทแล้วทาด้วยเกลือ ก่อนจะนำไปย่างไฟจนสิ้นพระชนม์

สรุปแก่นธรรมและการนำไปปรับใช้
สำรวจใจตนเอง: การแต่งกายและการถอดรองเท้าเป็นกิริยาภายนอกที่สะท้อนถึงความเคารพภายในใจ หากอยู่ในสถานที่ทั่วไปให้ดูความเหมาะสม แต่หากเข้าใกล้พระภิกษุสงฆ์หรือศาสนสถานที่สำคัญ ควรแสดงความนอบน้อมด้วยการถอดรองเท้าหรือย่อตัวลง
ระมัดระวังในเขตอุโบสถ: ให้ท่องจำไว้เสมอว่าเมื่อก้าวเข้าสู่เขตอุโบสถหรือเขตพัทธสีมา ต้องถอดรองเท้าออกทันที เพื่อรักษาจิตใจให้บริสุทธิ์ นอบน้อม และป้องกันไม่ให้เกิดอกุศลกรรมติดตัวไป

รับชมวิดีโอเต็มได้ที่
https://youtu.be/D3t8rtZt10I`,
    category_ids: ['cat_006'],
    tags: ['พระพุทธศาสนา', 'การทำบุญ', 'วิบากกรรม', 'พม่า', 'เจดีย์ชเวดากอง', 'พระวินัย', 'ความเคารพ'],
    source_type: 'video',
    source_url: 'https://youtu.be/D3t8rtZt10I?si=nfkORn7G5lUx_zeU',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_035',
    title: 'มีเมตตา ต่อผู้มาคิดร้าย',
    description: 'พระอาจารย์ตอบคำถามเรื่องการไม่โต้ตอบผู้ที่มาคิดร้าย และอธิบายถึงอานิสงส์ของการแผ่เมตตาและการให้อภัยที่จะทำให้เราเป็นผู้ชนะที่แท้จริง',
    content: `มีเมตตา ต่อผู้มาคิดร้าย

มีทางบ้านถามมาว่า : การที่สอนว่า ใครทำอะไรเราแล้ว อย่าโต้ตอบ ทำไมถึงเป็นอย่างนั้นครับ การที่เราเมตตาสงสารเขาให้มาก ๆ มันทําให้เราอยู่เหนือเขาอย่างไรครับ

พระอาจารย์ตอบ : คุณโยม เขาร้ายมา เราร้ายกลับ มันเหมือนกับเอากิเลสมากัน กิเลสตระกูลความโกรธ ใครเหนือกว่ากัน ความโลภ ใครเหนือกว่ากัน ความหลง ลุ่มหลงมัวเมา ใครเหนือกว่ากัน แล้วก็ห้ำหั่นกัน มีแต่ก่อเวรผูกพันกันไปไม่รู้จักจบจักสิ้น ต่อให้เราเองเหมือนกันว่า ในสถานการณ์เฉพาะหน้าเหมือนกับชนะเขา แต่ความจริงก็ผูกเวรกันไป จริงๆ ตัวเราเองมันก็ไม่ได้ดีขึ้น พอกิเลสมันมาครอบงำอย่างนั้น

ผลคือวิบากกรรมที่เกิดขึ้นทําให้เราแย่กว่าเก่าอีก ไม่คุ้มกันเลย เพราะฉะนั้น พระสัมมาสัมพุทธเจ้าจึงสอนว่า ให้แผ่เมตตาเยอะๆ เห็นใจกันเถอะ ล้วนแล้วแต่เป็นสัตว์โลก ผู้ร่วมเกิด แก่ เจ็บ ตาย ด้วยกันหมดทั้งสิ้น

คิดอย่างนี้แล้วใจเราเอง สภาพใจมันจะยกสูงขึ้น สถานการณ์เฉพาะหน้าเหมือนกับว่าเราก็เสียเปรียบ แต่ความจริงถ้าเราทำอย่างนั้นได้จริงๆ ใจเราจะยกสูงขึ้น ไม่ก่อเวรด้วย แล้วเราจะเป็นผู้ชนะในระยะยาว อย่ามองสั้นๆ แค่เฉพาะหน้า ให้มองไกลๆ ยิ่งมองถึงข้ามภพข้ามชาติจะพบว่า การให้อภัยกันแล้วก็มีเมตตาจิตต่อกัน จะทำให้โลกเราร่มเย็นเป็นสุข แล้วตัวเราเองก็มีความสุขด้วย ทั้งชาตินี้ชาติหน้า

เจริญพร`,
    category_ids: ['cat_005'],
    tags: ['เมตตา', 'การให้อภัย', 'ความโกรธ', 'ศัตรู', 'การแผ่เมตตา', 'ข้อคิด'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_034',
    title: 'คนมีสัจจะ',
    description: 'พระอาจารย์อธิบายถึงบุคลิกและข้อดีของคนที่มีสัจจะ ว่าเป็นผู้ที่รักษาคำพูด มีความน่าเชื่อถือ และเป็นผู้ที่สามารถประสบความสำเร็จได้เร็ว',
    content: `คนมีสัจจะ

บุคลิกของคนที่มีสัจจะนั้นเป็นอย่างไร

พระอาจารย์ : คือ คนที่เมื่อได้พูดคำใดออกไปแล้วจะรักษาคำพูด เมื่อได้ตั้งใจสิ่งใดแล้ว ก็จะทำสิ่งนั้นจริง ๆ ทั้งต่อตัวเองและผู้อื่น

เรียกว่า คำพูดมีคำเหมือนกับ สัญญา ใครได้สัมผัสกับคนแบบนี้ จะรู้ได้ว่าไม่ต้องเซ็นสัญญา พูดคำไหนคำนั้นเชื่อถือได้

ข้อดี คือ จะเป็นคนที่มีเครดิตดี ใคร ๆ ก็จะเชื่อถือ แล้วขณะเดียวกันตัวเองก็มีความมั่นใจในตัวเองด้วย ไปที่ไหนก็มีความอาจหาญ เพราะเป็นผู้ที่มีสัจจะ จะเป็นคนที่เมื่อตั้งใจต่อสิ่งใดจะมุ่งตรงสิ่งนั้น ทําให้ก้าวหน้าและสําเร็จได้เร็ว ไม่เบี่ยงเบนออกนอกทาง

เจริญพร`,
    category_ids: ['cat_002'],
    tags: ['สัจจะ', 'ความน่าเชื่อถือ', 'การรักษาคำพูด', 'การพัฒนาตนเอง', 'ความสำเร็จ'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_033',
    title: 'อยากให้แม่ไปนิพพาน | ไขข้อสงสัย ep.404',
    description: 'สรุปเนื้อหาและวิธีการสร้างบุญเพื่อส่งต่อให้มารดาผู้ล่วงลับ รวมถึงแนวทางการอธิษฐานจิตเพื่อเกื้อหนุนให้ท่านเข้าใกล้หนทางแห่งพระนิพพาน',
    content: `สรุปเนื้อหาและบทวิเคราะห์จากวิดีโอรายการ "ไขข้อสงสัย ep.404" โดยพระมหาสมชาย ฐานวุฑโฒ ในหัวข้อ "อยากให้แม่ไปนิพพาน" ดังนี้ครับ:

1. วิธีการสร้างบุญเพื่อส่งต่อให้มารดาผู้ล่วงลับ
การที่ลูกต้องการแสดงความกตัญญูและส่งเสริมให้มารดาได้มีโอกาสบรรลุธรรมนั้น สามารถทำได้โดยการสั่งสมบุญกุศลในทุกรูปแบบ เช่น:
การปฏิบัติธรรมและเผยแผ่ธรรม: สวดมนต์ นั่งสมาธิ ฟังธรรม หรือแม้นำธรรมะที่ได้ฟังจากพระอาจารย์มาแบ่งปันและเล่าต่อ ซึ่งก็ถือเป็นการแสดงธรรมและเป็นทางมาแห่งบุญรูปแบบหนึ่ง
การให้ทานและรักษาศีล: ถวายสังฆทาน ทำบุญทอดผ้าป่า ทอดกฐิน รวมถึงการตั้งใจรักษาศีล 5 หรือศีล 8 อย่างเคร่งครัด

2. รูปแบบการอุทิศส่วนกุศลและการรับบุญของผู้วายชนม์
เมื่อสร้างบุญแล้ว ให้น้อมระลึกอุทิศส่วนบุญนั้นส่งตรงไปให้กับคุณแม่ซึ่งความสามารถในการรับบุญจะขึ้นอยู่กับภพภูมิที่ท่านไปเกิด
ภพภูมิที่รับบุญได้ทันที: หากคุณแม่ไปเกิดเป็นเทพบุตร เทพธิดา (ในสวรรค์) หรือหากยังอยู่ในยมโลก (อบายภูมิที่ไม่ลึกเกินไป) ท่านจะสามารถรับกระแสบุญและอนุโมทนาได้ทันที
ภพภูมิที่กระแสบุญยังส่งไม่ถึงชั่วคราว:
หากท่านกลับมาเกิดเป็นมนุษย์ หรือเกิดเป็นสัตว์เดรัจฉานที่มีกายหยาบ
หากท่านตกอยู่ในมหานรกขุมลึก
หมายเหตุ: แม้ในสองกรณีนี้บุญจะยังส่งไม่ถึงตัวท่านในทันที แต่บุญที่ลูกอุทิศให้จะไม่สูญหายไปไหน โดยจะไป "รอส่งผล" ทันทีเมื่อท่านพ้นจากภพภูมิดังกล่าว

3. แนวทางการนำส่งคุณแม่ให้เข้าใกล้หนทางแห่ง "พระนิพพาน"
พระอาจารย์ได้ให้หลักคิดสำคัญว่า เราไม่สามารถส่งกระแสบุญเพื่อให้ผู้อื่นเข้าสู่นิพพานได้โดยตรงในทันที เนื่องจากการบรรลุมรรคผลนิพพานนั้นจำเป็นต้องอาศัยการประพฤติปฏิบัติธรรมด้วยตนเอง แต่ลูกสามารถช่วยเกื้อหนุนหนทางของท่านได้ด้วยวิธีดังนี้ :
การอธิษฐานจิตกำกับบุญ: ทุกครั้งที่ทำบุญและอุทิศส่วนกุศล ให้ทำการอธิษฐานจิตกำกับไว้เสมอว่า:
"ด้วยอำนาจแห่งบุญกุศลนี้ ขอส่งผลให้คุณแม่ได้เกิดภายใต้ร่มเงาของบวรพระพุทธศาสนาในทุก ๆ ภพชาติ ได้มีโอกาสประพฤติปฏิบัติธรรมอย่างสะดวกสบาย ได้เกิดเป็นชาย ได้ออกบวช และได้ปฏิบัติธรรมเข้าสู่หนทางแห่งพระนิพพานได้โดยง่าย"
สร้างผังสำเร็จในอนาคต: การอธิษฐานจิตกำกับอย่างสม่ำเสมอเช่นนี้ จะเป็นการสร้างผังชีวิตที่ดีงามเพื่อคอยส่งเสริมและหนุนนำให้เส้นทางชีวิตในภพชาติเบื้องหน้าของคุณแม่เป็นไปตามแรงอธิษฐานและเข้าใกล้พระนิพพานมากยิ่งขึ้น

สรุปข้อคิดเตือนใจ: แม้เราจะส่งคุณแม่ไปนิพพานโดยตรงไม่ได้ทันที แต่ความตั้งใจทำบุญ รักษาศีล นั่งสมาธิ และการอธิษฐานจิตกำกับหนทางธรรมไว้เสมอ คือของขวัญและความกตัญญูอันสูงสุดที่ลูกจะส่งต่อเป็นผังชีวิตที่ดีงามให้แก่คุณแม่ในภพชาติต่อ ๆ ไปได้ครับ

รับชมวิดีโอเต็มได้ที่
https://youtu.be/INez_FzdMDk`,
    category_ids: ['cat_006'],
    tags: ['นิพพาน', 'การทำบุญ', 'อุทิศส่วนกุศล', 'ความกตัญญู', 'พ่อแม่', 'ภพภูมิ', 'ไขข้อสงสัย'],
    source_type: 'video',
    source_url: 'https://youtu.be/INez_FzdMDk?si=8_m01J3JNxCzcEd7',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_032',
    title: 'เพื่อนที่ดี | พระไตรปิฎกยามเช้า EP.919',
    description: 'สรุปเนื้อหาเกี่ยวกับความสำคัญของมิตรภาพ ลักษณะของกัลยาณมิตรที่ดีตามหลักพระพุทธศาสนา และการรักษาความสัมพันธ์ด้วยศีลและวินัย',
    content: `สรุปเนื้อหาเชิงลึกจากวิดีโอ "เพื่อนที่ดี | พระไตรปิฎกยามเช้า EP.919" โดย พระอาจารย์พระมหาเมธ และ พระอาจารย์สัจจาธิโก

ความสำคัญของมิตรภาพและกัลยาณมิตรธรรม
ในทางพระพุทธศาสนา มิตรภาพไม่ได้เป็นเพียงแค่เรื่องของการมีเพื่อนไว้คุยเล่นหรือทำกิจกรรมร่วมกัน แต่การมี "กัลยาณมิตร" หรือเพื่อนที่ดี นับเป็นทั้งหมดของชีวิตพรหมจรรย์ เพราะมิตรที่ดีจะเป็นผู้ประคบประหงม ชี้แนะทางสว่าง และนำพาชีวิตไปสู่ความเจริญทั้งทางโลกและทางธรรม

ลักษณะและหน้าที่ของ "เพื่อนที่ดี"

คอยแนะนำประโยชน์และชี้ขุมทรัพย์:
เพื่อนที่ดีจะมองเห็นประโยชน์ระยะยาวของเรา คอยชี้แนะในสิ่งที่เป็นกุศล และกล้าตักเตือนเมื่อเห็นเราเดินไปในทางที่ผิดพลาด
คำตักเตือนหรือคำติชมจากมิตรแท้จึงเปรียบเสมือนการชี้ขุมทรัพย์ที่ไม่ควรใช้อารมณ์มาผลักไส แต่ควรรับฟังด้วยใจที่เปิดกว้างและขอบคุณ

ความเมตตาบนพื้นฐานของปัญญา (ไม่เป็นทุกข์เมื่อเพื่อนยังเปลี่ยนไม่ได้):
หัวใจสำคัญของการเป็นมิตรที่ดีคือการวางจิตใจให้อยู่บนความเข้าใจ เมื่อเราหวังดีแนะนำสิ่งที่ดีให้เพื่อนแล้ว แต่เพื่อนยังไม่สามารถปรับปรุงหรือเปลี่ยนแปลงตนเองได้ทันที เราผู้เป็นเพื่อนต้อง "ไม่เป็นทุกข์" ไปกับพฤติกรรมนั้น
การวางใจให้เป็นกลาง (อุเบกขา) ร่วมกับความเมตตา จะทำให้เราไม่รู้สึกท้อแท้ หงุดหงิด หรือตัดขาดมิตรภาพ แต่ยังคงคอยตักเตือน คอยประคบประหงม และแนะนำด้วยความอดทนอยู่เสมอเมื่อถึงเวลาที่เหมาะสม

ศีลและวินัย: ฐานรากของการเชื่อมโยงมิตรภาพ

ความประพฤติที่ดีเชื่อมคนต่างวัฒนธรรม:
จากประสบการณ์การเดินทางไปทำศาสนกิจในต่างประเทศของพระอาจารย์ ทำให้เห็นว่า แม้ผู้คนจะมีความแตกต่างกันทั้งเรื่องภาษา วัฒนธรรม หรือความเป็นอยู่ แต่สิ่งที่ไม่เคยเปลี่ยนและสามารถเชื่อมโยงจิตใจของผู้คนเข้าด้วยกันได้ คือ "ศีล สิกขาบท และความประพฤติที่ดี"
เมื่อทุกคนฝึกฝนตนเอง มีศีล มีวินัย และมีความประพฤติที่งดงามตรงกัน จะก่อให้เกิดความรัก ความสามัคคี และความเป็นกัลยาณมิตรต่อกันได้โดยปราศจากกำแพงเรื่องภาษาหรือชนชาติ

การนำไปปรับใช้ในชีวิตประจำวัน

ฝึกตนเองให้เป็นกัลยาณมิตร: เริ่มต้นจากการพัฒนาจิตใจและการประพฤติตนให้มีศีลมีธรรม เพื่อดึงดูดและรักษาเพื่อนที่ดีไว้ในชีวิต
เตือนตนเองก่อนเตือนผู้อื่น: หมั่นสำรวจจิตใจตนเอง หากจะเตือนเพื่อน ต้องเตือนด้วยความหวังดีจริงๆ ไม่ใช่ด้วยความอคติหรืออารมณ์
รักษาความสัมพันธ์ด้วยความสงบเย็น: เมื่อเกิดความไม่เข้าใจกัน ให้ใช้สติและปัญญาในการปรับความเข้าใจ โดยยึดเอาความถูกต้องและประโยชน์ส่วนรวมเป็นหลัก

รับชมวิดีโอเต็มได้ที่
https://youtu.be/Hytu-T-UQpU`,
    category_ids: ['cat_001'],
    tags: ['เพื่อน', 'กัลยาณมิตร', 'การคบเพื่อน', 'พระไตรปิฎกยามเช้า', 'มิตรภาพ', 'ศีล'],
    source_type: 'video',
    source_url: 'https://drive.google.com/file/d/1QEioFQhAdUbaf2Izy4MGUBS-XKY3LrUp/view',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_031',
    title: 'วิธีทำครอบครัวอบอุ่น',
    description: 'พระอาจารย์แนะนำวิธีการสร้างความอบอุ่นในครอบครัวที่ต่างคนต่างอยู่ ด้วยการทำกิจกรรมที่เป็นบุญกุศลร่วมกัน เช่น การไปวัด หรือการสวดมนต์นั่งสมาธิ',
    content: `วิธีทำครอบครัวอบอุ่น

โยม : มีทางบ้านถามมาว่า คนในครอบครัวอยู่กันแบบต่างคนต่างอยู่ จะมีวิธีใด ทำให้ครอบครัวอบอุ่นได้บ้างคะ  

พระอาจารย์ : คุณโยมจะอบอุ่นได้เนี่ย ต้องมีกิจกรรมร่วมกัน โดยเฉพาะเป็นกิจกรรมที่ทำให้ใจของคนสมาชิกในครอบครัวชุ่มเย็น อยู่ในบุญในกุศลดีเลย คือว่าชวนกันมาวัดวันอาทิตย์ มีกิจกรรมอาสาสมัครอะไรก็ไปชวนช่วยกันทำ กวาดวัดเอย ช่วยพับจีวร ช่วยเตรียมภัตตาหารพระ อย่างนี้เป็นต้น หรือว่าในระหว่างวันธรรมดาเนี่ย ก็ชวนกันสวดมนต์นั่งสมาธิ ถ้ามีกิจวัตรที่เป็นบุญเป็นกุศลร่วมกันอย่างนี้แล้วล่ะก็ บรรยากาศรวม ความผูกพันระหว่างสมาชิกในครอบครัวจะดีขึ้น แล้วครอบครัวก็จะอบอุ่น สงบร่มเย็น

เจริญพร`,
    category_ids: ['cat_001'],
    tags: ['ครอบครัว', 'ความอบอุ่น', 'การทำบุญ', 'กิจกรรมร่วมกัน', 'ความสัมพันธ์'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_030',
    title: 'ทำผิดครั้งเดียวจำกันดี | EP 2571',
    description: 'ข้อคิดสอนใจเกี่ยวกับการรับมือเมื่อทำดีแล้วถูกลืม แต่ทำผิดกลับถูกจดจำฝังใจ พร้อมอุปมาอุปไมยเรื่องอาหารเป็นพิษกับกลไกทางจิตใจ',
    content: `สรุปเนื้อหาเชิงลึกจากวิดีโอ "ทำผิดครั้งเดียวจำกันดี | EP 2571" โดย พระมหาสมชาย ฐานวุฒโฒ

สภาวะจิตใจเมื่อความดีถูกลืม แต่ความผิดถูกจดจำ
ในสังคมมนุษย์ เหตุการณ์ที่เรารู้สึกว่าตนเองทุ่มเททำความดี เสียสละ หรือช่วยเหลือผู้อื่นมานับร้อยนับพันครั้ง แต่ผู้คนกลับมองข้าม ไม่เห็นคุณค่า หรือลืมเลือนไปอย่างรวดเร็ว ในทางกลับกัน หากเกิดข้อผิดพลาด ความพลั้งพลั้ง หรือความบกพร่องเพียงแค่ครั้งเดียว ไม่ว่าเรื่องนั้นจะเล็กน้อยเพียงใด ผู้คนรอบข้างกลับจดจำ วิพากษ์วิจารณ์ และหยิบยกขึ้นมาตักเตือนหรือโจมตีอยู่เสมอ เหตุการณ์เช่นนี้มักสร้างความท้อแท้ คับแค้นใจ และก่อให้เกิดคำถามในใจว่า "ทำไมโลกถึงไม่ยุติธรรม?"

พระพุทธศาสนาโดยพระมหาสมชาย ฐานวุฒโฒ ได้ให้แนวทางในการปรับสภาวะจิตใจ มองเห็นความเป็นจริงตามธรรมดาของโลก และวิธีการรับมือกับความรู้สึกนี้ไว้อย่างเป็นขั้นตอน

๑. ถอนพิษแห่งความคับแค้นใจ: ปรับความเข้าใจในคำว่า "ยุติธรรม"
ต้นเหตุของความทุกข์ที่แท้จริง:
ความทุกข์ที่เกิดขึ้นในใจเรา ไม่ได้เกิดจากตัวพฤติกรรมของผู้อื่นหรือการกระทำที่ผิดพลาดเพียงอย่างเดียว แต่เกิดจาก "ความคิดว่าตนเองได้รับความไม่ยุติธรรม"
เมื่อจิตเกิดความรู้สึกเปรียบเทียบว่า "เราทำดีมาตั้งเยอะ ทำไมเขาไม่จำ พลาดนิดเดียวกลับจำฝังใจ" จิตจะสร้างความขัดเคือง ความตึงเครียด และความคับแค้นใจขึ้นมาเผาลนตัวเองโดยไม่รู้ตัว
การวางใจในเบื้องต้น:
ขั้นตอนแรกที่สำคัญที่สุดคือการ "วางและถอนความรู้สึกว่าไม่ยุติธรรมออกไปจากใจ" หยุดเรียกร้องให้ผู้อื่นต้องมาเข้าใจหรือจดจำความดีของเรา เพราะการยึดติดในคำสรรเสริญหรือความดีที่เคยทำ ย่อมนำมาซึ่งความทุกข์เมื่อไม่ได้รับการตอบสนองตามที่คาดหวัง

๒. ข้ออุปมาอุปไมย: ธรรมชาติของร่างกายและจิตใจมนุษย์
เพื่อใหัเห็นภาพและเข้าใจธรรมชาติของจิตใจผู้อื่น พระอาจารย์ได้ยกข้ออุปมาอุปไมยที่เปรียบเทียบกับระบบร่างกายของมนุษย์เราเอง:
อาหารดีร้อยมื้อ กับ อาหารเป็นพิษมื้อเดียว:
หากเราดูแลรักษาสุขภาพอย่างดี รับประทานอาหารที่มีประโยชน์ สะอาด และถูกต้องตามหลักโภชนาการมาเป็นร้อยๆ วัน หรือเป็นปีๆ ร่างกายของเราก็ทรงตัวอยู่ได้อย่างปกติและแข็งแรง
แต่ถ้าเกิดวันใดวันหนึ่ง เรารับประทาน "อาหารเป็นพิษ" หรืออาหารที่ไม่สะอาดเข้าไปเพียงมื้อเดียว ร่างกายจะแสดงปฏิกิริยาตอบสนองทันที เกิดอาการปวดท้อง ท้องร่วง หรือป่วยหนักจนต้องเข้ารักษาตัวในโรงพยาบาล
ในสถานการณ์นี้ เราคงไม่สามารถไปต่อว่าหรือโกรธเคืองร่างกายได้ว่า "เจ้าร่างกายเอ๋ย ช่างไม่ยุติธรรมเลย ทำไมไม่จดจำอาหารดีๆ เป็นร้อยๆ มื้อที่เคยป้อนให้ แต่กลับมาจำและป่วยหนักเพราะอาหารเป็นพิษเพียงมื้อเดียว"
ถอดรหัสกลไกทางจิตวิทยา:
การที่ร่างกายป่วยเพราะอาหารเป็นพิษมื้อเดียว ไม่ใช่เรื่องของความทรยศหรือไม่ยุติธรรม แต่เป็น "ปฏิกิริยาตามธรรมชาติของร่างกาย" ต่อสิ่งแปลกปลอมหรือสิ่งที่เป็นพิษ
เช่นเดียวกับจิตใจของคนรอบข้าง ความผิดพลาด หรือการทำสิ่งที่ไม่ดี เปรียบเสมือน "สารพิษ" ที่เมื่อเข้าไปกระทบแล้ว ย่อมสร้างผลกระทบ (Impact) ความสะเทือนใจ หรือความตกใจให้แก่ผู้รับสารได้แรงและลึกซึ้งกว่าเรื่องดีๆ ที่เกิดขึ้นเป็นปกติธรรมดา

๓. แนวทางรับมือและการสั่งสมบุญกุศลอย่างยั่งยืน
เมื่อเข้าใจแล้วว่าการที่คนอื่นจดจำความผิดพลาดได้ดีกว่าความดี เป็นเรื่องธรรมดาตามกลไกธรรมชาติของจิตใจมนุษย์ เราจึงควรปรับวิธีคิดและการดำเนินชีวิตดังนี้:
เปลี่ยนความคับแค้นเป็น "ยิ้มรับ" และ "ยิ้มสู้":
เมื่อทำผิดพลาดไปแล้ว ให้ยอมรับความจริงด้วยใจที่สงบ ยิ้มรับผลที่เกิดขึ้นอย่างมีสติ โดยไม่นำความรู้สึกขัดเคืองมาเป็นบั่นทอนกำลังใจของตนเอง
ใช้จิตใจที่เข้มแข็ง "ยิ้มสู้" กับอุปสรรคและคำวิพากษ์วิจารณ์
เพียรพยายามทำความดีอย่างต่อเนื่อง:
อย่าหยุดทำความดีเพียงเพราะคนอื่นมองไม่เห็นหรือลืมเลือนไป ให้มุ่งมั่นทำความดีและสร้างบุญกุศลต่อไปเรื่อยๆ
ทุกๆ ครั้งที่เราทำความดี ผลแห่งความดีและบุญกุศลจะเกิดขึ้นที่ใจของเราทันที ทำให้จิตใจของเรามีความสุข สงบ และผ่องใส โดยไม่ต้องพึ่งพาการยอมรับจากภายนอก
ความดีจะชนะและเจือจางความผิดในที่สุด:
การสั่งสมความดีเปรียบเหมือนการเติมน้ำบริสุทธิ์ลงในภาชนะ แม้ว่าในอดีตจะมีสิ่งเจือปนหรือข้อผิดพลาดเกิดขึ้น แต่ด้วยน้ำหนักและปริมาณของความดีมหาศาลที่สั่งสมอย่างสม่ำเสมอ ในที่สุดความดีนั้นจะสามารถชำระล้างและทำให้ข้อบกพร่องในอดีตค่อยๆ จางหายไปเอง

รับชมวิดีโอเต็มได้ที่
https://youtu.be/ZT6GOQOGXns`,
    category_ids: ['cat_005'],
    tags: ['จิตวิทยา', 'ข้อคิด', 'การพัฒนาตนเอง', 'ทำความดี', 'การวางใจ', 'ความผิดพลาด'],
    source_type: 'video',
    source_url: 'https://youtu.be/ZT6GOQOGXns?si=TSCCVC6lCrzmZEIK',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_029',
    title: 'ได้ดูแลเเม่น้อยไป ท่านเสียแล้วจะบาปไหม?',
    description: 'พระอาจารย์ตอบคำถามและให้กำลังใจผู้ที่รู้สึกผิดที่ดูแลคุณแม่น้อยเกินไปก่อนท่านเสียชีวิต พร้อมแนะนำวิธีการทำบุญอุทิศส่วนกุศลเพื่อทดแทนคุณ',
    content: `ได้ดูแลเเม่น้อยไป ท่านเสียแล้วจะบาปไหม?

ผมไม่ได้สนใจแม่เท่าที่ควรเพราะมัวสนใจแต่การเรียน ที่บ้านสนับสนุนผมเยอะมาก แบบนี้ผมจะบาปไหมครับ ที่ดูแลแม่น้อยเกินไป รู้สึกผิดครับ จนไม่อยากจะอยู่เลย แต่แม่เขาก็มีผมเป็นกำลังใจช่วงที่อยู่

พระอาจารย์ : คุณโยม คุณโยมไม่ได้บาปหรอก เพราะว่าคุณแม่ก็อยากให้เราตั้งใจเรียน ที่บ้านอยากให้เราตั้งใจเรียน เราก็ทุ่มเทเรื่องการเรียนเนี่ย เพราะไม่นึกว่าคุณแม่ท่านจะจากเราไปเร็วขนาดนี้ ใช่ไหม แล้วท่านจากไปแล้ว เราเองก็รู้สึกเสียใจ ถึงขนาดมาถามอย่างนี้ จนบางที บอกว่าเสียใจจนไม่อยากอยู่ อย่าเป็นขนาดนั้นนะ แสดงคุณโยมเองก็รักคุณแม่มากเลยเนี่ย

เพราะฉะนั้นเนี่ย เราไม่ได้บาป เพียงแต่รู้สึกผิด เพราะรู้สึกว่าดูแลท่านน้อยไปหน่อยนึง วิธีการที่จะแก้ได้ ก็คือว่า ทำในสิ่งที่เป็นประโยชน์กับท่านตอนนี้ อย่าไปนึกถึงเรื่องในอดีตที่ผ่านไปแล้ว ซึ่งมันทำอะไรไม่ได้ แหม ตอนนั้นเราให้เวลาคุณแม่มากขึ้นอีกนิดก็ดีนะ อะไรต่างๆนานา ไม่มีประโยชน์ไม่ต้องไปเสียเวลาคิดเรื่องนั้น ให้ดูว่าปัจจุบันเนี่ย ที่เราทำได้คือทำบุญ ทำตัวให้ดีเลย ให้ประสบความสำเร็จยิ่งๆขึ้นไป เราจะได้มีกำลังมากขึ้น

แล้วไปทำบุญทั้งการให้ทานก็ตาม รักษาศีลก็ตาม สวดมนต์นั่งสมาธิก็ตาม แล้วอุทิศบุญเนี่ย ให้กับคุณแม่อย่างสม่ำเสมอ อย่างนี้ เป็นประโยชน์กับท่านมากที่สุดแล้ว เป็นประโยชน์กับตัวคุณโยมเองด้วยนะ เท่ากับว่าความกตัญญูที่เรามีต่อท่านเนี่ย เป็นแรงขับเคลื่อนให้เราเองได้สร้างบุญสร้างกุศลมากขึ้นด้วย มีความสุขความสำเร็จในชีวิตมากขึ้นด้วย คุณแม่ในสัมปรายภพอยู่บนสวรรค์ ท่านเห็น ท่านก็ยิ่งชื่นใจ

เจริญพร`,
    category_ids: ['cat_001'],
    tags: ['ครอบครัว', 'ความกตัญญู', 'การทำบุญ', 'ความรู้สึกผิด', 'พ่อแม่', 'อุทิศบุญ'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_028',
    title: 'เริ่มงานใหม่ แต่ถูกนินทา | ไขข้อสงสัย ep.452',
    description: 'พระอาจารย์แนะนำข้อคิดสำหรับผู้ที่เพิ่งเริ่มงานใหม่แล้วโดนตำหนิหรือถูกติฉินนินทา พร้อมยกตัวอย่างการลดอีโก้ของพระเจ้าปีเตอร์มหาราช',
    content: `คลิปวิดีโอนี้คือรายการ "ไขข้อสงสัย ep.452" โดย พระมหาสมชาย ฐานวุฑโฒ ในหัวข้อ "เริ่มงานใหม่ แต่ถูกนินทา"

สรุปข้อคิดและแนวทางแก้ไขจากคลิป ดังนี้ครับ:

1. คำแนะนำสำหรับผู้เริ่มงานใหม่และถูกติฉินนินทา
ทุ่มเทและพากเพียรมากกว่าเดิม: เพิ่มความขยัน ความใส่ใจ เอาจริงเอาจังเป็น 2 เท่าไม่มีใครรู้หรือเก่งทุกอย่างมาตั้งแต่เกิด การทำสิ่งที่ไม่คุ้นเคยแล้วผิดพลาดบ้างถือเป็นเรื่องปกติ
ผู้ชี้โทษคือผู้ชี้ขุมทรัพย์: อย่าเอาน้อยใจหรือเก็บคำตำหนิมาเป็นความเครียดให้รับฟังแล้วนำมาปรับปรุงพัฒนาตัวเองให้ดีขึ้นเรื่อยๆ
อย่ากดดันตัวเองด้วยกรอบความสมบูรณ์แบบ: อย่าตั้งกรอบว่าตัวเองต้องเป๊ะ ต้องถูกต้องเสมอ เพราะจะทำให้เกิดความเครียดและกดดัน หากตั้งใจทุ่มเท ไม่กี่สัปดาห์หรือ 2–3 เดือนก็จะเริ่มเก่งและรู้มากขึ้นเอง

2. ข้อคิดจากตัวอย่างประวัติศาสตร์: พระเจ้านโปเลียน/พระเจ้าปีเตอร์มหาราชแห่งรัสเซีย
เรื่องเล่าของพระเจ้าปีเตอร์มหาราช: ทรงปลอมตัวเป็นกรรมกรไปทำงานในอู่ต่อเรือที่ยุโรปเพื่อเรียนรู้วิชา
วางอีโก้ลง: แม้ทรงเป็นถึงพระราชา แต่เมื่อทำงานผิดพลาดโดนดุด่าตำหนิ พระองค์ก็ทรงน้อมรับฟัง ไม่ได้นำอีโก้ความเป็นพระราชามาใส่ใจ เพราะมุ่งหวังเพียงแค่ความรู้เพื่อนำกลับไปพัฒนาประเทศชาติ

สรุปปลุกใจ:
ถอดความเย่อหยิ่งหรืออีโก้ออกไป เปิดใจรับฟังทุกคำติชมเพื่อพัฒนาตนเอง แล้วจะเติบโตขึ้นและมีความสุขในการทำงานทุกๆ วัน

รับชมวิดีโอเต็มได้ที่
https://youtu.be/LQOcD2vKQHY`,
    category_ids: ['cat_001'],
    tags: ['การทำงาน', 'การพัฒนาตนเอง', 'นินทา', 'อีโก้', 'พระเจ้าปีเตอร์มหาราช', 'เริ่มงานใหม่', 'กำลังใจ'],
    source_type: 'video',
    source_url: 'https://youtu.be/LQOcD2vKQHY?si=DSDAYYQJQHPVTxSO',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_027',
    title: 'คุณยายชอบดุด่าถึงแม้ว่าเราจะพยายามทำดีแล้วก็ตาม ควรทําอย่างไรดีครับ',
    description: 'พระอาจารย์แนะนำวิธีรับมือกับผู้สูงอายุที่ชอบบ่นหรือดุด่าด้วยความเคยชิน โดยใช้ความรัก ความอ่อนโยน และการขอพรเพื่อเปลี่ยนพฤติกรรม',
    content: `คุณยายชอบดุด่าถึงแม้ว่าเราจะพยายามทำดีแล้วก็ตาม ควรทําอย่างไรดีครับ

พระอาจารย์ตอบ : บางทีการที่ท่านดุด่าเรานั้นเป็นแค่ความเคยชิน ท่านอาจจะไม่ได้ตั้งใจ แต่พอท่านมีอายุมากขึ้น การเคลื่อนไหวของร่างกายช้าลงจึงตอบสนองโดยการชดเชยด้วยคำพูด ทําให้ใช้ปากมากขึ้น พูดบ่นมากเข้าก็กลายเป็นดุด่าจนเคยชินเป็นนิสัยไปแล้ว ให้ลูกหลานเข้าใจว่าแท้จริงแล้วในใจลึก ๆ ของท่านไม่คิดจะดุด่าเราหรอก แต่หลุดปากไปอย่างนั้นเอง

ดังนั้น ให้เราลองเปลี่ยนวิธีปฏิบัติ พอคุณยายมีท่าทีจะเริ่มพูดบ่น ก็ให้เราเข้าไปกอดคุณยายเลย

ใจจริงท่านรักเราอยู่แล้ว กอดอ้อนหน่อยท่านก็อ่อนลง พนมมือไหว้ขอพรท่านไปเลย แทนที่ท่านจะบ่น ก็บ่นไม่ลง ต้องเอ่ยปากให้พรกันไป ทำครั้งแรก ๆ ใหม่ ๆ ท่านอาจจะงง ๆ แต่หลานมาขอพรอย่างไรท่านก็ต้องหยุดชะงักแน่นอน

หากลูกหลานทำอย่างนี้บ่อย ๆ ความเคยชินที่ท่านเคยบ่นว่าเราก็จะค่อย ๆ ลดลง กลายเป็นความเคยชินใหม่ คือ หมั่นพูดให้ศีลให้พรลูกหลานเป็นปกติ ทำได้อย่างนี้จะดีทั้งต่อตัวเราและคุณยายด้วย

เจริญพร.`,
    category_ids: ['cat_001'],
    tags: ['ครอบครัว', 'ผู้สูงอายุ', 'การรับมือ', 'ความรัก', 'ปัญหาครอบครัว'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_026',
    title: 'ความกตัญญูทำให้เป็นคนมีปัญญาได้จริงหรือ',
    description: 'พระอาจารย์ตอบคำถามเรื่องความกตัญญูว่ามีความเชื่อมโยงกับการเกิดปัญญาอย่างไร พร้อมยกตัวอย่างความกตัญญูของพระสารีบุตรที่มีต่อราธพราหมณ์',
    content: `ธรรมะจับใจ โดยพระมหาสมชาย ฐานวุฑฺโฒ

คำถาม : ความกตัญญูทำให้เป็นคนมีปัญญาได้จริงหรือค่ะ

พระอาจารย์ : จริงคุณโยม เราเองถ้ามีความกตัญญูอยู่ในใจแล้ว หนึ่ง แสดงว่าเราจะต้องเห็นคุณของท่าน

คนบางคนไม่มีความกตัญญู คือพ่อแม่มีพระคุณยังไงมองไม่ออกนะ ไปนึกเอาแบบหยาบๆ ว่า ท่านสนุกๆ แล้วเราเลยเกิดมา เรามีบุญคุณกับพ่อแม่นะ ทำให้ท่านไม่เหงา ไม่มีเราท่านเหงาแย่เลย คิดอย่างนี้ก็มีนะ ปัญญายังหยาบเต็มที่

แต่ผู้ที่มีความกตัญญูแล้วล่ะก็ ใจจะละเอียดสามารถตรองเห็นพระคุณผู้ที่มีพระคุณได้ พระคุณพ่อแม่เห็นชัด คุณครูบาอาจารย์เห็นชัด หรือใครเคยช่วยเหลือประการใด ก็จะมองเห็นถึงพระคุณของเค้าอย่างชัดเจน ไม่คิดจากมุมตัวเอง

เค้าช่วยมาร้อย บางคนมองแค่สิบ ว่ามันเผอิญๆ ฟลุคๆ แหละ ช่วยเสร็จใหม่ๆ ก็นึกถึงพระคุณเค้า ผ่านไปแป๊บเดียวลืมแล้ว ความจำจะค่อนข้างสั้น แต่คนมีความกตัญญู ความจำจะยาว คิดอะไรก็จะคิดไปตลอดรอดฝั่ง แล้วยังคิดถึงการแทนพระคุณท่านอีก

ทำให้ได้เค้นความสามารถเราออกมา พัฒนาตัวเองอย่างเต็มที่ เพื่อให้สามารถตอบแทนพระคุณท่านได้ ปัญญาก็จะเกิดอย่างเต็มที่ เหมือนพระสารีบุตร แค่นึกถึงคุณข้าวทัพพีเดียว ที่ราธพราหมณ์เคยตักบาตรให้ท่าน ผ่านไปกี่ปีก็ไม่ลืม

ถึงตอนราธพราหมณ์อยากจะบวช แต่อายุเยอะแล้ว คนอื่นไม่มีใครอยากจะบวชให้ เพราะผู้มีอายุมากจะดื้อสอนยาก โดยทั่วไป แต่พระสารีบุตรยินดีสอนให้ ผลคือท่านเองก็เป็นผู้เลิศทางด้านปัญญา ยิ่งกว่าพระอรหันต์ทั้งปวงเช่นเดียวกัน เจริญพร`,
    category_ids: ['cat_002'],
    tags: ['ความกตัญญู', 'ปัญญา', 'พระสารีบุตร', 'ธรรมะจับใจ', 'การพัฒนาตนเอง'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_025',
    title: 'เห็นอริยสัจ | พระไตรปิฎกยามเช้า EP.1964',
    description: 'สรุปเนื้อหาเชิงลึกจากรายการพระไตรปิฎกยามเช้า เรื่องการเห็นอริยสัจ 4 ด้วยตาปัญญา การเกิดธรรมจักษุ และแนวทางการนำอริยสัจไปปรับใช้ในชีวิตประจำวัน',
    content: `สรุปเนื้อหาเชิงลึกและรายละเอียดอย่างครอบคลุมจากวิดีโอ "เห็นอริยสัจ | พระไตรปิฎกยามเช้า EP.1964" โดย พระอาจารย์สัจจาธิโก (รายการพระไตรปิฎกยามเช้า)

บทนำ: ความหมายของการ "เห็นอริยสัจ"
ในทางพระพุทธศาสนา "อริยสัจ 4" หรือความจริงอันประเสริฐ 4 ประการ ถือเป็นหัวใจสำคัญสูงสุดของคำสอนทั้งหมด รายการพระไตรปิฎกยามเช้าในตอนนี้ พระอาจารย์สัจจาธิโกได้นำเสนอและขยายความประเด็นการ "เห็นอริยสัจ" ว่าไม่ใช่เพียงการจดจำข้อธรรมะหรือท่องจำคำอธิบายในตำราได้ แต่คือการที่จิตเกิด ปัญญารู้แจ้งเห็นจริง ตามสภาวะความเป็นจริงของชีวิต จนสามารถถอดถอนความยึดมั่นถือมั่นและดับความทุกข์ในใจได้

สาระสำคัญและการอธิบายเชิงลึก

๑. ความหมายและโครงสร้างของอริยสัจ 4
พระอาจารย์ได้ทบทวนและจำแนกสัจธรรมทั้ง 4 ประการเพื่อให้ผู้ฟังเข้าใจหน้าที่ต่ออริยสัจแต่ละข้ออย่างถูกต้อง:
ทุกข์ (ความจริงว่าด้วยความทุกข์): สภาวะที่ทนได้ยาก ความไม่สบายกาย ไม่สบายใจ ความเกิด แก่ เจ็บ ตาย ความสูญเสีย และการไม่ได้ในสิ่งที่ปรารถนา — หน้าที่ต่อทุกข์คือ "ควรกำหนดรู้" (ปริญเญยย)
สมุทัย (สาเหตุแห่งทุกข์): ตัณหาหรือความอยาก 3 ประการ ได้แก่ กามตัณหา (อยากได้) ภวตัณหา (อยากเป็น) และวิภวตัณหา (อยากไม่เป็น/อยากสูญหาย) — หน้าที่ต่อสมุทัยคือ "ควรละ" (ปหาตัพพะ)
นิโรธ (ความดับทุกข์): สภาวะที่จิตหลุดพ้นจากกิเลสตัณหา มีความสงบเย็น และเข้าถึงพระนิพพาน — หน้าที่ต่อนิโรธคือ "ทำให้แจ้ง" (สัจฉิกาตัพพะ)
มรรค (หนทางนำไปสู่ความดับทุกข์): อริยมรรคมีองค์ 8 หรือการฝึกฝนใน ศีล สมาธิ ปัญญา — หน้าที่ต่อมรรคคือ "ควรเจริญ/ทำให้มาก" (ภาเวตัพพะ)

๒. สภาวะของการ "เห็น" อริยสัจตามความเป็นจริง
การเห็นด้วยตาเนื้อ vs การเห็นด้วยตาปัญญา: การอ่านตำราหรือฟังธรรมเป็นการรู้ในระดับสัญญา (ความจำ) แต่การเห็นอริยสัจที่แท้จริงต้องเกิดจาก "ธรรมจักษุ" (ดวงตาเห็นธรรม) คือจิตเข้าไปเห็นการเกิดขึ้น ดำรงอยู่ และดับไปของสภาวะธรรมตามธรรมชาติ (ไตรลักษณ์)
เห็นทุกข์จึงเห็นธรรม: พระอาจารย์เน้นย้ำว่า ผู้ที่ไม่เห็นความทุกข์ในชีวิต หรือพยายามวิ่งหนีความทุกข์ด้วยการแสวงหาความสุขทางโลก ย่อมยากที่จะเข้าถึงธรรม แต่เมื่อใดที่จิตยอมรับความจริงว่าชีวิตมีความทุกข์เป็นธรรมดา จิตจะเริ่มแสวงหาทางออกจากทุกข์และเปิดรับการเห็นอริยสัจ

๓. ประโยชน์และอานิสงส์ของการเห็นอริยสัจ
เกิดความละวางในกิเลส: เมื่อเห็นว่าความอยาก (ตัณหา) คือต้นเหตุแห่งความทุกข์ จิตจะค่อยๆ ลดละความยึดมั่นถือมั่นในตัวตนและสิ่งของภายนอก
จิตใจมีความสงบและมั่นคง: ไม่หวั่นไหวไปตามผัสสะหรืออารมณ์ที่เข้ามาปะทะ เพราะเข้าใจว่าทุกสิ่งเกิดขึ้นเนื่องมาจากเหตุและปัจจัย
เป็นก้าวสำคัญสู่ความหลุดพ้น: การเห็นอริยสัจเป็นจุดเริ่มต้นของการเปลี่ยนผ่านสภาวะจากปุถุชนไปสู่ความเป็นพระอริยบุคคล

แก่นธรรมและการนำไปปรับใช้ในชีวิตประจำวัน
ฝึกดูสภาวะธรรมในชีวิตประจำวัน: เมื่อเกิดความทุกข์ ความโกรธ หรือความไม่ได้ดังใจ แทนที่จะดิ้นรนแก้ไขคนอื่น ให้หันกลับมา "กำหนดรู้" อารมณ์ทุกข์ที่เกิดขึ้นในใจตนเอง
ค้นหาต้นเหตุแห่งความอยาก: เมื่อจิตมีความกระวนกระวาย ให้สำรวจดูว่ามีความอยาก (ตัณหา) ข้อใดแอบแฝงอยู่ แล้วใช้สติและปัญญาในการละความอยากนั้น
เจริญอริยมรรคอย่างสม่ำเสมอ: สั่งสมการรักษาศีล ฝึกสมาธิให้จิตตั้งมั่น และเจริญปัญญาเพื่อเห็นความจริงในทุกๆ วัน

รับชมวิดีโอฉบับเต็มได้ที่
https://www.youtube.com/live/8QCdxuXzGp0`,
    category_ids: ['cat_006'],
    tags: ['อริยสัจ 4', 'การรู้แจ้ง', 'พระไตรปิฎกยามเช้า', 'ปัญญา', 'พระพุทธศาสนา', 'การดับทุกข์'],
    source_type: 'video',
    source_url: 'https://drive.google.com/file/d/1QEioFQhAdUbaf2Izy4MGUBS-XKY3LrUp/view',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_024',
    title: 'คิดมากเกินกว่าเหตุ',
    description: 'พระอาจารย์แนะนำวิธีแก้ปัญหาสำหรับคนที่คิดมากและวิตกกังวล โดยการฝึกตรึกศูนย์กลางกายและรักษาใจให้อยู่กับบุญกุศลตลอดทั้งวัน',
    content: `โยม : พระอาจารย์ครับ คิดมากเกินกว่าเหตุ ไม่สบายใจเกินความจำเป็น ควรทำอย่างไรดีครับ 

พระอาจารย์ : แสดงว่าคุณโยม เป็นคนที่ค่อนไปทางด้านวิตกจริตมากนิดนึง ในการแก้ปัญหาด้วยการ สวดมนต์ นั่งสมาธิดีอยู่แล้ว แต่เพิ่มนิดเดียวว่า อย่าไปคิดเฉพาะเวลานั่งเท่านั้น พยายามรักษาใจ ตรึกเอาไว้ที่กลางท้อง ที่ศูนย์กลางกายเสมอๆ แม้ว่าจะยืน เดิน นั่ง นอน จะอาบน้ำ แปรงฟัน ทานข้าว ทำอะไรก็แล้วแต่ ใจเราก็ตรึกอยู่เสมอๆ แทนที่จะปล่อย จะไปคิดโน่น คิดนี่ เดี๋ยวมันก็จะไปถึงเรื่องวนๆ เรื่องวิตกกังวลเลย อย่างที่เราเคย เพราะมันคิดจนเคยเป็นนิสัยแล้วไง 

สิ่งที่เราควรทำคือ เอาใจเรามาสร้างนิสัยใหม่ ก็ให้มาอยู่ที่ศูนย์กลางกาย เพราะเมื่อไหร่ ใจอยู่ที่ศูนย์กลางกาย ใจจะได้สมดุลกำลังบุญจะหล่อเลี้ยงใจ จะมีความสุข นิ่งแล้ว ก็จะไม่ไปคิดอะไรทางด้านลบๆ  

ให้เราเอาใจมาคลอเคลียร์ ที่ศูนย์กลางกาย ตลอดทั้งวันเลย นึกได้เมื่อไหร่ ก็นึกเอาใจมาฝึกตรงนี้ ใหม่ๆมันอาจจะเผลออยู่เรื่อย ก็ไม่เป็นไร แต่พอเรารู้ตัว นึกได้เมื่อไหร่ ก็เอาใจมาวาง อีกสักแป๊บนึง เผลออีกแล้ว พอรู้ตัว เข้ามาวางอีกอย่างนี้เรื่อยๆไป  

ถึงกลางคืน พอจะสวดมนต์ นั่งสมาธิ ครั้งนี้ จะนั่งได้ดีกว่าเก่า แล้วก็พยายาม อย่าเอาอะไร ที่ทำให้ใจเราฟุ้ง เช่นว่าเข้าโซเชียล หรือว่าเกม หรือว่าซีรี่ย์ อะไรพวกนี้ เป็นต้นเนี่ย ไปสวดมนต์นั่งสมาธิ พอใจสบาย เราก็พักผ่อน นอนอย่างนี้จะดี แล้วจะหลับสนิทความวิตกกังวลก็จะลดลง เพราะใจเราอยู่กับสิ่งที่เป็นบุญเป็นกุศลตลอด เราไม่เปิดช่องให้นิสัยเก่าๆ ความคิดเก่าๆ ที่เราคิดจนเคยมารบกวนเรา ปรับอย่างนี้บ่อยๆเข้า เดี๋ยวสักพักก็จะเกิดเป็นความเคยชินที่ใจเราสบาย กลางคืนเป็นเวลาที่ใจมีความสุขที่สุดเลย ใจนิ่ง ใจโปร่ง ใจโล่ง ใจเบา สบาย ถึงคราวหลับก็จะหลับอย่างเต็มอิ่ม ขอให้ประสบความสำเร็จ

เจริญพร`,
    category_ids: ['cat_005'],
    tags: ['ความกังวล', 'คิดมาก', 'สมาธิ', 'ศูนย์กลางกาย', 'จิตใจ', 'การพัฒนาตนเอง'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_023',
    title: 'พลังการหยุดคิด',
    description: 'ทำไมพระถึงสอนให้หยุดคิด? พระอาจารย์อธิบายถึงภาวนามยปัญญา ปัญญาที่เกิดจากความสงบนิ่ง พร้อมยกตัวอย่างบุคคลระดับโลกอย่าง สตีฟ จอบส์ และอัลเบิร์ต ไอน์สไตน์',
    content: `พลังการหยุดคิด

พลังความคิดทรงพลังมาก แต่ทําไมพระสอนว่าให้หยุดคิด

พระอาจารย์ : เข้าใจสงสัยคุณโยม แล้วรถขับเครื่องแรง ขับเหยียบเร็วมาก ทรงพลังมาก ทําไมต้องจอดรถด้วยบางครั้ง ทำไมไม่ขับ 24 ชม. มันต้องมีจังหวะพักบ้าง

แล้วยังมีหลักคำสอนนี้ คือ ความคิดทรงพลังมาก แต่มีปัญญาความรู้ที่ได้อีกแบบหนึ่งที่ไม่ได้มาจากความคิด มาจากการหยุดคิด ท่านเรียกว่าเป็น ภาวนามยปัญญา ปัญญา จากการทำสมาธิภาวนาเป็นความรู้แจ้ง

สตีฟ จอบส์ ที่ค้นพบนวัตกรรมเยอะแยะ เขาบอกว่าเป็นเพราะใช้วิธีนี้ หยุดคิดนิ่ง ๆ นั่งสมาธิวันละ 2 ชม. แล้วจะเกิดสิ่งหนึ่งผุดขึ้นมาในใจ ความผุดรู้ อยู่ ๆ แว๊บขึ้นมาว่าต้องอย่างนั้นต้องอย่างนี้ แล้วมีพลังเหนือกว่าความคิดอีก คนที่ประสบความสำเร็จใหญ่ ๆ ในโลกมักจะเจอประสบการณ์อย่างนี้

อัลเบิร์ต ไอน์สไตน์ ถึงบอกว่า จินตนาการสำคัญกว่าความรู้ ทำใจสบาย ๆ นิ่ง ๆ มันแว๊บขึ้นมาพลังแห่งจินตนาการ พลังแห่งใจที่สงบนิ่งจะให้สิ่งดี ๆ ต่อตัวเราแล้วต่อโลก

เจริญพร`,
    category_ids: ['cat_003'],
    tags: ['สมาธิ', 'การหยุดคิด', 'ภาวนามยปัญญา', 'สตีฟ จอบส์', 'ความคิด', 'จิตใจ'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_022',
    title: 'ทำอะไรเกิดเป็นยมทูต',
    description: 'สรุปเนื้อหาอธิบายเรื่องภพภูมิและวิบากกรรมที่ทำให้เกิดเป็นยมทูต ลักษณะของยมทูต และวงรอบการทำงานเสวยสุขตามกำลังบุญ',
    content: `สรุปเนื้อหาและคำอธิบายโดยละเอียดจากวิดีโอ "ทำอะไรเกิดเป็นยมทูต" โดย พระมหาสมชาย ฐานวุฑโฒ:

ประเด็นคำถามจากทางบ้าน
ผู้ถามได้กราบเรียนถามพระอาจารย์ด้วยความสงสัยเกี่ยวกับเรื่องภพภูมิและโลกหลังความตาย ดังนี้:
คนที่ไปเกิดเป็น "ยมทูต" ในนรกนั้น ก่อนหน้านี้เขาทำกรรมหรือประกอบอาชีพอะไรมา
การเป็นยมทูตต้องเป็นนานแค่ไหน มีหมดอายุขัยหรือไม่
หลังจากพ้นจากสภาวะยมทูตแล้ว จะมีโอกาสได้ไปเกิดในภพภูมิอื่นอีกหรือไม่

สาระสำคัญและคำอธิบายตามหลักพระพุทธศาสนา

1. ยมทูตคือใคร และลักษณะทางกายภาพเป็นอย่างไร
สภาวะแท้จริง: ยมทูตก็คืออดีตมนุษย์อย่างพวกเรา และแท้จริงแล้วจัดเป็น เทวดาประเภทหนึ่ง บนสวรรค์ชั้นล่างสุด คือ ชั้นจาตุมหาราชิกา
กลุ่มและลักษณะ: ยมทูตอยู่ในกลุ่มอมนุษย์ที่เรียกว่า "กุมภัณฑ์" ซึ่งมีลักษณะคล้ายยักษ์ คือ ผมหยิก ผิวตัวดำ ตาโปน และมีพุงโร

2. วิบากกรรมในอดีตที่ส่งผลให้เกิดเป็นยมทูต
สายงานในมนุษย์โลก: ส่วนใหญ่ในชีวิตมนุษย์เคยทำสายงานเกี่ยวกับความยุติธรรม การลงโทษ หรือการคุ้มกัน เช่น เป็นผู้คุมในคุก เจ้าหน้าที่ราชทัณฑ์ หรือผู้ที่ต้องลงโทษผู้กระทำความผิด
สัดส่วนของบุญและบาป:
ทำบุญไว้อยู่บ้าง แต่ไม่ได้มากพอที่จะไปเกิดเป็นเทวดาสวยงามบนสวรรค์ชั้นสูงๆ
ขณะเดียวกัน บาปกรรมที่ทำก็ไม่ได้หนักหนาถึงขั้นต้องตกนรกหมกไหม้
ผลบุญจึงส่งให้ไปเกิดเป็นเทวดาชั้นจาตุมหาราชิกาในตำแหน่งกุมภัณฑ์

3. วงรอบการทำงานและการเสวยสุข (แบ่งตามกำลังบุญ)
ยมทูตไม่ได้ทำการลงโทษคนสัตว์นรกตลอดเวลา แต่จะสลับกับการไปเสวยสุขเป็นเทวดาบนสวรรค์ ตามอัตราส่วนของกำลังบุญ-บาปที่ทำไว้:
ผู้มีบุญมากหน่อย: เสวยสุขเป็นเทวดาบนสวรรค์ ๙ เดือน และต้องลงไปทำหน้าที่เป็นยมทูตในนรก ๓ เดือน
ผู้มีบุญกับบาปปานกลาง: เสวยสุขบนสวรรค์ ๖ เดือน และไปทำหน้าที่เป็นยมทูต ๖ เดือน
ผู้มีบุญน้อย: เสวยสุขบนสวรรค์เพียง ๓ เดือน และต้องไปทำหน้าที่เป็นยมทูตในนรกถึง ๙ เดือน
ความยากลำบากของยมทูต: ในขณะที่ทำหน้าที่เป็นยมทูตแม้จะเป็นผู้ลงโทษผู้อื่น แต่ก็ต้องเผชิญกับความชอกช้ำและความร้อนจากเปลวไฟนรก ได้รับความลำบากและโดนสะเก็ดไฟนรกไปด้วย ไม่ใช่เรื่องสบาย

4. อายุขัยและการเวียนว่ายตายเกิด
มีหมดอายุขัย: ยมทูตมีอายุขัยเหมือนเทวดาทั่วไป เมื่อหมดอายุขัยหรือหมดกรรมในภพภูมินั้นแล้ว ก็ต้องจุติ (ตาย) จากสภาวะการเป็นยมทูต
โอกาสไปเกิดในภพภูมิอื่น: สามารถกลับมาเกิดเป็นมนุษย์ หรือไปเกิดในภพภูมิอื่นๆ (สวรรค์, นรก, เปรต, เดรัจฉาน) ได้ตามกระแสบุญและบาปที่เคยทำสะสมไว้ ยังคงต้องเวียนว่ายตายเกิดในสังสารวัฏตามปกติ

ข้อคิดและบทสรุป
ชีวิตหลังความตายและตำแหน่งในภพภูมิต่างๆ สัมพันธ์โดยตรงกับผลกรรม ความดีและความชั่วที่ได้กระทำไว้เมื่อครั้งเป็นมนุษย์ การทำบุญกุศลอย่างสม่ำเสมอและละเว้นจากการเบียดเบียนผู้อื่น จะช่วยนำพาจิตวิญญาณไปสู่สุคติภูมิที่ดียิ่งขึ้น

รับชมวิดีโอฉบับเต็มได้ที่
https://youtu.be/0Iv-fU_0g0k`,
    category_ids: ['cat_006'],
    tags: ['ยมทูต', 'ภพภูมิ', 'นรก', 'สวรรค์', 'พระพุทธศาสนา', 'เวรกรรม'],
    source_type: 'video',
    source_url: 'https://youtu.be/0Iv-fU_0g0k?si=OonXnXesYRajnzM3',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_021',
    title: 'ลดกรรมในชีวิตอย่างไร',
    description: 'พระอาจารย์แนะนำวิธีการทำบุญง่ายๆ ในชีวิตประจำวันสำหรับคนที่ไม่มีเวลาไปวัด เพื่อช่วยลดเวรกรรมและสะสมบุญผ่านทาน ศีล และภาวนา',
    content: `มีทางบ้าน ถามมาว่า คนที่ไม่มีเวลาไปวัด จะล้างกรรมหรือลดเวรกรรมในชีวิตประจำวันได้อย่างไรบ้าง

พระอาจารย์ : ทำได้คุณโยม โดยที่ว่าหลักการทำบุญ 3 อย่าง คือให้ทาน รักษาศีล เจริญภาวนา เราก็เอากระปุกมาก็ได้เนี่ย ถึงเวลาเช้ามาก็หยอดกระปุกก่อน บาทหนึ่ง 5 บาท 10 บาทก็ได้ เรามีกำลังแค่ไหนก็ทำเท่านั้นที่เราเองไม่ได้เดือดร้อน แต่ให้ทำเป็นปกติทุกวัน เราทานอาหารไปหรือว่าจะบริโภคใช้สอยสิ่งของต่างๆไปยังไงเนี่ย อย่าไปคิดว่ามันเกิดมาจากหนึ่งสมองสองมือที่เราทำงานถึงได้ตังค์มาอย่างเดียวนะ มันอาศัยบุญเก่าด้วย เห็นทุกวันเราก็ใช้บุญเก่า เราจึงควรต้องเติมบุญใหม่  

ให้ตั้งคตินี้ว่า เช้าใดยังไม่ได้ทำทาน เช้านั้นยังไม่กินข้าวก่อนจะกินบุญเก่าต้องสร้างบุญใหม่ก่อน หยอดกระปุก พอวันพระวันอาทิตย์ก็เอาไปวัดทำบุญ 2 ก่อนออกจากบ้าน ก็พนมมือหน้าหิ้งพระหรือมีพระห้อยคอ เอาพระอยู่ในมือก็ได้ แล้วก็อาราธนาศีลสั้นๆปาณาติปาตาเวรมณี วันนี้หัวเด็ดตีนขาดอย่างไรไม่ฆ่า แล้วให้ครบ 5 ข้อ ไปเนี่ยตั้งใจไว้นี่ วันนั้นยังไม่ออกจากบ้าน

แล้วพอเสร็จภารกิจกับงานกลับมาถึงบ้านอาบน้ำอาบท่า โปร่งละนั่งสมาธิก่อน สักครึ่งชั่วโมง ก็ยังดี คืนใดยังไม่ได้สวดมนต์นั่งสมาธิคืนนั้นยังไม่นอน ทำอย่างนี้แล้วก็บุญเราจะเกิดขึ้นทุกวันทุกวัน

เจริญพร`,
    category_ids: ['cat_001'],
    tags: ['การทำบุญ', 'เวรกรรม', 'ชีวิตประจำวัน', 'ให้ทาน', 'รักษาศีล', 'เจริญภาวนา'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_020',
    title: 'ไขข้อสงสัย #231 | ตอน ตอบทุกคำถาม',
    description: 'สรุปเนื้อหาจากไลฟ์ไขข้อสงสัย #231 ประเด็นโลกคู่ขนาน อนาคตของพระเทวทัต และเรื่องกิเลสของเทวดาบนสวรรค์',
    content: `สรุปเนื้อหาจากไลฟ์ "ไขข้อสงสัย #231 | ตอน ตอบทุกคำถาม" โดยพระครูปลัดสุวัฒนโพธิคุณ (พระมหาสมชาย ฐานวุฑโฒ) ประจำวันเสาร์ที่ 4 กรกฎาคม พ.ศ. 2569 มีสาระสำคัญจากการตอบคำถามธรรมะที่น่าสนใจดังนี้ครับ:

1. ข้อสงสัยเรื่องโลกคู่ขนาน สุญกัป และการเวียนว่ายตายเกิด
คำถาม: ในกัปที่เป็น "สุญกัป" (กัปที่ว่างเว้นจากพระพุทธเจ้า) เราจะสามารถย้ายไปเกิดในโลกคู่ขนานหรือทวีปอื่นที่มีพระพุทธเจ้าตรัสรู้เพื่อหลีกเลี่ยงความเสี่ยงในการทำบาปตกนรกได้หรือไม่?
คำตอบ/แก่นธรรม: ในท้ายรายการพิธีกรได้ช่วยสรุปแนวคิดนี้ว่า สำหรับผู้ที่มี "ศรัทธาตั้งมั่นในพระรัตนตรัย" หมั่นทำทาน รักษาศีล เจริญภาวนา และชอบฟังธรรมอยู่เป็นนิจ บุญกุศลเหล่านี้จะช่วยประคองจิตทำให้เราแคล้วคลาดจากการไปเกิดในสุญกัป หรือในที่ที่ไม่มีพระพุทธศาสนา โดยจะนำพาไปเกิดในยุคสมัยและดินแดนที่มีพระสัมมาสัมพุทธเจ้าอุบัติขึ้นเพื่อสร้างบารมีต่อไป

2. อนาคตภพภูมิของพระเทวทัต
คำถาม: ในอนาคตอีกนานไหมกว่าที่พระเทวทัตจะได้มาตรัสรู้เป็นพระพุทธเจ้าองค์ใหม่?
คำตอบ: พระเทวทัตจะไม่บทบาทอุบัติขึ้นเป็นพระสัมมาสัมพุทธเจ้า (ผู้รื้อขนสัตว์โลก) แต่ด้วยผลบุญที่เคยทำมาและถวายกระดูกคางเป็นพุทธบูชาก่อนถูกแผ่นดินสูบ ในอนาคตอีกยาวไกล (เป็นล้าน ๆ ล้านปี) ท่านจะพ้นจากอเวจีมหานรกและกลับมาตรัสรู้เป็น "พระปัจเจกพุทธเจ้า" (ผู้ตรัสรู้ธรรมด้วยตนเองแต่ไม่ได้ตั้งศาสนาสอนผู้อื่น)

3. กิเลสและสภาพจิตใจของเทวดาบนสวรรค์
คำถาม: บนสวรรค์มีเรื่องของการอิจฉา หรือกิเลสในลักษณะเดียวกับมนุษย์หรือไม่?
คำตอบ: แม้ว่าบนสวรรค์จะไม่ได้ใช้เงินในการจ่ายค่าสิ่งอำนวยความสะดวกต่าง ๆ (ทุกอย่างเกิดขึ้นด้วยกำลังบุญ) แต่เทวดาที่ยังมีกิเลสเบาบางก็ยังมีความรู้สึกเปรียบเทียบได้ เช่น เมื่อเห็นวิมานของเทวดาองค์อื่นใหญ่โต สวยงาม หรือมีรัศมีสว่างไสวมากกว่าตนเอง ก็อาจเกิดความรู้สึกน้อยอกน้อยใจ หรือมีความรู้สึกอิจฉาเกิดขึ้นได้เช่นกัน

(หมายเหตุ: ในไลฟ์นี้ยังมีการตอบคำถามชวนอมยิ้มและได้แง่คิดเกี่ยวกับสัตว์เลี้ยง เช่น เรื่องราวของน้องหมาและน้องแมว รวมถึงคำถามธรรมะชีวิตประจำวันอื่น ๆ ที่ผู้เขียนส่งเข้ามาผ่านทาง Zoom และช่องทางคอมเมนต์ต่าง ๆ อีกด้วย)

รับชมวิดีโอเต็มได้ที่
https://www.youtube.com/live/EcftiN9wMc8`,
    category_ids: ['cat_006'],
    tags: ['ตอบคำถามธรรมะ', 'ภพภูมิ', 'สวรรค์', 'พระเทวทัต', 'พระพุทธศาสนา'],
    source_type: 'video',
    source_url: 'https://www.youtube.com/live/EcftiN9wMc8?si=JUE3x6pEPtxAwCNI',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_019',
    title: 'อานิสงส์การให้กำลังใจ | ไขข้อสงสัย ep.450',
    description: 'สรุปเนื้อหาเรื่องอานิสงส์และผลบุญของการให้กำลังใจผู้อื่น พร้อมข้อคิดเปรียบเทียบการดำเนินชีวิตแบบเกื้อกูลกันในสังคม',
    content: `สรุปเนื้อหาอย่างละเอียดจากวิดีโอ "อานิสงส์การให้กำลังใจ | ไขข้อสงสัย ep.450" โดย พระมหาสมชาย ฐานวุฑโฒ

1. อานิสงส์และผลบุญของการให้กำลังใจผู้อื่น

คำถามต้นเรื่อง: เมื่อเราให้คำแนะนำ ให้กำลังใจ และช่วยประคับประคองผู้อื่นจนเขาสามารถฟันฝ่าอุปสรรคชีวิตและประสบความสำเร็จได้ บุญกุศลนี้จะส่งผลอย่างไรแก่ตัวเรา?

การส่งผลของกรรมและบุญกุศล:
ตราบใดที่เรายังเป็นธรรมดาชนและยังไม่ได้บรรลุเป็นพระอริยบุคคล ชีวิตของทุกคนย่อมมี "ยามขึ้นและยามลง"
ในยามที่ชีวิตเราเจอมรสุม จิตใจท้อแท้ หดหู่ หรือเผชิญวิกฤต อานิสงส์จากการที่เราเคยให้กำลังใจและช่วยเหลือผู้อื่น จะส่งผลให้มีคนเข้ามาคอย โอบอุ้ม ประคับประคอง ยื่นมือเข้าช่วยเหลือ และมอบกำลังใจ
พลังใจและการช่วยเหลือเหล่านั้นจะช่วยให้เราสามารถตั้งหลัก ฟื้นตัว และก้าวผ่านด่านอุปสรรคไปสู่ความสำเร็จได้อีกครั้ง

2. อุปมาอุปไมย: "การเดินลุยสวนกระแสน้ำ"

พระอาจารย์ได้ใช้อุปมาอุปไมยเปรียบเทียบการดำเนินชีวิตและการสร้างบุญบารมีในโลกปัจจุบันไว้อย่างเห็นภาพชัดเจน:
สายน้ำและกระแสกิเลส: การดำเนินชีวิตและการฝึกฝนตนเอง เปรียบเหมือน "คนกำลังเดินลุยสวนกระแสน้ำในลำธารที่ไหลเชี่ยว"
สายน้ำที่ไหลเชี่ยวนั้นเปรียบเสมือน "กระแสกิเลสและอุปสรรคในยุคปัจจุบัน" ที่มองไม่เห็นว่าใต้น้ำมีอะไรซ่อนอยู่บ้าง
ความเสี่ยงของการเดินคนเดียว: หากเราเลือกที่จะเดินตัวคนเดียว ยามที่ก้าวพลาดไปเหยียบก้อนหินหรือตกหลุมใต้น้ำ ก็มีโอกาสสูงที่จะเสียหลัก และถูกกระแสน้ำพัดพาไปจนเสียคนหรือล้มเหลว

พลังของการจับมือและช่วยเหลือกัน:
หากเราเกาะกลุ่ม จับมือกันไปเป็นสิบๆ คน จะไม่มีทางเสียหลักพร้อมกันทุกคน
เมื่อคนหนึ่งก้าวพลาด เสียหลัก คนที่เหลือก็พร้อมจะช่วยประคองไว้ เมื่อตั้งหลักได้แล้ว ในอนาคตคนที่เคยถูกประคองก็กลับมาช่วยประคองคนอื่นต่อ ผลัดกันช่วยกันประคองไปตลอดเส้นทาง

3. คติธรรมสรุปสำหรับการอยู่ร่วมกันในสังคม

สร้างสังคมที่น่าอยู่: สังคมมนุษย์จะมีความอบอุ่นและน่าอยู่ได้ หากทุกคนมีความเอื้อเฟื้อ มีน้ำใจ คอยประคับประคองและส่งมอบกำลังใจให้แก่กัน
ความสำเร็จร่วมกัน: การไม่ทอดทิ้งกันจะทำให้ทุกคนในสังคมสามารถก้าวผ่านอุปสรรค นำพาชีวิตไปสู่ความสุขและความสำเร็จร่วมกันอย่างยั่งยืน

รับชมวิดีโอเต็มได้ที่
https://youtu.be/xlSvndB52PQ`,
    category_ids: ['cat_001'],
    tags: ['ให้กำลังใจ', 'สังคม', 'อานิสงส์', 'การทำความดี', 'ข้อคิด'],
    source_type: 'video',
    source_url: 'https://youtu.be/xlSvndB52PQ?si=XGiL7T6agopmnfRW',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_018',
    title: 'ย้อนเหตุการณ์ไปครั้งพุทธกาล',
    description: 'พระอาจารย์ตอบคำถามเรื่องการใช้ฌานเพื่อย้อนดูเหตุการณ์ในครั้งพุทธกาล และเป้าหมายที่แท้จริงของการปฏิบัติธรรมเพื่อลดละกิเลส',
    content: `มีทางบ้านถามมาว่า ถ้าเราบรรลุฌานแล้วอยากย้อนเหตุการณ์ไปดูสภาพแวดล้อมในครั้งพุทธกาลได้ไหมครับ ต้องบรรลุฌานระดับไหนครับ

พระอาจารย์ : คุณโยมทำได้ แต่ว่าไม่ใช่เหมือนกับดูหนังหรอกนะ แล้วก็ไม่ใช่ว่าได้ทุกคนเท่ากันด้วยเนี่ย แม้ในครั้งพุทธกาลขนาดผู้ที่บรรลุฌานระดับที่เป็นพระอรหันต์แล้วนะกำลังของเรียกว่าทิพยจักขุมีตาทิพย์เนี่ยระลึกดูเหตุการณ์ในอดีตต่างๆได้เนี่ยยังไม่เท่ากันเลย ผู้ที่มีทิพยจักษุเลิศที่สุดเป็นเอตทัคคะด้านนี้ก็คือ พระอนุรุทธะ   

เห็นไหมเป็นพระอรหันต์ก็ยังไม่ใช่ว่าเท่ากันเลยเนี่ย ยิ่งถ้าเป็นทั่วๆไปยังไม่ได้บรรลุธรรมเป็นพระอริยบุคคลเพียงว่าได้ฌานสมาบัติบ้างเบื้องต้น ก็พอจะเห็นเหตุการณ์ในอดีตบ้าง แต่ว่าไม่ได้เหมือนกับการดูหนัง แล้วก็ไม่ใช่ว่าเป็นของที่ง่ายจริงๆ ไม่อยากให้สนใจเรื่องพวกนี้มากเกินไป เพราะว่าไม่ใช่วัตถุประสงค์หลักของการปฏิบัติธรรม เป้าหมายหลักของการปฏิบัติธรรมคือให้ใจสงบเพื่อ ลด ละเลิก กิเลสตรงนี้สำคัญที่สุด

เจริญพร`,
    category_ids: ['cat_003'],
    tags: ['ฌาน', 'สมาธิ', 'การปฏิบัติธรรม', 'ทิพยจักษุ', 'ลดกิเลส'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_017',
    title: 'ฝันเห็นสวรรค์จะไปสวรรค์ไหม | EP 2577',
    description: 'สรุปเนื้อหาเชิงลึกจากวิดีโอเรื่องคตินิมิตและการเดินทางของจิตก่อนละโลก ว่าการฝันเห็นสวรรค์เป็นเครื่องบ่งชี้ภพภูมิหลังความตายหรือไม่',
    content: `สรุปเนื้อหาเชิงลึกและรายละเอียดอย่างครอบคลุมจากวิดีโอ "ฝันเห็นสวรรค์จะไปสวรรค์ไหม | EP 2577" โดย พระมหาสมชาย ฐานวุฑโฒ (ThanavuddhoStoryOfficial)

ประเด็นคำถามจากทางบ้าน
มีผู้ถามปรึกษาทางรายการเกี่ยวกับเรื่องสภาวะจิตและความฝันว่า:
การที่เรา ฝันเห็นสวรรค์ เมื่อถึงเวลาละโลก (เสียชีวิต) ไปแล้ว จะมีโอกาสได้ไปเกิดบนสวรรค์จริงๆ หรือไม่?

สาระสำคัญและการอธิบายเชิงลึก

สภาวะ "คตินิมิต" กับการเดินทางของจิตก่อนละโลก
คตินิมิตบอกทาง: พระอาจารย์อธิบายว่า การที่จิตของเรานึกถึงหรือฝันเห็นสิ่งใด เปรียบเสมือน "คตินิมิต" (ภาพนิมิตที่ปรากฏขึ้นในจิตก่อนตาย) ที่มาส่งสัญญาณเตือนหรือบอกทิศทางภพภูมิที่จะไปเกิด
จิตเกาะเกี่ยวกับสิ่งใด ย่อมไปสู่สิ่งนั้น: การฝันเห็นสวรรค์สะท้อนว่า ปกติผู้ฝันมักเป็นคนใจบุญ ชอบทำความดี และจิตใจผูกพันอยู่กับกุศลธรรม เมื่อจิตผูกพันและนึกถึงสวรรค์อยู่เสมอ เวลาละโลกไปแล้วจึงมีโอกาสสูงมากที่จะได้ไปเกิดในสุคติโลกสวรรค์

กรณีศึกษา: จิตที่ผูกพันกับอกุศลหรือสิ่งของทางโลก
เพื่อให้อธิบายเห็นภาพชัดเจนขึ้นว่า "จิตเกาะสิ่งใด ย่อมไปเกิดในสภาวะนั้น" พระอาจารย์ได้ยกตัวอย่างเปรียบเทียบในทางตรงกันข้าม ทั้งเรื่องเล่าในอดีตและพุทธประวัติ ดังนี้:
คนโบราณที่ฝังขุมสมบัติ: ในอดีตที่ยังไม่มีธนาคาร คนสมัยก่อนมักนำสมบัติไปขุดหลุมฝังไว้ เมื่อใกล้ตาย จิตเกิดความห่วงหาและผูกพันกับทรัพย์สินสมบัติเหล่านั้นอย่างเหนียวแน่น ส่งผลให้เมื่อตายไปแล้ว ต้องไปเกิดเป็น "หนู" คอยขุดรูเฝ้าขุมสมบัติของตนเอง
พระภิกษุในสมัยพุทธกาลกับจีวรใหม่: มีพระภิกษุรูปหนึ่งได้รับผ้าจีวรที่พี่สาวนำไปกรอและทอมาให้ใหม่ รู้สึกชอบและผูกพันกับผ้าจีวรผืนนั้นมาก ตั้งใจว่าจะนำมาสวมใส่ แต่ปรากฏว่าท่านมรณภาพลงในคืนนั้นพอดี ด้วยจิตที่เกาะเกี่ยวและกังวลอยู่กับผ้าจีวร ก่อนตายจิตจึงดึงดูดให้ท่านไปเกิดเป็น "เล็น" (แมลงตัวเล็กๆ) อาศัยอยู่บนผ้าจีวรผืนนั้นทันที

แก่นธรรมและบทสรุปเพื่อการนำไปปรับใช้

ฝึกจิตให้เกาะเกี่ยวอยู่กับบุญกุศล: ความคิดและสภาวะจิตใจในชีวิตประจำวันเป็นสิ่งสำคัญมาก เพราะจิตที่คุ้นเคยกับการคิดดี ทำดี จะกลายเป็นพลังดึงดูดจิตใจไปสู่ภพภูมิที่ดี
ทำทาน รักษาศีล เจริญภาวนาอย่างสม่ำเสมอ: การนึกถึงสวรรค์เป็นเรื่องดี แต่ต้องควบคู่ไปกับการลงมือปฏิบัติสร้างบุญกุศลในชีวิตจริง ด้วยการให้ทาน ถือศีล และสั่งสมการภาวนา เพื่อให้แน่ใจว่าจะได้ไปเกิดในสุคติโลกสวรรค์อย่างแน่นอน

รับชมวิดีโอฉบับเต็มได้ที่
https://youtu.be/ypZRa1H8qgs`,
    category_ids: ['cat_006'],
    tags: ['คตินิมิต', 'สวรรค์', 'โลกหลังความตาย', 'จิตใจ', 'พระพุทธศาสนา'],
    source_type: 'video',
    source_url: 'https://youtu.be/ypZRa1H8qgs?si=n6OpB1HRabVO-DKq',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_016',
    title: 'วิธีไหนทดแทนการบวชพระได้ | EP 2572',
    description: 'สรุปเนื้อหาเชิงลึกจากวิดีโอเรื่องวิธีที่สตรีสามารถอุทิศตนเพื่อทดแทนการบวชพระได้ ผ่านการบวชใจ รักษาศีล 8 และตัวอย่างคุณยายอาจารย์มหารัตนอุบาสิกาจารย์ ขน นกยูง',
    content: `สรุปเนื้อหาเชิงลึกจากวิดีโอ "วิธีไหนทดแทนการบวชพระได้ | EP 2572" โดย พระมหาสมชาย ฐานวุฑโฒ

บทนำ: สตรีกับการอุทิศตนในพระพุทธศาสนา
ในสังคมพุทธศาสนิกชน ปัจจุบันมีสตรีจำนวนมากที่มีศรัทธาอันมั่นคง มีความรู้ความสามารถ และปรารถนาที่จะอุทิศชีวิตให้กับการทำนุบำรุงพระพุทธศาสนาอย่างจริงจัง แต่มักเกิดข้อสงสัยหรือความกังวลใจว่า ด้วยข้อจำกัดทางพระธรรมวินัยและสถานภาพในปัจจุบันที่ไม่เอื้อต่อการอุปสมบทเป็นภิกษุณี สตรีจะสามารถกระทำสิ่งใดเพื่อทดแทนการบวชเป็นพระภิกษุของฝ่ายชายได้บ้าง?

พระมหาสมชาย ฐานวุฑโฒ ได้เมตตาไขข้อสงสัยนี้ไว้ว่า "เพศหญิงก็สามารถอุทิศตนเพื่อพระพุทธศาสนาและสั่งสมบุญบารมีได้ยิ่งใหญ่ไม่แพ้ฝ่ายชาย" โดยจุดสำคัญไม่ได้อยู่ที่เครื่องแต่งกายภายนอก แต่อยู่ที่การ "บวชใจ" และการสั่งสมคุณงามความดี

๑. หัวใจของการบวช: การประพฤติพรหมจรรย์ด้วย "ศีล ๘"

แก่นแท้ของการบวชคือการบวชใจ:
การบวชในพระพุทธศาสนามีจุดมุ่งหมายสูงสุดคือการสลัดออกจากกาม การขัดเกลากิเลส และการฝึกฝนตนเอง
สำหรับสตรี การถือปฏิบัติ "ศีล ๘" (อัฏฐศีล) ถือเป็นการประพฤติพรหมจรรย์ชั้นสูงที่มีอานิสงส์มหาศาล เพราะเป็นการละเว้นจากการเสพกามารมณ์ การเว้นจากการบริโภคอาหารยามวิกาล (หลังเที่ยงวัน) และการงดเว้นจากการตกแต่งร่างกายด้วยเครื่องหอมและของสวยงาม

ความเท่าเทียมกันของข้อศีล:
ในทางพระธรรมวินัย คุณภาพและเนื้อหาของศีลระหว่าง "แม่ชีที่โกนหัวสวมชุดขาว" กับ "อุบาสิกาที่รักษาศีล ๘ ในชุดสุภาพ" นั้น มีสภาวะแห่งศีลที่เท่ากันทุกประการ
ตัวศีล ๘ เป็นตัวจำกัดกิเลสและสร้างความบริสุทธิ์ให้แก่จิตใจ โดยไม่ขึ้นอยู่กับว่าบุคคลนั้นจะโกนผมหรือไม่ก็ตาม

๒. รูปแบบการอุทิศตนให้เหมาะสมกับภารกิจชีวิต

พระอาจารย์ได้อธิบายถึงแนวทางการแต่งกายและการดำเนินชีวิตของสตรีที่ต้องการอุทิศตนให้พระศาสนา โดยแบ่งออกเป็น ๒ รูปแบบตามความสะดวกและลักษณะงาน:

รูปแบบที่ ๑: การโกนหัว นุ่งขาวห่มขาว (บวชเป็นแม่ชี)
ลักษณะ: โกนศีรษะ สวมใส่เสื้อผ้าสีขาวบริสุทธิ์ พำนักอยู่ในวัดหรือศาสนสถาน
ความเหมาะสม: เหมาะสำหรับผู้ที่หมดภาระทางโลก ละเว้นจากการงานภายนอก และต้องการปักหลักปฏิบัติธรรม สวดมนต์ นั่งสมาธิ รวมถึงช่วยงานบริหารจัดการภายในวัดอย่างเต็มตัว
ประโยชน์: การโกนศีรษะช่วยสลัดความกังวลเรื่องทรงผม การแต่งตัว และช่วยสร้างความสำรวมระวังทางกายและใจได้ง่ายขึ้น

รูปแบบที่ ๒: อุบาสิการักษาศีล ๘ (แม่ชีสไตล์คล่องตัว)
ลักษณะ: ไม่โกนศีรษะ สวมใส่เสื้อผ้าสุภาพเรียบ ร้อย ไม่แต่งหน้า ทาปาก หรือประดับตกแต่งร่างกาย
ความเหมาะสม: เหมาะสำหรับผู้ที่ยังต้องออกไปประสานงาน ติดต่อธุรกิจ ติดต่อหน่วยงานราชการ หรือทำภารกิจเผยแผ่พระพุทธศาสนานอกวัด
ประโยชน์: มีความสะดวกและคล่องตัวในการปฏิสัมพันธ์กับสังคมทางโลกมากกว่า โดยที่จิตใจยังคงความบริสุทธิ์และรักษาศีล ๘ ได้อย่างสมบูรณ์แบบ

๓. บทบาทอันยิ่งใหญ่ของสตรี: กรณีศึกษาคุณยายอาจารย์มหารัตนอุบาสิกาจารย์ ขน นกยูง

เพื่อชี้ให้เห็นว่าสตรีสามารถสร้างคุณประโยชน์ต่อพระพุทธศาสนาได้อย่างมหาศาลและเป็นรูปธรรม พระอาจารย์ได้ยกตัวอย่าง "คุณยายอาจารย์มหารัตนอุบาสิกาจารย์ ขน นกยูง" ผู้สร้างวัดพระธรรมกาย:
คุณยายอาจารย์เริ่มต้นจากการเป็นเพียงอุบาสิกาผู้ถือศีลปฏิบัติธรรมและสืบทอดวิชชาธรรมกาย
แม้ท่านจะเป็นเพียงแม่ชี ไม่ได้อุปสมบทเป็นพระภิกษุ แต่ด้วยจิตใจที่บวชอย่างแท้จริง มุ่งมั่นในการนั่งสมาธิภาวนา และมีความตั้งใจอันบริสุทธิ์
ท่านสามารถเป็นผู้นำในการรวบรวมศิษยานุศิษย์ สร้างวัดเพื่อรองรับพระภิกษุสงฆ์ให้ได้ศึกษานักธรรมและปฏิบัติธรรม จนกระทั่งขยายกลายเป็นวัดใหญ่และสร้างประโยชน์แก่พระพุทธศาสนาทั้งในและต่างประเทศในปัจจุบัน

บทสรุป

การทดแทนการบวชพระของผู้หญิง จึงสามารถทำได้ด้วยการ "บวชกายและบวชใจ" ผ่านการรักษาศีล ๘ อย่างเคร่งครัด หมั่นสวดมนต์ นั่งสมาธิ เจริญภาวนา และนำความรู้ความสามารถของตนเองมาช่วยงานเผยแผ่พระพุทธศาสนาอย่างเต็มกำลัง ซึ่งจะส่งผลให้ได้รับอานิสงส์แห่งบุญกุศลอันยิ่งใหญ่เช่นเดียวกับการอุปสมบทของฝ่ายชาย

รับชมวิดีโอเต็มได้ที่
https://youtu.be/ij8uVB5ctQc`,
    category_ids: ['cat_006'],
    tags: ['การบวช', 'ศีล 8', 'แม่ชี', 'พระพุทธศาสนา', 'ผู้หญิงกับการบวช'],
    source_type: 'video',
    source_url: 'https://youtu.be/ij8uVB5ctQc?si=fRtUAKgBsxueNJ0f',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_015',
    title: 'ชาวอเมริกันนับสิบล้านคนนั่งสมาธิทุกวัน (ข้อมูลจากนิตยสาร ไทม์)',
    description: 'นิตยสาร ไทม์ เผยสถิติชาวอเมริกันนับสิบล้านคนนั่งสมาธิอย่างสม่ำเสมอ พร้อมประโยชน์ทางการแพทย์และสุขภาพที่น่าทึ่งจากการทำสมาธิ',
    content: `นิตยสาร ไทม์ ขึ้นหน้าปกไว้อย่างน่าทึ่งว่า

“นักวิทยาศาสตร์” ก็ “ศึกษา ค้นคว้า วิจัย เรื่องสมาธิ”

“แพทย์” ก็ “เชียร์ให้นั่งสมาธิ”

ชาวอเมริกัน “นับสิบล้านคน” ก็ “นั่งสมาธิ” “ทุกวัน”

ถามว่า “นั่งไปทำไม? ” ขอตอบว่า... “ก็มันดีน่ะสิ”

ในสหรัฐอเมริกา คนอเมริกันสิบล้านคนนั่งสมาธิอย่างสม่ำเสมอ เป็นสองเท่าของสิบปีก่อน

สถานที่หลายแห่งในสหรัฐอเมริกา เช่น ที่นิวยอร์ก เปลี่ยนเป็นที่นั่งสมาธิหลายแห่ง จนคนเรียกแถบนั้นว่าเป็นแถบของชาวพุทธ

นักเรียนนั่งสมาธิก่อนเข้าห้องเรียนทุกเช้า นักกฎหมาย นักธุรกิจ คนทำงานสาขาอาชีพต่างๆ นั่งสมาธิตามที่หน่วยงานของตนจัดให้นั่งอย่างสม่ำเสมอ

ดาราภาพยนตร์ นักการเมือง นักเขียนต่างก็นั่งสมาธิ แม้แต่นักโทษในคุกก็มีห้องนั่งสมาธิ คนที่ไม่เชื่อเรื่องสมาธิกลายเป็นกลุ่มน้อยในสหรัฐอเมริกาไปเสียแล้ว

การนั่งสมาธิทำให้ร่างกายมีสภาวะเหมือนก่อนจะหลับ แต่ไม่ได้หลับ มีสติรู้ตัวอยู่เสมอ และทำให้จิตใจสดชื่นแจ่มใส

สมาธิยังช่วยขจัดความขัดแย้งในจิตใจ ทำให้ใจอยู่นิ่งได้ ท่ามกลางความสับสน สามารถเข้าใจเรื่องราวต่างๆ ได้ดีขึ้น ยอมรับมันด้วยความสงบ และมีความสุขมากขึ้น

สมาธิยังช่วยทำให้ร่างกายสร้างภูมิคุ้มกันโรคได้มากขึ้น สามารถรักษาโรคร้ายแรงเรื้อรัง เช่น โรคหัวใจ เอดส์ มะเร็ง ความดันโลหิตสูง โรคใจสั่น คนไข้โรคมะเร็งและเจ็บปวดเรื้อรัง ๑๔,๐๐๐ คน โดยไม่ต้องกินยาแก้ปวด สมาธิยังรักษาจิตใจที่ปั่นป่วน กดดัน สมาธิสั้น วุ่นวาย ไม่อยู่นิ่งด้วย

นอกจากนี้พลังของสมาธิยังสามารถรักษาคนไข้ที่เป็นโรคผิวหนังอักเสบร้อนแดง ให้มีผิวใสขึ้นเป็น ๔ เท่าของผู้ที่ไม่ได้นั่งสมาธิ

อย่าเชย! เพราะคุณไม่ได้นั่งสมาธิ

ที่มา : นิตยสาร ไทม์ ฉบับวันที่ ๔ สิงหาคม พ.ศ.๒๕๔๖

ขอขอบคุณ หนังสือ ลองดู
สงวนลิขสิทธิ์ตาม พ.ร.บ.ลิขสิทธิ์ พ.ศ. ๒๕๓๗
ห้ามนำไปใช้ประโยชน์ทางการค้าหรือหากำไร ผู้ฝ่าฝืนมีความผิดและต้องรับโทษตามกฎหมาย`,
    category_ids: ['cat_003'],
    tags: ['สมาธิ', 'สุขภาพ', 'นิตยสารไทม์', 'วิทยาศาสตร์', 'การแพทย์'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_014',
    title: 'ทำไมบางคน เพลิดเพลินกับการนินทา',
    description: 'พระอาจารย์ตอบคำถามเรื่องเหตุผลที่คนบางคนชอบนินทา และข้อคิดในการพัฒนาตนเองแทนการพูดถึงผู้อื่นในแง่ร้าย',
    content: `มีทางบ้านถามมาว่า เพราะเหตุใดคนบางคน จึงมีความเพลิดเพลินกับการนินทา และพูดคุยในเรื่องราวไร้สาระครับ

พระอาจารย์ : คุณโยม คนเราเนี่ยต้องการความภูมิใจในตัวเอง รู้สึกว่าตัวเองเนี่ยเด่นดีแล้ว บางทีก็แถมว่าเหนือกว่าคนอื่นเขาด้วยเนี่ย คราวนี้จะรู้สึกว่าตัวเองเหนือคนอื่นเขานะมันมี 2 วิธี   

หนึ่งก็คือว่าตั้งใจฝึกตัวเอง พัฒนาตัวเองจริงจัง จนตัวเองเด่นขึ้น เด่นขึ้น เด่นขึ้นเหมือนต้นไม้มาด้วยกันเลยนะ จะเด่นกว่าเขาก็ต้องให้โตขึ้นสูงขึ้นเนี่ย  

แต่อีกวิธีนึงคือว่าตัวเองไม่ได้พัฒนาตัวเองหรอก แต่ว่าไปตัดต้นไม้อื่นให้มันเตี้ยลง ตัวเองก็จะเด่นกว่าเขา คือไปกดคนอื่นให้ลดลงมา ให้ต่ำลงมา เนี่ยก็รู้สึกภูมิใจตัวเองเด่นของเขาโดยการไปนินทาเขา ไปพูดเรื่องสัพเพเหระไร้สาระเนี่ย ซึ่งอันนี้เนี่ยไม่ได้ก่อให้เกิดความเจริญงอกงามอะไรกับตัวเองขึ้นมาเลย   

เราเองอย่าไปนินทาใคร พูดถึงใครในแง่ร้าย ไม่เอา ไม่เกิดประโยชน์ ถือเป็นคำพูดที่ว่าไร้สาระ คำพูดเพ้อเจ้อเนี่ย แถมให้เป็นเรื่องไม่จริง ก็เป็นเรื่องโกหกอีกเนี่ย ผิดศีลอีกเนี่ย เราไม่ทำ ให้พูดเฉพาะในสิ่งที่เป็นประโยชน์ แล้วก็ด้วยจิตเมตตาต่อทุกๆคนดีกว่า ใช้เวลาเราเองให้คุ้มค่า

เจริญพร`,
    category_ids: ['cat_005'],
    tags: ['การนินทา', 'จิตใจ', 'คำพูด', 'การพัฒนาตนเอง'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_013',
    title: 'คนขวัญอ่อนกับสมาธิ',
    description: 'พระอาจารย์แนะนำวิธีสำหรับคนขวัญอ่อน ตกใจง่าย ควรทำสมาธิอย่างไรเพื่อเสริมสร้างความหนักแน่นให้กับจิตใจ',
    content: `โยม : พระอาจารย์คะ คนขวัญอ่อนตกใจง่าย ควรนั่งสมาธิไหมคะ

พระอาจารย์ : ควรเลยคุณโยม ยิ่งขวัญอ่อนตกใจง่าย เอ้าฟ้าร้องหน่อยก็ว้าย อย่างนี้ให้เราสวดมนต์นั่งสมาธิเยอะๆ แล้วใจเราจะหนักแน่นนิ่งมากขึ้น ไม่กระเพื่อมง่าย ให้ทำอย่างสม่ำเสมอเลย แล้วไม่เฉพาะช่วงนั่งแม้แต่ว่าเราอยู่ในอิริยาบถอื่น เช่นกำลังทานข้าว แล้วก็เอาใจตรึก ตรึก ตรึก ที่กลางท้อง ที่ศูนย์กลางกาย หรือว่ากำลังเดินอยู่ กำลังอาบน้ำ ล้างหน้า แปรงฟันแล้ว ก็ตรึกใจเราอยู่เรื่อยๆ ถ้าอย่างนี้แล้วก็เราจะเป็นคนที่ใจอยู่กับเนื้อกับตัว แล้วก็ขวัญกำลังใจเราก็จะดีไม่ตกใจง่าย

เจริญพร`,
    category_ids: ['cat_003'],
    tags: ['สมาธิ', 'ขวัญอ่อน', 'สติ', 'การปฏิบัติธรรม'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_012',
    title: 'สาธุได้บุญเท่าคนทำไหม | EP 2566',
    description: 'สรุปรายละเอียดเนื้อหาอย่างถี่ถ้วนและประเด็นธรรมะเตือนใจจากคลิปเรื่องการอนุโมทนาบุญ ว่าจะได้อานิสงส์บุญเท่ากันหรือแตกต่างกับผู้ที่ลงมือทำอย่างไร',
    content: `สรุปรายละเอียดเนื้อหาอย่างถี่ถ้วนและประเด็นธรรมะเตือนใจจากคลิป "สาธุได้บุญเท่าคนทำไหม | EP 2566" โดย พระมหาสมชาย ฐานวุฑโฒ (ThanavuddhoStoryOfficial):

1. ประเด็นคำถามจากทางบ้าน
มีผู้ถามคำถามธรรมะเข้ามาว่า:
เมื่อเห็นผู้อื่นทำบุญแล้วเรายกมือไหว้กล่าว "สาธุ" หรือแสดงความยินดีร่วมอนุโมทนาบุญ โดยที่เราไม่ได้ลงมือทำหรือสละทรัพย์เองนั้น จะได้อานิสงส์บุญเท่ากันหรือแตกต่างกับผู้ที่ลงมือทำอย่างไร?

2. การเปรียบเทียบผลแห่งบุญระหว่าง "ผู้ทำ" กับ "ผู้อนุโมทนา"

ผู้ลงมือทำบุญเอง:
จะได้รับปริมาณบุญ มากกว่า เนื่องจากเป็นผู้ลงมือเสียสละทั้งทรัพย์สิน กำลังกาย หรือกำลังสติปัญญา เพื่อก่อให้เกิดความดีงามนั้นขึ้นมาโดยตรง

ผู้ร่วมอนุโมทนาบุญ (กล่าวสาธุ):
ก็ได้รับบุญด้วยเช่นกัน ซึ่งในทางพระพุทธศาสนาจัดอยู่ในหลัก "ปัตตานุโมทนามัย" หรือบุญที่สำเร็จได้ด้วยการยินดีในความดีของผู้อื่น (หนึ่งในบุญกิริยาวัตถุ 10 ประการ)

3. กลไกการเกิดบุญจากการอนุโมทนา

คุณภาพของจิตใจเป็นตัวตัดสิน:
การที่ผู้อนุโมทนาจะได้รับบุญมากหรือน้อยนั้น ขึ้นอยู่กับ "ความเลื่อมใสและความผ่องใสของใจ" เป็นสำคัญ
หากเห็นผู้อื่นทำความดีแล้วเกิดความรู้สึกปลื้มปีติ ยินดีจากใจจริงว่า "ดีจังเลยที่เขาได้ทำความดี" สภาวะจิตใจที่ผ่องใสและไร้กิเลสอิจฉามิษยาในขณะนั้นเอง คือตัวสร้างบุญกุศล

การเสริมสร้างกำลังใจให้สังคม:
การกราบสาธุหรือแสดงการอนุโมทนายังมีคุณค่าในแง่ของสังคม เพราะเป็นการ ส่งต่อกำลังใจ ให้แก่ผู้กระทำความดี ทำให้เขามีกำลังใจที่จะสร้างสรรค์คุณงามความดียิ่งๆ ขึ้นไป

4. คำแนะนำและข้อคิดเตือนใจ

อย่ารอแค่อนุโมทนาเพียงอย่างเดียว:
แม้การกล่าวสาธุจะได้บุญ แต่พระอาจารย์เมตตานักเทศน์เตือนว่า หากมีโอกาสและมีความพร้อม ควรลงมือทำบุญด้วยตนเองด้วย
การได้ลงมือทำเองจะทำให้จิตใจเกิดความปลื้มปีติอย่างลึกซึ้ง (เจตนาผ่องใสทั้งก่อนทำ ขณะทำ และหลังทำ) ซึ่งจะส่งผลให้ได้รับอานิสงส์แห่งบุญที่บริบูรณ์และยิ่งใหญ่ยิ่งขึ้นไปอีก`,
    category_ids: ['cat_006'],
    tags: ['ทำบุญ', 'อนุโมทนา', 'สาธุ', 'ความดี', 'พระพุทธศาสนา'],
    source_type: 'video',
    source_url: 'https://youtu.be/A8KQtIzAsx4?si=oGUkV2gqPYZS5UIV',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_011',
    title: 'แนวทางการใช้ทรัพย์',
    description: 'พระพุทธเจ้าได้ให้โอวาทเกี่ยวกับแนวทางการใช้ทรัพย์ 4 อย่าง สำหรับผู้ที่อยู่ในวัยทำงาน เพื่อความมั่นคงด้านการเงิน',
    content: `มีทางบ้านถามมาว่า : อยากทราบว่า พระพุทธเจ้าได้ให้โอวาท เกี่ยวกับแนวทางการใช้ทรัพย์ ไปทางไหนบ้างครับ เพราะผมกำลังเข้าสู่วัยทำงานแล้ว จึงอยากได้แนวทางการใช้เงินครับ

พระอาจารย์ตอบ : คุณโยม พระพุทธเจ้าพระองค์แบ่งไว้ 4 อย่าง

1.ใช้เพื่อการจับจ่ายใช้สอย กินอยู่ของตัวเรา กับครอบครัวเรา

2.สงเคราะห์ญาติ ญาติมิตรเรา ส่งตังค์ให้คุณพ่อคุณแม่ใช้บ้างหรือเปล่า หรือว่าญาติพี่น้อง ถ้าเราพอมีกำลัง อะไรพอช่วยได้ก็ช่วยเหลือเกื้อกูลกัน ตามเหมาะสม

3.แบ่งทำบุญบ้าง

4.อย่าใช้ทั้งหมด หมดไปเลยนะ ต้องมีเงินเก็บด้วย เพื่อความมั่นคงในอนาคต จะไปลงทุนอะไรอย่างไร ก็ต้องวางแผนไว้ให้ดี ระยะยาว

4 อย่างนี้ ถ้าหาตามนี้แล้ว ชีวิตของเราจะมีความมั่นคงด้านการเงิน

เจริญพร.`,
    category_ids: ['cat_001'],
    tags: ['การใช้เงิน', 'การเงิน', 'การดำเนินชีวิต', 'ความมั่นคง'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_010',
    title: 'เมื่อรู้สึกชีวิตด้อยค่า',
    description: 'วิธีรับมือและช่วยเหลือผู้ที่รู้สึกว่าตนเองไร้ค่า ด้วยการปรับเปลี่ยนสิ่งแวดล้อม หากิจกรรมที่มีประโยชน์ และการปฏิบัติธรรม',
    content: `หากมีใครเริ่มรู้สึกว่าตนเองไร้ค่า หรือไม่สามารถช่วยเหลือตนเองได้ คนรอบข้างสามารถยื่นมือเข้าไปช่วยได้ด้วยการพยายามเปลี่ยนสิ่งแวดล้อม อย่าให้เขาจมจ่อมอยู่อย่างนั้น

คนที่คิดว่าตนเองไร้ค่า ก็เพราะติดอยู่กับการเปรียบตนเองกับคุณค่าที่สังคมชื่นชมยกย่อง รู้สึกว่าตนเองสู้ไม่ได้จึงถอยหนี ปล่อยไว้นับวันยิ่งจะจมลงเรื่อยๆ เพราะตามสังคมไม่ทัน แล้วยิ่งรู้สึกว่าตนเองตกต่ำลงเรื่อยๆ ความรู้สึกทางลบพอกพูนมากขึ้นๆ นานวันยิ่งแก้ไขยาก

ให้พยายามแก้ไขด้วยการไม่ปล่อยตนเองขลุกอยู่แต่ในห้อง ไม่พบปะพูดคุยกับใคร มัวแต่ดูซีรีย์ เล่นเกมทั้งวันทั้งคืน อย่างนี้ยิ่งจมลงไปเรื่อยๆ แล้วแยกตัวออกจากสังคมอย่าถาวรในที่สุด

การที่เราหมกมุ่นทำสิ่งหนึ่งสิ่งใดตลอดทั้งวันทั้งคืน เช่น อ่านการ์ตูน ดูซีรีย์ หรือเล่นเกม ยิ่งจะทำให้ความรู้สึกด้อยค่าที่แฝงอยู่ภายในใจลึกๆ นั้นเพิ่มพูนขึ้นเรื่อยๆ เพราะเราเอาความเพลิดเพลินเฉพาะหน้ามาบังหน้าไว้เท่านั้น แต่ถ้าเราเปิดโอกาสให้ตนเองได้ออกไปทำอะไรที่สร้างสรรค์และเกิดประโยชน์ ความรู้สึกภายในใจเราก็จะเริ่มคลาย แล้วเปลี่ยนไปในทางที่ดีขึ้น

วิธีแก้ไขเบื้องต้นคือให้พยายามเคลื่อนไหวร่างกาย ให้ร่างกายได้ทำงาน ให้เหงื่อออก โดยทำสิ่งที่เป็นประโยชน์ง่ายๆ เช่น ทำงานบ้าน ปลูกต้นไม้พืชผักสวนครัว ล้างรถ ดูแลสัตว์เลี้ยง ทำอาหาร เพื่อให้รู้สึกว่าตนเองมีประโยชน์ ได้ออกกำลัง ไม่รู้สึกว่าวันหนึ่งๆ ผ่านไปอย่างไร้ค่า

อีกหนึ่งกิจกรรมที่ดีคือการปลูกต้นไม้ เพราะเราจะการได้เห็นการเจริญเติบโตของชีวิต วันนี้แตกใบ อีก 2-3 วัน ใบเล็กๆ ค่อยๆ ใหญ่ขึ้น ไม่นานก็มีใบใหม่งอกขึ้นมา การเจริญเติบโตเหล่านี้จะสร้างพลังบวกให้เกิดขึ้นภายในใจเรา ความรู้สึกดีๆ จะค่อยเพิ่มขึ้น ซึ่งสิ่งแวดล้อมในบ้านเราก็เอื้อต่อกิจกรรมนี้เป็นอย่างมาก

หากเป็นผู้ชายให้หาโอกาสมาบวช บวชช่วงฤดูร้อนก็ได้ บวชเข้าพรรษาก็ได้ เพราะในวัดมีการอบรม มีพระอาจารย์ดูแลกิจวัตรกิจกรรมดี ไม่ใช่บวชไปแล้วปล่อยตนเองไปเรื่อยๆ แต่ว่ามีการอบรมที่ดีเป็นหมู่คณะ พอได้อยู่ในสิ่งแวดล้อมใหม่ๆ ที่มีค่านิยมใหม่ๆ สภาวะภายในจิตใจก็ดีขึ้น

บวชเป็นพระไม่ต้องมาคอยแข่งขันกันอวดความร่ำรวย ไม่มีเครื่องประดับ มีเพียงจีวร ได้อยู่ในค่านิยมแบบใหม่ แล้วชีวิตก็จะได้ปรับเปลี่ยนไปในทางที่ดี พอได้สวดมนต์ นั่งสมาธิ ทำกิจของสงฆ์ แล้วศึกษาธรรมะต่างๆ เราก็จะค่อยๆ ได้ตระหนักในคุณค่าตนเองมากขึ้น

ระหว่างปฏิบัติธรรมใจก็นิ่ง ใจก็ใส ใจเข้มแข็ง มีกำลังใจ ถือเป็นการฝึกใจโดยตรง เป็นการให้มุมมองใหม่กับชีวิตตนเองพอให้มีความพร้อมออกไปผจญสังคม

ส่วนผู้หญิง แม้ไม่ได้บวชก็ไปรักษาศีล 8 ปฏิบัติธรรม เพื่อได้เปลี่ยนสิ่งแวดล้อมอย่างนี้บ้างก็ยิ่งดี จะได้มีพลังมากขึ้น พร้อมที่จะออกไปสู้ต่อ

เจริญพร
พระมหาสมชาย ฐานวุฑฺโฒ`,
    category_ids: ['cat_005'],
    tags: ['คุณค่าในตัวเอง', 'กำลังใจ', 'ซึมเศร้า', 'การปฏิบัติธรรม'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_009',
    title: 'เมื่อชีวิตเป็นทุกข์',
    description: 'ในเมื่อชีวิตเป็นทุกข์ จะทำใจให้เบิกบานตามคําสอนของพระพุทธเจ้าได้อย่างไร พระอาจารย์มีคำตอบและหลักปฏิบัติ',
    content: `ในเมื่อชีวิตเป็นทุกข์ จะทำใจให้เบิกบานตามคําสอนของพระพุทธเจ้าได้อย่างไร

พระอาจารย์ : ชีวิตเรามีความทุกข์อยู่ไม่ว่าด้วยความแก่ เจ็บ ตาย หรือการเจอสิ่งที่ไม่ชอบการพลัดพรากจากของที่ชอบ อยากได้อะไรแล้วไม่ได้ แต่เราสามารถทำใจให้เบิกบานได้ โดยเราปรับในส่วนที่เราทำได้

เช่น เมื่อรู้ว่าเจอของที่ไม่ชอบแล้วเกิดทุกข์ เราก็ปรับที่ใจของเรา ทุกข์มาก ทุกข์น้อยอยู่ที่ใจของเรา ด้วยการปฏิบัติธรรมอยู่ในบุญให้ทาน รักษาศีล สวดมนต์เจริญสมาธิภาวนา เมื่อบุญหล่อเลี้ยงใจทําให้ชุ่มชื่นเบิกบาน

โดยเฉลี่ยเรายังมีความทุกข์อยู่ แต่ดีกว่าคนทั่วไป ตอนที่เรามีความสุขเบิกบาน ความจริงยังมีความทุกข์ปนอยู่ ยังไม่สุขแท้ 100% จะให้สุขได้ 100% เมื่อเราปฏิบัติธรรมจนใจหยุดนิ่ง จะเจอความสุขที่ประณีตและเหนือกว่าสุขอื่นที่เราเจอมาทั้งหมด

ที่พระสัมมาสัมพุทธเจ้าตรัสว่า นัตถิ สันติ ปะรัง สุขัง "สุขอื่นยิ่งกว่าใจหยุดใจนิ่งไม่มี" เพราะฉะนั้นขณะที่เรายังไม่ถึงจุดนั้น

ขอให้เราปรับใจเราเองให้คลายจากความยึดติดยึดมั่นถือมั่น แล้วอยู่ในบุญกุศล เราก็จะมีความสุขความเบิกบานได้ในระดับหนึ่ง

เจริญพร`,
    category_ids: ['cat_005'],
    tags: ['ความทุกข์', 'ความสุข', 'สมาธิ', 'การทำใจ'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_008',
    title: 'พัฒนาตัวเองให้ฉลาดขึ้น',
    description: 'พระอาจารย์ตอบคำถามเรื่องวิธีการพัฒนาตัวเองให้ฉลาดขึ้น ทั้งทางหยาบ (การศึกษาเรียนรู้) และทางละเอียด (การปฏิบัติธรรม)',
    content: `โยม : พระอาจารย์คะ อยากพัฒนาตัวเองให้ฉลาดขึ้นมากกว่าที่เป็นอยู่ตอนนี้ มีวิธีการอย่างไรคะ

พระอาจารย์ : เอาย่อๆ 2 อย่าง ทางหยาบเนี่ย ให้เป็นคนที่รักการศึกษาการพัฒนาตัวเอง คืออย่าคิดว่าเรียนหนังสือเสร็จแล้วก็คือความรู้จบอยู่แค่นั้น แล้วก็หยุดการเรียนรู้อันนี้เนี่ย โลกปัจจุบันเทคโนโลยีวิทยาการมันเปลี่ยนเร็วมากไง เราจะอยู่กับที่ไม่ได้เพราะฉะนั้นให้เป็นคนที่รักในการศึกษาเรียนรู้พัฒนาตัวเองอยู่เสมอในเรื่องต่างๆ ทั้งแนวกว้าง คือรู้ความเป็นไปของโลก ทั้งแนวลึก คือถ้างานที่ทำแล้วเราศึกษาให้ลึกลงไปเลยให้มากเป็นพิเศษ แต่รู้เฉพาะงานเราอย่างเดียวตอนนี้ไม่พอ

เราต้องรู้แนวกว้างด้วยมันจะได้มองออกว่าจะเอาความรู้วิทยาการในสาขาวิชาเราไปสัมพันธ์กับวิชาการในสาขาอื่นๆได้อย่างไรมันจะมองเห็นการใช้ประโยชน์ได้ชัดขึ้น อันนี้ทางอย่างเราต้องฝึกนิสัยอย่างนี้ แม้กระทั่งการเรียนภาษาเทคโนโลยีคอมพิวเตอร์ AI ต่างๆเนี่ย การพิมพ์ดีดการใช้โปรแกรมทางคอมพิวเตอร์ต่างๆ เราพยายามฝึกเข้าไปให้มีความรู้เพิ่มเติม เพิ่มพูนขึ้น 

อีกทางหนึ่งทางละเอียดคือให้ตั้งใจนั่งสมาธิปฏิบัติธรรมอย่างสม่ำเสมอ ถ้าอย่างนี้แล้วเราก็เราจะเป็นคนที่มีความคิดความอ่านก้าวหน้าทันโลกแล้วก็ทันทั้งหยาบทั้งละเอียดจะประกอบเสริมการให้เราเองเป็นคนที่ฉลาดแล้วประสบความสำเร็จในชีวิต

เจริญพร`,
    category_ids: ['cat_002'],
    tags: ['การพัฒนาตนเอง', 'สมาธิ', 'การเรียนรู้', 'ความสำเร็จ'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_007',
    title: 'มองตัวเรา เข้าใจคนอื่น',
    description: 'คุณสมบัติของผู้ที่เชื่อมั่นในตนเองที่แท้จริง (Self-Esteem) ประกอบด้วย ความตระหนักในคุณค่าตนเอง ความเชื่อมั่นในความสามารถ และภาพแห่งตน',
    content: `ก่อนที่จะเข้าใจ “การมองตนเอง” เราลองมาดูคุณสมบัติ ของความเชื่อมั่นในตนเองที่แท้จริงก่อนว่า คุณสมบัติของผู้ที่เชื่อมั่นในตนเองที่แท้จริงนั้นเป็นอย่างไร ซึ่งในแง่ของ Self - Esteem มี 3 องค์ประกอบด้วยกันคือ

(1) ความตระหนักในคุณค่าของตนเอง เรียกว่า Self - Respect
(2) ความเชื่อมั่นในความสามารถของตนเอง เรียกว่า Self - Efficacy
(3) ภาพแห่งตน เรียกว่า Self - Image

ความตระหนักในคุณค่าของตนเอง (Self - Respect)
คือ ความตระหนักในศักดิ์ศรีของตนเองว่า ตนมีคุณค่าเท่าเทียมกับผู้อื่น มีสิทธิ์ มีโอกาสที่จะประสบความสาเร็จและได้รับความสุข ได้รับความสมหวังเหมือนกับคนอื่นๆ ในสังคม และรู้สึกว่าชีวิตของตนเองมีคุณค่า ควรจะปกป้องรักษาชีวิตของเรา ดูแลชีวิตของเราให้ดี และชีวิตของเราสมควรที่จะอยู่ร่วมกับผู้อื่นได้อย่างมีความสุข

ความเชื่อมั่นในความสามารถของตนเอง (Self - Efficacy)
คือ ความสามารถในการคิด การเข้าใจ และตัดสินใจที่จะแก้ไขปัญหาต่างๆ มีความสามารถในการที่จะเผชิญอุปสรรคต่างๆ นานา ที่ถาโถมเข้ามาในชีวิต และเชื่อมั่นว่าตนเองมีความรู้ความสามารถ เพียงพอที่จะแก้ไขปัญหาต่างๆ ได้อย่างมีประสิทธิภาพ และสามารถพึ่งพาตนเองได้

ภาพแห่งตน (Self - Image)
คือ มุมมองที่เรามองว่า ตนเองเป็นใคร มีทัศนคติอย่างไร มีสถานภาพใดในสังคม ซึ่งภาพแห่งตนจะถูกสร้างจากกิจวัตรประจำวัน หรือหน้าที่การงานของเราว่า เรามีบทบาทอย่างไรในสังคม เรามองตนเองว่าเป็นบุคคลอย่างไร ยืนอยู่ที่ใดในสังคมนั้นๆ

สรุป
คนที่จะประสบความสำเร็จและมองตนเองได้อย่างถูกต้อง จะต้องตระหนักในคุณค่าของตนเอง เชื่อมั่นในความสามารถของตนเอง และมีภาพแห่งตนที่ถูกต้อง ซึ่งเรามีวิธีสังเกตว่าคนที่มีคุณสมบัติครบทั้ง 3 ข้อ ที่กล่าวมาแล้วนี้ หรือที่เรียกว่ามี Self - Esteem สูงนั้นเขาเป็นอย่างไรกัน เนื่องจากคนที่มี Self - Esteem สูง หรือมีความตระหนักในคุณค่าของตนเอง และมั่นใจในความสามารถของตนเอง

คุณสมบัติเหล่านี้จะทำให้เขามีความรับผิดชอบค่อนข้างสูง มีความซื่อสัตย์ มีความเคารพตนเอง และเคารพในสิ่งที่ตนเองทำ เชื่อมั่นว่าสิ่งที่ตนเองทำนั้นเป็นประโยชน์ต่อส่วนรวม และมักจะมีความคิดริเริ่มสร้างสรรค์ มีความมุ่งมั่นที่จะแก้ไขปัญหาต่างๆ อย่างไม่ย่อท้อต่ออุปสรรค ด้วยอุปนิสัยเหล่านี้จะทำให้เขาเป็นคนรักตนเอง และคนรอบข้างก็รักเขาด้วยเช่นเดียวกัน ในขณะเดียวกันก็มีคนบางพวกที่คิดว่า ตนเองไม่มีความสามารถ และดูถูกตนเอง เราแน่ใจได้ว่าคนเหล่านี้นั้นมี Self - Esteem ต่ำ แต่ยังมีบางคนที่หลงตนเอง ซึ่งจริงๆ เขาอาจจะเป็นคนที่มีความสามารถดี แต่เขามักกดคนอื่นและดูถูกคนอื่น ซึ่งบางครั้งอาจจะเกิดจากภาวะ Self - Esteem ต่ำ

หรือเขาแสดงออกเพื่อเป็นการปกป้องปมด้อยของตนเอง จึงพยายาม จะกดคนอื่นเพื่อให้รู้สึกว่าคนอื่นนั้นต่ำกว่าตน คนพวกนี้เรียกว่า “Defensive” คือ พยายามที่จะทำอากัปกิริยาต่างๆ

แสดงเหมือนกับว่าตนเองนั้นมีความรู้ความสามารถสูง ด้วยการกดคนอื่น ดูถูกคนอื่น และมักจะชอบติ ชอบวิพากษ์วิจารณ์การทำงานของคนอื่น ใครทำอะไรก็ไม่ถูกต้องไปหมด ไม่ดีเท่ากับตนเองทำ

เจริญพร

พระมหาสมชาย ฐานวุฑฺโฒ`,
    category_ids: ['cat_002'],
    tags: ['Self-Esteem', 'การพัฒนาตนเอง', 'การมองตนเอง', 'ความเชื่อมั่น'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_006',
    title: 'หลักฐานในยุคดิจิทัล',
    description: '“คนสมัยนี้มักจะคิดว่าพูดอะไรก็ได้ พอเวลาผ่านไปคนก็ลืมหมด…” ในยุคดิจิทัลนั้นไม่จริงเลยที่เราจะคิดว่าพูดหรือทำอะไรเมื่อไรแบบไหนก็ได้ตามใจตนเองโดยไม่มีใครจดจำ',
    content: `“คนสมัยนี้มักจะคิดว่าพูดอะไรก็ได้ พอเวลาผ่านไปคนก็ลืมหมด…”

ในยุคดิจิทัลนั้นไม่จริงเลยที่เราจะคิดว่า พูดหรือทำอะไรเมื่อไรแบบไหนก็ได้ตามใจตนเองโดยไม่มีใครจดจำ หรือให้ความสนใจ

ในอดีตที่ยังไม่มีเทคโนโลยีต่างๆ คนเราพูดอะไรออกไปแล้วก็เพียงติดอยู่ในใจผู้ฟังโดยไม่มีหลักฐาน ไม่สามารถย้อนกลับมาเปิดฟังซ้ำๆ ได้ เพราะไม่มีสื่อโซเชียลมีเดียต่างๆ ให้ได้กระจายเสียง และภาพส่งต่อออกไปให้ผู้อื่นได้รับรู้ได้อย่างในปัจจุบัน

อดีต ผู้คนจะรับรู้ข่าวสารได้ก็เพียงในวิทยุ โทรทัศน์ หนังสือพิมพ์ ซึ่งเป็นสื่อหลักใหญ่ๆ 3 ช่องทาง แล้วจึงแยกย่อยไปเป็นวารสาร นิตยสาร สื่อสิ่งพิมพ์ต่างๆ

รายการวิทยุพอออกอากาศไปแล้ว ก็มีน้อยคนที่จะอัดเทปเก็บไว้ฟังอีก เรื่องอะไรที่เคยออกอากาศไปแล้ว ก็สืบค้นได้ยากกว่าในปัจจุบันมาก สมัยก่อนเราใช้ตลับเทปที่มีอายุประมาณ 10 ปี ก็เสื่อมสภาพ หรือหากจะไปสืบค้นหนังสือพิมพ์เก่าๆ เมื่อประมาณ 30 ปีก่อน ก็ยากเต็มที

เพราะฉะนั้น สิ่งที่คนเราเคยพูดเมื่อก่อนนั้นมีโอกาสสูงที่จะถูกลืมเลือนไป ยกเว้นว่าเป็นคำพูดของคนที่มีชื่อเสียงจริงๆ อย่างผู้นำประเทศ นายกรัฐมนตรี หรือประธานาธิบดีเท่านั้น

ซึ่งเรื่องราวที่คนดังในอดีตได้เคยกล่าวไว้นั้น ย่อมถูกบันทึกลงในหนังสือที่อ้างอิงได้ เช่น จอห์น เอฟ. เคเนดี้ (John Federic Kennedy) เคยกล่าววาทะเด็ดๆ ไว้มากมาย คำพูดของเขาเหล่านั้นก็ยังคงอยู่

ในทางกลับกัน โอกาสที่คำพูดของคนธรรมดาจะถูกนำมาจัดเก็บ หรืออ้างอิงไว้เป็นรายลักษณ์อักษรนั้นยากมาก แม้จะเคยตกเป็นข่าวในหนังสือพิมพ์ วิทยุ หรือโทรทัศน์ก็ตาม มันก็จะค่อยๆ จางหายไปในที่สุด

เมื่อเทียบกับในยุคปัจจุบันนั้นผิดกันมาก ไม่เฉพาะถ้อยคำที่เราเคยพูดออกอากาศทางวิทยุ โทรทัศน์ หรือเคยลงข่าวหนังสือพิมพ์เท่านั้น แม้แต่เราจะไปพูดที่ไหน ถ้ามีคนถ่ายคลิปไว้ ทุกอย่างก็ถูกเก็บไว้เป็นหลักฐาน แล้วแพร่กระจายไปในวงกว้างทางสื่อโซเชีลมีเดียได้อย่างรวดเร็ว

บางทีเพียงแค่โพสต์ข้อความ อัดคลิปเสียง หรือคลิปภาพลงไปในเฟสบุ๊ค ไอจี หรือทวิตเตอร์ของตนเองด้วยความรู้เท่าไม่ถึงการณ์เท่านั้น ไม่นานสื่อนั้นก็อาจจะเป็นไวรัล ออกสู่สายตาคนในสังคมได้อย่างรวดเร็วและง่ายดาย

เพียงเราเผลอพูดไปไม่กี่วินาที ข้อความนั้นจะคงอยู่ไปนานเลยทีเดียว ลบอย่างไรก็ไม่หมด เพราะคนอื่นเซฟส่งต่อกันไปมากมายแล้ว คนในสังคมวงกว้างต่างก็รู้ได้ทันทีว่าใครทำอะไรไว้ เพราะช่องทางกระจายข่าวนั้นมีมากและทำได้ง่าย

สมัยนี้ช่องทางการกระจายข่าวต่างกับสมัยก่อนมากเพราะสื่อยังมีพื้นที่น้อย สมัยนี้ใครก็สามารถกระจายข่าวได้ด้วยตนเอง ถ้าข่าวนั้นโดนใจคนในสังคม คนก็ส่งต่อๆ กันวันเดียวข่าวนั้นได้รู้กันในวงกว้างเป็นหมื่นล้านคน

เพราะฉะนั้น ในยุคดิจิทัล สิ่งใดที่เราเคยแสดงออกไว้ไม่ว่าจะด้วยคำพูด ข้อความ หรือการกระทำล้วนถูกบันทึกไว้ได้ และจะคงอยู่ไปอีกยาวนานเลยเลยทีเดียว

พระมหาสมชาย ฐานวุฑฺโฒ`,
    category_ids: ['cat_001'],
    tags: ['โซเชียลมีเดีย', 'ยุคดิจิทัล', 'สติ', 'คำพูด'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_005',
    title: 'มีปัญหากับกลุ่มเพื่อน',
    description: 'มีปัญหากับกลุ่มเพื่อนมาโดยตลอด เพื่อนส่วนใหญ่ไม่ค่อยมีธรรมะทําให้เราไม่มีความสุข คิดฟุ้งซ่านไปหมด',
    content: `มีปัญหากับกลุ่มเพื่อนมาโดยตลอด เพื่อนส่วนใหญ่ไม่ค่อยมีธรรมะทําให้เราไม่มีความสุข คิดฟุ้งซ่านไปหมด

พระอาจารย์ตอบ : เราควรพิจารณาตนเองก่อนว่า เราทำดีกับเพื่อนแล้วหรือยัง ถ้าเราทำดีแล้ว ทําไมเขาจึงยังไม่ทําดีตอบกลับมา ซึ่งการทําดีกับเพื่อนในที่นี้เพราะเราหวังให้เพื่อนเปิดใจยอมรับแล้วทำดีตอบแทน หรือเอ่ยคำนิยมชมชอบเราบ้าง

พระสัมมาสัมพุทธเจ้าให้หลัก “สังคหวัตถุ 4” มีข้อควรปฏิบัติ 4 ประการ ได้แก่

(1) ทาน มีน้ำใจแบ่งปัน โดยไม่จําเป็นต้องเป็นของราคาแพงก็ได้

(2) ปิยวาจา การพูดจาให้เกียรติ แสดงกริยาท่าทางอาการ สีหน้า และแววตาให้เกียรติผู้อื่น

(3) อัตถจริยา ฝึกฝนตนเองให้เป็นคนมีประโยชน์ ในขณะเดียวกันก็นำความรู้ความสามารถที่มีไปสร้างประโยชน์ให้เกิดแก่ผู้อื่นด้วย พอเห็นเขามีการงานอะไรที่เราพอจะช่วยได้ ก็พยายามช่วยเหลือเขา เป็นต้น

(4) สมานัตตตา วางตัวเหมาะสมกับฐานะ เช่น เราเป็นเด็ก เราเป็นผู้ใหญ่ เราเป็นเพื่อน หรือเราเป็นหัวหน้า เรามีสถานภาพอย่างไร ก็ควรวางตัวให้เหมาะสมกับสถานภาพนั้น ปฏิบัติตนเสมอต้นเสมอปลาย ไม่ใช่อารมณ์ขึ้นๆ ลงๆ บางวันดี บางวันแย่ คนรอบข้างก็ไม่อยากเข้าใกล้

หากเราคิดว่าตนเองทำดีกับเพื่อนๆ แล้ว แต่เพื่อนๆ ไม่ทําดีตอบ ก่อนอื่นให้เราสํารวจตนเองก่อนว่า เราปฏิบัติต่อเขาครบทั้ง ๔ ข้อ แล้วหรือไม่ ขาดเกินตรงจุดใดก็พยายามปรับปรุงแก้ไขให้พอดี`,
    category_ids: ['cat_001'],
    tags: ['เพื่อน', 'สังคหวัตถุ 4'],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_004',
    title: 'ทำอย่างไรให้ผ่านวิกฤติชีวิตไปได้',
    description: 'พระอาจารย์ตอบคำถามเรื่องทำอย่างไรให้ผ่านวิกฤติชีวิตเฉพาะหน้าไปได้',
    content: `โยมถาม : ทำอย่างไรให้ผ่านวิกฤติชีวิตเฉพาะหน้าไปได้

พระอาจารย์ตอบ : มีหลักความจริงข้อหนึ่งว่า  “ไม่มีอะไรเกิดขึ้นมาด้วยความบังเอิญ ทุกอย่างล้วนมีเหตุทั้งสิ้น”  ถ้าเราต้องเผชิญหน้ากับวิกฤติ ไม่ว่าจะเป็นเรื่องของสุขภาพ โรคภัยไข้เจ็บ  ปัญหาหน้าที่การงาน ประสบอุบัติเหตุ หรือปัญหาในครอบครัว ทุกอย่างล้วนมีเหตุจากเราเคยทําผิดพลาดไว้ในอดีตทั้งสิ้น  เหล่านี้แก้ไขได้ด้วยบุญ ใช้ความดีเข้าแก้ ใช้บุญกุศลเข้าแก้

เพราะฉะนั้น  เมื่อเกิดปัญหาขึ้น สิ่งที่เราควรระลึกนึกถึงก่อน คือ “พระรัตนตรัย”  เมื่อครั้งพุทธกาล เวลาที่คนตกใจมักจะอุทานว่า “นโมตัสสะ ภะคะวะโต อะระหะโต สัมมาสัมพุทธัสสะ ...." แค่หาจานตกแตกทีเดียวตั้งนโมตัสสะ 3 จบได้เลย  คนสมัยก่อน พอมีอะไรเกิดขึ้นก็ระลึกนึกถึงคุณของพระรัตนตรัย นึกถึงพระพุทธ พระธรรม พระสงฆ์เป็นหลักก่อน มีพระรัตนตรัยเป็นที่พึ่งที่ระลึก  ให้ใจเกาะเกี่ยวบุญกุศลแล้วเกิดสติ จากนั้นจึงค่อยๆ ใช้ปัญญาพิจารณาว่า  ปัญหานั้นมีสาเหตุเกิดจากอะไร และสามารถแก้ไขได้อย่างไร  เมื่อเราใช้ปัญญาในการแก้ไขปัญหา แล้วมีกำลังบุญภายในหนุนส่ง สุดท้ายปัญหาทุกอย่างก็จะคลี่คลายลงไปได้ในที่สุด

เจริญพร.`,
    category_ids: ['cat_001'],
    tags: [],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_003',
    title: 'ประโยชน์การเกิดเป็นมนุษย์',
    description: 'พระอาจารย์ตอบคำถามเรื่องเกิดเป็นมนุษย์จะสร้างประโยชน์ได้อย่างไร',
    content: `โยม : พระอาจารย์ครับเกิดเป็นมนุษย์จะสร้างประโยชน์ได้อย่างไรครับ

พระอาจารย์ : ประโยชน์ของมนุษย์จะมีอยู่ 3 ขั้นคือ 1. ประโยชน์ชาตินี้ ได้แก่ การสร้างฐานะนกตัวเล็กๆยังอุตส่าห์สร้างรัง หนูตัวเล็กๆก็ยังอุตส่าห์ขุดรูอยู่ เราเกิดมาเป็นคนทั้งทีก็ต้องเอาดีให้ได้ต้องตั้งเนื้อตั้งตัวให้ได้ ทำให้เราเองทำประโยชน์ชาตินี้ได้ แต่พระพุทธเจ้าบอกว่าประโยชน์ไม่ได้จบให้ชาตินี้นะ ยังมีประโยชน์ชาติหน้า ก็คือตายแล้วต้องได้เกิดในสุคติโลกสวรรค์ ก็คือ เราจะต้องรู้จักการสร้างบุญด้วย ด้วยการให้ทาน รักษาศีล เจริญภาวนา

คนไหนรวยในชาตินี้แต่เสร็จแล้วหวงยึดติดในทรัพย์ไม่ปล่อยวางเลย คิดว่าเป็นของเรา ตายปั๊บถ้าไม่ได้ทำบาปอะไรเยอะเนี่ยก็จะไปเกิดเป็นปู่โสมเฝ้าทรัพย์ อันนั้นคือคนที่ไม่ปล่อยวาง แต่ว่าคนที่รู้จักปล่อยวาง คือจะต้องรู้จักสร้างเนื้อสร้างตัวเสร็จแล้วสามารถสละทรัพย์นั้นออกจากใจ เพื่อสร้างประโยชน์ใหญ่แก่ตัวเองได้ ภพเบื้องหน้าต่อไปได้ ไม่ว่าจะฝากฝังทรัพย์ไว้ในพระพุทธศาสนา ทำบุญทำกุศลเป็นบุญกุศลติดตัว หรือว่าสงเคราะห์โลก สร้างโรงพยาบาล สร้างโรงเรียน สร้างที่พักคนเดินทาง บริจาคเพื่อการสาธารณกุศลต่างๆ ก็จะเป็นบุญกุศลติดตัวต่อไป

แล้วก็ตั้งใจสวดมนต์ นั่งสมาธิสม่ำเสมอ รักษาศีลให้ดีด้วยนะเพื่อที่ว่า ให้เราใกล้ต่อหนทางพระนิพพาน ซึ่งเป็นประโยชน์อย่างยิ่ง เป็นประโยชน์อันสูงสุดในขั้นที่ 3

ประโยชน์มนุษย์มี 3 ขั้นอย่างนี้ ประโยชน์ขั้นแรกต้องทำให้ได้ก่อน คือตั้งตัวตั้งฐานะให้ได้ แล้วก็รู้จักปล่อยวางทรัพย์เหล่านั้น โดยเปลี่ยนให้เป็นอริยทรัพย์ ด้วยการบริจาค แล้วก็รู้จักการประพฤติปฏิบัติธรรม เพื่อให้ใกล้ต่อหนทางพระนิพพานด้วย

เจริญพร.`,
    category_ids: ['cat_001'],
    tags: [],
    source_type: 'text',
    source_url: '',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  },
  {
    id: 'dhamma_001',
    title: 'อานิสงส์ของการเจริญสติ',
    description: 'เนื้อหาธรรมเทศนาเกี่ยวกับการเจริญสติปัฏฐาน',
    content: 'การเจริญสติเป็นหนทางไปสู่ความดับทุกข์...',
    category_ids: ['cat_003'],
    tags: ['tag_001'],
    source_type: 'text',
    source_url: '',
    related_book_ids: ['book_002'],
    related_video_ids: [],
    related_audio_ids: ['audio_001'],
    verified: true,
    view_count: 0,
    like_count: 12
  },
  {
    id: 'dhamma_002',
    title: 'ความสุขที่แท้จริงหาได้จากที่ไหน?',
    description: 'บทความตอนพิเศษ คัดลอกเนื้อหาบางส่วนจากเว็บไซต์ ReadAWrite',
    content: `เมื่อเราพูดถึง "ความสุข" หลายคนอาจจะนึกถึงสิ่งของนอกกาย เช่น เงินทอง บ้าน รถ หรือความสำเร็จในหน้าที่การงาน แต่แท้จริงแล้ว สิ่งเหล่านี้เป็นเพียงความสุขชั่วคราวที่เมื่อได้มาแล้ว ความตื่นเต้นก็จะค่อยๆ จางหายไปตามกาลเวลา

ความสุขที่ยั่งยืนนั้น เกิดขึ้นจาก "ใจ" ที่สงบและรู้จักพอ การที่เราสามารถปล่อยวางความยึดติดในสิ่งต่างๆ และยอมรับความจริงของชีวิตได้ นั่นแหละคือจุดเริ่มต้นของความสุขที่แท้จริง

ในบทความนี้ เราจะมาพูดถึงวิธีการสร้างความสุขง่ายๆ ในชีวิตประจำวัน เริ่มต้นจากการมี "สติ" รู้เท่าทันอารมณ์ของตนเอง เมื่อโกรธก็รู้ว่าโกรธ เมื่อเศร้าก็รู้ว่าเศร้า และเมื่อมีความสุขก็รู้ว่ามีความสุข การมีสติจะช่วยให้เราไม่ตกเป็นทาสของอารมณ์ และสามารถเผชิญหน้ากับปัญหาต่างๆ ได้อย่างมีปัญญา

นอกจากนี้ การรู้จัก "แบ่งปัน" และ "ทำความดี" ก็เป็นอีกหนึ่งวิธีที่ช่วยเติมเต็มความสุขให้กับจิตใจ เพราะเมื่อเราได้เป็นผู้ให้ เราจะสัมผัสได้ถึงความปีติยินดีที่เกิดขึ้นจากภายใน ซึ่งเป็นความสุขที่หาไม่ได้จากการเป็นผู้รับเพียงอย่างเดียว

สุดท้ายนี้ ขอให้ทุกท่านค้นพบความสุขที่แท้จริงในหัวใจ และสามารถดำเนินชีวิตได้อย่างมีสติ มีปัญญา และมีความสุขในทุกๆ วัน`,
    category_ids: ['cat_004'],
    tags: ['tag_001', 'tag_003'],
    source_type: 'ReadAWrite',
    source_url: 'https://www.readawrite.com/?action=user_page&user_id_publisher=3281442',
    related_book_ids: [],
    related_video_ids: [],
    related_audio_ids: [],
    verified: true,
    view_count: 0,
    like_count: 0
  }
];

export const audios: T.Audio[] = [
  {
    id: 'audio_001',
    title: 'เสียงบรรยาย: ก้าวข้ามอุปสรรคด้วยสติ',
    description: 'เสียงอ่านหนังสือ ก้าวข้ามอุปสรรคด้วยสติ',
    audio_url: '/audios/sample.mp3',
    thumbnail: '/images/audios/audio-1.jpg',
    duration: '01:15:00',
    category_ids: ['cat_001'],
    tags: ['tag_002'],
    related_book_id: 'book_002',
    source_url: '',
    copyright_status: 'approved',
    view_count: 0
  }
];

import { libraryVideos } from './videoData';
export const videos: T.Video[] = libraryVideos;

export const promotions: T.Promotion[] = [
  {
    id: 'promotion_001',
    title: 'หนังสือแนะนำประจำเดือน',
    description: 'ขอแนะนำหนังสือ "ความสุขเริ่มต้นที่ตัวเรา" อ่านฟรีได้แล้ววันนี้',
    image: '/images/promotions/promo-1.jpg',
    video_id: null,
    button_text: 'อ่านเลย',
    target_type: 'book',
    target_id: 'book_001',
    active: true
  }
];

export const siteSettings: T.SiteSettings = {
  contact_email: 'contact@thanavuddho-library.org',
  facebook_url: 'https://facebook.com/thanavuddho',
  youtube_url: 'https://youtube.com/thanavuddho'
};
