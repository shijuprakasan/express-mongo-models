import { IUserLiteModel } from "../core/models";

export interface IRegisterModel {
    email: string;
    phone: string;
    
    userName: string;
    password: string;

    firstName: string;
    lastName: string;

    displayName: string;
}