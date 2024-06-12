import { RESTRouteBuilder } from "../core";
import { TodoOperations } from "../ops/todo.ops";

const ROUTE_PREFIX = '/api/todos';

const todoOps = new TodoOperations();
const todoRoute = new RESTRouteBuilder(ROUTE_PREFIX, todoOps);
const router = todoRoute.buildCRUDRoutes();

export { router as TodoRouter };