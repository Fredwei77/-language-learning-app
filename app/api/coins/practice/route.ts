import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ApiError, handleApiError, requireAuth, successResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { practiceTimeRequestSchema } from "@/lib/validations"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    requireAuth(user?.id)

    // 速率限制检查
    await checkRateLimit(request, "coins", user.id)

    // 验证请求数据
    const body = await request.json()
    const { seconds } = practiceTimeRequestSchema.parse(body)

    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      throw new ApiError(404, "用户资料不存在", "PROFILE_NOT_FOUND")
    }

    const today = new Date().toISOString().split("T")[0]
    const lastPracticeDate = profile.last_check_in?.split("T")[0]

    // 获取今日已获得的练习金币
    const { data: todayTransactions } = await supabase
      .from("coin_transactions")
      .select("amount")
      .eq("user_id", user.id)
      .eq("type", "earn")
      .gte("created_at", `${today}T00:00:00`)
      .like("description", "%30分钟口语练习%")

    const earnedToday =
      todayTransactions?.reduce((sum: number, t: { amount: number }) => sum + t.amount, 0) || 0

    // 计算今日练习时长（分钟）
    const { data: todayProgress } = await supabase
      .from("learning_progress")
      .select("time_spent")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)

    const dailyPracticeTime =
      (todayProgress?.reduce((sum: number, p: { time_spent: number }) => sum + p.time_spent, 0) || 0) / 60

    const minutesBefore = dailyPracticeTime
    const minutesAfter = dailyPracticeTime + seconds / 60

    let earnedCoins = 0
    let canExplode = false

    // 检查是否达到30分钟并且今天还没领取奖励
    if (minutesBefore < 30 && minutesAfter >= 30 && earnedToday === 0) {
      earnedCoins = 100
      canExplode = true

      // 更新金币
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + earnedCoins })
        .eq("id", user.id)

      // 记录交易
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: earnedCoins,
        type: "earn",
        description: "完成每日30分钟口语练习",
      })
    }

    // 记录学习进度
    await supabase.from("learning_progress").insert({
      user_id: user.id,
      module_type: "pronunciation",
      progress: 0,
      score: 0,
      time_spent: seconds,
    })

    // 更新总学习时长
    await supabase
      .from("profiles")
      .update({ total_study_time: profile.total_study_time + seconds })
      .eq("id", user.id)

    return successResponse({
      earnedCoins,
      canExplode,
      totalCoins: profile.coins + earnedCoins,
      dailyPracticeTime: minutesAfter,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
