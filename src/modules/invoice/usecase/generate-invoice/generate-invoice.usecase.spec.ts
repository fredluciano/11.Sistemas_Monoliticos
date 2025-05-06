import InvoiceRepository from '../../repository/invoice.repository'
import GenerateInvoiceUseCase from './generate-invoice.usecase'

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  }
}

describe('GenerateInvoiceUseCase test', () => {
  it('should generate a invoice', async () => {
    const gateway = MockRepository()
    const usecase = new GenerateInvoiceUseCase(gateway)

    usecase.execute({
      name: 'Invoice 1',
      document: 'Invoice 1 document',
      street: 'Invoice 1 street',
      number: 'Invoice 1 number',
      complement: 'Invoice 1 complement',
      city: 'Invoice 1 city',
      state: 'Invoice 1 state',
      zipCode: 'Invoice 1 zipCode',
      items: [
        {
          id: '1',
          name: 'Item 1',
          price: 100,
        },
        {
          id: '2',
          name: 'Item 2',
          price: 200,
        },
      ],
    })

    expect(gateway.generate).toHaveBeenCalled()
  })
})
