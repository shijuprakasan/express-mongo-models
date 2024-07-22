import { IDbCollection } from "../core/collection";
import { IKeychainLiteModel, IKeychainModel } from "../models";

export interface IKeychainCollection extends IDbCollection<IKeychainModel> {
  getLite(id: string): Promise<IKeychainLiteModel | null>;
  getChildren(id: string): Promise<IKeychainLiteModel[]>;
}
