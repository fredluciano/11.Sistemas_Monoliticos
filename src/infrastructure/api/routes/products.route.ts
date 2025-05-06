import express, {Request, Response} from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";

export const productRoute = express.Router();

productRoute.post("/products", async (req: Request, res: Response) => {
  const productAdm = ProductAdmFacadeFactory.create();

  productAdm
    .addProduct(req.body)
    .then(result => res.status(201).send(result))
    .catch(error => res.status(500).send(error))
})