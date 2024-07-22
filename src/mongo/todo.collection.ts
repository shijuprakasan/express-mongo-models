import { Schema } from "mongoose";
import { DbCollection } from "../core/mongo";
import { ITodoModel } from "../models";

const COLLECTION_NAME = "todos";

export class TodoCollection extends DbCollection<ITodoModel> {
    constructor() {
        super(COLLECTION_NAME);
    }

    dataSchema(): Schema {
        return new Schema({
            title: { type: String, required: true },
            completed: { type: Boolean, required: true },
        });
    }
}
