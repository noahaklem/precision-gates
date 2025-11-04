// app/about/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Precision Gates & Automation",
  description:
    "Colorado-based team specializing in custom gates, automation, and access control with clean installs and fast service.",
  alternates: { canonical: "https://pgagates.com/about" },
  openGraph: {
    title: "About Us — Precision Gates & Automation",
    description: "Trusted Colorado gate specialists for residential and commercial projects.",
    url: "https://pgagates.com/about",
    images: [{ url: "/gallery/ornamental-iron-arch-top-swing-hysecurity-swing-riser-castle-pines.jpg", width: 1200, height: 630 }],
  },
};

export default function AboutPage() {
  const site = "https://pgagates.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: { "@type": "LocalBusiness", "@id": `${site}#business` },
  };

  return (
    <section className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-bold">About Us</h1>
      <p className="mt-4 text-gray-300">
        We’re a Colorado shop focused on safe, code-compliant gates, neat wiring, and responsive support.
        Our work spans homes, HOAs, self-storage, logistics yards, and industrial facilities.
      </p>
      <div className="mt-8">
        <Link href="/services" className="underline">Explore our services</Link>
      </div>
    </section>
  );
}
