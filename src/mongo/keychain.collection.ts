import { Schema } from "mongoose";
import { BSON } from "bson";
import { DbCollection } from "../core/mongo";
import { IKeychainCollection } from "../data";
import { buildNewKeyChain, IKeychainLiteModel, IKeychainModel } from "../models";

export class KeychainCollection extends DbCollection<IKeychainModel> implements IKeychainCollection {
  constructor() {
    super("keychains");
  }

  dataSchema(): Schema {
    return new Schema({
      key: { type: String, required: true, max: 20 },
      keys: [{ type: String, required: true }],
      value: { type: String, required: true, max: 50 },
      comment: { type: String, required: false },
      parent: { type: BSON.ObjectId, ref: 'keychains' },
      children: [{ type: BSON.ObjectId, ref: 'keychains' }],
      p1Id: { type: BSON.ObjectId, required: false },
      p2Id: { type: BSON.ObjectId, required: false },
      p3Id: { type: BSON.ObjectId, required: false },
      p4Id: { type: BSON.ObjectId, required: false },
      p5Id: { type: BSON.ObjectId, required: false },
      p6Id: { type: BSON.ObjectId, required: false },
      p7Id: { type: BSON.ObjectId, required: false },
      p8Id: { type: BSON.ObjectId, required: false },
    });
  }

  static getLiteSchema(): Schema {
    return new Schema({
      key: { type: String, required: true, max: 20 },
      keys: [{ type: String, required: true }],
      value: { type: String, required: true, max: 50 },
      p1Id: { type: BSON.ObjectId, required: false },
      comment: { type: String, required: false },
      parent: { type: BSON.ObjectId, ref: 'keychains' },
      children: [{ type: BSON.ObjectId, ref: 'keychains' }],
    });
  } 

  async preCreate(data: IKeychainModel): Promise<boolean> {
    if (!data.value || data.value.length > 50) {
      throw new Error("value length must be not exceed 50");
    }

    if (data.key && data.key.length > 20) {
      throw new Error("Key length must be not exceed 20");
    }

    if (!data.key && data.value.length > 20) {
      throw new Error("value without Key length must be not exceed 20");
    }

    var parentKeychain: IKeychainModel | undefined = undefined;
    if (data.p1Id) {
      const pobj = await super.getById(data.p1Id);
      if (pobj && pobj) {
        parentKeychain = pobj;
      } else {
        throw new Error("No Parent Exists");
      }
    }

    data = buildNewKeyChain(data, parentKeychain);
    return super.preCreate(data);
  }

  private defaultChildSelectOptionSpec() {
    return { deleted: 0, __v: 0
      , p1Id: 0, p2Id: 0, p3Id: 0, p4Id: 0, p5Id: 0, p6Id: 0, p7Id: 0, p8Id: 0
      , keys: 0
      , tenant: 0, created: 0, modified: 0, children: 0 };
  }

  async getChildren(id: string): Promise<IKeychainLiteModel[]> {
    const doc = await this.collection.find<IKeychainLiteModel>({ p1Id: id })
    .select(this.defaultChildSelectOptionSpec())
    .exec();

    return doc;
  }

  private defaultParentSelectOptionSpec() {
    return { deleted: 0, __v: 0
      , p2Id: 0, p3Id: 0, p4Id: 0, p5Id: 0, p6Id: 0, p7Id: 0, p8Id: 0
      , keys: 0
      , tenant: 0, created: 0, modified: 0, children: 0 };
  }

  async getLite(id: string): Promise<IKeychainLiteModel | null> {
    const doc = await this.collection.findById<IKeychainLiteModel>(id)
    .select(this.defaultParentSelectOptionSpec())
    .exec();

    return doc;
  }
}
