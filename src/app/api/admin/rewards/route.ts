import { NextRequest, NextResponse } from 'next/server';
import { 
  getRewardsCatalog, 
  getAllRedemptions, 
  getAllPointsHistory,
  updateCatalogRewardItem,
  updateRedemptionStatus,
  RewardItem 
} from '@/lib/learningPointsServer';
import { getAllUsers } from '@/lib/serverUserStore';

export async function GET() {
  const catalog = getRewardsCatalog();
  const redemptions = getAllRedemptions();
  const history = getAllPointsHistory().slice(0, 50); // Recent 50 transactions
  const users = getAllUsers();

  const totalPointsDistributed = Object.values(users).reduce((sum, u) => sum + (u.points || 0), 0);
  const pendingOrdersCount = redemptions.filter(r => r.status === 'pending').length;

  return NextResponse.json({
    success: true,
    stats: {
      totalItems: catalog.length,
      totalOrders: redemptions.length,
      pendingOrders: pendingOrdersCount,
      totalPointsInSystem: totalPointsDistributed
    },
    rewards: catalog,
    redemptions,
    recentTransactions: history
  });
}

// Update or create reward item
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const item: RewardItem = body.item;

    if (!item || !item.id || !item.title || !item.points) {
      return NextResponse.json({ success: false, message: 'ข้อมูลของรางวัลไม่ครบถ้วน' }, { status: 400 });
    }

    const saved = updateCatalogRewardItem(item);
    return NextResponse.json({ success: true, reward: saved });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

// Update redemption status (e.g. approve, mark shipped with tracking number)
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { redemptionId, status, trackingNumber } = body;

    if (!redemptionId || !status) {
      return NextResponse.json({ success: false, message: 'กรุณาระบุรหัสคำสั่งแลกและสถานะ' }, { status: 400 });
    }

    const updated = updateRedemptionStatus(redemptionId, status, trackingNumber);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'ไม่พบคำสั่งแลกรางวัลนี้' }, { status: 404 });
    }

    return NextResponse.json({ success: true, redemption: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}

