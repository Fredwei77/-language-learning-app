export interface Profile {
  id: string
  email: string | null
  display_name: string | null
  avatar_url: string | null
  coins: number
  total_study_time: number
  streak_days: number
  last_check_in: string | null
  created_at: string
  updated_at: string
}

export interface LearningProgress {
  id: string
  user_id: string
  module_type: string
  lesson_id: string | null
  progress: number
  score: number
  time_spent: number
  completed_at: string | null
  created_at: string
}

export interface CheckIn {
  id: string
  user_id: string
  check_in_date: string
  coins_earned: number
  streak_bonus: number
  created_at: string
}

export interface CoinTransaction {
  id: string
  user_id: string
  amount: number
  type: "earn" | "spend" | "purchase"
  description: string | null
  reference_id: string | null
  created_at: string
}

export interface GiftRedemption {
  id: string
  user_id: string
  gift_id: string
  gift_name: string
  coins_spent: number
  status: "pending" | "processing" | "completed" | "cancelled"
  shipping_address: Record<string, unknown> | null
  created_at: string
}
