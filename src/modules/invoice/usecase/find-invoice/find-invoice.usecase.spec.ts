import Address from '../../../@shared/domain/value-object/address'
import InvoiceItem from '../../domain/invoice-item.entity'
import Invoice from '../../domain/invoice.entity'
import FindInvoiceUseCase from './find-invoice.usecase'

const address = new Address('Street 1', 'Number 1', 'Complement 1', 'City 1', 'State 1', 'ZipCode 1')
const invoice = new Invoice({
  id: '1',
  name: 'Invoice 1',
  document: 'Invoice 1 document',
  address: address,
  items: [
    new InvoiceItem({
      id: '1',
      name: 'Item 1',
      price: 100,
    }),
    new InvoiceItem({
      id: '2',
      name: 'Item 2',
      price: 200,
    }),
  ],
})

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  }
}

describe('FindInvoiceUseCase test', () => {
  it('should find a invoice', async () => {
    const gateway = MockRepository()
    const usecase = new FindInvoiceUseCase(gateway)

    gateway.find.mockReturnValue(invoice)
    const response = await usecase.execute({ id: '1' })

    expect(gateway.find).toHaveBeenCalled()
    expect(gateway.find).toHaveBeenCalledWith('1')
    expect(response).toEqual({
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
    })
  })

  it('should not find a invoice', async () => {
    const gateway = MockRepository()
    const usecase = new FindInvoiceUseCase(gateway)

    expect(async () => {
      await usecase.execute({ id: '2' })
    }).rejects.toThrow('Invoice not found')
  })
})
