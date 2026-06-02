'use client'
import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, Link2, X, Plus } from 'lucide-react'

type Props = {
  images: string[]
  onChange: (images: string[]) => void
  max?: number
}

export function ImageUpload({ images, onChange, max = 8 }: Props) {
  const [urlInput, setUrlInput] = useState('')
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function uploadFile(file: File) {
    setUploading(true); setError('')
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange([...images, data.url])
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function uploadUrl() {
    if (!urlInput.trim()) return
    setUploading(true); setError('')
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onChange([...images, data.url])
      setUrlInput('')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx))
  }

  return (
    <div className="space-y-3">
      {/* Existing images */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((src, i) => (
            <div key={i} className="relative w-20 h-24 border border-gray-200 overflow-hidden group">
              <Image src={src} alt="" fill className="object-cover" />
              <button onClick={() => removeImage(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <X size={10} />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 left-0 right-0 bg-dark-900/70 text-cream-50 text-[8px] text-center py-0.5">Main</span>
              )}
            </div>
          ))}
        </div>
      )}

      {images.length < max && (
        <>
          {/* File upload */}
          <div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); e.target.value = '' }} />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="flex items-center gap-2 text-[11px] tracking-widest uppercase border border-gray-200 px-4 py-2.5 hover:border-gold-500 transition-colors text-gray-600 disabled:opacity-60">
              <Upload size={14} />
              Upload from device
            </button>
          </div>

          {/* URL input */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="url" value={urlInput} onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Paste image URL..."
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); uploadUrl() } }}
                className="w-full border border-gray-200 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-gold-500 transition-colors" />
            </div>
            <button type="button" onClick={uploadUrl} disabled={uploading || !urlInput.trim()}
              className="flex items-center gap-1 text-[10px] tracking-widest uppercase bg-dark-900 text-cream-50 px-4 py-2.5 hover:bg-dark-800 transition-colors disabled:opacity-60">
              <Plus size={12} />
              Add
            </button>
          </div>
        </>
      )}

      {uploading && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-4 h-4 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
          Uploading to GitHub...
        </div>
      )}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  )
}
