"use client"

import { ShanghainesesLearnEnhanced } from "@/components/shanghainese-learn-enhanced"
import { Languages } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function ShanghainesesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500 text-primary-foreground">
              <Languages className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">沪语学习</span>
          </Link>
          <Button variant="outline" asChild>
            <Link href="/">返回首页</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1">
        <ShanghainesesLearnEnhanced />
      </main>
    </div>
  )
}
