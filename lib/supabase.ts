import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqhlbpfrljbbtshohpkt.supabase.co';
const supabaseKey = 'sb_publishable_9qdWA39HhI7CUF4Jr8CiLg_5l0MpEh0';

export const supabase = createClient(supabaseUrl, supabaseKey);