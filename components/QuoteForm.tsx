'use client'
import { useState } from 'react'
export default function QuoteForm(){
  const [status,setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')
  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault()
    setStatus('sending')
    const form = new FormData(e.currentTarget)
    const payload = Object.fromEntries(form.entries())
    try {
      const r = await fetch('/api/quote', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
      if(!r.ok) throw new Error('Request failed')
      setStatus('sent'); e.currentTarget.reset()
    } catch { setStatus('error') }
  }
  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-brand-dark p-6 grid gap-4">
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
      <button disabled={status!=='idle'} className="px-5 py-3 rounded-2xl bg-white text-black shadow-soft disabled:opacity-60">
        {status==='idle' && 'Send Request'}
        {status==='sending' && 'Sending…'}
        {status==='sent' && 'Request Sent ✓'}
        {status==='error' && 'Try Again'}
      </button>
      <p className="text-xs text-gray-400">No spam • Fast response • Licensed & insured</p>
    </form>
  )
}
