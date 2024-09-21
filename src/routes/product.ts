import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const product = new Hono()
product
  .get('/', async (c) => {
    const products = await prisma.product.findMany()
    return c.json(products)
  })

  .post('/', async (c) => {
    const bodySchema = z.object({
      name: z.string(),
    })

    const body = await c.req.json()

    const product = await prisma.product.create({
      data: bodySchema.parse(body),
    })

    return c.json(product, 201)
  })

  .put('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      name: z.string(),
    })

    const body = await c.req.json()

    const product = await prisma.product.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(product, 200)
  })

  .delete('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    await prisma.product.delete({
      where: { id },
    })

    return c.text('Product deleted', 204)
  })

export default product
