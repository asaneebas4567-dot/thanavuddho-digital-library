import { PodcastItem } from '@/types/podcast';

export const INITIAL_PODCASTS: PodcastItem[] = [
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
      { time: '03:10', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ความสุขที่แท้จริงไม่ได้เกิดจากการวิ่งตามหาสิ่งของภายนอก แต่เกิดจากการหยุดนิ่งและพอใจในสิ่งที่เรามี' },
      { time: '08:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เมื่อใจสงบ ความสุขจะแผ่ซ่านออกมาเองโดยธรรมชาติ' }
    ]
  },
  {
    id: 'pod-tj-05',
    title: 'บทที่ 4: คนสุข คนไม่หลงโลก',
    description: 'มองทะลุภาพลวงตาของโลกธรรม 8 ทั้งลาภ ยศ สรรเสริญ สุข และความเสื่อม เพื่อสร้างจิตใจที่หนักแน่นไม่หวั่นไหว',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=M5Vq3gH1XGg',
    youtube_video_id: 'M5Vq3gH1XGg',
    duration_seconds: 1240,
    duration_formatted: '20:40',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '10 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 5,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 4: คนสุข คนไม่หลงโลก' },
      { time: '02:40', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'โลกธรรม 8 ประการ มีได้ก็มีเสีย มีสุขก็มีทุกข์ ผู้มีปัญญาจะไม่หลงระเริงเมื่อได้ และไม่สิ้นหวังเมื่อสูญเสีย' }
    ]
  },
  {
    id: 'pod-tj-06',
    title: 'บทที่ 5: มองข้าม ปัญหาเล็กๆ',
    description: 'เทคนิคการปล่อยวางเรื่องกวนใจในชีวิตประจำวัน ไม่เก็บเอาขยะอารมณ์มาใส่ใจ เพื่อรักษาพื้นที่ความสุขให้คงอยู่เสมอ',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=7uV_Z9F5Q9g',
    youtube_video_id: '7uV_Z9F5Q9g',
    duration_seconds: 1115,
    duration_formatted: '18:35',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '10 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 6,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 5: มองข้าม ปัญหาเล็กๆ' },
      { time: '01:50', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'หลายครั้งที่เราทุกข์ใจ ไม่ใช่เพราะปัญหาใหญ่โต แต่เพราะเราไปเก็บเอาเรื่องเล็กน้อยมาคิดซ้ำๆ' }
    ]
  },
  {
    id: 'pod-tj-07',
    title: 'บทที่ 6: คิดบวก สร้างโลกบวก',
    description: 'พลังของการคิดดี พูดดี และทำดี ที่จะส่งคลื่นพลังบวกไปสู่คนรอบข้างและเปลี่ยนสิ่งแวดล้อมให้น่าอยู่ขึ้น',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=8qD2C5x8pKo',
    youtube_video_id: '8qD2C5x8pKo',
    duration_seconds: 1410,
    duration_formatted: '23:30',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '10 พ.ย. 2569',
    book_id: 'book_tam_jai_hai_prom_buak',
    order: 7,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ยินดีต้อนรับสู่ ทำใจให้พร้อมบวก บทที่ 6: คิดบวก สร้างโลกบวก' },
      { time: '03:15', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'เมื่อเราเริ่มต้นคิดบวก อารมณ์เราจะดี คำพูดและการกระทำของเราก็จะส่งผลกระทบเชิงบวกต่อคนรอบข้าง' }
    ]
  },
  {
    id: 'pod-tj-08',
    title: 'บทสรุปส่งท้าย: เคล็ดลับสูงสุด... ใจพร้อมบวกตลอดไป',
    description: 'สรุปหัวใจสำคัญของหนังสือทำใจให้พร้อมบวก แนวทางปฏิบัติในชีวิตประจำวันเพื่อรักษาจิตใจให้ผ่องใสและพร้อมรับมือทุกสถานการณ์',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ) & YoKaWaJor',
    cover_image: '/images/books/tam-jai-hai-prom-buak.jpg',
    source_type: 'youtube',
    youtube_url: 'https://www.youtube.com/watch?v=9jP0K3LmNoP',
    youtube_video_id: '9jP0K3LmNoP',
    duration_seconds: 1540,
    duration_formatted: '25:40',
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
  // MP3 Audio Entries
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
  },
  {
    id: 'pod-mp3-02',
    title: 'บทสวดมนต์ทำวัตรเช้าและเจริญพระพุทธมนต์ (MP3)',
    description: 'บทสวดมนต์ทำวัตรเช้า สวดสรรเสริญพระรัตนตรัย เจริญสติและแผ่เมตตาจิต เพื่อความเป็นสิริมงคลเริ่มต้นวันใหม่อย่างผ่องใส',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ & คณะสงฆ์',
    cover_image: 'https://images.unsplash.com/photo-1545652985-5edd365b12eb?auto=format&fit=crop&q=80&w=800',
    source_type: 'mp3',
    audio_file_path: 'podcasts/morning-chanting-hq.mp3',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/gentle_rain.ogg',
    duration_seconds: 1200,
    duration_formatted: '20:00',
    category_id: 'cat_chanting',
    category_name: 'บทสวดมนต์ & พิธีกรรม',
    is_published: true,
    published_at: '11 พ.ย. 2569',
    order: 10,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'โย โส ภะคะวา อะระหัง สัมมาสัมพุทโธ...' },
      { time: '05:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'บทสวดสรรเสริญพระธรรมคุณ และพระสังฆคุณ' },
      { time: '12:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'แผ่เมตตาให้สรรพสัตว์ทั้งหลายเป็นสุขเป็นสุขเถิด' }
    ]
  },
  {
    id: 'pod-mp3-03',
    title: 'เสียงอ่านหนังสือ: เขาก็สุข เราก็สุข (ตอนที่ 1 นิยามแห่งความสุข)',
    description: 'เสียงอ่านหนังสือลิขสิทธิ์ฉบับเต็ม บันทึกเสียงคมชัด สำหรับการฟังสร้างพลังใจและเข้าใจความสุขรอบตัวอย่างแท้จริง',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: '/images/books/khao-kor-sook-rao-kor-sook.jpg',
    source_type: 'mp3',
    audio_file_path: 'podcasts/khao-suk-rao-suk-01.mp3',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/wind_in_trees.ogg',
    duration_seconds: 840,
    duration_formatted: '14:00',
    category_id: 'cat_mind',
    category_name: 'พัฒนาจิตใจ & คิดบวก',
    is_published: true,
    published_at: '11 พ.ย. 2569',
    book_id: 'book_khao_kor_sook_rao_kor_sook',
    order: 11,
    transcript: [
      { time: '00:00', speaker: 'ผู้บรรยาย', text: 'ยินดีต้อนรับสู่เสียงอ่านหนังสือ เขาก็สุข เราก็สุข โดย พระครูปลัดสุวัฒนโพธิคุณ' },
      { time: '02:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'ความสุขที่แท้จริงไม่เคยเบียดเบียนใคร แต่เป็นความสุขที่ยิ่งให้ยิ่งเพิ่มพูน' }
    ]
  },
  {
    id: 'pod-mp3-04',
    title: 'Thanavuddho Daily Dhamma: ข้อคิดชนะความเครียด (MP3)',
    description: 'ข้อคิดธรรมะสั้นๆ สำหรับคนทำงาน วิธีจัดการความเครียด อารมณ์ และความเหนื่อยล้าด้วยการกำหนดลมหายใจและวางใจให้เป็นกลาง',
    host: 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
    cover_image: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&q=80&w=800',
    source_type: 'mp3',
    audio_file_path: 'podcasts/daily-stress-free.mp3',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg',
    duration_seconds: 760,
    duration_formatted: '12:40',
    category_id: 'cat_work',
    category_name: 'การงาน & ความสำเร็จ',
    is_published: true,
    published_at: '11 พ.ย. 2569',
    order: 12,
    transcript: [
      { time: '00:00', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'สวัสดีทุกท่านยามเช้า วันนี้เรามาเรียนรู้วิธีคลายความกังวลใจและสร้างสมดุลชีวิต' },
      { time: '03:30', speaker: 'พระครูปลัดสุวัฒนโพธิคุณ', text: 'อย่าเอาใจไปแบกโลกทั้งใบ งานหนักก็ค่อยๆ แก้ทีละเปลาะ ใจสบายงานสำเร็จ' }
    ]
  },
  {
    id: 'pod-mp3-05',
    title: 'บทสวดธัมมจักกัปปวัตตนสูตร ทำนองสรภัญญะ (MP3)',
    description: 'บทสวดปฐมเทศนา หมุนกงล้อแห่งธรรมเพื่อสันติภาพภายในและสิริมงคลแก่ชีวิต ฟังได้ต่อเนื่องทุกที่ทุกเวลา',
    host: 'คณะสงฆ์วัดพระธรรมกาย & พุทธศาสนิกชน',
    cover_image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    source_type: 'mp3',
    audio_file_path: 'podcasts/dhammacakka-hq.mp3',
    audio_url: 'https://actions.google.com/sounds/v1/ambiences/meadow_morning.ogg',
    duration_seconds: 1010,
    duration_formatted: '16:50',
    category_id: 'cat_chanting',
    category_name: 'บทสวดมนต์ & พิธีกรรม',
    is_published: true,
    published_at: '11 พ.ย. 2569',
    order: 13,
    transcript: [
      { time: '00:00', speaker: 'คณะสงฆ์', text: 'เอวัมเม สุตัง เอกัง สะมะยัง ภะคะวา...' },
      { time: '06:00', speaker: 'คณะสงฆ์', text: 'อริยสัจ 4 ประการ ทุกข์ สมุทัย นิโรธ มรรค' }
    ]
  }
];

