/**
 * Base model for tracking creation and modification.
 */
export interface IBaseModel extends IBaseLiteModel {
  // id: string;
  // // tenantId: string;
  tenant: ITenantLiteModel;

  created?: IChangeTrackModel;
  modified?: IChangeTrackModel;

  deleted?: boolean;
}

/**
 * Lightweight base model with only an identifier.
 */
export interface IBaseLiteModel {
  _id: string;
}

/**
 * Model for tracking changes by user and date.
 */
export interface IChangeTrackModel {
  by: IUserLiteModel;
  on: Date;
}

/**
 * Lightweight model for tenant information.
 */
export interface ITenantLiteModel extends IBaseLiteModel {
  // _id: string;
  tenantName: string;
  locale: string;
  currency: string;
}

/**
 * Lightweight model for user information.
 */
export interface IUserLiteModel {
  _id: string;
  userName: string;
  // displayName: string;
}

export function getTenantLiteModel(tenant: ITenantLiteModel): ITenantLiteModel {
  if (!tenant) return undefined as any as ITenantLiteModel;
  return {
    _id: tenant._id,
    tenantName: tenant.tenantName,
    locale: tenant.locale,
    currency: tenant.currency,
  } as ITenantLiteModel;
}

export function getUserLiteModel(user: IUserLiteModel): IUserLiteModel {
  if (!user) return undefined as any as IUserLiteModel;
  return {
    _id: user._id,
    userName: user.userName,
  } as IUserLiteModel;
}

export function newChangeTrack(user: IUserLiteModel): IChangeTrackModel {
  return {
    by: getUserLiteModel(user),
    on: new Date(),
  };
}
