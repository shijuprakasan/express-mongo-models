import { IUserModel } from "../models";
import { CollectionSchemaBuilder, tenantLiteSchema } from "../mongo";

const docSchema = new CollectionSchemaBuilder<IUserModel>("users");
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
  tenant: { type: tenantLiteSchema, required: false },
});

const dataModel = docSchema.getDataModel();

export { dataModel as UserDataModel };