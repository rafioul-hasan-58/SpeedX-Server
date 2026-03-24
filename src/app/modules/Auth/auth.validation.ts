import { z } from "zod";

const loginValidationSchema = z.object({
  email: z.string({ required_error: 'email is required.' }),
  password: z.string({ required_error: 'Password is required' }),
});
const changePasswordSchema = z.object({
  newPassword: z.string({ required_error: 'New Password is required' }),
  oldPassword: z.string({ required_error: 'Old Password is required' }),

});

export const authValidation = {
  loginValidationSchema,
  changePasswordSchema
}