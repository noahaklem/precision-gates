'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window { grecaptcha: any }
}

export default function QuoteForm(){
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!

  // simple helper to read the v2 token
  function getToken() {
    const el = document.querySelector<HTMLTextAreaElement>('#g-recaptcha-response')
    return el?.value?.trim() || ''
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (status === 'sending') return

    const token = getToken()
    if (!token) {
      // force validation if user didn't click the checkbox yet
      window.grecaptcha?.execute?.() // (not used by v2 checkbox, but harmless)
      alert('Please complete the reCAPTCHA.')
      return
    }

    setStatus('sending')
    try {
      const form = new FormData(e.currentTarget)
      const payload = Object.fromEntries(form.entries())

      const r = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken: token })
      })
      if (!r.ok) throw new Error('Request failed')

      setStatus('sent')
      e.currentTarget.reset()
      // reset the checkbox UI
      window.grecaptcha?.reset?.()
      setTimeout(() => setStatus('idle'), 4000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <>
      {/* Load reCAPTCHA v2 (checkbox) */}
      <Script
        src="https://www.google.com/recaptcha/api.js"
        strategy="afterInteractive"
      />
      <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-brand-dark p-6 grid gap-4">
        {/* Honeypot (hidden) */}
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-3 sm:grid-cols-2">
          <input name="name" required placeholder="Name" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
          <input name="phone" required placeholder="Phone" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
          <input name="email" type="email" required placeholder="Email" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 sm:col-span-2" />
          <input name="address" placeholder="Address (optional)" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 sm:col-span-2" />
          <select name="type" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10 sm:col-span-2">
            <option>Project Type</option>
            <option>Residential Gate</option>
            <option>Commercial Gate</option>
            <option>Access Control</option>
            <option>Repair / Service</option>
          </select>
        </div>

        <textarea name="message" rows={4} placeholder="Tell us about your project…" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />

        {/* reCAPTCHA v2 checkbox widget */}
        <div className="mt-2">
          <div className="g-recaptcha" data-sitekey={siteKey} />
        </div>

        <button
          disabled={status === 'sending'}
          className="px-5 py-3 rounded-2xl bg-white text-black shadow-soft disabled:opacity-60"
          aria-live="polite"
        >
          {status==='idle' && 'Send Request'}
          {status==='sending' && 'Sending…'}
          {status==='sent' && 'Request Sent ✓'}
          {status==='error' && 'Try Again'}
        </button>

        <p className="text-xs text-gray-400">No spam • Fast response • Licensed & insured</p>
      </form>
    </>
  )
}



