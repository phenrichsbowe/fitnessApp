import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_API_KEY;

const supabase = createClient(url, anonKey);

export default supabase;