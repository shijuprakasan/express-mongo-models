"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantOperations = void 0;
const mongo_1 = require("./../mongo");
const data_1 = require("../data");
class TenantOperations extends mongo_1.MongoCRUDOperations {
    constructor() {
        super(data_1.TenantDataModel);
    }
}
exports.TenantOperations = TenantOperations;
//# sourceMappingURL=tenant.ops.js.map