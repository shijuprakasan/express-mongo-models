"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoOperations = void 0;
const todo_data_1 = require("../data/todo.data");
const mongo_1 = require("../mongo");
class TodoOperations extends mongo_1.MongoCRUDOperations {
    constructor() {
        super(todo_data_1.TodoDataModel);
    }
}
exports.TodoOperations = TodoOperations;
//# sourceMappingURL=todo.ops.js.map