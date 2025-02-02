import mongoose, { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>({
    product: {
        type: mongoose.Schema.ObjectId,
    },
    quantity: {
        type: Number
    },
    status: {
        type: String
    },
    totalPrice: {
        type: Number,
    },
    buyer: {
        type: mongoose.Schema.ObjectId
    },
},
    {
        timestamps: true
    }
)

export const Order = model<IOrder>('Order', orderSchema)