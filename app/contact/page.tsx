// app/contact/page.tsx
import type { Metadata } from "next";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "Contact & Quote Request | Precision Gates & Automation",
  description:
    "Request a quote for automated gates, access control, or repairs. Serving Colorado and neighboring states.",
  alternates: { canonical: "https://pgagates.com/contact" },
  openGraph: {
    title: "Request a Quote",
    description: "Tell us about your project—fast response, same-day service available.",
    url: "https://pgagates.com/contact",
  },
};

export default function ContactPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    mainEntity: { "@type": "LocalBusiness", "@id": "https://pgagates.com#business" },
  };

  return (
    <section className="container section grid gap-8 md:grid-cols-2">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div>
        <h1 className="text-4xl font-bold">Request a Quote</h1>
        <p className="mt-4 text-gray-300">
          Prefer to call? <a className="underline" href="tel:+17209032925">(720) 903-2925</a>
        </p>
        <p className="mt-2 text-gray-400">Email: <a className="underline" href="mailto:info@pgagates.com">info@pgagates.com</a></p>
      </div>
      <QuoteForm />
    </section>
  );
}
