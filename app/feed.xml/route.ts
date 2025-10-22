import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type MetaEntry = {
  alt: string
  caption?: string
  tags?: string[]
  createdAt?: string
  location?: string
}

export async function GET() {
  const site = 'https://pgagates.com'
  const galleryDir = path.join(process.cwd(), 'public', 'gallery')
  const metaPath = path.join(process.cwd(), 'public', 'metadata.json')

  const files = fs.existsSync(galleryDir)
    ? await fs.promises.readdir(galleryDir)
    : []

  const meta: Record<string, MetaEntry> = fs.existsSync(metaPath)
    ? JSON.parse(await fs.promises.readFile(metaPath, 'utf8')) as Record<string, MetaEntry>
    : {}

  const items = files
    .filter(f => /\.(jpe?g|png|webp|jpeg)$/i.test(f))
    .map((f) => {
      const m = meta[f]
      const title = m?.caption || m?.alt || f
      const date = m?.createdAt || new Date().toISOString().slice(0, 10)
      const link = `${site}/gallery/${encodeURIComponent(f)}`
      return { title, date, link, desc: m?.alt ?? '' }
    })

  const rss =
`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
<title>Precision Gates & Automation — Recent Work</title>
<link>${site}</link>
<description>New gallery items and installations</description>
${items.map(it => `
  <item>
    <title><![CDATA[${it.title}]]></title>
    <link>${it.link}</link>
    <guid>${it.link}</guid>
    <pubDate>${new Date(it.date).toUTCString()}</pubDate>
    <description><![CDATA[${it.desc}]]></description>
  </item>`).join('')}
</channel>
</rss>`

  return new NextResponse(rss, { headers: { 'Content-Type': 'application/xml' } })
}

