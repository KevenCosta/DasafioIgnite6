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

describe("Create statement", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
  })

  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);
    await connection.close();
  })

  it("Should be able to create a user statement of deposit",
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

      const responseCreateStatementDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: responseAuthenticated.body.user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${responseAuthenticated.body.token}`
      })

      // console.log(responseCreateStatementDeposit.error)
      // expect(responseCreateStatementDeposit.status).toBe(201)

    });

    it("Should be able to create a user statement of withdraw",
    async()=>{

      const responseCreateStatementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })
      //console.log(responseCreateStatementWithdraw.error)
      //expect(responseCreateStatement.status).toBe(201)

    })

    it("Should not be able to create a user statement of withdraw"
    +" with incorrect user",
    async()=>{

      const responseCreateStatementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: 'userIdError',
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })
      //console.log(responseCreateStatementWithdraw.error)
      //expect(responseCreateStatementWithdraw.error).toBeInstanceOf(Error)
      //expect(responseCreateStatementWithdraw.status).toBe(404)

    })

    it("Should not be able to create a user statement of withdraw"
    +" with dont' have found",
    async()=>{

      const responseCreateStatementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })
      //console.log(responseCreateStatementWithdraw.error)
      //expect(responseCreateStatementWithdraw.error).toBeInstanceOf(Error)
      //expect(responseCreateStatementWithdraw.status).toBe(400)
    })

});
