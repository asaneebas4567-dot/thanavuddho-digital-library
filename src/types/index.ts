export interface Author {
  id: string;
  display_name: string;
  name: string;
  pali_name: string;
  title: string;
  short_description: string;
  biography: string;
  profile_image: string;
  official_sources: string[];
  verified: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author_id: string;
  author?: string;
  description: string;
  cover_image?: string;
  cover?: string;
  content_type?: string;
  category_ids?: string[];
  category_id?: string;
  tags?: string[];
  publication_year?: number | null;
  page_count?: number | null;
  pages?: number | null;
  language?: string;
  pdf_url?: string;
  reader_url?: string;
  audio_id?: string | null;
  video_ids?: string[];
  source_url?: string;
  copyright_status?: string;
  is_copyright?: boolean;
  copyright_notice?: string;
  isbn?: string;
  publisher?: string;
  verified?: boolean;
  featured?: boolean;
  view_count?: number;
  read_count?: number;
  like_count?: number;
  is_finished?: boolean;
  status?: 'published' | 'draft' | 'archived' | string;
}

export interface Article {
  id: string;
  title: string;
  author_id: string;
  description: string;
  content: string;
  thumbnail: string;
  category_ids: string[];
  tags: string[];
  published_date: string | null;
  source_url: string;
  copyright_status: string;
  verified: boolean;
  view_count: number;
  like_count?: number;
  is_finished?: boolean;
  status?: 'published' | 'draft' | 'archived' | string;
}

export interface Dhamma {
  id: string;
  title: string;
  description: string;
  content: string;
  category_ids: string[];
  tags: string[];
  source_type: string;
  source_url: string;
  related_book_ids: string[];
  related_video_ids: string[];
  related_audio_ids: string[];
  verified: boolean;
  view_count?: number;
  like_count?: number;
}

export interface Audio {
  id: string;
  title: string;
  description: string;
  audio_url: string;
  thumbnail: string;
  duration: string;
  category_ids: string[];
  tags: string[];
  related_book_id: string | null;
  source_url: string;
  copyright_status: string;
  view_count: number;
  like_count?: number;
  is_finished?: boolean;
  status?: 'published' | 'draft' | 'archived' | string;
}

export type VideoOrientation = 'horizontal' | 'vertical';

export interface Video {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail: string;
  duration: string;
  video_type: string;
  category_ids: string[];
  tags: string[];
  related_book_ids: string[];
  source_url: string;
  copyright_status: string;
  published_date: string | null;
  view_count: number;
  like_count?: number;
  is_finished?: boolean;
  orientation?: VideoOrientation;
  aspect_ratio?: '16:9' | '9:16';
  youtubeId?: string;
  author?: string;
  channel_handle?: string;
  is_available?: boolean;
  unavailable_reason?: string;
  related_book_id?: string;
  related_book_title?: string;
}

export interface VideoChannelProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  banner?: string;
  description: string;
  subscribers_count: string;
  total_videos: number;
  official_url: string;
  verified: boolean;
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  content_type: string;
  items: string[];
  created_by: string;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  image: string;
  video_id: string | null;
  button_text: string;
  target_type: string;
  target_id: string | null;
  active: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  profile_image: string;
  role: string;
  favorite_book_ids: string[];
  reading_history: string[];
  last_login: string | null;
  created_at: string | null;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  current_page: number;
  total_pages: number;
  progress_percent: number;
  status: string;
  last_read_at: string | null;
}

export interface WatchHistory {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  current_time_seconds: number;
  is_completed: boolean;
  last_watched_at: string | null;
}

export interface Favorite {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  created_at: string | null;
}

export interface SiteSettings {
  contact_email: string;
  facebook_url: string;
  youtube_url: string;
}

export type MediaType = 'book' | 'audio' | 'video' | 'audiobook' | 'podcast' | 'article' | 'quiz';

export interface AudiobookTrack {
  chapter_number: number;
  title: string;
  duration: string;
  audio_url: string;
}

export interface Audiobook {
  id: string;
  title: string;
  author_id: string;
  narrator: string;
  description: string;
  cover: string;
  duration: string;
  category_id: string;
  tags: string[];
  tracks: AudiobookTrack[];
  related_book_id?: string;
  is_borrowable?: boolean;
  total_borrows?: number;
}

export interface PodcastEpisode {
  id: string;
  episode_number: number;
  title: string;
  duration: string;
  audio_url: string;
  published_at: string;
  description: string;
}

export interface Podcast {
  id: string;
  title: string;
  host: string;
  description: string;
  cover: string;
  category_id: string;
  tags: string[];
  episodes: PodcastEpisode[];
  total_episodes: number;
}

export interface LoanRecord {
  id: string;
  user_id: string;
  media_id: string;
  media_type: MediaType;
  media_title: string;
  media_cover: string;
  borrowed_at: string;
  due_date: string;
  returned_at?: string | null;
  renewal_count: number;
  status: 'active' | 'returned' | 'overdue';
}

export type QuizLevel = 'chapter' | 'book' | 'category' | 'comprehensive';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  source_ref?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: QuizLevel;
  level_label: string;
  target_id?: string;
  target_title?: string;
  time_limit_minutes: number;
  xp_reward: number;
  passing_score: number;
  questions: QuizQuestion[];
  badge_id?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  level_required: QuizLevel;
  earned: boolean;
  earned_date?: string;
}

export interface DhammaCertificate {
  id: string;
  user_name: string;
  exam_title: string;
  score: number;
  total_questions: number;
  issued_at: string;
  certificate_code: string;
  status: 'honors' | 'pass';
}

export interface SmartSearchResult {
  id: string;
  title: string;
  media_type: MediaType;
  category_name: string;
  description: string;
  link: string;
  cover_or_thumbnail: string;
  matched_concepts: string[];
  timestamp_seconds?: number;
  timestamp_formatted?: string;
  page_number?: number;
  highlight_snippet: string;
  source_context?: string;
}

export type FallbackSituation = 
  | 'situation_a_full'            // A: พบคำตอบครบจากหนังสือหรือบทความ
  | 'situation_b_partial'         // B: พบข้อมูลบางส่วน แต่ยังตอบไม่ครบ + แนะนำวิดีโอ
  | 'situation_c_video_fallback'  // C: ไม่พบในหนังสือ แต่พบวิดีโอเทศนาที่เกี่ยวข้อง
  | 'situation_d_not_found';      // D: ไม่พบทั้งข้อมูลและวิดีโอ

export interface VideoTranscriptSegment {
  startTime: string;
  seconds: number;
  text: string;
}

export interface VideoKnowledgeItem {
  id: string;
  youtubeId: string;
  title: string;
  url: string;
  thumbnail: string;
  channelName: string;
  channelHandle: string;
  description: string;
  transcript?: string;
  transcriptSegments?: VideoTranscriptSegment[];
  hasVerifiedTranscript: boolean;
  startSeconds?: number;
  startFormatted?: string;
  tags: string[];
  keywords: string[];
  publishedDate?: string;
  status: 'published' | 'draft' | 'archived';
  isOfficialChannel: boolean;
  recommendCount?: number;
  lastRecommendedAt?: string;
  relevanceReason?: string;
  unverifiedContentNotice?: string;
}

export interface UnansweredQueryLog {
  id: string;
  query: string;
  timestamp: string;
  hitCount: number;
  resolved?: boolean;
}

export interface DhammaCitation {
  id: string;
  title: string;
  type: MediaType;
  link: string;
  quote?: string;
  cover?: string;
  description?: string;
  snippet?: string;
  timestamp_formatted?: string;
  page_number?: number;
  actionText?: string;
  relevanceReason?: string;
  hasVerifiedTranscript?: boolean;
  unverifiedContentNotice?: string;
  youtubeId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  citations?: DhammaCitation[];
  evidenceLevel?: 'direct_verified' | 'general_dhamma' | 'unverified_or_no_evidence';
  evidenceBadgeText?: string;
  categoryBadge?: string;
  situation?: FallbackSituation;
  missingAspectNotice?: string;
}
