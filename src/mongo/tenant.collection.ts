import { ITenantCollection } from "../collection";
import { TenantBaseCollection } from "../core/mongo";

export class TenantCollection extends TenantBaseCollection implements ITenantCollection {
  constructor() {
    super()
  }
}
