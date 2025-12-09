"use client"

import { ProgressDashboard } from "@/components/progress-dashboard"
import { LineChart } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"

export default function ProgressPage() {
  const { t } = useLocale()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LineChart className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">{t.progress.title}</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">{t.progress.backHome}</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <ProgressDashboard />
      </main>
    </div>
  )
}
