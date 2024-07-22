import { Schema } from "mongoose";
import { DbCollection } from "../core/mongo";
import { ITodoModel } from "../models";

export class TodoCollection extends DbCollection<ITodoModel> {
    constructor() {
        super("todos");
    }

    dataSchema(): Schema {
        return new Schema({
            title: { type: String, required: true },
            completed: { type: Boolean, required: true },
        });
    }
}