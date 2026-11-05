import { synthesizeGroundedDhammaAnswer } from '../src/lib/dhammaSynthesisEngine.js';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 TESTING KNOWLEDGE-TO-VIDEO FALLBACK SYSTEM');
  console.log('====================================================\n');

  let passedCount = 0;
  let totalCount = 6;

  // TEST 1: User Signature Question (Situation B: Multi-concept Partial + Video Recommendation)
  console.log('👉 [Test 1] Signature Question: "นิยาม 5 ช่วยอธิบายอิทธิบาท 4 ได้อย่างไร"');
  try {
    const res1 = await synthesizeGroundedDhammaAnswer('นิยาม 5 ช่วยอธิบายอิทธิบาท 4 ได้อย่างไร');
    const hasNiyama = res1.answerText.includes('นิยาม');
    const hasIddhipada = res1.answerText.includes('อิทธิบาท') && res1.answerText.includes('ฉันทะ');
    const hasCittaOrKamma = res1.answerText.includes('จิตตนิยาม') || res1.answerText.includes('กรรมนิยาม');
    const hasVideo = res1.citations.some(c => c.type === 'video');
    const isSituationB = res1.situation === 'situation_b_partial';

    if (hasNiyama && hasIddhipada && hasCittaOrKamma && hasVideo && isSituationB) {
      console.log('   ✅ PASS: Correctly synthesized Niyama 5 and Iddhipada 4 under Situation B with Video Fallback!');
      console.log('   Evidence Badge:', res1.evidenceBadgeText);
      console.log('   Video Recommended:', res1.citations.find(c => c.type === 'video')?.title);
      console.log('   Video Link:', res1.citations.find(c => c.type === 'video')?.link);
      passedCount++;
    } else {
      console.error('   ❌ FAIL: Condition mismatch', { hasNiyama, hasIddhipada, hasCittaOrKamma, hasVideo, isSituationB });
    }
  } catch (err) {
    console.error('   ❌ ERROR in Test 1:', err);
  }
  console.log('');

  // TEST 2: Situation A (Found directly in books)
  console.log('👉 [Test 2] Situation A: "มงคลชีวิต 38 ประการ มีอะไรบ้าง และอยู่ในหนังสือเล่มไหน"');
  try {
    const res2 = await synthesizeGroundedDhammaAnswer('มงคลชีวิต 38 ประการ มีอะไรบ้าง และอยู่ในหนังสือเล่มไหน');
    const hasBookRef = res2.citations.some(c => c.type === 'book');
    const isSituationA = res2.situation === 'situation_a_full';

    if (hasBookRef && isSituationA) {
      console.log('   ✅ PASS: Successfully retrieved book knowledge under Situation A!');
      console.log('   Book Cited:', res2.citations.find(c => c.type === 'book')?.title);
      passedCount++;
    } else {
      console.error('   ❌ FAIL: Not Situation A or missing book citation', { hasBookRef, situation: res2.situation });
    }
  } catch (err) {
    console.error('   ❌ ERROR in Test 2:', err);
  }
  console.log('');

  // TEST 3: Situation C (No book answer, but relevant video in library)
  console.log('👉 [Test 3] Situation C: "ยมทูตในนรก มีอายุขัยไหม"');
  try {
    const res3 = await synthesizeGroundedDhammaAnswer('ยมทูตในนรก มีอายุขัยไหม');
    const hasYamaVideo = res3.citations.some(c => c.youtubeId === '0Iv-fU_0g0k' || c.title.includes('ยมทูต'));
    const isSituationC = res3.situation === 'situation_c_video_fallback';

    if (hasYamaVideo && isSituationC) {
      console.log('   ✅ PASS: Fallback to video correctly identified under Situation C without hallucination!');
      console.log('   Video Recommended:', res3.citations[0]?.title);
      console.log('   YouTube URL:', res3.citations[0]?.link);
      console.log('   Reason:', res3.citations[0]?.relevanceReason);
      passedCount++;
    } else {
      console.error('   ❌ FAIL in Test 3', { hasYamaVideo, situation: res3.situation });
    }
  } catch (err) {
    console.error('   ❌ ERROR in Test 3:', err);
  }
  console.log('');

  // TEST 4: Situation D (Neither book nor video found -> Zero Hallucination rejection)
  console.log('👉 [Test 4] Situation D: "พระอาจารย์สอนวิธีเขียนโค้ดภาษา Rust อย่างไร"');
  try {
    const res4 = await synthesizeGroundedDhammaAnswer('พระอาจารย์สอนวิธีเขียนโค้ดภาษา Rust อย่างไร');
    const hasStandardRejection = res4.answerText.includes('ขณะนี้ยังไม่พบข้อมูลหรือวิดีโอจากแหล่งคำสอนที่เชื่อมต่อ');
    const isSituationD = res4.situation === 'situation_d_not_found';
    const noHallucinatedCitations = res4.citations.length === 0;

    if (hasStandardRejection && isSituationD && noHallucinatedCitations) {
      console.log('   ✅ PASS: Strictly rejected without fabricating answers under Situation D!');
      console.log('   Answer:', res4.answerText.split('\n')[0]);
      passedCount++;
    } else {
      console.error('   ❌ FAIL in Test 4', { 
        hasStandardRejection, 
        isSituationD, 
        citationsCount: res4.citations.length,
        situation: res4.situation,
        evidenceLevel: res4.evidenceLevel,
        firstCitation: res4.citations[0],
        answerPreview: res4.answerText.slice(0, 100)
      });
    }
  } catch (err) {
    console.error('   ❌ ERROR in Test 4:', err);
  }
  console.log('');

  // TEST 5: Website Knowledge (Overview & Features)
  console.log('👉 [Test 5] Website Knowledge: "เว็บนี้คือเว็บอะไร มีอะไรให้ดูบ้าง"');
  try {
    const res5 = await synthesizeGroundedDhammaAnswer('เว็บนี้คือเว็บอะไร มีอะไรให้ดูบ้าง');
    const mentionsLibrary = res5.answerText.includes('Thanavuddho Digital Library') || res5.answerText.includes('ห้องสมุดดิจิทัล');
    const mentionsBooks = res5.answerText.includes('หนังสือ');
    const hasNavCitations = res5.citations.length > 0;

    if (mentionsLibrary && mentionsBooks && hasNavCitations) {
      console.log('   ✅ PASS: Successfully answered website overview with direct navigation links!');
      console.log('   Category Badge:', res5.categoryBadge);
      console.log('   Navigation Links Provided:', res5.citations.map(c => c.title).join(', '));
      passedCount++;
    } else {
      console.error('   ❌ FAIL in Test 5', { mentionsLibrary, mentionsBooks, hasNavCitations });
    }
  } catch (err) {
    console.error('   ❌ ERROR in Test 5:', err);
  }
  console.log('');

  // TEST 6: Website Specific Book (Finding & Reading Book 'อย่ามโน')
  console.log('👉 [Test 6] Website Specific Book: "มีหนังสืออย่ามโนไหม อ่านยังไง"');
  try {
    const res6 = await synthesizeGroundedDhammaAnswer('มีหนังสืออย่ามโนไหม อ่านยังไง');
    const mentionsYamano = res6.answerText.includes('อย่ามโน');
    const hasReaderLink = res6.citations.some(c => c.link.includes('อย่ามโน'));

    if (mentionsYamano && hasReaderLink) {
      console.log('   ✅ PASS: Successfully answered specific book query with E-Book reader link!');
      console.log('   Reader Link:', res6.citations.find(c => c.link.includes('อย่ามโน'))?.link);
      passedCount++;
    } else {
      console.error('   ❌ FAIL in Test 6', { mentionsYamano, hasReaderLink });
    }
  } catch (err) {
    console.error('   ❌ ERROR in Test 6:', err);
  }
  console.log('');

  console.log('====================================================');
  console.log(`📊 FINAL RESULT: Passed ${passedCount} / ${totalCount} tests`);
  console.log('====================================================');
}

runTests();
