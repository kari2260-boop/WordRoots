// Supabase Database Types
// 这是一个简化的 Database type，实际使用时可以用 Supabase CLI 生成

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          nickname: string
          avatar_url: string | null
          age: number | null
          grade: string | null
          gender: string | null
          level: number
          points: number
          onboarding_completed: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname?: string
          avatar_url?: string | null
          age?: number | null
          grade?: string | null
          gender?: string | null
          level?: number
          points?: number
          onboarding_completed?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nickname?: string
          avatar_url?: string | null
          age?: number | null
          grade?: string | null
          gender?: string | null
          level?: number
          points?: number
          onboarding_completed?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // 其他表类型省略，使用时可以扩展
    }
  }
}
