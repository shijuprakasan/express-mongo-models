import { IAuthContext, IRequireAuthContext } from "../auth.context";
import { IDbCollection } from "../collection";
import {
  IListRespModel,
  IPageRespModel,
  IRespModel,
  SORT_EXPRN,
  IBaseLiteModel,
  SORT_DIRECTION,
  PageRespModel,
  getError,
  ListRespModel,
  RespModel,
} from "../models/";

export class BaseController<T extends IBaseLiteModel>
  implements ICollectionController<T> {
  collection: IDbCollection<T>;
  authContext?: IAuthContext;

  setContext(authContext?: IAuthContext): void {
    this.authContext = authContext;
    this.collection.setContext(this.authContext);
  }

  get tenantId(): string | undefined {
    return this.authContext?.tenantId;
  }

  get userId(): string | undefined {
    return this.authContext?.userId;
  }

  constructor(collection: IDbCollection<T>) {
    this.collection = collection;
  }

  private controllerCache: { [key: string]: any } = {};

  getController<TNew extends IBaseLiteModel>(
    collectionName: string,
    collectionPredicate: () => IDbCollection<TNew>
  ): ICollectionController<TNew> {
    const res = this.controllerCache[
      collectionName
    ] as ICollectionController<TNew>;
    if (res) {
      console.log("getController from cache", collectionName);
      return res;
    } else {
      const newController = new BaseController<TNew>(
        collectionPredicate()
      );
      this.setContext(this.authContext);
      this.controllerCache[collectionName] = newController as any;
      console.log("getController new", collectionName);

      return newController;
    }
  }

  async updatePartial(data: T, partialUpdate: string[]): Promise<T | null> {
    return await this.collection.updatePartial(data, partialUpdate);
  }

  async updatePartialAny<TModel extends any>(
    id: string,
    data: TModel
  ): Promise<TModel | null> {
    return await this.collection.updatePartialAny(id, data);
  }

  async updatePartialField<TModel extends any>(
    id: string,
    fieldName: string,
    fieldData: TModel
  ): Promise<TModel | null> {
    return await this.collection.updatePartialField<TModel>(
      id,
      fieldName,
      fieldData
    );
  }

  // @Get("/q")
  async getPage(
    page: number = 0,
    limit: number = 10,
    sort: SORT_EXPRN | undefined = { _id: SORT_DIRECTION.ASC },
    populate?: string[]
  ): Promise<IPageRespModel<T>> {
    const res = await this.collection.getPage(page, limit, sort, populate);
    if (res) {
      return new PageRespModel(res, page, limit);
    } else {
      return new PageRespModel(undefined, page, limit, getError(404));
    }
  }

  async getCustom(
    filterQuery: any,
    populate?: string[]
  ): Promise<IListRespModel<T | null>> {
    const res = await this.collection.getCustom(filterQuery, populate);
    return new ListRespModel(res);
  }

  // @Get("/")
  async get(populate?: string[]): Promise<IListRespModel<T>> {
    const res = await this.collection.get(populate);
    return new ListRespModel(res);
  }

  // @Get("/:id")
  async getById(
    id: string,
    populate?: string[]
  ): Promise<IRespModel<T | null>> {
    const res = await this.collection.getById(id, populate);
    return new RespModel(res);
  }

  // @Post("/:id")
  async update(id: string, data: T): Promise<IRespModel<T | null>> {
    const res = await this.collection.update(id, data);
    return new RespModel(res);
  }

  // @Put("/")
  async add(data: T): Promise<IRespModel<T | null>> {
    const res = await this.collection.add(data);
    return new RespModel(res);
  }

  // @Delete("/:id")
  async deletePermanent(id: string): Promise<IRespModel<boolean>> {
    const res = await this.collection.deletePermanent(id);
    return new RespModel(res);
  }

  // @Delete("/:id")
  async delete(id: string): Promise<IRespModel<boolean>> {
    const res = await this.collection.delete(id);
    return new RespModel(res);
  }
}

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
