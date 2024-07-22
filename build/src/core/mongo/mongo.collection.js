"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantBaseCollection = exports.UserBaseCollection = exports.DbCollection = exports.AbstractDbCollection = void 0;
const mongoose_1 = require("mongoose");
const models_1 = require("./../../core/models");
const schema_data_1 = require("./schema.data");
const utils_1 = require("./../../core/utils");
class AbstractDbCollection {
    constructor(collectionName, tenantSchema = true, preHandler = null, postHandler = null) {
        this.tenantSchema = true;
        this.authContext = undefined;
        this.modelCache = {};
        this.collectionName = collectionName;
        this.tenantSchema = tenantSchema;
        this.docSchema = new CollectionSchemaBuilder(collectionName, tenantSchema);
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
        }
        else {
            console.log("collection creation", this.collectionName);
            this.collection = this.docSchema.getDataModel();
            AbstractDbCollection.DataSchemaCache[this.collectionName] =
                this.collection;
        }
    }
    setContext(authContext) {
        this.authContext = authContext;
    }
    get tenantId() {
        var _a;
        if (this.authContext &&
            ((_a = this.authContext) === null || _a === void 0 ? void 0 : _a.tenantId) &&
            this.authContext.tenantId.length > 0)
            return this.authContext.tenantId;
        else
            return undefined;
    }
    get userId() {
        var _a, _b;
        if (this.authContext &&
            ((_a = this.authContext) === null || _a === void 0 ? void 0 : _a.userId) &&
            this.authContext.userId.length > 0)
            return (_b = this.authContext) === null || _b === void 0 ? void 0 : _b.userId;
        else
            return undefined;
    }
    get tenant() {
        var _a;
        return (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.tenant;
    }
    get user() {
        var _a;
        return (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.user;
    }
    set tenant(value) {
        if (this.authContext)
            this.authContext.tenant = value;
    }
    set user(value) {
        if (this.authContext)
            this.authContext.user = value;
    }
    getCollection(collectionName, collectionPredicate) {
        const res = this.modelCache[collectionName];
        if (res) {
            console.log("getCollection from cache", collectionName);
            return res;
        }
        else {
            const newCollection = collectionPredicate();
            this.setContext(this.authContext);
            this.modelCache[collectionName] = newCollection;
            console.log("getCollection new", collectionName);
            return newCollection;
        }
    }
    getContextTenant() {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.tenant;
            if (!this.tenantId || this.tenant)
                return this.tenant;
            const tenantCollection = this.getCollection("tenants", () => new TenantBaseCollection());
            const tenantRes = yield tenantCollection.getByIdInternal(this.tenantId);
            console.log("tenantRes", tenantRes, this.tenantId);
            this.tenant = tenantRes;
            return this.tenant;
        });
    }
    getContextTenantLite() {
        return __awaiter(this, void 0, void 0, function* () {
            const tenant = yield this.getContextTenant();
            if (!tenant)
                return null;
            const tlite = (0, models_1.getTenantLiteModel)(tenant);
            // const tlite = getTenantLiteModel(tenant);
            return tlite;
        });
    }
    getContextUser() {
        return __awaiter(this, void 0, void 0, function* () {
            // return this.user;
            if (!this.userId || this.user)
                return this.user;
            const userCollection = this.getCollection("users", () => new UserBaseCollection());
            const userres = yield userCollection.getByIdInternal(this.userId);
            console.log("userres", userres, this.userId);
            this.user = userres;
            return this.user;
        });
    }
    getContextUserLite() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getContextUser();
            if (!user)
                return null;
            const ulite = (0, models_1.getUserLiteModel)(user);
            return ulite;
        });
    }
    updateBaseModelProps(data_1) {
        return __awaiter(this, arguments, void 0, function* (data, isCreate = false) {
            const data_updates = data;
            data_updates.deleted = false;
            if (this.tenantSchema) {
                const tlite = yield this.getContextTenantLite();
                data_updates.tenant = tlite;
            }
            const ulite = yield this.getContextUserLite();
            data_updates.modified = (0, models_1.newChangeTrack)(ulite);
            if (isCreate) {
                data_updates.created = data_updates.modified;
            }
            else {
                //TODO: no need to update created, validate that created is not removed after update operation
                data_updates.created = undefined;
            }
            return data;
        });
    }
    preCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
            return true;
        });
    }
    onCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
            return true;
        });
    }
    postCreate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
        });
    }
    preUpdate(data, extras) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
            return true;
        });
    }
    onUpdate(data, extras) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
            return true;
        });
    }
    postUpdate(data, extras) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
        });
    }
    preDelete(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
            return true;
        });
    }
    onDelete(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
            return true;
        });
    }
    postDelete(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            /* Meant To be overriden */
        });
    }
    /**
     * override to expose lite scehma
     * @returns lite Schema
     */
    static getLiteSchema() {
        return new mongoose_1.Schema({});
    }
    getDataModel() {
        return this.collection;
    }
    registerPostHandler(handler) {
        const colName = this.docSchema.collectionName;
        this.docSchema.schema.post("save", function (updated) {
            return __awaiter(this, void 0, void 0, function* () {
                var tself = this;
                utils_1.logger.log(`${colName} post save handler`);
                handler(updated);
            });
        });
    }
    registerPreHandler(handler) {
        const colName = this.docSchema.collectionName;
        this.docSchema.schema.pre("save", function (nextHandler) {
            return __awaiter(this, void 0, void 0, function* () {
                var tself = this;
                utils_1.logger.log(`${colName} pre save handler`);
                handler(nextHandler, tself);
            });
        });
    }
    defaultFilterOptionSpec() {
        if (this.tenantId) {
            return {
                "tenant._id": this.tenantId,
                $or: [{ deleted: { $eq: null } }, { deleted: false }],
            };
        }
        return { $or: [{ deleted: { $eq: null } }, { deleted: false }] };
    }
    defaultSelectOptionSpec() {
        return { deleted: 0, __v: 0 };
    }
    defaultPopulationExpandSpec(populateOptions) {
        return (populateOptions && (populateOptions === null || populateOptions === void 0 ? void 0 : populateOptions.length) === 1
            ? populateOptions && populateOptions[0]
            : populateOptions !== null && populateOptions !== void 0 ? populateOptions : undefined);
    }
    defaultPopulationSelectSpec(populateOptions) {
        return (populateOptions && (populateOptions === null || populateOptions === void 0 ? void 0 : populateOptions.length) > 0
            ? { deleted: 0, __v: 0 }
            : undefined); //  _id: 0
    }
}
exports.AbstractDbCollection = AbstractDbCollection;
AbstractDbCollection.DataSchemaCache = {};
class DbCollection extends AbstractDbCollection {
    constructor(collectionName, tenantSchema = true, preHandler = null, postHandler = null) {
        super(collectionName, tenantSchema, preHandler, postHandler);
    }
    updatePartial(data, partialUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(data._id);
            const dataToUpdate = dataRes;
            const set = {};
            for (const field in partialUpdate) {
                set[field] = data[field];
                dataToUpdate[field] = data[field];
            }
            yield this.preUpdate(dataToUpdate, set);
            yield this.onUpdate(dataToUpdate, set);
            const resDoc = yield this.collection
                .updateOne({ _id: data._id }, { $set: set })
                .exec();
            if (resDoc.modifiedCount > 0) {
                // updated
                yield this.postUpdate(dataToUpdate, set);
            }
            return resDoc.modifiedCount > 0 ? data : null;
        });
    }
    getByIdInternal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.collection.findById(id).exec();
            return doc;
        });
    }
    updatePartialAny(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(id);
            const dataToUpdate = dataRes;
            const set = {};
            for (const field in data) {
                set[field] = data[field];
                dataToUpdate[field] = data[field];
            }
            yield this.preUpdate(dataToUpdate, set);
            yield this.onUpdate(dataToUpdate, set);
            const resDoc = yield this.collection
                .updateOne({ _id: id }, { $set: set })
                .exec();
            if (resDoc.modifiedCount > 0) {
                // updated
                yield this.postUpdate(dataToUpdate, set);
            }
            return resDoc.modifiedCount > 0 ? data : null;
        });
    }
    updatePartialField(id, fieldName, fieldData) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(id);
            const dataToUpdate = dataRes;
            const fieldSet = {};
            fieldSet[fieldName] = fieldData;
            const set = { $or: [{ deleted: { $eq: null } }, { deleted: false }] };
            set[fieldName] = fieldData;
            dataToUpdate[fieldName] = fieldSet;
            yield this.preUpdate(dataToUpdate, fieldSet);
            yield this.onUpdate(dataToUpdate, fieldSet);
            const resDoc = yield this.collection
                .updateOne({ _id: id }, { $set: set })
                .exec();
            if (resDoc.modifiedCount > 0) {
                // updated
                yield this.postUpdate(dataToUpdate, fieldSet);
            }
            return resDoc.modifiedCount > 0 ? fieldData : null;
        });
    }
    getPage() {
        return __awaiter(this, arguments, void 0, function* (page = 0, limit = 10, sort = { _id: models_1.SORT_DIRECTION.ASC }, populate) {
            const docs = yield this.collection
                .find(this.defaultFilterOptionSpec())
                .skip(page * limit)
                .limit(limit)
                .sort(sort)
                .select(this.defaultSelectOptionSpec())
                .populate(this.defaultPopulationExpandSpec(populate), this.defaultPopulationSelectSpec(populate))
                .exec();
            // const pageRes = new PageRespModel(docs, page, limit);
            // pageRes.sort = sort;
            // pageRes.status = docs.length > 0 ? 404 : 200;
            return docs;
        });
    }
    getCustom(filterQuery, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            filterQuery = Object.assign(Object.assign({}, filterQuery), this.defaultFilterOptionSpec());
            const doc = yield this.collection
                .find(filterQuery)
                .select(this.defaultSelectOptionSpec())
                .populate(this.defaultPopulationExpandSpec(populate), this.defaultPopulationSelectSpec(populate))
                .exec();
            return doc;
        });
    }
    get(populate) {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection
                .find(this.defaultFilterOptionSpec())
                .select(this.defaultSelectOptionSpec())
                .populate(this.defaultPopulationExpandSpec(populate), this.defaultPopulationSelectSpec(populate))
                .exec();
            return docs;
        });
    }
    getById(id, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.collection
                .findById(id)
                .select(this.defaultSelectOptionSpec())
                .populate(this.defaultPopulationExpandSpec(populate), this.defaultPopulationSelectSpec(populate))
                .exec();
            if (this.tenantId &&
                doc &&
                doc.tenant &&
                doc.tenant._id !== this.tenantId) {
                return null;
            }
            return doc;
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let canContinue = yield this.preUpdate(data);
            if (!canContinue) {
                throw Error("Bad Request, Failed in pre update data validation");
            }
            data = yield this.updateBaseModelProps(data);
            const doc1 = this.collection.build(data);
            doc1._id = id;
            canContinue = yield this.onUpdate(data);
            if (!canContinue) {
                throw Error("Bad Request, Failed while updating data");
            }
            const doc = yield this.collection
                .findOneAndUpdate({ _id: id }, doc1)
                .exec();
            yield this.postUpdate(data);
            return data;
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let canContinue = yield this.preCreate(data);
            if (!canContinue) {
                throw Error("Bad Request, Failed in pre create data validation");
            }
            data = yield this.updateBaseModelProps(data, true);
            console.log("add data", data, this.tenantId, this.userId, this.tenantSchema);
            const doc1 = this.collection.build(data);
            canContinue = yield this.onCreate(data);
            if (!canContinue) {
                throw Error("Bad Request, Failed while creating data");
            }
            const doc = yield doc1.save();
            data._id = doc._id;
            yield this.postCreate(data);
            return data;
        });
    }
    deletePermanent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let canContinue = yield this.preDelete(id, null);
            if (!canContinue) {
                throw Error("Bad Request, Failed in pre delete data validation");
            }
            canContinue = yield this.preDelete(id, null);
            if (!canContinue) {
                throw Error("Bad Request, Failed while deleting data");
            }
            const doc = yield this.collection
                .deleteOne(Object.assign({ _id: id }, this.defaultFilterOptionSpec()))
                .exec();
            yield this.postDelete(id, null);
            return ((_a = doc.deletedCount) !== null && _a !== void 0 ? _a : 0) > 0;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(id);
            let data = dataRes;
            let canContinue = yield this.preDelete(id, data);
            if (!canContinue) {
                throw Error("Bad Request, Failed in pre delete data validation");
            }
            data = yield this.updateBaseModelProps(data, false);
            data.deleted = true;
            const doc1 = this.collection.build(data);
            doc1._id = id;
            canContinue = yield this.preDelete(id, data);
            if (!canContinue) {
                throw Error("Bad Request, Failed while deleting data");
            }
            const doc = yield this.collection
                .findOneAndUpdate({ _id: id }, doc1)
                .exec();
            yield this.postDelete(id, doc);
            return true;
        });
    }
}
exports.DbCollection = DbCollection;
class UserBaseCollection extends DbCollection {
    constructor() {
        super("users", true);
    }
    dataSchema() {
        return new mongoose_1.Schema({
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
            tenant: { type: schema_data_1.tenantLiteSchema, required: false },
        });
    }
}
exports.UserBaseCollection = UserBaseCollection;
class TenantBaseCollection extends DbCollection {
    constructor() {
        super("tenants", false);
    }
    dataSchema() {
        return new mongoose_1.Schema({
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
exports.TenantBaseCollection = TenantBaseCollection;
class CollectionSchemaBuilder {
    constructor(collectionName, tenantSchema = true) {
        this.collectionName = collectionName;
        this.schema = new mongoose_1.Schema();
        if (tenantSchema) {
            this.schema.add(schema_data_1.baseTenantDataSchema);
        }
        else {
            this.schema.add(schema_data_1.baseSchema);
        }
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
//# sourceMappingURL=mongo.collection.js.map