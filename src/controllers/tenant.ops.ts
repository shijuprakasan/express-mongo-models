import { ICoreOperations } from "../core";
import { MongoCRUDOperations } from "./../mongo";
import { TenantDataModel } from "../data";
import { ITenantModel } from "../models";

export interface ITenantOperations extends ICoreOperations<ITenantModel> {}

export class TenantOperations
  extends MongoCRUDOperations<ITenantModel>
  implements ITenantOperations
{
  constructor() {
    super(TenantDataModel);
  }
}
