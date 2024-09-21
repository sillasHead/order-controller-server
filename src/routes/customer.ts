import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const customer = new Hono()
customer
  .get('/', async (c) => {
    const customers = await prisma.customer.findMany()
    return c.json(customers)
  })

  .post('/', async (c) => {
    const bodySchema = z.object({
      name: z.string().max(100),
      phone: z.string().max(20).optional(),
      address: z.string().max(150).optional(),
      addressNumber: z.string().max(10).optional(),
      complement: z.string().max(20).optional(),
      zip: z.string().max(10).optional(),
      recipient: z.string().max(100).optional(),
    })

    const body = await c.req.json()

    const customer = await prisma.customer.create({
      data: bodySchema.parse(body),
    })

    return c.json(customer, 201)
  })

  .put('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      name: z.string().max(100),
      phone: z.string().max(20).optional(),
      address: z.string().max(150).optional(),
      addressNumber: z.string().max(10).optional(),
      complement: z.string().max(20).optional(),
      zip: z.string().max(10).optional(),
      recipient: z.string().max(100).optional(),
    })

    const body = await c.req.json()

    const customer = await prisma.customer.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(customer, 200)
  })

  .patch('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    const bodySchema = z.object({
      name: z.string().max(100).optional(),
      phone: z.string().max(20).optional(),
      address: z.string().max(150).optional(),
      addressNumber: z.string().max(10).optional(),
      complement: z.string().max(20).optional(),
      zip: z.string().max(10).optional(),
      recipient: z.string().max(100).optional(),
    })

    const body = await c.req.json()

    const customer = await prisma.customer.update({
      where: { id },
      data: bodySchema.parse(body),
    })

    return c.json(customer, 200)
  })

  .delete('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    await prisma.customer.delete({
      where: { id },
    })

    return c.text('Customer deleted', 204)
  })

export default customer
