import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ApiError, handleApiError, requireAuth, successResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    requireAuth(user?.id)

    // 速率限制检查
    await checkRateLimit(request, "coins", user.id)

    // 获取用户金币余额
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      throw new ApiError(404, "用户资料不存在", "PROFILE_NOT_FOUND")
    }

    const today = new Date().toISOString().split("T")[0]

    // 获取今日练习时长
    const { data: todayProgress } = await supabase
      .from("learning_progress")
      .select("time_spent")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)

    const dailyPracticeTime = (todayProgress?.reduce((sum, p) => sum + p.time_spent, 0) || 0) / 60

    // 获取今日已获得的练习金币
    const { data: todayTransactions } = await supabase
      .from("coin_transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "earn")
      .gte("created_at", `${today}T00:00:00`)
      .like("description", "%30分钟口语练习%")

    const earnedToday = todayTransactions?.reduce((sum, t) => sum + t.amount, 0) || 0

    // 获取交易历史（最近10条）
    const { data: history } = await supabase
      .from("coin_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    return successResponse({
      total: profile.coins,
      dailyPracticeTime,
      earnedToday,
      history: history || [],
    })
  } catch (error) {
    return handleApiError(error)
  }
}
