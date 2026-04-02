// src/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Pastikan kamu menaruh URL dan KEY ini di file .env lokal kamu
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);