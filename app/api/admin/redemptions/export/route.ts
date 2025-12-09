import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 导出订单数据为CSV
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

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

    let query = supabase
      .from("gift_redemptions")
      .select("*, profiles!inner(display_name, email)")
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching redemptions for export:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 生成CSV内容
    const headers = [
      "订单ID",
      "商品名称",
      "用户名",
      "用户邮箱",
      "金币消耗",
      "订单状态",
      "收货人",
      "联系电话",
      "收货地址",
      "备注",
      "创建时间"
    ]

    const rows = data?.map(item => {
      const shipping = item.shipping_address as any
      return [
        item.id,
        item.gift_name,
        item.profiles.display_name || "",
        item.profiles.email || "",
        item.coins_spent,
        item.status,
        shipping?.name || "",
        shipping?.phone || "",
        shipping?.address || "",
        shipping?.notes || "",
        new Date(item.created_at).toLocaleString("zh-CN")
      ]
    }) || []

    // 构建CSV字符串
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    // 添加BOM以支持Excel正确显示中文
    const bom = "\uFEFF"
    const csvWithBom = bom + csvContent

    return new NextResponse(csvWithBom, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="redemptions_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error("Error in GET /api/admin/redemptions/export:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
