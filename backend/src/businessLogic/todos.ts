import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { getUserId } from '../lambda/utils';
import { todoBuilder } from '../helpers/todos'
import { createToDoIndb, deleteToDoIndb } from '../helpers/todosAcess';
import { parseUserId } from '../auth/utils';



export async function createTodo(newTodo: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {

    // Build a new todo using the request and userId from event
    const todo = todoBuilder(newTodo, getUserId(event))

    // crete todo in db
    const createdTodo = await createToDoIndb(todo)

    return createdTodo
}


export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return deleteToDoIndb(todoId, userId);
}