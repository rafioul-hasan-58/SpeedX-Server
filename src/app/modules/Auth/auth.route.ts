
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
export const authRoutes = router