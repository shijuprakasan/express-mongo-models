import { ITodoModel } from "../models";
import { ICollectionController } from "../core/controllers";
import { MongoCollectionController } from "../core/controllers";
import { ITodoCollection } from "../data";

export interface ITodoController extends ICollectionController<ITodoModel> {
}

export class TodoController
  extends MongoCollectionController<ITodoModel>
  implements ITodoController {

  constructor(collection: ITodoCollection) {
    super(collection);
  }
}