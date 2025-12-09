"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, MessageSquare, Mic, BookMarked, Volume2, LineChart, ShoppingBag, Trophy } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

export function FeaturesGrid() {
  const { t } = useLocale()

  const features = [
    {
      icon: BookMarked,
      title: t.nav.dictionary,
      description: t.dictionary.subtitle,
      href: "/dictionary",
      color: "text-primary",
    },
    {
      icon: MessageSquare,
      title: t.nav.aiChat,
      description: t.aiChat.subtitle,
      href: "/ai-chat",
      color: "text-blue-500",
    },
    {
      icon: BookOpen,
      title: t.nav.textbooks,
      description: t.home.features.textbooks,
      href: "/textbooks",
      color: "text-green-500",
    },
    {
      icon: Volume2,
      title: t.nav.cantonese,
      description: t.home.features.cantonese,
      href: "/cantonese",
      color: "text-purple-500",
    },
    {
      icon: Volume2,
      title: t.nav.shanghainese,
      description: t.home.features.shanghainese,
      href: "/shanghainese",
      color: "text-orange-500",
    },
    {
      icon: Mic,
      title: t.nav.pronunciation,
      description: t.pronunciation.subtitle,
      href: "/pronunciation",
      color: "text-pink-500",
    },
    {
      icon: ShoppingBag,
      title: t.nav.shop,
      description: t.shop.subtitle,
      href: "/shop",
      color: "text-orange-500",
    },
    {
      icon: Trophy,
      title: t.nav.leaderboard,
      description: t.home.features.leaderboard,
      href: "/leaderboard",
      color: "text-yellow-500",
    },
    {
      icon: LineChart,
      title: t.nav.progress,
      description: t.home.features.progress,
      href: "/progress",
      color: "text-cyan-500",
    },
  ]

  return (
    <section className="py-10 sm:py-12 md:py-16 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4">{t.home.features.title}</h2>
          <p className="text-sm sm:text-base text-muted-foreground">{t.home.features.subtitle}</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {features.map((feature) => (
            <Link key={feature.href} href={feature.href}>
              <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer">
                <CardHeader className="p-3 sm:p-4 md:p-6">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4 ${feature.color}`}
                  >
                    <feature.icon className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                  </div>
                  <CardTitle className="text-sm sm:text-base md:text-xl leading-tight">{feature.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm md:text-base line-clamp-2">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
