import { ITenantBaseCollection, TenantBaseCollection } from "../core/data";

export interface ITenantCollection extends ITenantBaseCollection {
}

export class TenantCollection extends TenantBaseCollection implements ITenantCollection {
  constructor() {
    super()
  }
}
