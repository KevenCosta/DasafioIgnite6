import { inject, injectable } from "tsyringe";
import { AppError } from "../../../../shared/errors/AppError";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";

interface IRequest {
  user_id_send:string
  description:string
  amount:number
  user_id_to:string
}

@injectable()
class TransferFoundsUseCase {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ){}
  async execute({
    user_id_send,
    description,
    amount,
    user_id_to
  }:IRequest){
    const getUserBalance = await this.statementsRepository
    .getUserBalance({user_id:user_id_send})

    if(!getUserBalance){
      throw new AppError("Saldo inexistente!")
    }

    if(getUserBalance.balance < amount){
      throw new AppError("Saldo insuficiente!")
    }

  }
}

export {TransferFoundsUseCase}
