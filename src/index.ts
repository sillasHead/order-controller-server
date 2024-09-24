import { Hono } from 'hono'
import { cors } from 'hono/cors'
import customer from './routes/customer'
import order from './routes/order'
import orderProduct from './routes/order-product'
import product from './routes/product'
import user from './routes/user'

const app = new Hono()

app.use('*', cors())
app.route('/customer', customer)
app.route('/order-product', orderProduct)
app.route('/order', order)
app.route('/product', product)
app.route('/user', user)

export default app
