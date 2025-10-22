import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

type MetaEntry = {
  alt: string
  caption?: string
  tags?: string[]
  createdAt?: string
  location?: string
  hero?: boolean
}

/** GitHub API response types (subset) */
type GithubContentGet = { content: string; sha: string }
type GithubPutResponse = {
  content: { path: string; sha: string }
  commit: { sha: string; message: string }
}

function toBase64(buf: ArrayBuffer) {
  return Buffer.from(new Uint8Array(buf)).toString('base64')
}

async function githubRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const repo = process.env.GITHUB_REPO!
  const token = process.env.GITHUB_TOKEN!
  const branch = process.env.GITHUB_BRANCH || 'main'
  const url =
    `https://api.github.com/repos/${repo}/contents/${path}` +
    (init?.method === 'PUT' ? '' : `?ref=${branch}`)

  const res = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`GitHub ${res.status}: ${text}`)
  }
  return (await res.json()) as T
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    const orig = file.name || 'upload.jpg'
    const override = (form.get('filename') as string | null)?.trim() || ''
    const safeName = (override || orig)
      .toLowerCase()
      .replace(/[^\w.-]+/g, '-')
      .replace(/-+/g, '-')

    const meta: MetaEntry = {
      alt: (form.get('alt') as string || '').trim(),
      caption: ((form.get('caption') as string) || '').trim() || undefined,
      tags: ((form.get('tags') as string || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)) || undefined,
      createdAt: (form.get('createdAt') as string) || new Date().toISOString().slice(0, 10),
      location: ((form.get('location') as string) || '').trim() || undefined,
      hero: form.get('hero') === 'on',
    }
    if (!meta.alt) return NextResponse.json({ error: 'Alt text required' }, { status: 400 })

    // 1) commit the image
    const arrayBuf = await file.arrayBuffer()
    const contentB64 = toBase64(arrayBuf)
    const imgPath = `public/gallery/${safeName}`

    let existingSha: string | undefined
    try {
      const exists = await githubRequest<GithubContentGet>(imgPath)
      existingSha = exists.sha
    } catch {
      /* not found — create */
    }

    await githubRequest<GithubPutResponse>(imgPath, {
      method: 'PUT',
      body: JSON.stringify({
        message: `feat(gallery): add ${safeName}`,
        content: contentB64,
        branch: process.env.GITHUB_BRANCH || 'main',
        sha: existingSha,
      }),
    })

    // 2) update metadata.json
    const metaPath = 'public/metadata.json'
    let metaJson: Record<string, MetaEntry> = {}
    let metaSha: string | undefined
    try {
      const current = await githubRequest<GithubContentGet>(metaPath)
      metaSha = current.sha
      const decoded = Buffer.from(current.content, 'base64').toString()
      metaJson = JSON.parse(decoded) as Record<string, MetaEntry>
    } catch {
      // file doesn’t exist yet — create fresh
      metaJson = {}
    }

    metaJson[safeName] = meta

    await githubRequest<GithubPutResponse>(metaPath, {
      method: 'PUT',
      body: JSON.stringify({
        message: `chore(metadata): add ${safeName}`,
        content: Buffer.from(JSON.stringify(metaJson, null, 2)).toString('base64'),
        branch: process.env.GITHUB_BRANCH || 'main',
        sha: metaSha,
      }),
    })

    return NextResponse.json({ ok: true, path: `/gallery/${safeName}` })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Upload failed'
    console.error(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

