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
};

export async function getLocalImages(): Promise<GalleryImage[]> {
  let files: string[] = [];
  try {
    files = await fs.promises.readdir(GALLERY_DIR);
  } catch {
    return [];
  }

  // Load metadata.json if present
  let meta: Record<string, Partial<GalleryImage>> = {};
  try {
    const raw = await fs.promises.readFile(META_PATH, "utf8");
    meta = JSON.parse(raw);
  } catch { /* optional */ }

  const images = files
    .filter((f) => ALLOWED.has(path.extname(f).toLowerCase()))
    .sort() // rename files to control order; change to .sort().reverse() if needed
    .map((filename) => {
      const m = meta[filename] || {};
      const fallbackAlt = filename
        .replace(/\.[^.]+$/, "")
        .replace(/[-_]/g, " ")
        .trim();
      return {
        src: `/gallery/${filename}`,
        alt: m.alt || fallbackAlt,
        caption: m.caption,
        tags: m.tags,
        createdAt: m.createdAt,
        location: m.location
      } as GalleryImage;
    });

  return images;
}

