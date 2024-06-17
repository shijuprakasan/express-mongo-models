Express Mongo Model - for express development with mongodb and express js

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

```ts
// ./todo.model.ts
import { ICoreLiteModel } from "express-mongo-model";

export interface ITodoModel extends ICoreLiteModel {
  title: string;
}

// ./todo.data.ts
import { CollectionSchemaBuilder } from "express-mongo-model";
import { ITodoModel } from "./todo.model";

const docSchema = new CollectionSchemaBuilder<ITodoModel>("todos");
docSchema.build({
  title: { type: String, required: true },
});
const dataModel = docSchema.getDataModel();
export { dataModel as TodoDataModel };

// ./todo.controllers.ts
import { MongoCRUDController, ICoreController } from "express-mongo-model";
import { ITodoModel } from "./todo.model";
import { TodoDataModel } from "./todo.data";

export interface ITodoController extends ICoreController<ITodoModel> {}

export class TodoController
  extends MongoCRUDController<ITodoModel>
  implements ITodoController
{
  constructor() {
    super(TodoDataModel);
  }
}

// ./todo.route.ts
import { RESTRouteBuilder } from "express-mongo-model";
import { TodoController } from "./todo.controller";

const ROUTE_PREFIX = "/api/todos";

const todoOps = new TodoController();
const todoRoute = new RESTRouteBuilder(ROUTE_PREFIX, todoOps);
const router = todoRoute.buildCRUDRoutes();

export { router as TodosRouter };

// ./index.ts
import express, { Application } from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
import { TodosRouter } from "./todo.route";
const dotenv = require("dotenv");

dotenv.config();
const TRN_DB_CONNECT: string = process.env.TRN_DB_CONNECT ?? "";
const PORT = parseInt(process.env.PORT ?? "8000");

const app: Application = express();
app.use(json());
app.use(TodosRouter());

mongoose
  .connect(TRN_DB_CONNECT, {})
  .then(() => {
    console.log("connected to database");
  })
  .catch((ex) => {
    console.log("failed to connect database", ex);
  });

app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

```

## Installation

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```console
$ npm install express-mongo-model
```
Prerequisites
```console
$ npm install dotenv
$ npm install express
$ npm install mongoose
```
## Testing (Postman)
```json
{
	"info": {
		"_postman_id": "0a0b1bc4-a5d4-4172-a571-e7b4bec18687",
		"name": "todos",
		"schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
		"_exporter_id": "24242163"
	},
	"item": [
		{
			"name": "todo-apis",
			"item": [
				{
					"name": "todos-get",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/todos",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"todos"
							]
						}
					},
					"response": []
				},
				{
					"name": "todos-get-one",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/todos/6669cd72881737533cb23d91",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"todos",
								"6669cd72881737533cb23d91"
							]
						}
					},
					"response": []
				},
				{
					"name": "todos-get-page",
					"request": {
						"method": "GET",
						"header": [],
						"url": {
							"raw": "http://localhost:3000/api/todos/page?page=0&limit=2&sort=title:asc",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"todos",
								"page"
							],
							"query": [
								{
									"key": "page",
									"value": "0"
								},
								{
									"key": "limit",
									"value": "2"
								},
								{
									"key": "sort",
									"value": "title:asc"
								}
							]
						}
					},
					"response": []
				},
				{
					"name": "todos-post",
					"request": {
						"method": "POST",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "        {\n            \"title\": \"Welcome To Mongo Model APIs\"\n        }",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/todos/6669cd72881737533cb23d91",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"todos",
								"6669cd72881737533cb23d91"
							]
						}
					},
					"response": []
				},
				{
					"name": "todos-put",
					"request": {
						"method": "PUT",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "{\n    \"title\": \"Welcome To Mongo Model APIS\"\n}",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/todos",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"todos"
							]
						}
					},
					"response": []
				},
				{
					"name": "todos-delete",
					"request": {
						"method": "DELETE",
						"header": [],
						"body": {
							"mode": "raw",
							"raw": "",
							"options": {
								"raw": {
									"language": "json"
								}
							}
						},
						"url": {
							"raw": "http://localhost:3000/api/todos/6669ce0a881737533cb23d9a",
							"protocol": "http",
							"host": [
								"localhost"
							],
							"port": "3000",
							"path": [
								"api",
								"todos",
								"6669ce0a881737533cb23d9a"
							]
						}
					},
					"response": []
				}
			]
		},
		{
			"name": "tenants-put",
			"request": {
				"method": "PUT",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"tenantName\": \"Tenant1\",\n    \"locale\": \"en-US\",\n    \"currency\": \"USD\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/api/tenants",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"api",
						"tenants"
					]
				}
			},
			"response": []
		},
		{
			"name": "users-put",
			"request": {
				"method": "POST",
				"header": [],
				"body": {
					"mode": "raw",
					"raw": "{\n    \"firstName\": \"Shiju\",\n    \"lastName\": \"Madamchery\",\n    \"phone\": \"+91 9686622751\",\n    \"userRole\": \"superadmin\",\n    \"userName\": \"shijuprakasan@gmail.com\",\n    \"email\": \"shijuprakasan@gmail.com\"\n}",
					"options": {
						"raw": {
							"language": "json"
						}
					}
				},
				"url": {
					"raw": "http://localhost:3000/api/users/register",
					"protocol": "http",
					"host": [
						"localhost"
					],
					"port": "3000",
					"path": [
						"api",
						"users",
						"register"
					]
				}
			},
			"response": []
		}
	]
}
```
## Features

