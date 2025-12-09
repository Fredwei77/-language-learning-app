import { type NextRequest, NextResponse } from "next/server"
import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/supabase/server"
import { handleApiError } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature")

    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 })
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error("STRIPE_WEBHOOK_SECRET is not configured")
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })
    }

    // 验证 Webhook 签名
    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      const error = err as Error
      console.error("Webhook signature verification failed:", error.message)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    // 处理不同的事件类型
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object
        const { userId, coins, packageId } = session.metadata || {}

        if (!userId || !coins) {
          console.error("Missing metadata in checkout session:", session.id)
          break
        }

        // 更新用户金币
        const supabase = await createClient()

        // 1. 获取当前金币数
        const { data: profile } = await supabase.from("profiles").select("coins").eq("id", userId).single()

        if (!profile) {
          console.error("User profile not found:", userId)
          break
        }

        // 2. 增加金币
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            coins: profile.coins + parseInt(coins),
          })
          .eq("id", userId)

        if (updateError) {
          console.error("Failed to update user coins:", updateError)
          break
        }

        // 3. 记录交易
        const { error: transactionError } = await supabase.from("coin_transactions").insert({
          user_id: userId,
          amount: parseInt(coins),
          type: "purchase",
          description: `购买金币套餐 (${packageId})`,
          reference_id: session.id,
        })

        if (transactionError) {
          console.error("Failed to create transaction record:", transactionError)
        }

        console.log(`Successfully added ${coins} coins to user ${userId}`)
        break
      }

      case "checkout.session.expired": {
        const session = event.data.object
        console.log("Checkout session expired:", session.id)
        break
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object
        console.log("Payment failed:", paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    return handleApiError(error)
  }
}
