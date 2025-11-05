// app/reviews/page.tsx
import type { Metadata } from "next";
import reviews from "./reviews.json";

type Review = {
  author: string;
  date: string;     // ISO or yyyy-mm-dd
  body: string;
  source?: string;  // "Google", "Email", etc.
};

export const metadata: Metadata = {
  title: "Customer Reviews | Precision Gates & Automation",
  description:
    "See what our customers say about Precision Gates & Automation. Trusted experts for automated gates, access control, and clean installations across Colorado.",
  openGraph: {
    title: "Customer Reviews | Precision Gates & Automation",
    description:
      "Customer testimonials and verified reviews for Precision Gates & Automation in Colorado.",
    url: "https://pgagates.com/reviews",
    siteName: "Precision Gates & Automation",
    images: [
      {
        url: "/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg",
        width: 1200,
        height: 630,
        alt: "Precision Gates & Automation customer reviews",
      },
    ],
  },
  alternates: { canonical: "https://pgagates.com/reviews" },
};

function formatDate(d?: string) {
  if (!d) return "";
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function ReviewsPage() {
  const site = "https://pgagates.com";
  const list = reviews as Review[];

  // Pick featured review (prefer David E., else first)
  const featured =
    list.find((r) => r.author.toLowerCase().startsWith("david e")) ?? list[0];

  const rest = list.filter((r) => r !== featured);

  // JSON-LD: tie reviews to the existing LocalBusiness via @id
  const reviewsJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site}#business`,
    name: "Precision Gates & Automation",
    url: site,
    review: list.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      datePublished: r.date,
      reviewBody: r.body,
    })),
  };

  const reviewLink = "https://g.page/r/CUeakO8C5B1uEBM/review";

  return (
    <main className="section container text-gray-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsJsonLd) }}
      />

      <h1 className="text-4xl font-semibold text-white mb-6">Customer Reviews</h1>
      <p className="text-gray-400 max-w-3xl mb-10">
        We’re proud of our reputation for precision, safety, and professional installs across Colorado.
        Read what our clients have to say — and if we’ve worked together, please leave a quick review.
      </p>

      {/* Hero / Featured Review */}
      {featured && (
        <section
          aria-label="Featured review"
          className="relative mb-10 rounded-3xl border border-white/10 bg-brand-dark p-8 md:p-10 shadow-sm"
        >
          <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10" />
          <div className="absolute -inset-px rounded-3xl bg-[radial-gradient(1200px_300px_at_50%_-10%,rgba(255,255,255,0.10),transparent)]" />
          <div className="relative">
            <div className="mb-4 inline-flex items-center gap-3">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                className="opacity-70"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M7.17 6A5.17 5.17 0 0 0 2 11.17V20h8v-8H6.83A3.17 3.17 0 0 1 10 8.83V6zM20 6a5.17 5.17 0 0 0-5.17 5.17V20h8v-8h-3.17A3.17 3.17 0 0 1 22 8.83V6z"
                />
              </svg>
              <span className="text-sm uppercase tracking-wide text-gray-400">Featured Review</span>
            </div>
            <blockquote>
              <p className="text-2xl md:text-3xl leading-snug text-white italic">
                “{featured.body}”
              </p>
              <footer className="mt-5 text-sm text-gray-400">
                — {featured.author}
                {featured.date && <> · <time dateTime={featured.date}>{formatDate(featured.date)}</time></>}
                {featured.source ? <> · <span className="opacity-70">{featured.source}</span></> : null}
              </footer>
            </blockquote>
          </div>
        </section>
      )}

      {/* Remaining Reviews */}
      {rest.length > 0 && (
        <div className="grid md:grid-cols-2 gap-6">
          {rest.map((r, i) => (
            <blockquote
              key={`${r.author}-${i}`}
              className="rounded-2xl bg-brand-dark border border-white/10 p-6 shadow-sm"
            >
              <p className="text-lg text-white italic">“{r.body}”</p>
              <footer className="mt-4 text-sm text-gray-400">
                — {r.author}
                {r.date && <> · <time dateTime={r.date}>{formatDate(r.date)}</time></>}
                {/* {r.source ? <> · <span className="opacity-70">{r.source}</span></> : null} */}
              </footer>
            </blockquote>
          ))}
        </div>
      )}

      {/* Google Review CTA */}
      <div className="mt-12 text-center">
        <a
          href={reviewLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-black font-medium hover:bg-gray-200 transition"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="currentColor"
              d="M12 2a10 10 0 1 0 .001 20.001A10 10 0 0 0 12 2m4.93 10.5h-4.43v2.7h2.54a2.17 2.17 0 1 1-2.06 3h-2.32a5.5 5.5 0 1 0 0-11h2.32a2.17 2.17 0 1 1 2.06 3H12.5v2.3h4.43z"
            />
          </svg>
          Leave a Google Review
        </a>
        <p className="text-xs text-gray-500 mt-3">
          Reviews help other homeowners and facility managers find us. Thank you!
        </p>
      </div>
    </main>
  );
}


