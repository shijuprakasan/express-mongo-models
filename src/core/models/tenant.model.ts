import { IBaseLiteModel, ITenantLiteModel } from "./base.model";

export interface ITenantModel extends ITenantLiteModel, IBaseLiteModel {
  isActive: boolean;
}
