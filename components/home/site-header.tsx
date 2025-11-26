"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { MobileNav } from "@/components/mobile-nav"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLocale } from "@/hooks/use-locale"

export function SiteHeader() {
  const { t } = useLocale()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-pt">
      <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <MobileNav />
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6" />
            </div>
            <span className="text-lg sm:text-xl font-bold hidden xs:inline">{t.footer.appName}</span>
          </Link>
        </div>
        <nav className="hidden lg:flex items-center gap-6">
          <Link href="/dictionary" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.dictionary}
          </Link>
          <Link href="/ai-chat" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.aiChat}
          </Link>
          <Link href="/textbooks" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.textbooks}
          </Link>
          <Link href="/cantonese" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.cantonese}
          </Link>
          <Link href="/pronunciation" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.pronunciation}
          </Link>
          <Link href="/shop" className="text-sm font-medium hover:text-primary transition-colors">
            {t.nav.shop}
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
