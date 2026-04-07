import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * When VITE_SUPABASE_URL is set (production), auth flows through Supabase Auth.
 * When absent (local dev), auth falls back to the custom Express /auth/* endpoints.
 */
export const useSupabaseAuth = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;
