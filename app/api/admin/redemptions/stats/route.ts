import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取订单统计信息
export async function GET(request: Request) {
  try {
    const supabase = await createClient()

    // 检查管理员权限
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()
    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    // 获取各状态订单数 - 如果表不存在则返回0
    let totalOrders = 0
    let pendingOrders = 0
    let processingOrders = 0
    let completedOrders = 0
    let cancelledOrders = 0
    let totalCoinsSpent = 0
    let todayOrders = 0
    let weekOrders = 0

    try {
      const { count } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
      totalOrders = count || 0

      const { count: pending } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending")
      pendingOrders = pending || 0

      const { count: processing } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "processing")
      processingOrders = processing || 0

      const { count: completed } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "completed")
      completedOrders = completed || 0

      const { count: cancelled } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
        .eq("status", "cancelled")
      cancelledOrders = cancelled || 0

      // 获取总金币消耗
      const { data: allRedemptions } = await supabase
        .from("gift_redemptions")
        .select("coins_spent, status")

      totalCoinsSpent = allRedemptions
        ?.filter(r => r.status !== "cancelled")
        .reduce((sum, r) => sum + r.coins_spent, 0) || 0

      // 获取今日订单数
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      const { count: today_count } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString())
      todayOrders = today_count || 0

      // 获取本周订单数
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      
      const { count: week_count } = await supabase
        .from("gift_redemptions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString())
      weekOrders = week_count || 0
    } catch (err) {
      console.log("gift_redemptions table may not exist yet")
    }

    return NextResponse.json({
      data: {
        totalOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        cancelledOrders,
        totalCoinsSpent,
        todayOrders,
        weekOrders
      }
    })
  } catch (error) {
    console.error("Error in GET /api/admin/redemptions/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
