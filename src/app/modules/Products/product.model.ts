import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";


const productSchema = new Schema<IProduct>(
    {
        name: {
            type: String,
            required: [true, 'name is required']
        },
        image: {
            type: String,
            default: ''
        }
        ,
        color: {
            type: String,
            required: [true, 'color is required']
        },
        brandName: {
            type: String,
            required: [true, 'brand name is required']
        },
        price: {
            type: Number,
            required: [true, 'price is required']
        },
        description: {
            type: String,
            required: [true, 'description is required']
        },
        stocks: {
            type: Number,
            required: [true, 'stocks is required']
        },
        instock: {
            type: Boolean,
            default: true
        }
    }
)

export const Product = model<IProduct>('Product', productSchema)