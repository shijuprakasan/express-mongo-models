import { ITenantModel } from "../core/models";
import { ICollectionController } from "../core/controllers";
import { BaseController } from "../core/controllers";
import { ITenantData } from "../data";

export interface ITenantController extends ICollectionController<ITenantModel> {
}

export class TenantController
  extends BaseController<ITenantModel>
  implements ITenantController {
  constructor(collection: ITenantData) {
    super(collection);
  }
}
