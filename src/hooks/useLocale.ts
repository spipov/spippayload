'use client'

import { usePathname } from 'next/navigation'
import { getLocaleFromUrl, type SupportedLocale } from '@/lib/i18n'

export function useLocale(): SupportedLocale {
  const pathname = usePathname()
  return getLocaleFromUrl(pathname)
}
