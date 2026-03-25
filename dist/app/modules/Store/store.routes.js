"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeRoutes = void 0;
const express_1 = require("express");
const store_controller_1 = require("./store.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const store_validation_1 = require("./store.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post("/create-store", (0, auth_1.default)(), (0, validateRequest_1.default)(store_validation_1.storeValidations.storeValidationSchema), store_controller_1.storeController.createStore);
exports.storeRoutes = router;
