// middleware.ts
import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only protect /admin and /admin/api/*
  const isProtected =
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname.startsWith('/admin/api/')

  if (!isProtected) return NextResponse.next()

  // Already authenticated via cookie?
  const session = req.cookies.get('admin_auth')?.value
  if (session === '1') return NextResponse.next()

  // No cookie → check Basic Auth
  const auth = req.headers.get('authorization') || ''
  const [scheme, encoded] = auth.split(' ')
  const { ADMIN_USER, ADMIN_PASS } = process.env

  let valid = false
  if (scheme === 'Basic' && encoded) {
    try {
      // Edge-safe base64 decode
      const decoded = atob(encoded)
      const sep = decoded.indexOf(':')
      const u = decoded.slice(0, sep)
      const p = decoded.slice(sep + 1)
      valid = u === ADMIN_USER && p === ADMIN_PASS
    } catch {
      valid = false
    }
  }

  if (valid) {
    // Set the cookie and redirect to same URL so the next request carries the cookie
    const res = NextResponse.redirect(req.nextUrl, { status: 303 })
    res.cookies.set('admin_auth', '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
      maxAge: 60 * 60 * 8, // 8 hours
    })
    // prevent caching
    res.headers.set('Cache-Control', 'no-store')
    return res
  }

  // Challenge for Basic Auth
  return new NextResponse('Auth required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Restricted"' },
  })
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/admin/api/:path*'],
}



