"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.baseTenantDataSchema = exports.baseSchema = exports.changeTrackSchema = exports.tenantLiteSchema = exports.userLiteSchema = void 0;
exports.newCustomSchema = newCustomSchema;
const mongoose_1 = require("mongoose");
const bson_1 = require("bson");
// Common schema options for required string fields
const requiredString = { type: String, required: true };
const optionalString = { type: String, required: false };
exports.userLiteSchema = new mongoose_1.Schema({
    _id: requiredString,
    userName: requiredString,
    displayName: optionalString,
});
exports.tenantLiteSchema = new mongoose_1.Schema({
    _id: requiredString,
    tenantName: requiredString,
});
// Utilizing sub-schema directly within another schema definition for clarity
exports.changeTrackSchema = new mongoose_1.Schema({
    by: { type: exports.userLiteSchema, required: false },
    on: { type: Date, required: true, default: () => new Date() }, // Using a function for default to ensure a new date is created each time
}, { _id: false });
exports.baseSchema = new mongoose_1.Schema({
    // _id: false,
    // _id: {type:  Schema.Types.ObjectId, default: () => new BSON.ObjectId()},
    _id: { type: String, default: () => new bson_1.BSON.ObjectId().toString() },
    // id: { type:String, required: true, unique: true, index: true },
    created: { type: exports.changeTrackSchema, required: true },
    modified: { type: exports.changeTrackSchema, required: false },
    deleted: { type: Boolean, required: false, default: false },
}, { _id: false });
exports.baseTenantDataSchema = new mongoose_1.Schema({
    // _id: false,
    // _id: {type:  Schema.Types.ObjectId, default: () => new BSON.ObjectId()},
    _id: { type: String, default: () => new bson_1.BSON.ObjectId().toString() },
    tenant: { type: exports.tenantLiteSchema, required: true },
    created: { type: exports.changeTrackSchema, required: true },
    modified: { type: exports.changeTrackSchema, required: false },
    deleted: { type: Boolean, required: false, default: false },
}, { _id: false });
function newCustomSchema(obj, prefix) {
    const schema = new mongoose_1.Schema();
    schema.add(obj, prefix);
    return schema;
}
//# sourceMappingURL=schema.data.js.map