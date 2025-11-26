"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

export function SiteFooter() {
  const { t } = useLocale()

  return (
    <footer className="border-t py-6 md:py-8 px-4 mb-16 sm:mb-0">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col gap-6">
          {/* Main Footer Content */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t.footer.appName}</span>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm">
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {t.footer.termsOfService}
              </Link>
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline"
              >
                {t.footer.privacyPolicy}
              </Link>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              © 2025 {t.footer.appName}. {t.footer.allRightsReserved}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{t.footer.copyright}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
