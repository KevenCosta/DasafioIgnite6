import { app } from "../../../../app"
import request from "supertest"
import { Connection, createConnection } from "typeorm";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
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
        user_id: id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
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
      .set({
        Authorization: `Bearer ${token}`
      })

      expect(getBalance.status).toBe(200)

  });

  it("Should not be able to get balance of user statement "+
  "with incorrect token",
  async ()=>{

      const getBalance = await request(app)
      .get("/api/v1/statements/balance")
      .set({
        Authorization: `Bearer ${'tokenError'}`
      })

      expect(getBalance.status).toBe(401)
      expect(getBalance.error).toBeInstanceOf(Error)
  });

});
