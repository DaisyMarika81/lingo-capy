export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'student' | 'parent' | 'teacher' | 'admin';
export type ContentStatus = 'draft' | 'reviewed' | 'published';
export type QuestionType = 'mcq' | 'fill_blank' | 'true_false' | 'matching' | 'reorder';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string | null
          avatar_url: string | null
          parent_id: string | null
          streak_days: number
          last_active_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          parent_id?: string | null
          streak_days?: number
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          parent_id?: string | null
          streak_days?: number
          last_active_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          level: string
          cover_url: string | null
          description: string | null
          status: ContentStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          level?: string
          cover_url?: string | null
          description?: string | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          level?: string
          cover_url?: string | null
          description?: string | null
          status?: ContentStatus
          created_at?: string
          updated_at?: string
        }
      }
      units: {
        Row: {
          id: string
          book_id: string
          position: number
          title: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          book_id: string
          position?: number
          title: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          position?: number
          title?: string
          description?: string | null
          created_at?: string
        }
      }
      lessons: {
        Row: {
          id: string
          unit_id: string
          position: number
          title: string
          video_id: string | null
          duration_sec: number
          objectives: Json
          vocabulary: Json
          grammar: Json
          created_at: string
        }
        Insert: {
          id?: string
          unit_id: string
          position?: number
          title: string
          video_id?: string | null
          duration_sec?: number
          objectives?: Json
          vocabulary?: Json
          grammar?: Json
          created_at?: string
        }
        Update: {
          id?: string
          unit_id?: string
          position?: number
          title?: string
          video_id?: string | null
          duration_sec?: number
          objectives?: Json
          vocabulary?: Json
          grammar?: Json
          created_at?: string
        }
      }
      exercises: {
        Row: {
          id: string
          lesson_id: string
          position: number
          title: string
          source: 'book' | 'ai'
          created_at: string
        }
        Insert: {
          id?: string
          lesson_id: string
          position?: number
          title: string
          source?: 'book' | 'ai'
          created_at?: string
        }
        Update: {
          id?: string
          lesson_id?: string
          position?: number
          title?: string
          source?: 'book' | 'ai'
          created_at?: string
        }
      }
      questions: {
        Row: {
          id: string
          exercise_id: string
          position: number
          type: QuestionType
          content: Json
          answer: Json
          explanation: string | null
          status: ContentStatus
          created_at: string
        }
        Insert: {
          id?: string
          exercise_id: string
          position?: number
          type: QuestionType
          content: Json
          answer: Json
          explanation?: string | null
          status?: ContentStatus
          created_at?: string
        }
        Update: {
          id?: string
          exercise_id?: string
          position?: number
          type?: QuestionType
          content?: Json
          answer?: Json
          explanation?: string | null
          status?: ContentStatus
          created_at?: string
        }
      }
      enrollments: {
        Row: {
          user_id: string
          book_id: string
          enrolled_at: string
          expires_at: string | null
        }
        Insert: {
          user_id: string
          book_id: string
          enrolled_at?: string
          expires_at?: string | null
        }
        Update: {
          user_id?: string
          book_id?: string
          enrolled_at?: string
          expires_at?: string | null
        }
      }
      lesson_progress: {
        Row: {
          user_id: string
          lesson_id: string
          watched_pct: number
          last_position_sec: number
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          user_id: string
          lesson_id: string
          watched_pct?: number
          last_position_sec?: number
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          user_id?: string
          lesson_id?: string
          watched_pct?: number
          last_position_sec?: number
          completed_at?: string | null
          updated_at?: string
        }
      }
      attempts: {
        Row: {
          id: string
          user_id: string
          exercise_id: string
          score: number
          started_at: string
          finished_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          exercise_id: string
          score?: number
          started_at?: string
          finished_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          exercise_id?: string
          score?: number
          started_at?: string
          finished_at?: string | null
        }
      }
      attempt_answers: {
        Row: {
          attempt_id: string
          question_id: string
          user_answer: Json
          is_correct: boolean
        }
        Insert: {
          attempt_id: string
          question_id: string
          user_answer: Json
          is_correct: boolean
        }
        Update: {
          attempt_id?: string
          question_id?: string
          user_answer?: Json
          is_correct?: boolean
        }
      }
    }
  }
}
