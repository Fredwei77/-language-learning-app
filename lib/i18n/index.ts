import { zh } from "./translations/zh"
import { en } from "./translations/en"
import type { Locale } from "./config"
import type { Translations } from "./translations/zh"

const translations: Record<Locale, Translations> = {
  zh,
  en,
}

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.zh
}

export function useTranslations(locale: Locale) {
  const t = getTranslations(locale)
  return t
}

export * from "./config"
export type { Translations }
