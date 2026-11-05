import { synthesizeGroundedDhammaAnswer } from '../src/lib/dhammaSynthesisEngine.js';
import { DHAMMA_30_TEST_CASES } from '../src/data/chatbotTestSuites.js';

async function runAll30Tests() {
  console.log('====================================================');
  console.log('🧪 RUNNING 30 DHAMMA AI TEST SUITES');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < DHAMMA_30_TEST_CASES.length; i++) {
    const tc = DHAMMA_30_TEST_CASES[i];
    try {
      const res = await synthesizeGroundedDhammaAnswer(tc.query);
      
      const levelMatches = tc.expectedEvidenceLevel ? res.evidenceLevel === tc.expectedEvidenceLevel : true;
      const keywordsMatch = tc.expectedKeywords ? tc.expectedKeywords.every(k => res.answerText.includes(k) || res.citations.some(c => c.title.includes(k) || (c.snippet && c.snippet.includes(k)))) : true;
      
      if (levelMatches && keywordsMatch) {
        passed++;
        console.log(`[PASS] ${tc.id}: ${tc.query.slice(0, 45)}...`);
      } else {
        failed++;
        console.warn(`[WARN] ${tc.id}: ${tc.query.slice(0, 45)}... (Level: expected ${tc.expectedEvidenceLevel}, got ${res.evidenceLevel})`);
      }
    } catch (err) {
      failed++;
      console.error(`[ERR] ${tc.id}:`, err);
    }
  }

  console.log('\n====================================================');
  console.log(`📊 30-TEST SUITE RESULT: Passed ${passed} / ${DHAMMA_30_TEST_CASES.length} (${Math.round((passed / DHAMMA_30_TEST_CASES.length) * 100)}%)`);
  console.log('====================================================');
}

runAll30Tests();

