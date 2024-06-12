import { IUserModel } from "../models";
import { ICoreOperations } from "../core";
import { MongoCRUDOperations } from "../mongo";
import { logger } from "../core/utils/logger";
import { UserDataModel } from '../data';
import { IRegisterModel } from "../models";

export interface IUserOperations extends ICoreOperations<IUserModel> {
    register(data: IRegisterModel): Promise<IUserModel>;
}

export class UserOperations extends MongoCRUDOperations<IUserModel> implements IUserOperations {
  constructor() {
    super(UserDataModel);
  }

  public async register(data: IRegisterModel): Promise<IUserModel> {
    logger.log('register', data.email);
    // add to identity repository
    const userId: string = this.addIndentityUser(data.password, data.email);
    // prepare new user data
    const newUser: IUserModel = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        userRole: "superadmin",
        isActive: true,
        _id: userId,
        userName: userId,
    } as IUserModel;
    this.updateBaseModelProps(newUser);

    // add to repo
    const doc1 = this.collection.build(newUser);
    // add change track
    const doc = await doc1.save();
    newUser._id = doc1._id as string;
    return newUser;
  }

  addIndentityUser(password: string, email: string): string {
    // register user to identity registry
    // return identity user id
    return email;
  }
}
