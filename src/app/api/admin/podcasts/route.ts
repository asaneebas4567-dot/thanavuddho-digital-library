import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const PODCASTS_FILE = path.join(process.cwd(), 'src', 'data', 'persistentPodcasts.json');

function getAllPodcasts() {
  try {
    if (fs.existsSync(PODCASTS_FILE)) {
      return JSON.parse(fs.readFileSync(PODCASTS_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

function savePodcasts(podcasts: any[]) {
  fs.writeFileSync(PODCASTS_FILE, JSON.stringify(podcasts, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const podcasts = getAllPodcasts();
    return NextResponse.json({ success: true, count: podcasts.length, podcasts });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, title, host, description, cover, audio_url, duration, category_id, tags, status, featured } = body;

    if (!title || !title.trim()) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุชื่อรายการ Podcast' }, { status: 400 });
    }

    const podcasts = getAllPodcasts();
    const podId = id || `pod-${Date.now()}`;
    const cleanTitle = title.trim();

    const newRecord = {
      id: podId,
      title: cleanTitle,
      host: host ? host.trim() : 'พระครูปลัดสุวัฒนโพธิคุณ (สมชาย ฐานวุฑฺโฒ)',
      description: description ? description.trim() : '',
      cover: cover ? cover.trim() : 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
      audio_url: audio_url ? audio_url.trim() : 'https://actions.google.com/sounds/v1/ambiences/outdoor_morning.ogg',
      duration: duration ? duration.trim() : '15:00',
      category_id: category_id || 'cat_mind',
      tags: Array.isArray(tags) ? tags : (tags ? String(tags).split(',').map((t: string) => t.trim()) : ['Podcast', 'ธรรมะ']),
      status: status || 'published',
      featured: Boolean(featured),
      total_episodes: 1,
      published_at: new Date().toLocaleDateString('th-TH')
    };

    const idx = podcasts.findIndex((p: any) => p.id === podId);
    if (idx >= 0) {
      podcasts[idx] = { ...podcasts[idx], ...newRecord };
    } else {
      podcasts.unshift(newRecord);
    }

    savePodcasts(podcasts);

    return NextResponse.json({
      success: true,
      message: idx >= 0 ? 'อัปเดตข้อมูล Podcast เรียบร้อยแล้ว' : 'เพิ่ม Podcast ใหม่เข้าสู่ระบบเรียบร้อยแล้ว',
      podcast: newRecord
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'กรุณาระบุ ID Podcast ที่ต้องการลบ' }, { status: 400 });
    }

    const podcasts = getAllPodcasts();
    const updated = podcasts.filter((p: any) => p.id !== id);
    savePodcasts(updated);

    return NextResponse.json({ success: true, message: 'ลบ Podcast เรียบร้อยแล้ว' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
