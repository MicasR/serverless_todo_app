import { APIGatewayProxyEvent } from 'aws-lambda'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { TodoItem } from '../models/TodoItem'
import { getUserId } from '../lambda/utils';
import { todoBuilder } from '../helpers/todos'
import { createToDoIndb, deleteToDoIndb, updateToDoIndb } from '../helpers/todosAcess';
import { parseUserId } from '../auth/utils';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { TodoUpdate } from '../models/TodoUpdate';


export async function createTodo(newTodo: CreateTodoRequest, event: APIGatewayProxyEvent): Promise<TodoItem> {
    const todo = todoBuilder(newTodo, getUserId(event))
    const createdTodo = await createToDoIndb(todo)
    return createdTodo
}

export function updateToDo(updateTodoRequest: UpdateTodoRequest, todoId: string, jwtToken: string): Promise<TodoUpdate> {
    const userId = parseUserId(jwtToken);
    return updateToDoIndb(updateTodoRequest, todoId, userId);
}

export function deleteTodo(todoId: string, jwtToken: string): Promise<string> {
    const userId = parseUserId(jwtToken);
    return deleteToDoIndb(todoId, userId);
}
