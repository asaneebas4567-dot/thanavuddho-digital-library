const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, '..', 'public', 'images', 'rewards');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Bookmark SVG
const bookmarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#081829" />
      <stop offset="50%" stop-color="#0F2B48" />
      <stop offset="100%" stop-color="#050E18" />
    </linearGradient>
    <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D9A441" stop-opacity="0.35" />
      <stop offset="100%" stop-color="#081829" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF0CD" />
      <stop offset="25%" stop-color="#D4AF37" />
      <stop offset="50%" stop-color="#AA771C" />
      <stop offset="75%" stop-color="#FFDF73" />
      <stop offset="100%" stop-color="#996515" />
    </linearGradient>
    <linearGradient id="tasselRed" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#DC2626" />
      <stop offset="100%" stop-color="#991B1B" />
    </linearGradient>
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="600" fill="url(#bgGrad)" />
  <circle cx="400" cy="300" r="280" fill="url(#goldGlow)" />

  <!-- Outer Ring Ornament -->
  <circle cx="400" cy="310" r="210" fill="none" stroke="#D9A441" stroke-width="1.5" stroke-dasharray="4 8" opacity="0.4" />

  <!-- Tassel Cord & Knot -->
  <path d="M 400 90 Q 400 130 400 155" fill="none" stroke="#DC2626" stroke-width="4.5" stroke-linecap="round" />
  <!-- Tassel Ring Hole -->
  <circle cx="400" cy="155" r="9" fill="#D4AF37" filter="url(#dropShadow)" />
  <circle cx="400" cy="155" r="4.5" fill="#0F2B48" />

  <!-- Tassel Head & Fringe -->
  <ellipse cx="400" cy="85" rx="10" ry="7" fill="#B91C1C" />
  <rect x="393" y="87" width="14" height="6" rx="2" fill="#D4AF37" />
  <path d="M 390 92 L 382 145 L 418 145 L 410 92 Z" fill="url(#tasselRed)" opacity="0.95" />
  <path d="M 382 145 L 384 148 M 392 145 L 392 150 M 400 145 L 400 151 M 408 145 L 408 150 M 418 145 L 416 148" stroke="#DC2626" stroke-width="2" />

  <!-- Brass Bookmark Body -->
  <g filter="url(#dropShadow)">
    <rect x="330" y="150" width="140" height="340" rx="18" fill="url(#goldMetal)" stroke="#FFF2B2" stroke-width="2" />
    
    <!-- Inner Etched Border -->
    <rect x="340" y="160" width="120" height="320" rx="12" fill="none" stroke="#875305" stroke-width="1.8" stroke-dasharray="8 4" opacity="0.75" />

    <!-- Top Lotus Cutout / Motif -->
    <circle cx="400" cy="205" r="26" fill="#875305" opacity="0.15" />
    <path d="M 400 185 C 392 195 385 205 385 215 C 395 215 400 205 400 205 C 400 205 405 215 415 215 C 415 205 408 195 400 185 Z" fill="#713F12" />
    <path d="M 400 192 C 396 200 392 208 392 215 C 400 215 400 208 400 208 C 400 208 400 215 408 215 C 408 208 404 200 400 192 Z" fill="#FDF0CD" />

    <!-- Thai Script Carved Text: มงคลชีวิต -->
    <text x="400" y="275" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="22" font-weight="900" fill="#6B3402" text-anchor="middle" letter-spacing="3">ม ง ค ล ชี วิ ต</text>
    <text x="400" y="302" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="12" font-weight="700" fill="#78350F" text-anchor="middle" letter-spacing="1">๓๘ ป ร ะ ก า ร</text>

    <!-- Traditional Thai Line Divider -->
    <line x1="365" y1="325" x2="435" y2="325" stroke="#78350F" stroke-width="1.5" />
    <polygon points="400,321 405,325 400,329 395,325" fill="#78350F" />

    <!-- English Subtitle -->
    <text x="400" y="360" font-family="sans-serif" font-size="9" font-weight="800" fill="#78350F" text-anchor="middle" letter-spacing="2">THANAVUDDHO</text>
    <text x="400" y="375" font-family="sans-serif" font-size="8" font-weight="700" fill="#92400E" text-anchor="middle" letter-spacing="1">DIGITAL LIBRARY</text>

    <!-- Bottom Ornament Floral Motif -->
    <path d="M 370 435 Q 400 415 430 435 Q 400 455 370 435 Z" fill="#713F12" opacity="0.6" />
    <circle cx="400" cy="435" r="4" fill="#FDF0CD" />
  </g>

  <!-- Product Label Badge -->
  <g transform="translate(400, 535)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#D4AF37" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#081829" text-anchor="middle">ที่คั่นหนังสือโลหะทองเหลือง ลายมงคลชีวิต</text>
  </g>
</svg>`;

// 2. Postcards SVG
const postcardsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgPost" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FBF7EE" />
      <stop offset="50%" stop-color="#F4ECE1" />
      <stop offset="100%" stop-color="#E9DFD0" />
    </linearGradient>
    <filter id="cardShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="2" dy="10" stdDeviation="14" flood-color="#5A4731" flood-opacity="0.25" />
    </filter>
    <linearGradient id="goldBorder" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#EAB308" />
      <stop offset="100%" stop-color="#CA8A04" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgPost)" />

  <!-- Background Postcard (Angled -8deg) -->
  <g transform="translate(370, 260) rotate(-9)" filter="url(#cardShadow)">
    <rect x="-160" y="-115" width="320" height="230" rx="12" fill="#FFFFFF" stroke="#E2D9CC" stroke-width="1.5" />
    <rect x="-148" y="-103" width="296" height="206" rx="8" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1" />
    <!-- Image placeholder inside back card -->
    <rect x="-140" y="-95" width="280" height="130" rx="6" fill="#E2E8F0" />
    <!-- Lotus Art in background card -->
    <circle cx="0" cy="-30" r="32" fill="#BAE6FD" />
    <path d="M 0 -50 C -12 -38 -20 -25 -20 -15 C -6 -15 0 -28 0 -28 C 0 -28 6 -15 20 -15 C 20 -25 12 -38 0 -50 Z" fill="#0284C7" />
    <text x="0" y="60" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="14" font-weight="800" fill="#1E293B" text-anchor="middle">“ก้าวทีละก้าว ด้วยใจที่มีสติ”</text>
    <text x="0" y="82" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="10" font-weight="600" fill="#64748B" text-anchor="middle">พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)</text>
  </g>

  <!-- Foreground Postcard (Angled +4deg) -->
  <g transform="translate(420, 290) rotate(5)" filter="url(#cardShadow)">
    <rect x="-160" y="-115" width="320" height="230" rx="12" fill="#FFFFFF" stroke="#FDE68A" stroke-width="2" />
    <rect x="-148" y="-103" width="296" height="206" rx="8" fill="#FEFCE8" stroke="url(#goldBorder)" stroke-width="1.5" />
    
    <!-- Header Art Block -->
    <rect x="-138" y="-93" width="276" height="125" rx="6" fill="#FEF9C3" />
    
    <!-- Sun & Lotus Emblem -->
    <circle cx="0" cy="-35" r="36" fill="#FDE047" opacity="0.6" />
    <path d="M 0 -60 C -16 -44 -26 -28 -26 -15 C -8 -15 0 -32 0 -32 C 0 -32 8 -15 26 -15 C 26 -28 16 -44 0 -60 Z" fill="#D97706" />
    <circle cx="0" cy="-32" r="7" fill="#FEF08A" />

    <!-- Postage Stamp in Top-Right -->
    <rect x="92" y="-88" width="36" height="44" rx="3" fill="#FFFBEB" stroke="#B45309" stroke-width="1.2" stroke-dasharray="3 2" />
    <text x="110" y="-62" font-family="sans-serif" font-size="8" font-weight="900" fill="#B45309" text-anchor="middle">THAI</text>
    <text x="110" y="-50" font-family="sans-serif" font-size="7" font-weight="700" fill="#D97706" text-anchor="middle">POST</text>

    <!-- Dhamma Quote -->
    <text x="0" y="58" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="15" font-weight="900" fill="#78350F" text-anchor="middle">“ความสุขเริ่มต้นที่ใจหยุดนิ่ง”</text>
    <text x="0" y="80" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="11" font-weight="600" fill="#92400E" text-anchor="middle">คติธรรมคำสอน พระครูปลัดสุวัฒนโพธิคุณ</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-130" y="-18" width="260" height="36" rx="18" fill="#B45309" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">ชุดโปสการ์ดธรรมะคำสอน (ชุด 8 ภาพ)</text>
  </g>
</svg>`;

// 3. Stickers SVG
const stickersSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgHolo" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E0F2FE" />
      <stop offset="35%" stop-color="#FCE7F3" />
      <stop offset="70%" stop-color="#FEF3C7" />
      <stop offset="100%" stop-color="#DCFCE7" />
    </linearGradient>
    <filter id="stickerShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#1E293B" flood-opacity="0.18" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#bgHolo)" />

  <!-- Sticker Sheet Backing Board -->
  <g transform="translate(400, 280)" filter="url(#stickerShadow)">
    <rect x="-240" y="-190" width="480" height="380" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="2" />
    
    <!-- Top Sheet Header Banner -->
    <rect x="-240" y="-190" width="480" height="65" rx="24" fill="#073B65" />
    <rect x="-240" y="-140" width="480" height="15" fill="#073B65" />
    <text x="0" y="-150" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">✨ THANAVUDDHO STICKER SET ✨</text>
    <text x="0" y="-132" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="10" font-weight="700" fill="#38BDF8" text-anchor="middle">สติกเกอร์ไดคัทกันน้ำ เคลือบเลเซอร์โฮโลแกรมแท้</text>

    <!-- Sticker 1: Mascot Little Monk (เณรน้อย) -->
    <g transform="translate(-130, -50)">
      <circle cx="0" cy="0" r="42" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3" stroke-dasharray="5 3" />
      <circle cx="0" cy="-6" r="22" fill="#FED7AA" />
      <path d="M -16 14 C -16 2 -8 -4 0 -4 C 8 -4 16 2 16 14 Z" fill="#EA580C" />
      <circle cx="-7" cy="-8" r="2.5" fill="#431407" />
      <circle cx="7" cy="-8" r="2.5" fill="#431407" />
      <path d="M -5 -1 Q 0 4 5 -1" fill="none" stroke="#431407" stroke-width="2" stroke-linecap="round" />
      <text x="0" y="32" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="900" fill="#C2410C" text-anchor="middle">เณรน้อยธรรมะ</text>
    </g>

    <!-- Sticker 2: Coin 200 แต้ม -->
    <g transform="translate(0, -50)">
      <circle cx="0" cy="0" r="42" fill="#FEF08A" stroke="#CA8A04" stroke-width="3" stroke-dasharray="5 3" />
      <circle cx="0" cy="0" r="32" fill="#EAB308" />
      <circle cx="0" cy="0" r="26" fill="#FACC15" stroke="#CA8A04" stroke-width="1.5" />
      <text x="0" y="-4" font-family="sans-serif" font-size="16" font-weight="900" fill="#713F12" text-anchor="middle">200</text>
      <text x="0" y="12" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="900" fill="#854D0E" text-anchor="middle">POINTS</text>
    </g>

    <!-- Sticker 3: Lotus Flower -->
    <g transform="translate(130, -50)">
      <circle cx="0" cy="0" r="42" fill="#FCE7F3" stroke="#DB2777" stroke-width="3" stroke-dasharray="5 3" />
      <path d="M 0 -22 C -12 -10 -18 2 -18 12 C -6 12 0 0 0 0 C 0 0 6 12 18 12 C 18 2 12 -10 0 -22 Z" fill="#EC4899" />
      <circle cx="0" cy="2" r="5" fill="#FDE047" />
      <text x="0" y="30" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="900" fill="#BE185D" text-anchor="middle">ดอกบัวปัญญา</text>
    </g>

    <!-- Sticker 4: Peace Dove -->
    <g transform="translate(-80, 75)">
      <circle cx="0" cy="0" r="42" fill="#E0F2FE" stroke="#0284C7" stroke-width="3" stroke-dasharray="5 3" />
      <text x="0" y="12" font-size="34" text-anchor="middle">🕊️</text>
      <text x="0" y="32" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="900" fill="#0369A1" text-anchor="middle">ใจสงบเป็นสุข</text>
    </g>

    <!-- Sticker 5: Wisdom Lightbulb -->
    <g transform="translate(80, 75)">
      <circle cx="0" cy="0" r="42" fill="#FEF9C3" stroke="#EAB308" stroke-width="3" stroke-dasharray="5 3" />
      <text x="0" y="12" font-size="34" text-anchor="middle">💡</text>
      <text x="0" y="32" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="900" fill="#A16207" text-anchor="middle">สว่างด้วยปัญญา</text>
    </g>

    <!-- Footer Bar -->
    <rect x="-220" y="135" width="440" height="32" rx="10" fill="#F1F5F9" />
    <text x="0" y="156" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="11" font-weight="800" fill="#475569" text-anchor="middle">THANAVUDDHO DIGITAL LIBRARY • EXCLUSIVE STICKERS</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 530)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#0284C7" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">สติกเกอร์โฮโลแกรมเฉพาะ Thanavuddho</text>
  </g>
</svg>`;

// 4. Notebook SVG
const notebookSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgNote" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E2E8F0" />
    </linearGradient>
    <filter id="bookShadow" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="6" dy="14" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.22" />
    </filter>
    <linearGradient id="sageCover" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="4%" stop-color="#475569" />
      <stop offset="8%" stop-color="#334155" />
      <stop offset="12%" stop-color="#4F7061" />
      <stop offset="100%" stop-color="#5E8373" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgNote)" />

  <!-- Clean Minimalist Notebook -->
  <g transform="translate(400, 280)" filter="url(#bookShadow)">
    <!-- Page Stack Right/Bottom -->
    <rect x="-105" y="-175" width="220" height="350" rx="14" fill="#F1F5F9" />
    <rect x="-108" y="-178" width="220" height="350" rx="14" fill="#E2E8F0" />

    <!-- Ribbon Bookmark hanging from bottom -->
    <path d="M -30 160 L -30 200 L -20 188 L -10 200 L -10 160 Z" fill="#D9A441" />

    <!-- Front Cover -->
    <rect x="-115" y="-180" width="220" height="350" rx="14" fill="url(#sageCover)" />

    <!-- Vertical Elastic Closure Band -->
    <rect x="65" y="-180" width="16" height="350" fill="#2E463B" />
    <line x1="65" y1="-180" x2="65" y2="170" stroke="#1C2E26" stroke-width="1" />
    <line x1="81" y1="-180" x2="81" y2="170" stroke="#1C2E26" stroke-width="1" />

    <!-- Spine Crease Shadow -->
    <rect x="-115" y="-180" width="12" height="350" fill="#000000" opacity="0.3" />

    <!-- Center Gold Foil Debossed Title -->
    <circle cx="-15" cy="-70" r="24" fill="none" stroke="#FDE68A" stroke-width="1.5" />
    <!-- Lotus Icon -->
    <path d="M -15 -84 C -22 -75 -26 -68 -26 -62 C -18 -62 -15 -70 -15 -70 C -15 -70 -12 -62 -4 -62 C -4 -68 -8 -75 -15 -84 Z" fill="#FDE68A" />

    <text x="-15" y="-20" font-family="sans-serif" font-size="12" font-weight="900" fill="#FEF08A" text-anchor="middle" letter-spacing="3">MINDFULNESS</text>
    <text x="-15" y="-4" font-family="sans-serif" font-size="10" font-weight="800" fill="#FDE68A" text-anchor="middle" letter-spacing="2">NOTEBOOK</text>
    
    <line x1="-60" y1="12" x2="30" y2="12" stroke="#FDE68A" stroke-width="1" opacity="0.8" />
    
    <text x="-15" y="32" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="11" font-weight="700" fill="#FFFFFF" text-anchor="middle">สมุดบันทึกสติและบันทึกความดี</text>
    <text x="-15" y="52" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="600" fill="#D1FAE5" text-anchor="middle">กระดาษถนอมสายตา 80 แกรม • ขนาด A6</text>
    <text x="-15" y="130" font-family="sans-serif" font-size="8" font-weight="700" fill="#A7F3D0" text-anchor="middle" letter-spacing="1">THANAVUDDHO DIGITAL LIBRARY</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#3F6253" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">สมุดโน้ตสติขนาดพกพา (ไร้สิ่งรบกวน)</text>
  </g>
</svg>`;

// 5. Executive Pen SVG
const executivePenSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgCase" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#090D16" />
    </linearGradient>
    <filter id="penShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6" />
    </filter>
    <linearGradient id="penBody" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E3A5F" />
      <stop offset="35%" stop-color="#0D253F" />
      <stop offset="60%" stop-color="#2D5584" />
      <stop offset="100%" stop-color="#0A1828" />
    </linearGradient>
    <linearGradient id="goldTrim" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="50%" stop-color="#CA8A04" />
      <stop offset="100%" stop-color="#EAB308" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgCase)" />

  <!-- Presentation Gift Box Bed -->
  <g transform="translate(400, 280)" filter="url(#penShadow)">
    <!-- Box Outer Shell -->
    <rect x="-260" y="-100" width="520" height="200" rx="16" fill="#0A0E17" stroke="#334155" stroke-width="2" />
    <!-- Velvet Pillow Bed -->
    <rect x="-245" y="-85" width="490" height="170" rx="10" fill="#141E2E" stroke="#1E293B" stroke-width="1.5" />
    <!-- Inner Pillow Crease -->
    <line x1="-240" y1="0" x2="240" y2="0" stroke="#0A0E17" stroke-width="4" opacity="0.6" />

    <!-- Pen Diagonal Rest Position (Angled 5deg) -->
    <g transform="rotate(-6)">
      <!-- Pen Shadow on Velvet -->
      <rect x="-200" y="-12" width="400" height="24" rx="12" fill="#000000" opacity="0.45" filter="url(#penShadow)" />

      <!-- Pen Cap -->
      <rect x="-190" y="-11" width="140" height="22" rx="4" fill="url(#penBody)" stroke="#475569" stroke-width="0.5" />
      <rect x="-192" y="-12" width="10" height="24" rx="2" fill="url(#goldTrim)" />
      <!-- Cap Ring -->
      <rect x="-56" y="-12" width="6" height="24" fill="url(#goldTrim)" />
      <!-- Pocket Clip -->
      <path d="M -180 -12 L -80 -12 L -75 -7 L -80 -2 L -180 -2 Z" fill="url(#goldTrim)" />
      <circle cx="-77" cy="-7" r="4" fill="#FEF08A" />

      <!-- Pen Barrel -->
      <rect x="-50" y="-9.5" width="200" height="19" rx="2" fill="url(#penBody)" stroke="#475569" stroke-width="0.5" />
      
      <!-- Laser Engraved Text on Barrel in Gold -->
      <text x="35" y="4" font-family="'Sarabun', sans-serif" font-size="9" font-weight="800" fill="#FEF08A" text-anchor="middle" letter-spacing="1">THANAVUDDHO EXECUTIVE PEN</text>

      <!-- Barrel Ring & Cone -->
      <rect x="146" y="-9.5" width="6" height="19" fill="url(#goldTrim)" />
      <!-- Front Cone Tip -->
      <polygon points="152,-9 190,-3 190,3 152,9" fill="url(#goldTrim)" />
      <!-- Rollerball Tip -->
      <circle cx="192" cy="0" r="2.5" fill="#E2E8F0" />
    </g>

    <!-- Presentation Box Brand Stamp -->
    <text x="0" y="-55" font-family="'Sarabun', sans-serif" font-size="11" font-weight="900" fill="#CA8A04" text-anchor="middle" letter-spacing="2">✨ THANAVUDDHO DIGITAL LIBRARY ✨</text>
    <text x="0" y="65" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="10" font-weight="700" fill="#64748B" text-anchor="middle">หมึกเจลโรลเลอร์บอลสีน้ำเงิน • สลักเลเซอร์คมชัด</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-150" y="-18" width="300" height="36" rx="18" fill="#CA8A04" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#0A0E17" text-anchor="middle">ปากกาเลเซอร์สลักคติธรรม Executive Pen</text>
  </g>
</svg>`;

// 6. Tumbler SVG
const tumblerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgIce" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F0FDF4" />
      <stop offset="50%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#E0F2FE" />
    </linearGradient>
    <filter id="tumblerShadow" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="16" flood-color="#0F172A" flood-opacity="0.22" />
    </filter>
    <linearGradient id="tumblerBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E2E8F0" />
      <stop offset="25%" stop-color="#FFFFFF" />
      <stop offset="70%" stop-color="#F8FAFC" />
      <stop offset="100%" stop-color="#CBD5E1" />
    </linearGradient>
    <linearGradient id="lidMetal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="50%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgIce)" />

  <!-- Tumbler Upright Studio Mockup -->
  <g transform="translate(400, 280)" filter="url(#tumblerShadow)">
    <!-- Base Plate -->
    <ellipse cx="0" cy="180" rx="55" ry="12" fill="#94A3B8" opacity="0.4" />

    <!-- Tumbler Main Bottle Body -->
    <path d="M -55 -110 L -48 165 C -48 174 -26 178 0 178 C 26 178 48 174 48 165 L 55 -110 Z" fill="url(#tumblerBody)" stroke="#CBD5E1" stroke-width="1.5" />

    <!-- Stainless Steel Collar -->
    <rect x="-56" y="-120" width="112" height="14" rx="2" fill="#E2E8F0" stroke="#94A3B8" stroke-width="1" />
    <rect x="-54" y="-118" width="108" height="3" fill="#FFFFFF" />

    <!-- Smart Digital Lid with LED Display -->
    <rect x="-52" y="-155" width="104" height="36" rx="10" fill="url(#lidMetal)" stroke="#0F172A" stroke-width="1.5" />
    
    <!-- LED Temp Display on Lid -->
    <circle cx="0" cy="-137" r="13" fill="#020617" stroke="#38BDF8" stroke-width="1.5" />
    <text x="0" y="-133" font-family="sans-serif" font-size="9" font-weight="900" fill="#38BDF8" text-anchor="middle">55°C</text>

    <!-- Thanavuddho Lotus Seal on Bottle -->
    <circle cx="0" cy="-30" r="28" fill="#FEF3C7" stroke="#D9A441" stroke-width="1.5" />
    <path d="M 0 -48 C -12 -38 -18 -28 -18 -20 C -6 -20 0 -30 0 -30 C 0 -30 6 -20 18 -20 C 18 -28 12 -38 0 -48 Z" fill="#D97706" />
    <circle cx="0" cy="-28" r="4" fill="#FDE047" />

    <!-- Brand Typography -->
    <text x="0" y="22" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="14" font-weight="900" fill="#1E293B" text-anchor="middle">พุทธธรรมเพื่อชีวิต</text>
    <text x="0" y="42" font-family="sans-serif" font-size="9" font-weight="800" fill="#D9A441" text-anchor="middle" letter-spacing="1.5">THANAVUDDHO LIBRARY</text>
    <text x="0" y="58" font-family="sans-serif" font-size="8" font-weight="700" fill="#64748B" text-anchor="middle">VACUUM INSULATED • 500 ML</text>

    <!-- Insulation Badges -->
    <g transform="translate(0, 115)">
      <rect x="-42" y="-12" width="84" height="24" rx="12" fill="#F1F5F9" stroke="#E2E8F0" stroke-width="1" />
      <text x="0" y="4" font-family="'Sarabun', sans-serif" font-size="9" font-weight="800" fill="#0284C7" text-anchor="middle">❄️ 12h • 🔥 8h</text>
    </g>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#0284C7" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">แก้วน้ำเก็บอุณหภูมิสแตนเลส 304</text>
  </g>
</svg>`;

// 7. Leather Journal SVG
const leatherJournalSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgWood" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#22150E" />
      <stop offset="50%" stop-color="#180E08" />
      <stop offset="100%" stop-color="#0E0704" />
    </linearGradient>
    <filter id="leatherShadow" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="6" dy="16" stdDeviation="18" flood-color="#000000" flood-opacity="0.65" />
    </filter>
    <linearGradient id="leatherTexture" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#3B1C0B" />
      <stop offset="5%" stop-color="#582C15" />
      <stop offset="8%" stop-color="#3B1C0B" />
      <stop offset="12%" stop-color="#6F391B" />
      <stop offset="100%" stop-color="#522712" />
    </linearGradient>
    <linearGradient id="goldFoil" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="40%" stop-color="#D4AF37" />
      <stop offset="70%" stop-color="#AA771C" />
      <stop offset="100%" stop-color="#FDE047" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgWood)" />

  <!-- Leather Journal Upright Mockup -->
  <g transform="translate(400, 275)" filter="url(#leatherShadow)">
    <!-- Cream Page Stack Behind -->
    <rect x="-105" y="-175" width="225" height="350" rx="14" fill="#FDF6E2" />
    <rect x="-108" y="-178" width="225" height="350" rx="14" fill="#E8DEC5" />

    <!-- Main Leather Cover -->
    <rect x="-120" y="-180" width="235" height="355" rx="16" fill="url(#leatherTexture)" stroke="#2B1408" stroke-width="2" />

    <!-- Perimeter Stitching Lines (Fine Thread) -->
    <rect x="-110" y="-170" width="215" height="335" rx="12" fill="none" stroke="#D4AF37" stroke-width="1.2" stroke-dasharray="5 3" opacity="0.65" />

    <!-- Spine Depth Crease -->
    <rect x="-120" y="-180" width="16" height="355" fill="#000000" opacity="0.35" />

    <!-- Wrap-around Leather Strap with Antique Brass Charm -->
    <rect x="75" y="-30" width="55" height="60" rx="6" fill="#451E0C" stroke="#2B1408" stroke-width="1.5" />
    <circle cx="102" cy="0" r="10" fill="#D4AF37" stroke="#713F12" stroke-width="1.5" />
    <circle cx="102" cy="0" r="4" fill="#451E0C" />

    <!-- Center Debossed Gold Foil Ornament -->
    <circle cx="-5" cy="-60" r="34" fill="none" stroke="url(#goldFoil)" stroke-width="2" />
    <circle cx="-5" cy="-60" r="30" fill="none" stroke="url(#goldFoil)" stroke-width="1" stroke-dasharray="3 3" />
    
    <!-- Dhamma Wheel / Lotus Motif -->
    <path d="M -5 -80 C -15 -68 -22 -56 -22 -46 C -8 -46 -5 -58 -5 -58 C -5 -58 -2 -46 12 -46 C 12 -56 5 -68 -5 -80 Z" fill="url(#goldFoil)" />

    <!-- Book Title in Gold Leaf -->
    <text x="-5" y="0" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="18" font-weight="900" fill="url(#goldFoil)" text-anchor="middle" letter-spacing="1">สมุดบันทึกปกหนังลายพิเศษ</text>
    <text x="-5" y="24" font-family="sans-serif" font-size="11" font-weight="900" fill="#FEF08A" text-anchor="middle" letter-spacing="2">THANAVUDDHO CLASSIC</text>
    
    <line x1="-65" y1="42" x2="55" y2="42" stroke="url(#goldFoil)" stroke-width="1.2" />

    <text x="-5" y="64" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="11" font-weight="700" fill="#FDE68A" text-anchor="middle">ฉบับบันทึกสมาธิและเจริญภาวนา</text>
    <text x="-5" y="82" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="600" fill="#E8DEC5" text-anchor="middle">ปกหนัง PU พรีเมียม ปั๊มจมทองคำเค 192 หน้า</text>
    
    <text x="-5" y="145" font-family="sans-serif" font-size="8" font-weight="700" fill="#D4AF37" text-anchor="middle" letter-spacing="2">LIMITED EDITION</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-150" y="-18" width="300" height="36" rx="18" fill="#D4AF37" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#22150E" text-anchor="middle">สมุดบันทึกปกหนังลายพิเศษ Thanavuddho Classic</text>
  </g>
</svg>`;

// 8. Keepsake Box SVG
const keepsakeBoxSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgWarm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF3C7" />
      <stop offset="50%" stop-color="#F5ECE1" />
      <stop offset="100%" stop-color="#E7D7C1" />
    </linearGradient>
    <filter id="boxShadow" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="18" flood-color="#451A03" flood-opacity="0.3" />
    </filter>
    <linearGradient id="woodLid" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78350F" />
      <stop offset="40%" stop-color="#92400E" />
      <stop offset="100%" stop-color="#5B210B" />
    </linearGradient>
    <linearGradient id="woodBase" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#5B210B" />
      <stop offset="100%" stop-color="#3B1204" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgWarm)" />

  <!-- Keepsake Wooden Box Mockup -->
  <g transform="translate(400, 280)" filter="url(#boxShadow)">
    <!-- Box Bottom Base -->
    <rect x="-180" y="-30" width="360" height="170" rx="14" fill="url(#woodBase)" stroke="#270A03" stroke-width="2" />

    <!-- Red Silk Ribbon Wrap Vertical -->
    <rect x="-24" y="-30" width="48" height="170" fill="#DC2626" opacity="0.9" />

    <!-- Box Top Lid (Slightly larger, beveled) -->
    <rect x="-195" y="-120" width="390" height="95" rx="14" fill="url(#woodLid)" stroke="#451A03" stroke-width="2" />
    <rect x="-190" y="-115" width="380" height="10" rx="4" fill="#B45309" opacity="0.4" />

    <!-- Red Silk Ribbon on Lid -->
    <rect x="-24" y="-120" width="48" height="95" fill="#DC2626" opacity="0.9" />

    <!-- Brass Latch Clasp Front -->
    <rect x="-20" y="-45" width="40" height="40" rx="6" fill="#F59E0B" stroke="#78350F" stroke-width="1.5" />
    <circle cx="0" cy="-25" r="7" fill="#78350F" />
    <circle cx="0" cy="-25" r="3" fill="#FDE68A" />

    <!-- Engraved Brass Plaque on Lid -->
    <rect x="-120" y="-100" width="240" height="48" rx="8" fill="#FDE68A" stroke="#B45309" stroke-width="1.5" />
    <circle cx="-100" cy="-76" r="3" fill="#78350F" />
    <circle cx="100" cy="-76" r="3" fill="#78350F" />
    <text x="0" y="-80" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#78350F" text-anchor="middle">ชุดกล่องของที่ระลึก</text>
    <text x="0" y="-64" font-family="sans-serif" font-size="9" font-weight="800" fill="#92400E" text-anchor="middle" letter-spacing="1">THANAVUDDHO KEEPSAKE BOX</text>

    <!-- Box Base Label -->
    <text x="0" y="70" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="11" font-weight="800" fill="#FEF3C7" text-anchor="middle">กล่องไม้คราฟต์ขัดเงาพิเศษ สลักตราสัญลักษณ์</text>
    <text x="0" y="92" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="9" font-weight="600" fill="#FDE68A" text-anchor="middle">สำหรับเก็บของสะสมมงคล หนังสือ และวัตถุระลึก</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-130" y="-18" width="260" height="36" rx="18" fill="#92400E" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">ชุดกล่องของที่ระลึก Thanavuddho Box</text>
  </g>
</svg>`;

// 9. Commemorative Box SVG (rew-8501)
const commemorativeBoxSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgComm" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#071E3D" />
      <stop offset="50%" stop-color="#0E2F56" />
      <stop offset="100%" stop-color="#081729" />
    </linearGradient>
    <filter id="box3D" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#bgComm)" />

  <!-- Commemorative Premium Gift Box -->
  <g transform="translate(400, 275)" filter="url(#box3D)">
    <!-- Box Hard Casing (Royal Blue with Gold Trim) -->
    <rect x="-210" y="-140" width="420" height="280" rx="18" fill="#0A2540" stroke="#D9A441" stroke-width="2.5" />
    <rect x="-198" y="-128" width="396" height="256" rx="12" fill="#0D2E50" stroke="#FDE68A" stroke-width="1" stroke-dasharray="6 4" opacity="0.7" />

    <!-- 2 Books Nestled Inside Box (Angled slightly) -->
    <!-- Book 1 (Left) -->
    <g transform="translate(-85, 10) rotate(-6)">
      <rect x="-55" y="-95" width="110" height="165" rx="8" fill="#E11D48" stroke="#FFFFFF" stroke-width="1.5" />
      <rect x="-55" y="-95" width="12" height="165" fill="#000000" opacity="0.3" />
      <text x="0" y="-10" font-family="'Sarabun', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">ทำใจให้</text>
      <text x="0" y="8" font-family="'Sarabun', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">พร้อมบวก</text>
    </g>

    <!-- Book 2 (Right) -->
    <g transform="translate(45, 10) rotate(5)">
      <rect x="-55" y="-95" width="110" height="165" rx="8" fill="#0D9488" stroke="#FFFFFF" stroke-width="1.5" />
      <rect x="-55" y="-95" width="12" height="165" fill="#000000" opacity="0.3" />
      <text x="0" y="-10" font-family="'Sarabun', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">สมดุล</text>
      <text x="0" y="8" font-family="'Sarabun', sans-serif" font-size="11" font-weight="900" fill="#FFFFFF" text-anchor="middle">เท่ากับดี</text>
    </g>

    <!-- Top Commemorative Header Plaque -->
    <rect x="-160" y="-115" width="320" height="36" rx="8" fill="#D9A441" />
    <text x="0" y="-92" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#0A2540" text-anchor="middle">ชุดหนังสือพิเศษพร้อมกล่องที่ระลึก</text>

    <!-- Bottom Badge -->
    <rect x="-140" y="85" width="280" height="26" rx="13" fill="#F59E0B" />
    <text x="0" y="102" font-family="'Sarabun', sans-serif" font-size="10" font-weight="900" fill="#000000" text-anchor="middle">พร้อมลายเซ็นแท้ + ปากกา + ที่คั่นทองเหลือง</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-160" y="-18" width="320" height="36" rx="18" fill="#D9A441" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#0A2540" text-anchor="middle">Thanavuddho Commemorative Boxset</text>
  </g>
</svg>`;

// 10. Boxset 3-Books Overlapping SVG (rew-10001)
const boxset3BooksSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgBox" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#073B65" />
      <stop offset="50%" stop-color="#0B4E85" />
      <stop offset="100%" stop-color="#079FE8" />
    </linearGradient>
    <radialGradient id="boxGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#D9A441" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#073B65" stop-opacity="0" />
    </radialGradient>
    <filter id="bookStackShadow" x="-20%" y="-15%" width="140%" height="140%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#000000" flood-opacity="0.6" />
    </filter>
  </defs>

  <rect width="800" height="600" fill="url(#bgBox)" />
  <circle cx="400" cy="280" r="300" fill="url(#boxGlow)" />

  <!-- 3-Book Overlapping Stack ("ทำ 3 เล่มมาทับๆกัน ขอให้เห็นภาพ") -->
  <g transform="translate(400, 275)" filter="url(#bookStackShadow)">
    
    <!-- Left Book: ทำใจให้พร้อมบวก (-16deg) -->
    <g transform="translate(-115, 20) rotate(-16)">
      <rect x="-70" y="-110" width="140" height="210" rx="10" fill="#E11D48" stroke="#FFFFFF" stroke-width="2" />
      <rect x="-70" y="-110" width="15" height="210" fill="#000000" opacity="0.35" />
      <!-- Book Spine title -->
      <circle cx="0" cy="-40" r="22" fill="#FFE4E6" />
      <text x="0" y="10" font-family="'Sarabun', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">ทำใจให้</text>
      <text x="0" y="32" font-family="'Sarabun', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">พร้อมบวก</text>
      <text x="0" y="65" font-family="'Sarabun', sans-serif" font-size="9" font-weight="700" fill="#FEE2E2" text-anchor="middle">เล่มที่ ๑</text>
    </g>

    <!-- Right Book: สมดุลเท่ากับดี (+16deg) -->
    <g transform="translate(115, 20) rotate(16)">
      <rect x="-70" y="-110" width="140" height="210" rx="10" fill="#0D9488" stroke="#FFFFFF" stroke-width="2" />
      <rect x="-70" y="-110" width="15" height="210" fill="#000000" opacity="0.35" />
      <circle cx="0" cy="-40" r="22" fill="#CCFBF1" />
      <text x="0" y="10" font-family="'Sarabun', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">สมดุล</text>
      <text x="0" y="32" font-family="'Sarabun', sans-serif" font-size="14" font-weight="900" fill="#FFFFFF" text-anchor="middle">เท่ากับดี</text>
      <text x="0" y="65" font-family="'Sarabun', sans-serif" font-size="9" font-weight="700" fill="#CCFBF1" text-anchor="middle">เล่มที่ ๓</text>
    </g>

    <!-- Center Book: อย่ามโน (Front & Raised) -->
    <g transform="translate(0, -10)">
      <rect x="-80" y="-120" width="160" height="235" rx="12" fill="#FACC15" stroke="#D9A441" stroke-width="3.5" />
      <rect x="-80" y="-120" width="16" height="235" fill="#000000" opacity="0.35" />
      
      <!-- Gold Badge Top Right -->
      <rect x="25" y="-112" width="48" height="20" rx="4" fill="#D9A441" />
      <text x="49" y="-98" font-family="sans-serif" font-size="9" font-weight="900" fill="#FFFFFF" text-anchor="middle">BOXSET</text>

      <circle cx="0" cy="-45" r="28" fill="#FEF08A" stroke="#CA8A04" stroke-width="1.5" />
      <text x="0" y="-38" font-size="28" text-anchor="middle">✨</text>

      <text x="0" y="15" font-family="'Sarabun', sans-serif" font-size="18" font-weight="900" fill="#713F12" text-anchor="middle">อย่ามโน</text>
      <text x="0" y="38" font-family="'Sarabun', sans-serif" font-size="11" font-weight="800" fill="#854D0E" text-anchor="middle">เล่มที่ ๒ (แก่นปัญญา)</text>
      <text x="0" y="70" font-family="'Sarabun', sans-serif" font-size="10" font-weight="700" fill="#713F12" text-anchor="middle">พระครูปลัดสุวัฒนโพธิคุณ</text>
    </g>

    <!-- Boxset Slipcase Banner -->
    <rect x="-180" y="110" width="360" height="34" rx="17" fill="#0A2540" stroke="#D9A441" stroke-width="2" />
    <text x="0" y="132" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FDE68A" text-anchor="middle">BOXSET ทางปัญญา (๓ เล่มไตรภาคหลัก)</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 530)">
    <rect x="-150" y="-18" width="300" height="36" rx="18" fill="#D9A441" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#073B65" text-anchor="middle">Boxset ไตรภาคปัญญาธรรม (3 เล่มทับซ้อน 3D)</text>
  </g>
</svg>`;

// 11. Power Bank SVG (rew-12001)
const powerBankSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <linearGradient id="bgTech" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1120" />
      <stop offset="50%" stop-color="#111827" />
      <stop offset="100%" stop-color="#1F2937" />
    </linearGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#0284C7" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0B1120" stop-opacity="0" />
    </radialGradient>
    <filter id="bankShadow" x="-15%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="18" stdDeviation="20" flood-color="#000000" flood-opacity="0.7" />
    </filter>
    <linearGradient id="bankBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="40%" stop-color="#334155" />
      <stop offset="70%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bgTech)" />
  <circle cx="400" cy="280" r="260" fill="url(#cyanGlow)" />

  <!-- Power Bank Upright 3D Mockup -->
  <g transform="translate(400, 275)" filter="url(#bankShadow)">
    <!-- Main Matte Body -->
    <rect x="-95" y="-160" width="190" height="320" rx="24" fill="url(#bankBody)" stroke="#475569" stroke-width="2" />

    <!-- Top USB Ports Edge -->
    <rect x="-55" y="-163" width="30" height="5" rx="2" fill="#0F172A" />
    <rect x="-15" y="-163" width="30" height="5" rx="2" fill="#0F172A" />
    <rect x="25" y="-163" width="30" height="5" rx="2" fill="#0F172A" />

    <!-- Digital Glossy LED Screen Panel -->
    <rect x="-75" y="-130" width="150" height="70" rx="12" fill="#030712" stroke="#1E293B" stroke-width="1.5" />
    
    <!-- LED Battery Percentage -->
    <text x="-15" y="-85" font-family="'Courier New', monospace, sans-serif" font-size="34" font-weight="900" fill="#38BDF8">100</text>
    <text x="35" y="-95" font-family="'Courier New', monospace, sans-serif" font-size="16" font-weight="900" fill="#38BDF8">%</text>

    <!-- Fast Charging Indicator -->
    <text x="0" y="-70" font-family="sans-serif" font-size="9" font-weight="800" fill="#22C55E" text-anchor="middle">⚡ FAST CHARGING 22.5W</text>

    <!-- Golden Emblem in Center -->
    <circle cx="0" cy="10" r="28" fill="#FEF3C7" stroke="#D9A441" stroke-width="1.5" />
    <path d="M 0 -8 C -10 2 -15 10 -15 16 C -5 16 0 8 0 8 C 0 8 5 16 15 16 C 15 10 10 2 0 -8 Z" fill="#D9A441" />
    <circle cx="0" cy="8" r="3.5" fill="#FDE047" />

    <!-- Typography -->
    <text x="0" y="60" font-family="sans-serif" font-size="12" font-weight="900" fill="#F8FAFC" text-anchor="middle" letter-spacing="2">THANAVUDDHO</text>
    <text x="0" y="78" font-family="sans-serif" font-size="9" font-weight="700" fill="#94A3B8" text-anchor="middle" letter-spacing="1">SMART POWER BANK</text>

    <!-- Large Capacity Spec Label -->
    <rect x="-65" y="105" width="130" height="28" rx="14" fill="#0F172A" stroke="#334155" stroke-width="1" />
    <text x="0" y="123" font-family="sans-serif" font-size="12" font-weight="900" fill="#D9A441" text-anchor="middle">20,000 mAh</text>
  </g>

  <!-- Tag Pill -->
  <g transform="translate(400, 525)">
    <rect x="-140" y="-18" width="280" height="36" rx="18" fill="#0284C7" />
    <text x="0" y="5" font-family="'Sarabun', 'Noto Sans Thai', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" text-anchor="middle">Power Bank 20,000 mAh Fast-Charge</text>
  </g>
</svg>`;

// Write all files
const files = {
  'bookmark-mongkol.svg': bookmarkSvg,
  'postcards-dhamma.svg': postcardsSvg,
  'stickers-library.svg': stickersSvg,
  'notebook-mindfulness.svg': notebookSvg,
  'executive-pen.svg': executivePenSvg,
  'thermal-tumbler.svg': tumblerSvg,
  'leather-journal.svg': leatherJournalSvg,
  'keepsake-box.svg': keepsakeBoxSvg,
  'commemorative-box.svg': commemorativeBoxSvg,
  'boxset-3books.svg': boxset3BooksSvg,
  'powerbank-20000.svg': powerBankSvg
};

for (const [filename, content] of Object.entries(files)) {
  const filePath = path.join(outDir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Generated:', filePath);
}
console.log('All 11 reward SVGs generated successfully!');
