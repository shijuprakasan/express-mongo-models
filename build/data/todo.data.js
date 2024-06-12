"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoDataModel = void 0;
const mongo_1 = require("../mongo");
const docSchema = new mongo_1.CollectionSchemaBuilder("todos");
docSchema.build({
    title: { type: String, required: true },
});
const dataModel = docSchema.getDataModel();
exports.TodoDataModel = dataModel;
//# sourceMappingURL=todo.data.js.map