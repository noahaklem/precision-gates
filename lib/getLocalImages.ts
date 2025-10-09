// lib/getLocalImages.ts
import fs from "fs";
import path from "path";

const GALLERY_DIR = path.join(process.cwd(), "public", "gallery");
const META_PATH = path.join(GALLERY_DIR, "metadata.json");
const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp"]);

export type GalleryImage = {
  src: string;
  alt: string;
  caption?: string;
  tags?: string[];
  createdAt?: string;
  location?: string;
  featured?: boolean;
};

export async function getLocalImages(): Promise<GalleryImage[]> {
  let files: string[] = [];
  try {
    files = await fs.promises.readdir(GALLERY_DIR);
  } catch {
    return [];
  }

  let meta: Record<string, Partial<GalleryImage>> = {};
  try {
    const raw = await fs.promises.readFile(META_PATH, "utf8");
    meta = JSON.parse(raw);
  } catch { /* optional */ }

  const images = files
    .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
    .sort()
    .map((filename) => {
      const m = meta[filename] || {};
      const fallbackAlt = filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").trim();
      return {
        src: `/gallery/${filename}`,
        alt: m.alt || fallbackAlt,
        caption: m.caption,
        tags: m.tags,
        createdAt: m.createdAt,
        location: m.location,
        featured: m.featured === true
      } as GalleryImage;
    });

  return images;
}

// Optional convenience helper for hero picks
export async function getHeroCandidates(): Promise<GalleryImage[]> {
  const all = await getLocalImages();
  const featured = all.filter((i) => i.featured);
  return featured.length ? featured : all; // fallback if none flagged yet
}


