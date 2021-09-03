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
      .send({
        user_id: responseAuthenticated.body.user.id
      }).set({
        Authorization: `Bearer ${responseAuthenticated.body.token}`
      })

      console.log(responseShowUserProfile.error)
      //expect(responseShowUserProfile.status).toBe(200)
      //expect(responseShowUserProfile.body.user).toHaveProperty("name");
    });

    it("Should not be able to show a user profile with incorrect user",
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
      .send({
        user_id: 'idUserError'
      }).set({
        Authorization: `Bearer ${responseAuthenticated.body.token}`
      })

      //console.log(responseShowUserProfile.error)
      //expect(responseShowUserProfile.status).toBe(404)

    });

});
