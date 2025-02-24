"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    image: {
        type: String,
        default: ''
    },
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
});
exports.Product = (0, mongoose_1.model)('Product', productSchema);
