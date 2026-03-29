"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const zod_1 = require("zod");
const loginValidationSchema = zod_1.z.object({
    email: zod_1.z.string({ required_error: 'email is required.' }),
    password: zod_1.z.string({ required_error: 'Password is required' }),
});
const changePasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string({ required_error: 'New Password is required' }),
    oldPassword: zod_1.z.string({ required_error: 'Old Password is required' }),
});
const resetPasswordValidationSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: zod_1.z.string(),
    email: zod_1.z.string({ required_error: "Email is required" }).email("Invalid email address")
});
const forgotPasswordValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
});
const resendOtpValidationSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
});
const verifyOTPSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: "Invalid email address" }),
    otp: zod_1.z.number().min(6, "Number will be at least 6 character")
});
exports.authValidation = {
    loginValidationSchema,
    changePasswordSchema,
    resetPasswordValidationSchema,
    forgotPasswordValidationSchema,
    resendOtpValidationSchema,
    verifyOTPSchema
};
