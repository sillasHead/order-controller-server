import { Hono } from 'hono'
import { cors } from 'hono/cors'
import user from './routes/user'

const app = new Hono()

app.use('/api/*', cors())
app.get('/', (c) => {
  return c.text('Hello Hono!', 404)
})
app.route('/user', user)

export default app
