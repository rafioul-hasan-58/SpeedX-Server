
import { Router } from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";


const router = Router()
router.post(
    '/google-login',
    authController.googleLogin
);

router.post(
    "/login",
    authController.loginUser
);

router.post(
    '/refresh-token',
    authController.refreshToken
);

router.patch(
    "/change-password",
    auth(),
    validateRequest(authValidation.changePasswordSchema),
    authController.changePassword
);

router.post(
    "/verify-otp",
    validateRequest(authValidation.verifyOTPSchema),
    authController.verifyOtp
);
router.post(
    "/verify-forgot-password-otp",
    validateRequest(authValidation.verifyOTPSchema),
    authController.verifyForgotOtp
);

router.post(
    "/forgot-password",
    validateRequest(authValidation.forgotPasswordValidationSchema),
    authController.forgetPassword
);

router.post(
    "/reset-password",
    validateRequest(authValidation.resetPasswordValidationSchema),
    authController.resetPassword
);

router.post(
    "/resend-otp",
    validateRequest(authValidation.resendOtpValidationSchema),
    authController.resendOtp
);

export const authRoutes = router