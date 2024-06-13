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
exports.RESTRouteBuilder = exports.useCRUDRouters = exports.AbstractRouteBuilder = void 0;
const express_1 = require("express");
const logger_1 = require("../utils/logger");
const transport_model_1 = require("../models/transport.model");
class AbstractRouteBuilder {
    constructor(routePrefix) {
        this.routePrefix = routePrefix;
        this.router = (0, express_1.Router)();
    }
    buildCRUDRoutes() {
        return () => {
            this.buildGetPageRoute();
            this.buildGetRoute();
            this.buildGetByIdRoute();
            this.buildPostRoute();
            this.buildPutRoute();
            this.buildDeleteRoute();
            logger_1.logger.log("Routes", this.routePrefix, "GET, PUT, POST, DELETE");
            return this.router;
        };
    }
}
exports.AbstractRouteBuilder = AbstractRouteBuilder;
function useCRUDRouters(app, opsRoute) {
    const router = opsRoute.buildCRUDRoutes();
    app.use(router);
    return opsRoute;
}
exports.useCRUDRouters = useCRUDRouters;
class RESTRouteBuilder extends AbstractRouteBuilder {
    constructor(routePrefix, doOps) {
        super(routePrefix);
        this.doOps = doOps;
    }
    assertAndSetClaims(req) {
        this.doOps.tenantId = req.headers["tenantId"];
        this.doOps.userId = req.headers["userId"];
    }
    buildGetPageRoute() {
        return this.router.get(`${this.routePrefix}/page`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            this.assertAndSetClaims(req);
            const { page, limit, sort } = req.query;
            const sortParam = sort
                ? (0, transport_model_1.parseSortExpression)(sort)
                : undefined;
            // logger.log("get");
            const resources = yield this.doOps.getPage(parseInt((_a = page) !== null && _a !== void 0 ? _a : "0"), parseInt((_b = limit) !== null && _b !== void 0 ? _b : "10"), sortParam);
            // logger.log("get completed");
            return res.status(200).send(resources);
        }));
    }
    buildGetRoute() {
        return this.router.get(this.routePrefix, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            // logger.log("get");
            const resources = yield this.doOps.get();
            // logger.log("get completed");
            return res.status(200).send(resources);
        }));
    }
    buildGetByIdRoute() {
        return this.router.get(`${this.routePrefix}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            // logger.log("get one");
            var id = req.params["id"];
            const resource = yield this.doOps.getById(id);
            // logger.log("get one completed");
            return res.status(200).send(resource);
        }));
    }
    buildPatchFieldRoutes(fields) {
        fields.forEach((field) => {
            const patchRoute = `${this.routePrefix}/:id/:${field}`;
            logger_1.logger.log("Routes", patchRoute, "PATCH");
            this.router.patch(patchRoute, (req, res) => __awaiter(this, void 0, void 0, function* () {
                this.assertAndSetClaims(req);
                var id = req.params["id"];
                var inputResource = req.body;
                const resource = yield this.doOps.updatePartialField(id, field, inputResource);
                return res.status(201).send(resource);
            }));
        });
        return this.router;
    }
    buildPostRoute() {
        return this.router.post(`${this.routePrefix}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            var id = req.params["id"];
            var inputResource = req.body;
            // logger.log("update", data);
            const resource = yield this.doOps.update(id, inputResource);
            // logger.log("update completed");
            return res.status(201).send(resource);
        }));
    }
    buildPutRoute() {
        return this.router.put(this.routePrefix, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            var inputResource = req.body;
            // logger.log("create", data);
            const resource = yield this.doOps.add(inputResource);
            // logger.log("create completed");
            return res.status(201).send(resource);
        }));
    }
    buildDeleteRoute() {
        return this.router.delete(`${this.routePrefix}/:id`, (req, res) => __awaiter(this, void 0, void 0, function* () {
            this.assertAndSetClaims(req);
            var id = req.params["id"];
            // var data: T = req.body;
            // logger.log("delete", data);
            const deleted = yield this.doOps.delete(id);
            // logger.log("delete completed");
            return res.status(201).send({ deleted });
        }));
    }
}
exports.RESTRouteBuilder = RESTRouteBuilder;
//# sourceMappingURL=base.route.js.map