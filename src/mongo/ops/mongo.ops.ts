import {
  ICoreLiteModel,
  IUserLiteModel,
  getUserLiteModel,
  newChangeTrack,
} from "../../core";
import {
  getTenantLiteModel,
  ITenantLiteModel,
  ITenantModel,
  IBaseTenantModel,
  IUserModel,
} from "../../models";
import { IBaseDataModel } from "../data";
import { ICoreOperations } from "../../core";
import { logger } from "../../core/utils/logger";
import { TenantDataModel, UserDataModel } from "../../data";
import {
  IListRespModel,
  IPageRespModel,
  IRespModel,
  ListRespModel,
  PageRespModel,
  RespModel,
  SORT_DIRECTION,
  SORT_EXPRN,
} from "../../core";

export class MongoCRUDOperations<T extends ICoreLiteModel>
  implements ICoreOperations<T>
{
  collection: IBaseDataModel<T>;
  tenantId: string = "";
  userId: string = "";
  tenant: ITenantModel | null = null;
  user: IUserModel | null = null;

  constructor(collection: IBaseDataModel<T>) {
    this.collection = collection;
  }

  private async getTenant(): Promise<ITenantModel | null> {
    if (this.tenant) return this.tenant;
    const tenantOps = new MongoCRUDOperations(TenantDataModel);
    const tenantRes = await tenantOps.getById(this.tenantId);
    if (!tenantRes) return null;
    this.tenant = tenantRes?.data as ITenantModel;
    return this.tenant;
  }

  private async getTenantLite(): Promise<ITenantLiteModel | null> {
    const tenant = await this.getTenant();
    if (!tenant) return null;
    const tlite = getTenantLiteModel(tenant);
    // const tlite = getTenantLiteModel(tenant);
    return tlite;
  }

  private async getUser(): Promise<IUserModel | null> {
    if (this.user) return this.user;
    const userOps = new MongoCRUDOperations(UserDataModel);
    const userres = await userOps.getById(this.userId);
    if (!userres) return null;
    this.user = userres?.data as IUserModel;
    return this.user;
  }

  private async getUserLite(): Promise<IUserLiteModel | null> {
    const user = await this.getUser();
    if (!user) return null;
    const ulite = getUserLiteModel(user);
    // const ulite = getUserLiteModel(user);
    return ulite;
  }

  async updateBaseModelProps(data: T, isCreate: boolean = false): Promise<T> {
    var data_updates = data as any as IBaseTenantModel;
    const tlite = await this.getTenantLite();
    if (!tlite) return data;
    data_updates.tenant = tlite as ITenantLiteModel;
    const ulite = await this.getUserLite();
    if (!ulite) return data;
    data_updates.deleted = false;
    data_updates.modified = newChangeTrack(ulite as IUserLiteModel);
    if (isCreate) {
      data_updates.created = data_updates.modified;
    } else {
      //TODO: no need to update created, validate that created is not removed after update operation
      data_updates.created = undefined;
    }

    return data;
  }

  async preCreate(data: T): Promise<boolean> {
    /* Meant To be overriden */
    return true;
  }
  async onCreate(data: T): Promise<boolean> {
    /* Meant To be overriden */
    return true;
  }
  async postCreate(data: T): Promise<void> {
    /* Meant To be overriden */
  }

  async preUpdate(data: T, extras?: any): Promise<boolean> {
    /* Meant To be overriden */
    return true;
  }
  async onUpdate(data: T, extras?: any): Promise<boolean> {
    /* Meant To be overriden */
    return true;
  }
  async postUpdate(data: T, extras?: any): Promise<void> {
    /* Meant To be overriden */
  }

  async preDelete(id: string, data: T | null): Promise<boolean> {
    /* Meant To be overriden */
    return true;
  }
  async onDelete(id: string, data: T | null): Promise<boolean> {
    /* Meant To be overriden */
    return true;
  }
  async postDelete(id: string, data: T | null): Promise<void> {
    /* Meant To be overriden */
  }

  async updatePartial(data: T, partialUpdate: string[]): Promise<T | null> {
    const dataRes = await this.getById(data._id);
    const dataToUpdate = dataRes.data as T;
    let set: any = {};
    for (var field in partialUpdate) {
      set[field] = (data as any)[field];
      (dataToUpdate as any)[field] = (data as any)[field];
    }
    await this.preUpdate(dataToUpdate, set);
    await this.onUpdate(dataToUpdate, set);

    const resDoc = await this.collection
      .updateOne<T>({ _id: data._id }, { $set: set })
      .exec();
    if (resDoc.modifiedCount > 0) {
      // updated
      await this.postUpdate(dataToUpdate, set);
    }

    return resDoc.modifiedCount > 0 ? data : null;
  }

  async updatePartialAny<TModel extends unknown>(
    id: string,
    data: TModel
  ): Promise<TModel | null> {
    const dataRes = await this.getById(id);
    const dataToUpdate = dataRes.data as T;
    let set: any = {};
    for (var field in data) {
      set[field] = data[field];
      (dataToUpdate as any)[field] = data[field];
    }
    await this.preUpdate(dataToUpdate, set);
    await this.onUpdate(dataToUpdate, set);

    const resDoc = await this.collection
      .updateOne<T>({ _id: id }, { $set: set })
      .exec();
    if (resDoc.modifiedCount > 0) {
      // updated
      await this.postUpdate(dataToUpdate, set);
    }

    return resDoc.modifiedCount > 0 ? data : null;
  }

  async updatePartialField<TModel extends unknown>(
    id: string,
    fieldName: string,
    fieldData: TModel
  ): Promise<TModel | null> {
    const dataRes = await this.getById(id);
    const dataToUpdate = dataRes.data as T;
    let set: any = {};
    set[fieldName] = fieldData;
    (dataToUpdate as any)[fieldName] = fieldData;
    await this.preUpdate(dataToUpdate, set);
    await this.onUpdate(dataToUpdate, set);

    console.log("set", set);

    const resDoc = await this.collection
      .updateOne<T>({ _id: id }, { $set: set })
      .exec();
    if (resDoc.modifiedCount > 0) {
      // updated
      await this.postUpdate(dataToUpdate, set);
    }

    return resDoc.modifiedCount > 0 ? fieldData : null;
  }

  async getPage(
    page: number = 0,
    limit: number = 10,
    sort: SORT_EXPRN | undefined = { _id: SORT_DIRECTION.ASC }
  ): Promise<IPageRespModel<T>> {
    console.log("sort", sort);
    const docs = await this.collection
      .find<T>({ $or: [{ deleted: { $eq: null } }, { deleted: false }] })
      .skip(page * limit)
      .limit(limit)
      .sort(sort)
      .exec();

    let pageRes = new PageRespModel(docs, page, limit);
    pageRes.sort = sort;
    pageRes.status = docs.length > 0 ? 404 : 200;
    return pageRes;
  }

  async get(): Promise<IListRespModel<T>> {
    const docs = await this.collection
      .find<T>({ $or: [{ deleted: { $eq: null } }, { deleted: false }] })
      .exec();
    return new ListRespModel(docs);
  }

  async getById(id: string): Promise<IRespModel<T | null>> {
    var doc = await this.collection.findById<T>(id).exec();
    return new RespModel(doc as T);
  }

  async update(id: string, data: T): Promise<IRespModel<T | null>> {
    let canContinue = await this.preUpdate(data);
    if (!canContinue) {
      const outRes = new RespModel(null);
      outRes.status = 500;
      return outRes;
    }

    data = await this.updateBaseModelProps(data);

    const doc1 = this.collection.build(data);
    doc1._id = id;
    canContinue = await this.onUpdate(data);
    if (!canContinue) {
      const outRes = new RespModel(null);
      outRes.status = 500;
      return outRes;
    }

    const doc = await this.collection
      .findOneAndUpdate<T>({ _id: id }, doc1)
      .exec();
    await this.postUpdate(data);
    return new RespModel(data as T);
  }

  async add(data: T): Promise<IRespModel<T | null>> {
    let canContinue = await this.preCreate(data);
    if (!canContinue) {
      const outRes = new RespModel(null);
      outRes.status = 500;
      return outRes;
    }

    data = await this.updateBaseModelProps(data, true);

    const doc1 = this.collection.build(data);
    canContinue = await this.onCreate(data);
    if (!canContinue) {
      const outRes = new RespModel(null);
      outRes.status = 500;
      return outRes;
    }

    const doc = await doc1.save();
    if (!doc1) return new RespModel(null);
    data._id = doc._id as string;
    await this.postCreate(data);
    return new RespModel(data as T);
  }

  async deletePermenant(id: string): Promise<IRespModel<boolean>> {
    let canContinue = await this.preDelete(id, null);
    if (!canContinue) {
      const outRes = new RespModel(false);
      outRes.status = 500;
      return outRes;
    }

    canContinue = await this.preDelete(id, null);
    if (!canContinue) {
      const outRes = new RespModel(false);
      outRes.status = 500;
      return outRes;
    }
    const doc = await this.collection.deleteOne({ _id: id }).exec();
    await this.postDelete(id, null);
    return new RespModel((doc.deletedCount ?? 0) > 0);
  }

  async delete(id: string): Promise<IRespModel<boolean>> {
    const dataRes = await this.getById(id);
    let data = dataRes?.data as T;
    let canContinue = await this.preDelete(id, data);
    if (!canContinue) {
      const outRes = new RespModel(false);
      outRes.status = 500;
      return outRes;
    }

    data = await this.updateBaseModelProps(data, false);
    (data as any as IBaseTenantModel).deleted = true;

    const doc1 = this.collection.build(data);
    doc1._id = id;
    canContinue = await this.preDelete(id, data);
    if (!canContinue) {
      const outRes = new RespModel(false);
      outRes.status = 500;
      return outRes;
    }

    const doc = await this.collection
      .findOneAndUpdate<T>({ _id: id }, doc1)
      .exec();
    await this.postDelete(id, doc);
    return new RespModel(true);
  }
}
