"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BookOpen, MessageSquare, Mic, Trophy, TrendingUp, Clock } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

export function ProgressDashboard() {
  const { t } = useLocale()

  const stats = [
    {
      icon: Clock,
      label: t.progress.stats.studyDays,
      value: "15",
      unit: t.progress.stats.days,
      color: "text-primary",
    },
    {
      icon: BookOpen,
      label: t.progress.stats.completedLessons,
      value: "8",
      unit: t.progress.stats.lessons,
      color: "text-accent",
    },
    {
      icon: MessageSquare,
      label: t.progress.stats.aiConversations,
      value: "32",
      unit: t.progress.stats.times,
      color: "text-secondary",
    },
    {
      icon: Mic,
      label: t.progress.stats.pronunciationPractice,
      value: "45",
      unit: t.progress.stats.times,
      color: "text-chart-5",
    },
  ]

  const skills = [
    { name: t.progress.skills.listening, progress: 75, level: t.progress.skills.levels.intermediate },
    { name: t.progress.skills.speaking, progress: 65, level: t.progress.skills.levels.beginner },
    { name: t.progress.skills.reading, progress: 80, level: t.progress.skills.levels.intermediate },
    { name: t.progress.skills.writing, progress: 70, level: t.progress.skills.levels.intermediate },
  ]

  const achievements = [
    { icon: "🏆", title: t.progress.achievements.streak7, earned: true },
    { icon: "⭐", title: t.progress.achievements.lessons10, earned: false },
    { icon: "🎯", title: t.progress.achievements.pronunciation90, earned: false },
    { icon: "💬", title: t.progress.achievements.aiChat50, earned: false },
  ]

  return (
    <div className="container max-w-7xl py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            {t.progress.pageTitle}
          </CardTitle>
          <CardDescription>{t.progress.subtitle}</CardDescription>
        </CardHeader>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-primary/10 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">
                    {stat.value}
                    <span className="text-lg text-muted-foreground ml-1">{stat.unit}</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle>{t.progress.skills.title}</CardTitle>
          <CardDescription>{t.progress.skills.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{skill.name}</span>
                  <Badge variant="secondary">{skill.level}</Badge>
                </div>
                <span className="text-sm text-muted-foreground">{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-3" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            {t.progress.achievements.title}
          </CardTitle>
          <CardDescription>{t.progress.achievements.subtitle}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <Card
                key={achievement.title}
                className={`text-center ${achievement.earned ? "bg-primary/5 border-primary" : "opacity-50"}`}
              >
                <CardContent className="p-6 space-y-2">
                  <span className="text-4xl">{achievement.icon}</span>
                  <p className="text-sm font-semibold">{achievement.title}</p>
                  {achievement.earned && <Badge className="bg-yellow-500">{t.progress.achievements.earned}</Badge>}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
