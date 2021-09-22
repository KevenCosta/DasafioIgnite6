import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "./CreateStatementUseCase"

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase : CreateUserUseCase
let createStatementUseCase : CreateStatementUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'

}

describe("Create Statement",()=>{
  beforeEach(async()=>{
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository)
  })

  it("Should be able to create an statement",
  async()=>{
    const user = {
      name: "nameUser",
      email : "emailUser",
      password : "senhaUser"
    }
    const createdUser = await createUserUseCase.execute(user)

    const type = OperationType.DEPOSIT;
    const amount = 123;
    const description = 'test'
    const user_id = typeof(createdUser.id) === 'string'
      ? createdUser.id : ''
    const sender_id = user_id//''

    if(user_id == ''){
      throw new AppError("Error in return of create user")}

    const createdStatement = await createStatementUseCase.execute(
      {user_id,
      type,
      amount,
      description,
      sender_id}
      )

    expect(createdStatement).toHaveProperty("id")
    expect(createdStatement).toHaveProperty("user_id")
    expect(createdStatement.type).toEqual("deposit")
  })

  it("Should not be able to create an statement with incorrect user",
  async()=>{
    expect(async()=>{
      const user = {
        name: "nameUser",
        email : "emailUser",
        password : "senhaUser"
      }
      const createdUser = await createUserUseCase.execute(user)

      const type = OperationType.DEPOSIT;
      const amount = 123;
      const description = 'test'
      const user_id = typeof(createdUser.id) === 'string'
        ? 'error' : ''
        const sender_id = user_id//''

      await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description,
        sender_id}
        )
    }).rejects.toBeInstanceOf(AppError)
  })

  it("Should not be able to create an statement of withdraw "
  +"if user don't have founds",
  async()=>{
    expect(async()=>{
      const user = {
        name: "nameUser",
        email : "emailUser",
        password : "senhaUser"
      }
      const createdUser = await createUserUseCase.execute(user)

      let type = OperationType.DEPOSIT;
      let amount = 100;
      let description = 'insert1'
      let user_id = typeof(createdUser.id) === 'string'
        ? createdUser.id : ''
        const sender_id = user_id//''
      if(user_id == ''){
        throw new AppError("Error in return of create user")}

      await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description,
        sender_id}
        )

      type = OperationType.WITHDRAW
      amount = 120
      description = 'insert2'

      await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description,
        sender_id}
        )
    }).rejects.toBeInstanceOf(AppError)
  })

})
