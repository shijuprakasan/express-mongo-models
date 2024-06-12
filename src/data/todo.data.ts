import { ITodoLiteModel } from "../models/todo.model";
import { CollectionSchemaBuilder } from "../mongo";

const docSchema = new CollectionSchemaBuilder<ITodoLiteModel>("todos");
docSchema.build({
  title: { type: String, required: true },
});
const dataModel = docSchema.getDataModel();
export { dataModel as TodoDataModel };
