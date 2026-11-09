// Test script for Thanavuddho Library Survey & Point Awarding System (Phases 1-6)
import { 
  getAllSurveyQuestions, 
  getAllSurveyResponses, 
  getSurveyAnalytics, 
  importSurveyRows, 
  awardSurveyPoints, 
  injectAuthenticSampleEvaluations, 
  injectTestEvaluationsDataset, 
  clearTestSurveyData,
  parseGoogleFormsCsv 
} from '../src/lib/serverSurveyStore';
import { getUserByEmail } from '../src/lib/serverUserStore';
import { getAllPointsHistory } from '../src/lib/learningPointsServer';

console.log('================================================================');
console.log('🧪 RUNNING COMPREHENSIVE SURVEY & DATABASE TEST SUITE (PHASE 1-6)');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// TEST 1: Question Definitions (Phase 2)
// -------------------------------------------------------------
console.log('--- TEST 1: Question Schema & Categories ---');
const questions = getAllSurveyQuestions();
assert(questions.length >= 8, `Survey questions loaded (found: ${questions.length})`);
assert(questions.some(q => q.category === 'books'), 'Includes Digital Books evaluation question');
assert(questions.some(q => q.category === 'website'), 'Includes Website UI/UX evaluation question');
assert(questions.some(q => q.category === 'video'), 'Includes Video & Transcript evaluation question');
assert(questions.some(q => q.category === 'podcast'), 'Includes Podcast evaluation question');
assert(questions.some(q => q.category === 'article'), 'Includes Article evaluation question');

// -------------------------------------------------------------
// TEST 2: Authentic Google Forms Data Import (Phase 3)
// -------------------------------------------------------------
console.log('\n--- TEST 2: Data Import & Member Linking ---');
const sampleImportResult = injectAuthenticSampleEvaluations();
assert(sampleImportResult.success, 'Authentic evaluation import succeeded');
console.log(`   Imported: ${sampleImportResult.importedCount}, Duplicates Skipped: ${sampleImportResult.skippedDuplicates}`);

// -------------------------------------------------------------
// TEST 3: Idempotent Duplicate Prevention (Phase 3)
// -------------------------------------------------------------
console.log('\n--- TEST 3: Duplicate Import Prevention ---');
const reimportResult = injectAuthenticSampleEvaluations();
assert(reimportResult.importedCount === 0, 'Re-importing exact same data imports 0 new records');
assert(reimportResult.skippedDuplicates > 0, `Correctly identified & skipped ${reimportResult.skippedDuplicates} duplicate records`);

// -------------------------------------------------------------
// TEST 4: CSV String Parser (Phase 3)
// -------------------------------------------------------------
console.log('\n--- TEST 4: Google Forms CSV Parser ---');
const sampleCsv = `ประทับเวลา,ที่อยู่อีเมล,ความสะดวกรวดเร็วในการค้นหา,คุณภาพความคมชัดของ PDF,ความสวยงามของเว็บไซต์,ความชัดเจนของวิดีโอ,คุณภาพเสียงพอดแคสต์,คุณค่าบทความธรรมะ,ระบบสะสมแต้ม,ข้อเสนอแนะเพิ่มเติม
2026/11/08 19:30:00,parser.tester@gmail.com,5,4,5,4,5,5,4,"ระบบการใช้งานลื่นไหลดีมาก"`;
const parsedCsvRows = parseGoogleFormsCsv(sampleCsv);
assert(parsedCsvRows.length === 1, 'CSV parser correctly extracted 1 row');
assert(parsedCsvRows[0].respondentEmail === 'parser.tester@gmail.com', 'CSV parser extracted correct email');
assert(parsedCsvRows[0].ratings.q_book_search === 5, 'CSV parser extracted rating for q_book_search');

// -------------------------------------------------------------
// TEST 5: Points Awarding & Single-Award Guarantee (Phase 4)
// -------------------------------------------------------------
console.log('\n--- TEST 5: Points Awarding & Anti-Duplicate Guarantee (200 P) ---');
const allResponses = getAllSurveyResponses('all');
const verifiedMemberResp = allResponses.find(r => r.respondentEmail === 'asaneebas4567@gmail.com');
assert(Boolean(verifiedMemberResp), 'Found survey response for member asaneebas4567@gmail.com');

// Try awarding points
if (verifiedMemberResp) {
  const award1 = awardSurveyPoints(verifiedMemberResp.id);
  // It was either just awarded, or was already awarded during import
  const history = getAllPointsHistory();
  const txList = history.filter(h => h.userEmail.toLowerCase() === 'asaneebas4567@gmail.com' && h.type === 'website_survey');
  assert(txList.length === 1, `Exactly 1 'website_survey' transaction exists for asaneebas4567@gmail.com (found: ${txList.length})`);
  assert(txList[0].points === 200, 'Awarded points equal exactly 200 P');

  // Try awarding points a second time (MUST FAIL!)
  const award2 = awardSurveyPoints(verifiedMemberResp.id);
  assert(award2.success === false, 'Second attempt to award points was successfully BLOCKED');
  assert(award2.alreadyAwarded === true, 'Error message explicitly reports already awarded');

  const historyAfter = getAllPointsHistory();
  const txListAfter = historyAfter.filter(h => h.userEmail.toLowerCase() === 'asaneebas4567@gmail.com' && h.type === 'website_survey');
  assert(txListAfter.length === 1, 'Transaction count remained strictly 1 (anti-duplicate verified)');
}

// -------------------------------------------------------------
// TEST 6: Unregistered Member Points Rejection (Phase 4)
// -------------------------------------------------------------
console.log('\n--- TEST 6: Non-Member Points Protection ---');
const anonImport = importSurveyRows([
  {
    timestampStr: '2026-11-08T20:00:00.000Z',
    respondentEmail: 'completely_unregistered_guest@yahoo.com',
    ratings: { q_book_search: 5 },
    feedbackComment: 'Guest evaluation'
  }
], { autoAwardPoints: false });

const anonRespId = anonImport.importedIds[0];
if (anonRespId) {
  const anonAward = awardSurveyPoints(anonRespId);
  assert(anonAward.success === false, 'Points refused for non-registered email');
  assert(anonAward.pointsAwarded === 0, '0 points awarded to non-registered email');
}

// -------------------------------------------------------------
// TEST 7: Test Dataset Isolation & Cleanup (Phase 6)
// -------------------------------------------------------------
console.log('\n--- TEST 7: Test Data Isolation & Cleanup ---');
const testImport = injectTestEvaluationsDataset();
const analyticsRealOnly = getSurveyAnalytics('real_only');
const analyticsAll = getSurveyAnalytics('all');
assert(analyticsRealOnly.realResponsesCount > 0, 'Real evaluations counted correctly');
assert(analyticsAll.testResponsesCount > 0, 'Test evaluations flagged with is_test: true');

const clearResult = clearTestSurveyData();
assert(clearResult.clearedCount > 0, `Cleaned ${clearResult.clearedCount} test responses`);
const analyticsAfterClear = getSurveyAnalytics('all');
assert(analyticsAfterClear.testResponsesCount === 0, '0 test responses remain after cleanup');
assert(analyticsAfterClear.realResponsesCount > 0, 'Real user evaluations preserved safely without deletion');

console.log('\n================================================================');
console.log(`📊 TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
}
