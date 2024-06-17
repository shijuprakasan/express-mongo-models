"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoRouter = void 0;
const core_1 = require("../core");
const controllers_1 = require("../controllers/");
const ROUTE_PREFIX = "/api/todos";
const todoOps = new controllers_1.TodoControllers();
const todoRoute = new core_1.RESTRouteBuilder(ROUTE_PREFIX, todoOps);
const router = todoRoute.buildCRUDRoutes();
exports.TodoRouter = router;
//# sourceMappingURL=todo.route.js.map