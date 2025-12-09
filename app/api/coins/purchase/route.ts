import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { stripe } from "@/lib/stripe"
import { handleApiError } from "@/lib/api-utils"

// 金币套餐配置
const COIN_PACKAGES = {
  basic: { coins: 100, price: 999, name: "基础套餐" },
  standard: { coins: 500, price: 4999, name: "标准套餐" },
  premium: { coins: 1000, price: 9999, name: "高级套餐" },
  ultimate: { coins: 5000, price: 49999, name: "终极套餐" },
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { packageId } = body

    if (!packageId || !COIN_PACKAGES[packageId as keyof typeof COIN_PACKAGES]) {
      return NextResponse.json({ error: "Invalid package" }, { status: 400 })
    }

    const pkg = COIN_PACKAGES[packageId as keyof typeof COIN_PACKAGES]

    // 创建 Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cny",
            product_data: {
              name: `${pkg.name} - ${pkg.coins}金币`,
              description: `购买${pkg.coins}个学习金币`,
            },
            unit_amount: pkg.price,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/shop?canceled=true`,
      metadata: {
        userId: user.id,
        coins: pkg.coins.toString(),
        packageId,
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    return handleApiError(error)
  }
}
