import { prisma } from '@/lib/prisma'

export async function GET() {
  const categories = await prisma.category.findMany({
    where: { parentId: null },
    orderBy: { sortOrder: 'asc' },
    include: { children: { orderBy: { sortOrder: 'asc' } } },
  })
  return Response.json(categories)
}
