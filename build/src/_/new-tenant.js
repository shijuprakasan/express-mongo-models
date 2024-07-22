"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongo_1 = require("../mongo");
dotenv_1.default.config();
const TRN_DB_CONNECT = (_a = process.env.TRN_DB_CONNECT) !== null && _a !== void 0 ? _a : "";
const tenantName = "Mohsin";
const userFName = "Mohsin";
const userLName = "Hanif";
const userEmail = "connect@mohsinhanif.com";
const userPhone = "+91 9731863388";
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect(TRN_DB_CONNECT
    //   , {
    //   useNewUrlParser: true,
    //   useCreateIndex: true,
    //   useUnifiedTopology: true,
    // }
    );
    const tenantCollection = new mongo_1.TenantCollection();
    let tenant = {
        // _id: "",
        isActive: false,
        tenantName: tenantName,
        locale: "en-IN",
        currency: "INR"
    };
    const existingTenant = yield tenantCollection.getCustom({ tenantName: tenantName });
    if (existingTenant && existingTenant.length > 0) {
        tenant = existingTenant[0];
        console.log(`Tenant already exists (${tenant.tenantName}): Tenant: ${tenant._id}`);
    }
    tenant = yield tenantCollection.add(tenant);
    if (!tenant) {
        console.log("Error adding tenant");
        return;
    }
    const userCollection = new mongo_1.UserCollection();
    const existingUser = yield userCollection.getCustom({ email: userEmail, "tenant._id": tenant._id });
    if (existingUser && existingUser.length > 0) {
        console.log(`User already exists (${existingUser[0].email}): User: ${existingUser[0]._id}`);
        return;
    }
    userCollection.setContext({ tenantId: tenant._id });
    let user = {
        // _id: "",
        firstName: userFName,
        lastName: userLName,
        email: userEmail,
        phone: userPhone,
        userRole: "super-admin",
        isActive: true,
        userName: userEmail,
        tenant: tenant,
    };
    user = yield userCollection.add(user);
    console.log(`Tenant and User added successfully: Tenant: ${tenant._id}, User: ${user._id}`);
}))();
//# sourceMappingURL=new-tenant.js.map