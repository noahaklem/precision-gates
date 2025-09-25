import Hero from '../components/Hero'
import Services from '../components/Services'
import QuoteForm from '../components/QuoteForm'

export default function Page(){
  return (
    <>
      <Hero />
      <Services />
      <section id="gallery" className="section">
        <h2 className="text-3xl font-semibold">Gallery</h2>
        <p className="text-gray-300 mt-2">Drop your real project photos here (WebP recommended).</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Replace with real <Image/> components later */}
          {Array.from({length:4}).map((_,i)=>(<div key={i} className="aspect-video rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent)]" />))}
        </div>
      </section>
      <section id="about" className="section">
        <h2 className="text-3xl font-semibold">About Precision Gates</h2>
        <p className="text-gray-300 mt-2 max-w-3xl">We craft high-quality, code-compliant gates with expert automation. Clean installs, neat wiring, and responsive support across Colorado.</p>
      </section>
      <section id="contact" className="section grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold">Request a Quote</h2>
          <p className="text-gray-300 mt-2">Prefer to call? <a href="tel:+15555555555" className="underline">(555) 555-5555</a></p>
        </div>
        <QuoteForm />
      </section>
    </>
  )
}