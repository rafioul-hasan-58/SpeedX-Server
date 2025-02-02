import { z } from "zod";

const createProductValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    brandName: z.string().min(1, "Brand name is required"),
    price: z.number().positive("Price must be a positive number"),
    description: z.string().min(1, "Description is required"),
    stocks: z.number().int().nonnegative("Stocks must be a non-negative integer"),
    instock: z.boolean().optional(),
});
const updateProductValidationSchema = z.object({
    name: z.string().min(1, "Name is required").optional(),
    brandName: z.string().min(1, "Brand name is required").optional(),
    price: z.number().positive("Price must be a positive number").optional(),
    description: z.string().min(1, "Description is required").optional(),
    stocks: z.number().int().nonnegative("Stocks must be a non-negative integer").optional(),
    instock: z.boolean().optional(),
});

export const productValidations = {
    createProductValidationSchema,
    updateProductValidationSchema
}
