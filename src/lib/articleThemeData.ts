/**
 * ข้อมูลธีม สติ๊กเกอร์ และภาพประกอบทางธรรมะสำหรับระบบข้อคิดธรรมะ (Dhamma Insights Thematic Visuals)
 * เพิ่มสีสัน ความน่าสนใจ และสติ๊กเกอร์ที่สอดคล้องกับแก่นธรรมแต่ละเรื่อง ไม่ให้หน้าต่างข้อคิดธรรมะดูโล่ง
 */

export interface ArticleTheme {
  id: string;
  stickerEmoji: string;
  stickerTitle: string;
  themeColor: 'amber' | 'sky' | 'emerald' | 'rose' | 'purple' | 'indigo' | 'teal';
  bgGradient: string;
  borderAccent: string;
  badgeBg: string;
  badgeText: string;
  illustrationSvg: string; // SVG icon or stylized dhamma art
  bannerGradient: string;
  readingMinutes: number;
  featuredQuote: string;
  quoteAuthor: string;
  keyStickers: {
    emoji: string;
    title: string;
    desc: string;
  }[];
}

const DEFAULT_THEME: ArticleTheme = {
  id: 'default',
  stickerEmoji: '🌸',
  stickerTitle: 'ปัญญาธรรมนำทาง',
  themeColor: 'amber',
  bgGradient: 'from-amber-500/15 via-orange-500/10 to-amber-100/40',
  borderAccent: 'border-amber-300',
  badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
  badgeText: 'สาระธรรมสร้างปัญญา',
  illustrationSvg: 'lotus',
  bannerGradient: 'from-amber-600 via-amber-500 to-orange-500',
  readingMinutes: 4,
  featuredQuote: 'สติคือเกราะคุ้มกันจิต ปัญญาคือแสงสว่างนำทางชีวิต',
  quoteAuthor: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
  keyStickers: [
    { emoji: '💡', title: 'จุดประกายปัญญา', desc: 'ทำความเข้าใจต้นเหตุของปัญหาอย่างมีสติ' },
    { emoji: '🧘', title: 'ฝึกจิตให้ตั้งมั่น', desc: 'สร้างความสงบภายในใจก่อนเริ่มลงมือแก้ไข' },
    { emoji: '🌱', title: 'สร้างเหตุแห่งความสุข', desc: 'ลงมือทำความดีอย่างต่อเนื่องสม่ำเสมอ' }
  ]
};

/**
 * ฐานข้อมูลสติ๊กเกอร์และธีมเฉพาะของแต่ละข้อคิดธรรมะ (Matching Dhamma Topics)
 */
export const ARTICLE_THEMES: Record<string, Partial<ArticleTheme>> = {
  // สำนึกผิดอย่างไรให้เกิดผล
  'dhamma_037': {
    stickerEmoji: '🕊️',
    stickerTitle: 'อภัยทาน & ก้าวต่อไป',
    themeColor: 'teal',
    bgGradient: 'from-teal-500/15 via-emerald-500/10 to-sky-100/40',
    borderAccent: 'border-teal-300',
    badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
    badgeText: 'การให้อภัย & จิตวิทยา',
    illustrationSvg: 'dove',
    bannerGradient: 'from-teal-600 via-teal-500 to-emerald-600',
    readingMinutes: 5,
    featuredQuote: 'การสำนึกผิดที่แท้จริง ไม่ใช่การลงโทษตนเอง แต่คือการยอมรับความจริงอย่างกล้าหาญ เรียนรู้ และปรับปรุงเพื่อก้าวต่อไป',
    quoteAuthor: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    keyStickers: [
      { emoji: '🕊️', title: 'Healthy Guilt', desc: 'สำนึกผิดเพื่อแก้ไขพฤติกรรม ไม่ใช่เพื่อกักขังตนเอง' },
      { emoji: '🛡️', title: 'โยนิโสมนสิการ', desc: 'พิจารณาต้นเหตุ กลางเหตุ ปลายเหตุอย่างรอบคอบ' },
      { emoji: '✨', title: 'เริ่มต้นใหม่', desc: 'เปลี่ยนวิธีการลงมือทำ เพื่อผลลัพธ์ใหม่ที่ดีขึ้น' }
    ]
  },

  // ทำไมพม่าถอดรองเท้าเข้าวัด
  'dhamma_036': {
    stickerEmoji: '🛕',
    stickerTitle: 'เคารพพระรัตนตรัย',
    themeColor: 'amber',
    bgGradient: 'from-amber-500/20 via-yellow-500/10 to-orange-100/40',
    borderAccent: 'border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    badgeText: 'พระวินัย & มหาศรัทธา',
    illustrationSvg: 'pagoda',
    bannerGradient: 'from-amber-600 via-yellow-600 to-amber-700',
    readingMinutes: 6,
    featuredQuote: 'ความนอบน้อมต่อพระรัตนตรัย คือบ่อเกิดแห่งบุญญานุภาพและมงคลชีวิตอันสูงสุด',
    quoteAuthor: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    keyStickers: [
      { emoji: '🛕', title: 'เขตศักดิ์สิทธิ์', desc: 'พระอุโบสถและพัทธสีมา ต้องรักษาความเคารพสูงสุด' },
      { emoji: '🙏', title: 'กาย วาจา ใจ', desc: 'ถอดความเย่อหยิ่งทิฏฐิออกไป ก่อนก้าวเข้าสู่แดนธรรม' },
      { emoji: '✨', title: 'พลังแห่งศรัทธา', desc: 'บทเรียนประวัติศาสตร์ชเวดากองสู้ด้วยความนอบน้อม' }
    ]
  },

  // ดับความโกรธ
  'dhamma_035': {
    stickerEmoji: '🌊',
    stickerTitle: 'น้ำดับไฟโทสะ',
    themeColor: 'sky',
    bgGradient: 'from-sky-500/15 via-blue-500/10 to-indigo-100/40',
    borderAccent: 'border-sky-300',
    badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
    badgeText: 'ระงับโทสะ & เมตตาบารมี',
    illustrationSvg: 'water',
    bannerGradient: 'from-sky-600 via-blue-600 to-indigo-600',
    readingMinutes: 4,
    featuredQuote: 'ผู้ชนะความโกรธด้วยความไม่โกรธ คือผู้ชนะที่แท้จริงในสังสารวัฏ',
    quoteAuthor: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    keyStickers: [
      { emoji: '🧘', title: 'รู้ทันอารมณ์', desc: 'หายใจเข้าลึกๆ หยุดเปล่งวาจาขณะใจกำลังร้อน' },
      { emoji: '💖', title: 'แผ่เมตตา', desc: 'มองเพื่อนมนุษย์เป็นเพื่อนร่วมทุกข์เกิดแก่เจ็บตาย' },
      { emoji: '🛡️', title: 'ไม่ส่งต่อไฟ', desc: 'ดับความขัดแย้งที่ใจเรา ไม่เติมเชื้อไฟให้ลุกลาม' }
    ]
  },

  // กฎแห่งกรรม
  'dhamma_034': {
    stickerEmoji: '⚖️',
    stickerTitle: 'กฎแห่งกรรมเที่ยงตรง',
    themeColor: 'purple',
    bgGradient: 'from-purple-500/15 via-indigo-500/10 to-violet-100/40',
    borderAccent: 'border-purple-300',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
    badgeText: 'กฎธรรมชาติสากล',
    illustrationSvg: 'scale',
    bannerGradient: 'from-purple-600 via-indigo-600 to-purple-700',
    readingMinutes: 5,
    featuredQuote: 'หว่านพืชเช่นใดย่อมได้ผลเช่นนั้น ทำดีย่อมได้ดี ทำชั่วย่อมได้ชั่ว เป็นกฎธรรมชาติที่เที่ยงธรรมที่สุด',
    quoteAuthor: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    keyStickers: [
      { emoji: '🌱', title: 'เจตนาคือกรรม', desc: 'ทุกความคิด คำพูด และการกระทำ ล้วนมีผลสะท้อนกลับ' },
      { emoji: '⚖️', title: 'วิบากตามกาล', desc: 'กรรมบางอย่างให้ผลทันที บางอย่างรอคอยจังหวะที่เหมาะสม' },
      { emoji: '💎', title: 'สั่งสมบุญ', desc: 'สร้างบุญกุศลเป็นเสบียงนำพาชีวิตสู่ความสุขสวัสดี' }
    ]
  },

  // นิยาม 5
  'dhamma_033': {
    stickerEmoji: '🌿',
    stickerTitle: 'กฎสากล 5 ประการ',
    themeColor: 'emerald',
    bgGradient: 'from-emerald-500/15 via-teal-500/10 to-green-100/40',
    borderAccent: 'border-emerald-300',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    badgeText: 'พุทธศาสตร์ & วิทยาศาสตร์',
    illustrationSvg: 'leaf',
    bannerGradient: 'from-emerald-600 via-teal-600 to-emerald-700',
    readingMinutes: 6,
    featuredQuote: 'นิยาม 5 ครอบคลุมกฎจักรวาลทั้งกายภาพ ชีววิทยา จิตใจ การกระทำ และกฎแห่งเหตุปัจจัย',
    quoteAuthor: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    keyStickers: [
      { emoji: '🌍', title: 'อุตุนิยาม', desc: 'กฎฟิสิกส์ สภาพแวดล้อม ฤดูกาล วัตถุ' },
      { emoji: '🧬', title: 'พีชนิยาม', desc: 'กฎพันธุกรรม สิ่งมีชีวิต การเติบโต' },
      { emoji: '🧠', title: 'จิตตนิยาม', desc: 'กลไกกระบวนการทางจิตและเจตสิก' },
      { emoji: '⚖️', title: 'กรรมนิยาม', desc: 'กฎแห่งเจตนา การกระทำ และผลของกรรม' },
      { emoji: '📜', title: 'ธรรมนิยาม', desc: 'กฎแห่งเหตุและผลสากล (อิทัปปัจจยตา)' }
    ]
  }
};

/**
 * ดึงข้อมูลสติ๊กเกอร์และธีมสำหรับบทความ
 */
export function getArticleTheme(articleId: string, title = '', tags: string[] = []): ArticleTheme {
  const direct = ARTICLE_THEMES[articleId];
  if (direct) {
    return { ...DEFAULT_THEME, ...direct };
  }

  const combined = (title + ' ' + tags.join(' ')).toLowerCase();

  // จัดกลุ่มตามเนื้อหาอัตโนมัติ
  if (combined.includes('สมาธิ') || combined.includes('ฟุ้งซ่าน') || combined.includes('จิต')) {
    return {
      ...DEFAULT_THEME,
      stickerEmoji: '🧘',
      stickerTitle: 'ฝึกสมาธิพัฒนาจิต',
      themeColor: 'teal',
      bgGradient: 'from-teal-500/15 via-emerald-500/10 to-cyan-100/40',
      borderAccent: 'border-teal-300',
      badgeBg: 'bg-teal-100 text-teal-900 border-teal-300',
      badgeText: 'การปฏิบัติสมาธิภาวนา',
      bannerGradient: 'from-teal-600 via-emerald-600 to-teal-700',
      featuredQuote: 'ใจที่หยุดนิ่ง คือจุดเริ่มต้นของความสุขและพลังสร้างสรรค์อันไร้ขีดจำกัด'
    };
  }

  if (combined.includes('รัก') || combined.includes('ครอบครัว') || combined.includes('คู่ชีวิต') || combined.includes('แม่')) {
    return {
      ...DEFAULT_THEME,
      stickerEmoji: '💖',
      stickerTitle: 'ความรัก & ครอบครัวอบอุ่น',
      themeColor: 'rose',
      bgGradient: 'from-rose-500/15 via-pink-500/10 to-rose-100/40',
      borderAccent: 'border-rose-300',
      badgeBg: 'bg-rose-100 text-rose-900 border-rose-300',
      badgeText: 'ธรรมะความรัก & ครอบครัว',
      bannerGradient: 'from-rose-600 via-pink-600 to-rose-700',
      featuredQuote: 'รักแท้คือความปรารถนาดีที่อยากเห็นคนที่เรารักมีความสุข โดยไม่หวังสิ่งตอบแทน'
    };
  }

  if (combined.includes('กรรม') || combined.includes('นรก') || combined.includes('สวรรค์') || combined.includes('บาป') || combined.includes('บุญ')) {
    return {
      ...DEFAULT_THEME,
      stickerEmoji: '⚖️',
      stickerTitle: 'กฎแห่งกรรม & บุญบารมี',
      themeColor: 'purple',
      bgGradient: 'from-purple-500/15 via-indigo-500/10 to-violet-100/40',
      borderAccent: 'border-purple-300',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      badgeText: 'กฎแห่งกรรม & ผลวิบาก',
      bannerGradient: 'from-purple-600 via-indigo-600 to-purple-700',
      featuredQuote: 'บุญเป็นเงาตามตัว บาปเป็นเงาตามหลัง สิ่งที่เราสร้างไว้ไม่เคยสูญหายไปไหน'
    };
  }

  if (combined.includes('งาน') || combined.includes('สำเร็จ') || combined.includes('อิทธิบาท') || combined.includes('เป้าหมาย')) {
    return {
      ...DEFAULT_THEME,
      stickerEmoji: '🏆',
      stickerTitle: 'อิทธิบาท 4 สู่ความสำเร็จ',
      themeColor: 'sky',
      bgGradient: 'from-sky-500/15 via-blue-500/10 to-cyan-100/40',
      borderAccent: 'border-sky-300',
      badgeBg: 'bg-sky-100 text-sky-900 border-sky-300',
      badgeText: 'การทำงาน & ความสำเร็จ',
      bannerGradient: 'from-sky-600 via-blue-600 to-sky-700',
      featuredQuote: 'ฉันทะรักในงาน วิริยะเพียรไม่ถอย จิตตะจดจ่อตั้งมั่น วิมังสาใช้ปัญญาปรับปรุง'
    };
  }

  if (combined.includes('เครียด') || combined.includes('ทุกข์') || combined.includes('ปล่อยวาง') || combined.includes('ใจ')) {
    return {
      ...DEFAULT_THEME,
      stickerEmoji: '🍃',
      stickerTitle: 'ปลดล็อกใจคลายทุกข์',
      themeColor: 'emerald',
      bgGradient: 'from-emerald-500/15 via-teal-500/10 to-green-100/40',
      borderAccent: 'border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      badgeText: 'คลายเครียด & กำลังใจ',
      bannerGradient: 'from-emerald-600 via-teal-600 to-emerald-700',
      featuredQuote: 'สุขหรือทุกข์ไม่ได้อยู่ที่เรื่องราวรอบตัว แต่อยู่ที่วิธีที่เราเลือกวางใจ'
    };
  }

  return DEFAULT_THEME;
}

