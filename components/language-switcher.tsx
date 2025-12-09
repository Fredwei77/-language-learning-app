"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Languages } from "lucide-react"
import { locales, localeNames, type Locale } from "@/lib/i18n"

const LOCALE_STORAGE_KEY = "preferred-locale"

export function LanguageSwitcher() {
  const [locale, setLocale] = useState<Locale>("zh")

  useEffect(() => {
    // 从 localStorage 读取语言偏好
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY) as Locale
    if (stored && locales.includes(stored)) {
      setLocale(stored)
    }
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    setLocale(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
    // 触发自定义事件，通知其他组件语言已更改
    window.dispatchEvent(new CustomEvent("localeChange", { detail: newLocale }))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Languages className="h-4 w-4" />
          <span className="sr-only">切换语言 / Switch Language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={locale === loc ? "bg-accent" : ""}
          >
            {localeNames[loc]}
            {locale === loc && " ✓"}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
