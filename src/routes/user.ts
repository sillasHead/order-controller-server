import { Hono } from 'hono'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

const user = new Hono()
user
  .get('/', async (c) => {
    const users = await prisma.user.findMany()
    return c.json(users)
  })

  .post('/', async (c) => {
    const bodySchema = z.object({
      name: z.string(),
      role: z.enum(['USER', 'ADMIN']),
      email: z.string().email(),
      password: z.string(),
      oauthProvider: z.string().optional(),
      oauthId: z.string().optional(),
    })

    const body = await c.req.json()

    const user = await prisma.user.create({
      data: bodySchema.parse(body),
    })

    return c.json(user, 201)
  })

  .delete('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.coerce.number(),
    })

    const { id } = paramsSchema.parse(c.req.param())

    await prisma.user.delete({
      where: { id },
    })

    return c.text('User deleted', 204)
  })

export default user
