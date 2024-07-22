import { IUserModel } from "../core/models";
import { BaseController, ICollectionController } from "../core/controllers";
import { IUserCollection } from "../data";
import { IRegisterModel } from "../models";
import {
  IRespModel,
  RespModel,
} from "../core/models";

export interface IUserController extends ICollectionController<IUserModel> {
  register(data: IRegisterModel): Promise<IRespModel<IUserModel>>;
}

// @Route("/api/users")
// @Tags("Users")
export class UserController
  extends BaseController<IUserModel>
  implements IUserController {
  constructor(collection: IUserCollection) {
    super(collection);
  }

  public async register(data: IRegisterModel): Promise<IRespModel<IUserModel>> {
    // add to identity repository
    const userId: string = this.addIndentityUser(data.password, data.email);
    // prepare new user data
    const newUser: IUserModel = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      userRole: "standard",
      isActive: true,
      _id: userId,
      userName: userId,
    } as IUserModel;
    this.collection.updateBaseModelProps(newUser);

    // add to repo
    const doc1 = await this.collection.add(newUser);
    if (doc1) {
      newUser._id = doc1._id as string;
    }

    return new RespModel(newUser);
  }

  addIndentityUser(password: string, email: string): string {
    // register user to identity registry
    // return identity user id
    return email;
  }
}