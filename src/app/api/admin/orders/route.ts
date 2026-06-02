import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  })
  return Response.json(orders)
}
