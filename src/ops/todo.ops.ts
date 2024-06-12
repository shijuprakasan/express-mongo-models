import { ICoreOperations } from "../core";
import { TodoDataModel } from "../data/todo.data";
import { ITodoLiteModel } from "../models/todo.model";
import { MongoCRUDOperations } from "../mongo";

export interface ITodoOperations extends ICoreOperations<ITodoLiteModel> { }

export class TodoOperations extends MongoCRUDOperations<ITodoLiteModel> implements ITodoOperations {
  constructor() {
    super(TodoDataModel);
  }
}