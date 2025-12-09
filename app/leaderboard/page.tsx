import { createClient } from "@/lib/supabase/server"
import { LeaderboardClient } from "@/components/leaderboard-client"

// 强制动态渲染
export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function LeaderboardPage() {
  const supabase = await createClient()

  // Get current user
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Fetch leaderboards
  const [coinsLeaderboard, streakLeaderboard, timeLeaderboard] = await Promise.all([
    supabase.from("profiles").select("*").order("coins", { ascending: false }).limit(50),
    supabase.from("profiles").select("*").order("streak_days", { ascending: false }).limit(50),
    supabase.from("profiles").select("*").order("total_study_time", { ascending: false }).limit(50),
  ])

  return (
    <LeaderboardClient
      coinsData={coinsLeaderboard.data || []}
      streakData={streakLeaderboard.data || []}
      timeData={timeLeaderboard.data || []}
      currentUserId={user?.id}
    />
  )
}
