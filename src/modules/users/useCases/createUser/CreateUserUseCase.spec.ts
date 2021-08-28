import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe ("Should be able to create a user",() =>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
  })

  it("Should be able to create a new user",async ()=>{

    const user = {
      name: "userName",
      email: "emailUser",
      password: "userPassword"
    }

    const userCreated = await createUserUseCase.execute(user)
    expect(userCreated).toHaveProperty("id")
    expect(userCreated).toHaveProperty("name")
  })

  it("Should not be able to create a new user if this email user exist",async ()=>{
    expect(async()=>{
      const user = {
        name: "userName",
        email: "emailUser",
        password: "userPassword"
      }

      await createUserUseCase.execute(user)
      await createUserUseCase.execute(user)
    }).rejects.toBeInstanceOf(AppError)

  })

})
