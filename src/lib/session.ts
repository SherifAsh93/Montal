import 'server-only'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.SESSION_SECRET!
const encodedKey = new TextEncoder().encode(secretKey)

export async function createAdminSession() {
  const token = await new SignJWT({ role: 'ADMIN' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('8h')
    .sign(encodedKey)
  const cookieStore = await cookies()
  cookieStore.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })
}

export async function getAdminSession() {
  try {
    const cookieStore = await cookies()
    const raw = cookieStore.get('admin_session')?.value
    if (!raw) return null
    const { payload } = await jwtVerify(raw, encodedKey, { algorithms: ['HS256'] })
    return payload.role === 'ADMIN' ? payload : null
  } catch {
    return null
  }
}

export async function deleteAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}
