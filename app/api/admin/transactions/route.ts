import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取所有金币交易记录（管理员）
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")
    const search = searchParams.get("search")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0

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

    // 构建查询
    let query = supabase
      .from("coin_transactions")
      .select("*, profiles!inner(display_name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    // 按类型筛选
    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    // 搜索功能（搜索用户名或邮箱）
    if (search) {
      query = query.or(`profiles.display_name.ilike.%${search}%,profiles.email.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching transactions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      data: data || [], 
      total: count || 0,
      limit,
      offset 
    })
  } catch (error) {
    console.error("Error in GET /api/admin/transactions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
