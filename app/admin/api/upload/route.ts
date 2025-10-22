// app/admin/api/upload/route.ts
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type MetaEntry = {
  alt: string;
  caption?: string;
  tags?: string[];
  createdAt?: string;
  location?: string;
  featured?: boolean;
};

type GithubContentGet = { content: string; sha: string };
type GithubPutResponse = {
  content: { path: string; sha: string };
  commit: { sha: string; message: string };
};

function toBase64(buf: ArrayBuffer) {
  return Buffer.from(new Uint8Array(buf)).toString('base64');
}

function sanitizeName(s: string) {
  return s.toLowerCase().replace(/[^\w.-]+/g, '-').replace(/-+/g, '-');
}

function extFromMime(mime: string): string | null {
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  return null;
}

async function githubRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const repo = process.env.GITHUB_REPO!;       // e.g. "owner/repo"
  const token = process.env.GITHUB_TOKEN!;
  const branch = process.env.GITHUB_BRANCH || 'main';

  const url =
    `https://api.github.com/repos/${repo}/contents/${path}` +
    (init?.method === 'PUT' ? '' : `?ref=${branch}`);

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    // Force GitHub API to use the intended branch for PUT
    // (we also pass branch in the JSON body)
  });

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`GitHub ${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

export async function POST(req: Request) {
  try {
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;           // "owner/repo"
    const branch = process.env.GITHUB_BRANCH || 'main';
    if (!repo || !token) {
      throw new Error(
        'Missing env: GITHUB_REPO and/or GITHUB_TOKEN. Set them in .env.local and restart dev server.'
      );
    }

    const form = await req.formData();
    const file = form.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 });

    // Basic file type guard
    const extByMime = extFromMime(file.type);
    if (!extByMime) {
      return NextResponse.json({ error: 'Unsupported image type (use JPG/PNG/WebP)' }, { status: 400 });
    }

    const origName = file.name || `upload${extByMime}`;
    const overrideRaw = (form.get('filename') as string | null)?.trim() || '';

    // Decide final filename + extension
    const overrideHasExt = /\.[a-z0-9]+$/i.test(overrideRaw);
    const base = sanitizeName(overrideHasExt ? overrideRaw : (overrideRaw || origName));
    const finalExt = overrideHasExt ? '' : (/\.[a-z0-9]+$/i.test(base) ? '' : extByMime);
    const safeName = `${base}${finalExt}`;
    const imgPath = `public/gallery/${safeName}`;

    // Build metadata from form
    const meta: MetaEntry = {
      alt: (form.get('alt') as string || '').trim(),
      caption: ((form.get('caption') as string) || '').trim() || undefined,
      tags: ((form.get('tags') as string || '')
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)) || undefined,
      createdAt: (form.get('createdAt') as string) || new Date().toISOString().slice(0, 10),
      location: ((form.get('location') as string) || '').trim() || undefined,
      featured: form.get('hero') === 'on',
    };
    if (!meta.alt) {
      return NextResponse.json({ error: 'Alt text required' }, { status: 400 });
    }

    // 1) PUT image (create or update)
    const arrayBuf = await file.arrayBuffer();
    const contentB64 = toBase64(arrayBuf);

    let existingSha: string | undefined;
    try {
      const exists = await githubRequest<GithubContentGet>(imgPath);
      existingSha = exists.sha;
    } catch {
      // 404 -> will create the file
    }

    await githubRequest<GithubPutResponse>(imgPath, {
      method: 'PUT',
      body: JSON.stringify({
        message: `feat(gallery): add ${safeName}`,
        content: contentB64,
        branch,
        sha: existingSha,
      }),
    });

    // 2) Read + update metadata.json
    const metaPath = 'public/metadata.json';
    let metaJson: Record<string, MetaEntry> = {};
    let metaSha: string | undefined;

    try {
      const current = await githubRequest<GithubContentGet>(metaPath);
      metaSha = current.sha;
      const decoded = Buffer.from(current.content, 'base64').toString();
      metaJson = JSON.parse(decoded) as Record<string, MetaEntry>;
    } catch {
      // not found -> create fresh
      metaJson = {};
    }

    metaJson[safeName] = meta;

    const metaPut = await githubRequest<GithubPutResponse>(metaPath, {
      method: 'PUT',
      body: JSON.stringify({
        message: `chore(metadata): add ${safeName}`,
        content: Buffer.from(JSON.stringify(metaJson, null, 2)).toString('base64'),
        branch,
        sha: metaSha,
      }),
    });

    // Build handy links for your UI
    const [owner, repoName] = repo.split('/');
    const commitSha = metaPut.commit?.sha;
    const commitUrl = commitSha
      ? `https://github.com/${owner}/${repoName}/commit/${commitSha}`
      : undefined;

    return NextResponse.json({
      ok: true,
      path: `/gallery/${safeName}`,            // public site path
      commitUrl,
      message: 'Added to gallery and metadata.json',
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    console.error('[admin/upload] error:', message);
    return NextResponse.json({ error: process.env.NODE_ENV === 'production' ? 'Upload failed' : message }, { status: 500 });
  }
}


