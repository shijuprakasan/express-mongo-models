"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const express_1 = __importStar(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = require("body-parser");
const routes_1 = require("./routes");
const logger_1 = require("./core/utils/logger");
const dotenv = require("dotenv");
dotenv.config();
const TRN_DB_CONNECT = (_a = process.env.TRN_DB_CONNECT) !== null && _a !== void 0 ? _a : '';
const PORT = parseInt((_b = process.env.PORT) !== null && _b !== void 0 ? _b : '8000');
const NODE_ENV = process.env.NODE_ENV;
const DEFAULT_TENANT = process.env.DEFAULT_TENANT;
const DEFAULT_USER = process.env.DEFAULT_USER;
logger_1.logger.forceLog("ENV_VARIABLES", NODE_ENV, PORT, TRN_DB_CONNECT);
const app = (0, express_1.default)();
app.use((0, body_parser_1.json)());
app.use(express_1.default.static("public"));
app.use(function (req, res, next) {
    if (!req.headers.authorization) {
        // return res.status(403).json({ error: 'No credentials sent!' });
        req.headers["tenantId"] = DEFAULT_TENANT;
        req.headers["userId"] = DEFAULT_USER;
    }
    else {
        //TODO: get form claims
        // req.headers["tenantId"] = DEFAULT_TENANT;
        // req.headers["userId"] = DEFAULT_USER;
    }
    next();
});
app.use(routes_1.TenantsRouter)
    .use(routes_1.UsersRouter);
const router = (0, express_1.Router)();
router.get("/api", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("success");
}));
app.use(router);
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
//# sourceMappingURL=server.js.map