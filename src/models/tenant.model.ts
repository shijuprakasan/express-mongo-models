import { ICoreLiteModel, ICoreModel } from "../core/models";

export interface ITenantModel extends ITenantLiteModel, ICoreLiteModel {
  isActive: boolean;
}

export interface IBaseTenantModel extends ICoreModel, ICoreLiteModel {
  tenant: ITenantLiteModel;
}

export interface ITenantLiteModel extends ICoreLiteModel {
  tenantName: string;
  locale: string;
  currency: string;
}

export interface ITenantLiteModel extends ICoreLiteModel {
  tenantName: string;
  locale: string;
  currency: string;
}

export function getTenantLiteModel(tenant: ITenantLiteModel): ITenantLiteModel {
  return {
    _id: tenant._id,
    tenantName: tenant.tenantName,
  } as ITenantLiteModel;
}
