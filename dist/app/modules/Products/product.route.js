"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRoutes = void 0;
const express_1 = require("express");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const product_validation_1 = require("./product.validation");
const product_controller_1 = require("./product.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = (0, express_1.Router)();
router.post('/add-product', (0, validateRequest_1.default)(product_validation_1.productValidations.createProductValidationSchema), product_controller_1.productController.createProductIntoDb);
router.patch('/update-product/:id', (0, auth_1.default)(['admin']), (0, validateRequest_1.default)(product_validation_1.productValidations.updateProductValidationSchema), product_controller_1.productController.updateProductIntoDb);
router.get('/get-all-products', product_controller_1.productController.getAllProductsFromDb);
router.get('/get-available-stocks', product_controller_1.productController.getAvailableStocks);
router.get('/get-product/:id', product_controller_1.productController.getSingleProductsFromDb);
router.delete('/delete-product/:id', (0, auth_1.default)(['admin', 'customer']), product_controller_1.productController.deleteProductsFromDb);
exports.productRoutes = router;
