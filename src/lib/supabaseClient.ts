import { createClient } from '@supabase/supabase-js';

// The publishable/anon key is meant for client-side use – it only grants
// access allowed by the Row Level Security policies defined in
// supabase/schema.sql (every table is scoped to auth.uid()).
const SUPABASE_URL = 'https://nzmszupobienfwjaqcmw.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_X6iX2mVHFCD6wczKEAPnpA_gaWXFZuA';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
