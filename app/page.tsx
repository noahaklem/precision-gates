import Hero from '@/components/Hero'
import Services from '@/components/Services'
import QuoteForm from '@/components/QuoteForm'
import WhyUs from '@/components/WhyUs'
import GalleryGrid from '@/components/GalleryGrid'
import { getLocalImages } from '@/lib/getLocalImages'
import Testimonials from '@/components/Testimonials'
import TopBanner from '@/components/TopBanner'

// Fetch from Cloudinary if you want to use external API
// async function getImages() {
//   const h = await headers();
//   const host = h.get("host");
//   const protocol = process.env.VERCEL ? "https" : "http";

//   const res = await fetch(`${protocol}://${host}/api/gallery`, { cache: "no-store" });
//   if (!res.ok) throw new Error("Failed to load gallery");
//   return res.json();
// }

export default async function Page(){
  const images = await getLocalImages();
  const site = "https://pgagates.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Precision Gates & Automation — Recent Work",
    description:
      "A collection of custom gates, automation, and access control installations by Precision Gates & Automation across Colorado.",
    author: {
      "@type": "Organization",
      name: "Precision Gates & Automation",
      url: site
    },
    image: images.map((img) => ({
      "@type": "ImageObject",
      contentUrl: site + img.src,
      caption: img.caption || img.alt,
      description: img.alt,
      locationCreated: img.location
    }))
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopBanner />
      <Hero />
      <Services />
      <WhyUs />
      <section id="gallery" className="section container">
        <h2 className="text-3xl font-semibold">Recent Work</h2>
        <div className="mt-6 grid gap-6">
          <GalleryGrid images={images} initial={9} />
        </div>
      </section>
      <Testimonials />
      <section id="about" className="section container">
        <h2 className="text-3xl font-semibold">About Precision Gates</h2>
        <p className="text-gray-300 mt-2 max-w-3xl">We craft high-quality, code-compliant gates with expert automation. Clean installs, neat wiring, and responsive support across Colorado.</p>
      </section>
      <section id="contact" className="section-tight container grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Request a Quote</h2>
          <p className="text-gray-400 mt-2">Prefer to call? <a href="tel:+7209032925" className="underline">(720) 903-2925</a></p>
        </div>
        <QuoteForm />
      </section>
      <section id="service-areas" className="section-tight container text-gray-700 border border-black/10">
        <h2 className="text-3xl font-semibold">Service Areas</h2>
        <p className="text-gray-400 mt-2 max-w-3xl">
          We proudly serve homeowners, HOAs, and businesses across Colorado.
        </p>
        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-gray-500">
          <li>Denver</li>
          <li>Aurora</li>
          <li>Littleton</li>
          <li>Highlands Ranch</li>
          <li>Lakewood</li>
          <li>Arvada</li>
          <li>Westminster</li>
          <li>Parker</li>
          <li>Castle Rock</li>
          <li>Boulder</li>
          <li>Commerce City</li>
          <li>Englewood</li>
        </ul>
      </section>
    </>
  )
}


