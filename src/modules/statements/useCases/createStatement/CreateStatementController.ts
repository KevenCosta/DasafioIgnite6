import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { user_id } = request.params;
    const { amount, description } = request.body;
    const sender_id = request.user.id;

    const splittedPath = request.originalUrl.split('/')
    //se index = 2 é transfer, se 1 deposit ou withdraw
    let index = 1
    const testForIndex = splittedPath[splittedPath.length -index]


    if(testForIndex !== 'deposit' && testForIndex !== 'withdraw'){
      index = 2
    }else if(testForIndex === 'deposit'){
        index = 1
      }
    else if(testForIndex === 'withdraw'){
      index = 1
      }else{
        throw new Error ("Erro no type de statement")}

    const type = splittedPath[splittedPath.length -index] as OperationType

    const createStatement = container.resolve(CreateStatementUseCase);

      console.log(
      '     user_id: '+user_id,
      'type: '+type,
      'amount: '+amount,
      'description: '+description,
      'sender_id: '+sender_id)
    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return response.status(201).json(statement);
  }
}
