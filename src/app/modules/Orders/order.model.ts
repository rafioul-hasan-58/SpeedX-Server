import mongoose, { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>({
    product: {
        type: mongoose.Schema.ObjectId,
        required: [true, 'Product is required'],
        ref:'Product'
    },
    status:{
        type:String,
        enum:['Pending','Cancelled','Delivered'],
        default:'Pending'
    },
    contact: {
        type: Number,
        required: [true, 'Contact is required']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required']
    },
    totalPrice: {
        type: Number,
    },
    buyer: {
        type: mongoose.Schema.ObjectId
    },
    email: {
        type: String
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