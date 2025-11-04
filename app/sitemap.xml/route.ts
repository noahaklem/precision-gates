// app/sitemap.xml/route.ts
import fs from "fs";
import path from "path";

export async function GET() {
  const site = "https://pgagates.com";
  const galleryDir = path.join(process.cwd(), "public", "gallery");

  const files = fs.existsSync(galleryDir)
    ? await fs.promises.readdir(galleryDir)
    : [];

  // only image files
  const images = files.filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  const now = new Date().toISOString();

  // Primary crawlable routes (no hash anchors)
  const pageUrls = [
    { loc: `${site}/`, priority: "1.0", lastmod: now },
    { loc: `${site}/services`, priority: "0.9", lastmod: now },
    { loc: `${site}/gallery`, priority: "0.85", lastmod: now },
    { loc: `${site}/about`, priority: "0.7", lastmod: now },
    { loc: `${site}/contact`, priority: "0.7", lastmod: now },
    { loc: `${site}/service-areas`, priority: "0.7", lastmod: now },
  ];

  // Build <image:image> tags once so we can include them under
  // the homepage and the /gallery listing page.
  const imageTags = images
    .map((f) => {
      const loc = `${site}/gallery/${encodeURIComponent(f)}`;
      return `<image:image><image:loc>${loc}</image:loc></image:image>`;
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
      `xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">` +
      pageUrls
        .map((u) => {
          // Attach images only to home and gallery pages (discovery + size control)
          const withImages =
            u.loc === `${site}/` || u.loc === `${site}/gallery` ? imageTags : "";
          return (
            `<url>` +
              `<loc>${u.loc}</loc>` +
              `<lastmod>${u.lastmod}</lastmod>` +
              `<priority>${u.priority}</priority>` +
              withImages +
            `</url>`
          );
        })
        .join("") +
    `</urlset>`;

  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}


