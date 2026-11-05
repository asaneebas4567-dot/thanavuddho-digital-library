import { NextRequest, NextResponse } from 'next/server';
import { 
  getMergedBookQuests, 
  getAllMergedQuests, 
  saveCustomQuest, 
  deleteCustomQuest,
  getCustomQuests
} from '@/lib/serverQuestStore';
import { BookEasterEggQuest } from '@/data/bookEasterEggQuests';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const bookId = searchParams.get('bookId');
    const customOnly = searchParams.get('customOnly') === 'true';

    if (customOnly) {
      const list = getCustomQuests();
      return NextResponse.json({ success: true, quests: list });
    }

    if (bookId) {
      const quests = getMergedBookQuests(bookId);
      return NextResponse.json({ success: true, bookId, quests });
    }

    const allQuests = getAllMergedQuests();
    return NextResponse.json({ success: true, quests: allQuests });
  } catch (error) {
    console.error('Error fetching quests:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validation
    if (!body.bookId || !body.title || !body.question || !Array.isArray(body.options) || body.options.length !== 4) {
      return NextResponse.json(
        { success: false, error: 'ข้อมูลไม่ครบถ้วน กรุณากรอกรหัสหนังสือ ชื่อเรื่อง คำถาม และ 4 ตัวเลือก' },
        { status: 400 }
      );
    }

    const questId = body.id || `custom_quest_${Date.now()}`;
    const newQuest: BookEasterEggQuest = {
      id: questId,
      bookId: body.bookId,
      questNumber: Number(body.questNumber) || 1,
      title: body.title.trim(),
      subtitle: body.subtitle?.trim() || '',
      categoryTag: body.categoryTag?.trim() || '🥚 เควสลับประจำหน้า',
      questType: body.questType || 'side',
      isLegendary: Boolean(body.isLegendary),
      difficulty: body.difficulty || 'ปกติ',
      printedPageStart: body.printedPageStart ? Number(body.printedPageStart) : undefined,
      printedPageEnd: body.printedPageEnd ? Number(body.printedPageEnd) : undefined,
      triggerPage: Number(body.triggerPage) || 1,
      triggerPageEnd: body.triggerPageEnd ? Number(body.triggerPageEnd) : undefined,
      loreStory: body.loreStory?.trim() || '',
      hint: body.hint?.trim() || '',
      question: body.question.trim(),
      options: [
        body.options[0]?.trim() || 'ตัวเลือก 1',
        body.options[1]?.trim() || 'ตัวเลือก 2',
        body.options[2]?.trim() || 'ตัวเลือก 3',
        body.options[3]?.trim() || 'ตัวเลือก 4',
      ],
      correctIndex: Number(body.correctIndex) >= 0 && Number(body.correctIndex) <= 3 ? Number(body.correctIndex) : 0,
      explanation: body.explanation?.trim() || '',
      loot: {
        points: Number(body.loot?.points) || 50,
        badgeName: body.loot?.badgeName?.trim() || 'นักสำรวจธรรมะ',
        badgeIcon: body.loot?.badgeIcon?.trim() || '✨',
      },
    };

    const saved = saveCustomQuest(newQuest);
    return NextResponse.json({ success: true, quest: saved });
  } catch (error) {
    console.error('Error saving quest:', error);
    return NextResponse.json(
      { success: false, error: 'ไม่สามารถบันทึกเควสได้' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'กรุณาระบุ id ของเควสที่ต้องการลบ' },
        { status: 400 }
      );
    }

    const deleted = deleteCustomQuest(id);
    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'ไม่พบเควสนี้ในระบบ หรือเป็นเควสระบบหลักที่ไม่สามารถลบได้' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'ลบเควสเรียบร้อยแล้ว' });
  } catch (error) {
    console.error('Error deleting quest:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
