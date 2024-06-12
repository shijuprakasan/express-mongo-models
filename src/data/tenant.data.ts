import { ITenantModel } from "../models";
import { CollectionSchemaBuilder } from "../mongo";

const docSchema = new CollectionSchemaBuilder<ITenantModel>('tenants');
docSchema.build(({
  tenantName: { type: String, required: true },
  locale: { type: String, required: true, default: 'en-IN' },
  currency: { type: String, uppercase: true, required: true, default: 'INR' },
  isActive: { type: Boolean, required: true, default: true },
}));

const dataModel = docSchema.getDataModel();

export {dataModel as TenantDataModel};
