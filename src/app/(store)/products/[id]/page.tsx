'use client'
import { useEffect, useState, use } from 'react'
import Image from 'next/image'
import { ShoppingBag, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'

type Product = {
  id: string; name: string; description?: string | null; price: number; comparePrice?: number | null
  images: string[]; stock: number; category?: { name: string; slug: string } | null
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [imgIdx, setImgIdx] = useState(0)
  const [added, setAdded] = useState(false)
  const [zoom, setZoom] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    fetch(`/api/products/${id}`).then((r) => r.json()).then(setProduct)
  }, [id])

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const imgs = product.images.length > 0 ? product.images : ['']
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100) : 0

  function handleAdd() {
    addItem({ id: product!.id, name: product!.name, price: product!.price, image: imgs[0] })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-dark-700 mb-6">
        <Link href="/" className="hover:text-gold-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-gold-600 transition-colors">Shop</Link>
        {product.category && (
          <>
            <span>/</span>
            <Link href={`/shop/${product.category.slug}`} className="hover:text-gold-600 transition-colors">
              {product.category.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-dark-900">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Images */}
        <div className="space-y-3">
          <div className="relative aspect-[3/4] bg-cream-200 overflow-hidden cursor-zoom-in" onClick={() => setZoom(true)}>
            {imgs[imgIdx] ? (
              <Image src={imgs[imgIdx]} alt={product.name} fill className="object-cover" priority />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center">
                <span className="font-cormorant text-cream-300 text-8xl italic">M</span>
              </div>
            )}
            <div className="absolute top-3 right-3 w-8 h-8 bg-cream-50/70 rounded-full flex items-center justify-center">
              <ZoomIn size={14} className="text-dark-700" />
            </div>
            {discount > 0 && (
              <span className="absolute top-3 left-3 bg-dark-900 text-cream-50 text-[9px] tracking-widest uppercase px-2 py-1">
                -{discount}%
              </span>
            )}
            {imgs.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i - 1 + imgs.length) % imgs.length) }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream-50/80 rounded-full flex items-center justify-center">
                  <ChevronLeft size={14} />
                </button>
                <button onClick={(e) => { e.stopPropagation(); setImgIdx((i) => (i + 1) % imgs.length) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-cream-50/80 rounded-full flex items-center justify-center">
                  <ChevronRight size={14} />
                </button>
              </>
            )}
          </div>
          {imgs.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {imgs.map((src, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  className={`w-16 h-20 flex-shrink-0 relative overflow-hidden border-2 transition-colors ${i === imgIdx ? 'border-gold-500' : 'border-transparent'}`}>
                  {src && <Image src={src} alt="" fill className="object-cover" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5 md:pt-4">
          {product.category && (
            <Link href={`/shop/${product.category.slug}`}
              className="text-[10px] tracking-[0.4em] uppercase text-gold-600 hover:text-gold-700 transition-colors">
              {product.category.name}
            </Link>
          )}
          <h1 className="font-cormorant text-4xl md:text-5xl text-dark-900 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-4">
            <span className="font-montserrat text-2xl text-dark-900">{formatPrice(product.price)}</span>
            {product.comparePrice && (
              <span className="text-lg text-dark-700 line-through">{formatPrice(product.comparePrice)}</span>
            )}
          </div>

          <div className="w-12 h-[1px] bg-gold-400" />

          {product.description && (
            <p className="text-sm text-dark-700 leading-relaxed">{product.description}</p>
          )}

          {product.stock === 0 ? (
            <div className="bg-cream-200 border border-cream-300 text-dark-700 text-[11px] tracking-widest uppercase text-center py-4">
              Out of Stock
            </div>
          ) : (
            <button onClick={handleAdd}
              className={`w-full py-4 text-[11px] tracking-widest uppercase flex items-center justify-center gap-3 font-montserrat font-medium transition-all duration-300 ${added ? 'bg-gold-500 text-dark-900' : 'bg-dark-900 text-cream-50 hover:bg-dark-800'}`}>
              <ShoppingBag size={16} />
              {added ? 'Added to Bag ✓' : 'Add to Bag'}
            </button>
          )}

          <div className="border border-cream-200 rounded-sm p-4 space-y-2 text-[11px] text-dark-700">
            <p className="flex items-center gap-2">✦ Free shipping on orders over 800 EGP</p>
            <p className="flex items-center gap-2">✦ Easy returns & exchanges</p>
            <p className="flex items-center gap-2">✦ Handcrafted with premium fabrics</p>
          </div>
        </div>
      </div>

      {/* Zoom overlay */}
      {zoom && imgs[imgIdx] && (
        <div className="fixed inset-0 z-50 bg-dark-900/95 flex items-center justify-center" onClick={() => setZoom(false)}>
          <div className="relative w-full max-w-2xl max-h-screen p-4">
            <Image src={imgs[imgIdx]} alt={product.name} width={800} height={1000} className="object-contain max-h-[90vh] mx-auto" />
          </div>
        </div>
      )}
    </div>
  )
}
