# Transferencias

Deverá permitir a transferencia de valores entre contas.
- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta; **ok**
- O balance (obtido através da rota `/api/v1/statements/balance`) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário;
- As informações para realizar uma transferência serão **ok**

{
  "amount": 100,
  "description": "Descrição da transferência"
}

Você pode passar o `id` do usuário destinatário via parâmetro na rota (exemplo: `/api/v1/statements/transfers/:user_id`) e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;**ok**

Ao mostrar o balance de um usuário, operações do tipo transfer deverão possuir os seguintes campos:
{
  "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
  "amount": 100,
  "description": "Transferência de valor",
  "type": "transfer",
  "created_at": "2021-03-26T21:33:11.370Z",
  "updated_at": "2021-03-26T21:33:11.370Z"
}

Observe o campo `sender_id`. Esse deverá ser o `id` do usuário que enviou a transferência.
O campo `type` também deverá exibir o tipo da operação, que nesse caso é `transfer`.**ok**


# typeorm **ok**
**Implementar Alter do typeorm**

# entitiy **ok**
**Implementar união de join na entity**

# StatementRepository.ts
**Alterar metodo create para aceitar o tipo transfer**
**Alterar o metodo getbalance para aceitar o tipo transfer**  ok
