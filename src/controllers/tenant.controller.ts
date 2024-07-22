import { ITenantModel } from "../core/models";
import { ICollectionController } from "../core/controllers";
import { MongoCollectionController } from "../core/controllers";
import { ITenantCollection } from "../data";

export interface ITenantController extends ICollectionController<ITenantModel> {
}

export class TenantController
  extends MongoCollectionController<ITenantModel>
  implements ITenantController {
  constructor(collection: ITenantCollection) {
    super(collection);
  }
}
