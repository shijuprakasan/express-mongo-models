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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserOperations = void 0;
const mongo_1 = require("../mongo");
const logger_1 = require("../core/utils/logger");
const data_1 = require("../data");
class UserOperations extends mongo_1.MongoCRUDOperations {
    constructor() {
        super(data_1.UserDataModel);
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.logger.log('register', data.email);
            // add to identity repository
            const userId = this.addIndentityUser(data.password, data.email);
            // prepare new user data
            const newUser = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                userRole: "superadmin",
                isActive: true,
                _id: userId,
                userName: userId,
            };
            this.updateBaseModelProps(newUser);
            // add to repo
            const doc1 = this.collection.build(newUser);
            // add change track
            const doc = yield doc1.save();
            newUser._id = doc1._id;
            return newUser;
        });
    }
    addIndentityUser(password, email) {
        // register user to identity registry
        // return identity user id
        return email;
    }
}
exports.UserOperations = UserOperations;
//# sourceMappingURL=user.ops.js.map