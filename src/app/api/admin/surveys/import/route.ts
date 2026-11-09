import { NextRequest, NextResponse } from 'next/server';
import { parseGoogleFormsCsv, importSurveyRows, getSurveyAnalytics } from '@/lib/serverSurveyStore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { csvText, rows, isTest = false, autoAwardPoints = true } = body;

    let parsedRows = rows;
    if (csvText && typeof csvText === 'string') {
      parsedRows = parseGoogleFormsCsv(csvText);
    }

    if (!Array.isArray(parsedRows) || parsedRows.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'ไม่พบข้อมูลสำหรับนำเข้า กรุณาตรวจสอบรูปแบบไฟล์ CSV หรือข้อความที่วาง'
      }, { status: 400 });
    }

    const result = importSurveyRows(parsedRows, { isTest, autoAwardPoints });
    const analytics = getSurveyAnalytics('real_only');

    return NextResponse.json({
      success: true,
      message: `นำเข้าแบบประเมินสำเร็จ ${result.importedCount} รายการ (ข้ามข้อมูลซ้ำ ${result.skippedDuplicates} รายการ, ให้คะแนน 200 แต้มแล้ว ${result.pointsAwardedCount} คน)`,
      result,
      analytics
    });
  } catch (error: any) {
    console.error('Error importing surveys:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

