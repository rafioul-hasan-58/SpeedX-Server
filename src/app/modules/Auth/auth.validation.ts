import { z } from "zod";

const loginValidationSchema = z.object({
  email: z.string({ required_error: 'email is required.' }),
  password: z.string({ required_error: 'Password is required' }),
});
const changePasswordSchema = z.object({
  newPassword: z.string({ required_error: 'New Password is required' }),
  oldPassword: z.string({ required_error: 'Old Password is required' }),

});
const resetPasswordValidationSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  email: z.string({ required_error: "Email is required" }).email("Invalid email address")
})

const forgotPasswordValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});



const resendOtpValidationSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

const verifyOTPSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.number().min(6, "Number will be at least 6 character")
});

export const authValidation = {
  loginValidationSchema,
  changePasswordSchema,
  resetPasswordValidationSchema,
  forgotPasswordValidationSchema,
  resendOtpValidationSchema,
  verifyOTPSchema
}