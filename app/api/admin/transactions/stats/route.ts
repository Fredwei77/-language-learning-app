import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取交易统计信息
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

    // 获取所有交易 - 如果表不存在则返回默认值
    let allTransactions: any[] = []
    let todayTransactions = 0
    let weekTransactions = 0
    let todayPurchaseAmount = 0
    
    try {
      const { data, error: transError } = await supabase
        .from("coin_transactions")
        .select("*")

      if (!transError && data) {
        allTransactions = data
      }
    } catch (err) {
      console.log("coin_transactions table may not exist yet")
    }

    // 统计各类型交易
    const purchaseTransactions = allTransactions.filter(t => t.type === "purchase")
    const earnTransactions = allTransactions.filter(t => t.type === "earn")
    const spendTransactions = allTransactions.filter(t => t.type === "spend")

    const totalPurchase = purchaseTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalEarn = earnTransactions.reduce((sum, t) => sum + t.amount, 0)
    const totalSpend = Math.abs(spendTransactions.reduce((sum, t) => sum + t.amount, 0))

    // 获取今日交易
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    try {
      const { count } = await supabase
        .from("coin_transactions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today.toISOString())
      
      todayTransactions = count || 0
    } catch (err) {
      // 忽略错误
    }

    // 获取本周交易
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    try {
      const { count } = await supabase
        .from("coin_transactions")
        .select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString())
      
      weekTransactions = count || 0
    } catch (err) {
      // 忽略错误
    }

    // 获取今日购买金币总额
    try {
      const { data: todayPurchases } = await supabase
        .from("coin_transactions")
        .select("amount")
        .eq("type", "purchase")
        .gte("created_at", today.toISOString())

      todayPurchaseAmount = todayPurchases?.reduce((sum, t) => sum + t.amount, 0) || 0
    } catch (err) {
      // 忽略错误
    }

    return NextResponse.json({
      data: {
        totalTransactions: allTransactions.length,
        purchaseCount: purchaseTransactions.length,
        earnCount: earnTransactions.length,
        spendCount: spendTransactions.length,
        totalPurchase,
        totalEarn,
        totalSpend,
        todayTransactions,
        weekTransactions,
        todayPurchaseAmount
      }
    })
  } catch (error) {
    console.error("Error in GET /api/admin/transactions/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
