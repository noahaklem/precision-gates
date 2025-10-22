// app/admin/login/LoginForm.tsx
'use client';

import { useState } from 'react';

export default function LoginForm({ next }: { next: string }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true); setErr(null);

    const fd = new FormData(e.currentTarget);
    fd.set('next', next);

    const res = await fetch('/admin/api/login', { method: 'POST', body: fd });
    if (res.ok) {
      window.location.assign(next);
      return;
    }
    const data = await res.json().catch(() => ({ error: 'Login failed' }));
    setErr(data.error || 'Login failed');
    setBusy(false);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 grid gap-4 rounded-2xl border border-white/10 bg-brand-dark p-6"
    >
      <input type="hidden" name="next" value={next} />

      <label className="grid gap-2">
        <span className="text-sm text-gray-300">Username</span>
        <input name="username" required className="px-3 py-2 rounded-xl bg-white text-black" />
      </label>

      <label className="grid gap-2">
        <span className="text-sm text-gray-300">Password</span>
        <input name="password" type="password" required className="px-3 py-2 rounded-xl bg-white text-black" />
      </label>

      {err && <p className="text-sm text-red-400">{err}</p>}

      <button
        disabled={busy}
        className="px-5 py-3 rounded-2xl bg-white text-black disabled:opacity-60"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
