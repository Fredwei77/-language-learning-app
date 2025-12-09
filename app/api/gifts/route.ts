import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - 获取商品列表
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const showAll = searchParams.get("showAll") // 管理员查看所有商品
    const search = searchParams.get("search") // 搜索关键词
    const lowStock = searchParams.get("lowStock") // 低库存筛选

    const supabase = await createClient()

    let query = supabase
      .from("gifts")
      .select("*")
      .order("created_at", { ascending: false })

    // 如果不是查看所有，只显示激活的商品
    if (showAll !== "true") {
      query = query.eq("is_active", true)
    }

    if (category && category !== "all") {
      query = query.eq("category", category)
    }

    // 搜索功能
    if (search) {
      query = query.or(`name_zh.ilike.%${search}%,name_en.ilike.%${search}%`)
    }

    // 低库存筛选
    if (lowStock === "true") {
      query = query.lte("stock", 10)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching gifts:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error("Error in GET /api/gifts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - 创建新商品（仅管理员）
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 检查用户是否为管理员
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const body = await request.json()
    const { name_zh, name_en, description_zh, description_en, coins, image_url, category, stock } = body

    // 验证必填字段
    if (!name_zh || !name_en || !description_zh || !description_en || !coins || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // 验证分类
    if (!["physical", "digital", "privilege"].includes(category)) {
      return NextResponse.json({ error: "Invalid category" }, { status: 400 })
    }

    // 构建插入对象
    const insertData: Record<string, any> = {
      name_zh,
      name_en,
      description_zh,
      description_en,
      coins: parseInt(coins.toString()),
      category,
      stock: stock ? parseInt(stock.toString()) : 0,
    }

    // 只在有值时添加 image_url
    if (image_url) {
      insertData.image_url = image_url
    }

    const { data, error } = await supabase
      .from("gifts")
      .insert(insertData)
      .select()
      .single()

    if (error) {
      console.error("Error creating gift:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Error in POST /api/gifts:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
