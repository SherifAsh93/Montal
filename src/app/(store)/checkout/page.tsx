'use client'
import { useState } from 'react'
import { useCart } from '@/store/cart'
import { formatPrice, calcShipping, generateOrderNumber } from '@/lib/utils'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart()
  const router = useRouter()
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [orderNum, setOrderNum] = useState('')

  const subtotal = total()
  const shipping = calcShipping(subtotal)

  if (items.length === 0 && !done) {
    router.push('/')
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const number = generateOrderNumber()
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber: number,
          customerName: form.name,
          customerPhone: form.phone,
          city: form.city,
          address: form.address,
          notes: form.notes,
          subtotal,
          shipping,
          total: subtotal + shipping,
          items: items.map((i) => ({ productId: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
        }),
      })
      if (res.ok) {
        setOrderNum(number)
        clearCart()
        setDone(true)
      }
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <CheckCircle size={56} className="text-gold-500 mb-4" />
        <h1 className="font-cormorant text-4xl text-dark-900 mb-2">Order Placed!</h1>
        <p className="text-[11px] tracking-widest uppercase text-dark-700 mb-1">Order Number</p>
        <p className="font-cormorant text-2xl text-gold-600 mb-4">{orderNum}</p>
        <p className="text-sm text-dark-700 max-w-xs mb-6">
          Thank you for your order. We will contact you shortly to confirm delivery details.
        </p>
        <button onClick={() => router.push('/')}
          className="text-[10px] tracking-widest uppercase bg-dark-900 text-cream-50 px-8 py-4 hover:bg-dark-800 transition-colors">
          Continue Shopping
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="font-cormorant text-4xl text-dark-900 mb-8 text-center">Checkout</h1>
      <div className="grid md:grid-cols-2 gap-10">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="font-cormorant text-2xl text-dark-900 mb-4">Delivery Information</h2>
          {[
            { name: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name' },
            { name: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+20 xxx xxx xxxx' },
            { name: 'city', label: 'City', type: 'text', placeholder: 'Cairo, Alexandria...' },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-[10px] tracking-widest uppercase text-dark-700 block mb-1.5">{f.label}</label>
              <input type={f.type} required value={(form as Record<string, string>)[f.name]} placeholder={f.placeholder}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full border border-cream-300 px-4 py-3 text-sm text-dark-900 bg-cream-50 focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
          ))}
          <div>
            <label className="text-[10px] tracking-widest uppercase text-dark-700 block mb-1.5">Full Address</label>
            <textarea required rows={2} value={form.address} placeholder="Street, building, apartment..."
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border border-cream-300 px-4 py-3 text-sm text-dark-900 bg-cream-50 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
          </div>
          <div>
            <label className="text-[10px] tracking-widest uppercase text-dark-700 block mb-1.5">Notes (optional)</label>
            <textarea rows={2} value={form.notes} placeholder="Any special instructions..."
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-cream-300 px-4 py-3 text-sm text-dark-900 bg-cream-50 focus:outline-none focus:border-gold-500 transition-colors resize-none" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-dark-900 text-cream-50 py-4 text-[11px] tracking-widest uppercase font-montserrat font-medium hover:bg-dark-800 transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {loading && <span className="w-4 h-4 border-2 border-cream-50 border-t-transparent rounded-full animate-spin" />}
            Place Order
          </button>
        </form>

        {/* Order summary */}
        <div className="bg-cream-100 p-6 space-y-4 h-fit">
          <h2 className="font-cormorant text-2xl text-dark-900 mb-4">Order Summary</h2>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 items-center">
                <div className="w-14 h-16 bg-cream-200 relative flex-shrink-0 overflow-hidden">
                  {item.image && <Image src={item.image} alt={item.name} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-dark-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-dark-700">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm text-dark-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-cream-200 pt-4 space-y-2">
            <div className="flex justify-between text-[12px] text-dark-700">
              <span className="tracking-wider uppercase">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-[12px] text-dark-700">
              <span className="tracking-wider uppercase">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between text-sm font-medium border-t border-cream-200 pt-2">
              <span className="tracking-wider uppercase">Total</span>
              <span className="text-gold-600">{formatPrice(subtotal + shipping)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
