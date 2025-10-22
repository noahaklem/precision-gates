import { NextResponse } from 'next/server'

export const runtime = 'nodejs' // required for Buffer & fetch to github

type MetaEntry = {
  alt: string
  caption?: string
  tags?: string[]
  createdAt?: string
  location?: string
  hero?: boolean
}

function toBase64(buf: ArrayBuffer) {
  return Buffer.from(new Uint8Array(buf)).toString('base64')
}

async function githubRequest(path: string, init?: RequestInit) {
  const repo = process.env.GITHUB_REPO!
  const token = process.env.GITHUB_TOKEN!
  const branch = process.env.GITHUB_BRANCH || 'main'
  const url = `https://api.github.com/repos/${repo}/contents/${path}` +
              (init?.method === 'PUT' ? '' : `?ref=${branch}`)

  const res = await fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
      ...init?.headers
    }
  })
  if (!res.ok) {
    const text = await res.text().catch(()=>'')
    throw new Error(`GitHub ${res.status}: ${text}`)
  }
  return res.json()
}

export async function POST(req: Request) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

    // normalize file name
    const orig = (file as File).name || 'upload.jpg'
    const override = (form.get('filename') as string | null)?.trim()
    const safeName = (override || orig)
      .toLowerCase()
      .replace(/[^\w.-]+/g, '-') // slugish
      .replace(/-+/g, '-')

    // collect metadata
    const meta: MetaEntry = {
      alt: (form.get('alt') as string || '').trim(),
      caption: (form.get('caption') as string || '').trim() || undefined,
      tags: ((form.get('tags') as string || '')
        .split(',')
        .map(t => t.trim())
        .filter(Boolean)) || undefined,
      createdAt: (form.get('createdAt') as string) || new Date().toISOString().slice(0,10),
      location: (form.get('location') as string || '').trim() || undefined,
      hero: form.get('hero') === 'on',
    }
    if (!meta.alt) return NextResponse.json({ error: 'Alt text required' }, { status: 400 })

    const repo = process.env.GITHUB_REPO!
    const branch = process.env.GITHUB_BRANCH || 'main'

    // 1) commit the image
    const arrayBuf = await file.arrayBuffer()
    const contentB64 = toBase64(arrayBuf)
    const imgPath = `public/gallery/${safeName}`

    // If file already exists, fetch SHA to update (we usually prefer unique names though)
    let existingSha: string | undefined
    try {
      const exists = await githubRequest(imgPath) as any
      existingSha = exists.sha
    } catch { /* not found is fine; we'll create */ }

    await githubRequest(imgPath, {
      method: 'PUT',
      body: JSON.stringify({
        message: `feat(gallery): add ${safeName}`,
        content: contentB64,
        branch,
        sha: existingSha
      })
    })

    // 2) update metadata.json
    const metaPath = 'public/metadata.json'
    const current = await githubRequest(metaPath).catch(() => null) as any
    let metaJson: Record<string, any> = {}
    let metaSha: string | undefined
    if (current?.content) {
      metaSha = current.sha
      const decoded = Buffer.from(current.content, 'base64').toString()
      try { metaJson = JSON.parse(decoded) } catch { metaJson = {} }
    }

    metaJson[safeName] = {
      alt: meta.alt,
      caption: meta.caption,
      tags: meta.tags,
      createdAt: meta.createdAt,
      location: meta.location,
      hero: meta.hero
    }

    await githubRequest(metaPath, {
      method: 'PUT',
      body: JSON.stringify({
        message: `chore(metadata): add ${safeName}`,
        content: Buffer.from(JSON.stringify(metaJson, null, 2)).toString('base64'),
        branch,
        sha: metaSha
      })
    })

    return NextResponse.json({ ok: true, path: `/gallery/${safeName}` })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }
}
