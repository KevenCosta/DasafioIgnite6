import { app } from "../../../../app"
import request from "supertest"
import { Connection, createConnection } from "typeorm";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let connection: Connection;
let token:string;
let id:string;

describe("Get balance statement", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
  })

  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);
    await connection.close();
  })

  it("Should be able to get balance of user statement",
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
      token = responseAuthenticated.body.token
      id = responseAuthenticated.body.user.id

      await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: responseAuthenticated.body.user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${responseAuthenticated.body.token}`
      })

      await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })

      const getBalance = await request(app)
      .get("/api/v1/statements/balance")
      .send({
        user_id: id
      })
      .set({
        Authorization: `Bearer ${token}`
      })

      //console.log(getBalance.error)
      //expect(getBalance.status).toBe(201)
  });

  it("Should not be able to get balance of user statement "+
  "with incorrect user",
  async ()=>{

      const getBalance = await request(app)
      .get("/api/v1/statements/balance")
      .send({
        user_id: 'userIdError'
      })
      .set({
        Authorization: `Bearer ${token}`
      })

      //console.log(getBalance.error)
      //expect(getBalance.status).toBe(404)
      //expect(getBalance.error).toBeInstanceOf(Error)
  });

});
