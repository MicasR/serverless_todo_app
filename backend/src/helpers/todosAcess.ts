import * as AWS from 'aws-sdk'
const AWSXRay = require('aws-xray-sdk')
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
// import { createLogger } from '../utils/logger'


const XAWS = AWSXRay.captureAWS(AWS)

// const logger = createLogger('TodosAccess')
const todosTable = process.env.TODOS_TABLE
const index = process.env.TODOS_CREATED_AT_INDEX
const docClient: DocumentClient = createDynamoDBClient()

// DONE: Implement the dataLayer logic

export async function createToDoIndb(todoItem: TodoItem): Promise<TodoItem> {
    console.log('creating a new todo.')
    const params = {
        TableName: todosTable,
        Item: todoItem
    };
    const result = await docClient.put(params).promise();
    console.log(result);
    return todoItem as TodoItem;
}

export async function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    const result = await docClient.query({
        TableName: todosTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
    return result.Items as TodoItem[]
}

export async function getTodoById(todoId: string): Promise<TodoItem> {
    const result = await docClient.query({
        TableName: todosTable,
        IndexName: index,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()
    const items = result.Items
    if (items.length === 0) return null
    return items[0] as TodoItem
}

export async function updateTodo(todo: TodoItem): Promise<TodoItem> {
    const result = await docClient.update({
        TableName: todosTable,
        Key: {
            userId: todo.userId,
            todoId: todo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': todo.attachmentUrl
        }
    }).promise()

    return result.Attributes as TodoItem
}

export async function deleteToDoIndb(todoId: string, userId: string): Promise<string> {
    console.log("Deleting a todo.");
    const params = {
        TableName: todosTable,
        Key: {
            "userId": userId,
            "todoId": todoId
        },
    };
    const result = await docClient.delete(params).promise();
    console.log(result);
    return "" as string;
}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }
    return new XAWS.DynamoDB.DocumentClient()
}