import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const form = await req.formData()
  const username = String(form.get('username') || '')
  const password = String(form.get('password') || '')
  const next = String(form.get('next') || '/admin')

  const u = process.env.ADMIN_USER || ''
  const p = process.env.ADMIN_PASS || ''

  if (username === u && password === p) {
    const res = NextResponse.json({ ok: true, next })
    res.cookies.set({
      name: 'admin_auth',
      value: '1',
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/admin',
      maxAge: 60 * 60 * 8, // 8h
    })
    return res
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
}
