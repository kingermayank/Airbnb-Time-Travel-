import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Helper to check if Supabase is configured
export function isSupabaseConfigured(): boolean {
  const configured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl.trim() !== '' && supabaseAnonKey.trim() !== '');
  if (!configured) {
    console.warn('⚠️ Supabase not configured:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      urlValue: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'missing',
      keyValue: supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'missing'
    });
  } else {
    console.log('✅ Supabase configured:', {
      url: supabaseUrl?.substring(0, 30) + '...',
      keyPresent: !!supabaseAnonKey
    });
  }
  return configured;
}

// Only create client if configured, otherwise create a dummy client that won't crash
let supabaseInstance: SupabaseClient | null = null;

try {
  if (isSupabaseConfigured()) {
    supabaseInstance = createClient(supabaseUrl!, supabaseAnonKey!);
  } else {
    // Create a dummy client with placeholder values to prevent crashes
    supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
  }
} catch (error) {
  console.warn('Failed to initialize Supabase client:', error);
  // Create a dummy client as fallback
  supabaseInstance = createClient('https://placeholder.supabase.co', 'placeholder-key');
}

export const supabase = supabaseInstance!;

