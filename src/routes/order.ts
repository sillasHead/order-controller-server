import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const order = new Hono()
order
  .get('/', async (c) => {
    const orders = await prisma.order.findMany()
    return c.json(orders)
  })

  .post('/', async (c) => {
    const bodySchema = z.object({
      date: z.string().date(),
      maxTimeDelivery: z.string().time().optional(),
      minTimeDelivery: z.string().time().optional(),
      orderStatus: z.enum(['PENDING', 'DELIVERED', 'CANCELED']),
      customerId: z.number(),
      userId: z.number(),
    })

    const body = await c.req.json()

    const order = await prisma.order.create({
      data: bodySchema.parse(body),
    })

    return c.json(order, 201)
  })

  .put('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      date: z.string().date(),
      maxTimeDelivery: z.string().time().optional(),
      minTimeDelivery: z.string().time().optional(),
      orderStatus: z.enum(['PENDING', 'DELIVERED', 'CANCELED']),
      customerId: z.number(),
      userId: z.number(),
    })

    const body = await c.req.json()

    const order = await prisma.order.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(order, 200)
  })

  .patch('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      date: z.string().date().optional(),
      maxTimeDelivery: z.string().time().optional(),
      minTimeDelivery: z.string().time().optional(),
      orderStatus: z.enum(['PENDING', 'DELIVERED', 'CANCELED']).optional(),
      customerId: z.number().optional(),
      userId: z.number().optional(),
    })

    const body = await c.req.json()

    const order = await prisma.order.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(order, 200)
  })

  .delete('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    await prisma.order.delete({
      where: { id },
    })

    return c.text('Order deleted', 204)
  })

export default order
