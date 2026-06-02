import { prisma } from '@/lib/prisma'
import { getAdminSession } from '@/lib/session'

export async function GET() {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const banners = await prisma.banner.findMany({ orderBy: { sortOrder: 'asc' } })
  return Response.json(banners)
}

export async function POST(req: Request) {
  const session = await getAdminSession()
  if (!session) return Response.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const banner = await prisma.banner.create({ data: body })
  return Response.json(banner, { status: 201 })
}
