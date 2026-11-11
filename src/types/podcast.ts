export type PodcastSourceType = 'youtube' | 'mp3';

export interface PodcastTranscriptItem {
  time: string;
  speaker: string;
  text: string;
}

export interface PodcastItem {
  id: string;
  title: string;
  description: string;
  host: string;
  cover_image: string;
  source_type: PodcastSourceType;
  youtube_url?: string;
  youtube_video_id?: string;
  audio_file_path?: string; // Supabase Storage path e.g. "podcasts/ep-01.mp3"
  audio_url?: string;       // Direct stream URL or Storage public URL
  duration_seconds: number;
  duration_formatted: string;
  category_id: string;
  category_name?: string;
  is_published: boolean;
  published_at: string;
  transcript?: PodcastTranscriptItem[];
  book_id?: string;
  order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface PodcastListeningProgress {
  user_id: string;
  user_email: string;
  podcast_id: string;
  current_position_seconds: number;
  duration_seconds: number;
  last_listened_at: string;
  completed_status: boolean;
}

export interface PodcastListeningSession {
  id: string;
  user_email: string;
  podcast_id: string;
  source_type: PodcastSourceType;
  started_at: string;
  last_ping_at: string;
  accumulated_seconds: number;
  points_awarded: number;
}

export interface PodcastPlayerState {
  currentPodcast: PodcastItem | null;
  sourceType: PodcastSourceType | null;
  isPlaying: boolean;
  isLoading: boolean;
  isExpanded: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
  volume: number;
  isMuted: boolean;
  playbackError: string | null;
  // Controls
  playPodcast: (podcast: PodcastItem, startPosition?: number) => void;
  pausePodcast: () => void;
  resumePodcast: () => void;
  togglePlay: () => void;
  seekTo: (seconds: number) => void;
  seekRelative: (deltaSeconds: number) => void;
  setPlaybackRate: (rate: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  expandPlayer: () => void;
  minimizePlayer: () => void;
  closePlayer: () => void;
}
