import { app } from "../../../../app"
import request from "supertest"
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Authenticate user controller", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
  })

  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);
    await connection.close();
  })

  it("Should be able to authenticate a user", async ()=>{
      await request(app)
      .post("/api/v1/users")
      .send({
        name: "userName",
        email: "emailUser",
        password: "userPassword"
      })

      const responseAuthenticated = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "emailUser",
        password: "userPassword"
      })

      expect(responseAuthenticated.body.token.length).toBe(515)
      expect(responseAuthenticated.status).toBe(200);
      expect(responseAuthenticated.body.user).toHaveProperty("name");
  });

  it("Should not be able to authenticate a incorrect user", async ()=>{
    await request(app)
    .post("/api/v1/users")
    .send({
      name: "userName",
      email: "emailUser",
      password: "userPassword"
    })

    const responseAuthenticated = await request(app)
    .post("/api/v1/sessions")
    .send({
      email: "emailUserError",
      password: "userPassword"
    })
    expect(responseAuthenticated.status).toBe(401)
});

})
