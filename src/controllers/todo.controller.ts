import { ICoreController } from "../core";
import { TodoDataModel } from "../data/todo.data";
import { ITodoLiteModel } from "../models/todo.model";
import { MongoCRUDController } from "../mongo";

export interface ITodoController extends ICoreController<ITodoLiteModel> {}

export class TodoController
  extends MongoCRUDController<ITodoLiteModel>
  implements ITodoController
{
  constructor() {
    super(TodoDataModel);
  }
}
