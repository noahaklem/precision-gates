// app/gallery/page.tsx
import type { Metadata } from "next";
import { getLocalImages } from "@/lib/getLocalImages";
import GalleryGrid from "@/components/GalleryGrid";

export const metadata: Metadata = {
  title: "Project Gallery | Precision Gates & Automation",
  description:
    "Recent installations of automated gates and access control systems across Colorado—residential, commercial, and industrial.",
  alternates: { canonical: "https://pgagates.com/gallery" },
  openGraph: {
    title: "Project Gallery",
    description: "See automated gate projects and access-control installs.",
    url: "https://pgagates.com/gallery",
    images: [{ url: "/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg", width: 1200, height: 630 }],
  },
};

export default async function GalleryPage() {
  const images = await getLocalImages();
  const site = "https://pgagates.com";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Project Gallery",
    mainEntity: {
      "@type": "ImageGallery",
      name: "Precision Gates & Automation — Projects",
      image: images.map(img => ({
        "@type": "ImageObject",
        contentUrl: site + img.src,
        caption: img.caption || img.alt,
        description: img.alt,
      })),
    },
  };

  return (
    <section className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-bold">Project Gallery</h1>
      <p className="mt-4 text-gray-300">A sampling of gates and automation work delivered across Colorado.</p>
      <div className="mt-6 grid gap-6">
        <GalleryGrid images={images} initial={18} />
      </div>
    </section>
  );
}
