"use client"

import { useState, useEffect } from "react"
import { defaultLocale, type Locale, locales } from "@/lib/i18n"
import { useTranslations } from "@/lib/i18n"

const LOCALE_STORAGE_KEY = "preferred-locale"

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const t = useTranslations(locale)

  useEffect(() => {
    // 从 localStorage 读取语言偏好
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale
    if (stored && locales.includes(stored)) {
      setLocale(stored)
    }

    // 监听语言切换事件
    const handleLocaleChange = (event: CustomEvent<Locale>) => {
      setLocale(event.detail)
    }

    window.addEventListener("localeChange", handleLocaleChange as EventListener)

    return () => {
      window.removeEventListener("localeChange", handleLocaleChange as EventListener)
    }
  }, [])

  return { locale, t }
}
