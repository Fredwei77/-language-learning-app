"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PaymentDialogFullscreen as PaymentDialog } from "@/components/payment-dialog-fullscreen"
import {
  Coins,
  TrendingUp,
  History,
  Target,
  ShoppingBag,
  Clock,
  CheckCircle2,
  ArrowLeft,
  Zap,
  CreditCard,
  Gift,
  Loader2,
  Sparkles,
} from "lucide-react"
import { COIN_PACKAGES } from "@/lib/products"
import { useLocale } from "@/hooks/use-locale"

import type { Profile, CoinTransaction } from "@/lib/types"
import type { SupabaseClient } from "@supabase/supabase-js"

export default function CoinsPage() {
  const { t } = useLocale()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [transactions, setTransactions] = useState<CoinTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)
  const [showCheckout, setShowCheckout] = useState(false)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

  useEffect(() => {
    const { createClient } = require("@/lib/supabase/client")
    setSupabase(createClient())
  }, [])

  useEffect(() => {
    if (!supabase) return

    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const [profileRes, transactionsRes] = await Promise.all([
          supabase.from("profiles").select("*").eq("id", user.id).single(),
          supabase
            .from("coin_transactions")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(20),
        ])

        if (profileRes.data) setProfile(profileRes.data)
        if (transactionsRes.data) setTransactions(transactionsRes.data)
      }
      setLoading(false)
    }

    fetchData()
  }, [supabase])

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId)
    setShowCheckout(true)
  }

  const stats = [
    {
      label: t.coins.stats.currentCoins,
      value: profile?.coins || 0,
      icon: Coins,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: t.coins.stats.streakDays,
      value: `${profile?.streak_days || 0}${t.coins.stats.days}`,
      icon: Target,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      label: t.coins.stats.studyTime,
      value: `${Math.floor((profile?.total_study_time || 0) / 60)}${t.coins.stats.minutes}`,
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: t.coins.stats.transactions,
      value: transactions.length,
      icon: History,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-orange-400 to-yellow-400 text-white">
              <Coins className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">{t.coins.title}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="outline" asChild className="hidden sm:inline-flex bg-transparent">
              <Link href="/shop">
                <ShoppingBag className="h-4 w-4 mr-2" />
                {t.coins.goRedeem}
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t.coins.backHome}</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-6xl py-6 sm:py-8 px-4 space-y-6 sm:space-y-8">
          {/* Hero Card */}
          <Card className="bg-gradient-to-br from-orange-500 via-yellow-500 to-orange-400 text-white border-none overflow-hidden relative">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
            <CardContent className="relative z-10 p-6 sm:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <p className="text-white/90 mb-2">{t.coins.myBalance}</p>
                  <div className="flex items-baseline justify-center md:justify-start gap-3">
                    <p className="text-5xl sm:text-6xl font-bold">{profile?.coins || 0}</p>
                    <Coins className="h-8 w-8 sm:h-10 sm:w-10 animate-pulse" />
                  </div>
                  <p className="text-white/80 mt-4">{t.coins.continueMessage}</p>
                </div>

                <div className="flex flex-col gap-3 w-full md:w-auto">
                  <Button size="lg" className="bg-white text-orange-600 hover:bg-white/90" asChild>
                    <Link href="/pronunciation">
                      <Zap className="h-5 w-5 mr-2" />
                      {t.coins.startPractice}
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/20 border-white text-white hover:bg-white/30"
                    asChild
                  >
                    <Link href="/shop">
                      <ShoppingBag className="h-5 w-5 mr-2" />
                      {t.coins.browseShop}
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Purchase Coins Section */}
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                {t.coins.packages.title}
              </CardTitle>
              <CardDescription>{t.coins.packages.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {COIN_PACKAGES.map((pkg) => (
                  <Card
                    key={pkg.id}
                    className={`relative cursor-pointer transition-all hover:shadow-lg hover:border-primary/50 ${pkg.popular ? "border-primary ring-2 ring-primary/20" : ""}`}
                    onClick={() => handlePurchase(pkg.id)}
                  >
                    {pkg.popular && (
                      <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-primary">
                        <Sparkles className="h-3 w-3 mr-1" />
                        {t.coins.packages.popular}
                      </Badge>
                    )}
                    <CardContent className="p-4 pt-6 text-center">
                      <div className="flex items-center justify-center gap-1 mb-2">
                        <Coins className="h-6 w-6 text-yellow-500" />
                        <span className="text-2xl font-bold">{pkg.coins}</span>
                      </div>
                      {pkg.bonus && (
                        <Badge variant="secondary" className="mb-2">
                          <Gift className="h-3 w-3 mr-1" />
                          {t.coins.packages.bonus} {pkg.bonus}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                      <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                        ¥{(pkg.priceInCents / 100).toFixed(0)}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How to Earn More */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {t.coins.howToEarn.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex gap-3 p-4 rounded-lg bg-primary/5">
                  <div className="bg-primary text-primary-foreground rounded-full p-2 h-fit">
                    <Target className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t.coins.howToEarn.checkIn.title}</p>
                    <p className="text-sm text-muted-foreground">{t.coins.howToEarn.checkIn.desc}</p>
                    <Button size="sm" className="mt-2" asChild>
                      <Link href="/profile">{t.coins.howToEarn.checkIn.action}</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-secondary/10">
                  <div className="bg-secondary text-secondary-foreground rounded-full p-2 h-fit">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t.coins.howToEarn.practice.title}</p>
                    <p className="text-sm text-muted-foreground">{t.coins.howToEarn.practice.desc}</p>
                    <Button size="sm" variant="secondary" className="mt-2" asChild>
                      <Link href="/pronunciation">{t.coins.howToEarn.practice.action}</Link>
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3 p-4 rounded-lg bg-accent/10">
                  <div className="bg-accent text-accent-foreground rounded-full p-2 h-fit">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t.coins.howToEarn.complete.title}</p>
                    <p className="text-sm text-muted-foreground">{t.coins.howToEarn.complete.desc}</p>
                    <Button size="sm" variant="outline" className="mt-2 bg-transparent" asChild>
                      <Link href="/textbooks">{t.coins.howToEarn.complete.action}</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                {t.coins.transactionHistory.title}
              </CardTitle>
              <CardDescription>{t.coins.transactionHistory.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Coins className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>{t.coins.transactionHistory.noRecords}</p>
                  <p className="text-sm mt-2">{t.coins.transactionHistory.startEarning}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${tx.amount > 0 ? "bg-green-100" : "bg-red-100"}`}>
                          {tx.amount > 0 ? (
                            <TrendingUp className="h-5 w-5 text-green-600" />
                          ) : (
                            <ShoppingBag className="h-5 w-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">
                            {tx.description ||
                              (tx.type === "earn"
                                ? t.coins.transactionHistory.earned
                                : tx.type === "spend"
                                  ? t.coins.transactionHistory.spent
                                  : t.coins.transactionHistory.purchased)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString("zh-CN", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                      <div className={`text-lg font-bold ${tx.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {tx.amount > 0 ? "+" : ""}
                        {tx.amount}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Checkout Dialog */}
      <PaymentDialog open={showCheckout} onOpenChange={setShowCheckout} packageId={selectedPackage} />
    </div>
  )
}
