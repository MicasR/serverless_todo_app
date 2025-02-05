import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateToDo } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
    console.log("Processing Event ", event);

    const authorization = event.headers.Authorization;
    const split = authorization.split(' ');
    const jwtToken = split[1];

    const todoId = event.pathParameters.todoId;
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body);
    
    const toDoItem = await updateToDo(updatedTodo, todoId, jwtToken);

    return {
      statusCode: 200,
      body: JSON.stringify({
        "item": toDoItem
      })
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
