'use client';

import { useRef, useState } from 'react';

type UploadResponse = {
  ok: boolean;
  path?: string;         // e.g. "public/gallery/my-photo.jpg"
  url?: string;          // e.g. "/gallery/my-photo.jpg" (site URL or raw GitHub URL)
  commitUrl?: string;    // e.g. link to the commit/PR
  message?: string;      // server message
  error?: string;        // error message
};

export default function AdminPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<UploadResponse | null>(null);

  // ----- UI helpers -----
  function onPickFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] || null;
    setFile(f);
    setErr(null);
    setOk(null);
    setPreview(f ? URL.createObjectURL(f) : null);
  }

  function onDrop(e: React.DragEvent<HTMLLabelElement>) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0] || null;
    if (f) {
      setFile(f);
      setPreview(URL.createObjectURL(f));
      if (fileInput.current) fileInput.current.files = e.dataTransfer.files;
    }
  }

  function resetAll() {
    formRef.current?.reset();
    setFile(null);
    setPreview(null);
    setOk(null);
    setErr(null);
  }

  // ----- submit -----
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(null);
    setOk(null);

    if (!file) {
      setErr('Please choose an image (JPG/PNG/WebP).');
      return;
    }

    // Simple client-side type/size checks (adjust as you like)
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
      fd.set('file', file); // ensure we send the chosen file

      const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
      const data = (await res.json()) as UploadResponse;

      if (!res.ok || !data.ok) {
        throw new Error(data.error || data.message || 'Upload failed');
      }

      setOk(data);
      // keep the preview so you see what was uploaded
    } catch (error: any) {
      setErr(error?.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container section max-w-3xl">
      <h1 className="text-3xl font-semibold">Admin — Add Gallery Image</h1>
      <p className="text-gray-400 mt-2">
        Upload a photo and metadata, we’ll append to <code>public/gallery</code> and update
        <code> metadata.json</code>. (Private admin page)
      </p>

      {/* Success / Error banners */}
      {ok && (
        <div className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-200">
          <div className="font-medium">Upload complete ✅</div>
          <ul className="text-sm mt-2 space-y-1">
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
            <button
              onClick={resetAll}
              className="px-4 py-2 rounded-xl bg-white text-black hover:bg-gray-200 transition"
            >
              Upload another
            </button>
          </div>
        </div>
      )}

      {err && (
        <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-200">
          <div className="font-medium">Upload failed</div>
          <p className="text-sm mt-1">{err}</p>
        </div>
      )}

      {/* Form card */}
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="mt-6 grid gap-6 rounded-2xl border border-white/10 bg-brand-dark p-6"
      >
        {/* Dropzone / File picker */}
        <div>
          <label
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-white/20 bg-black/30 px-4 py-10 text-center hover:border-white/40 transition cursor-pointer"
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
            <div className="text-white font-medium">Choose a file or drag & drop</div>
            <div className="text-xs text-gray-400">JPG, PNG, or WebP · up to 8 MB</div>
            {file && <div className="text-sm text-gray-300 mt-2">Selected: {file.name}</div>}
          </label>

          {/* Preview */}
          {preview && (
            <div className="mt-4">
              <div className="text-sm text-gray-300 mb-2">Preview</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="preview"
                className="rounded-xl border border-white/10 max-h-64 object-contain bg-black/30"
              />
            </div>
          )}
        </div>

        {/* File name override */}
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">File name override (optional, include extension)</span>
          <input
            name="filename"
            placeholder="my-gate.jpg"
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-400"
          />
        </label>

        {/* Alt text */}
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Alt text</span>
          <input
            name="alt"
            required
            placeholder="Iron driveway gate with keypad in Denver, CO"
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-400"
          />
        </label>

        {/* Caption */}
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Caption</span>
          <input
            name="caption"
            placeholder="Residential swing gate with access keypad and safety sensors."
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-400"
          />
        </label>

        {/* Tags */}
        <label className="grid gap-2">
          <span className="text-sm text-gray-300">Tags (comma-separated)</span>
          <input
            name="tags"
            placeholder="residential, swing, access-control"
            className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-400"
          />
        </label>

        {/* Location + Date + Feature */}
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Location</span>
            <input
              name="location"
              placeholder="Denver, CO"
              className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-400"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm text-gray-300">Date</span>
            <input
              name="createdAt"
              type="date"
              className="px-3 py-2 rounded-xl bg-black/30 border border-white/10 text-white placeholder-gray-400"
            />
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="featured" className="size-4 rounded border-white/20 bg-black/30" />
          <span className="text-sm text-gray-300">Feature in Hero rotation</span>
        </label>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            disabled={busy}
            className="px-5 py-3 rounded-2xl bg-white text-black hover:bg-gray-200 transition disabled:opacity-60"
          >
            {busy ? 'Uploading…' : 'Upload'}
          </button>
          <button
            type="button"
            onClick={resetAll}
            className="px-5 py-3 rounded-2xl border border-white/20 hover:bg-white/10 transition"
          >
            Reset
          </button>
        </div>

        {/* Subtle helper text */}
        <p className="text-xs text-gray-400">
          We’ll write the image into <code>public/gallery</code> and merge its metadata into
          <code> metadata.json</code>. If configured, a Git commit/PR is created automatically.
        </p>
      </form>
    </main>
  );
}

