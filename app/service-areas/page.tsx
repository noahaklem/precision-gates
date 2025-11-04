// app/service-areas/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Service Areas | Precision Gates & Automation",
  description:
    "We serve Colorado’s Front Range and neighboring states: Wyoming, Utah, Nebraska, and New Mexico.",
  alternates: { canonical: "https://pgagates.com/service-areas" },
  openGraph: {
    title: "Where We Work",
    description: "Colorado & neighboring states for gates, automation, and access control.",
    url: "https://pgagates.com/service-areas",
  },
};

export default function ServiceAreasPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Service Areas",
    about: { "@type": "LocalBusiness", "@id": "https://pgagates.com#business" },
    areaServed: ["Denver Metro","Colorado Front Range","Wyoming","Utah","Nebraska","New Mexico"],
  };

  return (
    <section className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-bold">Service Areas</h1>
      <p className="mt-4 text-gray-300">
        Colorado Front Range, Denver Metro, Boulder, Colorado Springs, Fort Collins, Golden, Castle Rock, Loveland —
        plus Wyoming, Utah, Nebraska, and New Mexico.
      </p>
    </section>
  );
}
