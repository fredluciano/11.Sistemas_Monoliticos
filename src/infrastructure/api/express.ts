import express, { Express } from 'express'
import { productRoute } from './routes/products.route'
import { setupDb } from '../db/setup.database'
import { catalogRoute } from './routes/catalog.route'
import { clientsRoute } from './routes/clients.route'
import { checkoutRoute } from './routes/checkout.route'
import { invoiceRoute } from './routes/invoice.route'

export const app: Express = express()
app.use(express.json())

app.use(productRoute)
app.use(catalogRoute)
app.use(clientsRoute)
app.use(checkoutRoute)
app.use(invoiceRoute)

setupDb()