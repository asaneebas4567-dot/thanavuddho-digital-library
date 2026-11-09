const fs = require('fs');
const path = require('path');

const catalogFile = path.join(__dirname, '..', 'src', 'data', 'rewardsCatalog.json');
const catalog = JSON.parse(fs.readFileSync(catalogFile, 'utf-8'));

const imageMap = {
  'rew-1001': '/images/rewards/bookmark-mongkol.jpg',
  'rew-1002': '/images/rewards/postcards-dhamma.jpg',
  'rew-1003': '/images/rewards/stickers-library.jpg',
  'rew-1004': '/images/rewards/notebook-mindfulness.jpg',
  'rew-2501': '/images/rewards/executive-pen.jpg',
  'rew-2502': '/images/rewards/thermal-tumbler.jpg',
  'rew-2503': '/images/rewards/leather-journal.jpg',
  'rew-2504': '/images/rewards/keepsake-box.jpg',
  'rew-8501': '/images/rewards/commemorative-box.jpg',
  'rew-12001': '/images/rewards/powerbank-20000.jpg'
};

catalog.forEach(item => {
  if (imageMap[item.id]) {
    item.image = imageMap[item.id];
  }
  if (item.id === 'rew-2504') {
    item.title = 'ชุดกล่อง Boxset ของที่ระลึก Thanavuddho Keepsake Boxset';
    item.description = 'กล่องบ็อกเซ็ตคราฟต์พรีเมียมสีน้ำเงินเข้มปั๊มทองคำลายไทย ด้านในบุผ้าซาติน บรรจุหนังสือธรรมะและของที่ระลึกมงคลทรงคุณค่า';
    item.badge = 'Boxset ของที่ระลึก 🎁';
  }
  if (item.id === 'rew-2503') {
    item.title = 'สมุดบันทึกปกหนังลายพิเศษ ธรรมะคำสอนพระอาจารย์';
    item.description = 'สมุดบันทึกปกหนังแท้พรีเมียม สลักดวงตราธรรมจักรทองคำเค ภายในพิมพ์บทสวดมนต์และคติธรรมคำสอนคัดสรรของ พระครูปลัดสุวัฒนโพธิคุณ พร้อมหน้าบันทึกสมาธิภาวนา 192 หน้า';
    item.badge = 'ปกหนังลายธรรมะ ⭐';
  }
  if (item.id === 'rew-5006') {
    item.title = 'หนังสือเล่มจริง: เพราะไม่รู้...จึงต้องรู้ทันชีวิต';
    item.description = 'หนังสือธรรมะเล่มจริงอันทรงคุณค่า "เพราะไม่รู้...จึงต้องรู้ทันชีวิต" โดย พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) ไขปริศนาชีวิต เสริมภูมิคุ้มกันทางใจ รู้เท่าทันทุกสถานการณ์';
    item.image = '/images/books/phro-mai-roo-roo-than-cheewit.jpg';
    item.bookCover = '/images/books/phro-mai-roo-roo-than-cheewit.jpg';
    item.isBookCover = true;
    item.pastelTheme = 'cream';
    item.badge = 'ธรรมะรู้ทันชีวิต ⭐';
  }
});

fs.writeFileSync(catalogFile, JSON.stringify(catalog, null, 2), 'utf-8');
console.log('Successfully updated rewardsCatalog.json with photorealistic images!');

