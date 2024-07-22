import { ITenantData } from "../data";
import { TenantBaseCollection } from "../core/mongo";

export class TenantCollection extends TenantBaseCollection implements ITenantData {
  constructor() {
    super()
  }
}
