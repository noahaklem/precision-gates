'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';

type Img = {
  src: string;
  alt: string;
  caption?: string;
  location?: string;
};

export default function GalleryGrid({
  images,
  initial = 9,
}: { images: Img[]; initial?: number }) {
  const [expanded, setExpanded] = useState(false);

  const visible = useMemo(
    () => (expanded ? images : images.slice(0, initial)),
    [expanded, images, initial]
  );

  const remaining = Math.max(images.length - initial, 0);

  return (
    <div className="relative">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((img) => (
          <figure key={img.src} className="space-y-3">
            <div className="relative aspect-video">
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="rounded-2xl object-cover border border-white/10"
                loading="lazy"
              />
            </div>
            {img.caption && (
              <figcaption className="text-sm text-gray-400">
                {img.caption}
                {img.location ? ` — ${img.location}` : ''}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* Fade hint when collapsed */}
      {!expanded && remaining > 0 && (
        <div className="pointer-events-none absolute bottom-20 left-0 right-0 h-24" />
      )}

      {remaining > 0 && (
        <div className="mt-8 flex items-center justify-center">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-5 py-3 text-sm font-medium hover:bg-white/10 transition"
            aria-expanded={expanded}
            aria-controls="recent-work-grid"
          >
            {expanded ? (
              <>
                Show less
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M7 14l5-5 5 5H7z" />
                </svg>
              </>
            ) : (
              <>
                Show {remaining} more
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M7 10l5 5 5-5H7z" />
                </svg>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
