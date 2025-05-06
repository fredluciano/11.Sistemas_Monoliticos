import { app } from "../express";
import { sequelize, setupDb } from "../../../infrastructure/db/setup.database";
import request from "supertest";

describe("E2E test for clients", () => {
  beforeAll(async () => {
    await setupDb()
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it("should post clients", async () => {
    const response = await request(app)
      .post("/clients")
      .send({
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

      expect(response.status).toBe(201)
  })

  it("should find a client by id", async () => {

    const input = {
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
    }
    const postResponse = await request(app)
      .post("/clients")
      .send(input)

      expect(postResponse.status).toBe(201)

      const getResponse = await request(app)
      .get("/clients/cli_1")
      .expect(200)

      expect(getResponse.body.id).toBe(input.id)
      expect(getResponse.body.name).toBe(input.name)
      expect(getResponse.body.email).toBe(input.email)
      expect(getResponse.body.document).toBe(input.document)
      expect(getResponse.body.address._street).toBe(input.address.street)
      expect(getResponse.body.address._number).toBe(input.address.number)
      expect(getResponse.body.address._complement).toBe(input.address.complement)
      expect(getResponse.body.address._city).toBe(input.address.city)
      expect(getResponse.body.address._state).toBe(input.address.state)
      expect(getResponse.body.address._zipCode).toBe(input.address.zipCode)
  })
})