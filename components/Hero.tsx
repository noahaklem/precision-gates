import Link from 'next/link';
import HeroSlideshow from './HeroSlideshow';
import { getHeroCandidates } from '@/lib/getLocalImages';

export const dynamic = 'force-dynamic';

export default async function Hero() {
  const pool = await getHeroCandidates();

  // choose up to 3 unique random slides from featured pool
  const pick: { src: string; alt: string }[] = [];
  const copy = [...pool];
  for (let i = 0; i < 3 && copy.length; i++) {
    const j = Math.floor(Math.random() * copy.length);
    const [p] = copy.splice(j, 1);
    pick.push({ src: p.src, alt: p.alt });
  }
  if (pick.length === 0) {
    pick.push({ src: '/gallery/iron-driveway-gate-denver.jpg', alt: 'Custom gate installation in Colorado' });
  }

  return (
    <section className="relative overflow-hidden h-[80vh] flex items-center justify-center text-center">
      <HeroSlideshow slides={pick} />

      <div className="relative z-10 max-w-2xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-white [text-shadow:_0_4px_18px_rgba(0,0,0,0.6)]">
          Secure. Modern. Precision.
        </h1>
        <p className="mt-5 text-lg text-gray-200 [text-shadow:_0_2px_12px_rgba(0,0,0,0.55)]">
          Custom gates & automation systems for residential, commercial, and industrial properties.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="#contact" className="px-5 py-3 rounded-2xl bg-white text-black shadow-soft hover:bg-gray-200 transition">
            Request a Quote
          </Link>
          <Link href="#gallery" className="px-5 py-3 rounded-2xl border border-white/30 hover:bg-white/10 transition">
            See Projects
          </Link>
        </div>
        <div className="mt-6 text-sm text-gray-300">
          Licensed &amp; Insured • Clean Installs • Rapid Repairs
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-brand-black" />
    </section>
  );
}



