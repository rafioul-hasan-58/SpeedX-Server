import mongoose, { model, Schema } from "mongoose";
import { IStore } from "./store.interface";


const storeSchema = new Schema<IStore>({
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    storeName: {
        type: String,
        required: [true, "StoreName is required!"]
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    banner: {
        type: String,
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    address: {
        type: String,
    },
    phone: {
        type: String,
    },
}, {
    timestamps: true
})


export const Store = model<IStore>("Store", storeSchema);