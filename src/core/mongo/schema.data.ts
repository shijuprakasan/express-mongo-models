import { Schema, SchemaDefinition, SchemaDefinitionType } from "mongoose";
import { BSON } from "bson";

// Common schema options for required string fields
const requiredString = { type: String, required: true };
const optionalString = { type: String, required: false };

export const userLiteSchema = new Schema({
  _id: requiredString,
  userName: requiredString,
  displayName: optionalString,
});

export const tenantLiteSchema = new Schema({
  _id: requiredString,
  tenantName: requiredString,
});

// Utilizing sub-schema directly within another schema definition for clarity
export const changeTrackSchema = new Schema(
  {
    by: { type: userLiteSchema, required: false },
    on: { type: Date, required: true, default: () => new Date() }, // Using a function for default to ensure a new date is created each time
  },
  { _id: false }
);

export const baseSchema = new Schema(
  {
    // _id: false,
    // _id: {type:  Schema.Types.ObjectId, default: () => new BSON.ObjectId()},
    _id: { type: String, default: () => new BSON.ObjectId().toString() },
    // id: { type:String, required: true, unique: true, index: true },
    created: { type: changeTrackSchema, required: true },
    modified: { type: changeTrackSchema, required: false },
    deleted: { type: Boolean, required: false, default: false },
  },
  { _id: false }
);

export const baseTenantDataSchema = new Schema(
  {
    // _id: false,
    // _id: {type:  Schema.Types.ObjectId, default: () => new BSON.ObjectId()},
    _id: { type: String, default: () => new BSON.ObjectId().toString() },
    tenant: { type: tenantLiteSchema, required: true },
    created: { type: changeTrackSchema, required: true },
    modified: { type: changeTrackSchema, required: false },
    deleted: { type: Boolean, required: false, default: false },
  },
  { _id: false }
);

export function newCustomSchema<RawDocType = any>(
  obj: SchemaDefinition<SchemaDefinitionType<RawDocType>> | Schema,
  prefix?: string
): Schema {
  const schema = new Schema();
  schema.add(obj, prefix);
  return schema;
}
