'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Pencil, Trash2, ArrowLeft, ToggleLeft, ToggleRight } from 'lucide-react'

type Product = {
  id: string; name: string; price: number; images: string[]; active: boolean; stock: number; featured: boolean
  category?: { name: string } | null
}

export default function AdminProductsPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => { if (!r.ok) router.push('/admin') })
    fetch('/api/admin/products').then((r) => r.json()).then(setProducts).finally(() => setLoading(false))
  }, [router])

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.length} products?`)) return
    await fetch('/api/admin/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ids: selected }) })
    setProducts((prev) => prev.filter((p) => !selected.includes(p.id)))
    setSelected([])
  }

  async function toggleActive(product: Product) {
    await fetch(`/api/admin/products/${product.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !product.active }),
    })
    setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, active: !p.active } : p))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-cream-50 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-cream-300 hover:text-cream-50 transition-colors"><ArrowLeft size={18} /></Link>
        <span className="font-cormorant text-2xl tracking-[0.2em] uppercase">Products</span>
        <span className="ml-auto text-[10px] tracking-widest uppercase text-gold-400">{products.length} items</span>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          {selected.length > 0 ? (
            <button onClick={bulkDelete} className="flex items-center gap-2 text-sm text-red-600 border border-red-300 px-4 py-2 rounded hover:bg-red-50 transition-colors">
              <Trash2 size={14} />
              Delete {selected.length} selected
            </button>
          ) : <div />}
          <Link href="/admin/products/new"
            className="flex items-center gap-2 bg-dark-900 text-cream-50 text-[11px] tracking-widest uppercase px-5 py-2.5 hover:bg-dark-800 transition-colors">
            <Plus size={14} />
            Add Product
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">No products yet</p>
            <Link href="/admin/products/new" className="text-gold-600 hover:underline text-sm">Add your first product →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p) => (
              <div key={p.id} className={`bg-white border rounded-lg overflow-hidden group ${selected.includes(p.id) ? 'border-gold-500 ring-2 ring-gold-300' : 'border-gray-200'}`}>
                <div className="relative aspect-[3/4] bg-gray-100 cursor-pointer" onClick={() => setSelected((s) => s.includes(p.id) ? s.filter((x) => x !== p.id) : [...s, p.id])}>
                  {p.images[0] ? (
                    <Image src={p.images[0]} alt={p.name} fill className="object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300 font-cormorant text-3xl italic">M</div>
                  )}
                  {!p.active && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-[10px] tracking-widest uppercase text-gray-500">Hidden</span>
                    </div>
                  )}
                  {selected.includes(p.id) && (
                    <div className="absolute top-2 left-2 w-5 h-5 bg-gold-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px]">✓</span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  {p.category && <p className="text-[9px] tracking-widest uppercase text-gold-600 mb-0.5">{p.category.name}</p>}
                  <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                  <p className="text-sm text-gray-700">{p.price} EGP</p>
                  <div className="flex items-center justify-between mt-3">
                    <button onClick={() => toggleActive(p)} className="text-gray-400 hover:text-gray-600 transition-colors">
                      {p.active ? <ToggleRight size={18} className="text-green-500" /> : <ToggleLeft size={18} />}
                    </button>
                    <div className="flex items-center gap-2">
                      <Link href={`/admin/products/${p.id}`} className="text-gray-400 hover:text-gold-600 transition-colors">
                        <Pencil size={14} />
                      </Link>
                      <button onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
