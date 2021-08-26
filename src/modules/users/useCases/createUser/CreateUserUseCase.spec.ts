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

})
