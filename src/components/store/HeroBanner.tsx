'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

type Banner = { id: string; title: string; subtitle?: string | null; image: string; link?: string | null }

export function HeroBanner({ banners }: { banners: Banner[] }) {
  const [idx, setIdx] = useState(0)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    if (banners.length <= 1) return
    const t = setInterval(() => goTo((i) => (i + 1) % banners.length), 5000)
    return () => clearInterval(t)
  }, [banners.length])

  function goTo(fn: (i: number) => number) {
    setAnimating(true)
    setTimeout(() => {
      setIdx(fn)
      setAnimating(false)
    }, 200)
  }

  if (banners.length === 0) {
    return (
      <div className="relative h-[80vh] md:h-[90vh] bg-cream-200 flex items-center">
        <div className="absolute inset-0 bg-gradient-to-r from-cream-100/80 to-transparent" />
        <div className="relative z-10 px-10 md:px-20 max-w-xl animate-fade-in-up">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold-600 mb-4">Timeless Elegance</p>
          <h1 className="font-cormorant text-5xl md:text-7xl text-dark-900 leading-tight mb-4">
            For the moments<br />before <em>forever</em>
          </h1>
          <p className="text-sm text-dark-700 leading-relaxed mb-8 max-w-xs">
            Luxury bridal robes, veils & corsets designed to make you feel unforgettable.
          </p>
          <Link href="/shop"
            className="inline-block border border-dark-900 text-dark-900 text-[10px] tracking-widest uppercase px-8 py-4 hover:bg-dark-900 hover:text-cream-50 transition-all duration-300">
            Discover the Collection
          </Link>
        </div>
      </div>
    )
  }

  const banner = banners[idx]
  return (
    <div className="relative h-[80vh] md:h-[90vh] overflow-hidden bg-cream-200">
      <Image src={banner.image} alt={banner.title} fill className={`object-cover transition-opacity duration-500 ${animating ? 'opacity-0' : 'opacity-100'}`} priority />
      <div className="absolute inset-0 bg-gradient-to-r from-dark-900/60 to-transparent" />
      <div className={`relative z-10 h-full flex items-center px-10 md:px-20 ${animating ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}>
        <div className="max-w-xl">
          <p className="text-[10px] tracking-[0.4em] uppercase text-gold-300 mb-4">Timeless Elegance</p>
          <h1 className="font-cormorant text-5xl md:text-7xl text-cream-50 leading-tight mb-4">{banner.title}</h1>
          {banner.subtitle && <p className="text-sm text-cream-200 leading-relaxed mb-8 max-w-xs">{banner.subtitle}</p>}
          <Link href={banner.link || '/shop'}
            className="inline-block border border-cream-50 text-cream-50 text-[10px] tracking-widest uppercase px-8 py-4 hover:bg-cream-50 hover:text-dark-900 transition-all duration-300">
            Discover the Collection
          </Link>
        </div>
      </div>

      {banners.length > 1 && (
        <>
          <button onClick={() => goTo((i) => (i - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-cream-50/20 hover:bg-cream-50/40 rounded-full flex items-center justify-center text-cream-50 backdrop-blur-sm transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={() => goTo((i) => (i + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-cream-50/20 hover:bg-cream-50/40 rounded-full flex items-center justify-center text-cream-50 backdrop-blur-sm transition-all">
            <ChevronRight size={18} />
          </button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)}
                className={`w-6 h-[2px] transition-all ${i === idx ? 'bg-cream-50 w-10' : 'bg-cream-50/50'}`} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
