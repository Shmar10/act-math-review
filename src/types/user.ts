// User-related types

export interface UserProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  question_id: string;
  correct_count: number;
  wrong_count: number;
  last_attempt_at: string | null;
  last_correct: boolean | null;
  first_seen_at: string;
}

export interface PracticeSession {
  id: string;
  user_id: string;
  session_type: 'quick' | 'standard' | 'full' | 'study';
  question_mode: 'sequential' | 'shuffled' | 'random';
  topic_filter: string | null;
  difficulty_filter: number | null;
  total_questions: number | null;
  correct_count: number;
  wrong_count: number;
  started_at: string;
  completed_at: string | null;
  time_spent_seconds: number | null;
  questions_answered: string | null; // JSON string
}

export interface RegisterData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthError {
  message: string;
  status?: number;
}

