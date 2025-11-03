'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    grecaptcha?: {
      render?: unknown
      reset?: () => void
    }
  }
}


export default function QuoteForm() {
  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle');
  const [ready, setReady] = useState(false);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '';

  useEffect(() => {
    if (!siteKey) return;
    const check = () => (window.grecaptcha?.render ? setReady(true) : setTimeout(check, 200));
    check();
  }, [siteKey]);

  function getToken() {
    const el = document.querySelector<HTMLTextAreaElement>('#g-recaptcha-response');
    return el?.value?.trim() || '';
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === 'sending') return;
    if (!siteKey) { alert('reCAPTCHA not configured.'); return; }

    const token = getToken();
    if (!token) { alert('Please complete the reCAPTCHA.'); return; }

    setStatus('sending');
    try {
      const form = new FormData(e.currentTarget);
      const payload = Object.fromEntries(form.entries());
      const r = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, recaptchaToken: token })
      });
      if (!r.ok) throw new Error('Request failed');
      setStatus('sent');
      e.currentTarget.reset();
      window.grecaptcha?.reset?.();
      setTimeout(() => setStatus('idle'), 4000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  }

  // one place for consistent field styling
  const field =
    'w-full rounded-xl bg-white text-black placeholder:text-zinc-500 ' +
    'border border-zinc-200 px-3 py-2 shadow-sm ' +
    'focus:outline-none focus:ring-2 focus:ring-brand-accent focus:border-brand-accent ' +
    'disabled:opacity-60';

  return (
    <>
      {siteKey && <Script src="https://www.google.com/recaptcha/api.js" strategy="afterInteractive" />}

      <form
        onSubmit={onSubmit}
        className="rounded-2xl z-51 bg-brand-dark/95 border border-white/10 p-6 md:p-8 grid gap-5"
      >
        {/* Honeypot */}
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-4 sm:grid-cols-2">
          <input name="name" required placeholder="Name" className={field} />
          <input name="phone" required placeholder="Phone" className={field} />
          <input name="email" type="email" required placeholder="Email" className={`${field} sm:col-span-2`} />
          <input name="address" placeholder="Address (optional)" className={`${field} sm:col-span-2`} />

          <div className="relative sm:col-span-2">
            <select name="type" className={`${field} appearance-none pr-10`}>
              <option>Project Type</option>
              <option>Residential Gate</option>
              <option>Commercial Gate</option>
              <option>Access Control</option>
              <option>Repair / Service</option>
            </select>
            {/* caret */}
            <svg
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600"
              width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"
            >
              <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
            </svg>
          </div>
        </div>

        <textarea
          name="message"
          rows={5}
          placeholder="Tell us about your project…"
          className={field}
        />

        {/* reCAPTCHA */}
        {siteKey ? (
          <div className="mt-1">
            <div className="g-recaptcha" data-sitekey={siteKey} />
          </div>
        ) : (
          <p className="text-sm text-red-400">reCAPTCHA is not configured. Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY.</p>
        )}

        <button
          disabled={status === 'sending' || !siteKey || !ready}
          className="inline-flex items-center justify-center rounded-2xl bg-white text-black px-5 py-3 font-medium shadow-soft
                     hover:bg-zinc-100 transition disabled:opacity-60"
          aria-live="polite"
        >
          {status==='idle'    && (siteKey ? (ready ? 'Send Request' : 'Loading…') : 'Captcha missing')}
          {status==='sending' && 'Sending…'}
          {status==='sent'    && 'Request Sent ✓'}
          {status==='error'   && 'Try Again'}
        </button>

        <p className="text-xs text-gray-400">No spam • Fast response • Licensed & insured</p>
      </form>
    </>
  );
}




