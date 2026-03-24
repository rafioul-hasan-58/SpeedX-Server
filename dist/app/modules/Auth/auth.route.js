"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_validation_1 = require("./auth.validation");
const router = (0, express_1.Router)();
router.post('/google-login', auth_controller_1.authController.googleLogin);
router.post("/login", auth_controller_1.authController.loginUser);
router.post('/refresh-token', auth_controller_1.authController.refreshToken);
router.patch("/change-password", (0, auth_1.default)(["customer", "admin", "seller"]), (0, validateRequest_1.default)(auth_validation_1.authValidation.changePasswordSchema), auth_controller_1.authController.changePassword);
exports.authRoutes = router;
