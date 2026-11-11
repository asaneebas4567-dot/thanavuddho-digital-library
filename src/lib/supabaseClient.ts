import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('https://')
);

let clientInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured) return null;
  if (!clientInstance) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }
  return clientInstance;
}

export const SUPABASE_AUDIO_BUCKET = 'audio-tracks';

/**
 * Get public URL for an audio file path in Supabase Storage
 */
export function getStorageAudioUrl(storagePath: string): string {
  if (!storagePath) return '';
  if (storagePath.startsWith('http://') || storagePath.startsWith('https://')) {
    return storagePath;
  }
  const supabase = getSupabase();
  if (supabase) {
    const { data } = supabase.storage.from(SUPABASE_AUDIO_BUCKET).getPublicUrl(storagePath);
    return data?.publicUrl || storagePath;
  }
  return storagePath;
}
