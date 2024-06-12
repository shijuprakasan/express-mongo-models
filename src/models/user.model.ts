import { IUserLiteModel } from "../core/models";
import { IBaseTenantModel } from "./tenant.model";

export interface IUserModel extends IUserLiteModel, IBaseTenantModel {
  firstName: string;
  lastName: string;

  email: string;
  phone: string;

  userRole: USER_ROLE;
  isActive: boolean;
}

export type USER_ROLE =
  | "superadmin"
  | "admin"
  | "recomentation"
  | "subscriber"
  | "agent"
  | "stadard";
