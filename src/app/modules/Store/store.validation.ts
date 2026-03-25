import { z } from "zod";

const storeValidationSchema = z.object({
    storeName: z.string({
        required_error: "StoreName is required!",
    }).trim().min(1, "StoreName cannot be empty"),
    description: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
});

const updateStoreValidationSchema = z.object({
    storeName: z.string().trim().min(1, "StoreName cannot be empty").optional(),
    description: z.string().optional(),
    logo: z.string().optional(),
    banner: z.string().optional(),
    isActive: z.boolean().optional(),
    isVerified: z.boolean().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
});

export const storeValidations = {
    storeValidationSchema,
    updateStoreValidationSchema
};
