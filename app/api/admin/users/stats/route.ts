import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取用户统计信息
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

    // 获取用户总数
    const { count: totalUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })

    // 获取管理员数量
    const { count: adminUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("is_admin", true)

    // 获取今日新增用户
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count: todayUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString())

    // 获取本周新增用户
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    
    const { count: weekUsers } = await supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo.toISOString())

    // 获取总金币数
    const { data: allProfiles } = await supabase
      .from("profiles")
      .select("coins")

    const totalCoins = allProfiles?.reduce((sum, p) => sum + (p.coins || 0), 0) || 0

    // 获取活跃用户（最近7天有学习记录）- 如果表不存在则返回0
    let activeUsers = 0
    
    try {
      const { count, error: progressError } = await supabase
        .from("learning_progress")
        .select("user_id", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString())
      
      if (!progressError) {
        activeUsers = count || 0
      }
    } catch (err) {
      // learning_progress 表可能不存在，忽略错误
      console.log("learning_progress table may not exist yet")
    }

    return NextResponse.json({
      data: {
        totalUsers: totalUsers || 0,
        adminUsers: adminUsers || 0,
        todayUsers: todayUsers || 0,
        weekUsers: weekUsers || 0,
        totalCoins,
        activeUsers
      }
    })
  } catch (error) {
    console.error("Error in GET /api/admin/users/stats:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
