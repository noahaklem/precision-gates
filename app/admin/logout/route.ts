// app/admin/logout/route.ts
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const res = NextResponse.redirect(new URL('/admin', req.url), { status: 303 });
  // clear the admin cookie
  res.cookies.set({
    name: 'admin_auth',
    value: '',
    path: '/admin',
    maxAge: 0,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res;
}

