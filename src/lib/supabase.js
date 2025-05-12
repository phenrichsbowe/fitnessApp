import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_API_KEY;

console.log('url: ' + url, 'anonKey: ' + anonKey);

// Create the default client with anonymous key
const supabase = createClient(url, anonKey);

export default supabase;