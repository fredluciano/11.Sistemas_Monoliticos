import { app } from "../express";
import { sequelize, setupDb } from "../../../infrastructure/db/setup.database";
import request from "supertest";

describe("E2E test for product", () => {
  beforeAll(async () => {
    await setupDb()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it("should create a product", async () => {
    const response = await request(app)
      .post("/products")
      .send({
        name: "Product 1",
        description: "Product 1 description",
        purchasePrice: 100,
        stock: 10
      })
    expect(response.status).toBe(201)
  })
})