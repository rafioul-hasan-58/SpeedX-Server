import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productValidations } from "./product.validation";
import { productController } from "./product.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router()

router.post(
    '/add-product',
    validateRequest(productValidations.createProductValidationSchema),
    productController.createProduct
);

router.patch(
    '/update-product/:id',
    auth(['admin','customer']),
    validateRequest(productValidations.updateProductValidationSchema),
    productController.updateProduct
);
router.patch(
    '/remove-product-image/:id',
    // auth(['admin','customer']),
    productController.removeImage
);
router.get(
    '/get-all-products',
    productController.getAllProducts
);
router.get(
    '/get-my-added-products',
    productController.getMyProducts
);
router.get(
    '/get-available-stocks',
    productController.getAvailableStocks
);
router.get(
    '/get-product/:id',
    productController.getSingleProduct
);
router.delete(
    '/delete-product/:id',
    auth(['admin', 'customer']),
    productController.deleteProduct
);

export const productRoutes = router