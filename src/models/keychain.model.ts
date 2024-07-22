import { IBaseLiteModel, IBaseModel } from "../core/models";

export interface IKeychainModel extends IKeychainLiteModel, IBaseModel {
    p8Id?: string;
    p7Id?: string;
    p6Id?: string;
    p5Id?: string;
    p4Id?: string;
    p3Id?: string;
    p2Id?: string;
    p1Id?: string;

    key: string;
    value: string;

    keys: string[];
}

export interface IKeychainLiteModel extends IBaseLiteModel {
    p1Id?: string;

    key: string;
    value: string;
    comment?: string;

    parent?: IKeychainLiteModel;
    children?: IKeychainLiteModel[];
}

export function buildNewKeyChain(input: IKeychainModel, parent?: IKeychainModel): IKeychainModel {
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

export function toKeychainLite(from: IKeychainLiteModel): IKeychainLiteModel {
    return {
        key: from.key,
        value: from.value,
        comment: from.comment,
    } as IKeychainLiteModel;
}
