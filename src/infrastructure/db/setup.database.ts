import OrderItemModel from '../../modules/checkout/repository/order-item.model'
import OrderModel from '../../modules/checkout/repository/order.model'
import { ClientModel } from '../../modules/client-adm/repository/client.model'
import TransactionModel from '../../modules/payment/repository/transaction.model'
import { ProductModel as AdmProductModel } from '../../modules/product-adm/repository/product.model'
import ProductModel from '../../modules/store-catalog/repository/product.model'
import { Sequelize } from 'sequelize-typescript'
import { migrator } from './migrator'
import { Umzug } from 'umzug'
import { InvoiceModel } from '../../modules/invoice/repository/invoice.model'
import { InvoiceItemModel } from '../../modules/invoice/repository/invoice-item.model'

export let sequelize: Sequelize
export let migration: Umzug<any>;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: ':memory:',
    logging: false,
  })
  migration = migrator(sequelize)
  await migration.up()
  sequelize.addModels([AdmProductModel, ProductModel, OrderItemModel, OrderModel, ClientModel, TransactionModel, InvoiceModel, InvoiceItemModel])
  await sequelize.sync()
}

export { setupDb }