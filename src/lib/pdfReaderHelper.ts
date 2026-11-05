/**
 * Helper utility for high-performance PDF loading, caching, canvas rendering, and text searching.
 * Uses Mozilla PDF.js v3.11.174 with dedicated worker support.
 */

// Global document cache to prevent re-fetching when turning pages
const pdfDocCache = new Map<string, any>();
const activeRenderTasks = new WeakMap<HTMLCanvasElement, any>();

/**
 * Load PDF.js library dynamically in the browser environment
 */
export function loadPdfJsLib(): Promise<any> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('PDF.js can only be loaded in browser environment'));
      return;
    }

    if ((window as any).pdfjsLib) {
      resolve((window as any).pdfjsLib);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    script.async = true;
    script.onload = () => {
      const pdfjs = (window as any).pdfjsLib;
      if (pdfjs) {
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        resolve(pdfjs);
      } else {
        reject(new Error('PDF.js failed to initialize on window'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load PDF.js script from CDN'));
    document.head.appendChild(script);
  });
}

/**
 * Resolve effective URL for PDF loading, transforming Google Drive URLs via /api/pdf-proxy
 */
export function getEffectivePdfUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  const trimmed = rawUrl.trim();

  // If already a local path (/books/pdf/...)
  if (trimmed.startsWith('/books/pdf/') || trimmed.startsWith('/api/')) {
    return trimmed;
  }

  // If Google Drive link, route through server-side proxy to bypass CORS
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    return `/api/pdf-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  // If other remote URL
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return `/api/pdf-proxy?url=${encodeURIComponent(trimmed)}`;
  }

  return trimmed;
}

/**
 * Load a PDF document from URL (with memory caching)
 */
export async function loadPdfDocument(url: string): Promise<any> {
  const effectiveUrl = getEffectivePdfUrl(url);

  if (pdfDocCache.has(effectiveUrl)) {
    return pdfDocCache.get(effectiveUrl);
  }

  const pdfjs = await loadPdfJsLib();
  const loadingTask = pdfjs.getDocument({
    url: effectiveUrl,
    cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  pdfDocCache.set(effectiveUrl, pdfDoc);
  return pdfDoc;
}

/**
 * Render a single PDF page onto an HTML5 canvas element with High-DPI support
 */
export async function renderPdfPageToCanvas(
  pdfDoc: any,
  pageNum: number,
  canvas: HTMLCanvasElement,
  options: {
    targetWidth?: number;
    targetHeight?: number;
    scale?: number;
  } = {}
): Promise<{ width: number; height: number; aspectRatio: number }> {
  if (!pdfDoc || pageNum < 1 || pageNum > pdfDoc.numPages) {
    throw new Error(`Invalid page number: ${pageNum} (total: ${pdfDoc?.numPages})`);
  }

  // Cancel any running render task on this canvas and wait for clean cancellation
  const existingTask = activeRenderTasks.get(canvas);
  if (existingTask) {
    try {
      existingTask.cancel();
      await existingTask.promise.catch(() => {});
    } catch {
      // Ignore cancellation exceptions
    }
    activeRenderTasks.delete(canvas);
  }

  const page = await pdfDoc.getPage(pageNum);
  
  // Calculate scale based on target dimensions
  let scale = options.scale || 1.0;
  const initialViewport = page.getViewport({ scale: 1.0 });
  const aspectRatio = initialViewport.width / initialViewport.height;

  if (options.targetWidth && options.targetHeight) {
    const scaleX = options.targetWidth / initialViewport.width;
    const scaleY = options.targetHeight / initialViewport.height;
    scale = Math.min(scaleX, scaleY);
  } else if (options.targetWidth) {
    scale = options.targetWidth / initialViewport.width;
  } else if (options.targetHeight) {
    scale = options.targetHeight / initialViewport.height;
  }

  // Clamp scale to reasonable bounds
  scale = Math.max(0.15, Math.min(scale, 4.0));

  // High-DPI device pixel ratio for crystal clear text (at least 2.5x supersampling for razor-sharp Thai fonts)
  const dpr = typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2.0) : 2.0;
  const viewport = page.getViewport({ scale: scale * dpr });

  canvas.width = viewport.width;
  canvas.height = viewport.height;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.objectFit = 'contain';

  const context = canvas.getContext('2d', { alpha: false });
  if (!context) {
    throw new Error('Canvas 2D context not available');
  }

  // Fill with white background before rendering
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);

  const renderContext = {
    canvasContext: context,
    viewport: viewport,
  };

  const renderTask = page.render(renderContext);
  activeRenderTasks.set(canvas, renderTask);

  try {
    await renderTask.promise;
    activeRenderTasks.delete(canvas);
  } catch (err: any) {
    if (err?.name !== 'RenderingCancelledException') {
      console.error(`Error rendering PDF page ${pageNum}:`, err);
      throw err;
    }
  }

  return {
    width: Math.floor(viewport.width / dpr),
    height: Math.floor(viewport.height / dpr),
    aspectRatio,
  };
}

export interface SearchMatch {
  pageNum: number;
  snippet: string;
}

/**
 * Search text across all pages in a PDF document
 */
export async function searchPdfText(pdfDoc: any, query: string, maxResults = 30): Promise<SearchMatch[]> {
  if (!pdfDoc || !query || query.trim().length === 0) return [];
  const q = query.trim().toLowerCase();
  const matches: SearchMatch[] = [];

  for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
    try {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');

      const lowerText = pageText.toLowerCase();
      const matchIndex = lowerText.indexOf(q);

      if (matchIndex !== -1) {
        const start = Math.max(0, matchIndex - 40);
        const end = Math.min(pageText.length, matchIndex + q.length + 50);
        let snippet = pageText.substring(start, end);
        if (start > 0) snippet = '...' + snippet;
        if (end < pageText.length) snippet = snippet + '...';

        matches.push({
          pageNum,
          snippet,
        });

        if (matches.length >= maxResults) break;
      }
    } catch {
      // Continue searching next page
    }
  }

  return matches;
}

/**
 * Destroy and clear cached PDF document to free up memory
 */
export function unloadPdfDocument(url: string) {
  const effectiveUrl = getEffectivePdfUrl(url);
  if (pdfDocCache.has(effectiveUrl)) {
    try {
      const doc = pdfDocCache.get(effectiveUrl);
      doc?.destroy();
    } catch {
      // Ignore
    }
    pdfDocCache.delete(effectiveUrl);
  }
}
