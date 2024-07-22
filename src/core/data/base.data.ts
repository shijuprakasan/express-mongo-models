import {
  IAuthContext,
  IRequireAuthContext,
} from "../auth.context";
import {
  IBaseLiteModel,
  ITenantModel,
  IUserModel,
  SORT_EXPRN,
} from "../models";
import { logger } from "../utils";

export interface IDbData<T extends IBaseLiteModel>
  extends IQueryData<T>,
  IUpdateData<T>,
  IRequireAuthContext {

  setContext(authContext?: IAuthContext): void;
  updateBaseModelProps(data: T, isCreate?: boolean): Promise<T>;

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
}

export interface IUserBaseData extends IDbData<IUserModel> { }

export interface ITenantBaseData extends IDbData<ITenantModel> { }

export interface IQueryData<T extends IBaseLiteModel>
  extends IRequireAuthContext {
  /**
   * Returns all resources from persistance
   */
  get(populate?: string[]): Promise<T[]>;
  /**
   * Returns a resource from the persistance by matching hte id
   * @param id primary id of a resource
   */
  getById(id: string, populate?: string[]): Promise<T | null>;
  getCustom(filterQuery: any, populate?: string[]): Promise<T[]>;
  getPage(
    page: number,
    limit: number,
    sort: SORT_EXPRN | undefined,
    populate?: string[]
  ): Promise<T[]>;
}

export interface IUpdateData<T extends IBaseLiteModel>
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
  update(id: string, data: T): Promise<T | null>;
  /**
   * Add a new resource to persistance
   * @param data resource to be added to persistance
   */
  add(data: T): Promise<T | null>;
  /**
   * remove a resource from persistance (permanent delete)
   * @param id id of resource to be deleted
   */
  deletePermanent(id: string): Promise<boolean>;
  /**
   * remove a resource from persistance (soft delete)
   * @param id id of resource to be deleted
   */
  delete(id: string): Promise<boolean>;

  /**
   * Pre create action, meant to be overriden
   * Return true - continue the workflow
   * Return false - operation is cancelled
   * @param data input data to be saved in persistance
   */
  preCreate(data: T): Promise<boolean>;
  onCreate(data: T): Promise<boolean>;
  /**
   * Post create action, meant to be overriden
   * @param data The saved data in persistance
   */
  postCreate(data: T): Promise<void>;

  /**
   * Pre update action, meant to be overriden
   * Return true - continue the workflow
   * Return false - operation is cancelled
   * @param data input data to be updarted in persistance
   */
  preUpdate(data: T, extras?: any): Promise<boolean>;
  onUpdate(data: T, extras?: any): Promise<boolean>;
  /**
   * Post update action, meant to be overriden
   * @param data updated data in persistance
   */
  postUpdate(data: T, extras?: any): Promise<void>;

  /**
   * Pre delete action, meant to be overriden
   * Return true - continue the workflow
   * Return false - operation is cancelled
   * @param id id of resource to be deleted
   * @param data resource itself to be marked as deleted (soft delete)
   */
  preDelete(id: string, data: T | null): Promise<boolean>;
  onDelete(id: string, data: T | null): Promise<boolean>;
  /**
   * Post delete action, meant to be overriden
   * @param id id of resource is  been deleted
   * @param data resource itself marked as deleted (soft delete)
   */
  postDelete(id: string, data: T | null): Promise<void>;
}
