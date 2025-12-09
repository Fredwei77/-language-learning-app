import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// PATCH - 批量更新商品状态
export async function PATCH(request: Request) {
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

    const body = await request.json()
    const { ids, action } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid gift IDs" }, { status: 400 })
    }

    let updateData: Record<string, any> = {}

    switch (action) {
      case "activate":
        updateData = { is_active: true }
        break
      case "deactivate":
        updateData = { is_active: false }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("gifts")
      .update(updateData)
      .in("id", ids)
      .select()

    if (error) {
      console.error("Error batch updating gifts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      updated: data?.length || 0,
      message: `成功更新 ${data?.length || 0} 个商品`
    })
  } catch (error) {
    console.error("Error in PATCH /api/gifts/batch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
