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

describe("Create statement", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
  })

  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);

    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName2'`);

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
        user_id: id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })

      // console.log(responseCreateStatementDeposit.error)
      //expect(responseCreateStatementDeposit.status).toBe(201)

    });

    it("Should be able to create a user statement of withdraw",
    async()=>{

      const responseCreateStatementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })
      //console.log(responseCreateStatementWithdraw.error)
      //expect(responseCreateStatementWithdraw.status).toBe(201)

    })

    it("Should be able to create a user statement of transfer",
    async()=>{

      await request(app)
      .post("/api/v1/users")
      .send({
        name: "userName2",
        email: "emailUser2",
        password: "userPassword2"
      })

      const responseAuthenticated2 = await request(app)
      .post("/api/v1/sessions")
      .send({
        email: "emailUser2",
        password: "userPassword2"
      })

      const responseShowUserProfile = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${responseAuthenticated2.body.token}`
      })

      const responseCreateStatementTransfer= await request(app)
      .post(`/api/v1/statements/transfer/${responseShowUserProfile.body.id}`)
      .send({
        sender_id: id,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })
      console.log(responseCreateStatementTransfer.error)
      expect(responseCreateStatementTransfer.status).toBe(201)

    })

    it("Should not be able to create a user statement of withdraw"
    +" with incorrect token",
    async()=>{

      const responseCreateStatementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${'tokenError'}`
      })
      expect(responseCreateStatementWithdraw.error).toBeInstanceOf(Error)
      expect(responseCreateStatementWithdraw.status).toBe(401)

    })

    it("Should not be able to create a user statement of withdraw"
    +" with dont' have found",
    async()=>{

      const responseCreateStatementWithdraw = await request(app)
      .post("/api/v1/statements/withdraw")
      .send({
        user_id: id,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${token}`
      })
      expect(responseCreateStatementWithdraw.error).toBeInstanceOf(Error)
      expect(responseCreateStatementWithdraw.status).toBe(400)
    })

});
