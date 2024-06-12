"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.newChangeTrack = exports.getUserLiteModel = void 0;
function getUserLiteModel(user) {
    return {
        _id: user._id,
        userName: user.userName,
    };
}
exports.getUserLiteModel = getUserLiteModel;
function newChangeTrack(user) {
    return {
        by: getUserLiteModel(user),
        on: new Date(),
    };
}
exports.newChangeTrack = newChangeTrack;
//# sourceMappingURL=base.model.js.map