// app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gate Services: Automated Gates, Access Control, Repairs | Precision Gates & Automation",
  description:
    "Design, fabrication, and installation of automated swing & slide gates, access control (keypad, RFID, intercom), and rapid repairs across Colorado and neighboring states.",
  keywords: [
    "automated gates",
    "electric gates",
    "gate installation",
    "access control systems",
    "gate repair",
    "Colorado"
  ],
  alternates: { canonical: "https://pgagates.com/services" },
  openGraph: {
    title: "Automated Gate & Access Control Services",
    description:
      "Custom swing/slide gates, access control, and repairs for residential, commercial, and industrial properties.",
    url: "https://pgagates.com/services",
    type: "website",
    images: [{ url: "/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg", width: 1200, height: 630 }],
  },
};

export default function ServicesPage() {
  const site = "https://pgagates.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${site}/services#overview`,
    name: "Automated Gate & Access-Control Services",
    areaServed: ["Colorado","Wyoming","Utah","Nebraska","New Mexico"],
    provider: { "@type": "LocalBusiness", "@id": `${site}#business` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gate & Automation",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Swing Gates" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Slide Gates (cantilever/enclosed track)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Access Control (keypad, RFID, intercom, CCTV)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Repairs & Maintenance" } },
      ],
    },
  };

  return (
    <section className="container section">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="text-4xl font-bold">Gate Services</h1>
      <p className="mt-4 text-gray-300">
        We design, fabricate, and automate swing and slide gates, integrate modern access control, and provide fast repairs.
      </p>

      <div id="residential" className="mt-10">
        <h2 className="text-2xl font-semibold">Residential Gates</h2>
        <p className="mt-2 text-gray-400">Ornamental iron, aluminum, or wood—engineered for safety and reliability.</p>
      </div>

      <div id="commercial" className="mt-10">
        <h2 className="text-2xl font-semibold">Commercial & Industrial</h2>
        <p className="mt-2 text-gray-400">HySecurity, LiftMaster, and heavy-duty operators for logistics yards and facilities.</p>
      </div>

      <div id="access-control" className="mt-10">
        <h2 className="text-2xl font-semibold">Access Control</h2>
        <p className="mt-2 text-gray-400">Keypads, RFID, intercoms, vehicle loops, photo eyes, and camera integration.</p>
      </div>

      <div id="repairs" className="mt-10">
        <h2 className="text-2xl font-semibold">Repairs & Maintenance</h2>
        <p className="mt-2 text-gray-400">Same-day service available. Preventative maintenance plans on request.</p>
      </div>

      <div className="mt-10">
        <Link href="/contact" className="underline">Request a quote</Link> •{" "}
        <Link href="/gallery" className="underline">See recent projects</Link>
      </div>
    </section>
  );
}
