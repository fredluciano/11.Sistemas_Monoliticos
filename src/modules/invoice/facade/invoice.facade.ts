import FindInvoiceUseCase from '../usecase/find-invoice/find-invoice.usecase'

import GenerateInvoiceUseCase from '../usecase/generate-invoice/generate-invoice.usecase'
import InvoiceFacadeInterface, {
  FindInvoiceFacadeInputDTO,
  FindInvoiceFacadeOutputDTO,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from './invoice.facade.interface'

type InvoiceFacadeProps = {
  generateInvoiceUseCase: GenerateInvoiceUseCase
  findInvoiceUseCase: FindInvoiceUseCase
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _generateInvoiceUseCase: GenerateInvoiceUseCase
  private _findInvoiceUseCase: FindInvoiceUseCase

  constructor(props: InvoiceFacadeProps) {
    this._generateInvoiceUseCase = props.generateInvoiceUseCase
    this._findInvoiceUseCase = props.findInvoiceUseCase
  }

  async generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
    return await this._generateInvoiceUseCase.execute(input)
  }

  async findInvoice(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
    return await this._findInvoiceUseCase.execute(input)
  }
}
