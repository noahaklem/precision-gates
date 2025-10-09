'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

type Slide = { src: string; alt: string };

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [idx, setIdx] = useState(0);

  // Respect reduced-motion
  const prefersReduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
    []
  );

  useEffect(() => {
    if (prefersReduced || slides.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [prefersReduced, slides.length]);

  return (
    <div className="absolute inset-0 -z-10">
      {slides.map((s, i) => {
        const active = i === idx;
        return (
          <Image
            key={s.src}
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            sizes="100vw"
            className={[
              'object-cover transition-opacity duration-[1200ms] will-change-opacity',
              active ? 'opacity-100' : 'opacity-0'
            ].join(' ')}
          />
        );
      })}
      {/* contrast helpers */}
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/30 to-transparent" />
    </div>
  );
}
