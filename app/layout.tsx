// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/Footer";
import StickyContactBar from "@/components/StickyContactBar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pgagates.com"),
  title: "Precision Gates & Automation | Colorado Gate Experts",
  description:
    "Custom gates, automation systems, and access control across Colorado. Clean installs and rapid repairs by Precision Gates & Automation.",
  openGraph: {
    title: "Precision Gates & Automation | Colorado Gate Experts",
    description: "Custom gates, automation systems, and access control across Colorado.",
    url: "https://pgagates.com",
    siteName: "Precision Gates & Automation",
    images: [
      {
        url: "/gallery/iron-driveway-gate-denver.jpg",
        width: 1200,
        height: 630,
        alt: "Iron driveway gate with keypad in Denver, CO",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precision Gates & Automation",
    description: "Colorado’s trusted experts for custom gates and automation systems.",
    images: ["/gallery/iron-driveway-gate-denver.jpg"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const site = "https://pgagates.com";

  // WebSite + SearchAction JSON-LD
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Precision Gates & Automation",
    url: site,
    potentialAction: {
      "@type": "SearchAction",
      target: `${site}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: {
      "@type": "Organization",
      name: "Precision Gates & Automation",
      logo: { "@type": "ImageObject", url: `${site}/logo.png` },
    },
  };

  // Single LocalBusiness profile (use @id for linking)
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site}#business`,
    name: "Precision Gates & Automation",
    image: [
      `${site}/gallery/iron-driveway-gate-denver.jpg`,
      `${site}/gallery/commercial-slide-gate-warehouse-aurora.jpeg`,
      `${site}/logo.png`,
    ],
    logo: `${site}/logo.png`,
    url: site,
    telephone: "+1-720-903-2925",
    email: "info@pgagates.com",
    description:
      "Precision Gates & Automation designs, fabricates, and installs custom gates and automated access systems for residential and commercial clients across Colorado.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Denver",
      addressRegion: "CO",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 39.7392, longitude: -104.9903 },
    areaServed: [
      { "@type": "Place", name: "Denver, CO" },
      { "@type": "Place", name: "Aurora, CO" },
      { "@type": "Place", name: "Littleton, CO" },
      { "@type": "Place", name: "Highlands Ranch, CO" },
      { "@type": "Place", name: "Lakewood, CO" },
      { "@type": "Place", name: "Arvada, CO" },
      { "@type": "Place", name: "Castle Rock, CO" },
      { "@type": "Place", name: "Parker, CO" },
      { "@type": "Place", name: "Boulder, CO" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    review: [
      {
        "@type": "Review",
        author: { "@type": "Person", name: "John D." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "They installed our gate automation system flawlessly — responsive, clean, and professional.",
      },
      {
        "@type": "Review",
        author: { "@type": "Person", name: "Samantha K." },
        reviewRating: { "@type": "Rating", ratingValue: "5" },
        reviewBody:
          "Precision Gates delivered exactly what we wanted for our custom steel gate in Highlands Ranch!",
      },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "27" },
    sameAs: [
      // "https://facebook.com/precisiongates",
      // "https://instagram.com/precisiongates",
      // Add your real Google Business Profile short URL when you have it:
      // "https://g.page/your-gbp-slug"
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gate & Automation Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Gate Fabrication" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gate Automation (swing & slide)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Access Control (keypad, RFID, intercom)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Repairs & Maintenance" } },
      ],
    },
  };

  return (
    <html lang="en">
      <body
        className={`min-h-screen flex flex-col bg-brand-black text-white ${geistSans.variable} ${geistMono.variable}`}
      >
        {/* JSON-LD scripts should be inside <body> */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        <main className="flex-1">{children}</main>
        <StickyContactBar />
        <Footer />
      </body>
    </html>
  );
}