// import { TodosAccess } from './todosAcess'
// import { AttachmentUtils } from './attachmentUtils';
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
// import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
// import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
// import * as createError from 'http-errors'

// // TODO: Implement businessLogic
export function todoBuilder(todoRequest: CreateTodoRequest, userId: string): TodoItem{

    const todoId: string = uuid.v4()

    const todo = {
        todoId: todoId,
        userId: userId,
        createdAt: new Date().toISOString(),
        done: false,
        attachmetUrl: '',
        ...todoRequest
    }

    return todo as TodoItem
}