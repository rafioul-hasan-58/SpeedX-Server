import { z } from "zod";

const userValidationSchema = z.object({
    name: z.string()
        .trim()
        .max(20, "name cannot be more than 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
    role: z.enum(["admin", "user"]).default("user"),
    isBlocked: z.boolean().default(false),
})
const updateUserValidationSchema = z.object({
    name: z.string()
        .trim()
        .max(20, "name cannot be more than 20 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(1, "Password is required").optional(),
    role: z.enum(["admin", "customer"]).default("customer").optional(),
    isBlocked: z.boolean().default(false).optional(),
})

export const userValidations = {
    userValidationSchema,
    updateUserValidationSchema
}