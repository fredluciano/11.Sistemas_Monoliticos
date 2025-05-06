import { app } from "../express";
import { sequelize, setupDb } from "../../../infrastructure/db/setup.database";
import request from "supertest";

describe("E2E test for invoice", () => {
  beforeAll(async () => {
    await setupDb()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it("should find an invoice", async () => {

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
    const checkoutResponse = await request(app)
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

    const id = checkoutResponse.body.invoiceId
    const invoiceResponse = await request(app)
      .get(`/invoice/${id}`)
    expect(invoiceResponse.status).toBe(200)
    expect(invoiceResponse.body).toBeDefined()
    expect(invoiceResponse.body.id).toBe(id)
    expect(invoiceResponse.body.total).toBe(300)
    expect(invoiceResponse.body.name).toBe("Client 1")
    expect(invoiceResponse.body.document).toBe("123456789")
    expect(invoiceResponse.body.address.street).toBe("Street 1")
    expect(invoiceResponse.body.address.number).toBe("123")
    expect(invoiceResponse.body.address.complement).toBe("Complement 1")
    expect(invoiceResponse.body.address.city).toBe("City 1")
    expect(invoiceResponse.body.address.state).toBe("State 1")
    expect(invoiceResponse.body.address.zipCode).toBe("12345678")
    expect(invoiceResponse.body.items).toBeDefined()
    expect(invoiceResponse.body.items.length).toBe(2)
    expect(invoiceResponse.body.items[0].id).toBeDefined()
    expect(invoiceResponse.body.items[0].name).toBe("Product 1")
    expect(invoiceResponse.body.items[0].price).toBe(100)
    expect(invoiceResponse.body.items[1].id).toBeDefined()
    expect(invoiceResponse.body.items[1].name).toBe("Product 2")
    expect(invoiceResponse.body.items[1].price).toBe(200)
  })
})