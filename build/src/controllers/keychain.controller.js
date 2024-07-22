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
exports.KeychainController = void 0;
const controllers_1 = require("../core/controllers");
const models_1 = require("../core/models");
class KeychainController extends controllers_1.MongoCollectionController {
    constructor(collection) {
        super(collection);
    }
    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    getLiteById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield yield this.collection.getLite(id);
            return new models_1.RespModel(obj);
        });
    }
    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    getChildrenById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const children = yield this.collection.getChildren(id);
            return new models_1.RespModel(children);
        });
    }
    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    getFullById(id) {
        const _super = Object.create(null, {
            getById: { get: () => super.getById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const obj = yield _super.getById.call(this, id);
            if (obj.data) {
                const children = yield this.collection.getChildren(id);
                obj.data.children = children;
                if (obj.data.p1Id) {
                    const p1 = yield this.getLiteById(obj.data.p1Id);
                    if (p1 && p1.data) {
                        obj.data.parent = p1.data;
                    }
                }
            }
            return obj;
        });
    }
}
exports.KeychainController = KeychainController;
//# sourceMappingURL=keychain.controller.js.map