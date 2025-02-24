"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidations = void 0;
const zod_1 = require("zod");
const userValidationSchema = zod_1.z.object({
    name: zod_1.z.string()
        .trim()
        .max(20, "name cannot be more than 20 characters"),
    email: zod_1.z.string().email("Invalid email address"),
    password: zod_1.z.string().min(1, "Password is required"),
    role: zod_1.z.enum(["admin", "user"]).default("user"),
    isBlocked: zod_1.z.boolean().default(false),
});
const updateUserValidationSchema = zod_1.z.object({
    name: zod_1.z.string()
        .trim()
        .max(20, "name cannot be more than 20 characters").optional(),
    email: zod_1.z.string().email("Invalid email address").optional(),
    password: zod_1.z.string().min(1, "Password is required").optional(),
    role: zod_1.z.enum(["admin", "customer"]).default("customer").optional(),
    isBlocked: zod_1.z.boolean().default(false).optional(),
});
exports.userValidations = {
    userValidationSchema,
    updateUserValidationSchema
};
