import { ICollectionController } from "./base.controller";
import {
  IListRespModel,
  IPageRespModel,
  IRespModel,
  SORT_DIRECTION,
  SORT_EXPRN,
  IBaseLiteModel,
  PageRespModel,
  getError,
  ListRespModel,
  RespModel,
} from "../models/";
import { IAuthContext } from "../auth.context";
import { IDbCollection } from "../data";

export class MongoCollectionController<T extends IBaseLiteModel>
  implements ICollectionController<T>
{
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
      const newController = new MongoCollectionController<TNew>(
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
