import { Sequelize } from 'sequelize-typescript'
import { InvoiceModel } from './invoice.model'
import Invoice from '../domain/invoice.entity'
import Address from '../../@shared/domain/value-object/address'
import InvoiceItem from '../domain/invoice-item.entity'
import InvoiceRepository from './invoice.repository'
import { InvoiceItemModel } from './invoice-item.model'

describe('InvoiceRepository test', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })
    await sequelize.addModels([InvoiceModel, InvoiceItemModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a invoice', async () => {
    const invoiceItem1 = new InvoiceItem({
      id: '1',
      name: 'Item 1',
      price: 10,
    })

    const invoiceItem2 = new InvoiceItem({
      id: '2',
      name: 'Item 2',
      price: 20,
    })
    const invoice = new Invoice({
      id: '1',
      name: 'Invoice 1',
      document: 'Document 1',
      address: new Address('Street 1', 'Number 1', 'Complement 1', 'City 1', 'State 1', 'ZipCode 1'),
      items: [invoiceItem1, invoiceItem2],
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const queried = await InvoiceModel.findOne({
      include: [{ model: InvoiceItemModel, as: 'items' }],
      where: {
        id: invoice.id.id,
      },
    })

    expect(queried.id).toBe(invoice.id.id)
    expect(queried.name).toBe(invoice.name)
    expect(queried.document).toBe(invoice.document)
    expect(queried.street).toBe(invoice.address.street)
    expect(queried.number).toBe(invoice.address.number)
    expect(queried.complement).toBe(invoice.address.complement)
    expect(queried.city).toBe(invoice.address.city)
    expect(queried.state).toBe(invoice.address.state)
    expect(queried.zipcode).toBe(invoice.address.zipCode)
    expect(queried.items.length).toBe(2)
    expect(queried.items[0].id).toBe(invoice.items[0].id.id)
    expect(queried.items[0].name).toBe(invoice.items[0].name)
    expect(queried.items[0].price).toBe(invoice.items[0].price)
    expect(queried.items[1].id).toBe(invoice.items[1].id.id)
    expect(queried.items[1].name).toBe(invoice.items[1].name)
    expect(queried.items[1].price).toBe(invoice.items[1].price)
  })

  it('should find an invoice', async () => {
    const invoiceItem1 = new InvoiceItem({
      id: '1',
      name: 'Item 1',
      price: 10,
    })

    const invoiceItem2 = new InvoiceItem({
      id: '2',
      name: 'Item 2',
      price: 20,
    })
    const invoice = new Invoice({
      id: '1',
      name: 'Invoice 1',
      document: 'Document 1',
      address: new Address('Street 1', 'Number 1', 'Complement 1', 'City 1', 'State 1', 'ZipCode 1'),
      items: [invoiceItem1, invoiceItem2],
    })

    const repository = new InvoiceRepository()
    await repository.generate(invoice)

    const queried = await repository.find(invoice.id.id)

    expect(queried.id.id).toBe(invoice.id.id)
    expect(queried.name).toBe(invoice.name)
    expect(queried.document).toBe(invoice.document)
    expect(queried.address.street).toBe(invoice.address.street)
    expect(queried.address.number).toBe(invoice.address.number)
    expect(queried.address.complement).toBe(invoice.address.complement)
    expect(queried.address.city).toBe(invoice.address.city)
    expect(queried.address.state).toBe(invoice.address.state)
    expect(queried.address.zipCode).toBe(invoice.address.zipCode)
    expect(queried.items.length).toBe(2)
    expect(queried.items[0].id.id).toBe(invoice.items[0].id.id)
    expect(queried.items[0].name).toBe(invoice.items[0].name)
    expect(queried.items[0].price).toBe(invoice.items[0].price)
    expect(queried.items[1].id.id).toBe(invoice.items[1].id.id)
    expect(queried.items[1].name).toBe(invoice.items[1].name)
    expect(queried.items[1].price).toBe(invoice.items[1].price)
  })
})
