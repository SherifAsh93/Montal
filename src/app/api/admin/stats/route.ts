import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  const [products, orders, pendingOrders] = await Promise.all([
    prisma.product.count({ where: { active: true } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
  ])

  const revenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: { in: ['CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'] } },
  })

  return Response.json({ products, orders, pendingOrders, revenue: revenue._sum.total ?? 0 })
}
