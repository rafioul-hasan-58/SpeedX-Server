"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeValidations = void 0;
const zod_1 = require("zod");
const storeValidationSchema = zod_1.z.object({
    storeName: zod_1.z.string({
        required_error: "StoreName is required!",
    }).trim().min(1, "StoreName cannot be empty"),
    description: zod_1.z.string().optional(),
    logoUrl: zod_1.z.string().optional(),
    bannerUrl: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
const updateStoreValidationSchema = zod_1.z.object({
    storeName: zod_1.z.string().trim().min(1, "StoreName cannot be empty").optional(),
    description: zod_1.z.string().optional(),
    logoUrl: zod_1.z.string().optional(),
    bannerUrl: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().optional(),
    isVerified: zod_1.z.boolean().optional(),
    address: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
});
exports.storeValidations = {
    storeValidationSchema,
    updateStoreValidationSchema
};
