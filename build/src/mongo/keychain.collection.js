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
exports.KeychainCollection = void 0;
const mongoose_1 = require("mongoose");
const bson_1 = require("bson");
const mongo_1 = require("../core/mongo");
const models_1 = require("../models");
class KeychainCollection extends mongo_1.DbCollection {
    constructor() {
        super("keychains");
    }
    dataSchema() {
        return new mongoose_1.Schema({
            key: { type: String, required: true, max: 20 },
            keys: [{ type: String, required: true }],
            value: { type: String, required: true, max: 50 },
            comment: { type: String, required: false },
            parent: { type: bson_1.BSON.ObjectId, ref: 'keychains' },
            children: [{ type: bson_1.BSON.ObjectId, ref: 'keychains' }],
            p1Id: { type: bson_1.BSON.ObjectId, required: false },
            p2Id: { type: bson_1.BSON.ObjectId, required: false },
            p3Id: { type: bson_1.BSON.ObjectId, required: false },
            p4Id: { type: bson_1.BSON.ObjectId, required: false },
            p5Id: { type: bson_1.BSON.ObjectId, required: false },
            p6Id: { type: bson_1.BSON.ObjectId, required: false },
            p7Id: { type: bson_1.BSON.ObjectId, required: false },
            p8Id: { type: bson_1.BSON.ObjectId, required: false },
        });
    }
    static getLiteSchema() {
        return new mongoose_1.Schema({
            key: { type: String, required: true, max: 20 },
            keys: [{ type: String, required: true }],
            value: { type: String, required: true, max: 50 },
            p1Id: { type: bson_1.BSON.ObjectId, required: false },
            comment: { type: String, required: false },
            parent: { type: bson_1.BSON.ObjectId, ref: 'keychains' },
            children: [{ type: bson_1.BSON.ObjectId, ref: 'keychains' }],
        });
    }
    preCreate(data) {
        const _super = Object.create(null, {
            getById: { get: () => super.getById },
            preCreate: { get: () => super.preCreate }
        });
        return __awaiter(this, void 0, void 0, function* () {
            if (!data.value || data.value.length > 50) {
                throw new Error("value length must be not exceed 50");
            }
            if (data.key && data.key.length > 20) {
                throw new Error("Key length must be not exceed 20");
            }
            if (!data.key && data.value.length > 20) {
                throw new Error("value without Key length must be not exceed 20");
            }
            var parentKeychain = undefined;
            if (data.p1Id) {
                const pobj = yield _super.getById.call(this, data.p1Id);
                if (pobj && pobj) {
                    parentKeychain = pobj;
                }
                else {
                    throw new Error("No Parent Exists");
                }
            }
            data = (0, models_1.buildNewKeyChain)(data, parentKeychain);
            return _super.preCreate.call(this, data);
        });
    }
    defaultChildSelectOptionSpec() {
        return { deleted: 0, __v: 0,
            p1Id: 0, p2Id: 0, p3Id: 0, p4Id: 0, p5Id: 0, p6Id: 0, p7Id: 0, p8Id: 0,
            keys: 0,
            tenant: 0, created: 0, modified: 0, children: 0 };
    }
    getChildren(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.collection.find({ p1Id: id })
                .select(this.defaultChildSelectOptionSpec())
                .exec();
            return doc;
        });
    }
    defaultParentSelectOptionSpec() {
        return { deleted: 0, __v: 0,
            p2Id: 0, p3Id: 0, p4Id: 0, p5Id: 0, p6Id: 0, p7Id: 0, p8Id: 0,
            keys: 0,
            tenant: 0, created: 0, modified: 0, children: 0 };
    }
    getLite(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield this.collection.findById(id)
                .select(this.defaultParentSelectOptionSpec())
                .exec();
            return doc;
        });
    }
}
exports.KeychainCollection = KeychainCollection;
//# sourceMappingURL=keychain.collection.js.map