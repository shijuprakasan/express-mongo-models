import { IDbData } from "../core/data";
import { IKeychainLiteModel, IKeychainModel } from "../models";

export interface IKeychainCollection extends IDbData<IKeychainModel> {
  getLite(id: string): Promise<IKeychainLiteModel | null>;
  getChildren(id: string): Promise<IKeychainLiteModel[]>;
}
