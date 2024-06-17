"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoControllers = void 0;
const todo_data_1 = require("../data/todo.data");
const mongo_1 = require("../mongo");
class TodoControllers extends mongo_1.MongoCRUDController {
    constructor() {
        super(todo_data_1.TodoDataModel);
    }
}
exports.TodoControllers = TodoControllers;
//# sourceMappingURL=todo.controller.js.map