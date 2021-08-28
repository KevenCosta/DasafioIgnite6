import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryUserRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase : CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase : GetBalanceUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

describe("Get balance of user's amount",()=>{

  beforeEach(async()=>{
    inMemoryUserRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementsRepository)
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUserRepository
    )
  })


  it("Should be able to get balance of user's amount", async()=>{
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

    await createStatementUseCase.execute(
      {user_id,
      type,
      amount,
      description}
      )

    const getBalance = await getBalanceUseCase.execute({user_id})

    expect(getBalance.statement.length).toBe(2)
    expect(getBalance.balance).toEqual(50)
    expect(getBalance.statement[0]).toHaveProperty("id")
    expect(getBalance.statement[0]).toHaveProperty("user_id")
    expect(getBalance.statement[0].user_id)
    .toEqual(getBalance.statement[1].user_id)
  })

  it("Should not be able to get balance of user's"
   +" amount with incorrect user", async()=>{


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

      await createStatementUseCase.execute(
        {user_id,
        type,
        amount,
        description}
        )

      user_id = 'error'

      await getBalanceUseCase.execute({user_id})

    }).rejects.toBeInstanceOf(AppError)

   })

})
