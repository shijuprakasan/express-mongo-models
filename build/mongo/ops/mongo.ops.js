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
exports.MongoCRUDOperations = void 0;
const core_1 = require("../../core");
const models_1 = require("../../models");
const data_1 = require("../../data");
const core_2 = require("../../core");
class MongoCRUDOperations {
    constructor(collection) {
        this.tenantId = "";
        this.userId = "";
        this.tenant = null;
        this.user = null;
        this.collection = collection;
    }
    getTenant() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tenant)
                return this.tenant;
            const tenantOps = new MongoCRUDOperations(data_1.TenantDataModel);
            const tenantRes = yield tenantOps.getById(this.tenantId);
            if (!tenantRes)
                return null;
            this.tenant = tenantRes === null || tenantRes === void 0 ? void 0 : tenantRes.data;
            return this.tenant;
        });
    }
    getTenantLite() {
        return __awaiter(this, void 0, void 0, function* () {
            const tenant = yield this.getTenant();
            if (!tenant)
                return null;
            const tlite = (0, models_1.getTenantLiteModel)(tenant);
            // const tlite = getTenantLiteModel(tenant);
            return tlite;
        });
    }
    getUser() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.user)
                return this.user;
            const userOps = new MongoCRUDOperations(data_1.UserDataModel);
            const userres = yield userOps.getById(this.userId);
            if (!userres)
                return null;
            this.user = userres === null || userres === void 0 ? void 0 : userres.data;
            return this.user;
        });
    }
    getUserLite() {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.getUser();
            if (!user)
                return null;
            const ulite = (0, core_1.getUserLiteModel)(user);
            // const ulite = getUserLiteModel(user);
            return ulite;
        });
    }
    updateBaseModelProps(data_2) {
        return __awaiter(this, arguments, void 0, function* (data, isCreate = false) {
            var data_updates = data;
            const tlite = yield this.getTenantLite();
            if (!tlite)
                return data;
            data_updates.tenant = tlite;
            const ulite = yield this.getUserLite();
            if (!ulite)
                return data;
            data_updates.deleted = false;
            data_updates.modified = (0, core_1.newChangeTrack)(ulite);
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
    updatePartial(data, partialUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(data._id);
            const dataToUpdate = dataRes.data;
            let set = {};
            for (var field in partialUpdate) {
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
    updatePartialAny(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(id);
            const dataToUpdate = dataRes.data;
            let set = {};
            for (var field in data) {
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
            const dataToUpdate = dataRes.data;
            let set = {};
            set[fieldName] = fieldData;
            dataToUpdate[fieldName] = fieldData;
            yield this.preUpdate(dataToUpdate, set);
            yield this.onUpdate(dataToUpdate, set);
            console.log("set", set);
            const resDoc = yield this.collection
                .updateOne({ _id: id }, { $set: set })
                .exec();
            if (resDoc.modifiedCount > 0) {
                // updated
                yield this.postUpdate(dataToUpdate, set);
            }
            return resDoc.modifiedCount > 0 ? fieldData : null;
        });
    }
    getPage() {
        return __awaiter(this, arguments, void 0, function* (page = 0, limit = 10, sort = { _id: core_2.SORT_DIRECTION.ASC }) {
            console.log("sort", sort);
            const docs = yield this.collection
                .find({ $or: [{ deleted: { $eq: null } }, { deleted: false }] })
                .skip(page * limit)
                .limit(limit)
                .sort(sort)
                .exec();
            let pageRes = new core_2.PageRespModel(docs, page, limit);
            pageRes.sort = sort;
            pageRes.status = docs.length > 0 ? 404 : 200;
            return pageRes;
        });
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            const docs = yield this.collection
                .find({ $or: [{ deleted: { $eq: null } }, { deleted: false }] })
                .exec();
            return new core_2.ListRespModel(docs);
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var doc = yield this.collection.findById(id).exec();
            return new core_2.RespModel(doc);
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let canContinue = yield this.preUpdate(data);
            if (!canContinue) {
                const outRes = new core_2.RespModel(null);
                outRes.status = 500;
                return outRes;
            }
            data = yield this.updateBaseModelProps(data);
            const doc1 = this.collection.build(data);
            doc1._id = id;
            canContinue = yield this.onUpdate(data);
            if (!canContinue) {
                const outRes = new core_2.RespModel(null);
                outRes.status = 500;
                return outRes;
            }
            const doc = yield this.collection
                .findOneAndUpdate({ _id: id }, doc1)
                .exec();
            yield this.postUpdate(data);
            return new core_2.RespModel(data);
        });
    }
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let canContinue = yield this.preCreate(data);
            if (!canContinue) {
                const outRes = new core_2.RespModel(null);
                outRes.status = 500;
                return outRes;
            }
            data = yield this.updateBaseModelProps(data, true);
            const doc1 = this.collection.build(data);
            canContinue = yield this.onCreate(data);
            if (!canContinue) {
                const outRes = new core_2.RespModel(null);
                outRes.status = 500;
                return outRes;
            }
            const doc = yield doc1.save();
            if (!doc1)
                return new core_2.RespModel(null);
            data._id = doc._id;
            yield this.postCreate(data);
            return new core_2.RespModel(data);
        });
    }
    deletePermenant(id) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let canContinue = yield this.preDelete(id, null);
            if (!canContinue) {
                const outRes = new core_2.RespModel(false);
                outRes.status = 500;
                return outRes;
            }
            canContinue = yield this.preDelete(id, null);
            if (!canContinue) {
                const outRes = new core_2.RespModel(false);
                outRes.status = 500;
                return outRes;
            }
            const doc = yield this.collection.deleteOne({ _id: id }).exec();
            yield this.postDelete(id, null);
            return new core_2.RespModel(((_a = doc.deletedCount) !== null && _a !== void 0 ? _a : 0) > 0);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataRes = yield this.getById(id);
            let data = dataRes === null || dataRes === void 0 ? void 0 : dataRes.data;
            let canContinue = yield this.preDelete(id, data);
            if (!canContinue) {
                const outRes = new core_2.RespModel(false);
                outRes.status = 500;
                return outRes;
            }
            data = yield this.updateBaseModelProps(data, false);
            data.deleted = true;
            const doc1 = this.collection.build(data);
            doc1._id = id;
            canContinue = yield this.preDelete(id, data);
            if (!canContinue) {
                const outRes = new core_2.RespModel(false);
                outRes.status = 500;
                return outRes;
            }
            const doc = yield this.collection
                .findOneAndUpdate({ _id: id }, doc1)
                .exec();
            yield this.postDelete(id, doc);
            return new core_2.RespModel(true);
        });
    }
}
exports.MongoCRUDOperations = MongoCRUDOperations;
//# sourceMappingURL=mongo.ops.js.map