import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSupabase, SUPABASE_AUDIO_BUCKET } from '@/lib/supabaseClient';

const ALLOWED_MIME_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/mp4',
  'audio/x-m4a',
  'audio/m4a',
  'audio/ogg',
  'audio/wav'
];

const MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: 'กรุณาเลือกไฟล์เสียง MP3' }, { status: 400 });
    }

    // 1. Validate File Type
    const fileType = file.type.toLowerCase();
    const fileName = file.name;
    const isExtensionAudio = /\.(mp3|m4a|ogg|wav|aac)$/i.test(fileName);

    if (!ALLOWED_MIME_TYPES.includes(fileType) && !isExtensionAudio) {
      return NextResponse.json({
        success: false,
        error: 'รูปแบบไฟล์ไม่ถูกต้อง รองรับเฉพาะไฟล์เสียง MP3, M4A, OGG หรือ WAV เท่านั้น'
      }, { status: 400 });
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({
        success: false,
        error: 'ขนาดไฟล์เกินกำหนด (สูงสุดไม่เกิน 100MB)'
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const sanitizedName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `podcasts/${Date.now()}-${sanitizedName}`;

    // 3. Upload to Supabase Storage if configured
    const supabase = getSupabase();
    if (supabase) {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(SUPABASE_AUDIO_BUCKET)
        .upload(storagePath, buffer, {
          contentType: fileType || 'audio/mpeg',
          upsert: true
        });

      if (uploadError) {
        console.warn('Supabase storage upload error, falling back to local:', uploadError.message);
      } else {
        const { data: urlData } = supabase.storage
          .from(SUPABASE_AUDIO_BUCKET)
          .getPublicUrl(storagePath);

        return NextResponse.json({
          success: true,
          storageType: 'supabase',
          storagePath: storagePath,
          publicUrl: urlData.publicUrl,
          fileName,
          fileSizeBytes: file.size
        });
      }
    }

    // 4. Local File Storage fallback
    const publicAudioDir = path.join(process.cwd(), 'public', 'audios');
    if (!fs.existsSync(publicAudioDir)) {
      fs.mkdirSync(publicAudioDir, { recursive: true });
    }

    const localFileName = `${Date.now()}-${sanitizedName}`;
    const localFilePath = path.join(publicAudioDir, localFileName);
    fs.writeFileSync(localFilePath, buffer);

    const publicUrl = `/audios/${localFileName}`;

    return NextResponse.json({
      success: true,
      storageType: 'local',
      storagePath: `podcasts/${localFileName}`,
      publicUrl,
      fileName,
      fileSizeBytes: file.size
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
