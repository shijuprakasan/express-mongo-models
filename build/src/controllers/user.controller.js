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
exports.UserController = void 0;
const controllers_1 = require("../core/controllers");
const models_1 = require("../core/models");
// @Route("/api/users")
// @Tags("Users")
class UserController extends controllers_1.MongoCollectionController {
    constructor(collection) {
        super(collection);
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // add to identity repository
            const userId = this.addIndentityUser(data.password, data.email);
            // prepare new user data
            const newUser = {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                phone: data.phone,
                userRole: "standard",
                isActive: true,
                _id: userId,
                userName: userId,
            };
            this.collection.updateBaseModelProps(newUser);
            // add to repo
            const doc1 = yield this.collection.add(newUser);
            if (doc1) {
                newUser._id = doc1._id;
            }
            return new models_1.RespModel(newUser);
        });
    }
    addIndentityUser(password, email) {
        // register user to identity registry
        // return identity user id
        return email;
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map