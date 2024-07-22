Express Mongo Model - for express development with mongodb and express js

  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Install Size][npm-install-size-image]][npm-install-size-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

```ts
// ./models/todo.model.ts
import { IBaseModel } from "express-mongo-model";
import { IDbData } from "express-mongo-model";
import { ICollectionController, BaseController } from "express-mongo-model";
import { CollectionRouter, IAbstractRouteBuilder } from "express-mongo-model";
import { Schema } from "mongoose";
import { DbCollection } from "express-mongo-model";

export interface IMyTodoModel extends IBaseModel {
    title: string;
    completed: boolean;
}


// ./data/todo.data.ts
export interface IMyTodoData extends IDbData<IMyTodoModel> {
}


// ./controllers/todo.controllers.ts
export interface IMyTodoController extends ICollectionController<IMyTodoModel> {
}

export class MyTodoController
  extends BaseController<IMyTodoModel>
  implements IMyTodoController {

  constructor(collection: IMyTodoData) {
    super(collection);
  }
}


// ./routes/todo.route.ts
const ROUTE_PREFIX = "/api/todos";

export class MyTodoRoute extends CollectionRouter<IMyTodoModel> {
    constructor(collectionController: ICollectionController<IMyTodoModel>) {
        super(ROUTE_PREFIX, collectionController);
    }

    buildCustomRoutes(collectionRouter: IAbstractRouteBuilder): void {
    }
}


// ./mongo/todo.collection.ts
const COLLECTION_NAME = "todos";

export class MyTodoCollection extends DbCollection<IMyTodoModel> {
    constructor() {
        super(COLLECTION_NAME);
    }

    dataSchema(): Schema {
        return new Schema({
            title: { type: String, required: true },
            completed: { type: Boolean, required: true },
        });
    }
}


// ./index.ts
import express, { Application } from "express";
import mongoose from "mongoose";
import { json } from "body-parser";
const dotenv = require("dotenv");

dotenv.config();
const TRN_DB_CONNECT: string = process.env.TRN_DB_CONNECT ?? "";
const PORT = parseInt(process.env.PORT ?? "8000");

const app: Application = express();
app.use(json());
app.use(new MyTodoRoute(new MyTodoController(new MyTodoCollection())).router);

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
npm install body-parser dotenv express joi mongoose morgan swagger-ui-express tsoa

npm install --save-dev @eslint/js @types/express @types/morgan @types/swagger-ui-express concurrently eslint globals nodemon ts-node ts-node-dev typescript
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

