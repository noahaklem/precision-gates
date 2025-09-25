import Link from 'next/link'
export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.08),transparent_60%)]" />
      <div className="section">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold">Secure. Modern. Precision.</h1>
          <p className="mt-5 text-lg text-gray-300">Custom gates & automation systems for residential, commercial, and industrial properties.</p>
          <div className="mt-8 flex gap-4">
            <Link href="#contact" className="px-5 py-3 rounded-2xl bg-white text-black shadow-soft">Request a Quote</Link>
            <Link href="#gallery" className="px-5 py-3 rounded-2xl border border-white/20">See Projects</Link>
          </div>
          <div className="mt-6 text-sm text-gray-400">Licensed & Insured • Clean Installs • Rapid Repairs</div>
        </div>
      </div>
    </section>
  )
}
