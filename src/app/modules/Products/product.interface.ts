import { Types } from "mongoose";
import { BikeType, ProductType } from "./product.model";

export interface IProduct {
    name: string;
    color: string;
    brandName: string;
    price: number;
    description: string;
    bikeType: BikeType;
    type: ProductType;
    model: string;
    stocks: number;
    images: string[];
    inStock?: boolean;
    addedBy: Types.ObjectId;
}