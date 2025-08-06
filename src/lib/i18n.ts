export const supportedLocales = ['en', 'es', 'fr', 'de', 'ar'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

export const defaultLocale: SupportedLocale = 'en'

export const localeLabels: Record<SupportedLocale, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  ar: 'العربية',
}

export const rtlLocales: SupportedLocale[] = ['ar']

export function isRtlLocale(locale: string): boolean {
  return rtlLocales.includes(locale as SupportedLocale)
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return supportedLocales.includes(locale as SupportedLocale)
}

export function getLocaleFromUrl(pathname: string): SupportedLocale {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]

  if (isValidLocale(potentialLocale)) {
    return potentialLocale
  }

  return defaultLocale
}

export function removeLocaleFromUrl(pathname: string): string {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]

  if (isValidLocale(potentialLocale)) {
    return `/${segments.slice(2).join('/')}`
  }

  return pathname
}
