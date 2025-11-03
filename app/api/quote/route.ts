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
    const to = process.env.QUOTE_TO || 'info@pgagates.com'
    const fromEmail = process.env.SENDGRID_FROM || 'info@pgagates.com'
    const fromName = 'Precision Gates Information Request'

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
      return NextResponse.json({ ok: true, message: 'Thanks! We received your request.' })
    }

    const notifyPayload = {
      personalizations: [{ to: [{ email: to }], subject: 'New Quote Request' }],
      from: { email: fromEmail, name: fromName },
      reply_to: { email, name },
      content: [
        { type: 'text/plain', value: text },
        { type: 'text/html', value: html },
      ],
    }

    const notifyRes = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(notifyPayload),
    });
    if (!notifyRes.ok) {
      const errBody = await notifyRes.text().catch(() => '');
      console.error('SendGrid (notify) error', notifyRes.status, errBody);
      return NextResponse.json({ ok: false, error: 'Email delivery failed' }, { status: 502 });
    }

    const sg = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifyPayload),
    })

    if (!sg.ok) {
      const errBody = await sg.text().catch(() => '')
      console.error('SendGrid error', sg.status, errBody)
      return NextResponse.json({ ok: false, error: 'Email delivery failed' }, { status: 502 })
    }

    const confirmText = `
    Hi ${name},

    Thanks for reaching out to Precision Gates & Automation — we’ve received your request and will follow up shortly.

    Summary:
    - Email: ${email}
    - Phone: ${phone || '-'}
    - Address: ${address || '-'}
    - Project Type: ${type || '-'}

    Message:
    ${message || '-'}

    If anything looks off, just reply to this email.

    — Precision Gates & Automation
    `.trim();

        const confirmHtml = `
    <p>Hi ${escapeHtml(name)},</p>
    <p>Thanks for reaching out to <strong>Precision Gates &amp; Automation</strong> — we’ve received your request and will follow up shortly.</p>
    <p><strong>Summary</strong></p>
    <ul>
      <li>Email: ${escapeHtml(email)}</li>
      <li>Phone: ${escapeHtml(phone || '-')}</li>
      <li>Address: ${escapeHtml(address || '-')}</li>
      <li>Project Type: ${escapeHtml(type || '-')}</li>
    </ul>
    <p><strong>Message</strong></p>
    <pre style="white-space:pre-wrap;font-family:inherit;background:#f6f6f6;padding:12px;border-radius:8px;">${escapeHtml(message || '-')}</pre>
    <p>If anything looks off, just reply to this email.</p>
    <p>— Precision Gates &amp; Automation</p>
    `.trim();

    const confirmPayload = {
      personalizations: [{ to: [{ email }], subject: 'We received your quote request' }],
      from: { email: fromEmail, name: fromName },
      reply_to: { email: to, name: fromName }, // replies come to you
      content: [
        { type: 'text/plain', value: confirmText },
        { type: 'text/html', value: confirmHtml }
      ],
    };

    // Fire-and-forget confirmation; don’t fail the whole request if this part fails
    fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(confirmPayload),
    }).catch(err => console.warn('SendGrid (confirm) error', err));

    return NextResponse.json({ ok: true, message: 'Thanks! Your request was sent. We’ll follow up shortly.' });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, error: 'Server error' }, { status: 500 });
  }
}

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}


