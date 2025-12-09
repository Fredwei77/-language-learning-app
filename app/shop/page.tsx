"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GiftIcon, Coins, ShoppingBag, Package, Zap, Award, ArrowLeft, Loader2 } from "lucide-react"
// import { gifts as giftsCatalog } from "@/lib/coins-system"

interface Gift {
  id: string
  name_zh: string
  name_en: string
  description_zh: string
  description_en: string
  coins: number
  image_url: string | null
  category: "physical" | "digital" | "privilege"
  stock: number
  is_active: boolean
}
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useLocale } from "@/hooks/use-locale"
import type { Profile } from "@/lib/types"
import { GiftRedeemDialog } from "@/components/gift-redeem-dialog"

export default function ShopPage() {
  const { t, locale } = useLocale()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [gifts, setGifts] = useState<Gift[]>([])
  const [loading, setLoading] = useState(true)
  const [redeemingId, setRedeemingId] = useState<string | null>(null)
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchData = async () => {
      // 获取用户信息
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(data)
      }

      // 获取商品列表
      const response = await fetch("/api/gifts?category=all")
      const result = await response.json()
      if (result.data) {
        setGifts(result.data)
      }

      setLoading(false)
    }
    fetchData()
  }, [supabase])

  const handleRedeemClick = (gift: Gift) => {
    if (!profile) {
      toast({ title: t.shop.pleaseLogin, variant: "destructive" })
      return
    }

    if (profile.coins < gift.coins) {
      toast({
        title: t.shop.notEnough,
        description: `${t.shop.notEnough} ${gift.coins - profile.coins} ${t.nav.coins}`,
        variant: "destructive",
      })
      return
    }

    setSelectedGift(gift)
    setDialogOpen(true)
  }

  const handleConfirmRedeem = async (shippingInfo: { name: string; phone: string; address: string; notes?: string }) => {
    if (!selectedGift || !profile) return

    setRedeemingId(selectedGift.id)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("请先登录")

      const giftName = locale === "zh" ? selectedGift.name_zh : selectedGift.name_en

      // Deduct coins
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ coins: profile.coins - selectedGift.coins })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Record redemption with shipping info
      await supabase.from("gift_redemptions").insert({
        user_id: user.id,
        gift_id: selectedGift.id,
        gift_name: giftName,
        coins_spent: selectedGift.coins,
        status: "pending",
        shipping_address: shippingInfo,
      })

      // Record transaction
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: -selectedGift.coins,
        type: "spend",
        description: `${t.shop.redeem}${giftName}`,
      })

      setProfile({ ...profile, coins: profile.coins - selectedGift.coins })
      toast({ title: t.common.success, description: `${t.shop.redeemed} ${giftName}` })
    } catch (error) {
      toast({
        title: t.common.error,
        description: error instanceof Error ? error.message : t.errors.generic,
        variant: "destructive",
      })
      throw error
    } finally {
      setRedeemingId(null)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "physical":
        return <Package className="h-4 w-4" />
      case "digital":
        return <Zap className="h-4 w-4" />
      case "privilege":
        return <Award className="h-4 w-4" />
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "physical":
        return t.shop.physicalGoods
      case "digital":
        return t.shop.virtualGoods
      case "privilege":
        return t.shop.categories.privilege
    }
  }

  const userCoins = profile?.coins || 0

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-white">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">{t.shop.title}</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-3 sm:px-4 py-2 rounded-full font-semibold shadow-lg">
                <Coins className="h-4 sm:h-5 w-4 sm:w-5" />
                <span>{userCoins}</span>
              </div>
            )}
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t.shop.backHome}</span>
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-7xl py-6 sm:py-8 px-4 space-y-6 sm:space-y-8">
          {/* Hero Section */}
          <Card className="bg-gradient-to-r from-orange-500 to-pink-500 text-white border-none">
            <CardHeader>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center md:text-left">
                  <CardTitle className="text-2xl sm:text-3xl">{t.shop.redeemGifts}</CardTitle>
                  <CardDescription className="text-white/90 text-base sm:text-lg">
                    {t.shop.keepLearning}
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
                  <Coins className="h-10 sm:h-12 w-10 sm:w-12" />
                  <div>
                    <p className="text-sm opacity-90">{t.shop.myCoins}</p>
                    <p className="text-3xl sm:text-4xl font-bold">{userCoins}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* How to Earn */}
          <Card>
            <CardHeader>
              <CardTitle>{t.shop.howToEarn}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5">
                  <div className="bg-primary text-primary-foreground rounded-full p-2">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t.shop.completePractice}</p>
                    <p className="text-sm text-muted-foreground">{t.shop.practiceDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-secondary/10">
                  <div className="bg-secondary text-secondary-foreground rounded-full p-2">
                    <GiftIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t.shop.dailyCheckIn}</p>
                    <p className="text-sm text-muted-foreground">{t.shop.checkInDesc}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 rounded-lg bg-accent/10">
                  <div className="bg-accent text-accent-foreground rounded-full p-2">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold mb-1">{t.shop.buyCoins}</p>
                    <p className="text-sm text-muted-foreground">
                      <Link href="/coins" className="text-primary hover:underline">
                        {t.shop.buyCoinsDesc}
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Gift Catalog */}
          <Tabs defaultValue="all" className="space-y-6">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">{t.shop.categories.all}</TabsTrigger>
              <TabsTrigger value="physical">{t.shop.physicalGoods}</TabsTrigger>
              <TabsTrigger value="digital">{t.shop.virtualGoods}</TabsTrigger>
            </TabsList>

            {["all", "physical", "digital"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {gifts
                    .filter((g) => tab === "all" || g.category === tab)
                    .map((gift) => {
                      const giftName = locale === "zh" ? gift.name_zh : gift.name_en
                      const giftDescription = locale === "zh" ? gift.description_zh : gift.description_en
                      return (
                        <Card key={gift.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                          <div className={`relative h-40 sm:h-48 flex items-center justify-center ${
                            gift.image_url
                              ? "bg-muted"
                              : gift.category === "physical" 
                              ? "bg-gradient-to-br from-blue-400 to-blue-600" 
                              : gift.category === "digital"
                              ? "bg-gradient-to-br from-purple-400 to-purple-600"
                              : "bg-gradient-to-br from-orange-400 to-orange-600"
                          }`}>
                            {gift.image_url ? (
                              <img src={gift.image_url} alt={giftName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="text-white">
                                {gift.category === "physical" && <Package className="h-16 w-16 sm:h-20 sm:w-20" />}
                                {gift.category === "digital" && <Zap className="h-16 w-16 sm:h-20 sm:w-20" />}
                                {gift.category === "privilege" && <Award className="h-16 w-16 sm:h-20 sm:w-20" />}
                              </div>
                            )}
                            <Badge className="absolute top-3 right-3" variant="secondary">
                              {getCategoryIcon(gift.category)}
                              <span className="ml-1">{getCategoryLabel(gift.category)}</span>
                            </Badge>
                          </div>
                          <CardHeader className="p-4">
                            <CardTitle className="text-lg">{giftName}</CardTitle>
                            <CardDescription className="line-clamp-2">{giftDescription}</CardDescription>
                          </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-orange-600 font-bold text-xl">
                              <Coins className="h-5 w-5" />
                              <span>{gift.coins}</span>
                            </div>
                            <Badge variant="outline">
                              {t.shop.stock}: {gift.stock}
                            </Badge>
                          </div>
                          <Button
                            className="w-full"
                            onClick={() => handleRedeemClick(gift)}
                            disabled={userCoins < gift.coins || gift.stock <= 0 || redeemingId === gift.id || !profile}
                          >
                            {redeemingId === gift.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : !profile ? (
                              t.shop.pleaseLogin
                            ) : userCoins < gift.coins ? (
                              t.shop.notEnough
                            ) : gift.stock <= 0 ? (
                              t.shop.outOfStock
                            ) : (
                              t.shop.redeemNow
                            )}
                          </Button>
                        </CardContent>
                        </Card>
                      )
                    })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>

      {/* Redeem Dialog */}
      {selectedGift && (
        <GiftRedeemDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          giftName={locale === "zh" ? selectedGift.name_zh : selectedGift.name_en}
          giftCoins={selectedGift.coins}
          onConfirm={handleConfirmRedeem}
        />
      )}
    </div>
  )
}
