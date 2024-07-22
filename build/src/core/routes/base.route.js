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
exports.CollectionRouter = exports.CreateOnlyCollectionRouter = exports.ReadonlyCollectionRouter = exports.AbstractCollectionRouter = exports.ModelRouteBuilder = exports.AbstractRouteBuilder = void 0;
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const models_1 = require("../models");
class AbstractRouteBuilder {
    constructor(routePrefix, options = "crud") {
        this.options = "crud";
        this.options = options;
        this.routePrefix = routePrefix;
        this.router = (0, express_1.Router)();
        this.buildCRUDRoutes()();
    }
    buildCRUDRoutes() {
        return () => {
            var routes_registred = [];
            if (this.options === "crud" ||
                this.options === "create-readonly" ||
                this.options === "readonly") {
                routes_registred.push("GET");
                routes_registred.push("GET /page");
                routes_registred.push("GET /{id}");
                this.buildGetPageRoute();
                this.buildGetRoute();
                this.buildGetByIdRoute();
            }
            if (this.options === "crud" || this.options === "create-readonly") {
                routes_registred.push("PUT");
                this.buildPutRoute();
            }
            if (this.options === "crud") {
                routes_registred.push("POST /{id}");
                routes_registred.push("DELETE /{id}");
                this.buildPostRoute();
                this.buildDeleteRoute();
            }
            logger_1.logger.log("Routes", this.routePrefix, routes_registred.join(", "));
            return this.router;
        };
    }
}
exports.AbstractRouteBuilder = AbstractRouteBuilder;
class ModelRouteBuilder extends AbstractRouteBuilder {
    setContext(authContext) {
        this.authContext = authContext;
        this.doController.setContext(this.authContext);
    }
    get tenantId() {
        var _a;
        return (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.tenantId;
    }
    get userId() {
        var _a;
        return (_a = this.authContext) === null || _a === void 0 ? void 0 : _a.userId;
    }
    constructor(routePrefix, doController, options = "crud") {
        super(routePrefix, options);
        this.doController = doController;
    }
    assertAndSetClaims(req) {
        const tenantId = req.headers["tenantId"];
        const userId = req.headers["userId"];
        this.setContext({ tenantId, userId });
    }
    buildGetPageRoute() {
        return this.router.get(`${this.routePrefix}/q`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            const { page, limit, sort } = req.query;
            const sortParam = sort
                ? (0, models_1.parseSortExpression)(sort)
                : undefined;
            const resources = yield this.doController.getPage(parseInt((_a = page) !== null && _a !== void 0 ? _a : 0), parseInt((_b = limit) !== null && _b !== void 0 ? _b : 10), sortParam);
            return res.status(200).send(resources);
        }));
    }
    buildGetRoute() {
        return this.router.get(this.routePrefix, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            const resources = yield this.doController.get();
            return res.status(200).send(resources);
        }));
    }
    buildGetByIdRoute() {
        return this.router.get(`${this.routePrefix}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            const id = req.params["id"];
            const resource = yield this.doController.getById(id);
            return res.status(200).send(resource);
        }));
    }
    buildCustomGetRoute(path, handler) {
        logger_1.logger.log("Custom Get", this.routePrefix, `[GET] ${path}`);
        this.router.get(`${this.routePrefix}${path}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            try {
                const resource = yield handler(req);
                return res.status(resource.status).send(resource);
            }
            catch (err) {
                return res
                    .status(500)
                    .send(new models_1.RespModel(undefined, { message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err, code: (_b = err === null || err === void 0 ? void 0 : err.code) !== null && _b !== void 0 ? _b : 500 }, 500));
            }
        }));
        return this.router;
    }
    buildCustomPostRoute(path, handler) {
        logger_1.logger.log("Custom Post", this.routePrefix, `[POST] ${path}`);
        this.router.post(`${this.routePrefix}${path}`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            try {
                const resource = yield handler(req);
                return res.status(resource.status).send(resource);
            }
            catch (err) {
                return res
                    .status(500)
                    .send(new models_1.RespModel(undefined, { message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err, code: (_b = err === null || err === void 0 ? void 0 : err.code) !== null && _b !== void 0 ? _b : 500 }, 500));
            }
        }));
        return this.router;
    }
    buildPatchFieldRoutes(fields) {
        fields.forEach((field) => {
            const patchRoute = `${this.routePrefix}/:id/:${field}`;
            logger_1.logger.log("Custom Patch", this.routePrefix, `[PATCH] ${patchRoute}`);
            this.router.patch(patchRoute, (req, res) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                this.assertAndSetClaims(req);
                const id = req.params["id"];
                const inputResource = req.body;
                try {
                    const resource = yield this.doController.updatePartialField(id, field, inputResource);
                    return res.status(201).send(resource);
                }
                catch (err) {
                    return res
                        .status(500)
                        .send(new models_1.RespModel(undefined, { message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err, code: (_b = err === null || err === void 0 ? void 0 : err.code) !== null && _b !== void 0 ? _b : 500 }, 500));
                }
            }));
        });
        return this.router;
    }
    buildPostRoute() {
        return this.router.post(`${this.routePrefix}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            const id = req.params["id"];
            const inputResource = req.body;
            try {
                const resource = yield this.doController.update(id, inputResource);
                return res.status(201).send(resource);
            }
            catch (err) {
                return res
                    .status(500)
                    .send(new models_1.RespModel(undefined, { message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err, code: (_b = err === null || err === void 0 ? void 0 : err.code) !== null && _b !== void 0 ? _b : 500 }, 500));
            }
        }));
    }
    buildPutRoute() {
        return this.router.put(this.routePrefix, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            const inputResource = req.body;
            try {
                const resource = yield this.doController.add(inputResource);
                return res.status(201).send(resource);
            }
            catch (err) {
                return res
                    .status(500)
                    .send(new models_1.RespModel(undefined, { message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err, code: (_b = err === null || err === void 0 ? void 0 : err.code) !== null && _b !== void 0 ? _b : 500 }, 500));
            }
        }));
    }
    buildDeleteRoute() {
        return this.router.delete(`${this.routePrefix}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            const id = req.params["id"];
            try {
                // var data: T = req.body;
                const deleted = yield this.doController.delete(id);
                return res.status(201).send({ deleted });
            }
            catch (err) {
                return res
                    .status(500)
                    .send(new models_1.RespModel(undefined, { message: (_a = err === null || err === void 0 ? void 0 : err.message) !== null && _a !== void 0 ? _a : err, code: (_b = err === null || err === void 0 ? void 0 : err.code) !== null && _b !== void 0 ? _b : 500 }, 500));
            }
        }));
    }
}
exports.ModelRouteBuilder = ModelRouteBuilder;
class AbstractCollectionRouter {
    get router() {
        return this.collectionRouter.router;
    }
    constructor(routePrefix, collection, options = "readonly") {
        this.collection = collection;
        this.collectionRouter = new ModelRouteBuilder(routePrefix, collection, options);
        this.buildCustomRoutes(this.collectionRouter);
    }
}
exports.AbstractCollectionRouter = AbstractCollectionRouter;
class ReadonlyCollectionRouter extends AbstractCollectionRouter {
    constructor(routePrefix, collection, options = "readonly") {
        super(routePrefix, collection, options);
    }
    /**
     * Returns all resources from persistance
     */
    // @Get("/")
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.get();
        });
    }
    /**
     * Returns page wise resources from persistance
     * @param page page number
     * @param limit page length
     * @param sort sort expression
     * @returns page wise resources
     */
    // @Get("/q")
    getPage(
    // @Query()
    page, 
    // @Query()
    limit, 
    // @Query("sort")
    sort) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.getPage(page, limit, sort);
        });
    }
    /**
     * Returns a resource from the persistance by matching hte id
     * @param id primary id of a resource
     */
    // @Get("/:id")
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.getById(id);
        });
    }
}
exports.ReadonlyCollectionRouter = ReadonlyCollectionRouter;
class CreateOnlyCollectionRouter extends ReadonlyCollectionRouter {
    constructor(routePrefix, collection, options = "create-readonly") {
        super(routePrefix, collection, options);
    }
    /**
     * Add a new resource to persistance
     * @param data resource to be added to persistance
     */
    // @Put("/")
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.add(data);
        });
    }
}
exports.CreateOnlyCollectionRouter = CreateOnlyCollectionRouter;
class CollectionRouter extends CreateOnlyCollectionRouter {
    constructor(routePrefix, collection, options = "crud") {
        super(routePrefix, collection, options);
    }
    /**
     * update a resource from the persistance
     * @param id primary id of a resource
     * @param data resource attributeds to be updated
     */
    // @Post("/:id")
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.update(id, data);
        });
    }
    /**
     * remove a resource from persistance (permanent delete)
     * @param id id of resource to be deleted
     */
    // @Delete("/:id/permanent")
    deletePermanent(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.deletePermanent(id);
        });
    }
    /**
     * remove a resource from persistance (soft delete)
     * @param id id of resource to be deleted
     */
    //  @Delete("/:id")
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.collection.delete(id);
        });
    }
}
exports.CollectionRouter = CollectionRouter;
//# sourceMappingURL=base.route.js.map