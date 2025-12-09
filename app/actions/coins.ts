"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import { practiceTimeRequestSchema, redeemGiftRequestSchema } from "@/lib/validations"

/**
 * 记录练习时长并奖励金币
 */
export async function addPracticeTimeAction(seconds: number) {
  try {
    // 验证输入
    const { seconds: validatedSeconds } = practiceTimeRequestSchema.parse({ seconds })

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "未登录" }
    }

    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "用户资料不存在" }
    }

    const today = new Date().toISOString().split("T")[0]

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

    // 计算今日练习时长
    const { data: todayProgress } = await supabase
      .from("learning_progress")
      .select("time_spent")
      .eq("user_id", user.id)
      .gte("created_at", `${today}T00:00:00`)

    const dailyPracticeTime =
      (todayProgress?.reduce((sum: number, p: { time_spent: number }) => sum + p.time_spent, 0) || 0) / 60

    const minutesBefore = dailyPracticeTime
    const minutesAfter = dailyPracticeTime + validatedSeconds / 60

    let earnedCoins = 0
    let canExplode = false

    // 检查是否达到30分钟
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
      time_spent: validatedSeconds,
    })

    // 更新总学习时长
    await supabase
      .from("profiles")
      .update({ total_study_time: profile.total_study_time + validatedSeconds })
      .eq("id", user.id)

    // 重新验证相关页面
    revalidatePath("/profile")
    revalidatePath("/coins")

    return {
      success: true,
      data: {
        earnedCoins,
        canExplode,
        totalCoins: profile.coins + earnedCoins,
        dailyPracticeTime: minutesAfter,
      },
    }
  } catch (error) {
    console.error("Add practice time error:", error)
    return { success: false, error: "记录练习时长失败" }
  }
}

/**
 * 兑换礼物
 */
export async function redeemGiftAction(giftId: string, giftName: string, giftCoins: number) {
  try {
    // 验证输入
    const validated = redeemGiftRequestSchema.parse({ giftId, giftName, giftCoins })

    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "未登录" }
    }

    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      return { success: false, error: "用户资料不存在" }
    }

    if (profile.coins < validated.giftCoins) {
      return {
        success: false,
        error: `金币不足，还需要 ${validated.giftCoins - profile.coins} 金币`,
      }
    }

    // 扣除金币
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coins: profile.coins - validated.giftCoins })
      .eq("id", user.id)

    if (updateError) {
      return { success: false, error: "更新金币失败" }
    }

    // 记录交易
    await supabase.from("coin_transactions").insert({
      user_id: user.id,
      amount: -validated.giftCoins,
      type: "spend",
      description: `兑换${validated.giftName}`,
      reference_id: validated.giftId,
    })

    // 创建兑换记录
    await supabase.from("gift_redemptions").insert({
      user_id: user.id,
      gift_id: validated.giftId,
      gift_name: validated.giftName,
      coins_spent: validated.giftCoins,
      status: "pending",
    })

    // 重新验证相关页面
    revalidatePath("/profile")
    revalidatePath("/coins")
    revalidatePath("/shop")

    return {
      success: true,
      message: `成功兑换 ${validated.giftName}！`,
      remainingCoins: profile.coins - validated.giftCoins,
    }
  } catch (error) {
    console.error("Redeem gift error:", error)
    return { success: false, error: "兑换失败" }
  }
}

/**
 * 获取金币余额
 */
export async function getCoinsBalanceAction() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: "未登录" }
    }

    const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single()

    if (!profile) {
      return { success: false, error: "用户资料不存在" }
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

    // 获取交易历史
    const { data: history } = await supabase
      .from("coin_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)

    return {
      success: true,
      data: {
        total: profile.coins,
        dailyPracticeTime,
        earnedToday,
        history: history || [],
      },
    }
  } catch (error) {
    console.error("Get balance error:", error)
    return { success: false, error: "获取金币余额失败" }
  }
}
