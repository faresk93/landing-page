/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key is missing. Please check your .env file.');
}

// SECURITY NOTE: Ensure that Row Level Security (RLS) is enabled on your Supabase tables.
// For the 'notes' table, only allow authenticated users or specific policies for inserting/reading.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
