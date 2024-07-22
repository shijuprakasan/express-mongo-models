import { ITodoModel } from "../models";
import { ICollectionController } from "../core/controllers";
import { BaseController } from "../core/controllers";
import { ITodoData } from "../data";

export interface ITodoController extends ICollectionController<ITodoModel> {
}

export class TodoController
  extends BaseController<ITodoModel>
  implements ITodoController {

  constructor(collection: ITodoData) {
    super(collection);
  }
}
