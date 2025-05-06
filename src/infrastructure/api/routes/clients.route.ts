import express, {Request, Response} from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";

export const clientsRoute = express.Router();

const clientsAdm = ClientAdmFacadeFactory.create()

clientsRoute.get("/clients/:id", async (req: Request, res: Response) => {
  clientsAdm
    .find({id: req.params.id})
    .then(result => res.status(200).send(result))
    .catch(error => res.status(500).send(error))
})

clientsRoute.post("/clients", async (req: Request, res: Response) => {
    clientsAdm
      .add(req.body)
      .then(_ => res.status(201).send())
      .catch(error => res.status(500).send(error))
})
