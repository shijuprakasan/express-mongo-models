"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoCollection = void 0;
const mongoose_1 = require("mongoose");
const core_1 = require("../core");
class TodoCollection extends core_1.DbCollection {
    constructor() {
        super("todos");
    }
    dataSchema() {
        return new mongoose_1.Schema({
            title: { type: String, required: true },
            completed: { type: Boolean, required: true },
        });
    }
}
exports.TodoCollection = TodoCollection;
//# sourceMappingURL=todo.data.js.map