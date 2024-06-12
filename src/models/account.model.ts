import { IBaseTenantModel } from "./tenant.model";
import { IUserModel } from "./user.model";

export interface IUserSubscriberModel extends IUserModel, IBaseTenantModel {
  addressLine1: string;
  addressLine2: string;
  landMark: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  confirmationDate: Date;
}
