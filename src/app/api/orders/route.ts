import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const body = await req.json()
  const { orderNumber, customerName, customerPhone, city, address, notes, subtotal, shipping, total, items } = body

  if (!customerName || !customerPhone || !city || !address || !items?.length) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName,
      customerPhone,
      city,
      address,
      notes,
      subtotal,
      shipping,
      total,
      items: {
        create: items.map((i: { productId: string; name: string; price: number; quantity: number; image?: string }) => ({
          productId: i.productId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
      },
    },
  })
  return Response.json(order, { status: 201 })
}
