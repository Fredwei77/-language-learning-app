"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trophy, Medal, Flame, Coins, Clock, ArrowLeft, Crown } from "lucide-react"
import Link from "next/link"
import { useLocale } from "@/hooks/use-locale"

interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
  coins: number
  streak_days: number
  total_study_time: number
}

interface LeaderboardClientProps {
  coinsData: Profile[]
  streakData: Profile[]
  timeData: Profile[]
  currentUserId: string | undefined
}

export function LeaderboardClient({ coinsData, streakData, timeData, currentUserId }: LeaderboardClientProps) {
  const { t } = useLocale()

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{rank}</span>
    }
  }

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-300"
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300"
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-300"
      default:
        return ""
    }
  }

  const formatStudyTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return t.leaderboard.formatTime.hoursMinutes
        .replace("{hours}", String(hours))
        .replace("{minutes}", String(minutes))
    }
    return t.leaderboard.formatTime.minutesOnly.replace("{minutes}", String(minutes))
  }

  const LeaderboardList = ({
    data,
    valueKey,
    valueFormatter,
    valueIcon: ValueIcon,
  }: {
    data: Profile[]
    valueKey: "coins" | "streak_days" | "total_study_time"
    valueFormatter: (value: number) => string
    valueIcon: typeof Coins
  }) => (
    <div className="space-y-3">
      {data?.map((profile, index) => {
        const rank = index + 1
        const isCurrentUser = currentUserId === profile.id
        return (
          <div
            key={profile.id}
            className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${getRankStyle(
              rank,
            )} ${isCurrentUser ? "ring-2 ring-primary" : "hover:bg-muted/50"}`}
          >
            <div className="flex items-center justify-center w-8">{getRankIcon(rank)}</div>
            <Avatar className="h-10 w-10">
              <AvatarImage src={profile.avatar_url || ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(profile.display_name || "U").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                {profile.display_name || t.leaderboard.learner}
                {isCurrentUser && (
                  <Badge variant="secondary" className="ml-2">
                    {t.leaderboard.me}
                  </Badge>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1.5 font-semibold">
              <ValueIcon className="h-4 w-4 text-muted-foreground" />
              <span>{valueFormatter(profile[valueKey] || 0)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Trophy className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">{t.leaderboard.title}</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t.leaderboard.backHome}</span>
            </Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto max-w-3xl py-6 sm:py-8 px-4">
          <Card>
            <CardHeader>
              <CardTitle>{t.leaderboard.pageTitle}</CardTitle>
              <CardDescription>{t.leaderboard.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="coins" className="space-y-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="coins" className="gap-1.5">
                    <Coins className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.leaderboard.tabs.coins}</span>
                  </TabsTrigger>
                  <TabsTrigger value="streak" className="gap-1.5">
                    <Flame className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.leaderboard.tabs.streak}</span>
                  </TabsTrigger>
                  <TabsTrigger value="time" className="gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="hidden sm:inline">{t.leaderboard.tabs.time}</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="coins">
                  <LeaderboardList
                    data={coinsData}
                    valueKey="coins"
                    valueFormatter={(v) => String(v)}
                    valueIcon={Coins}
                  />
                </TabsContent>

                <TabsContent value="streak">
                  <LeaderboardList
                    data={streakData}
                    valueKey="streak_days"
                    valueFormatter={(v) => `${v}${t.leaderboard.days}`}
                    valueIcon={Flame}
                  />
                </TabsContent>

                <TabsContent value="time">
                  <LeaderboardList
                    data={timeData}
                    valueKey="total_study_time"
                    valueFormatter={formatStudyTime}
                    valueIcon={Clock}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
