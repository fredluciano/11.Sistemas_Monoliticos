import InvoiceGateway from '../../gateway/invoice.gateway'
import { FindInvoiceUseCaseInputDTO, FindInvoiceUseCaseOutputDTO } from './find-invoice.dto'

export default class FindInvoiceUseCase {
  private _invoiceGateway: InvoiceGateway

  constructor(invoiceGateway: InvoiceGateway) {
    this._invoiceGateway = invoiceGateway
  }

  async execute(input: FindInvoiceUseCaseInputDTO): Promise<FindInvoiceUseCaseOutputDTO> {
    const invoice = await this._invoiceGateway.find(input.id)
    if (!invoice) {
      throw new Error('Invoice not found')
    }
    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => ({
        id: item.id.id,
        name: item.name,
        price: item.price,
      })),
      total: invoice.items.reduce((acc, item) => acc + item.price, 0),
      createdAt: invoice.createdAt,
    }
  }
}
