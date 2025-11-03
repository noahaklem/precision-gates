'use client';

import { useRef, useState } from 'react';

type UploadResponse = {
  ok: boolean;
  path?: string;
  url?: string;
  commitUrl?: string;
  message?: string;
  error?: string;
};

function isUploadResponse(v: unknown): v is UploadResponse {
  if (typeof v !== 'object' || v === null) return false;
  // ok must be boolean; the rest are optional strings
  const r = v as Record<string, unknown>;
  const isStr = (x: unknown) => typeof x === 'string' || typeof x === 'undefined';
  return (
    typeof r.ok === 'boolean' &&
    isStr(r.path) &&
    isStr(r.url) &&
    isStr(r.commitUrl) &&
    isStr(r.message) &&
    isStr(r.error)
  );
}

export default function AdminPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<UploadResponse | null>(null);

  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setErr(null);
    setOk(null);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      // NOTE: input.files is read-only; we keep state/preview instead.
      // If you really need to reflect in the input, use a DataTransfer on a hidden input.
    }
  }

  function resetAll() {
    formRef.current?.reset();
    setFile(null);
    setPreview(null);
    setOk(null);
    setErr(null);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!file) {
      setErr('Please choose an image (JPG/PNG/WebP).');
      return;
    }

    const valid = ['image/jpeg', 'image/png', 'image/webp'];
    if (!valid.includes(file.type)) {
      setErr('Unsupported image type. Use JPG, PNG, or WebP.');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setErr('File is too large (max 8 MB).');
      return;
    }

    setBusy(true);
    try {
      const fd = new FormData(e.currentTarget);
      fd.set('file', file);

      const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
      const payload: unknown = await res.json();

      if (!res.ok || !isUploadResponse(payload) || !payload.ok) {
        const msg =
          (isUploadResponse(payload) && (payload.error || payload.message)) ||
          `Upload failed (${res.status})`;
        throw new Error(msg);
      }

      setOk(payload);
      // keep preview so the user sees what was uploaded
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Upload failed';
      setErr(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container section max-w-3xl">
      <h1 className="text-3xl font-semibold">Admin — Add Gallery Image</h1>
      <p className="mt-2 text-gray-400">
        Upload a photo and metadata, we’ll append to <code>public/gallery</code> and update
        <code> metadata.json</code>. (Private admin page)
      </p>

      {ok && (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          <div className="font-medium">Upload complete ✅</div>
          <ul className="mt-2 space-y-1 text-sm">
            {ok.path && (
              <li>
                Saved as: <code className="text-emerald-100">{ok.path}</code>
              </li>
            )}
            {ok.url && (
              <li>
                <a className="underline hover:no-underline" href={ok.url} target="_blank" rel="noreferrer">
                  View file
                </a>
              </li>
            )}
            {ok.commitUrl && (
              <li>
                <a className="underline hover:no-underline" href={ok.commitUrl} target="_blank" rel="noreferrer">
                  View commit
                </a>
              </li>
            )}
            {ok.message && <li>{ok.message}</li>}
          </ul>
          <div className="mt-3">
            <button onClick={resetAll} className="rounded-xl bg-white px-4 py-2 text-black hover:bg-gray-200 transition">
              Upload another
            </button>
          </div>
        </div>
      )}

      {err && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          <div className="font-medium">Upload failed</div>
          <p className="mt-1 text-sm">{err}</p>
        </div>
      )}

      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="mt-6 grid gap-6 rounded-2xl border border-white/10 bg-brand-dark p-6"
      >
        <div>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/20 bg-black/30 px-4 py-10 text-center transition hover:border-white/40"
          >
            <input
              ref={fileInput}
              type="file"
              name="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={onPickFile}
              className="hidden"
            />
            <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true" className="opacity-80">
              <path
                fill="currentColor"
                d="M19 15v4H5v-4H3v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4zm-7-1l-4-4l1.41-1.41L11 10.17V3h2v7.17l2.59-2.58L17 10z"
              />
            </svg>
            <div className="font-medium text-white">Choose a file or drag & drop</div>
            <div className="text-xs text-gray-400">JPG, PNG, or WebP · up to 8 MB</div>
            {file && <div className="mt-2 text-sm text-gray-300">Selected: {file.name}</div>}
          </label>

          {preview && (
            <div className="mt-4">
              <div className="mb-2 text-sm text-gray-300">Preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="preview"
                className="max-h-64 rounded-xl border border-white/10 bg-black/30 object-contain"
              />
            </div>
          )}
        </div>

        <label className="grid gap-2">
          <span className="text-sm text-gray-300">File name override (optional, include extension)</span>
          <input
            name="filename"
            placeholder="my-gate.jpg"
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-400"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Alt text</span>
          <input
            name="alt"
            required
            placeholder="Iron driveway gate with keypad in Denver, CO"
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-400"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Caption</span>
          <input
            name="caption"
            placeholder="Residential swing gate with access keypad and safety sensors."
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-400"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Tags (comma-separated)</span>
          <input
            name="tags"
            placeholder="residential, swing, access-control"
            className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-400"
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Location</span>
            <input
              name="location"
              placeholder="Denver, CO"
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-400"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Date</span>
            <input
              name="createdAt"
              type="date"
              className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white placeholder-gray-400"
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" className="size-4 rounded border-white/20 bg-black/30" />
          <span className="text-sm text-gray-300">Feature in Hero rotation</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            disabled={busy}
            className="rounded-2xl bg-white px-5 py-3 text-black transition hover:bg-gray-200 disabled:opacity-60"
          >
            {busy ? 'Uploading…' : 'Upload'}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="rounded-2xl border border-white/20 px-5 py-3 transition hover:bg-white/10"
          >
            Reset
          </button>
        </div>

        <p className="text-xs text-gray-400">
          We’ll write the image into <code>public/gallery</code> and merge its metadata into
          <code> metadata.json</code>. If configured, a Git commit/PR is created automatically.
        </p>
      </form>
    </main>
  );
}


