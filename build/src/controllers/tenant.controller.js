"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantController = void 0;
const mongo_1 = require("../mongo");
const data_1 = require("../data");
class TenantController extends mongo_1.MongoCRUDController {
    constructor() {
        super(data_1.TenantDataModel);
    }
}
exports.TenantController = TenantController;
//# sourceMappingURL=tenant.controller.js.map