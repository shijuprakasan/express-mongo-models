import { IBaseModel } from '../core/models';

export interface ITodoModel extends IBaseModel {
    title: string;
    completed: boolean;
}