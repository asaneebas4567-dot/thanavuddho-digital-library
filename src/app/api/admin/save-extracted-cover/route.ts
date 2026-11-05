import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { filename, dataUrl } = await req.json();
    if (!filename || !dataUrl) {
      return NextResponse.json({ success: false, message: 'Missing filename or dataUrl' }, { status: 400 });
    }

    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const targetPath = path.join(process.cwd(), 'public', 'images', 'books', filename);
    
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.writeFileSync(targetPath, buffer);

    return NextResponse.json({ success: true, path: `/images/books/${filename}` });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
