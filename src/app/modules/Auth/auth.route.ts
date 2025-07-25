
import { Router } from "express";
import { authController } from "./auth.controller";


const router = Router()
router.post('/google-login', authController.googleLogin);
router.post("/login", authController.loginUser);
router.post('/refresh-token', authController.refreshToken);

export const authRoutes = router