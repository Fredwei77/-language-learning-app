import { type NextRequest } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { ApiError, handleApiError, requireAuth, successResponse } from "@/lib/api-utils"
import { checkRateLimit } from "@/lib/rate-limit"
import { redeemGiftRequestSchema } from "@/lib/validations"

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
    const { giftId, giftName, giftCoins } = redeemGiftRequestSchema.parse(body)

    // 获取用户资料
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("coins")
      .eq("id", user.id)
      .single()

    if (profileError || !profile) {
      throw new ApiError(404, "用户资料不存在", "PROFILE_NOT_FOUND")
    }

    if (profile.coins < giftCoins) {
      throw new ApiError(400, `金币不足，还需要 ${giftCoins - profile.coins} 金币`, "INSUFFICIENT_COINS")
    }

    // 扣除金币
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coins: profile.coins - giftCoins })
      .eq("id", user.id)

    if (updateError) throw updateError

    // 记录交易
    const { error: transactionError } = await supabase.from("coin_transactions").insert({
      user_id: user.id,
      amount: -giftCoins,
      type: "spend",
      description: `兑换${giftName}`,
      reference_id: giftId,
    })

    if (transactionError) throw transactionError

    // 创建兑换记录
    const { error: redemptionError } = await supabase.from("gift_redemptions").insert({
      user_id: user.id,
      gift_id: giftId,
      gift_name: giftName,
      coins_spent: giftCoins,
      status: "pending",
    })

    if (redemptionError) throw redemptionError

    return successResponse(
      {
        success: true,
        remainingCoins: profile.coins - giftCoins,
      },
      `成功兑换 ${giftName}！`,
    )
  } catch (error) {
    return handleApiError(error)
  }
}
