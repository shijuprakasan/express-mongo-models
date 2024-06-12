"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = require("body-parser");
const logger_1 = require("./core/utils/logger");
const todo_route_1 = require("./routes/todo.route");
const routes_1 = require("./routes");
const dotenv = require("dotenv");
dotenv.config();
const TRN_DB_CONNECT = (_a = process.env.TRN_DB_CONNECT) !== null && _a !== void 0 ? _a : "";
const PORT = parseInt((_b = process.env.PORT) !== null && _b !== void 0 ? _b : "8000");
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use(express_1.default.static("public"));
app.use(function (req, res, next) {
    req.headers["tenantId"] = "";
    req.headers["userId"] = "";
    if (!req.headers.authorization) {
    }
    else {
    }
    next();
});
app.use(todo_route_1.TodoRouter);
app.use(routes_1.UsersRouter);
app.use(routes_1.TenantsRouter);
mongoose_1.default
    .connect(TRN_DB_CONNECT, {})
    .then(() => {
    logger_1.logger.forceLog("connected to database");
})
    .catch((ex) => {
    logger_1.logger.forceLog("failed to connect database", ex);
});
app.listen(PORT, () => {
    logger_1.logger.forceLog(`server is listening on port ${PORT}`);
});
//# sourceMappingURL=server-todo.js.map