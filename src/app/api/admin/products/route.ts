import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: { select: { name: true } } },
  })
  return Response.json(products)
}

export async function POST(req: Request) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const product = await prisma.product.create({ data: body })
  return Response.json(product, { status: 201 })
}

export async function DELETE(req: Request) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const { ids } = await req.json()
  await prisma.product.deleteMany({ where: { id: { in: ids } } })
  return Response.json({ ok: true })
}
