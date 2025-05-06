import express, {Request, Response} from "express";
import CheckoutFacadeFactory from "../../../modules/checkout/factory/checkout.facade.factory";

export const checkoutRoute = express.Router()

checkoutRoute.post("/checkout", async (req: Request, res: Response) => {
  const checkout = CheckoutFacadeFactory.create()
  checkout
    .placeOrder(req.body)
    .then(result => res.status(201).send(result))
    .catch(error => res.status(500).send(error))
})