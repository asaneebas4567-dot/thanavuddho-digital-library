import { NextRequest, NextResponse } from 'next/server';
import { getRewardsCatalog } from '@/lib/learningPointsServer';

export async function GET() {
  const catalog = getRewardsCatalog();
  return NextResponse.json({
    success: true,
    rewards: catalog
  });
}

