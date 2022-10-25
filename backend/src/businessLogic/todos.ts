import { APIGatewayProxyEvent} from 'aws-lambda'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { getUserId } from '../lambda/utils';
import { todoBuilder } from '../helpers/todos'
import { createToDoInDb } from '../helpers/todosAcess';



export async function createTodo(newTodo: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {

    // Build a new todo using the request and userId from event
    const todo = todoBuilder(newTodo, getUserId(event))

    // crete todo in db
    const createdTodo = await createToDoInDb(todo)

    return createdTodo
}