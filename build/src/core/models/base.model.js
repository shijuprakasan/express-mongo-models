"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTenantLiteModel = getTenantLiteModel;
exports.getUserLiteModel = getUserLiteModel;
exports.newChangeTrack = newChangeTrack;
function getTenantLiteModel(tenant) {
    if (!tenant)
        return undefined;
    return {
        _id: tenant._id,
        tenantName: tenant.tenantName,
        locale: tenant.locale,
        currency: tenant.currency,
    };
}
function getUserLiteModel(user) {
    if (!user)
        return undefined;
    return {
        _id: user._id,
        userName: user.userName,
    };
}
function newChangeTrack(user) {
    return {
        by: getUserLiteModel(user),
        on: new Date(),
    };
}
//# sourceMappingURL=base.model.js.map