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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = require("body-parser");
const logger_1 = require("./core/utils/logger");
const routes_1 = require("./routes");
// Application router setup
function buildApplicationRoutes(app) {
    app
        .use((0, routes_1.todoRouter)().router)
        .use((0, routes_1.keychainRouter)().router)
        .use((0, routes_1.userRouter)().router)
        .use((0, routes_1.tenantRouter)().router);
}
dotenv.config();
const TRN_DB_CONNECT = (_a = process.env.TRN_DB_CONNECT) !== null && _a !== void 0 ? _a : "";
const PORT = parseInt((_b = process.env.PORT) !== null && _b !== void 0 ? _b : "8000");
// Modularize router setup
function setupRoutes(app) {
    app.use((0, body_parser_1.json)());
    app.use((0, morgan_1.default)("tiny"));
    app.use(express_1.default.static("public"));
    app.use("/swagger", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
        },
    }));
    //Middlwware
    app.use(function (req, res, next) {
        if (!req.headers.authorization) {
            // return res.status(403).json({ error: 'No credentials sent!' });
            // req.headers["tenantId"] = DEFAULT_TENANT;
            // req.headers["userId"] = DEFAULT_USER;
        }
        else {
            //TODO: get form claims
            // req.headers["tenantId"] = DEFAULT_TENANT;
            // req.headers["userId"] = DEFAULT_USER;
        }
        next();
    });
    buildApplicationRoutes(app);
}
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(TRN_DB_CONNECT
            //   , {
            //   useNewUrlParser: true,
            //   useCreateIndex: true,
            //   useUnifiedTopology: true,
            // }
            );
            logger_1.logger.forceLog("connected to database");
        }
        catch (ex) {
            logger_1.logger.forceLog("failed to connect database", ex);
            throw ex; // Rethrow or handle as needed
        }
    });
}
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectToDatabase();
            const app = (0, express_1.default)();
            setupRoutes(app);
            app.listen(PORT, () => {
                logger_1.logger.forceLog(`server is listening on port ${PORT}`);
            });
        }
        catch (error) {
            logger_1.logger.forceLog("Error starting the server", error);
        }
    });
}
startServer();
//# sourceMappingURL=todo-server.js.map