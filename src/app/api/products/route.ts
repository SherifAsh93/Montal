import { prisma } from '@/lib/prisma'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '100')

  const products = await prisma.product.findMany({
    where: {
      active: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(featured === '1' ? { featured: true } : {}),
    },
    take: limit,
    orderBy: { createdAt: 'desc' },
    include: { category: { select: { name: true, slug: true } } },
  })
  return Response.json(products)
}
