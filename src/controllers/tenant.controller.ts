import { ICoreController } from "../core";
import { MongoCRUDController } from "../mongo";
import { TenantDataModel } from "../data";
import { ITenantModel } from "../models";

export interface ITenantController extends ICoreController<ITenantModel> {}

export class TenantController
  extends MongoCRUDController<ITenantModel>
  implements ITenantController
{
  constructor() {
    super(TenantDataModel);
  }
}
