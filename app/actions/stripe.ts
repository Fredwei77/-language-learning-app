"use server"

import { stripe } from "@/lib/stripe"
import { COIN_PACKAGES } from "@/lib/products"
import { createClient } from "@/lib/supabase/server"

export async function startCheckoutSession(packageId: string, locale: string = "zh") {
  const coinPackage = COIN_PACKAGES.find((p) => p.id === packageId)
  if (!coinPackage) {
    throw new Error(`Package with id "${packageId}" not found`)
  }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Map our locale to Stripe's supported locales
  // Stripe supports: auto, zh, zh-HK, zh-TW, en, etc.
  const stripeLocale = locale === "en" ? "en" : "zh"

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    locale: stripeLocale as any, // Stripe locale parameter
    line_items: [
      {
        price_data: {
          currency: "cny",
          product_data: {
            name: coinPackage.name,
            description:
              locale === "en"
                ? `${coinPackage.coins} coins${coinPackage.bonus ? ` + ${coinPackage.bonus} bonus` : ""}`
                : `${coinPackage.coins}金币${coinPackage.bonus ? ` + ${coinPackage.bonus}赠送` : ""}`,
          },
          unit_amount: coinPackage.priceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      packageId: coinPackage.id,
      userId: user?.id || "",
      coins: String(coinPackage.coins + (coinPackage.bonus || 0)),
    },
  })

  if (!session.client_secret) {
    throw new Error("Failed to create checkout session")
  }

  return session.client_secret
}
