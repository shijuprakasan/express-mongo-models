import { Model, Document, Schema, SchemaDefinitionType, SchemaDefinition, model } from "mongoose";
import { ICoreLiteModel } from "../../core/models";
import { BSON } from "bson";

export interface IBaseDataModel<
  TMode extends ICoreLiteModel
  // ,
  // TDoc extends Document<string>
> extends Model< Document<string>> {
  build(attr: TMode):  Document<string>;
}

export const userLiteSchema = new Schema({
  _id: { type: String, required: true },
  userName: { type: String, required: true },
  displayName: { type: String, required: false },
});

export const tenantLiteSchema = new Schema({
  _id: { type: String, required: true },
  tenantName: { type: String, required: true },
});

export const changeTrackSchema = new Schema({
  by: { type: userLiteSchema, required: false },
  on: { type: Date, required: true, default: new Date() }
}, { _id : false });

export const baseSchmea = new Schema({
  // _id: false,
  // _id: {type:  Schema.Types.ObjectId, default: () => new BSON.ObjectId()},
  _id: { type: String, default: () => new BSON.ObjectId().toString() },
  // id: { type:String, required: true, unique: true, index: true },
  created: { type: changeTrackSchema, required: false },
  modified: { type: changeTrackSchema, required: false },
  deleted: { type: Boolean, required: false, default: false },
}, { _id : false });

export class CollectionSchemaBuilder<T extends ICoreLiteModel> {
  public collectionName: string;
  public schema: Schema;
  // public dataModel: IBaseDataModel<T>;
  // dataModel: baserModelInterface<T>
  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.schema = new Schema();
    this.schema.add(baseSchmea);
  }
  
  build<RawDocType = any>(obj: SchemaDefinition<SchemaDefinitionType<RawDocType>> | Schema, prefix?: string): Schema {
    return this.schema.add(obj, prefix);
  }

  getDataModel() {
    this.schema.statics.build = (attr: T) => {
      return new DataModel(attr);
    };
    
    const DataModel = model<Document<String>, IBaseDataModel<T>>(
      this.collectionName,
      this.schema
    );

    return DataModel;
  }
}

export function newCustomSchema<RawDocType = any>(obj: SchemaDefinition<SchemaDefinitionType<RawDocType>> | Schema, prefix?: string): Schema {
  const schema = new Schema();
  schema.add(obj, prefix);
  return schema;
}