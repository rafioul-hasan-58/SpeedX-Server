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
exports.authValidation = {
    loginValidationSchema,
    changePasswordSchema
};
