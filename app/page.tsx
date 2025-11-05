// app/page.tsx
import type { Metadata } from 'next'
import Hero from '@/components/Hero'
import Services from '@/components/Services'
import QuoteForm from '@/components/QuoteForm'
import WhyUs from '@/components/WhyUs'
import GalleryGrid from '@/components/GalleryGrid'
import { getLocalImages } from '@/lib/getLocalImages'
import Testimonials from '@/components/Testimonials'
import TopBanner from '@/components/TopBanner'

export const metadata: Metadata = { 
  title: 'Automated Gates & Access Control | Colorado',
  description:
    'Design, installation, and service for automated gates, access control, and electric gate systems across Colorado and neighboring states.',
  keywords: [
    'automated gates Colorado',
    'electric driveway gates',
    'commercial gate installation',
    'access control systems',
    'gate repair Denver',
    'security gates Colorado Springs'
  ],
  openGraph: {
    title: 'Automated Gates & Access Control | Colorado',
    description:
      'Trusted experts in custom automated gates and access control throughout Colorado and neighboring states.',
    url: 'https://pgagates.com/',
    images: [
      {
        url: '/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg',
        width: 1200,
        height: 630,
        alt: 'Automated iron driveway gate installation in Colorado',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Precision Gates & Automation',
    description: 'Automated gate systems for residential, commercial, and industrial properties.',
    images: ['/gallery/ornamental-iron-swing-gate-decorative-columns-genessee.jpg'],
  },
  alternates: { canonical: 'https://pgagates.com/' },
};

export default async function Page(){
  const images = await getLocalImages();
  const site = "https://pgagates.com";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Precision Gates & Automation — Recent Work",
    description:
      "A collection of custom gates, automation, and access control installations across Colorado.",
    author: { "@type": "Organization", name: "Precision Gates & Automation", url: site },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
        <p className="text-gray-300 mt-2 max-w-3xl">
          We craft high-quality, code-compliant gates with expert automation. Clean installs, neat wiring, and responsive support across Colorado.
        </p>
      </section>
      <section id="contact" className="section-tight container grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Request a Quote</h2>
          <p className="text-gray-400 mt-2">
            Prefer to call? <a href="tel:+7209032925" className="underline">(720) 903-2925</a>
          </p>
        </div>
        <QuoteForm />
      </section>
      <section
        id="service-areas"
        className="section-tight container border border-white/10 bg-brand-dark rounded-2xl p-8"
      >
        <h2 className="text-3xl font-semibold text-white">Service Areas</h2>

        <p className="text-gray-300 mt-2 max-w-3xl">
          Precision Gates &amp; Automation proudly serves Colorado and neighboring states.
          We work with residential, commercial, and HOA clients across:
        </p>

        <ul className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-6 text-gray-400">
          <li>Denver Metro</li>
          <li>Colorado Front Range</li>
          <li>Boulder</li>
          <li>Colorado Springs</li>
          <li>Fort Collins</li>
          <li>Golden</li>
          <li>Castle Rock</li>
          <li>Loveland</li>
          <li>Wyoming</li>
          <li>Utah</li>
          <li>Nebraska</li>
          <li>New Mexico</li>
        </ul>

        <p className="text-gray-400 mt-6 max-w-3xl">
          Fully licensed, insured, and equipped for regional work — delivering the same precision, safety, and reliability wherever your project is located.
        </p>
      </section>
    </>
  )
}

