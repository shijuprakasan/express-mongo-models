"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newCustomSchema = exports.CollectionSchemaBuilder = exports.baseSchmea = exports.changeTrackSchema = exports.tenantLiteSchema = exports.userLiteSchema = void 0;
const mongoose_1 = require("mongoose");
const bson_1 = require("bson");
exports.userLiteSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    userName: { type: String, required: true },
    displayName: { type: String, required: false },
});
exports.tenantLiteSchema = new mongoose_1.Schema({
    _id: { type: String, required: true },
    tenantName: { type: String, required: true },
});
exports.changeTrackSchema = new mongoose_1.Schema({
    by: { type: exports.userLiteSchema, required: false },
    on: { type: Date, required: true, default: new Date() }
}, { _id: false });
exports.baseSchmea = new mongoose_1.Schema({
    // _id: false,
    // _id: {type:  Schema.Types.ObjectId, default: () => new BSON.ObjectId()},
    _id: { type: String, default: () => new bson_1.BSON.ObjectId().toString() },
    // id: { type:String, required: true, unique: true, index: true },
    created: { type: exports.changeTrackSchema, required: false },
    modified: { type: exports.changeTrackSchema, required: false },
    deleted: { type: Boolean, required: false, default: false },
}, { _id: false });
class CollectionSchemaBuilder {
    // public dataModel: IBaseDataModel<T>;
    // dataModel: baserModelInterface<T>
    constructor(collectionName) {
        this.collectionName = collectionName;
        this.schema = new mongoose_1.Schema();
        this.schema.add(exports.baseSchmea);
    }
    build(obj, prefix) {
        return this.schema.add(obj, prefix);
    }
    getDataModel() {
        this.schema.statics.build = (attr) => {
            return new DataModel(attr);
        };
        const DataModel = (0, mongoose_1.model)(this.collectionName, this.schema);
        return DataModel;
    }
}
exports.CollectionSchemaBuilder = CollectionSchemaBuilder;
function newCustomSchema(obj, prefix) {
    const schema = new mongoose_1.Schema();
    schema.add(obj, prefix);
    return schema;
}
exports.newCustomSchema = newCustomSchema;
//# sourceMappingURL=mongo.data.js.map