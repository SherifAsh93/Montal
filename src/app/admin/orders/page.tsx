'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Trash2, ChevronDown } from 'lucide-react'

type OrderItem = { id: string; name: string; price: number; quantity: number }
type Order = {
  id: string; orderNumber: string; customerName: string; customerPhone: string
  city: string; address: string; notes?: string | null; status: string
  subtotal: number; shipping: number; total: number; createdAt: string; items: OrderItem[]
}

const STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']
const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-purple-100 text-purple-700',
  SHIPPED: 'bg-cyan-100 text-cyan-700',
  DELIVERED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
}

export default function AdminOrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState('ALL')

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => { if (!r.ok) router.push('/admin') })
    fetch('/api/admin/orders').then((r) => r.json()).then(setOrders).finally(() => setLoading(false))
  }, [router])

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/admin/orders/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status } : o))
  }

  async function deleteOrder(id: string) {
    if (!confirm('Delete this order?')) return
    await fetch(`/api/admin/orders/${id}`, { method: 'DELETE' })
    setOrders((prev) => prev.filter((o) => o.id !== id))
  }

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-cream-50 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-cream-300 hover:text-cream-50"><ArrowLeft size={18} /></Link>
        <span className="font-cormorant text-2xl tracking-[0.2em] uppercase">Orders</span>
        <span className="ml-auto text-[10px] tracking-widest uppercase text-gold-400">{orders.length} total</span>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['ALL', ...STATUSES].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`text-[10px] tracking-widest uppercase px-3 py-1.5 rounded transition-colors ${filter === s ? 'bg-dark-900 text-cream-50' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No orders {filter !== 'ALL' ? `with status ${filter}` : 'yet'}</p>
        ) : (
          <div className="space-y-3">
            {filtered.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-4 px-4 py-3 cursor-pointer" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="font-mono text-sm font-medium text-gray-900">{order.orderNumber}</p>
                      <span className={`text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{order.customerName} · {order.customerPhone}</p>
                    <p className="text-[11px] text-gray-400">{order.city} · {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-medium text-gray-900">{order.total} EGP</p>
                    <p className="text-[10px] text-gray-400">{order.items.length} items</p>
                  </div>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${expanded === order.id ? 'rotate-180' : ''}`} />
                </div>

                {expanded === order.id && (
                  <div className="border-t border-gray-100 px-4 py-4 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">Delivery</p>
                        <p className="text-gray-700">{order.address}</p>
                        <p className="text-gray-700">{order.city}</p>
                        {order.notes && <p className="text-gray-500 text-xs mt-1">Note: {order.notes}</p>}
                      </div>
                      <div>
                        <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-1">Payment</p>
                        <p className="text-gray-700">Subtotal: {order.subtotal} EGP</p>
                        <p className="text-gray-700">Shipping: {order.shipping} EGP</p>
                        <p className="font-medium text-gray-900">Total: {order.total} EGP</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] tracking-widest uppercase text-gray-500 mb-2">Items</p>
                      <div className="space-y-1">
                        {order.items.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm text-gray-700">
                            <span>{item.name} × {item.quantity}</span>
                            <span>{(item.price * item.quantity).toFixed(0)} EGP</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:border-gold-500 bg-white">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => deleteOrder(order.id)} className="flex items-center gap-1.5 text-red-500 hover:text-red-700 text-sm transition-colors">
                        <Trash2 size={14} />Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
