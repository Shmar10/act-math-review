import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('VITE_SUPABASE_URL:', supabaseUrl ? '✓ Set' : '✗ Missing');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓ Set' : '✗ Missing');
  console.error('Please check your .env file and restart the dev server.');
  // Don't throw - show a helpful error message instead
}

// Create Supabase client (use placeholder values if env vars are missing)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
    global: {
      // Force HTTP/2 instead of HTTP/3 (QUIC) to avoid ERR_QUIC_PROTOCOL_ERROR
      fetch: (url, options = {}) => {
        return fetch(url, {
          ...options,
          // Add cache control to help with protocol issues
          cache: 'no-cache',
        });
      },
    },
  }
);

// Database types (will be generated from Supabase later, but basic types for now)
export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          email_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          email: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          email?: string;
          email_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          correct_count: number;
          wrong_count: number;
          last_attempt_at: string | null;
          last_correct: boolean | null;
          first_seen_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          correct_count?: number;
          wrong_count?: number;
          last_attempt_at?: string | null;
          last_correct?: boolean | null;
          first_seen_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          question_id?: string;
          correct_count?: number;
          wrong_count?: number;
          last_attempt_at?: string | null;
          last_correct?: boolean | null;
          first_seen_at?: string;
        };
      };
      practice_sessions: {
        Row: {
          id: string;
          user_id: string;
          session_type: string;
          question_mode: string;
          topic_filter: string | null;
          difficulty_filter: number | null;
          total_questions: number | null;
          correct_count: number;
          wrong_count: number;
          started_at: string;
          completed_at: string | null;
          time_spent_seconds: number | null;
          questions_answered: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          session_type: string;
          question_mode: string;
          topic_filter?: string | null;
          difficulty_filter?: number | null;
          total_questions?: number | null;
          correct_count?: number;
          wrong_count?: number;
          started_at?: string;
          completed_at?: string | null;
          time_spent_seconds?: number | null;
          questions_answered?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          session_type?: string;
          question_mode?: string;
          topic_filter?: string | null;
          difficulty_filter?: number | null;
          total_questions?: number | null;
          correct_count?: number;
          wrong_count?: number;
          started_at?: string;
          completed_at?: string | null;
          time_spent_seconds?: number | null;
          questions_answered?: string | null;
        };
      };
    };
  };
};

