import mongoose from "mongoose";
import { ITenantLiteModel, ITenantModel, IUserModel } from "../core";
import dotenv from "dotenv";
import { TenantCollection, UserCollection } from "../mongo";

dotenv.config();
const TRN_DB_CONNECT = process.env.TRN_DB_CONNECT ?? "";

const tenantName: string = "Mohsin";
const userFName: string = "Mohsin";
const userLName: string = "Hanif";
const userEmail: string = "connect@mohsinhanif.com";
const userPhone: string = "+91 9731863388";
  
(async () => {
    await mongoose.connect(
        TRN_DB_CONNECT
        //   , {
        //   useNewUrlParser: true,
        //   useCreateIndex: true,
        //   useUnifiedTopology: true,
        // }
      );

    const tenantCollection = new TenantCollection();
    let tenant: ITenantModel = {
        // _id: "",
        isActive: false,
        tenantName: tenantName,
        locale: "en-IN",
        currency: "INR"
    } as ITenantModel;

    const existingTenant = await tenantCollection.getCustom({ tenantName: tenantName });
    if(existingTenant && existingTenant.length > 0) {
        tenant = existingTenant[0];
        console.log(`Tenant already exists (${tenant.tenantName}): Tenant: ${tenant._id}`);
    }

    tenant = await tenantCollection.add(tenant);

    if (!tenant) {
        console.log("Error adding tenant");
        return;
    }

    const userCollection = new UserCollection();
    const existingUser = await userCollection.getCustom({ email: userEmail, "tenant._id": tenant._id });
    if(existingUser && existingUser.length > 0) {
        console.log(`User already exists (${existingUser[0].email}): User: ${existingUser[0]._id}`);
        return;
    }

    userCollection.setContext({ tenantId: tenant._id });
    let user: IUserModel = {
        // _id: "",
        firstName: userFName,
        lastName: userLName,
        email: userEmail,
        phone: userPhone,
        userRole: "super-admin",
        isActive: true,
        userName: userEmail,
        tenant: tenant as ITenantLiteModel,
    } as IUserModel;

    user = await userCollection.add(user);

    console.log(`Tenant and User added successfully: Tenant: ${tenant._id}, User: ${user._id}`);
})();

