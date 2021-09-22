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
let statement_id:string;

describe("Get statement operation", ()=>{

  beforeAll(async()=>{
    connection = await createConnection()
  })

  afterAll(async()=>{
    await connection.query(`
    DELETE FROM USERS
    WHERE USERS.NAME = 'userName'`);
    await connection.close();
  })

  it("Should be able to get statement",
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

      const responseDeposit = await request(app)
      .post("/api/v1/statements/deposit")
      .send({
        user_id: responseAuthenticated.body.user.id,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "insertStatementTest"
      }).set({
        Authorization: `Bearer ${responseAuthenticated.body.token}`
      })

      statement_id = responseDeposit.body.id
      const responseGetStatement = await request(app)
      .get("/api/v1/statements/:statement_id")
      .send({
        user_id: responseDeposit.body.user_id,
        statement_id: statement_id
      })
      //console.log(getBalance.error)
      //expect(responseDeposit.status).toBe(201)
    });

  it("Should not be able to get statement with incorrect user",
    async ()=>{

      const responseGetStatement = await request(app)
      .get("/api/v1/statements/:statement_id")
      .send({
        user_id: 'userIdError',
        statement_id: statement_id
      })
      //console.log(getBalance.error)
      //expect(responseDeposit.status).toBe(201)
    });

  it("Should not be able to get statement with incorrect statement",
    async ()=>{

      const responseGetStatement = await request(app)
      .get("/api/v1/statements/:statement_id")
      .send({
        user_id: id,
        statement_id: 'statementIdError'
      })
      //console.log(getBalance.error)
      //expect(responseDeposit.status).toBe(201)
    });

  });
