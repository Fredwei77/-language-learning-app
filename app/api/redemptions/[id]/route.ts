import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取单个兑换记录详情
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("gift_redemptions")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (error) {
      console.error("Error fetching redemption:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ error: "Redemption not found" }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in GET /api/redemptions/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH - 更新兑换记录（仅管理员可以更新状态）
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 检查是否为管理员
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const body = await request.json()
    const { status, shipping_address } = body

    // 验证状态值
    if (status && !["pending", "processing", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const updateData: Record<string, any> = {}
    if (status) updateData.status = status
    if (shipping_address) updateData.shipping_address = shipping_address

    const { data, error } = await supabase
      .from("gift_redemptions")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating redemption:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in PATCH /api/redemptions/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - 取消兑换（仅在pending状态下可取消，并退还金币）
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // 获取兑换记录
    const { data: redemption, error: fetchError } = await supabase
      .from("gift_redemptions")
      .select("*")
      .eq("id", params.id)
      .eq("user_id", user.id)
      .single()

    if (fetchError || !redemption) {
      return NextResponse.json({ error: "Redemption not found" }, { status: 404 })
    }

    // 只能取消待处理的订单
    if (redemption.status !== "pending") {
      return NextResponse.json({ error: "Can only cancel pending orders" }, { status: 400 })
    }

    // 更新状态为已取消
    const { error: updateError } = await supabase
      .from("gift_redemptions")
      .update({ status: "cancelled" })
      .eq("id", params.id)

    if (updateError) {
      console.error("Error cancelling redemption:", updateError)
      return NextResponse.json({ error: "Failed to cancel redemption" }, { status: 500 })
    }

    // 退还金币
    const { data: profile } = await supabase.from("profiles").select("coins").eq("id", user.id).single()

    if (profile) {
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + redemption.coins_spent })
        .eq("id", user.id)

      // 记录金币交易
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: redemption.coins_spent,
        type: "refund",
        description: `取消兑换${redemption.gift_name}，退还金币`,
      })
    }

    return NextResponse.json({ success: true, message: "Redemption cancelled and coins refunded" })
  } catch (error) {
    console.error("Error in DELETE /api/redemptions/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
