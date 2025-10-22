import { NextResponse, NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminArea = pathname === '/admin' || pathname.startsWith('/admin/')
  const isLoginPage = pathname.startsWith('/admin/login')
  const isLoginApi  = pathname.startsWith('/admin/api/login')

  // Only guard /admin* except the login page & login API
  if (!isAdminArea || isLoginPage || isLoginApi) return NextResponse.next()

  const authed = req.cookies.get('admin_auth')?.value === '1'
  if (authed) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/admin/login'
  url.searchParams.set('next', pathname)
  return NextResponse.redirect(url, { status: 303 })
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}







