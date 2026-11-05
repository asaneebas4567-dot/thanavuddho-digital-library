export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Author {
  id: string;
  name: string;
  profile_image?: string;
}

export interface Book {
  id: string;
  title: string;
  author_id: string;
  description: string;
  category_id: string;
  cover: string;
  publication_year: number;
  pages: number;
  language: string;
  tags: string[];
  pdf_url?: string;
  reader_url?: string;
  source_url?: string;
  audio_url?: string;
  video_url?: string;
  status: 'published' | 'draft';
  is_copyright?: boolean;
  copyright_notice?: string;
  isbn?: string;
  publisher?: string;
  view_count: number;
  read_count: number;
  like_count: number;
  is_finished?: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  thumbnail: string;
  category_id: string;
  author_id: string;
  published_date: string;
  tags: string[];
  view_count: number;
  like_count: number;
  is_finished?: boolean;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  video_url: string;
  duration: string;
  category_id: string;
  tags: string[];
  view_count: number;
  like_count: number;
  is_finished?: boolean;
  published_date: string;
  book_id?: string;
}

export interface Audio {
  id: string;
  title: string;
  description: string;
  duration: string;
  audio_url: string;
  thumbnail: string;
  category_id: string;
  book_id?: string;
  view_count?: number;
  like_count?: number;
  is_finished?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  role: 'admin' | 'user';
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  progress_percentage: number;
  current_page: number;
  last_read: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  item_id: string;
  item_type: 'book' | 'article' | 'video' | 'audio';
  added_at: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  target_url: string;
  type: 'book' | 'video' | 'event' | 'news';
}

// ==========================================
// MOCK DATA
// ==========================================

export const categories: Category[] = [
  { id: 'c1', name: 'สมาธิ', description: 'การฝึกปฏิบัติเพื่อความสงบของจิตใจ' },
  { id: 'c2', name: 'การพัฒนาตนเอง', description: 'แนวทางเพื่อชีวิตที่ดีขึ้น' },
  { id: 'c3', name: 'ความสุข', description: 'วิธีสร้างความสุขจากภายใน' },
  { id: 'c4', name: 'การดำเนินชีวิต', description: 'หลักธรรมสำหรับชีวิตประจำวัน' },
  { id: 'c5', name: 'ครอบครัว', description: 'ธรรมะสำหรับสร้างครอบครัวอบอุ่น' },
  { id: 'c6', name: 'ธรรมเทศนา', description: 'รวมพระธรรมเทศนา' }
];

export const authors: Author[] = [
  { id: 'a1', name: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)', profile_image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80' } 
];

export const books: Book[] = [
  {
    id: 'book_tam_jai_hai_prom_buak',
    title: 'ทำใจให้พร้อมบวก',
    author_id: 'a1',
    description: 'สร้างสุขที่แท้จริง ด้วยการสร้างความคิดดี ๆ จากการมองสิ่งต่าง ๆ อย่างเข้าใจ Positive Thinking "ยอมรับ เข้าใจ เกิดประโยชน์" มุมมองที่จะทำให้เรามีแง่คิดดี และมีความสุขบนพื้นฐานของการดำเนินชีวิต โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    category_id: 'c2',
    cover: '/images/books/tam-jai-hai-prom-buak.jpg',
    publication_year: 2566,
    pages: 130,
    language: 'Thai',
    tags: ['ทำใจให้พร้อมบวก', 'คิดบวก', 'กำลังใจ', 'พัฒนาตนเอง', 'การดำเนินชีวิต', 'สมาธิ', 'ความสุข'],
    pdf_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/preview',
    reader_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/preview',
    source_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/view',
    status: 'published',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    isbn: '978-616-7803-32-6',
    publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
    view_count: 0,
    read_count: 0,
    like_count: 650,
    is_finished: true,
  },
  {
    id: 'book_khao_kor_sook_rao_kor_sook',
    title: 'เขาก็สุข เราก็สุข',
    author_id: 'a1',
    description: 'นิยามของ "ความสุข" เกิดจากอะไร ตัวเราหรือคนอื่น หนังสือ "เขาก็สุข เราก็สุข" มอบคำตอบและหลักคิดในการใช้ชีวิตร่วมกับผู้อื่นอย่างมีความสุข ทั้งการเปลี่ยนศัตรูให้เป็นมิตร การพูดความจริง ศิลปะป้องกันใจ และความสุขที่ไม่รู้โรย โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    category_id: 'c3',
    cover: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    publication_year: 2564,
    pages: 63,
    language: 'Thai',
    tags: ['เขาก็สุข เราก็สุข', 'ความสุข', 'มิตรภาพ', 'ศิลปะป้องกันใจ', 'ธรรมะบำบัด', 'ความสัมพันธ์'],
    pdf_url: 'https://drive.google.com/file/d/1JNmEozB38Vd013Gns8-5H0JREqNsJiDY/preview',
    reader_url: 'https://drive.google.com/file/d/1JNmEozB38Vd013Gns8-5H0JREqNsJiDY/preview',
    source_url: 'https://drive.google.com/file/d/1JNmEozB38Vd013Gns8-5H0JREqNsJiDY/view',
    status: 'published',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    isbn: '978-616-7803-24-1',
    publisher: 'มูลนิธิธรรมะคุ้มครองโลก',
    view_count: 0,
    read_count: 0,
    like_count: 530,
    is_finished: true,
  },
  {
    id: 'book_lom_hai_jai_khao_ok',
    title: 'ลมหายใจเข้าออก ของพระพุทธศาสนา',
    author_id: 'a1',
    description: 'ธรรมบรรยายว่าด้วยหัวใจของการปฏิบัติและการเผยแผ่พระพุทธศาสนา ดั่งลมหายใจเข้าออกที่หล่อเลี้ยงชีวิตและสร้างแสงสว่างแห่งปัญญา โดย พระมหาสมชาย ฐานวุฑโฒ M.D., Ph.D.',
    category_id: 'c6',
    cover: '/images/books/lom-hai-jai-khao-ok.jpg',
    publication_year: 2558,
    pages: 29,
    language: 'Thai',
    tags: ['ลมหายใจเข้าออก', 'การปฏิบัติธรรม', 'พระพุทธศาสนา', 'สมาธิ', 'การเผยแผ่'],
    pdf_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/preview',
    reader_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/preview',
    source_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/view',
    status: 'published',
    is_copyright: true,
    copyright_notice: 'หนังสือลิขสิทธิ์',
    publisher: 'ขบวนการพุทธศาสตร์สากล',
    view_count: 0,
    read_count: 0,
    like_count: 420,
    is_finished: true,
  },
  {
    id: 'book_phoo_soon_sia_tee_mai_sin_soon',
    title: 'ผู้สูญเสีย ที่ไม่เสียศูนย์',
    author_id: 'a1',
    description: 'ธรรมะเยียวยาใจเมื่อต้องเผชิญกับความพลัดพรากและการสูญเสียบุคคลอันเป็นที่รัก หลักคิดในการดึงสติกลับมาตั้งมั่น ไม่ให้ชีวิตต้อง "เสียศูนย์" เปลี่ยนความโศกเศร้าให้เป็นพลังแห่งความดีและกำลังใจในการก้าวต่อไปข้างหน้าตามหลักพุทธธรรม โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    category_id: 'c1',
    cover: '/images/books/phoo-soon-sia-tee-mai-sin-soon.png',
    publication_year: 2560,
    pages: 170,
    language: 'Thai',
    tags: ['ผู้สูญเสีย ที่ไม่เสียศูนย์', 'กำลังใจ', 'เยียวยาจิตใจ', 'ความสูญเสีย', 'การพลัดพราก', 'สติ', 'สมาธิ', 'การดำเนินชีวิต'],
    pdf_url: '/books/pdf/phoo-soon-sia-tee-mai-sin-soon.pdf',
    reader_url: 'https://drive.google.com/file/d/1aosykTVkrW-HNNqyolvTUEyK_EGY5V7L/preview',
    source_url: 'https://drive.google.com/file/d/1aosykTVkrW-HNNqyolvTUEyK_EGY5V7L/view',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 320
  },
  {
    id: 'book_secret_of_love_rak_look_yang_rai',
    title: 'Secret of Love "รักลูกอย่างไรไม่ให้เสียน้ำตา"',
    author_id: 'a1',
    description: 'เรียนรู้วิธีการประคับประคองชีวิตคู่เพื่อลูก และสร้างความสุขในครอบครัว บทพิสูจน์ความรักเมื่อมีอีกคนเพิ่มเข้ามาเติมเต็มคำว่า ครอบครัว ข้อคิดและแนวทางการเลี้ยงลูกตามหลักพุทธศาสนา โดย พระมหาสมชาย ฐานวุฑฺโฒ (พระครูปลัดสุวัฒนโพธิคุณ)',
    category_id: 'c5',
    cover: '/images/books/secret-of-love-rak-look-yang-rai.png',
    publication_year: 2559,
    pages: 134,
    language: 'Thai',
    tags: ['Secret of Love', 'รักลูกอย่างไรไม่ให้เสียน้ำตา', 'เลี้ยงลูก', 'ครอบครัว', 'ความรัก', 'ชีวิตคู่', 'ทันโลกทันธรรม', 'การดำเนินชีวิต', 'การพัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/1XR72V9gqIEI24hn8PUrgBUbQAHKA7E5W/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 880,
    is_finished: false,
  },
  {
    id: 'book_the_lover_rak_pen_ja_hen_jai',
    title: 'The Lover "รักเป็นจะเห็นใจ"',
    author_id: 'a1',
    description: 'บทเรียนพิเศษที่ต้องรู้ก่อนรัก การอยู่ร่วมกับความต่างอย่างลงตัว และการสร้างชีวิตคู่ผาสุก ข้อคิดเตือนสติสำหรับผู้ที่คิดจะแต่งงานเพื่อมองโลกตามความเป็นจริง เรียบเรียงจากรายการทันโลกทันธรรม โดย พระมหาสมชาย ฐานวุฑฺโฒ (พระครูปลัดสุวัฒนโพธิคุณ)',
    category_id: 'c5',
    cover: '/images/books/the-lover-rak-pen-ja-hen-jai.png',
    publication_year: 2559,
    pages: 134,
    language: 'Thai',
    tags: ['The Lover', 'รักเป็นจะเห็นใจ', 'ความรัก', 'ครอบครัว', 'ชีวิตคู่', 'ทันโลกทันธรรม', 'การดำเนินชีวิต', 'การพัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/1xNorlpcHvz7h1pUfdmomHqllOd8ziTwN/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 920,
    is_finished: false,
  },
  {
    id: 'book_yoo_nai_lok_mai_yang_mai_pen_rok',
    title: 'อยู่ในโลกใหม่อย่างไม่เป็นโรค',
    author_id: 'a1',
    description: 'ข้อคิดการดูแลสุขภาพกายและใจให้แข็งแรงท่ามกลางความเปลี่ยนแปลงของโลกยุคใหม่ ด้วยหลักธรรมคำสอนและมุมมองทางการแพทย์ โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.) เพื่อให้ใช้ชีวิตอย่างมีความสุข ปลอดภัย และห่างไกลจากโรคภัยไข้เจ็บทั้งกายและใจ',
    category_id: 'c4',
    cover: '/images/books/yoo-nai-lok-mai-yang-mai-pen-rok.png',
    publication_year: 2565,
    pages: 48,
    language: 'Thai',
    tags: ['อยู่ในโลกใหม่อย่างไม่เป็นโรค', '1147 อยู่บนโลกใหม่อย่างไม่เป็นโรค', 'สุขภาพ', 'โลกยุคใหม่', 'การดำเนินชีวิต', 'การพัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/1-ODFFY1OLoegO149gtBQ5L5ESTlr2mhX/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1040,
    is_finished: false,
  },
  {
    id: 'book_tham_jai_hai_phrom_buak',
    title: 'ทำใจให้พร้อมบวก',
    author_id: 'a1',
    description: 'วางพื้นฐานและปรับมุมมองความคิดสู่การเป็นคนคิดบวก (Positive Thinking) ในแบบพุทธะ ด้วยหลักธรรมและแนวทางที่เรียบง่ายแต่ทรงพลัง สามารถนำไปปรับใช้ในชีวิตประจำวันเพื่อสร้างความสุข ความสงบใจ และความสำเร็จในทุกสถานการณ์',
    category_id: 'c2',
    cover: '/images/books/tham-jai-hai-phrom-buak.png',
    publication_year: 2561,
    pages: 141,
    language: 'Thai',
    tags: ['ทำใจให้พร้อมบวก', '1200 ทำใจให้พร้อมบวก', 'การคิดบวก', 'การพัฒนาตนเอง', 'ความสุข', 'จิตใจและความคิด'],
    pdf_url: 'https://drive.google.com/file/d/1ja1JlULVFOiernaH9vzkVlRSLA2MUmpS/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1120,
    is_finished: false,
  },
  {
    id: 'book_lom_hai_jai_khao_ok_123',
    title: '123. ลมหายใจเข้าออกของพระพุทธศาสนา',
    author_id: 'a1',
    description: 'ธรรมบรรยายและข้อคิดอันทรงคุณค่าว่าด้วยความสำคัญและการดำรงอยู่ของพระพุทธศาสนา ประวัติศาสตร์และปัจจัยแห่งความเจริญและเสื่อมถอย ตลอดจนแนวทางการฝึกสมาธิเบื้องต้น การกำหนดสติรู้ลมหายใจเข้าออก เพื่อสร้างความสุขและความสงบแก่ชีวิต',
    category_id: 'c6',
    cover: '/images/books/lom-hai-jai-khao-ok.png',
    publication_year: 2549,
    pages: 29,
    language: 'Thai',
    tags: ['ลมหายใจเข้าออกของพระพุทธศาสนา', 'พระพุทธศาสนา', 'สมาธิ', 'การปฏิบัติธรรม', 'อานาปานสติ'],
    pdf_url: 'https://drive.google.com/file/d/15027mfTYBa4tvTcgwPkvwpzaINi-mRmn/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 890,
    is_finished: false,
  },
  {
    id: 'book_mongkol_chiwit_124',
    title: '124. มงคลชีวิตฉบับทางก้าวหน้า',
    author_id: 'a1',
    description: 'มงคลชีวิต 38 ประการ ฉบับทางก้าวหน้า คู่มือการพัฒนาตนเองสู่ความเจริญก้าวหน้าและความสุขที่แท้จริงตามหลักธรรมคำสอน',
    category_id: 'c6',
    cover: '/images/books/mongkol-124.jpg',
    publication_year: 2567,
    pages: 433,
    language: 'Thai',
    tags: ['มงคลชีวิต', 'ทางก้าวหน้า', 'พระพุทธศาสนา', 'ธรรมเทศนา'],
    pdf_url: 'https://drive.google.com/file/d/14-lngyqUQ8rR-yGmTxtgxLjjMgojzo5X/preview',
    source_url: 'https://drive.google.com/file/d/14-lngyqUQ8rR-yGmTxtgxLjjMgojzo5X/view',
    reader_url: 'https://drive.google.com/file/d/14-lngyqUQ8rR-yGmTxtgxLjjMgojzo5X/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1450,
    is_finished: false,
  },
  {
    id: 'book_perd_promdan_dhamma',
    title: 'เปิดพรมแดนโลกแห่งธรรม',
    author_id: 'a1',
    description: '“ไขความลับพระพุทธศาสนา” แนะนำทางมาแห่งบุญ และวิธีหลบเลี่ยงความเสื่อมในชีวิต เปิดโลกทัศน์กว้างไกลเพื่อนำพาชีวิตให้ก้าวไปในยุคของโลกไร้พรมแดนได้อย่างมีความสุข โดยมีธรรมะของพระสัมมาสัมพุทธเจ้าเป็นเครื่องคุ้มครอง',
    category_id: 'c4',
    cover: '/images/books/perd-promdan.jpg',
    publication_year: 2555,
    pages: 180,
    language: 'Thai',
    tags: ['เปิดพรมแดนโลกแห่งธรรม', 'ไขความลับพระพุทธศาสนา', 'บุญ', 'พระพุทธศาสนา', 'การดำเนินชีวิต', 'Dhamma for the World'],
    pdf_url: 'https://drive.google.com/file/d/1XfYQuvNBU7GN4M7hsJ4O7kjKZUFpqI-h/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 980,
    is_finished: false,
  },
  {
    id: 'book_phro_mai_roo_roo_than_cheewit',
    title: 'เพราะไม่รู้สินะ ตอน รู้ทันชีวิต',
    author_id: 'a1',
    description: 'โรคเกิดจากวิบากกรรมในอดีต 30% อีก 70% อยู่ที่เรา!! ไขข้อข้องใจเรื่องสุขภาพและชีวิตด้วยมุมมองธรรมะและการแพทย์ รู้ทันกาย รู้ทันใจ เพื่อชีวิตที่สมบูรณ์และมีความสุขอย่างแท้จริง',
    category_id: 'c2',
    cover: '/images/books/phro-mai-roo-roo-than-cheewit.jpg',
    publication_year: 2558,
    pages: 178,
    language: 'Thai',
    tags: ['เพราะไม่รู้สินะ', 'รู้ทันชีวิต', 'สุขภาพ', 'วิบากกรรม', 'การพัฒนาตนเอง', 'การดำเนินชีวิต', 'ทันโลกทันธรรม'],
    pdf_url: 'https://drive.google.com/file/d/1OSwySM_byJ0ay-UIkW60fXtmRdQxaIQ6/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1120,
    is_finished: false,
  },
  {
    id: 'book_rak_thae_mai_dai_mee_khae_nai_niyai',
    title: 'รักแท้ไม่ได้มีแค่ในนิยาย',
    author_id: 'a1',
    description: 'เปิดอ่านเรื่องราวความรักใกล้ตัวที่จับต้องได้ ที่จะทำให้หัวใจของคุณเต็มเปี่ยมไปด้วยคำว่า “แม่” เรื่องราวความรักอันบริสุทธิ์ พระคุณอันยิ่งใหญ่ และสายใยแห่งความผูกพันของแม่',
    category_id: 'c5',
    cover: '/images/books/rak-thae-mai-dai-mee-khae-nai-niyai.jpg',
    publication_year: 2558,
    pages: 178,
    language: 'Thai',
    tags: ['รักแท้ไม่ได้มีแค่ในนิยาย', 'แม่', 'ความรัก', 'ครอบครัว', 'ความกตัญญู', 'ทันโลกทันธรรม'],
    pdf_url: 'https://drive.google.com/file/d/1AgWpiPrWjsvXK8Uq_wUAuPUCQM97ou5L/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1380,
    is_finished: false,
  },
  {
    id: 'book_love_myself_rak_nai_tua_ton',
    title: 'Love Myself "รักในตัวตน"',
    author_id: 'a1',
    description: '4 บทพิเศษ เพิ่มเติมพลังชีวิต สร้างคุณให้เป็นที่รักในชั่วข้ามคืน เริ่มต้นที่รักตนเองเป็น มองเห็นตนเองก่อน แล้วคนอื่นจะมองเห็นและหลงรักคุณ',
    category_id: 'c2',
    cover: '/images/books/love-myself-rak-nai-tua-ton.jpg',
    publication_year: 2558,
    pages: 134,
    language: 'Thai',
    tags: ['Love Myself', 'รักในตัวตน', 'การพัฒนาตนเอง', 'ความสุข', 'พลังชีวิต', 'Dhamma for the World'],
    pdf_url: 'https://drive.google.com/file/d/1z7k4gJX--j24YI8-t0BjWd3Q6PyMghRO/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1050,
    is_finished: false,
  },
  {
    id: 'book_hope_for_life_vol_04',
    title: 'HOPE for life Vol. 04 (Pray for Nepal)',
    author_id: 'a1',
    description: 'วารสารเพื่อจุดประกายความหวังสำหรับทุกชีวิต ฉบับพิเศษ Pray for Nepal: เจาะลึกแผ่นดินไหวเนปาลเกิดขึ้นจากอะไร พร้อมเรื่องราวสร้างแรงบันดาลใจ กำลังใจจากชายพิการ และข้อคิด “ดีหรือไม่ดี ยากที่จะบอก”',
    category_id: 'c2',
    cover: '/images/books/hope-for-life-vol-04-pray-for-nepal.jpg',
    publication_year: 2558,
    pages: 64,
    language: 'Thai',
    tags: ['HOPE for life', 'Pray for Nepal', 'วารสาร', 'แรงบันดาลใจ', 'กำลังใจ', 'ทันโลกทันธรรม'],
    pdf_url: '/books/pdf/hope-for-life-vol-04.pdf',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 820,
    is_finished: false,
  },
  {
    id: 'book_yoo_sook_nai_yook_digital',
    title: 'อยู่สุข ในยุคดิจิทัล',
    author_id: 'a1',
    description: 'ศิลปะในการเรียนรู้ และรับมือผู้คนบนโลกออนไลน์ อย่างมีความสุข แนะนำหลักคิดการใช้ชีวิตท่ามกลางเทคโนโลยี โซเชียลมีเดีย และโลกออนไลน์ด้วยจิตใจที่สงบและรู้เท่าทัน',
    category_id: 'c3',
    cover: '/images/books/yoo-sook-nai-yook-digital.jpg',
    publication_year: 2562,
    pages: 187,
    language: 'Thai',
    tags: ['อยู่สุข ในยุคดิจิทัล', 'ยุคดิจิทัล', 'ออนไลน์', 'ความสุข', 'การดำเนินชีวิต', 'พัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/preview',
    reader_url: 'https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/preview',
    source_url: 'https://drive.google.com/file/d/1zjYSMEo0ZlwVMHr0Ek56zVaIs9R5AjHY/view',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1240,
    is_finished: false,
  },
  {
    id: 'b_zjdd',
    title: '“ดีชั่ว” เกิดด้วยกรรมหรือบังเอิญ ไทย-จีน',
    author_id: 'a1',
    description: '“ดีชั่ว” เกิดด้วยกรรมหรือบังเอิญ ฉบับสองภาษา ไทย-จีน',
    category_id: 'c4',
    cover: 'https://online.pubhtml5.com/vasxl/zjdd/files/shot.jpg',
    publication_year: 2567,
    pages: 212,
    language: 'Thai/Chinese',
    tags: ['กรรม', 'สองภาษา', 'ข้อคิดชีวิต'],
    pdf_url: 'https://online.pubhtml5.com/vasxl/zjdd/',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 620,
    is_finished: true,
  },
  {
    id: 'b_jopa',
    title: 'สมดุล = ดี (平衡 = 好)',
    author_id: 'a1',
    description: 'หนังสือ “สมดุล = ดี” เล่มนี้ คณะบรรณาธิการได้รวบรวมเรียบเรียงขึ้นจากพระธรรมเทศนาที่อาตมาภาพได้แสดงไว้ในวาระโอกาสต่าง ๆ เพื่อกระตุ้นผู้ฟังและผู้อ่านได้ฉุกคิดในประเด็นที่สำคัญซึ่งส่งผลต่อความสุขความสำเร็จในชีวิต',
    category_id: 'c4',
    cover: 'https://online.pubhtml5.com/vasxl/jopa/files/shot.jpg',
    publication_year: 2567,
    pages: 228,
    language: 'Thai/Chinese',
    tags: ['สมดุล', 'สองภาษา', 'การดำเนินชีวิต'],
    pdf_url: 'https://drive.google.com/file/d/1zHtGE-RjcjQGSKKekqCfbkSvjXMg4N_o/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 480,
    is_finished: true,
  },
  {
    id: 'b_htht',
    title: 'ศาสตร์แห่งสมาธิ (The Science of Meditation)',
    author_id: 'a1',
    description: 'ผู้ที่รักษาศีลดี ใจย่อมปลอดโปร่ง ไม่มีความเดือดร้อนใจ ทำให้ใจเป็นสมาธิได้ง่ายและสมาธิทำให้เกิดปัญญา จะเห็นได้ว่าสมาธิอยู่ในฐานะเป็นแกนกลาง นำเสนอหลักการทำสมาธิเชิงวิทยาศาสตร์และการปฏิบัติที่เข้าใจง่าย',
    category_id: 'c1',
    cover: '/images/books/the-science-of-meditation.jpg',
    publication_year: 2555,
    pages: 97,
    language: 'Thai',
    tags: ['ศาสตร์แห่งสมาธิ', 'The Science of Meditation', 'สมาธิ', 'การปฏิบัติธรรม', 'จิตตภาวนา'],
    pdf_url: 'https://drive.google.com/file/d/1ceambiyI8bjEqvGmXrkpKHpksCl6KIN_/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 950,
    is_finished: true,
  },
  {
    id: 'b_mogy',
    title: 'มังกรสอนใจ',
    author_id: 'a1',
    description: 'กว่า 5,000 ปีที่ผ่านมา ประเทศจีนเป็นหนึ่งใน 4 อาณาจักรโบราณ ที่มีวัฒนธรรมสืบทอดมายาวนาน ซึ่งสิ่งที่ทำให้จีนสามารถรักษาเอกลักษณ์และยิ่งใหญ่มาได้จนจวบเท่าทุกวันนี้ก็คือ “คำสอน” ที่สืบทอดมารุ่นแล้วรุ่นเล่า',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/mogy/files/shot.jpg',
    publication_year: 2567,
    pages: 112,
    language: 'Thai',
    tags: ['มังกรสอนใจ', 'พัฒนาตนเอง', 'ข้อคิด'],
    pdf_url: 'https://drive.google.com/file/d/1Lt058orFaz1M1fGkIDc1KstQdNO24CaI/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 530,
    is_finished: true,
  },
  {
    id: 'b_xith',
    title: 'ข้อคิดรอบตัว',
    author_id: 'a1',
    description: 'ในการดำเนินชีวิตประกอบธุรกิจการงาน ให้ประสบความสำเร็จเท่านั้น แต่ยังช่วยเปิดโลกทัศน์ให้กับผู้อ่านได้อย่างกว้างขวาง อีกทั้งยังสามารถนำพาชีวิต ให้ก้าวไปในยุคโลกไร้พรมแดน ได้อย่างมีความสุข',
    category_id: 'c4',
    cover: '/images/books/kho-khit-rop-tua.jpg',
    publication_year: 2555,
    pages: 82,
    language: 'Thai',
    tags: ['ข้อคิดรอบตัว', 'การดำเนินชีวิต', 'ธุรกิจ', 'พัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/117Q4npBCsTVMGxRt30TGI1RnBCDDdTWQ/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 390,
    is_finished: true,
  },
  {
    id: 'b_hmzk',
    title: 'อย่ามโน รักแท้มันใหญ่มาก',
    author_id: 'a1',
    description: 'ความรักเป็นสิ่งที่มีผลต่อชีวิตมาก บางคนรักเป็น ได้คู่ครองดี เสริมส่งชีวิตให้เจริญรุ่งเรือง บางคนรักไม่เป็น ทำให้มีปัญหาชีวิตมากมาย หนังสือเล่มนี้จึงตั้งใจนำหลักธรรมของพระสัมมาสัมพุทธเจ้ามาเป็นแสงธรรมนำทาง',
    category_id: 'c5',
    cover: 'https://online.pubhtml5.com/vasxl/hmzk/files/shot.jpg',
    publication_year: 2567,
    pages: 158,
    language: 'Thai',
    tags: ['ความรัก', 'ครอบครัว', 'คู่ชีวิต'],
    pdf_url: 'https://drive.google.com/file/d/10qPuIeb6qDu_yBvy5hfW2NVz90CTL4Bw/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1100,
    is_finished: true,
  },
  {
    id: 'b_odbw',
    title: 'พระไตรปิฎก ฉบับธรรมชัย',
    author_id: 'a1',
    description: 'พระไตรปิฎกฉบับธรรมชัยนี้จึงเป็นเสมือนการรวมเอาความวิริยอุตสาหะของพระเถรานุเถระและชาวพุทธในอดีตที่สืบทอดคำสอนมาถึงเรา ประสานเข้ากับความรู้ ความสามารถของนักวิชาการบาลีจากทั่วโลกในยุคปัจจุบัน',
    category_id: 'c6',
    cover: 'https://online.pubhtml5.com/vasxl/odbw/files/shot.jpg',
    publication_year: 2567,
    pages: 58,
    language: 'Thai',
    tags: ['พระไตรปิฎก', 'ธรรมชัย', 'พระพุทธศาสนา'],
    pdf_url: 'https://drive.google.com/file/d/1QEioFQhAdUbaf2Izy4MGUBS-XKY3LrUp/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 1450,
    is_finished: true,
  },
  {
    id: 'b_ibby',
    title: 'ขัดเกลาความคิด',
    author_id: 'a1',
    description: '“ขัดเกลาความคิด” คือ หนังสือที่เรียบเรียงมาจากรายการเทศนาธรรม “ทันโลกทันธรรม” และ “ข้อคิดรอบตัว” โดยพระมหาสมชาย ฐานวุฒฺโฒ มีเนื้อหาเกี่ยวกับหลักคิด ในการปรับทัศนคติเพื่อการดำเนินชีวิตที่ดีขึ้น',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/ibby/files/shot.jpg',
    publication_year: 2567,
    pages: 120,
    language: 'Thai',
    tags: ['ขัดเกลาความคิด', 'ทันโลกทันธรรม', 'ทัศนคติ'],
    pdf_url: 'https://drive.google.com/file/d/1i_lROJUFHQkTqGI6nU_Y59xkHjr_YJLE/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 670,
    is_finished: true,
  },
  {
    id: 'b_lsrx',
    title: 'เส้นทางพระบรมโพธิสัตว์',
    author_id: 'a1',
    description: 'หนังสือเล่มนี้ จะสร้างแรงบันดาลใจให้เรา ใช้ชีวิตที่เกิดมาเป็นคนให้คุ้มค่า เป็นการเริ่มต้นวิ่งมาราธอนแบบศิษย์มีครู แล้วเราก็จะได้เริ่มเข้าสู่เส้นทางพระบรมโพธิสัตว์',
    category_id: 'c6',
    cover: 'https://online.pubhtml5.com/vasxl/lsrx/files/shot.jpg',
    publication_year: 2567,
    pages: 96,
    language: 'Thai',
    tags: ['พระโพธิสัตว์', 'แรงบันดาลใจ', 'การสร้างบารมี'],
    pdf_url: '/books/pdf/เส้นทางพระบรมฯ.pdf',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 820,
    is_finished: true,
  },
  {
    id: 'b_vhld',
    title: 'ไขปัญหาความเชื่อ',
    author_id: 'a1',
    description: '“ไขปัญหาความเชื่อ” คือ หนังสือที่รวบรวมเนื้อหาจากรายการธรรมเทศนาของพระมหาสมชาย ฐานวุฒฺโฒ M.D.; Ph.D. ที่มีเนื้อหาเกี่ยวเนื่องกันในเรื่องความเชื่อ อดีตชาติ การแก้กรรมชีวิตหลัง ความตาย และข้อคิดจากความตาย เป็นต้น',
    category_id: 'c4',
    cover: 'https://online.pubhtml5.com/vasxl/vhld/files/shot.jpg',
    publication_year: 2567,
    pages: 140,
    language: 'Thai',
    tags: ['ไขปัญหาความเชื่อ', 'กฎแห่งกรรม', 'ข้อคิด'],
    pdf_url: 'https://drive.google.com/file/d/1L7Ld6hb265P4zoz6Lw32uRqdvk2FcF31/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 910,
    is_finished: true,
  },
  {
    id: 'b_coyx',
    title: 'ทันโลกทันธรรม เล่ม 5',
    author_id: 'a1',
    description: 'โลกแห่งเทคโนโลยีก้าวล้ำนำยุคเพียงใด ธรรมกลับดำรงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/coyx/files/shot.jpg',
    publication_year: 2567,
    pages: 117,
    language: 'Thai',
    tags: ['ทันโลกทันธรรม', 'เทคโนโลยี', 'การพัฒนาตนเอง'],
    pdf_url: 'https://online.pubhtml5.com/vasxl/coyx/',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 540,
    is_finished: true,
  },
  {
    id: 'b_rlag',
    title: 'ทันโลกทันธรรม เล่ม 4',
    author_id: 'a1',
    description: 'โลกแห่งเทคโนโลยีก้าวล้ำนำยุคเพียงใด ธรรมกลับดำรงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/rlag/files/shot.jpg',
    publication_year: 2567,
    pages: 105,
    language: 'Thai',
    tags: ['ทันโลกทันธรรม', 'เทคโนโลยี', 'การพัฒนาตนเอง'],
    pdf_url: 'https://online.pubhtml5.com/vasxl/rlag/',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 490,
    is_finished: true,
  },
  {
    id: 'b_hmdf',
    title: 'ทันโลกทันธรรม เล่ม 3',
    author_id: 'a1',
    description: 'โลกแห่งเทคโนโลยีก้าวล้ำนำยุคเพียงใด ธรรมกลับดำรงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/hmdf/files/shot.jpg',
    publication_year: 2567,
    pages: 108,
    language: 'Thai',
    tags: ['ทันโลกทันธรรม', 'เทคโนโลยี', 'การพัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/123Hi9ITJn3vKNncVTuJMkCw_fi8YL3P2/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 460,
    is_finished: true,
  },
  {
    id: 'b_ngwr',
    title: 'ทันโลกทันธรรม เล่ม 2',
    author_id: 'a1',
    description: 'โลกแห่งเทคโนโลยีก้าวล้ำนำยุคเพียงใด ธรรมกลับดำรงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/ngwr/files/shot.jpg',
    publication_year: 2567,
    pages: 107,
    language: 'Thai',
    tags: ['ทันโลกทันธรรม', 'เทคโนโลยี', 'การพัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/196lVD54DoTt7t75O-NdNTC_QxiJVbktx/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 430,
    is_finished: true,
  },
  {
    id: 'b_iipo',
    title: 'ทันโลกทันธรรม เล่ม 1',
    author_id: 'a1',
    description: 'โลกแห่งเทคโนโลยีก้าวล้ำนำยุคเพียงใด ธรรมกลับดำรงอยู่อย่างไม่เคยล้าสมัยทั้งที่ทุกสิ่งในโลกล้วนเปลี่ยนแปลงไป',
    category_id: 'c2',
    cover: 'https://online.pubhtml5.com/vasxl/iipo/files/shot.jpg',
    publication_year: 2567,
    pages: 101,
    language: 'Thai',
    tags: ['ทันโลกทันธรรม', 'เทคโนโลยี', 'การพัฒนาตนเอง'],
    pdf_url: 'https://drive.google.com/file/d/1SRz5ymp-JERKZ1gAdXZrPexn7SBsjZGF/preview',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 410,
    is_finished: true,
  },
  {
    id: 'b_eltt',
    title: 'อายุวัฒนมงคล 63 ปี 40 พรรษา',
    author_id: 'a1',
    description: 'อายุวัฒนมงคล 63 ปี 40 พรรษา พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    category_id: 'c6',
    cover: 'https://online.pubhtml5.com/vasxl/eltt/files/shot.jpg',
    publication_year: 2567,
    pages: 52,
    language: 'Thai',
    tags: ['อายุวัฒนมงคล', 'ประวัติ', 'ธรรมะบรรณาการ'],
    pdf_url: 'https://online.pubhtml5.com/vasxl/eltt/',
    status: 'published',
    view_count: 0,
    read_count: 0,
    like_count: 730,
    is_finished: true,
  }
];

export const articles: Article[] = [
  {
    id: 'ar1',
    title: 'วิธีจัดการความเครียดด้วยสมาธิ',
    description: 'ความเครียดจากการทำงานสามารถบรรเทาได้ด้วยการทำสมาธิวันละ 10 นาที',
    content: '<p>ความเครียดเป็นสิ่งที่หลีกเลี่ยงได้ยากในสังคมปัจจุบัน การทำสมาธิเพียงวันละ 10 นาที...</p>',
    thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
    category_id: 'c1',
    author_id: 'a1',
    published_date: '2023-10-15T08:00:00Z',
    tags: ['สมาธิ', 'ความเครียด', 'คนทำงาน'],
    view_count: 0,
    like_count: 85,
    is_finished: true
  }
];

export const videos: Video[] = [
  {
    id: 'vid-01',
    title: 'สูตรลับความสำเร็จ | ไขข้อสงสัย ep.475',
    description: 'หลักอิทธิบาท 4 (ฉันทะ วิริยะ จิตตะ วิมังสา) นำมาปรับใช้ในการทำงานยุคใหม่ โดย พระอาจารย์สมชาย ฐานวุฑฺโฒ (พระครูปลัดสุวัฒนโพธิคุณ)',
    thumbnail: 'https://img.youtube.com/vi/CwelH4QSZqY/hqdefault.jpg',
    video_url: 'https://www.youtube.com/watch?v=CwelH4QSZqY',
    duration: '02:08',
    category_id: 'c1',
    tags: ['สูตรลับความสำเร็จ', 'อิทธิบาท 4', 'การทำงาน', 'พระอาจารย์สมชาย ฐานวุฑโฒ'],
    view_count: 5930,
    like_count: 480,
    is_finished: false,
    published_date: '2026-09-25'
  },
  {
    id: 'vid-02',
    title: 'ยมทูตในนรก มีอายุขัยไหม | EP 2575',
    description: 'ถอดบทเรียนเรื่องชีวิตหลังความตาย หน้าที่และอายุขัยของยมทูตในภพภูมิต่างๆ ตามหลักพระพุทธศาสนาและกฎแห่งกรรมที่ทุกคนควรรู้',
    thumbnail: 'https://img.youtube.com/vi/0Iv-fU_0g0k/hqdefault.jpg',
    video_url: 'https://www.youtube.com/watch?v=0Iv-fU_0g0k',
    duration: '14:35',
    category_id: 'c6',
    tags: ['ยมทูต', 'ภพภูมิ', 'นรก', 'สวรรค์', 'กฎแห่งกรรม'],
    view_count: 24630,
    like_count: 1450,
    is_finished: false,
    published_date: '2025-09-18'
  },
  {
    id: 'vid-03',
    title: 'ช่วยเหลือสังคมแล้วไม่มีใครเห็นคุณค่า ทำอย่างไร',
    description: 'หลักการวางใจในการทำงานเพื่อส่วนรวม ทำความดีโดยไม่ติดในคำสรรเสริญหรือคำนินทา มุ่งเน้นการสะสมบุญบารมีเพื่อความสุขแท้จริงภายใน',
    thumbnail: 'https://img.youtube.com/vi/xlSvndB52PQ/hqdefault.jpg',
    video_url: 'https://www.youtube.com/watch?v=xlSvndB52PQ',
    duration: '11:45',
    category_id: 'c1',
    tags: ['ทำความดี', 'ช่วยเหลือสังคม', 'กำลังใจ', 'ปิดทองหลังพระ'],
    view_count: 3710,
    like_count: 310,
    is_finished: false,
    published_date: '2025-08-30'
  },
  {
    id: 'vid-08',
    title: 'ทำผิดครั้งเดียวจำกันดี | EP 2571',
    description: 'ทำดีเป็นร้อยครั้งคนมองข้าม แต่ทำผิดครั้งเดียวกลับจำฝังใจ อุปมาเรื่องอาหารดีร้อยมื้อกับอาหารเป็นพิษมื้อเดียว และการเปลี่ยนความคับแค้นใจเป็นยิ้มสู้ทำความดีต่อไป',
    thumbnail: 'https://img.youtube.com/vi/ZT6GOQOGXns/hqdefault.jpg',
    video_url: 'https://www.youtube.com/watch?v=ZT6GOQOGXns',
    duration: '09:30',
    category_id: 'c2',
    tags: ['จิตวิทยา', 'ข้อคิดชีวิต', 'พัฒนาตนเอง', 'ปล่อยวาง'],
    view_count: 4780,
    like_count: 420,
    is_finished: false,
    published_date: '2025-10-10'
  },
  {
    id: 'vid-09',
    title: 'เริ่มงานใหม่ถูกติฉินนินทา ควรวางใจอย่างไร',
    description: 'ผู้ชี้โทษคือผู้ชี้ขุมทรัพย์ ถอดอีโก้ออกเหมือนพระเจ้าปีเตอร์มหาราชที่ปลอมตัวเป็นกรรมกรอู่ต่อเรือ เพื่อเปิดใจเรียนรู้และพัฒนาตนเองอย่างแท้จริง',
    thumbnail: 'https://img.youtube.com/vi/LQOcD2vKQHY/hqdefault.jpg',
    video_url: 'https://www.youtube.com/watch?v=LQOcD2vKQHY',
    duration: '10:15',
    category_id: 'c2',
    tags: ['การทำงาน', 'คนทำงาน', 'วางอีโก้', 'นินทา'],
    view_count: 2330,
    like_count: 215,
    is_finished: false,
    published_date: '2025-09-28'
  },
  {
    id: 'vid-18',
    title: 'ทำไมเพื่อนไม่อยากคบ หาสาเหตุและวิธีแก้ไข | ไขข้อสงสัย ep.486',
    description: 'ตรวจสอบพฤติกรรมตนเองด้วยสังคหวัตถุ 4 (ทาน ปิยวาจา อัตถจริยา สมานัตตตา) แก้ไขวาจาและอารมณ์เพื่อให้เป็นที่รักของหมู่คณะ',
    thumbnail: 'https://img.youtube.com/vi/U4umw1r_aeE/hqdefault.jpg',
    video_url: 'https://www.youtube.com/watch?v=U4umw1r_aeE',
    duration: '02:14',
    category_id: 'c1',
    tags: ['เพื่อน', 'มนุษยสัมพันธ์', 'สังคหวัตถุ 4', 'ปิยวาจา'],
    view_count: 647,
    like_count: 85,
    is_finished: false,
    published_date: '2026-10-21'
  }
];

export const audios: Audio[] = [
  {
    id: 'au1',
    title: 'เสียงอ่านหนังสือ: ทางแห่งความสุข ตอนที่ 1',
    description: 'เสียงบรรยายเนื้อหาหนังสือ ทางแห่งความสุข บทนำและตอนที่ 1',
    duration: '15:30',
    audio_url: '/mock/audio.mp3',
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
    category_id: 'c3',
    book_id: 'b1',
    view_count: 0,
    like_count: 210,
    is_finished: true
  }
];

export const users: User[] = [
  {
    id: 'u1',
    name: 'Somchai User',
    email: 'user@example.com',
    profile_image: 'https://ui-avatars.com/api/?name=Somchai+User&background=D97706&color=fff',
    role: 'user'
  }
];

export const promotions: Promotion[] = [
  {
    id: 'p1',
    title: 'หนังสือแนะนำประจำสัปดาห์',
    description: 'เจริญสติในชีวิตประจำวัน - คู่มือการฝึกสติสำหรับคนยุคใหม่',
    image: 'https://images.unsplash.com/photo-1456953180671-730de08edaa7?w=1200&q=80',
    target_url: '/books/b2',
    type: 'book'
  }
];
