"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildNewKeyChain = buildNewKeyChain;
exports.toKeychainLite = toKeychainLite;
function buildNewKeyChain(input, parent) {
    if (!input.key) {
        input.key = input.value;
    }
    input.keys = [input.key];
    if (parent) {
        if (parent.keys && parent.keys.length > 0) {
            input.keys = [...parent.keys, input.key];
        }
        input.p1Id = parent._id;
        if (parent.p1Id) {
            input.p2Id = parent.p1Id;
            if (parent.p2Id) {
                input.p3Id = parent.p2Id;
                if (parent.p3Id) {
                    input.p4Id = parent.p3Id;
                    if (parent.p4Id) {
                        input.p5Id = parent.p4Id;
                        if (parent.p5Id) {
                            input.p6Id = parent.p5Id;
                            if (parent.p6Id) {
                                input.p7Id = parent.p6Id;
                                if (parent.p7Id) {
                                    input.p8Id = parent.p7Id;
                                    if (parent.p8Id) {
                                        throw new Error("Level not allowed (8)");
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return input;
}
function toKeychainLite(from) {
    return {
        key: from.key,
        value: from.value,
        comment: from.comment,
    };
}
//# sourceMappingURL=keychain.model.js.map