"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productValidations = void 0;
const zod_1 = require("zod");
const createProductValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required"),
    brandName: zod_1.z.string().min(1, "Brand name is required"),
    price: zod_1.z.number().positive("Price must be a positive number"),
    description: zod_1.z.string().min(1, "Description is required"),
    stocks: zod_1.z.number().int().nonnegative("Stocks must be a non-negative integer"),
    instock: zod_1.z.boolean().optional(),
});
const updateProductValidationSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required").optional(),
    color: zod_1.z.string().optional(),
    brandName: zod_1.z.string().min(1, "Brand name is required").optional(),
    price: zod_1.z.number().positive("Price must be a positive number").optional(),
    description: zod_1.z.string().min(1, "Description is required").optional(),
    stocks: zod_1.z.number().int().nonnegative("Stocks must be a non-negative integer").optional(),
    instock: zod_1.z.boolean().optional(),
});
exports.productValidations = {
    createProductValidationSchema,
    updateProductValidationSchema,
};
