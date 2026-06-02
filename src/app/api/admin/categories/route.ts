import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const cats = await prisma.category.findMany({
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: { children: { orderBy: { sortOrder: 'asc' } }, _count: { select: { products: true } } },
  })
  return Response.json(cats)
}

export async function POST(req: Request) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const cat = await prisma.category.create({ data: body })
  return Response.json(cat, { status: 201 })
}
