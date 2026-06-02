import { createAdminSession } from '@/lib/session'

export async function POST(req: Request) {
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: 'Invalid password' }, { status: 401 })
  }
  await createAdminSession()
  return Response.json({ ok: true })
}
