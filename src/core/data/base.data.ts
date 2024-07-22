import {
  CallbackWithoutResultAndOptionalError,
  model,
  Document,
  Model,
  Schema,
  SchemaDefinition,
  SchemaDefinitionType,
} from "mongoose";
import {
  IAuthContext,
  IAuthDataContext,
  IRequireAuthContext,
} from "../auth.context";
import {
  getTenantLiteModel,
  getUserLiteModel,
  IBaseLiteModel,
  IBaseModel,
  ITenantLiteModel,
  ITenantModel,
  IUserLiteModel,
  IUserModel,
  newChangeTrack,
  SORT_DIRECTION,
  SORT_EXPRN,
} from "../models";
import {
  baseSchema,
  baseTenantDataSchema,
  tenantLiteSchema,
} from "./schema.data";
import { logger } from "../utils";

export abstract class AbstractDbCollection<T extends IBaseLiteModel> {
  tenantSchema: boolean = true;
  collectionName: string;
  docSchema: CollectionSchemaBuilder<T>;
  collection: ICollectionModel<T>;

  static DataSchemaCache: { [key: string]: any } = {};

  constructor(
    collectionName: string,
    tenantSchema: boolean = true,
    preHandler: preSaveHandler | null = null,
    postHandler: postSaveHandler | null = null
  ) {
    this.collectionName = collectionName;
    this.tenantSchema = tenantSchema;
    this.docSchema = new CollectionSchemaBuilder<T>(
      collectionName,
      tenantSchema
    );

    this.docSchema.build(this.dataSchema());
    if (preHandler != null) {
      preHandler.bind(this);
      this.registerPreHandler(preHandler);
    }

    if (postHandler != null) {
      postHandler.bind(this);
      this.registerPostHandler(postHandler);
    }

    if (AbstractDbCollection.DataSchemaCache[this.collectionName]) {
      console.log("collection from cache", this.collectionName);
      this.collection =
        AbstractDbCollection.DataSchemaCache[this.collectionName];
    } else {
      console.log("collection creation", this.collectionName);
      this.collection = this.docSchema.getDataModel();
      AbstractDbCollection.DataSchemaCache[this.collectionName] =
        this.collection;
    }
  }
  authContext?: IAuthDataContext = undefined;

  setContext(authContext?: IAuthContext): void {
    this.authContext = authContext as IAuthDataContext;
  }

  get tenantId(): string | undefined {
    if (
      this.authContext &&
      this.authContext?.tenantId &&
      this.authContext.tenantId.length > 0
    )
      return this.authContext.tenantId;
    else return undefined;
  }

  get userId(): string | undefined {
    if (
      this.authContext &&
      this.authContext?.userId &&
      this.authContext.userId.length > 0
    )
      return this.authContext?.userId;
    else return undefined;
  }

  get tenant(): ITenantModel | undefined {
    return this.authContext?.tenant;
  }

  get user(): IUserModel | undefined {
    return this.authContext?.user;
  }

  set tenant(value: ITenantModel) {
    if (this.authContext) this.authContext.tenant = value;
  }

  set user(value: IUserModel) {
    if (this.authContext) this.authContext.user = value;
  }

  private modelCache: { [key: string]: IDbCollection<any> } = {};

  getCollection<TNew extends IBaseLiteModel>(
    collectionName: string,
    collectionPredicate: () => IDbCollection<TNew>
  ): IDbCollection<TNew> {
    const res = this.modelCache[collectionName] as IDbCollection<TNew>;
    if (res) {
      console.log("getCollection from cache", collectionName);
      return res;
    } else {
      const newCollection = collectionPredicate();
      this.setContext(this.authContext);
      this.modelCache[collectionName] = newCollection as any;
      console.log("getCollection new", collectionName);

      return newCollection;
    }
  }

  private async getContextTenant(): Promise<ITenantModel | undefined> {
    // return this.tenant;
    if (!this.tenantId || this.tenant) return this.tenant;
    const tenantCollection = this.getCollection(
      "tenants",
      () => new TenantBaseCollection()
    );
    const tenantRes = await (
      tenantCollection as any as AbstractDbCollection<ITenantModel>
    ).getByIdInternal(this.tenantId);
    console.log("tenantRes", tenantRes, this.tenantId);
    this.tenant = tenantRes as ITenantModel;
    return this.tenant;
  }

  private async getContextTenantLite(): Promise<ITenantLiteModel | null> {
    const tenant = await this.getContextTenant();
    if (!tenant) return null;
    const tlite = getTenantLiteModel(tenant);
    // const tlite = getTenantLiteModel(tenant);
    return tlite;
  }

  private async getContextUser(): Promise<IUserModel | undefined> {
    // return this.user;
    if (!this.userId || this.user) return this.user;
    const userCollection = this.getCollection(
      "users",
      () => new UserBaseCollection()
    );
    const userres = await (
      userCollection as any as AbstractDbCollection<IUserModel>
    ).getByIdInternal(this.userId);
    console.log("userres", userres, this.userId);
    this.user = userres as IUserModel;
    return this.user;
  }

  protected async getContextUserLite(): Promise<IUserLiteModel | null> {
    const user = await this.getContextUser();
    if (!user) return null;
    const ulite = getUserLiteModel(user);
    return ulite;
  }

  protected async getByIdInternal(id: string): Promise<T | null> {
    const doc = await this.collection.findById<T>(id).exec();

    return doc;
  }

  async updateBaseModelProps(data: T, isCreate: boolean = false): Promise<T> {
    const data_updates = data as any as IBaseModel;
    data_updates.deleted = false;

    if (this.tenantSchema) {
      const tlite = await this.getContextTenantLite();
      data_updates.tenant = tlite as ITenantLiteModel;
    }

    const ulite = await this.getContextUserLite();
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

  abstract dataSchema(): Schema;

  /**
   * override to expose lite scehma
   * @returns lite Schema
   */
  static getLiteSchema(): Schema {
    return new Schema({});
  }

  getDataModel(): ICollectionModel<T> {
    return this.collection;
  }

  private registerPostHandler(handler: postSaveHandler) {
    const colName = this.docSchema.collectionName;
    this.docSchema.schema.post("save", async function (updated) {
      var tself = this;
      logger.log(`${colName} post save handler`);
      handler(updated);
    });
  }

  private registerPreHandler(handler: preSaveHandler) {
    const colName = this.docSchema.collectionName;
    this.docSchema.schema.pre("save", async function (nextHandler) {
      var tself = this;
      logger.log(`${colName} pre save handler`);
      handler(nextHandler, tself);
    });
  }

  protected defaultFilterOptionSpec() {
    if (this.tenantId) {
      return {
        "tenant._id": this.tenantId,
        $or: [{ deleted: { $eq: null } }, { deleted: false }],
      };
    }

    return { $or: [{ deleted: { $eq: null } }, { deleted: false }] };
  }

  protected defaultSelectOptionSpec() {
    return { deleted: 0, __v: 0 };
  }

  protected defaultPopulationExpandSpec(populateOptions?: string[]) {
    return (
      populateOptions && populateOptions?.length === 1
        ? populateOptions && populateOptions[0]
        : populateOptions ?? undefined
    ) as string;
  }

  protected defaultPopulationSelectSpec(populateOptions?: string[]) {
    return (
      populateOptions && populateOptions?.length > 0
        ? { deleted: 0, __v: 0 }
        : undefined
    ) as any; //  _id: 0
  }
}

export interface IDbCollection<T extends IBaseLiteModel>
  extends IQueryCollection<T>,
    IUpdateCollection<T>,
    IRequireAuthContext {
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

export interface IUserBaseCollection extends IDbCollection<IUserModel> {}

export abstract class DbCollection<T extends IBaseLiteModel>
  extends AbstractDbCollection<T>
  implements IDbCollection<T>, IRequireAuthContext
{
  constructor(
    collectionName: string,
    tenantSchema: boolean = true,
    preHandler: preSaveHandler | null = null,
    postHandler: postSaveHandler | null = null
  ) {
    super(collectionName, tenantSchema, preHandler, postHandler);
  }

  async updatePartial(data: T, partialUpdate: string[]): Promise<T | null> {
    const dataRes = await this.getById(data._id);
    const dataToUpdate = dataRes as T;
    const set: any = {};
    for (const field in partialUpdate) {
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

  async updatePartialAny<TModel extends any>(
    id: string,
    data: TModel
  ): Promise<TModel | null> {
    const dataRes = await this.getById(id);
    const dataToUpdate = dataRes as T;
    const set: any = {};
    for (const field in data) {
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

  async updatePartialField<TModel extends any>(
    id: string,
    fieldName: string,
    fieldData: TModel
  ): Promise<TModel | null> {
    const dataRes = await this.getById(id);
    const dataToUpdate = dataRes as T;
    const fieldSet: any = {};
    fieldSet[fieldName] = fieldData;
    const set: any = { $or: [{ deleted: { $eq: null } }, { deleted: false }] };
    set[fieldName] = fieldData;
    (dataToUpdate as any)[fieldName] = fieldSet;
    await this.preUpdate(dataToUpdate, fieldSet);
    await this.onUpdate(dataToUpdate, fieldSet);

    const resDoc = await this.collection
      .updateOne<T>({ _id: id }, { $set: set })
      .exec();
    if (resDoc.modifiedCount > 0) {
      // updated
      await this.postUpdate(dataToUpdate, fieldSet);
    }

    return resDoc.modifiedCount > 0 ? fieldData : null;
  }

  async getPage(
    page: number = 0,
    limit: number = 10,
    sort: SORT_EXPRN | undefined = { _id: SORT_DIRECTION.ASC },
    populate?: string[]
  ): Promise<T[]> {
    const docs = await this.collection
      .find<T>(this.defaultFilterOptionSpec())
      .skip(page * limit)
      .limit(limit)
      .sort(sort)
      .select(this.defaultSelectOptionSpec())
      .populate(
        this.defaultPopulationExpandSpec(populate),
        this.defaultPopulationSelectSpec(populate)
      )
      .exec();

    // const pageRes = new PageRespModel(docs, page, limit);
    // pageRes.sort = sort;
    // pageRes.status = docs.length > 0 ? 404 : 200;
    return docs;
  }

  async getCustom(filterQuery: any, populate?: string[]): Promise<T[]> {
    filterQuery = { ...filterQuery, ...this.defaultFilterOptionSpec() };
    const doc = await this.collection
      .find<T>(filterQuery)
      .select(this.defaultSelectOptionSpec())
      .populate(
        this.defaultPopulationExpandSpec(populate),
        this.defaultPopulationSelectSpec(populate)
      )
      .exec();
    return doc;
  }

  async get(populate?: string[]): Promise<T[]> {
    const docs = await this.collection
      .find<T>(this.defaultFilterOptionSpec())
      .select(this.defaultSelectOptionSpec())
      .populate(
        this.defaultPopulationExpandSpec(populate),
        this.defaultPopulationSelectSpec(populate)
      )
      .exec();
    return docs;
  }

  async getById(id: string, populate?: string[]): Promise<T | null> {
    const doc = await this.collection
      .findById<T>(id)
      .select(this.defaultSelectOptionSpec())
      .populate(
        this.defaultPopulationExpandSpec(populate),
        this.defaultPopulationSelectSpec(populate)
      )
      .exec();

    if (
      this.tenantId &&
      doc &&
      (doc as any).tenant &&
      (doc as any).tenant._id !== this.tenantId
    ) {
      return null;
    }

    return doc;
  }

  async update(id: string, data: T): Promise<T | null> {
    let canContinue = await this.preUpdate(data);
    if (!canContinue) {
      throw Error("Bad Request, Failed in pre update data validation");
    }

    data = await this.updateBaseModelProps(data);

    const doc1 = this.collection.build(data);
    doc1._id = id;
    canContinue = await this.onUpdate(data);
    if (!canContinue) {
      throw Error("Bad Request, Failed while updating data");
    }

    const doc = await this.collection
      .findOneAndUpdate<T>({ _id: id }, doc1)
      .exec();
    await this.postUpdate(data);
    return data;
  }

  async add(data: T): Promise<T> {
    let canContinue = await this.preCreate(data);
    if (!canContinue) {
      throw Error("Bad Request, Failed in pre create data validation");
    }

    data = await this.updateBaseModelProps(data, true);

    console.log(
      "add data",
      data,
      this.tenantId,
      this.userId,
      this.tenantSchema
    );
    const doc1 = this.collection.build(data);
    canContinue = await this.onCreate(data);
    if (!canContinue) {
      throw Error("Bad Request, Failed while creating data");
    }

    const doc = await doc1.save();
    data._id = doc._id as string;
    await this.postCreate(data);

    return data;
  }

  async deletePermanent(id: string): Promise<boolean> {
    let canContinue = await this.preDelete(id, null);
    if (!canContinue) {
      throw Error("Bad Request, Failed in pre delete data validation");
    }

    canContinue = await this.preDelete(id, null);
    if (!canContinue) {
      throw Error("Bad Request, Failed while deleting data");
    }
    const doc = await this.collection
      .deleteOne({ _id: id, ...this.defaultFilterOptionSpec() })
      .exec();
    await this.postDelete(id, null);
    return (doc.deletedCount ?? 0) > 0;
  }

  async delete(id: string): Promise<boolean> {
    const dataRes = await this.getById(id);
    let data = dataRes as T;
    let canContinue = await this.preDelete(id, data);
    if (!canContinue) {
      throw Error("Bad Request, Failed in pre delete data validation");
    }

    data = await this.updateBaseModelProps(data, false);
    (data as any as IBaseModel).deleted = true;

    const doc1 = this.collection.build(data);
    doc1._id = id;
    canContinue = await this.preDelete(id, data);
    if (!canContinue) {
      throw Error("Bad Request, Failed while deleting data");
    }

    const doc = await this.collection
      .findOneAndUpdate<T>({ _id: id }, doc1)
      .exec();
    await this.postDelete(id, doc);
    return true;
  }
}

export class UserBaseCollection
  extends DbCollection<IUserModel>
  implements IUserBaseCollection
{
  constructor() {
    super("users", true);
  }

  dataSchema(): Schema {
    return new Schema({
      userName: { type: String, required: true },
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      // displayName: { type: String, required: true },
      email: { type: String, lowercase: true, required: true },
      phone: { type: String, required: true },
      userRole: {
        type: String,
        required: true,
        enum: [
          "super-admin",
          "admin",
          "recomentation",
          "subscriber",
          "agent",
          "standard",
        ],
        default: "standard",
      },
      isActive: { type: Boolean, required: true, default: true },
      tenant: { type: tenantLiteSchema, required: false },
    });
  }
}

export interface ITenantBaseCollection extends IDbCollection<ITenantModel> {}

export class TenantBaseCollection
  extends DbCollection<ITenantModel>
  implements ITenantBaseCollection
{
  constructor() {
    super("tenants", false);
  }

  dataSchema(): Schema {
    return new Schema({
      tenantName: { type: String, required: true },
      locale: { type: String, required: true, default: "en-IN" },
      currency: {
        type: String,
        uppercase: true,
        required: true,
        default: "INR",
      },
      isActive: { type: Boolean, required: true, default: true },
    });
  }
}

// Simplified and strongly typed interface
export interface ICollectionModel<TModel extends IBaseLiteModel>
  extends Model<Document<string>> {
  build(attr: TModel): Document<string>;
}

class CollectionSchemaBuilder<T extends IBaseLiteModel> {
  public collectionName: string;
  public schema: Schema;
  constructor(collectionName: string, tenantSchema: boolean = true) {
    this.collectionName = collectionName;
    this.schema = new Schema();
    if (tenantSchema) {
      this.schema.add(baseTenantDataSchema);
    } else {
      this.schema.add(baseSchema);
    }
  }

  build<RawDocType = any>(
    obj: SchemaDefinition<SchemaDefinitionType<RawDocType>> | Schema,
    prefix?: string
  ): Schema {
    return this.schema.add(obj, prefix);
  }

  getDataModel() {
    this.schema.statics.build = (attr: T) => {
      return new DataModel(attr);
    };

    const DataModel = model<Document<string>, ICollectionModel<T>>(
      this.collectionName,
      this.schema
    );

    return DataModel;
  }
}

export interface IQueryCollection<T extends IBaseLiteModel>
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

export interface IUpdateCollection<T extends IBaseLiteModel>
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

export type preSaveHandler = (
  next: CallbackWithoutResultAndOptionalError,
  dataInfo: any
) => Promise<void>;
export type postSaveHandler = (data: any) => Promise<void>;
