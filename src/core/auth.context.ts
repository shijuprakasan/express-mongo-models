import { ITenantModel, IUserModel } from "./models";

export interface IAuthContext {
  tenantId?: string;
  userId?: string;
}

export interface IAuthDataContext extends IAuthContext {
  tenant?: ITenantModel;
  user?: IUserModel;
}

export interface IRequireAuthContext {
  setContext(authContext?: IAuthContext): void;
}
