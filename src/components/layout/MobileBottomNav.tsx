'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, ShoppingBag, Search } from 'lucide-react'
import { useCart } from '@/store/cart'

const tabs = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Shop', href: '/shop', icon: Grid3X3 },
  { label: 'Search', href: '/shop', icon: Search },
  { label: 'Cart', href: '#', icon: ShoppingBag, isCart: true },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { count, openCart } = useCart()
  const cartCount = count()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream-50 border-t border-cream-200 pb-safe">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const active = tab.href !== '#' && pathname === tab.href
          if (tab.isCart) {
            return (
              <button key="cart" onClick={openCart}
                className="flex-1 flex flex-col items-center justify-center py-3 gap-1 relative text-dark-700 active:text-gold-600">
                <div className="relative">
                  <Icon size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gold-500 text-white text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="text-[9px] tracking-widest uppercase">{tab.label}</span>
              </button>
            )
          }
          return (
            <Link key={tab.href + tab.label} href={tab.href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors
                ${active ? 'text-gold-600' : 'text-dark-700'}`}>
              <Icon size={20} />
              <span className="text-[9px] tracking-widest uppercase">{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
