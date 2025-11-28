import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 管理员获取所有兑换记录
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 100
    const offset = searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0

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

    let query = supabase
      .from("gift_redemptions")
      .select("*, profiles!inner(display_name, email)", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching redemptions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      data: data || [], 
      total: count || 0,
      limit,
      offset 
    })
  } catch (error) {
    console.error("Error in GET /api/admin/redemptions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
