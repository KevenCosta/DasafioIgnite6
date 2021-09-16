import { Request, Response } from "express";


class TransferFoundsController {
  async handle(request:Request, response:Response):Promise<void>{
    const amount = request.body;
    const description = request.body;
    const user_id_send = request.user.id;
    const user_id_to = request.params;
  }
}

export {TransferFoundsController}
