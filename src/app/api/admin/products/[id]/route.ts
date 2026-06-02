import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const product = await prisma.product.findUnique({ where: { id }, include: { category: true } })
  if (!product) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(product)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const product = await prisma.product.update({ where: { id }, data: body })
  return Response.json(product)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.product.delete({ where: { id } })
  return Response.json({ ok: true })
}
