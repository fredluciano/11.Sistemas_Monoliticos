import { app } from "../express";
import { sequelize, setupDb } from "../../../infrastructure/db/setup.database";
import request from "supertest";

describe("E2E test for catalog", () => {
  beforeAll(async () => {
    await setupDb()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it("should list products", async () => {
    await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10
      })

    const response = await request(app)
      .get("/catalog")
    expect(response.status).toBe(200)
    
    expect(response.body.products.length).toBe(1)
    expect(response.body.products[0].id).toBeDefined()
    expect(response.body.products[0].name).toBe("Product 1")
    expect(response.body.products[0].description).toBe("Product 1 description")
  })
})