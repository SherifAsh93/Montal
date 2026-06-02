'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Plus, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react'
import { ImageUpload } from '@/components/admin/ImageUpload'

type Banner = { id: string; title: string; subtitle?: string | null; image: string; link?: string | null; active: boolean; sortOrder: number }

export default function AdminBannersPage() {
  const router = useRouter()
  const [banners, setBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', subtitle: '', image: '', link: '' })
  const [tempImages, setTempImages] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => { if (!r.ok) router.push('/admin') })
    loadBanners()
  }, [router])

  function loadBanners() {
    fetch('/api/admin/banners').then((r) => r.json()).then(setBanners).finally(() => setLoading(false))
  }

  async function addBanner() {
    if (!form.title || tempImages.length === 0) return
    await fetch('/api/admin/banners', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, subtitle: form.subtitle || null, image: tempImages[0], link: form.link || null, active: true, sortOrder: banners.length }),
    })
    setAdding(false); setForm({ title: '', subtitle: '', image: '', link: '' }); setTempImages([])
    loadBanners()
  }

  async function toggleBanner(banner: Banner) {
    await fetch(`/api/admin/banners/${banner.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !banner.active }),
    })
    setBanners((prev) => prev.map((b) => b.id === banner.id ? { ...b, active: !b.active } : b))
  }

  async function deleteBanner(id: string) {
    if (!confirm('Delete this banner?')) return
    await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' })
    setBanners((prev) => prev.filter((b) => b.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-cream-50 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-cream-300 hover:text-cream-50"><ArrowLeft size={18} /></Link>
        <span className="font-cormorant text-2xl tracking-[0.2em] uppercase">Hero Banners</span>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-dark-900 text-cream-50 text-[11px] tracking-widest uppercase px-5 py-2.5 hover:bg-dark-800 transition-colors">
            <Plus size={14} />Add Banner
          </button>
        </div>

        {adding && (
          <div className="bg-white border border-gold-300 rounded-lg p-4 mb-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] tracking-widest uppercase text-gray-600 font-medium">New Banner</p>
              <button onClick={() => setAdding(false)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
            </div>
            <input type="text" placeholder="Title (shown on banner)" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-500" />
            <input type="text" placeholder="Subtitle (optional)" value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-500" />
            <input type="text" placeholder="Link (optional, e.g. /shop/robes)" value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-500" />
            <div>
              <p className="text-[10px] tracking-widest uppercase text-gray-600 mb-2">Banner Image</p>
              <ImageUpload images={tempImages} onChange={setTempImages} max={1} />
            </div>
            <button onClick={addBanner} disabled={!form.title || tempImages.length === 0}
              className="bg-dark-900 text-cream-50 text-[11px] tracking-widest uppercase px-6 py-2.5 hover:bg-dark-800 transition-colors disabled:opacity-60">
              Save Banner
            </button>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : banners.length === 0 ? (
          <p className="text-center text-gray-500 py-12">No banners yet. Add one above.</p>
        ) : (
          <div className="space-y-3">
            {banners.map((b) => (
              <div key={b.id} className={`bg-white border rounded-lg overflow-hidden flex gap-4 items-center p-3 ${!b.active ? 'opacity-60' : ''}`}>
                <div className="w-24 h-16 relative bg-gray-100 flex-shrink-0 overflow-hidden">
                  {b.image && <Image src={b.image} alt={b.title} fill className="object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm">{b.title}</p>
                  {b.subtitle && <p className="text-xs text-gray-500 truncate">{b.subtitle}</p>}
                  {b.link && <p className="text-[10px] text-gold-600">{b.link}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleBanner(b)} className="text-gray-400 hover:text-gray-600">
                    {b.active ? <ToggleRight size={20} className="text-green-500" /> : <ToggleLeft size={20} />}
                  </button>
                  <button onClick={() => deleteBanner(b.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
