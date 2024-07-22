import { IBaseModel, IUserLiteModel } from ".";

export interface IUserModel extends IUserLiteModel, IBaseModel {
  firstName: string;
  lastName: string;

  // displayName: string; // computed

  email: string;
  phone: string;

  userRole: USER_ROLE;
  // userRoles: UserRoles[];
  isActive: boolean;
}

export type USER_ROLE =
  | "super-admin"
  | "admin"
  | "recomentation"
  | "subscriber"
  | "agent"
  | "standard";
