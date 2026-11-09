import { NextRequest, NextResponse } from 'next/server';
import { awardSurveyPoints, getSurveyAnalytics } from '@/lib/serverSurveyStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { responseId } = body;

    if (!responseId) {
      return NextResponse.json({ success: false, message: 'responseId is required' }, { status: 400 });
    }

    const result = awardSurveyPoints(responseId);
    const analytics = getSurveyAnalytics('real_only');

    return NextResponse.json({
      success: result.success,
      message: result.message,
      result,
      analytics
    }, { status: result.success ? 200 : 400 });
  } catch (error: any) {
    console.error('Error awarding survey points:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

