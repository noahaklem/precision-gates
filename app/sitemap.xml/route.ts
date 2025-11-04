// app/sitemap.xml/route.ts
import fs from "fs";
import path from "path";

export async function GET() {
  const site = "https://pgagates.com";
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  const files = fs.existsSync(galleryDir)
    ? await fs.promises.readdir(galleryDir)
    : [];

  const images = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));

  const now = new Date().toISOString();

  // Main site sections
  const baseUrls = [
    { loc: `${site}/`, priority: "1.0" },
    { loc: `${site}/#services`, priority: "0.9" },
    { loc: `${site}/#gallery`, priority: "0.8" },
    { loc: `${site}/#about`, priority: "0.7" },
    { loc: `${site}/#contact`, priority: "0.7" },
  ];

  // Generate image URLs for sitemap
  const galleryUrls = images.map((f) => ({
    loc: `${site}/gallery/${encodeURIComponent(f)}`,
    priority: "0.5",
  }));

  const urls = [...baseUrls, ...galleryUrls];

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
    urls
      .map(
        (u) =>
          `<url>
            <loc>${u.loc}</loc>
            <lastmod>${now}</lastmod>
            <priority>${u.priority}</priority>
          </url>`
      )
      .join("") +
    `</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

