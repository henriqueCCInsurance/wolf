import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if we're in development or have missing environment variables
const isDevelopment = import.meta.env.DEV
const hasSupabaseConfig = supabaseUrl && supabaseAnonKey && supabaseUrl !== '' && supabaseAnonKey !== ''

// For production deployments without Supabase configured, use a mock client
let supabase: any

if (hasSupabaseConfig) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
} else {
  // Mock Supabase client for development or when environment variables are missing
  console.warn('Supabase environment variables not configured. Using mock authentication.')
  
  supabase = {
    auth: {
      signInWithPassword: async () => ({ 
        data: { user: { id: 'demo-user', email: 'demo@example.com' } }, 
        error: null 
      }),
      signUp: async () => ({ 
        data: { user: { id: 'demo-user', email: 'demo@example.com' } }, 
        error: null 
      }),
      signOut: async () => ({ error: null }),
      signInWithOAuth: async () => ({ error: null }),
      onAuthStateChange: (callback: any) => {
        // Simulate immediate auth state for demo
        if (isDevelopment) {
          setTimeout(() => callback(null, { user: { id: 'demo-user', email: 'demo@example.com' } }), 100)
        }
        return { data: { subscription: { unsubscribe: () => {} } } }
      },
      getUser: async () => ({ 
        data: { user: { id: 'demo-user', email: 'demo@example.com' } }, 
        error: null 
      }),
      updateUser: async () => ({ 
        data: { user: { id: 'demo-user', email: 'demo@example.com' } }, 
        error: null 
      }),
      resetPasswordForEmail: async () => ({ error: null })
    }
  }
}

export { supabase }

// Database type definitions will be generated here later
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          role: 'salesperson' | 'admin'
          avatar?: string
          created_at: string
          last_login?: string
          settings?: Record<string, any>
        }
        Insert: {
          id: string
          email: string
          name: string
          role?: 'salesperson' | 'admin'
          avatar?: string
          settings?: Record<string, any>
        }
        Update: {
          email?: string
          name?: string
          role?: 'salesperson' | 'admin'
          avatar?: string
          last_login?: string
          settings?: Record<string, any>
        }
      }
      call_logs: {
        Row: {
          id: string
          user_id: string
          lead_id: string
          outcome: 'meeting-booked' | 'nurture' | 'disqualified' | 'follow-up'
          intel: string
          best_talking_point: string
          key_takeaway: string
          call_duration?: number
          sequence_id?: string
          contact_id?: string
          start_time?: string
          end_time?: string
          attempt_number?: number
          additional_info?: Record<string, any>
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_id: string
          outcome: 'meeting-booked' | 'nurture' | 'disqualified' | 'follow-up'
          intel: string
          best_talking_point: string
          key_takeaway: string
          call_duration?: number
          sequence_id?: string
          contact_id?: string
          start_time?: string
          end_time?: string
          attempt_number?: number
          additional_info?: Record<string, any>
        }
        Update: {
          outcome?: 'meeting-booked' | 'nurture' | 'disqualified' | 'follow-up'
          intel?: string
          best_talking_point?: string
          key_takeaway?: string
          call_duration?: number
          sequence_id?: string
          contact_id?: string
          start_time?: string
          end_time?: string
          attempt_number?: number
          additional_info?: Record<string, any>
        }
      }
      battle_cards: {
        Row: {
          id: string
          user_id: string
          lead_data: Record<string, any>
          selected_content: Record<string, any>[]
          dynamic_intelligence: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          lead_data: Record<string, any>
          selected_content: Record<string, any>[]
          dynamic_intelligence: string[]
        }
        Update: {
          lead_data?: Record<string, any>
          selected_content?: Record<string, any>[]
          dynamic_intelligence?: string[]
        }
      }
      call_sequences: {
        Row: {
          id: string
          user_id: string
          name: string
          contacts: Record<string, any>[]
          status: 'planned' | 'active' | 'completed'
          sprint_size: number
          mode: 'standalone' | 'imported' | 'crm-sync'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          contacts: Record<string, any>[]
          status?: 'planned' | 'active' | 'completed'
          sprint_size: number
          mode: 'standalone' | 'imported' | 'crm-sync'
        }
        Update: {
          name?: string
          contacts?: Record<string, any>[]
          status?: 'planned' | 'active' | 'completed'
          sprint_size?: number
          mode?: 'standalone' | 'imported' | 'crm-sync'
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}