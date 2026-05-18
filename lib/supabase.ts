import { createClient } from '@supabase/supabase-js';

// FIX: Credentials moved to .env file — never hardcode keys in source code
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('[Supabase] Missing environment variables. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);