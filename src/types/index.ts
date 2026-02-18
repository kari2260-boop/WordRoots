// AI 未来家庭社群 - TypeScript Type Definitions

// ============================================
// User & Profile Types
// ============================================

export interface Profile {
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

// ============================================
// Assessment & Profile Data Types
// ============================================

export interface Assessment {
  id: number
  user_id: string
  type: string
  source: string
  status: string
  data: Record<string, any>
  summary: string | null
  created_at: string
}

export interface UserInterest {
  id: number
  user_id: string
  category: InterestCategory
  specific: string
  intensity: number // 1-5
  source: string
  assessment_id: number | null
  created_at: string
  updated_at: string
}

export interface UserStrength {
  id: number
  user_id: string
  dimension: StrengthDimension
  tag_name: string
  confidence: number // 0-1
  evidence_count: number
  source: string
  last_updated: string
  created_at: string
}

export interface UserTrait {
  id: number
  user_id: string
  trait_name: string
  score: number // 0-1
  source: string
  assessment_id: number | null
  created_at: string
}

export interface UserGoal {
  id: number
  user_id: string
  type: 'dream' | 'short_term' | 'skill'
  content: string
  status: 'active' | 'completed' | 'archived'
  created_at: string
  updated_at: string
}

export interface Observation {
  id: number
  user_id: string
  observer_id: string | null
  observer_role: 'parent' | 'teacher' | 'counselor' | 'admin'
  observer_name: string | null
  context: string | null
  content: string
  tags: string[]
  created_at: string
}

// ============================================
// Task & Activity Types
// ============================================

export interface Task {
  id: number
  title: string
  description: string | null
  type: TaskType
  points: number
  difficulty: number // 1-5
  tags: string[]
  emoji: string
  suitable_traits: string[] | null
  suitable_interests: string[] | null
  growth_dimensions: string[] | null
  is_active: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface UserTask {
  id: number
  user_id: string
  task_id: number
  status: 'pending' | 'completed'
  submit_content: string | null
  submit_images: string[] | null
  completed_at: string | null
  created_at: string
}

export interface Work {
  id: number
  user_id: string
  task_id: number | null
  title: string
  content: string | null
  images: string[] | null
  created_at: string
}

// ============================================
// Chat Types
// ============================================

export interface ChatMessage {
  id: number
  user_id: string
  role: 'user' | 'assistant'
  content: string
  mentor_id: string
  extracted_tags: string[] | null
  created_at: string
}

// ============================================
// Council (Future Committee) Types
// ============================================

export interface CouncilMentor {
  id: string
  name: string
  title: string
  emoji: string
  description: string
  dimensions: string[]
  unlockCondition: {
    type: 'level' | 'tasks_completed'
    value: number
    taskTypes?: TaskType[]
  }
}

export interface CouncilUnlock {
  id: number
  user_id: string
  mentor_id: string
  unlocked_at: string
}

// ============================================
// System Types
// ============================================

export interface ActivityLog {
  id: number
  user_id: string | null
  action: string
  details: Record<string, any> | null
  created_at: string
}

// ============================================
// Union Types & Enums
// ============================================

export type TaskType =
  | 'knowledge'
  | 'hands-on'
  | 'social'
  | 'creative'
  | 'reflection'
  | 'physical'
  | 'service'
  | 'tech'

export type InterestCategory =
  | 'science'
  | 'arts'
  | 'sports'
  | 'social'
  | 'tech'
  | 'nature'
  | 'language'
  | 'music'

export type StrengthDimension =
  | 'cognitive'
  | 'creative'
  | 'social'
  | 'emotional'
  | 'physical'
  | 'leadership'
  | 'practical'

export type UserRole = 'student' | 'admin' | 'parent' | 'teacher' | 'counselor'

// ============================================
// Assessment Question Types
// ============================================

export interface AssessmentQuestion {
  id: string
  step: 'interests' | 'strengths' | 'personality' | 'goals'
  type: 'single_choice' | 'multi_choice' | 'scale' | 'open_text' | 'ranking'
  question: string
  description?: string
  options?: {
    value: string
    label: string
    emoji?: string
  }[]
  maxSelections?: number
  required?: boolean
}

export interface OnboardingData {
  basicInfo: {
    age?: number
    grade?: string
    gender?: string
  }
  interests: Record<string, any>
  strengths: Record<string, any>
  personality: Record<string, any>
  goals: Record<string, any>
}

// ============================================
// Level System Types
// ============================================

export interface LevelInfo {
  level: number
  name: string
  minPoints: number
  emoji: string
}

export interface LevelProgress {
  current: LevelInfo
  next: LevelInfo | null
  progress: number // 0-100
  pointsToNext: number
}

// ============================================
// UI Component Props Types
// ============================================

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  children: React.ReactNode
  onClick?: () => void
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  onClick?: () => void
}

export interface BadgeProps {
  children: React.ReactNode
  color?: string
  size?: 'sm' | 'md'
  className?: string
}

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}
