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
exports.MongoCollectionController = void 0;
const models_1 = require("../models/");
class MongoCollectionController {
    setContext(authContext) {
        this.authContext = authContext;
        this.collection.setContext(this.authContext);
    }
    get tenantId() {
        var _a;
        return (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.tenantId;
    }
    get userId() {
        var _a;
        return (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.userId;
    }
    constructor(collection) {
        this.controllerCache = {};
        this.collection = collection;
    }
    getController(collectionName, collectionPredicate) {
        const res = this.controllerCache[collectionName];
        if (res) {
            console.log("getController from cache", collectionName);
            return res;
        }
        else {
            const newController = new MongoCollectionController(collectionPredicate());
            this.setContext(this.authContext);
            this.controllerCache[collectionName] = newController;
            console.log("getController new", collectionName);
            return newController;
        }
    }
    updatePartial(data, partialUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updatePartial(data, partialUpdate);
        });
    }
    updatePartialAny(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updatePartialAny(id, data);
        });
    }
    updatePartialField(id, fieldName, fieldData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.updatePartialField(id, fieldName, fieldData);
        });
    }
    // @Get("/q")
    getPage() {
        return __awaiter(this, arguments, void 0, function* (page = 0, limit = 10, sort = { _id: models_1.SORT_DIRECTION.ASC }, populate) {
            const res = yield this.collection.getPage(page, limit, sort, populate);
            if (res) {
                return new models_1.PageRespModel(res, page, limit);
            }
            else {
                return new models_1.PageRespModel(undefined, page, limit, (0, models_1.getError)(404));
            }
        });
    }
    getCustom(filterQuery, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.getCustom(filterQuery, populate);
            return new models_1.ListRespModel(res);
        });
    }
    // @Get("/")
    get(populate) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.get(populate);
            return new models_1.ListRespModel(res);
        });
    }
    // @Get("/:id")
    getById(id, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.getById(id, populate);
            return new models_1.RespModel(res);
        });
    }
    // @Post("/:id")
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.update(id, data);
            return new models_1.RespModel(res);
        });
    }
    // @Put("/")
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.add(data);
            return new models_1.RespModel(res);
        });
    }
    // @Delete("/:id")
    deletePermanent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.deletePermanent(id);
            return new models_1.RespModel(res);
        });
    }
    // @Delete("/:id")
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield this.collection.delete(id);
            return new models_1.RespModel(res);
        });
    }
}
exports.MongoCollectionController = MongoCollectionController;
//# sourceMappingURL=mongo.controller.js.map