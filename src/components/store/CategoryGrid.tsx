import Image from 'next/image'
import Link from 'next/link'

type Category = { id: string; name: string; slug: string; image?: string | null }

export function CategoryGrid({ categories }: { categories: Category[] }) {
  const display = categories.slice(0, 6)

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold-600 mb-2">✦</p>
        <h2 className="font-cormorant text-4xl md:text-5xl text-dark-900">Shop by Category</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {display.map((cat, i) => (
          <Link key={cat.id} href={`/shop/${cat.slug}`}
            className={`group relative overflow-hidden bg-cream-200 ${i === 0 ? 'md:col-span-1 aspect-[4/5]' : 'aspect-[4/5]'}`}>
            {cat.image ? (
              <Image src={cat.image} alt={cat.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-cream-200 to-cream-300" />
            )}
            <div className="absolute inset-0 bg-dark-900/30 group-hover:bg-dark-900/50 transition-colors duration-300" />
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-6">
              <p className="font-montserrat text-[11px] tracking-widest uppercase text-cream-50 font-medium">{cat.name}</p>
              <p className="font-montserrat text-[9px] tracking-widest uppercase text-gold-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Explore
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
