import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productValidations } from "./product.validation";
import { productController } from "./product.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router()

router.post('/add-product', validateRequest(productValidations.createProductValidationSchema), productController.createProductIntoDb)

router.patch('/update-product/:id', auth(['admin']), validateRequest(productValidations.updateProductValidationSchema), productController.updateProductIntoDb)

router.get('/get-all-products', productController.getAllProductsFromDb)
router.get('/get-available-stocks', productController.getAvailableStocks)
router.get('/get-product/:id', productController.getSingleProductsFromDb)
router.delete('/delete-product/:id', auth(['admin', 'customer']), productController.deleteProductsFromDb)

export const productRoutes = router