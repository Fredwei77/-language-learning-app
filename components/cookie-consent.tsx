"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { X, Cookie } from "lucide-react"
import { useLocale } from "@/hooks/use-locale"

const COOKIE_CONSENT_KEY = "cookie-consent"

interface CookiePreferences {
  necessary: boolean
  analytics: boolean
  marketing: boolean
}

export function CookieConsent() {
  const { t } = useLocale()
  const [showBanner, setShowBanner] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true
    analytics: false,
    marketing: false,
  })

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    console.log("Cookie consent check:", consent)
    if (!consent) {
      // Show banner after a short delay
      console.log("No consent found, showing banner in 1 second...")
      setTimeout(() => {
        console.log("Showing cookie banner now")
        setShowBanner(true)
      }, 1000)
    } else {
      console.log("Consent already exists, not showing banner")
    }
  }, [])

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs))
    setShowBanner(false)
    setShowCustomize(false)

    // Here you would typically initialize analytics/marketing scripts based on preferences
    if (prefs.analytics) {
      // Initialize analytics (e.g., Google Analytics)
      console.log("Analytics enabled")
    }
    if (prefs.marketing) {
      // Initialize marketing tools
      console.log("Marketing enabled")
    }
  }

  const handleAcceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
    })
  }

  const handleRejectAll = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
    })
  }

  const handleSavePreferences = () => {
    saveConsent(preferences)
  }

  if (!showBanner) {
    // Debug: Show a small button to reset consent (only in development)
    if (process.env.NODE_ENV === "development") {
      return (
        <button
          onClick={() => {
            localStorage.removeItem(COOKIE_CONSENT_KEY)
            setShowBanner(true)
          }}
          className="fixed bottom-4 right-4 z-50 bg-gray-800 text-white px-3 py-2 rounded text-xs opacity-50 hover:opacity-100"
        >
          Reset Cookie Consent
        </button>
      )
    }
    return null
  }

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50" />

      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
        <Card className="max-w-4xl mx-auto shadow-2xl border-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Cookie className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl">{t.cookies.title}</CardTitle>
                  <CardDescription className="text-sm mt-1">{t.cookies.description}</CardDescription>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                onClick={() => setShowBanner(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!showCustomize ? (
            <CardContent className="flex flex-col sm:flex-row gap-3 pt-0">
              <Button onClick={handleAcceptAll} className="flex-1">
                {t.cookies.acceptAll}
              </Button>
              <Button onClick={handleRejectAll} variant="outline" className="flex-1">
                {t.cookies.rejectAll}
              </Button>
              <Button onClick={() => setShowCustomize(true)} variant="outline" className="flex-1">
                {t.cookies.customize}
              </Button>
            </CardContent>
          ) : (
            <CardContent className="space-y-4 pt-0">
              {/* Necessary Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label className="font-semibold">{t.cookies.necessary}</Label>
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Required</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{t.cookies.necessaryDesc}</p>
                </div>
                <Switch checked={true} disabled />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <Label className="font-semibold">{t.cookies.analytics}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{t.cookies.analyticsDesc}</p>
                </div>
                <Switch
                  checked={preferences.analytics}
                  onCheckedChange={(checked: boolean) => setPreferences({ ...preferences, analytics: checked })}
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-start justify-between gap-4 p-3 rounded-lg bg-muted/50">
                <div className="flex-1">
                  <Label className="font-semibold">{t.cookies.marketing}</Label>
                  <p className="text-sm text-muted-foreground mt-1">{t.cookies.marketingDesc}</p>
                </div>
                <Switch
                  checked={preferences.marketing}
                  onCheckedChange={(checked: boolean) => setPreferences({ ...preferences, marketing: checked })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button onClick={handleSavePreferences} className="flex-1">
                  {t.cookies.savePreferences}
                </Button>
                <Button onClick={() => setShowCustomize(false)} variant="outline" className="flex-1">
                  {t.common.back}
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </>
  )
}
