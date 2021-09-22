import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryStatementRepository : InMemoryStatementsRepository
let createUserUseCase : CreateUserUseCase
let createStatementUseCase : CreateStatementUseCase
let getStatementOperationUseCase : GetStatementOperationUseCase


describe("Get Statement operation",()=>{

  beforeEach(async()=>{
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository)
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository)
  })

  it("Should be able to find statement operation", async()=>{
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

    if(user_id == ''){
      throw new AppError("Error in return of create user")}

    await createStatementUseCase.execute(
      {user_id,
      type,
      amount,
      description}
      )

      type = OperationType.WITHDRAW
      amount = 50
      description = 'insert2'

    const createdStatement = await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description}
        )

    let statement_id = typeof(createdStatement.id) === 'string'
      ? createdStatement.id : ''

    if(statement_id == ''){
      throw new AppError("Error in return of create user")}

    const getStatement = await getStatementOperationUseCase.execute({
      user_id,
      statement_id
    })

    expect(getStatement).toHaveProperty("id")
    expect(getStatement).toHaveProperty("user_id")
    expect(getStatement.user_id).toEqual(user_id)
    expect(getStatement.amount).toEqual(amount)
  })

  it("Should not be able to find statement operation with incorrect statement",
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

      if(user_id == ''){
        throw new AppError("Error in return of create user")}

      await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description}
        )

        type = OperationType.WITHDRAW
        amount = 50
        description = 'insert2'

      const createdStatement = await createStatementUseCase.execute(
          {user_id,
          type,
          amount,
          description}
          )

      let statement_id = typeof(createdStatement.id) === 'string'
        ? createdStatement.id : ''

      statement_id = 'erro'

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id})

    }).rejects.toBeInstanceOf(AppError)

  })

  it("Should not be able to find statement operation with incorrect user",
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

      if(user_id == ''){
        throw new AppError("Error in return of create user")}

      await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description}
        )

        type = OperationType.WITHDRAW
        amount = 50
        description = 'insert2'

      const createdStatement = await createStatementUseCase.execute(
          {user_id,
          type,
          amount,
          description}
          )

      let statement_id = typeof(createdStatement.id) === 'string'
        ? createdStatement.id : ''

      user_id = 'erro'

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id})

    }).rejects.toBeInstanceOf(AppError)

  })

})
