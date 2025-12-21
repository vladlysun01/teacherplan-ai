import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Export types
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