import fs from 'fs';
import path from 'path';

const FOLDER_ID = '16W_-sDVKcuGxiXL3u7kQECFjpkoLmdoC';

function normalizeName(name) {
  if (!name) return '';
  return name
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[0-9]+\.\s*/g, '') // ตัดเลขลำดับ เช่น 123.
    .replace(/[\(\)\[\]_\-—–\s"'\u201C\u201D]+/g, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .trim();
}

export async function fetchFolderFiles() {
  console.log(`Connecting to Google Drive folder: ${FOLDER_ID}...`);
  const url = `https://drive.google.com/embeddedfolderview?id=${FOLDER_ID}`;
  
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res.text();

  if (html.includes('ServiceLogin') || html.includes('Sign in to your Google Account')) {
    console.error('\n⚠️ Google Drive Folder is currently RESTRICTED (จำกัดสิทธิ์เฉพาะส่วนตัว)!');
    console.error('กรุณาตั้งค่าโฟลเดอร์ Google Drive ให้เป็น "ทุกคนที่มีลิงก์ (Anyone with the link)" เพื่อให้ระบบดึงข้อมูลไฟล์ได้ครับ\n');
    return null;
  }

  // Parse files
  const fileRegex = /<a\s+[^>]*?href=["']https:\/\/drive\.google\.com\/file\/d\/([-\w]{25,})\/view["'][^>]*?>([\s\S]*?)<\/a>/gi;
  const files = [];
  let match;
  while ((match = fileRegex.exec(html)) !== null) {
    const fileId = match[1];
    const rawName = match[2].replace(/<[^>]+>/g, '').trim();
    files.push({
      id: fileId,
      name: rawName,
      normName: normalizeName(rawName),
      reader_url: `https://drive.google.com/file/d/${fileId}/preview`,
      source_url: `https://drive.google.com/file/d/${fileId}/view`
    });
  }

  console.log(`Successfully retrieved ${files.length} files from Google Drive.`);
  return files;
}

export async function updateDatabase() {
  const gdriveFiles = await fetchFolderFiles();
  if (!gdriveFiles || gdriveFiles.length === 0) {
    return false;
  }

  const mockDataPath = path.join(process.cwd(), 'src', 'data', 'mockData.ts');
  const libMockDataPath = path.join(process.cwd(), 'src', 'lib', 'mock-data.ts');
  const persistentBooksPath = path.join(process.cwd(), 'src', 'data', 'persistentBooks.json');

  let updatedCount = 0;

  // 1. Update persistentBooks.json if matching
  if (fs.existsSync(persistentBooksPath)) {
    const raw = fs.readFileSync(persistentBooksPath, 'utf8');
    const pBooks = JSON.parse(raw);
    let pChanged = false;

    for (const b of pBooks) {
      const bNorm = normalizeName(b.title);
      const matched = gdriveFiles.find(f => f.normName.includes(bNorm) || bNorm.includes(f.normName));
      if (matched) {
        console.log(`Matched persistent book: "${b.title}" -> File: "${matched.name}" (${matched.id})`);
        b.reader_url = matched.reader_url;
        b.source_url = matched.source_url;
        b.drive_file_id = matched.id;
        pChanged = true;
        updatedCount++;
      }
    }

    if (pChanged) {
      fs.writeFileSync(persistentBooksPath, JSON.stringify(pBooks, null, 2), 'utf8');
      console.log('✅ Updated persistentBooks.json successfully.');
    }
  }

  // 2. Update src/data/mockData.ts
  if (fs.existsSync(mockDataPath)) {
    let mockContent = fs.readFileSync(mockDataPath, 'utf8');
    let mockUpdated = 0;

    for (const file of gdriveFiles) {
      // Find matching book in mockData by title
      const titleMatches = [...mockContent.matchAll(/id:\s*['"](.*?)['"],[\s\S]*?title:\s*['"](.*?)['"],/g)];
      for (const tm of titleMatches) {
        const bookId = tm[1];
        const bookTitle = tm[2];
        const normTitle = normalizeName(bookTitle);

        if (file.normName.includes(normTitle) || normTitle.includes(file.normName)) {
          console.log(`Matched mockData book: [${bookId}] "${bookTitle}" -> Drive File: "${file.name}"`);
          
          // Replace reader_url and source_url for this book block
          const bookBlockRegex = new RegExp(`(id:\\s*['"]${bookId}['"][\\s\\S]*?reader_url:\\s*['"])([^'"]+)(['"][\\s\\S]*?source_url:\\s*['"])([^'"]+)(['"])`);
          if (bookBlockRegex.test(mockContent)) {
            mockContent = mockContent.replace(bookBlockRegex, `$1${file.reader_url}$3${file.source_url}$5`);
            mockUpdated++;
            updatedCount++;
          }
          break;
        }
      }
    }

    if (mockUpdated > 0) {
      fs.writeFileSync(mockDataPath, mockContent, 'utf8');
      console.log(`✅ Updated ${mockUpdated} books in src/data/mockData.ts`);
    }
  }

  // 3. Update src/lib/mock-data.ts
  if (fs.existsSync(libMockDataPath)) {
    let libMockContent = fs.readFileSync(libMockDataPath, 'utf8');
    let libMockUpdated = 0;

    for (const file of gdriveFiles) {
      const titleMatches = [...libMockContent.matchAll(/id:\s*['"](.*?)['"],[\s\S]*?title:\s*['"](.*?)['"],/g)];
      for (const tm of titleMatches) {
        const bookId = tm[1];
        const bookTitle = tm[2];
        const normTitle = normalizeName(bookTitle);

        if (file.normName.includes(normTitle) || normTitle.includes(file.normName)) {
          const bookBlockRegex = new RegExp(`(id:\\s*['"]${bookId}['"][\\s\\S]*?reader_url:\\s*['"])([^'"]+)(['"][\\s\\S]*?source_url:\\s*['"])([^'"]+)(['"])`);
          if (bookBlockRegex.test(libMockContent)) {
            libMockContent = libMockContent.replace(bookBlockRegex, `$1${file.reader_url}$3${file.source_url}$5`);
            libMockUpdated++;
          }
          break;
        }
      }
    }

    if (libMockUpdated > 0) {
      fs.writeFileSync(libMockDataPath, libMockContent, 'utf8');
      console.log(`✅ Updated ${libMockUpdated} books in src/lib/mock-data.ts`);
    }
  }

  console.log(`\n🎉 Total updated books: ${updatedCount}`);
  return true;
}

updateDatabase();
