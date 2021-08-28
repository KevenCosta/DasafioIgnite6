import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user",()=>{
  beforeEach(async()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository()
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  })

  it("Should be able to authenticate an user",async ()=>{
    const user:ICreateUserDTO = {
      name: "nameUser",
      email : "emailUser",
      password : "senhaUser"
    }
    await createUserUseCase.execute(user)
    const authenticateUser = await authenticateUserUseCase.execute(
      {email:user.email,
      password: user.password})

    expect(authenticateUser).toHaveProperty("token")
    expect(authenticateUser).toHaveProperty("user")
    expect(authenticateUser.user.name).toEqual(user.name)
  })

  it("Should not be able to authenticate an user with incorrect password",
  async ()=>{
    expect(async()=>{
      let user:ICreateUserDTO = {
        name: "nameUser",
        email : "emailUser",
        password : "senhaUser"
      }
      await createUserUseCase.execute(user)
      user.password = "passwordError"
      const authenticateUser = await authenticateUserUseCase.execute(
        {email:user.email,
        password: user.password})
    }).rejects.toBeInstanceOf(AppError)

  });

});
