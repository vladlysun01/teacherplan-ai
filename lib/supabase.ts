import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'Set' : 'Missing');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  school_name: string | null;
  subject: string | null;
  teacher_category: string | null;
  subscription_tier: 'free' | 'standard' | 'premium';
  subscription_expires_at: string | null;
  documents_this_month: number;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  type: 'calendar_plan' | 'lesson_plan' | 'other';
  settings: any;
  file_url: string | null;
  status: 'draft' | 'generating' | 'ready' | 'error';
  created_at: string;
}