"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.UserRoute = void 0;
const tsoa_1 = require("tsoa");
const base_route_1 = require("../core/routes/base.route");
const ROUTE_PREFIX = "/api/users";
let UserRoute = class UserRoute extends base_route_1.CollectionRouter {
    constructor(controller) {
        super(ROUTE_PREFIX, controller);
        this.controller = controller;
    }
    buildCustomRoutes(collectionRouter) {
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.controller.register(data);
        });
    }
    /**
      * Returns all resources from persistance
      */
    get() {
        const _super = Object.create(null, {
            get: { get: () => super.get }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.get.call(this);
        });
    }
    /**
     * Returns page wise resources from persistance
     * @param page page number
     * @param limit page length
     * @param sort sort expression
     * @returns page wise resources
     */
    getPage(page, limit, sort) {
        const _super = Object.create(null, {
            getPage: { get: () => super.getPage }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getPage.call(this, page, limit, sort);
        });
    }
    /**
     * update a resource from the persistance
     * @param id primary id of a resource
     * @param data resource attributeds to be updated
     */
    update(id, data) {
        const _super = Object.create(null, {
            update: { get: () => super.update }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.update.call(this, id, data);
        });
    }
    /**
    * Returns a resource from the persistance by matching hte id
    * @param id primary id of a resource
    */
    getById(id) {
        const _super = Object.create(null, {
            getById: { get: () => super.getById }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return yield _super.getById.call(this, id);
        });
    }
    /**
     * Add a new resource to persistance
     * @param data resource to be added to persistance
     */
    add(data) {
        const _super = Object.create(null, {
            add: { get: () => super.add }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.add.call(this, data);
        });
    }
    /**
     * remove a resource from persistance (permanent delete)
     * @param id id of resource to be deleted
     */
    deletePermanent(id) {
        const _super = Object.create(null, {
            deletePermanent: { get: () => super.deletePermanent }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.deletePermanent.call(this, id);
        });
    }
    /**
     * remove a resource from persistance (soft delete)
     * @param id id of resource to be deleted
     */
    delete(id) {
        const _super = Object.create(null, {
            delete: { get: () => super.delete }
        });
        return __awaiter(this, void 0, void 0, function* () {
            return _super.delete.call(this, id);
        });
    }
};
exports.UserRoute = UserRoute;
__decorate([
    (0, tsoa_1.Post)("/register"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "register", null);
__decorate([
    (0, tsoa_1.Get)("/"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "get", null);
__decorate([
    (0, tsoa_1.Get)("/q"),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Query)("sort")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "getPage", null);
__decorate([
    (0, tsoa_1.Post)("/:id"),
    __param(1, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "update", null);
__decorate([
    (0, tsoa_1.Get)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "getById", null);
__decorate([
    (0, tsoa_1.Put)("/"),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "add", null);
__decorate([
    (0, tsoa_1.Delete)("/:id/permanent"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "deletePermanent", null);
__decorate([
    (0, tsoa_1.Delete)("/:id"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRoute.prototype, "delete", null);
exports.UserRoute = UserRoute = __decorate([
    (0, tsoa_1.Route)("/api/users"),
    (0, tsoa_1.Tags)("Users"),
    __metadata("design:paramtypes", [Object])
], UserRoute);
//# sourceMappingURL=user.route.js.map