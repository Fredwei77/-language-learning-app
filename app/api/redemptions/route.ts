import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取用户的兑换记录
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 50

    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let query = supabase
      .from("gift_redemptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching redemptions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("Error in GET /api/redemptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - 创建新的兑换记录（从商城兑换）
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { gift_id, gift_name, coins_spent, shipping_address } = body

    // 验证必填字段
    if (!gift_id || !gift_name || !coins_spent) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 验证用户金币是否足够
    const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single()

    if (!profile || profile.coins < coins_spent) {
      return NextResponse.json({ error: "Insufficient coins" }, { status: 400 })
    }

    // 开始事务：扣除金币、创建兑换记录、记录交易
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ coins: profile.coins - coins_spent })
      .eq("id", user.id)

    if (updateError) {
      console.error("Error updating coins:", updateError)
      return NextResponse.json({ error: "Failed to update coins" }, { status: 500 })
    }

    // 创建兑换记录
    const { data: redemption, error: redemptionError } = await supabase
      .from("gift_redemptions")
      .insert({
        user_id: user.id,
        gift_id,
        gift_name,
        coins_spent,
        status: "pending",
        shipping_address,
      })
      .select()
      .single()

    if (redemptionError) {
      console.error("Error creating redemption:", redemptionError)
      // 回滚金币
      await supabase
        .from("profiles")
        .update({ coins: profile.coins })
        .eq("id", user.id)
      return NextResponse.json({ error: "Failed to create redemption" }, { status: 500 })
    }

    // 记录金币交易
    await supabase.from("coin_transactions").insert({
      user_id: user.id,
      amount: -coins_spent,
      type: "spend",
      description: `兑换${gift_name}`,
    })

    return NextResponse.json({ data: redemption })
  } catch (error) {
    console.error("Error in POST /api/redemptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
