/**
 * Utility to extract Page 1 of any PDF as a high-resolution dataURL cover image
 */
export async function extractPdfCover(file: File): Promise<{ coverDataUrl: string; pageCount: number; error?: string }> {
  try {
    // Dynamically load pdf.js if not already present on window
    if (typeof window === 'undefined') {
      return { coverDataUrl: '', pageCount: 0, error: 'Runs on client only' };
    }

    const pdfjs = await loadPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    const pageCount = pdf.numPages;

    // Get Page 1 for book cover
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 }); // High-DPI scale for sharp cover

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    if (!context) {
      return { coverDataUrl: '', pageCount, error: 'Could not create canvas context' };
    }

    await page.render({ canvasContext: context, viewport: viewport }).promise;
    const coverDataUrl = canvas.toDataURL('image/jpeg', 0.9);

    return { coverDataUrl, pageCount };
  } catch (err: any) {
    console.error('Failed to extract PDF cover:', err);
    return { coverDataUrl: '', pageCount: 0, error: err.message };
  }
}

// Ensure PDF.js script is loaded
function loadPdfJs(): Promise<any> {
  return new Promise((resolve, reject) => {
    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js failed to initialize'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js CDN script'));
    document.head.appendChild(script);
  });
}
