import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// PATCH - 批量更新订单状态
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
    const { ids, status } = body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: "Invalid order IDs" }, { status: 400 })
    }

    if (!["pending", "processing", "completed", "cancelled"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const { data, error } = await supabase
      .from("gift_redemptions")
      .update({ status })
      .in("id", ids)
      .select()

    if (error) {
      console.error("Error batch updating redemptions:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      updated: data?.length || 0,
      message: `成功更新 ${data?.length || 0} 个订单`
    })
  } catch (error) {
    console.error("Error in PATCH /api/admin/redemptions/batch:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
