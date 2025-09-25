'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-colors ${solid ? 'bg-brand-dark/90 backdrop-blur border-b border-white/10' : 'bg-transparent'}`}>
      <div className="container py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg">Precision Gates & Automation</Link>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#services" className="hover:text-brand-silver">Services</a>
          <a href="#gallery" className="hover:text-brand-silver">Gallery</a>
          <a href="#about" className="hover:text-brand-silver">About</a>
          <a href="#contact" className="px-4 py-2 rounded-2xl bg-white text-black shadow-soft">Request a Quote</a>
        </nav>
      </div>
    </header>
  )
}
