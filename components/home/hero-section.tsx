"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"

export function HeroSection() {
  const { t } = useLocale()

  return (
    <section className="py-10 sm:py-16 md:py-20 px-4 bg-gradient-to-b from-primary/5 to-transparent">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
            {t.home.title}
          </h1>
          <p className="text-sm sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty text-center px-2 sm:px-4">
            {t.home.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 px-4">
            <Button size="lg" className="text-sm sm:text-base w-full sm:w-auto h-11 sm:h-12" asChild>
              <Link href="/ai-chat">{t.home.startLearning}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-sm sm:text-base bg-transparent w-full sm:w-auto h-11 sm:h-12"
              asChild
            >
              <Link href="/dictionary">{t.home.searchDictionary}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
