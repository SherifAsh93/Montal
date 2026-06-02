'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Pencil, Trash2, X, Check } from 'lucide-react'

type Category = { id: string; name: string; slug: string; parentId: string | null; sortOrder: number; _count?: { products: number }; children?: Category[] }

export default function AdminCategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [adding, setAdding] = useState<string | false>(false)
  const [newName, setNewName] = useState('')
  const [newSlug, setNewSlug] = useState('')
  const [newParent, setNewParent] = useState('')

  useEffect(() => {
    fetch('/api/admin/stats').then((r) => { if (!r.ok) router.push('/admin') })
    loadCategories()
  }, [router])

  function loadCategories() {
    fetch('/api/admin/categories').then((r) => r.json()).then(setCategories).finally(() => setLoading(false))
  }

  function slugify(str: string) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function saveEdit(id: string) {
    await fetch(`/api/admin/categories/${id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, slug: slugify(editName) }),
    })
    setEditing(null)
    loadCategories()
  }

  async function deleteCategory(id: string) {
    if (!confirm('Delete this category? Products will be unassigned.')) return
    await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
    loadCategories()
  }

  async function addCategory() {
    if (!newName) return
    await fetch('/api/admin/categories', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName, slug: newSlug || slugify(newName), parentId: newParent || null, sortOrder: 99 }),
    })
    setAdding(false); setNewName(''); setNewSlug(''); setNewParent('')
    loadCategories()
  }

  const parents = categories.filter((c) => !c.parentId)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark-900 text-cream-50 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-cream-300 hover:text-cream-50"><ArrowLeft size={18} /></Link>
        <span className="font-cormorant text-2xl tracking-[0.2em] uppercase">Categories</span>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex justify-end mb-4">
          <button onClick={() => setAdding(true)}
            className="flex items-center gap-2 bg-dark-900 text-cream-50 text-[11px] tracking-widest uppercase px-5 py-2.5 hover:bg-dark-800 transition-colors">
            <Plus size={14} />Add Category
          </button>
        </div>

        {adding && (
          <div className="bg-white border border-gold-300 rounded-lg p-4 mb-4 space-y-3">
            <p className="text-[10px] tracking-widest uppercase text-gray-600 font-medium">New Category</p>
            <input type="text" placeholder="Name" value={newName}
              onChange={(e) => { setNewName(e.target.value); setNewSlug(slugify(e.target.value)) }}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-500" />
            <input type="text" placeholder="Slug (auto-generated)" value={newSlug}
              onChange={(e) => setNewSlug(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-500" />
            <select value={newParent} onChange={(e) => setNewParent(e.target.value)}
              className="w-full border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:border-gold-500 bg-white">
              <option value="">— Top-level category —</option>
              {parents.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <div className="flex gap-2">
              <button onClick={addCategory} className="flex items-center gap-1 bg-green-600 text-white text-[10px] tracking-widest uppercase px-4 py-2 hover:bg-green-700 transition-colors">
                <Check size={12} />Save
              </button>
              <button onClick={() => setAdding(false)} className="flex items-center gap-1 text-[10px] tracking-widest uppercase px-4 py-2 border border-gray-200 hover:border-gray-400 transition-colors">
                <X size={12} />Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3">
                  {editing === cat.id ? (
                    <>
                      <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(cat.id); if (e.key === 'Escape') setEditing(null) }}
                        className="flex-1 border border-gold-300 px-2 py-1 text-sm focus:outline-none" />
                      <button onClick={() => saveEdit(cat.id)} className="text-green-600 hover:text-green-700"><Check size={16} /></button>
                      <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                    </>
                  ) : (
                    <>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{cat.name}</p>
                        <p className="text-[10px] text-gray-400">{cat.slug} · {cat._count?.products || 0} products</p>
                      </div>
                      <button onClick={() => { setEditing(cat.id); setEditName(cat.name) }} className="text-gray-400 hover:text-gold-600 transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => deleteCategory(cat.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </>
                  )}
                </div>

                {cat.children && cat.children.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    {cat.children.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-3 px-6 py-2.5 border-b border-gray-100 last:border-0">
                        <span className="text-gray-300 text-sm">└</span>
                        {editing === sub.id ? (
                          <>
                            <input autoFocus value={editName} onChange={(e) => setEditName(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(sub.id); if (e.key === 'Escape') setEditing(null) }}
                              className="flex-1 border border-gold-300 px-2 py-1 text-sm focus:outline-none" />
                            <button onClick={() => saveEdit(sub.id)} className="text-green-600 hover:text-green-700"><Check size={14} /></button>
                            <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>
                          </>
                        ) : (
                          <>
                            <p className="flex-1 text-sm text-gray-700">{sub.name}</p>
                            <button onClick={() => { setEditing(sub.id); setEditName(sub.name) }} className="text-gray-400 hover:text-gold-600 transition-colors">
                              <Pencil size={12} />
                            </button>
                            <button onClick={() => deleteCategory(sub.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    ))}
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
