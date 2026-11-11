/**
 * YouTube URL Parser & Utilities for Thanavuddho Library
 */

export interface ParsedYouTubeInfo {
  videoId: string | null;
  isValid: boolean;
  standardUrl: string;
  embedUrl: string;
  thumbnailUrl: string;
}

export function parseYouTubeUrl(urlOrId: string): ParsedYouTubeInfo {
  if (!urlOrId || typeof urlOrId !== 'string') {
    return {
      videoId: null,
      isValid: false,
      standardUrl: '',
      embedUrl: '',
      thumbnailUrl: ''
    };
  }

  const trimmed = urlOrId.trim();

  // Direct 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return {
      videoId: trimmed,
      isValid: true,
      standardUrl: `https://www.youtube.com/watch?v=${trimmed}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${trimmed}`,
      thumbnailUrl: `https://img.youtube.com/vi/${trimmed}/hqdefault.jpg`
    };
  }

  let videoId: string | null = null;

  try {
    // 1. Standard URL: youtube.com/watch?v=ID
    const url = new URL(trimmed);
    if (url.hostname.includes('youtube.com')) {
      if (url.searchParams.has('v')) {
        videoId = url.searchParams.get('v');
      } else if (url.pathname.startsWith('/embed/')) {
        videoId = url.pathname.replace('/embed/', '').split('/')[0];
      } else if (url.pathname.startsWith('/live/')) {
        videoId = url.pathname.replace('/live/', '').split('/')[0];
      } else if (url.pathname.startsWith('/shorts/')) {
        videoId = url.pathname.replace('/shorts/', '').split('/')[0];
      }
    } else if (url.hostname.includes('youtu.be')) {
      // 2. Short URL: youtu.be/ID
      videoId = url.pathname.slice(1).split('?')[0];
    }
  } catch {
    // Fallback regex matching
    const match = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([a-zA-Z0-9_-]{11})/);
    if (match && match[1]) {
      videoId = match[1];
    }
  }

  if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
    return {
      videoId,
      isValid: true,
      standardUrl: `https://www.youtube.com/watch?v=${videoId}`,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    };
  }

  return {
    videoId: null,
    isValid: false,
    standardUrl: trimmed,
    embedUrl: '',
    thumbnailUrl: ''
  };
}

export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  if (hrs > 0) {
    return `${hrs}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

