import { z } from "zod";

const userValidationSchema = z.object({
    fullName: z.string()
        .trim()
        .max(20, "Full Name cannot be more than 20 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
})
const updateUserValidationSchema = z.object({
    fullName: z.string()
        .trim()
        .max(20, "Full Name cannot be more than 20 characters").optional(),
    email: z.string().email("Invalid email address").optional(),
    password: z.string().min(1, "Password is required").optional(),
    location: z.string().optional(),
    bio: z.string().optional(),
    roles: z.enum(["admin", "customer"]).default("customer").optional(),
    isBlocked: z.boolean().default(false).optional(),
})

export const userValidations = {
    userValidationSchema,
    updateUserValidationSchema
}