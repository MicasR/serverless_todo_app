import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { createTodo } from '../../businessLogic/todos'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // Get todo data from request
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    // create a new TODO item
    const createdTodo = await createTodo(newTodo, event)

    return {
      statusCode: 201,
      body: JSON.stringify({ "item": createdTodo })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
