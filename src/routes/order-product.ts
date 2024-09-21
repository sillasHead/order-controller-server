import { Hono } from 'hono'
import { prisma } from '../lib/prisma'
import { z } from 'zod'

const orderProduct = new Hono()
orderProduct
  .get('/', async (c) => {
    const orderProducts = await prisma.orderProduct.findMany()
    return c.json(orderProducts)
  })

  .post('/', async (c) => {
    const bodySchema = z.object({
      quantity: z.number(),
      price: z.number(),
      productId: z.number(),
      orderId: z.number(),
    })

    const body = await c.req.json()

    const orderProduct = await prisma.orderProduct.create({
      data: bodySchema.parse(body),
    })

    return c.json(orderProduct, 201)
  })

  .put('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      quantity: z.number(),
      price: z.number(),
      productId: z.number(),
      orderId: z.number(),
    })

    const body = await c.req.json()

    const orderProduct = await prisma.orderProduct.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(orderProduct, 200)
  })

  .patch('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      quantity: z.number().optional(),
      price: z.number().optional(),
      productId: z.number().optional(),
      orderId: z.number().optional(),
    })

    const body = await c.req.json()

    const orderProduct = await prisma.orderProduct.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(orderProduct, 200)
  })

  .delete('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    await prisma.orderProduct.delete({
      where: { id },
    })

    return c.text('OrderProduct deleted', 204)
  })

export default orderProduct
