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
exports.UsersRouter = void 0;
const base_route_1 = require("../core/routes/base.route");
const controllers_1 = require("../controllers/");
const ROUTE_PREFIX = "/api/users";
const userOps = new controllers_1.UserControllers();
const opsRouteBuilder = new base_route_1.RESTRouteBuilder(ROUTE_PREFIX, userOps);
// add mroe routes
// add regoster route
opsRouteBuilder.router.post(`${ROUTE_PREFIX}/register`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    opsRouteBuilder.assertAndSetClaims(req);
    const registredUser = yield userOps.register(req.body);
    return res.status(200).send(registredUser);
}));
const router = opsRouteBuilder.buildCRUDRoutes();
exports.UsersRouter = router;
//# sourceMappingURL=user.route.js.map