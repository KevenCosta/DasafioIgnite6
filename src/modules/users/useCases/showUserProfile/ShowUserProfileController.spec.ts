import { app } from "../../../../app"
import request from "supertest"
import { Connection, createConnection } from "typeorm";

let connection: Connection;
describe("Show user profile", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
  })

  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);
    await connection.close();
  })

  it("Should be able to show a user profile", async ()=>{
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

      const responseShowUserProfile = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${responseAuthenticated.body.token}`
      })

      expect(responseShowUserProfile.status).toBe(200)
      expect(responseShowUserProfile.body).toHaveProperty("name");
    });

    it("Should not be able to show a user profile with incorrect token",
    async ()=>{
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

      const responseShowUserProfile = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${'tokenError'}`
      })

      expect(responseShowUserProfile.status).toBe(401)

    });

});
