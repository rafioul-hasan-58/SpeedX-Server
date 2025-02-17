import { Types } from "mongoose";

export interface IOrder {
    product: Types.ObjectId;
    quantity: number;
    status?: string;
    totalPrice?: number;
    buyer: Types.ObjectId;
    address:string;
    email:string;
    contact:number;
    orderNote?:string;
}