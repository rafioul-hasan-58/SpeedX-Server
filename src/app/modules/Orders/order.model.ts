import mongoose, { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: [true, "Product is required"],
                ref: "Product"
            },
            quantity: {
                type: Number,
                required: [true, "Quantity is required"],
                default: 1
            }
        }
    ],
    status: {
        type: String,
        enum: ['Pending', 'Cancelled', 'Delivered','Processing','Shipped','Returned'],
        default: 'Pending'
    },
    contact: {
        type: Number,
        required: [true, 'Contact is required']
    },
    totalPrice: {
        type: Number,
    },
    buyer: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    email: {
        type: String
    },
    sellerEmail:{
        type:String
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    }
},
    {
        timestamps: true
    }
)

export const Order = model<IOrder>('Order', orderSchema)