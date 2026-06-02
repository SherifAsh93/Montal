'use client'
import { useCart } from '@/store/cart'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, calcShipping } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total } = useCart()
  const subtotal = total()
  const shipping = calcShipping(subtotal)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
      <aside className="relative w-full max-w-sm bg-cream-50 h-full flex flex-col animate-slide-in-right shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cream-200">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-dark-900" />
            <span className="font-montserrat text-[11px] tracking-widest uppercase text-dark-900">
              Your Bag ({items.length})
            </span>
          </div>
          <button onClick={closeCart} className="text-dark-700 hover:text-dark-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
              <ShoppingBag size={40} className="text-cream-300" />
              <p className="font-cormorant text-xl text-dark-700 italic">Your bag is empty</p>
              <p className="text-[11px] tracking-widest text-dark-700 uppercase">Add something beautiful</p>
              <button onClick={closeCart}
                className="mt-2 text-[10px] tracking-widest uppercase border border-dark-900 px-6 py-3 hover:bg-dark-900 hover:text-cream-50 transition-colors">
                Continue Shopping
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 py-3 border-b border-cream-200">
                <div className="w-20 h-24 bg-cream-200 relative overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full bg-cream-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-cormorant text-base text-dark-900 leading-tight mb-1">{item.name}</p>
                  <p className="text-[11px] text-gold-600 font-medium mb-3">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-cream-300">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center text-dark-700 hover:bg-cream-200 transition-colors text-sm">−</button>
                      <span className="w-8 text-center text-[12px]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center text-dark-700 hover:bg-cream-200 transition-colors text-sm">+</button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-dark-700 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-cream-200 px-6 py-6 space-y-3">
            <div className="flex justify-between text-[12px] text-dark-700">
              <span className="tracking-wider uppercase">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[12px] text-dark-700">
              <span className="tracking-wider uppercase">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium border-t border-cream-200 pt-3">
              <span className="tracking-wider uppercase">Total</span>
              <span className="text-gold-600">{formatPrice(subtotal + shipping)}</span>
            </div>
            <Link href="/checkout" onClick={closeCart}
              className="block w-full bg-dark-900 text-cream-50 text-[11px] tracking-widest uppercase text-center py-4 hover:bg-dark-800 transition-colors font-montserrat font-medium">
              Proceed to Checkout
            </Link>
            <button onClick={closeCart}
              className="block w-full text-[10px] tracking-widest uppercase text-center py-2 text-dark-700 hover:text-dark-900 transition-colors">
              Continue Shopping
            </button>
          </div>
        )}
      </aside>
    </div>
  )
}
