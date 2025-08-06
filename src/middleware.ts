import { type NextRequest, NextResponse } from 'next/server'
import { defaultLocale, isValidLocale, supportedLocales } from './lib/i18n'

export function middleware(request: NextRequest) {
  // Skip middleware for API routes, admin routes, and static files
  if (
    request.nextUrl.pathname.startsWith('/api') ||
    request.nextUrl.pathname.startsWith('/admin') ||
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = supportedLocales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    // Get locale from Accept-Language header or use default
    const locale = getLocaleFromHeaders(request) || defaultLocale

    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url),
    )
  }

  return NextResponse.next()
}

function getLocaleFromHeaders(request: NextRequest): string | null {
  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return null

  // Parse Accept-Language header and find the best match
  const languages = acceptLanguage
    .split(',')
    .map((lang) => {
      const [code, q = '1'] = lang.trim().split(';q=')
      return { code: code.split('-')[0], quality: parseFloat(q) }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { code } of languages) {
    if (isValidLocale(code)) {
      return code
    }
  }

  return null
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!_next|api|favicon.ico).*)',
  ],
}
