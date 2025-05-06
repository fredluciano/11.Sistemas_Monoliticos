import express, {Request, Response} from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoce.facade.factory";

export const invoiceRoute = express.Router()

invoiceRoute.get("/invoice/:id", async (req: Request, res: Response) => {
  const invoice = InvoiceFacadeFactory.create()
  invoice
    .findInvoice({id: req.params.id})
    .then(result => res.status(200).send(result))
    .catch(error => {
      console.log(error)
      res.status(500).send(error)
    })

})