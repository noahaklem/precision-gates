// app/admin/logout/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function LogoutPage() {
  cookies().set({ name: 'admin_auth', value: '', path: '/admin', maxAge: 0 })
  redirect('/admin') // will re-prompt
}

