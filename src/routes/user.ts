import { Hono } from 'hono'
import { HTTPException } from 'hono/http-exception'
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
    })

    const body = await c.req.json()
    const { name, role } = bodySchema.parse(body)

    const user = await prisma.user.create({
      data: {
        name,
        role,
      },
    })

    return c.json(user)
  })

  .delete('/:id', async (c) => {
    const paramsSchema = z.object({
      id: z.string().transform((v) => Number.parseInt(v)),
    })

    const { id } = paramsSchema.parse(c.req.param())
    console.log({ id })

    const user = await prisma.user.findUnique({
      where: { id },
    })

    if (!user) throw new HTTPException(404, { message: 'User not found' })

    await prisma.user.delete({
      where: { id },
    })

    return c.text('User deleted', 200)
  })

export default user
