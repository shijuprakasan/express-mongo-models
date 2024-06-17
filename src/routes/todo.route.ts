import { RESTRouteBuilder } from "../core";
import { TodoController } from "../controllers/";

const ROUTE_PREFIX = "/api/todos";

const todoOps = new TodoController();
const todoRoute = new RESTRouteBuilder(ROUTE_PREFIX, todoOps);
const router = todoRoute.buildCRUDRoutes();

export { router as TodoRouter };
