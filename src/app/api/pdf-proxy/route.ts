import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawUrl = searchParams.get('url') || searchParams.get('src') || '';

    if (!rawUrl) {
      return NextResponse.json(
        { success: false, message: 'URL parameter is required' },
        { status: 400 }
      );
    }

    const decodedUrl = decodeURIComponent(rawUrl).trim();

    // 1. Handle Local Project PDF Files (/books/pdf/...)
    if (decodedUrl.startsWith('/books/pdf/') || decodedUrl.startsWith('books/pdf/')) {
      const cleanPath = decodedUrl.startsWith('/') ? decodedUrl.slice(1) : decodedUrl;
      const localFilePath = path.join(process.cwd(), 'public', cleanPath);

      if (fs.existsSync(localFilePath)) {
        const fileBuffer = fs.readFileSync(localFilePath);
        return new NextResponse(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'inline',
            'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // 2. Handle Google Drive URLs
    if (decodedUrl.includes('drive.google.com') || decodedUrl.includes('docs.google.com')) {
      let fileId = '';
      const fileIdMatch = decodedUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        fileId = fileIdMatch[1];
      } else {
        const idParamMatch = decodedUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
        if (idParamMatch && idParamMatch[1]) {
          fileId = idParamMatch[1];
        }
      }

      if (!fileId) {
        return NextResponse.json(
          { success: false, message: 'ไม่สามารถระบุ File ID จาก Google Drive URL ได้' },
          { status: 400 }
        );
      }

      // Download endpoint for Google Drive
      const gDriveDownloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=t`;

      const response = await fetch(gDriveDownloadUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'application/pdf,*/*',
        },
      });

      const contentType = response.headers.get('content-type') || '';

      // Helper to check if buffer is a PDF by magic bytes %PDF- (0x25 0x50 0x44 0x46)
      const isPdfBytes = (buffer: ArrayBuffer) => {
        if (buffer.byteLength < 4) return false;
        const h = new Uint8Array(buffer.slice(0, 4));
        return h[0] === 0x25 && h[1] === 0x50 && h[2] === 0x44 && h[3] === 0x46;
      };

      // If Google Drive returns the PDF stream directly (either as application/pdf or application/octet-stream)
      if (response.ok && (contentType.includes('application/pdf') || contentType.includes('application/octet-stream') || contentType.includes('binary'))) {
        const arrayBuffer = await response.arrayBuffer();
        if (isPdfBytes(arrayBuffer) || contentType.includes('application/pdf')) {
          return new NextResponse(arrayBuffer, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': 'inline',
              'Cache-Control': 'public, max-age=86400',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      }

      // If Google Drive returned an HTML page (large file virus scan confirmation page)
      if (contentType.includes('text/html')) {
        const htmlText = await response.text();

        // Check if there is a download confirmation token in HTML form/link
        const confirmMatch = htmlText.match(/confirm=([0-9A-Za-z_-]+)/);
        const token = confirmMatch ? confirmMatch[1] : 't';

        const retryUrl = `https://drive.google.com/uc?export=download&id=${fileId}&confirm=${token}`;
        const retryRes = await fetch(retryUrl, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        });

        const retryContentType = retryRes.headers.get('content-type') || '';
        if (retryRes.ok && (retryContentType.includes('application/pdf') || retryContentType.includes('application/octet-stream'))) {
          const arrayBuffer = await retryRes.arrayBuffer();
          if (isPdfBytes(arrayBuffer) || retryContentType.includes('application/pdf')) {
            return new NextResponse(arrayBuffer, {
              status: 200,
              headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=86400',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        }

        // If file requires Google login or permissions
        return NextResponse.json(
          {
            success: false,
            message:
              'ไฟล์ Google Drive นี้อาจจำเป็นต้องได้รับสิทธิ์การเข้าถึง หรือเป็นลิงก์ส่วนบุคคล',
            fileId,
            previewUrl: `https://drive.google.com/file/d/${fileId}/preview`,
          },
          { status: 403 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Google Drive ตอบกลับด้วย Content-Type: ${contentType}`,
          fileId,
        },
        { status: 502 }
      );
    }

    // 3. Handle Other Remote HTTPS PDF URLs
    if (decodedUrl.startsWith('https://') || decodedUrl.startsWith('http://')) {
      const response = await fetch(decodedUrl, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      });

      if (!response.ok) {
        return NextResponse.json(
          { success: false, message: `Failed to fetch remote PDF: HTTP ${response.status}` },
          { status: response.status }
        );
      }

      const arrayBuffer = await response.arrayBuffer();
      return new NextResponse(arrayBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'inline',
          'Cache-Control': 'public, max-age=3600',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return NextResponse.json(
      { success: false, message: 'รูปแบบ URL ไม่ถูกต้อง' },
      { status: 400 }
    );
  } catch (err: any) {
    console.error('PDF Proxy error:', err);
    return NextResponse.json(
      { success: false, message: err?.message || 'เกิดข้อผิดพลาดในการดึงข้อมูล PDF' },
      { status: 500 }
    );
  }
}
