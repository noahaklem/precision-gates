// app/feed.xml/route.ts
import fs from "fs";
import path from "path";

const SITE = "https://pgagates.com";
const META_PATH = path.join(process.cwd(), "public", "gallery", "metadata.json");

type Item = {
  key: string; // filename
  alt: string;
  caption?: string;
  location?: string;
  createdAt?: string; // ISO date (YYYY-MM-DD)
};

export async function GET() {
  // Load metadata.json
  let meta: Record<string, any> = {};
  try {
    const raw = await fs.promises.readFile(META_PATH, "utf8");
    meta = JSON.parse(raw);
  } catch {
    // empty feed if no metadata found
    meta = {};
  }

  // Build items array
  const items: Item[] = Object.entries(meta).map(([filename, m]: any) => ({
    key: filename,
    alt: m.alt || filename,
    caption: m.caption,
    location: m.location,
    createdAt: m.createdAt,
  }));

  // Sort newest first using createdAt (fallback to filename)
  items.sort((a, b) => {
    const da = Date.parse(a.createdAt || "") || 0;
    const db = Date.parse(b.createdAt || "") || 0;
    return db - da;
  });

  const updated = items[0]?.createdAt || new Date().toISOString();

  // Build RSS XML
  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0">` +
    `<channel>` +
    `<title>Precision Gates & Automation — Recent Projects</title>` +
    `<link>${SITE}</link>` +
    `<description>New gate and access control installations across Colorado.</description>` +
    `<language>en-us</language>` +
    `<lastBuildDate>${new Date(updated).toUTCString()}</lastBuildDate>` +
    items
      .slice(0, 50) // cap feed length
      .map((item) => {
        const url = `${SITE}/gallery/${encodeURIComponent(item.key)}`;
        const title = item.alt;
        const desc = `${item.caption || item.alt}${item.location ? " — " + item.location : ""}`;
        const pubDate = item.createdAt
          ? new Date(item.createdAt).toUTCString()
          : new Date().toUTCString();

        // Use the public image URL as the guid/link
        return (
          `<item>` +
          `<title><![CDATA[${title}]]></title>` +
          `<link>${url}</link>` +
          `<guid isPermaLink="false">${url}</guid>` +
          `<pubDate>${pubDate}</pubDate>` +
          `<description><![CDATA[${desc}]]></description>` +
          `</item>`
        );
      })
      .join("") +
    `</channel></rss>`;

  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=UTF-8" } });
}
