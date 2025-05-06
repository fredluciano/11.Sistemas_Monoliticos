import { Sequelize } from 'sequelize-typescript'
import { InvoiceItemModel } from '../repository/invoice-item.model'
import { InvoiceModel } from '../repository/invoice.model'
import InvoiceFacadeFactory from '../factory/invoce.facade.factory'

describe('Invoice Facade test', () => {
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
    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Invoice 1',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 10,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 20,
        },
      ],
    }

    const output = await facade.generateInvoice(input)

    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.document).toBe(input.document)
    expect(output.street).toBe(input.street)
    expect(output.number).toBe(input.number)
    expect(output.complement).toBe(input.complement)
    expect(output.city).toBe(input.city)
    expect(output.state).toBe(input.state)
    expect(output.zipCode).toBe(input.zipCode)
    expect(output.items.length).toBe(2)
  })

  it('should find an invoice', async () => {
    const facade = InvoiceFacadeFactory.create()

    const input = {
      id: '1',
      name: 'Invoice 1',
      document: '123456789',
      street: 'Street 1',
      number: '123',
      complement: 'Complement 1',
      city: 'City 1',
      state: 'State 1',
      zipCode: '12345678',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 10,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 20,
        },
      ],
    }

    const output = await facade.generateInvoice(input)

    const invoice = await facade.findInvoice({ id: output.id })
    expect(invoice.id).toBe(output.id)
    expect(invoice.name).toBe(output.name)
    expect(invoice.document).toBe(output.document)
    expect(invoice.address.street).toBe(output.street)
    expect(invoice.address.number).toBe(output.number)
    expect(invoice.address.complement).toBe(output.complement)
    expect(invoice.address.city).toBe(output.city)
    expect(invoice.address.state).toBe(output.state)
    expect(invoice.address.zipCode).toBe(output.zipCode)
    expect(invoice.items.length).toBe(2)
  })
})
