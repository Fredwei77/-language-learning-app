"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Coins, Flame, Clock, Calendar, Edit, Save, X, CheckCircle, Loader2, Package, MapPin, Phone, User as UserIcon } from "lucide-react"
import type { Profile, LearningProgress, CheckIn } from "@/lib/types"
import type { User } from "@supabase/supabase-js"
import { useLocale } from "@/hooks/use-locale"
import Link from "next/link"

interface GiftRedemption {
  id: string
  gift_id: string
  gift_name: string
  coins_spent: number
  status: string
  shipping_address: {
    name: string
    phone: string
    address: string
    notes?: string
  } | null
  created_at: string
}

interface ProfileContentProps {
  user: User
  profile: Profile | null
  recentProgress: LearningProgress[]
  checkIns: CheckIn[]
  redemptions: GiftRedemption[]
}

export function ProfileContent({ user, profile, recentProgress, checkIns, redemptions }: ProfileContentProps) {
  const { t } = useLocale()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [saving, setSaving] = useState(false)
  const [checkingIn, setCheckingIn] = useState(false)
  const [currentProfile, setCurrentProfile] = useState(profile)
  const { toast } = useToast()
  const supabase = createClient()
  
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default"
      case "processing":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "outline"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: t.shop.orderStatus?.pending || "待处理",
      processing: t.shop.orderStatus?.processing || "处理中",
      completed: t.shop.orderStatus?.completed || "已完成",
      cancelled: t.shop.orderStatus?.cancelled || "已取消",
    }
    return statusMap[status] || status
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ display_name: displayName, updated_at: new Date().toISOString() })
        .eq("id", user.id)

      if (error) throw error

      setCurrentProfile((prev) => (prev ? { ...prev, display_name: displayName } : prev))
      setIsEditing(false)
      toast({
        title: "保存成功",
        description: "您的个人资料已更新",
      })
    } catch {
      toast({
        title: "保存失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleCheckIn = async () => {
    setCheckingIn(true)
    try {
      const today = new Date().toISOString().split("T")[0]
      const lastCheckIn = currentProfile?.last_check_in

      // Calculate streak bonus
      let streakDays = currentProfile?.streak_days || 0
      let streakBonus = 0

      if (lastCheckIn) {
        const lastDate = new Date(lastCheckIn)
        const todayDate = new Date(today)
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

        if (diffDays === 1) {
          streakDays += 1
          streakBonus = Math.min(streakDays * 2, 20) // Max bonus 20
        } else if (diffDays > 1) {
          streakDays = 1
        }
      } else {
        streakDays = 1
      }

      const coinsEarned = 10 + streakBonus

      // Insert check-in record
      const { error: checkInError } = await supabase.from("check_ins").insert({
        user_id: user.id,
        check_in_date: today,
        coins_earned: 10,
        streak_bonus: streakBonus,
      })

      if (checkInError) {
        if (checkInError.code === "23505") {
          toast({
            title: "今日已签到",
            description: "明天再来吧！",
          })
          return
        }
        throw checkInError
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          coins: (currentProfile?.coins || 0) + coinsEarned,
          streak_days: streakDays,
          last_check_in: today,
        })
        .eq("id", user.id)

      if (profileError) throw profileError

      // Insert coin transaction
      await supabase.from("coin_transactions").insert({
        user_id: user.id,
        amount: coinsEarned,
        type: "earn",
        description: `每日签到${streakBonus > 0 ? ` (+${streakBonus}连续奖励)` : ""}`,
      })

      setCurrentProfile((prev) =>
        prev
          ? {
              ...prev,
              coins: prev.coins + coinsEarned,
              streak_days: streakDays,
              last_check_in: today,
            }
          : prev,
      )

      toast({
        title: "签到成功！",
        description: `获得 ${coinsEarned} 金币${streakBonus > 0 ? `（含连续签到奖励 ${streakBonus}）` : ""}`,
      })
    } catch {
      toast({
        title: "签到失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setCheckingIn(false)
    }
  }

  const todayCheckedIn = currentProfile?.last_check_in === new Date().toISOString().split("T")[0]

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}小时${minutes}分钟`
    }
    return `${minutes}分钟`
  }

  const getModuleName = (type: string) => {
    const names: Record<string, string> = {
      dictionary: "词典",
      ai_chat: "AI对话",
      textbook: "课文",
      cantonese: "粤语",
      pronunciation: "发音",
    }
    return names[type] || type
  }

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4 space-y-6">
      {/* Profile Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage src={currentProfile?.avatar_url || ""} />
              <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                {(currentProfile?.display_name || user.email || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-3">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label htmlFor="displayName" className="sr-only">
                      昵称
                    </Label>
                    <Input
                      id="displayName"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="输入昵称"
                    />
                  </div>
                  <Button size="icon" onClick={handleSaveProfile} disabled={saving}>
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  </Button>
                  <Button size="icon" variant="outline" onClick={() => setIsEditing(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold">{currentProfile?.display_name || "学习者"}</h1>
                  <Button size="icon" variant="ghost" onClick={() => setIsEditing(true)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <p className="text-muted-foreground">{user.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  {currentProfile?.coins || 0} 金币
                </Badge>
                <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5">
                  <Flame className="h-4 w-4 text-orange-500" />
                  连续 {currentProfile?.streak_days || 0} 天
                </Badge>
                <Badge variant="secondary" className="px-3 py-1.5 text-sm gap-1.5">
                  <Clock className="h-4 w-4 text-blue-500" />
                  {formatStudyTime(currentProfile?.total_study_time || 0)}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button onClick={handleCheckIn} disabled={todayCheckedIn || checkingIn} className="gap-2">
                {checkingIn ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : todayCheckedIn ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <Calendar className="h-4 w-4" />
                )}
                {todayCheckedIn ? "今日已签到" : "每日签到"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.profile.recentActivity}</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProgress.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">还没有学习记录，开始学习吧！</p>
            ) : (
              <div className="space-y-3">
                {recentProgress.slice(0, 5).map((progress) => (
                  <div key={progress.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div>
                      <p className="font-medium">{getModuleName(progress.module_type)}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(progress.created_at).toLocaleDateString("zh-CN")}
                      </p>
                    </div>
                    <Badge variant="outline">+{Math.floor(progress.time_spent / 60)}分钟</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Check-in History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t.profile.checkInHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            {checkIns.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">还没有签到记录，立即签到获得金币！</p>
            ) : (
              <div className="space-y-3">
                {checkIns.slice(0, 7).map((checkIn) => (
                  <div key={checkIn.id} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>{new Date(checkIn.check_in_date).toLocaleDateString("zh-CN")}</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Coins className="h-4 w-4" />
                      <span>+{checkIn.coins_earned + checkIn.streak_bonus}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* My Redemptions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{t.profile.myRedemptions}</CardTitle>
            <Link href="/shop">
              <Button variant="outline" size="sm">
                <Package className="h-4 w-4 mr-2" />
                {t.shop.title}
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {redemptions.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground mb-2">{t.profile.noRedemptions}</p>
              <Link href="/shop">
                <Button variant="link">{t.profile.startRedeeming}</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {redemptions.map((redemption) => (
                <Card key={redemption.id} className="border-2">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold">{redemption.gift_name}</h4>
                          <Badge variant={getStatusBadgeVariant(redemption.status)}>
                            {getStatusText(redemption.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(redemption.created_at).toLocaleString("zh-CN")}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-orange-600 font-semibold">
                        <Coins className="h-4 w-4" />
                        <span>{redemption.coins_spent}</span>
                      </div>
                    </div>
                    {redemption.shipping_address && (
                      <div className="space-y-2 text-sm bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-start gap-2">
                          <UserIcon className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <span className="text-muted-foreground">{t.profile.recipient}: </span>
                            <span className="font-medium">{redemption.shipping_address.name}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2">
                          <Phone className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span>{redemption.shipping_address.phone}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <span>{redemption.shipping_address.address}</span>
                        </div>
                        {redemption.shipping_address.notes && (
                          <div className="text-muted-foreground pt-1 border-t">
                            备注: {redemption.shipping_address.notes}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
