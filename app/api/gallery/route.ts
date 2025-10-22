import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type Meta = {
  alt: string
  caption?: string
  tags?: string[]
  createdAt?: string
  location?: string
  hero?: boolean
}

export async function GET() {
  const galleryDir = path.join(process.cwd(), 'public', 'gallery')
  const metaPath = path.join(process.cwd(), 'public', 'metadata.json')

  const files = fs.existsSync(galleryDir)
    ? await fs.promises.readdir(galleryDir)
    : []

  const meta: Record<string, Meta> = fs.existsSync(metaPath)
    ? JSON.parse(await fs.promises.readFile(metaPath, 'utf8')) as Record<string, Meta>
    : {}

  const images = files
    .filter(f => /\.(jpe?g|png|webp|jpeg)$/i.test(f))
    .map(f => ({
      src: `/gallery/${encodeURIComponent(f)}`,
      alt: meta[f]?.alt ?? '',
      caption: meta[f]?.caption,
      location: meta[f]?.location,
    }))

  return NextResponse.json(images)
}


