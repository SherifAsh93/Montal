import { prisma } from '@/lib/prisma'
import { ProductCard } from '@/components/store/ProductCard'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 60

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params

  const cat = await prisma.category.findUnique({
    where: { slug },
    include: { children: { orderBy: { sortOrder: 'asc' } } },
  })
  if (!cat) notFound()

  const allSlugs = [cat.slug, ...cat.children.map((c) => c.slug)]

  const products = await prisma.product.findMany({
    where: { active: true, category: { slug: { in: allSlugs } } },
    orderBy: { createdAt: 'desc' },
    include: { category: { select: { name: true, slug: true } } },
  })

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <div className="text-center mb-8">
        <p className="text-[10px] tracking-[0.4em] uppercase text-gold-600 mb-2">✦</p>
        <h1 className="font-cormorant text-4xl md:text-5xl text-dark-900">{cat.name}</h1>
        <p className="text-[11px] tracking-widest uppercase text-dark-700 mt-2">{products.length} pieces</p>
      </div>

      {/* Sub-category tabs */}
      {cat.children.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          <Link href={`/shop/${slug}`}
            className="text-[10px] tracking-widest uppercase px-4 py-2 border border-dark-900 bg-dark-900 text-cream-50">
            All
          </Link>
          {cat.children.map((sub) => (
            <Link key={sub.id} href={`/shop/${sub.slug}`}
              className="text-[10px] tracking-widest uppercase px-4 py-2 border border-cream-300 text-dark-700 hover:border-dark-900 transition-colors">
              {sub.name}
            </Link>
          ))}
        </div>
      )}

      {products.length === 0 ? (
        <div className="text-center py-24">
          <p className="font-cormorant text-3xl text-dark-700 italic">No products in this category yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
