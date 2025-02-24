"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = (0, express_1.Router)();
router.post('/register', (0, validateRequest_1.default)(user_validation_1.userValidations.userValidationSchema), user_controller_1.userController.createUserIntoDb);
router.get('/get-all-users', user_controller_1.userController.getAllUsers);
router.patch('/update/:id', sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    req.body = JSON.parse(req.body.data);
    next();
}, (0, validateRequest_1.default)(user_validation_1.userValidations.updateUserValidationSchema), user_controller_1.userController.updateUserIntoDb);
router.delete('/delete/:id', user_controller_1.userController.deleteUserFromDb);
router.get('/get-profile/:email', user_controller_1.userController.getMyProfile);
exports.userRoutes = router;
