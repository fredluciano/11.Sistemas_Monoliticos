import Address from '../../@shared/domain/value-object/address'
import InvoiceItem from '../domain/invoice-item.entity'
import Invoice from '../domain/invoice.entity'
import InvoiceGateway from '../gateway/invoice.gateway'
import { InvoiceItemModel } from './invoice-item.model'
import { InvoiceModel } from './invoice.model'

export default class InvoiceRepository implements InvoiceGateway {
  async generate(invoice: Invoice): Promise<void> {
    const invoiceModel = await InvoiceModel.create({
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipcode: invoice.address.zipCode,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    for (const item of invoice.items) {
      await InvoiceItemModel.create({
        id: item.id.id,
        invoiceId: invoiceModel.id,
        name: item.name,
        price: item.price,
      })
    }
  }
  async find(id: string): Promise<Invoice> {
    const result = await InvoiceModel.findOne({
      where: {
        id: id,
      },
    })

    const address = new Address(
      result.street,
      result.number,
      result.complement,
      result.city,
      result.state,
      result.zipcode
    )

    const itemModels = await InvoiceItemModel.findAll({
      where: {
        invoiceId: result.id,
      },
    })

    const items = itemModels.map((item) => new InvoiceItem({ id: item.id, name: item.name, price: item.price }))
    return new Invoice({
      id: result.id,
      name: result.name,
      document: result.document,
      address: address,
      items: items,
    })
  }
}
