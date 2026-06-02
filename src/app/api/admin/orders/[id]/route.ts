import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const { status } = await req.json()
  const order = await prisma.order.update({ where: { id }, data: { status } })
  return Response.json(order)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.order.delete({ where: { id } })
  return Response.json({ ok: true })
}
