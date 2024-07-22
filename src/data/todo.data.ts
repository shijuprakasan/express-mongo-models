import { Schema } from "mongoose";
import { DbCollection, IDbCollection } from "../core";
import { ITodoModel } from "../models";

export interface ITodoCollection extends IDbCollection<ITodoModel> {
  }

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