import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllSurveyQuestions, 
  getAllSurveyResponses, 
  getSurveyAnalytics, 
  injectAuthenticSampleEvaluations, 
  injectTestEvaluationsDataset, 
  clearTestSurveyData 
} from '@/lib/serverSurveyStore';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const filter = (url.searchParams.get('filter') as 'all' | 'real_only' | 'test_only') || 'all';

    const questions = getAllSurveyQuestions();
    const responses = getAllSurveyResponses(filter);
    const analytics = getSurveyAnalytics(filter === 'test_only' ? 'test_only' : 'real_only');

    return NextResponse.json({
      success: true,
      questions,
      responses,
      analytics,
      filter
    });
  } catch (error: any) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === 'inject_authentic_sample') {
      const result = injectAuthenticSampleEvaluations();
      const analytics = getSurveyAnalytics('real_only');
      return NextResponse.json({
        success: true,
        message: `นำเข้าข้อมูลแบบประเมินจริงสำเร็จ ${result.importedCount} รายการ (ข้ามข้อมูลซ้ำ ${result.skippedDuplicates} รายการ, ให้คะแนน 200 แต้มแล้ว ${result.pointsAwardedCount} คน)`,
        result,
        analytics
      });
    }

    if (action === 'inject_test_dataset') {
      const result = injectTestEvaluationsDataset();
      const analytics = getSurveyAnalytics('real_only');
      return NextResponse.json({
        success: true,
        message: `นำเข้าชุดข้อมูลทดสอบสำเร็จ ${result.importedCount} รายการ (ข้ามข้อมูลซ้ำ ${result.skippedDuplicates} รายการ)`,
        result,
        analytics
      });
    }

    if (action === 'clear_test_data') {
      const result = clearTestSurveyData();
      const analytics = getSurveyAnalytics('real_only');
      return NextResponse.json({
        success: true,
        message: `ล้างข้อมูลทดสอบเรียบร้อยแล้ว (${result.clearedCount} รายการถูกลบ)`,
        result,
        analytics
      });
    }

    return NextResponse.json({ success: false, message: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    console.error('Error processing survey action:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

