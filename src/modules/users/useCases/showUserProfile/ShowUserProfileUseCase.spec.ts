import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ICreateUserDTO } from "../createUser/ICreateUserDTO"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

let inMemoryUserRepository: InMemoryUsersRepository
let createUserUseCase : CreateUserUseCase
let showUserUseCase: ShowUserProfileUseCase

describe("Show user profile", ()=>{

  beforeEach( async()=>{

    inMemoryUserRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    showUserUseCase = new ShowUserProfileUseCase(inMemoryUserRepository)

  })

  it("Should be able to show user's profile",async()=>{
    const user:ICreateUserDTO = {
      name: "nameUser",
      email : "emailUser",
      password : "senhaUser"
    }
    const userRetorno = await createUserUseCase.execute(user)
    const user_id = typeof(userRetorno.id) === 'string'
      ? userRetorno.id : ''

    if(user_id == ''){
      throw new AppError("Error in return of create user")}

    const userProfile = await showUserUseCase.execute(
     user_id)

     expect(userProfile).toHaveProperty("id")
     expect(userProfile).toHaveProperty("name")
  })

  it("Should not be able to show user's profile with user id with error",
  async()=>{
    const user:ICreateUserDTO = {
      name: "nameUser",
      email : "emailUser",
      password : "senhaUser"
    }
    const userRetorno = await createUserUseCase.execute(user)
    const user_id = typeof(userRetorno.id) === 'string'
      ? '' : ''//passa user_id vazio para forçar erro

    expect(async()=>{
    const userProfile = await showUserUseCase.execute(
     user_id)

    }).rejects.toBeInstanceOf(AppError)
  })

});
