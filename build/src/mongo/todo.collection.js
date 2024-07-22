"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoCollection = void 0;
const mongoose_1 = require("mongoose");
const mongo_1 = require("../core/mongo");
const COLLECTION_NAME = "todos";
class TodoCollection extends mongo_1.DbCollection {
    constructor() {
        super(COLLECTION_NAME);
    }
    dataSchema() {
        return new mongoose_1.Schema({
            title: { type: String, required: true },
            completed: { type: Boolean, required: true },
        });
    }
}
exports.TodoCollection = TodoCollection;
//# sourceMappingURL=todo.collection.js.map