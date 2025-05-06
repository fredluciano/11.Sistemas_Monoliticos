import { app } from "../express";
import { sequelize, setupDb } from "../../../infrastructure/db/setup.database";
import request from "supertest";

describe("E2E test for checkout", () => {
  beforeAll(async () => {
    await setupDb()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it("should create a checkout", async () => {

    // cria produtos
    await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 50,
        stock: 10
      })

    await request(app)
      .post("/products")
      .send({
        name: "Product 2",
        description: "Product 2 description",
        purchasePrice: 70,
        stock: 10
      })

    // cria cliente
    await request(app)
      .post("/clients")
      .send({
        id: "cli_1",
        name: "Client 1",
        email: "a@a.com",
        document: "123456789",
        address: {
          street: "Street 1",
          number: "123",
          complement: "Complement 1",
          city: "City 1",
          state: "State 1",
          zipCode: "12345678",
        }
      })

    // busca produto no catálogo
    const catalogResponse = await request(app).get("/catalog")
    const produto1 = catalogResponse.body.products[0]
    const produto2 = catalogResponse.body.products[1]

    // faz o checkout
    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "cli_1",
        products: [
          {
            productId: produto1.id,
            salesPrice: 100
          },
          {
            productId: produto2.id,
            salesPrice: 200
          }
        ]
      })
    expect(response.status).toBe(201)
  
    expect(response.body.id).toBeDefined()
    expect(response.body.invoiceId).toBeDefined()
    expect(response.body.total).toBe(300)
  })
})