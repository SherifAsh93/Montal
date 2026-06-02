'use client'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/store/cart'
import { formatPrice } from '@/lib/utils'

type Product = {
  id: string
  name: string
  price: number
  comparePrice?: number | null
  images: string[]
  featured?: boolean
  category?: { name: string } | null
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart()
  const img = product.images[0] || ''
  const discount = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault()
    addItem({ id: product.id, name: product.name, price: product.price, image: img })
  }

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative bg-cream-200 overflow-hidden aspect-[3/4]">
        {img ? (
          <Image src={img} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300 flex items-center justify-center">
            <span className="font-cormorant text-cream-300 text-4xl italic">M</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discount > 0 && (
            <span className="bg-dark-900 text-cream-50 text-[9px] tracking-widest uppercase px-2 py-1">
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-gold-500 text-dark-900 text-[9px] tracking-widest uppercase px-2 py-1">
              Featured
            </span>
          )}
        </div>

        {/* Add to cart hover */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button onClick={handleAddToCart}
            className="w-full bg-dark-900/90 text-cream-50 text-[10px] tracking-widest uppercase py-3.5 flex items-center justify-center gap-2 hover:bg-dark-900 transition-colors backdrop-blur-sm font-montserrat">
            <ShoppingBag size={13} />
            Add to Bag
          </button>
        </div>
      </div>

      <div className="pt-3 pb-1">
        {product.category && (
          <p className="text-[9px] tracking-widest uppercase text-gold-600 mb-1">{product.category.name}</p>
        )}
        <p className="font-cormorant text-base text-dark-900 leading-tight">{product.name}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[13px] font-medium text-dark-900">{formatPrice(product.price)}</span>
          {product.comparePrice && (
            <span className="text-[12px] text-dark-700 line-through">{formatPrice(product.comparePrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
