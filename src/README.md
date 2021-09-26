# Transferencias

Deverá permitir a transferencia de valores entre contas.
- Não deve ser possível transferir valores superiores ao disponível no saldo de uma conta; **ok**
- O balance (obtido através da rota `/api/v1/statements/balance`) deverá considerar também todos os valores transferidos ou recebidos através de transferências ao exibir o saldo de um usuário; **ok**
- As informações para realizar uma transferência serão **ok**

{
  "amount": 100,
  "description": "Descrição da transferência"
}

Você pode passar o `id` do usuário destinatário via parâmetro na rota (exemplo: `/api/v1/statements/transfers/:user_id`) e o id do usuário remetente poderá ser obtido através do token JWT enviado no header da requisição;**ok**

Ao mostrar o balance de um usuário, operações do tipo transfer deverão possuir os seguintes campos:**ok**

{
  "id": "4d04b6ec-2280-4dc2-9432-8a00f64e7930",
	"sender_id": "cfd06865-11b9-412a-aa78-f47cc3e52905"
  "amount": 100,
  "description": "Transferência de valor",
  "type": "transfer",
  "created_at": "2021-03-26T21:33:11.370Z",
  "updated_at": "2021-03-26T21:33:11.370Z"
}

Observe o campo `sender_id`. Esse deverá ser o `id` do usuário que enviou a transferência.**ok**
O campo `type` também deverá exibir o tipo da operação, que nesse caso é `transfer`.**ok**


# Corrigir erro de user_id nulo
Em algum ponto do controller o user_id fica nulo e causa o erro 500 mas o insert é correto:
"message": "Internal server error - null value in column \"user_id\" of relation \"statements\" violates not-null constraint "

# Regra de negócio
É criado um registro no enviante e o recebedor.
Qnd o balance é feito é descontado ou somado com base no sender e user id, se igual é menos o valor, se diferente soma como transferencia.
