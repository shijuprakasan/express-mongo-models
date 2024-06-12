"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDataModel = void 0;
const mongo_1 = require("../mongo");
const docSchema = new mongo_1.CollectionSchemaBuilder("users");
docSchema.build({
    userName: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    // displayName: { type: String, required: true },
    email: { type: String, lowercase: true, required: true },
    phone: { type: String, required: true },
    userRole: {
        type: String,
        required: true,
        enum: [
            "superadmin",
            "admin",
            "recomentation",
            "subscriber",
            "agent",
            "stadard",
        ],
        default: "stadard",
    },
    isActive: { type: Boolean, required: true, default: true },
    tenant: { type: mongo_1.tenantLiteSchema, required: false },
});
const dataModel = docSchema.getDataModel();
exports.UserDataModel = dataModel;
//# sourceMappingURL=user.data.js.map