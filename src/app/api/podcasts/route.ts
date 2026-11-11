import { NextRequest, NextResponse } from 'next/server';
import { getAllPodcasts } from '@/lib/serverPodcastStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const search = searchParams.get('q');
    const sourceType = searchParams.get('source_type');

    let podcasts = getAllPodcasts().filter(p => p.is_published !== false);

    if (category && category !== 'all') {
      podcasts = podcasts.filter(p => p.category_id === category);
    }

    if (sourceType && sourceType !== 'all') {
      podcasts = podcasts.filter(p => p.source_type === sourceType);
    }

    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      podcasts = podcasts.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.host?.toLowerCase().includes(q)
      );
    }

    // Sort by order or published date
    podcasts.sort((a, b) => (a.order || 999) - (b.order || 999));

    return NextResponse.json({
      success: true,
      count: podcasts.length,
      podcasts
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
