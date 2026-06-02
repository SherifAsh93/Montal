'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

type Category = { id: string; name: string; parentId: string | null; children?: Category[] }
type Product = {
  id: string; name: string; description?: string | null; price: number; comparePrice?: number | null
  stock: number; categoryId?: string | null; featured: boolean; active: boolean; images: string[]
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<{
    name: string; description: string; price: string; comparePrice: string; stock: string
    categoryId: string; featured: boolean; active: boolean; images: string[]
  } | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => { if (!r.ok) router.push('/admin') })
    Promise.all([
      fetch(`/api/admin/products/${id}`).then((r) => r.json()),
      fetch('/api/admin/categories').then((r) => r.json()),
    ]).then(([product, cats]: [Product, Category[]]) => {
      setCategories(cats)
      setForm({
        name: product.name,
        description: product.description || '',
        price: product.price.toString(),
        comparePrice: product.comparePrice?.toString() || '',
        stock: product.stock.toString(),
        categoryId: product.categoryId || '',
        featured: product.featured,
        active: product.active,
        images: product.images,
      })
    })
  }, [id, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form) return
    setSaving(true); setError('')
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        description: form.description || null,
        price: parseFloat(form.price),
        comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
        stock: parseInt(form.stock) || 0,
        categoryId: form.categoryId || null,
        featured: form.featured,
        active: form.active,
        images: form.images,
      }),
    })
    setSaving(false)
    if (res.ok) router.push('/admin/products')
    else { const d = await res.json(); setError(d.error || 'Failed to save') }
  }

  if (!form) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const allCats = categories.flatMap((c) => [c, ...(c.children || [])])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-cream-50 px-6 py-4 flex items-center gap-4">
        <Link href="/admin/products" className="text-cream-300 hover:text-cream-50"><ArrowLeft size={18} /></Link>
        <span className="font-cormorant text-2xl tracking-[0.2em] uppercase">Edit Product</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-5 bg-white border border-gray-200 p-6 rounded-lg">
          {error && <p className="text-red-500 text-sm bg-red-50 border border-red-200 p-3 rounded">{error}</p>}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-1.5">Product Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-1.5">Price (EGP) *</label>
              <input type="number" required min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-1.5">Compare Price</label>
              <input type="number" min="0" step="0.01" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-1.5">Stock</label>
              <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-1.5">Category</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors bg-white">
                <option value="">— No category —</option>
                {allCats.map((c) => (
                  <option key={c.id} value={c.id}>{c.parentId ? '  └ ' : ''}{c.name}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-1.5">Description</label>
              <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors resize-none" />
            </div>
            <div className="col-span-2 flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-amber-600" />
                <span className="text-[11px] tracking-widest uppercase text-gray-600">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-green-600" />
                <span className="text-[11px] tracking-widest uppercase text-gray-600">Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="text-[10px] tracking-widest uppercase text-gray-600 block mb-2">Images</label>
            <ImageUpload images={form.images} onChange={(imgs) => setForm({ ...form, images: imgs })} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving}
              className="flex-1 bg-dark-900 text-cream-50 py-3 text-[11px] tracking-widest uppercase hover:bg-dark-800 transition-colors disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/products" className="px-6 py-3 border border-gray-200 text-[11px] tracking-widest uppercase text-gray-600 hover:border-gray-400 transition-colors text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
