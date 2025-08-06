'use client'

import { usePathname, useRouter } from 'next/navigation'
import { localeLabels, type SupportedLocale, supportedLocales } from '@/lib/i18n'

interface LocaleSwitcherProps {
  currentLocale: SupportedLocale
  className?: string
}

export function LocaleSwitcher({ currentLocale, className = '' }: LocaleSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    // Remove current locale from pathname and add new one
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')

    router.push(newPath)
  }

  return (
    <div className={`locale-switcher ${className}`}>
      <select
        value={currentLocale}
        onChange={(e) => handleLocaleChange(e.target.value as SupportedLocale)}
        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {supportedLocales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </div>
  )
}
