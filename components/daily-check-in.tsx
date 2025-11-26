"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Calendar, Coins, Flame, CheckCircle, Loader2, Gift } from "lucide-react"
import type { Profile } from "@/lib/types"

export function DailyCheckIn() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [checkingIn, setCheckingIn] = useState(false)
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()
        setProfile(data)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [supabase])

  const handleCheckIn = async () => {
    if (!profile) return
    setCheckingIn(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("请先登录")

      const today = new Date().toISOString().split("T")[0]
      const lastCheckIn = profile.last_check_in

      // Calculate streak
      let streakDays = profile.streak_days || 0
      let streakBonus = 0

      if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn)
        const todayDate = new Date(today)
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          streakDays += 1
          streakBonus = Math.min(streakDays * 2, 20)
        } else if (diffDays > 1) {
          streakDays = 1
        }
      } else {
        streakDays = 1
      }

      const coinsEarned = 10 + streakBonus

      // Insert check-in
      const { error: checkInError } = await supabase.from("check_ins").insert({
        user_id: user.id,
        check_in_date: today,
        coins_earned: 10,
        streak_bonus: streakBonus,
      })

      if (checkInError) {
        if (checkInError.code === "23505") {
          toast({ title: "今日已签到", description: "明天再来吧！" })
          return
        }
        throw checkInError
      }

      // Update profile
      await supabase
        .from("profiles")
        .update({
          coins: profile.coins + coinsEarned,
          streak_days: streakDays,
          last_check_in: today,
        })
        .eq("id", user.id)

      // Record transaction
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: coinsEarned,
        type: "earn",
        description: `每日签到${streakBonus > 0 ? ` (+${streakBonus}连续奖励)` : ""}`,
      })

      setProfile({
        ...profile,
        coins: profile.coins + coinsEarned,
        streak_days: streakDays,
        last_check_in: today,
      })

      toast({
        title: "签到成功！",
        description: `获得 ${coinsEarned} 金币${streakBonus > 0 ? `（含连续签到奖励 ${streakBonus}）` : ""}`,
      })
    } catch (error) {
      toast({
        title: "签到失败",
        description: error instanceof Error ? error.message : "请重试",
        variant: "destructive",
      })
    } finally {
      setCheckingIn(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!profile) {
    return null
  }

  const todayCheckedIn = profile.last_check_in === new Date().toISOString().split("T")[0]
  const nextBonus = Math.min((profile.streak_days + 1) * 2, 20)

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          每日签到
        </CardTitle>
        <CardDescription>坚持签到获得金币奖励</CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-orange-100">
              <Flame className="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p className="font-medium">连续签到</p>
              <p className="text-2xl font-bold">{profile.streak_days || 0} 天</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">明日额外奖励</p>
            <div className="flex items-center gap-1 text-yellow-600 font-semibold">
              <Gift className="h-4 w-4" />
              <span>+{nextBonus}</span>
            </div>
          </div>
        </div>

        <Button className="w-full h-12 text-base gap-2" onClick={handleCheckIn} disabled={todayCheckedIn || checkingIn}>
          {checkingIn ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : todayCheckedIn ? (
            <>
              <CheckCircle className="h-5 w-5" />
              今日已签到
            </>
          ) : (
            <>
              <Coins className="h-5 w-5" />
              签到领取 10+ 金币
            </>
          )}
        </Button>

        {!todayCheckedIn && profile.streak_days > 0 && (
          <p className="text-sm text-center text-muted-foreground">
            连续签到 {profile.streak_days} 天，今日可额外获得 {Math.min(profile.streak_days * 2, 20)} 金币
          </p>
        )}
      </CardContent>
    </Card>
  )
}
