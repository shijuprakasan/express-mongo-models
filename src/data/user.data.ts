import { IUserBaseCollection, UserBaseCollection } from "../core/data";

export interface IUserCollection extends IUserBaseCollection {
}

export class UserCollection extends UserBaseCollection {
  constructor() {
    super();
  }
}