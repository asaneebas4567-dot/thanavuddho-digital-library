import fs from 'fs';
import path from 'path';

// Load decoded drive files
const gdriveFiles = JSON.parse(fs.readFileSync('scripts/gdrive_files_decoded.json', 'utf8'));

// Map key keywords to drive file
function findDriveFile(book) {
  const title = (book.title || '').trim();
  const id = (book.id || '').trim();

  // 1. Direct ID / Special mappings
  if (title.includes('อย่ามโน') || id.includes('อย่ามโน') || id.includes('mano')) {
    return gdriveFiles.find(g => g.fileName.includes('มโน'));
  }
  if (title.includes('สมดุล = ดี') || title.includes('สมดุล ดี') || id === 'pubhtml5_77777174') {
    return gdriveFiles.find(g => g.fileName.includes('1485 สมดุล ดี'));
  }
  if (title.includes('สมดุลเท่ากับดี') || id.includes('สมดุลเท่ากับดี')) {
    return gdriveFiles.find(g => g.fileName.includes('สมดุลเท่ากับดี'));
  }
  if (title.includes('ทันโลก') && (title.includes('1') || id.includes('76550937') || id === 'b_iipo')) {
    return gdriveFiles.find(g => g.fileName.includes('ทันโลกทันธรรม1'));
  }
  if (title.includes('ทันโลก') && (title.includes('2') || id.includes('26910324') || id === 'b_ngwr')) {
    return gdriveFiles.find(g => g.fileName.includes('ทันโลกทันธรรม2'));
  }
  if (title.includes('ทันโลก') && (title.includes('3') || id.includes('86887339') || id === 'b_hmdf')) {
    return gdriveFiles.find(g => g.fileName.includes('ทันโลก ทันธรรม 3') || g.fileName.includes('ทันโลกทันธรรม3'));
  }
  if (title.includes('เพราะไม่รู้สินะ ตอน') || title.includes('รู้ทันชีวิต') || id.includes('roo_than_cheewit')) {
    return gdriveFiles.find(g => g.fileName.includes('รู้ทันชีวิต'));
  }
  if (title === 'เพราะไม่รู้สินะ' || id === 'pubhtml5_89966318' || id === 'b_prmr') {
    return gdriveFiles.find(g => g.fileName === 'เพราะไม่รู้สินะ.pdf');
  }
  if (title.includes('ทำใจให้พร้อมบวก') || id.includes('tam_jai') || id.includes('tham_jai')) {
    return gdriveFiles.find(g => g.fileName.includes('ทำใจให้พร้อมบวก'));
  }
  if (title.includes('ลมหายใจเข้าออก') || id.includes('lom_hai_jai')) {
    return gdriveFiles.find(g => g.fileName.includes('ลมหายใจเข้าออก'));
  }
  if (title.includes('มงคลชีวิต') || id.includes('mongkol')) {
    return gdriveFiles.find(g => g.fileName.includes('มงคลชีวิต'));
  }
  if (title.includes('อายุวัฒนมงคล') || id.includes('68205419') || id === 'b_fxfx') {
    return gdriveFiles.find(g => g.fileName.includes('อายุวัฒนมงคล'));
  }
  if (title.includes('อยู่สุข') || id.includes('yoo_sook') || id.includes('1505')) {
    return gdriveFiles.find(g => g.fileName.includes('อยู่สุขในยุคดิจิทัล'));
  }
  if (title.includes('ธรรมะ In Trend 4') || title.includes('DhammaIntrend4') || id.includes('47614051')) {
    return gdriveFiles.find(g => g.fileName.includes('DhammaIntrend4'));
  }
  if (title.includes('HOPE MAGAZINE') && (title.includes('18') || id.includes('74966671') || id === 'b_nrcy')) {
    return gdriveFiles.find(g => g.fileName.includes('HOPE MAGAZINE  VOL 18'));
  }
  if (title.includes('Love Myself') || title.includes('รักในตัวตน') || id.includes('love_myself') || id === 'b_lvms') {
    return gdriveFiles.find(g => g.fileName.includes('Love myself'));
  }
  if (title.toLowerCase().includes('perfectionist') || id.includes('perfectionist') || id.includes('72120023')) {
    return gdriveFiles.find(g => g.fileName.includes('perfectionist'));
  }
  if (title.includes('Secret of Love') || title.includes('รักลูก') || id.includes('secret_of_love') || id === 'b_scol') {
    return gdriveFiles.find(g => g.fileName.includes('secret of love'));
  }
  if (title.includes('The Lover') || title.includes('รักเป็นจะเห็นใจ') || id.includes('the_lover') || id === 'b_tlvr') {
    return gdriveFiles.find(g => g.fileName.includes('The lover'));
  }
  if (title.includes('กะเทาะเปลือกความทุกข์') || id.includes('กะเทาะเปลือก') || id.includes('52553956')) {
    return gdriveFiles.find(g => g.fileName.includes('กะเทาะเปลือกความทุกข์'));
  }
  if (title.includes('ขัดเกลาความคิด') || id.includes('33738617') || id === 'b_ibby') {
    return gdriveFiles.find(g => g.fileName.includes('ขัดเกลาความคิด'));
  }
  if (title.includes('ข้อคิดรอบตัว') || id.includes('kho_khit') || id === 'b_xith') {
    return gdriveFiles.find(g => g.fileName.includes('ข้อคิดรอบตัว'));
  }
  if (title.includes('ความรักรสอูมามิ') || title.includes('ความรัก รสอูมามิ') || id.includes('อูมามิ') || id.includes('33061266')) {
    return gdriveFiles.find(g => g.fileName.includes('ความรักรสอูมามิ'));
  }
  if (title.includes('ความลับของความรัก') || id.includes('ความลับของความรัก') || id.includes('69389552')) {
    return gdriveFiles.find(g => g.fileName.includes('ความลับของความรัก'));
  }
  if (title.includes('ความสุข 360') || id.includes('ความสุข-360') || id.includes('54194098')) {
    return gdriveFiles.find(g => g.fileName.includes('ความสุข 360 องศา'));
  }
  if (title.includes('ตามหลวงพี่ไปโกอินเตอร์') || id.includes('ตามหลวงพี่') || id.includes('51030141')) {
    return gdriveFiles.find(g => g.fileName.includes('ตามหลวงพี่ไปโกอินเตอร์'));
  }
  if (title.includes('พระไตรปิฎก') || id.includes('73733009') || id === 'b_cuhz') {
    return gdriveFiles.find(g => g.fileName.includes('พระไตรปิฎก'));
  }
  if (title.includes('มังกรสอนใจ') || id.includes('89759714') || id === 'b_tflj') {
    return gdriveFiles.find(g => g.fileName.includes('มังกรสอนใจ'));
  }
  if (title.includes('รักแท้ไม่ได้มีแค่ในนิยาย') || id.includes('rak_thae') || id === 'b_rkth') {
    return gdriveFiles.find(g => g.fileName.includes('รักเเท้ไม่ได้มีเเค่ในนิยาย'));
  }
  if (title.includes('ศาสตร์แห่งสมาธิ') || id === 'b_htht') {
    return gdriveFiles.find(g => g.fileName.includes('ศาสตร์เเห่งสมาธิ'));
  }
  if (title.includes('เขาก็สุข เราก็สุข') || id.includes('khao_kor_sook') || id === 'b_ksrs') {
    return gdriveFiles.find(g => g.fileName.includes('เขาก็สุข เราก็สุข'));
  }
  if (title.includes('เปิดพรมแดน') || id.includes('perd_promdan') || id === 'b_prmd') {
    return gdriveFiles.find(g => g.fileName.includes('เปิดพรมเเดนโลกเเห่งธรรม'));
  }
  if (title.includes('เส้นทางพระบรมฯ') || id.includes('56107314') || id === 'b_shpb') {
    return gdriveFiles.find(g => g.fileName.includes('เส้นทางพระบรมฯ'));
  }
  if (title.includes('ไขปัญหาความเชื่อ') || id.includes('87413061') || id === 'b_kpkw') {
    return gdriveFiles.find(g => g.fileName.includes('ไขปัญหาความเชื่อ'));
  }
  if (title.includes('โลกใหม่') || id.includes('lok_mai')) {
    return gdriveFiles.find(g => g.fileName.includes('โลกใหม่'));
  }

  return null;
}

// 1. UPDATE persistentBooks.json
const persistentPath = 'src/data/persistentBooks.json';
const pBooks = JSON.parse(fs.readFileSync(persistentPath, 'utf8'));
let pCount = 0;
for (const pb of pBooks) {
  const g = findDriveFile(pb);
  if (g) {
    pb.reader_url = g.reader_url;
    pb.source_url = g.source_url;
    pb.pdf_url = g.reader_url;
    pb.drive_file_id = g.fileId;
    pCount++;
    console.log(`[persistentBooks] "${pb.title}" -> "${g.fileName}" (${g.fileId})`);
  }
}
fs.writeFileSync(persistentPath, JSON.stringify(pBooks, null, 2), 'utf8');
console.log(`\n✅ persistentBooks.json updated: ${pCount} books`);

// 2. UPDATE src/data/mockData.ts
const mockPath = 'src/data/mockData.ts';
let mock = fs.readFileSync(mockPath, 'utf8');

// Match each book block in books: T.Book[] = [ ... ]
// Look for { id: '...', ... }
const blockRegex = /\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?\n\s*\},/g;
let mockCount = 0;
mock = mock.replace(blockRegex, (block, id) => {
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : '';
  const g = findDriveFile({ id, title });
  if (g) {
    mockCount++;
    console.log(`[mockData.ts] [${id}] "${title}" -> "${g.fileName}" (${g.fileId})`);
    let updated = block;
    if (updated.includes('reader_url:')) {
      updated = updated.replace(/reader_url:\s*['"][^'"]*['"]/, `reader_url: '${g.reader_url}'`);
    } else {
      updated = updated.replace(/page_count:\s*\d+,/, `page_count: 100,\n    reader_url: '${g.reader_url}',`);
    }
    if (updated.includes('source_url:')) {
      updated = updated.replace(/source_url:\s*['"][^'"]*['"]/, `source_url: '${g.source_url}'`);
    } else {
      updated = updated.replace(/reader_url:\s*['"][^'"]*['"]/, `reader_url: '${g.reader_url}',\n    source_url: '${g.source_url}'`);
    }
    return updated;
  }
  return block;
});
fs.writeFileSync(mockPath, mock, 'utf8');
console.log(`\n✅ src/data/mockData.ts updated: ${mockCount} books`);

// 3. UPDATE src/lib/mock-data.ts
const libPath = 'src/lib/mock-data.ts';
let lib = fs.readFileSync(libPath, 'utf8');
let libCount = 0;
lib = lib.replace(blockRegex, (block, id) => {
  const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/);
  const title = titleMatch ? titleMatch[1] : '';
  const g = findDriveFile({ id, title });
  if (g) {
    libCount++;
    console.log(`[mock-data.ts] [${id}] "${title}" -> "${g.fileName}" (${g.fileId})`);
    let updated = block;
    if (updated.includes('pdf_url:')) {
      updated = updated.replace(/pdf_url:\s*['"][^'"]*['"]/, `pdf_url: '${g.reader_url}'`);
    }
    if (updated.includes('reader_url:')) {
      updated = updated.replace(/reader_url:\s*['"][^'"]*['"]/, `reader_url: '${g.reader_url}'`);
    }
    if (updated.includes('source_url:')) {
      updated = updated.replace(/source_url:\s*['"][^'"]*['"]/, `source_url: '${g.source_url}'`);
    }
    return updated;
  }
  return block;
});
fs.writeFileSync(libPath, lib, 'utf8');
console.log(`\n✅ src/lib/mock-data.ts updated: ${libCount} books`);

