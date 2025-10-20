// app/api/quote/route.ts
import { NextResponse } from 'next/server'

type QuotePayload = {
  name?: string
  email?: string
  phone?: string
  address?: string
  type?: string
  message?: string
  recaptchaToken?: string
  recaptchaAction?: string
  company?: string // honeypot
}

function isEmail(v?: string) {
  return !!v && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}
function sanitize(v?: string) {
  return (v ?? '').toString().slice(0, 2000).trim()
}

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const data = (await req.json()) as QuotePayload

    // Honeypot (bots fill hidden fields)
    if (data.company && data.company.trim().length > 0) {
      return NextResponse.json({ ok: true })
    }

    const name = sanitize(data.name)
    const email = sanitize(data.email)
    const phone = sanitize(data.phone)
    const address = sanitize(data.address)
    const type = sanitize(data.type)
    const message = sanitize(data.message)

    if (!name || !isEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Invalid name or email' }, { status: 400 })
    }

    // ...
    // --- reCAPTCHA v2 (checkbox) verification ---
    const secret = process.env.RECAPTCHA_SECRET
    const token = data.recaptchaToken

    if (!secret) {
      console.error('Missing RECAPTCHA_SECRET')
      return NextResponse.json({ ok:false, error:'Captcha not configured' }, { status: 500 })
    }
    if (!token) {
      return NextResponse.json({ ok:false, error:'Captcha required' }, { status: 400 })
    }

    // Optional: forward client IP
    const fwd = (req.headers.get('x-forwarded-for') || '').split(',')[0]?.trim()
    const params = new URLSearchParams({ secret, response: token })
    if (fwd) params.set('remoteip', fwd)

    const verifyRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params,
    })
    const verify = await verifyRes.json() as {
      success: boolean; challenge_ts?: string; hostname?: string; 'error-codes'?: string[]
    }

    if (!verify.success) {
      console.warn('reCAPTCHA v2 failed', verify)
      return NextResponse.json({ ok:false, error:'Captcha verification failed' }, { status: 400 })
    }
    // --- end reCAPTCHA v2 verification ---

    const key = process.env.SENDGRID_API_KEY
    const to = process.env.QUOTE_TO || 'admin@example.com'
    const fromEmail = process.env.SENDGRID_FROM || 'no-reply@pgagates.com'
    const fromName = 'Precision Gates Form'

    const text = `
New Quote Request

Name:    ${name}
Email:   ${email}
Phone:   ${phone || '-'}
Address: ${address || '-'}

Type:    ${type || '-'}

Message:
${message || '-'}
`.trim()

    const html = `
<h2 style="margin:0 0 12px;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial">New Quote Request</h2>
<table cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial">
  <tr><td><strong>Name</strong></td><td>${escapeHtml(name)}</td></tr>
  <tr><td><strong>Email</strong></td><td>${escapeHtml(email)}</td></tr>
  <tr><td><strong>Phone</strong></td><td>${escapeHtml(phone || '-')}</td></tr>
  <tr><td><strong>Address</strong></td><td>${escapeHtml(address || '-')}</td></tr>
  <tr><td><strong>Type</strong></td><td>${escapeHtml(type || '-')}</td></tr>
</table>
<p style="margin:16px 0 6px;font-weight:600">Message</p>
<pre style="white-space:pre-wrap;font-family:inherit;background:#f6f6f6;padding:12px;border-radius:8px;">${escapeHtml(message || '-')}</pre>
`.trim()

    if (!key) {
      console.log('Quote request (no SENDGRID_API_KEY set):', { name, email, phone, address, type, message })
      return NextResponse.json({ ok: true })
    }

    const sendgridPayload = {
      personalizations: [{ to: [{ email: to }], subject: 'New Quote Request' }],
      from: { email: fromEmail, name: fromName },
      reply_to: { email, name },
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }

    const sg = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendgridPayload),
    })

    if (!sg.ok) {
      const errBody = await sg.text().catch(() => '')
      console.error('SendGrid error', sg.status, errBody)
      return NextResponse.json({ ok: false, error: 'Email delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 })
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}


