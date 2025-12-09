import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取商品统计信息
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

    // 获取商品总数
    const { count: totalGifts } = await supabase
      .from("gifts")
      .select("*", { count: "exact", head: true })

    // 获取激活商品数
    const { count: activeGifts } = await supabase
      .from("gifts")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true)

    // 获取低库存商品数
    const { count: lowStockGifts } = await supabase
      .from("gifts")
      .select("*", { count: "exact", head: true })
      .lte("stock", 10)
      .eq("is_active", true)

    // 获取各分类商品数
    const { data: categoryStats } = await supabase
      .from("gifts")
      .select("category")

    const categoryCounts = {
      physical: 0,
      digital: 0,
      privilege: 0
    }

    categoryStats?.forEach(item => {
      if (item.category in categoryCounts) {
        categoryCounts[item.category as keyof typeof categoryCounts]++
      }
    })

    // 获取热门商品（根据兑换次数）- 如果表不存在则返回空数组
    let topGiftsList: Array<{ id: string; name: string; count: number }> = []
    
    try {
      const { data: topGifts, error: redemptionError } = await supabase
        .from("gift_redemptions")
        .select("gift_id, gift_name")
        .eq("status", "completed")

      if (!redemptionError && topGifts) {
        const giftRedemptionCounts: Record<string, { name: string; count: number }> = {}
        topGifts.forEach(item => {
          if (!giftRedemptionCounts[item.gift_id]) {
            giftRedemptionCounts[item.gift_id] = { name: item.gift_name, count: 0 }
          }
          giftRedemptionCounts[item.gift_id].count++
        })

        topGiftsList = Object.entries(giftRedemptionCounts)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
      }
    } catch (err) {
      // gift_redemptions 表可能不存在，忽略错误
      console.log("gift_redemptions table may not exist yet")
    }

    return NextResponse.json({
      data: {
        totalGifts: totalGifts || 0,
        activeGifts: activeGifts || 0,
        lowStockGifts: lowStockGifts || 0,
        categoryCounts,
        topGifts: topGiftsList
      }
    })
  } catch (error) {
    console.error("Error in GET /api/gifts/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
