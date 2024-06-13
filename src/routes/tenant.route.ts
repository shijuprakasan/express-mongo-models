import { RESTRouteBuilder } from "../core/routes/base.route";
import { TenantOperations } from "../ops";

const ROUTE_PREFIX = "/api/tenants";

const tenantOps = new TenantOperations();

const tenantRoute = new RESTRouteBuilder(ROUTE_PREFIX, tenantOps);
const router = tenantRoute.buildCRUDRoutes();

export { router as TenantsRouter };
