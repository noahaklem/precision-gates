'use client'
import { useState } from 'react'

export default function AdminPage() {
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setBusy(true); setMsg(null)

    const formData = new FormData(e.currentTarget)
    try {
      const res = await fetch('/admin/api/upload', { method: 'POST', body: formData })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      setMsg('✅ Added! A new deploy will start in a moment.')
      e.currentTarget.reset()
    } catch (err: any) {
      setMsg(`❌ ${err.message || 'Upload failed'}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="container section">
      <h1 className="text-3xl font-semibold">Admin · Add Gallery Item</h1>
    <div className="flex justify-between items-center mb-6">
    <h1 className="text-3xl font-semibold">Admin · Add Gallery Item</h1>
    <a
        href="/admin/logout"
        className="text-sm text-gray-400 hover:text-white border border-white/10 rounded-xl px-3 py-1 transition"
    >
        Logout
    </a>
    </div>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-xl">
        <div className="rounded-2xl border border-white/10 bg-brand-dark p-6 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Image (JPG/PNG/WebP)</span>
            <input type="file" name="file" accept="image/*" required className="block" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-gray-300">File name override (optional, include extension)</span>
            <input name="filename" placeholder="my-gate.jpg" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Alt text</span>
            <input name="alt" required className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Caption</span>
            <input name="caption" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Tags (comma-separated)</span>
            <input name="tags" placeholder="residential, swing, access-control" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
          </label>

          <div className="grid sm:grid-cols-2 gap-4">
            <label className="grid gap-2">
              <span className="text-sm text-gray-300">Location</span>
              <input name="location" placeholder="Denver, CO" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
            </label>
            <label className="grid gap-2">
              <span className="text-sm text-gray-300">Date</span>
              <input name="createdAt" type="date" className="px-3 py-2 rounded-xl bg-black/40 border border-white/10" />
            </label>
          </div>

          <label className="inline-flex items-center gap-2">
            <input type="checkbox" name="hero" className="scale-110" />
            <span className="text-sm text-gray-300">Feature in Hero rotation</span>
          </label>

          <button
            disabled={busy}
            className="px-5 py-3 rounded-2xl bg-white text-black shadow-soft disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save to Gallery'}
          </button>

          {msg && <p className="text-sm">{msg}</p>}
        </div>
      </form>
    </main>
  )
}
