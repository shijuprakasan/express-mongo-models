import { RESTRouteBuilder } from "../core/routes/base.route";
import { TenantController } from "../controllers";

const ROUTE_PREFIX = "/api/tenants";

const tenantOps = new TenantController();

const tenantRoute = new RESTRouteBuilder(ROUTE_PREFIX, tenantOps);
const router = tenantRoute.buildCRUDRoutes();

export { router as TenantsRouter };
