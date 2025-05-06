import express, {Request, Response} from "express";
import StoreCatalogFacadeFactory from "../../../modules/store-catalog/factory/facade.factory";

export const catalogRoute = express.Router();

catalogRoute.get("/catalog", async (req: Request, res: Response) => {
  const catalogAdm = StoreCatalogFacadeFactory.create()
  catalogAdm
    .findAll()
    .then( cat => res.status(200).send(cat))
})