"use client"

import { CantoneseLearnEnhanced } from "@/components/cantonese-learn-enhanced"
import { Languages } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"

export default function CantonesePage() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-chart-4 text-primary-foreground">
              <Languages className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">{t.cantonese.title}</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">{t.cantonese.backHome}</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <CantoneseLearnEnhanced />
      </main>
    </div>
  )
}
