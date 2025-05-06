import Address from '../../../@shared/domain/value-object/address'
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from '../../domain/invoice.entity'
import InvoiceGateway from '../../gateway/invoice.gateway'
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from './generate-invoice.dto'

export default class GenerateInvoiceUseCase {
  private _invoiceGateway: InvoiceGateway

  constructor(invoiceGateway: InvoiceGateway) {
    this._invoiceGateway = invoiceGateway
  }

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {
    const items = input.items.map(
      (item) =>
        new InvoiceItem({
          id: item.id,
          name: item.name,
          price: item.price,
        })
    )
    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address: new Address(input.street, input.number, input.complement, input.city, input.state, input.zipCode),
      items: items,
    })
    await this._invoiceGateway.generate(invoice)

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      total: invoice.items.reduce((acc, item) => acc + item.price, 0),
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
    }
  }
}
