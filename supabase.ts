import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  school_name: string | null;
  subject: string | null;
  teacher_category: string | null;
  avatar_url: string | null;
  subscription_tier: 'free' | 'standard' | 'premium';
  subscription_expires_at: string | null;
  documents_this_month: number;
  storage_used_mb: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  title: string;
  type: 'calendar_plan' | 'lesson_plan' | 'other';
  settings: any;
  file_url: string | null;
  file_size_mb: number | null;
  status: 'draft' | 'generating' | 'ready' | 'error';
  error_message: string | null;
  created_at: string;
  updated_at: string;
}