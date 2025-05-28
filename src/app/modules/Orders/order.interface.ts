import { Types } from "mongoose";

export interface IOrderItem {
    length: number;
    map(arg0: (item: any) => any): unknown;
    product: Types.ObjectId;
    quantity: number;
}

export interface IOrder {
    items: IOrderItem[];
    quantity: number;
    status?: string;
    totalPrice?: number;
    buyer: Types.ObjectId;
    address: string;
    email: string;
    contact: number;
    orderNote?: string;
}