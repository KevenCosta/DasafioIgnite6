import { app } from "../../../../app"
import request from "supertest"
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Create user controller", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()

  })
  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);
    await connection.close();
  })

  it("Should be able to create a new user", async ()=>{
      const response = await request(app)
      .post("/api/v1/users")
      .send({
        name: "userName",
        email: "emailUser",
        password: "userPassword"
      })
      .expect(201)

  });

  it("Should not be able to create a new user with email exist", async ()=>{
    const response = await request(app)
    .post("/api/v1/users")
    .send({
      name: "userName",
      email: "emailUser",
      password: "userPassword"
    })
    expect(response.status).toBe(400)
    expect(response.error).toBeInstanceOf(Error)

});

})
