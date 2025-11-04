// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";
import StickyContactBar from "@/components/StickyContactBar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pgagates.com"),
  title: {
    default: "Precision Gates & Automation",
    template: "%s | Precision Gates & Automation",
  },
  description:
    "Custom automated gates, access control, and electric gate systems across Colorado and neighboring states. Clean installs and rapid repairs.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Precision Gates & Automation | Colorado Gate Experts",
    description:
      "Custom gates, automation, and access control across Colorado and nearby states. Residential, commercial, and industrial.",
    url: "https://pgagates.com",
    siteName: "Precision Gates & Automation",
    images: [
      {
        // use one of your current filenames
        url: "/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg",
        width: 1200,
        height: 630,
        alt: "Automated ornamental iron gate installation in Colorado",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Precision Gates & Automation",
    description:
      "Automated gate systems and access control for homes, HOAs, and businesses across Colorado.",
    images: ["/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg"],
  },
  alternates: {
    canonical: "https://pgagates.com/",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const site = "https://pgagates.com";

  // WebSite JSON-LD
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

  // LocalBusiness JSON-LD
  const businessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site}#business`,
    name: "Precision Gates & Automation",
    image: [
      `${site}/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg`,
      `${site}/gallery/industrial-aluminum-slide-privacy-screen-hydraulic-denver.jpg`,
      `${site}/logo.png`,
    ],
    logo: `${site}/logo.png`,
    url: site,
    telephone: "+1-720-903-2925",
    email: "info@pgagates.com",
    description:
      "Design, fabrication, installation, and service for automated gates and access control across Colorado and neighboring states.",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Denver",
      addressRegion: "CO",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 39.7392, longitude: -104.9903 },
    areaServed: [
      { "@type": "Place", name: "Colorado" },
      { "@type": "Place", name: "Wyoming" },
      { "@type": "Place", name: "Utah" },
      { "@type": "Place", name: "Nebraska" },
      { "@type": "Place", name: "New Mexico" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    aggregateRating: { "@type": "AggregateRating", ratingValue: "5.0", reviewCount: "27" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Gate & Automation Services",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Custom Gate Fabrication" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Gate Automation (swing & slide)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Access Control (keypad, intercom, RFID)" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Repairs & Maintenance" } },
      ],
    },
  };

  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col bg-brand-black text-white ${geistSans.variable} ${geistMono.variable}`}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(businessJsonLd) }} />
        <main className="flex-1">{children}</main>
        <StickyContactBar />
        <Footer />
      </body>
    </html>
  );
}
