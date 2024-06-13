"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantLiteModel = void 0;
function getTenantLiteModel(tenant) {
    return {
        _id: tenant._id,
        tenantName: tenant.tenantName,
    };
}
exports.getTenantLiteModel = getTenantLiteModel;
//# sourceMappingURL=tenant.model.js.map