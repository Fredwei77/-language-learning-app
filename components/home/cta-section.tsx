"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLocale } from "@/hooks/use-locale"
import type { User } from "@supabase/supabase-js"

interface CtaSectionProps {
  user: User | null
}

export function CtaSection({ user }: CtaSectionProps) {
  const { t } = useLocale()

  return (
    <section className="py-12 sm:py-16 md:py-20 px-4 bg-primary text-primary-foreground">
      <div className="container mx-auto max-w-4xl text-center space-y-3 sm:space-y-4 md:space-y-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-balance">{t.home.cta.title}</h2>
        <p className="text-sm sm:text-base md:text-lg opacity-90 text-balance px-4">{t.home.cta.subtitle}</p>
        <Button size="lg" variant="secondary" className="text-sm sm:text-base h-11 sm:h-12" asChild>
          <Link href={user ? "/ai-chat" : "/auth/sign-up"}>
            {user ? t.home.continueLearning : t.home.freeSignup}
          </Link>
        </Button>
      </div>
    </section>
  )
}
