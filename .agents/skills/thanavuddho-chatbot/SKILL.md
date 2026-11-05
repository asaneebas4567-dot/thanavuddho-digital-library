---
name: thanavuddho-chatbot
description: >-
  Operational runbook, architecture reference, and evaluation guidelines for the Thanavuddho Dhamma AI Advisor system.
  Activate this skill when modifying, testing, debugging, or extending the Dhamma AI chatbot, the multi-tier RAG search engine,
  Thai tokenization, situational ethics guardrails, or citation systems in the Thanavuddho Digital Library project.
---

# Thanavuddho Dhamma AI Advisor — Skill Guide

คู่มือสถาปัตยกรรม แนวทางปฏิบัติ และขั้นตอนการทดสอบสำหรับระบบผู้ช่วยธรรมะอัจฉริยะ (Thanavuddho Dhamma AI Advisor) ของห้องสมุดดิจิทัล พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ M.D., Ph.D.)

---

## 1. เสาหลักของระบบ (Core Pillars)

ระบบนี้ถูกออกแบบขึ้นภายใต้หลักการ 3 ประการอย่างเคร่งครัด:

1. **ค้นหาคำสอนจากคลังข้อมูลจริง (Internal Knowledge Retrieval)**:
   - ค้นหาเนื้อหาจริงระดับรายหน้าจาก `bookPagesContentDatabase` รวมถึงพุทธพจน์ภาษาบาลี คำแปล และข้อคิดสำคัญ
   - ค้นหาครอบคลุมคลังหนังสือธรรมะ 56+ เล่ม, บทความ, วิดีโอเทศนา, เสียงบรรยาย และดัชนีหมุดเวลา (`smartSearchIndex`)
   - ระบบตัดคำภาษาไทยมาตรฐาน `Intl.Segmenter` พร้อมพจนานุกรมเชื่อมโยงคำพ้องความหมายทางธรรมะ (`DHAMMA_SYNONYMS`)

2. **ค้นหาแหล่งภายนอกเฉพาะช่องทางทางการของพระอาจารย์ (Verified External Sources)**:
   - ตรวจสอบผ่าน Whitelist โดเมนและช่องทางการเท่านั้น:
     - `dhammatoday.com`
     - `thanavuddho.org`
     - `dmc.tv`
     - `dhammakaya.net`
     - ช่อง YouTube: `@ThanavuddhoStory`
   - เมื่อยังไม่ได้เชื่อมต่อ Search API Key ระบบจะใช้ **คลังดัชนีคำสอนทางการที่ตรวจสอบล่วงหน้า (Pre-indexed Verified Archive)** พร้อมเปิดเผย URL ต้นทางอย่างโปร่งใส

3. **ตอบคำถามตามหลักฐานจริง ไม่แต่งข้อมูล (Strict Grounded Truth)**:
   - แบ่งระดับความน่าเชื่อถือออกเป็น 3 ระดับอย่างโปร่งใส:
     - 🟢 `direct_verified`: คำสอนโดยตรงของพระอาจารย์ อ้างอิงเล่มและหน้าจริง
     - 🟡 `general_dhamma`: การอธิบายหลักธรรมประกอบ (เช่น จริยธรรมการแพทย์/การถอดเครื่องช่วยหายใจ โดยยึดหลักเจตนา, ศีลข้อ 1, และการประคองจิตใจ)
     - ⚪ `unverified_or_no_evidence`: ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ (คำถามนอกขอบเขต เช่น Windows, ฮาร์ดแวร์, หวย, หุ้น ระบบจะปฏิเสธอย่างสุภาพตรงไปตรงมา ไม่แต่งข้อมูลมั่ว)

---

## 2. แผนผังไฟล์และหน้าที่รับผิดชอบ (Code Structure)

| ไฟล์ | หน้าที่หลัก |
| :--- | :--- |
| [src/lib/thaiTokenizer.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/lib/thaiTokenizer.ts) | การตัดคำภาษาไทย (`tokenizeThai`), กรอง Stopwords, แปลงคำพ้องความหมาย (`expandQueryWithSynonyms`), และฟังก์ชันปรับข้อความมาตรฐาน (`normalizeThaiText`) |
| [src/lib/internalKnowledgeSearch.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/lib/internalKnowledgeSearch.ts) | ระบบสืบค้นคลังเนื้อหาภายใน 5 ส่วน (เนื้อหารายหน้า, smart search, บทความ, หนังสือทั้งเล่ม, สื่อวิดีโอ/เสียง) พร้อมตัดคะแนน Noise ที่ต่ำกว่า 20 |
| [src/lib/externalDhammaSearch.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/lib/externalDhammaSearch.ts) | ระบบสืบค้นคำสอนทางการภายนอก พร้อม Whitelist โดเมน และคลังดัชนีคำสอนล่วงหน้า (Fallback Archive) |
| [src/lib/situationalEthicsGuard.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/lib/situationalEthicsGuard.ts) | ระบบวิเคราะห์ประเด็นสถานการณ์วิกฤต (การแพทย์/ถอดเครื่องช่วยหายใจ/Living Will, ความสูญเสีย/ความเศร้าโศก) พร้อมข้อความแสดงความเห็นอกเห็นใจ (Empathy) และขอบเขตการแพทย์ |
| [src/app/api/chat/route.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/app/api/chat/route.ts) | Server-side Route Handler รวบรวม RAG Pipeline, บริบทการสนทนาต่อเนื่อง (Multi-turn Context Resolution), และสังเคราะห์คำตอบตามระดับหลักฐาน |
| [src/lib/chatbotAiEngine.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/lib/chatbotAiEngine.ts) | Client Engine Interface เชื่อมต่อไปยัง `/api/chat` พร้อม Fallback กรณี Network ขัดข้อง |
| [src/app/chatbot/page.tsx](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/app/chatbot/page.tsx) | หน้าแชตบอตเต็มรูปแบบ พร้อม Quick Prompts, ป้ายกำกับ 3 ระดับหลักฐาน, และการแสดงข้อความอ้างอิงรายหน้า |
| [src/components/chatbot/AiChatWidget.tsx](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/components/chatbot/AiChatWidget.tsx) | วิดเจ็ตหน้าต่างแชตมุมขวาล่างของเว็บไซต์ เชื่อมโยง Engine เดียวกันกับหน้าหลัก 100% |
| [src/data/chatbotTestSuites.ts](file:///c:/เว็บไชต์/พระครูปลัดสุวัฒนโพธิคุณ%20Digital%20Library/src/data/chatbotTestSuites.ts) | ชุดทดสอบ 30 ข้อคำถามมาตรฐาน ครอบคลุม 8 มิติการประเมิน |

---

## 3. ขั้นตอนการตรวจสอบและทดสอบระบบ (Verification & Testing Runbook)

### 3.1 การรันชุดทดสอบ 30 ข้อคำถาม (Automated Test Suite)
เมื่อมีการปรับแก้โค้ดหรือเพิ่มข้อมูลคำสอน ให้รันชุดทดสอบประเมินผลผ่าน Node.js:

```powershell
node "C:\Users\IDEAPAD GAMING 3\.gemini\antigravity-ide\brain\72b32f51-1742-40d9-b6ba-75bea3b8298e\scratch\run_all_30_tests.mjs"
```

เกณฑ์การผ่าน (Pass Criteria):
- มิติที่ 1: คำสอนตรงจากหนังสือ ต้องได้ `direct_verified` และมีคำสำคัญของเรื่อง
- มิติที่ 2: แหล่งภายนอกที่ตรวจสอบแล้ว ต้องได้ `direct_verified` พร้อมระบุแหล่งทางการ
- มิติที่ 3: จริยธรรมการแพทย์ (ถอดเครื่องช่วยหายใจ) ต้องได้ `general_dhamma` พร้อมยึดหลักเจตนา และห้ามตัดสินว่าใครบาป
- มิติที่ 4: ความสูญเสียและเยียวยาใจ ต้องแสดง Empathy พร้อมหลักอนิจจังและการอุทิศบุญ
- มิติที่ 5: Multi-turn Follow-up ต้องเข้าใจคำถามต่อเนื่อง เช่น "ข้อแรกหมายถึงอะไร"
- มิติที่ 6: คำถามนอกขอบเขต (Windows 11, หวย, หุ้น) ต้องได้ `unverified_or_no_evidence` และไม่แต่งข้อมูล
- มิติที่ 7: ภาษาพิมพ์ตกหล่น (นังสะมาธิ) ต้องถอดรหัสเข้าสู่หัวข้อธรรมะได้ถูกต้อง
- มิติที่ 8: การสืบค้นคลังสื่อเจาะจง ต้องแนะนำหนังสือหรือสื่อที่ตรงกับประเด็น

### 3.2 การตรวจสอบ Type Check และ Production Build
บนสภาพแวดล้อม Windows ในโปรเจกต์นี้ ให้เรียกใช้ผ่าน `cmd /c` เสมอ:

```powershell
cmd /c npm run build
```

ต้องมั่นใจว่าคอมไพล์สำเร็จครบ 23 เส้นทาง โดยไม่มีข้อผิดพลาดของ TypeScript (`error TS...`)

---

## 4. ข้อห้ามและข้อพึงระวังอย่างเคร่งครัด (Guardrails & Red Lines)

1. **ห้ามแต่งข้อมูลเท็จ (Zero Hallucination)**:
   - ห้ามอ้างชื่อพระอาจารย์ในสิ่งที่ไม่มีบันทึกหรือหลักฐานในคลัง
   - หากค้นไม่พบข้อมูล ให้แสดงสถานะ `⚪ ยังไม่พบคำสอนหรือข้อมูลที่ยืนยันได้ในระบบ` ทันที
2. **ห้ามตัดสินบาปบุญในกรณีการแพทย์**:
   - ในประเด็นการยุติเครื่องช่วยหายใจหรือการรักษาแบบประคับประคอง ห้ามตัดสินว่าญาติหรือแพทย์ "เป็นคนบาป"
   - ให้แยกแยะระหว่างดุลยพินิจทางการแพทย์กับหลักเจตนาทางธรรมะ
3. **การรักษาเอกภาพของ Logic**:
   - ห้ามเขียนตรรกะ `if/else` ดักคำถามแยกส่วนใน `AiChatWidget.tsx` ให้ส่งต่อคำถามผ่าน `generateAiDhammaAnswer()` เพื่อให้ผลลัพธ์ตรงกันกับหน้า `/chatbot` เสมอ
