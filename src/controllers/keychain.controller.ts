import { IKeychainLiteModel, IKeychainModel } from "../models";
import { ICollectionController } from "../core/controllers";
import { BaseController } from "../core/controllers";
import {
  IRespModel,
  RespModel,
} from "../core/models";
import { IKeychainCollection } from "../collection";

export interface IKeychainController extends ICollectionController<IKeychainModel> {
  getLiteById(id: string): Promise<IRespModel<IKeychainLiteModel | null>>;
  getChildrenById(id: string): Promise<IRespModel<IKeychainLiteModel[]>>;
  getFullById(id: string): Promise<IRespModel<IKeychainModel | null>>;
}

export class KeychainController
  extends BaseController<IKeychainModel>
  implements IKeychainController {

  constructor(collection: IKeychainCollection) {
    super(collection);
  }

  /**
   * Returns a resource from the persistance by matching hte id
   * @param id primary id of a resource
   */
  async getLiteById(id: string): Promise<IRespModel<IKeychainLiteModel | null>> {
    const obj = await await (this.collection as IKeychainCollection).getLite(id);
    return new RespModel(obj);
  }

  /**
   * Returns a resource from the persistance by matching hte id
   * @param id primary id of a resource
   */
  async getChildrenById(id: string): Promise<IRespModel<IKeychainLiteModel[]>> {
    const children = await (this.collection as IKeychainCollection).getChildren(id);
    return new RespModel(children);
  }

  /**
   * Returns a resource from the persistance by matching hte id
   * @param id primary id of a resource
   */
  async getFullById(id: string): Promise<IRespModel<IKeychainModel | null>> {
    const obj = await super.getById(id);
    if (obj.data) {
      const children = await (this.collection as IKeychainCollection).getChildren(id);
      obj.data.children = children;
      if (obj.data.p1Id) {
        const p1 = await this.getLiteById(obj.data.p1Id);
        if (p1 && p1.data) {
          obj.data.parent = p1.data;
        }
      }
    }

    return obj;
  }
}
