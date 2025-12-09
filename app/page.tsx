"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { BottomNav } from "@/components/bottom-nav"
import { DailyCheckIn } from "@/components/daily-check-in"
import { CookieConsent } from "@/components/cookie-consent"
import { SiteHeader } from "@/components/home/site-header"
import { HeroSection } from "@/components/home/hero-section"
import { FeaturesGrid } from "@/components/home/features-grid"
import { CtaSection } from "@/components/home/cta-section"
import { SiteFooter } from "@/components/home/site-footer"
import type { User } from "@supabase/supabase-js"

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  return (
    <div className="min-h-screen">
      <SiteHeader />

      <HeroSection />

      {!loading && user && (
        <section className="py-6 sm:py-8 px-4">
          <div className="container mx-auto max-w-md">
            <DailyCheckIn />
          </div>
        </section>
      )}

      <FeaturesGrid />

      <CtaSection user={user} />

      <SiteFooter />

      <BottomNav />

      <CookieConsent />
    </div>
  )
}
