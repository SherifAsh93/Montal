import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const banner = await prisma.banner.update({ where: { id }, data: body })
  return Response.json(banner)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.banner.delete({ where: { id } })
  return Response.json({ ok: true })
}
