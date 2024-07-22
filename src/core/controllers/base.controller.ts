import { IRequireAuthContext } from "../auth.context";
import { IDbCollection } from "../data/";
import {
  IListRespModel,
  IPageRespModel,
  IRespModel,
  SORT_EXPRN,
  IBaseLiteModel,
} from "../models/";

export interface IQueryController<T extends IBaseLiteModel>
  extends IRequireAuthContext {
  /**
   * Returns all resources from persistance
   */
  get(populate?: string[]): Promise<IListRespModel<T>>;
  /**
   * Returns a resource from the persistance by matching hte id
   * @param id primary id of a resource
   */
  getById(id: string, populate?: string[]): Promise<IRespModel<T | null>>;
  getCustom(
    filterQuery: any,
    populate?: string[]
  ): Promise<IListRespModel<T | null>>;
  getPage(
    page: number,
    limit: number,
    sort: SORT_EXPRN | undefined,
    populate?: string[]
  ): Promise<IPageRespModel<T>>;
}

export interface IActionController<T extends IBaseLiteModel>
  extends IRequireAuthContext {
  updatePartial(data: T, partialUpdate: string[]): Promise<T | null>;
  updatePartialAny<TModel extends any>(
    id: string,
    data: TModel
  ): Promise<TModel | null>;
  updatePartialField<TModel extends any>(
    id: string,
    fieldName: string,
    fieldData: TModel
  ): Promise<TModel | null>;

  /**
   * update a resource from the persistance
   * @param id primary id of a resource
   * @param data resource attributeds to be updated
   */
  update(id: string, data: T): Promise<IRespModel<T | null>>;
  /**
   * Add a new resource to persistance
   * @param data resource to be added to persistance
   */
  add(data: T): Promise<IRespModel<T | null>>;
  /**
   * remove a resource from persistance (permanent delete)
   * @param id id of resource to be deleted
   */
  deletePermanent(id: string): Promise<IRespModel<boolean>>;
  /**
   * remove a resource from persistance (soft delete)
   * @param id id of resource to be deleted
   */
  delete(id: string): Promise<IRespModel<boolean>>;
}

export interface ICollectionController<T extends IBaseLiteModel>
  extends IQueryController<T>,
    IRequireAuthContext,
    IActionController<T> {
  /**
   * id of a user who is performing the action
   */
  get userId(): string | undefined;
  /**
   * tenant id of a user who performing the action
   */
  get tenantId(): string | undefined;
  // tenantController: MongoCollectionController<tenantModel>;
  getController<TNew extends IBaseLiteModel>(
    collectionName: string,
    collectionPredicate: () => IDbCollection<TNew>
  ): ICollectionController<TNew>;
}
