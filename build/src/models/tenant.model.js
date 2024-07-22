"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantLiteModel = getTenantLiteModel;
function getTenantLiteModel(tenant) {
    return {
        _id: tenant._id,
        tenantName: tenant.tenantName,
    };
}
//# sourceMappingURL=tenant.model.js.map