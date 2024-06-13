"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantDataModel = void 0;
const mongo_1 = require("../mongo");
const docSchema = new mongo_1.CollectionSchemaBuilder('tenants');
docSchema.build(({
    tenantName: { type: String, required: true },
    locale: { type: String, required: true, default: 'en-IN' },
    currency: { type: String, uppercase: true, required: true, default: 'INR' },
    isActive: { type: Boolean, required: true, default: true },
}));
const dataModel = docSchema.getDataModel();
exports.TenantDataModel = dataModel;
//# sourceMappingURL=tenant.data.js.map