"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsRouter = void 0;
const base_route_1 = require("../core/routes/base.route");
const ops_1 = require("../ops");
const ROUTE_PREFIX = "/api/tenants";
const tenantOps = new ops_1.TenantOperations();
const tenantRoute = new base_route_1.RESTRouteBuilder(ROUTE_PREFIX, tenantOps);
const router = tenantRoute.buildCRUDRoutes();
exports.TenantsRouter = router;
//# sourceMappingURL=tenant.route.js.map