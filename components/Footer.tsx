// components/Footer.tsx
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="relative !bg-brand-black !text-white border-t border-white/10
                 before:content-[''] before:absolute before:inset-0 before:-z-10
                 before:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_1px)]
                 before:bg-[length:24px_24px]"
    >
      <div className="container py-12 grid gap-10 md:grid-cols-4 text-sm text-gray-300">
        {/* Brand */}
        <div>
          <h3 className="font-semibold text-white"><Link href="/" className="hover:text-white">Precision Gates &amp; Automation</Link></h3>
          <p className="mt-2 text-gray-400">
            Automated gates, access control, and rapid repairs across Colorado &amp; neighboring states.
          </p>
        </div>

        {/* Company */}
        <nav aria-label="Company" className="space-y-3">
          <h3 className="font-semibold text-white">Company</h3>
          <ul className="space-y-2">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/service-areas" className="hover:text-white">Service Areas</Link></li>
            <li><Link href="/gallery" className="hover:text-white">Project Gallery</Link></li>
          </ul>
        </nav>

        {/* Services */}
        <nav aria-label="Services" className="space-y-3">
          <h3 className="font-semibold text-white">Services</h3>
          <ul className="space-y-2">
            <li><Link href="/services" className="hover:text-white">All Services</Link></li>
            <li><Link href="/services#residential" className="hover:text-white">Residential Gates</Link></li>
            <li><Link href="/services#commercial" className="hover:text-white">Commercial &amp; Industrial</Link></li>
            <li><Link href="/services#access-control" className="hover:text-white">Access Control</Link></li>
            <li><Link href="/services#repairs" className="hover:text-white">Repairs &amp; Maintenance</Link></li>
            <li><Link href="/reviews" className="hover:text-white">Reviews</Link></li>
            <li>            
              <a
                href="https://g.page/r/CUeakO8C5B1uEBM/review"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition"
              >
              Leave a Google Review
              </a>
            </li>
          </ul>
        </nav>

        {/* Contact / Hours */}
        <div className="space-y-3">
          <h3 className="font-semibold text-white">Contact</h3>
          <p className="text-gray-400">Denver, CO</p>
          <p>
            Phone:{" "}
            <a href="tel:+17209032925" className="hover:text-white">
              (720) 903-2925
            </a>
          </p>
          <p>
            Email:{" "}
            <a href="mailto:info@pgagates.com" className="hover:text-white">
              info@pgagates.com
            </a>
          </p>
          <div className="pt-2">
            <h4 className="font-semibold text-white">Hours</h4>
            <p className="text-gray-400">Mon–Fri: 8:00–5:00</p>
            <p className="text-gray-400">Same-Day Service Available</p>
          </div>
          <div className="pt-3">
            <Link
              href="/contact"
              className="inline-block rounded-2xl bg-white px-4 py-2 text-black hover:bg-zinc-100"
            >
              Request a Quote
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-wrap items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Precision Gates &amp; Automation. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="https://g.page/r/CUeakO8C5B1uEBM/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-black hover:bg-gray-200 transition"
            >
              Leave a Google Review
            </a>
          </div>
          <div className="flex gap-4">
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
            <Link href="/robots.txt" className="hover:text-white">Robots</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



