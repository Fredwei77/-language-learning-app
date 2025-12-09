import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 导出交易数据为CSV
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type")

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
      .from("coin_transactions")
      .select("*, profiles!inner(display_name, email)")
      .order("created_at", { ascending: false })

    if (type && type !== "all") {
      query = query.eq("type", type)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching transactions for export:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // 生成CSV内容
    const headers = [
      "交易ID",
      "用户名",
      "用户邮箱",
      "金币数量",
      "交易类型",
      "描述",
      "参考ID",
      "创建时间"
    ]

    const typeMap: Record<string, string> = {
      purchase: "购买",
      earn: "获得",
      spend: "消费"
    }

    const rows = data?.map(item => [
      item.id,
      item.profiles.display_name || "",
      item.profiles.email || "",
      item.amount,
      typeMap[item.type] || item.type,
      item.description || "",
      item.reference_id || "",
      new Date(item.created_at).toLocaleString("zh-CN")
    ]) || []

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
        "Content-Disposition": `attachment; filename="transactions_${new Date().toISOString().split('T')[0]}.csv"`
      }
    })
  } catch (error) {
    console.error("Error in GET /api/admin/transactions/export:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
