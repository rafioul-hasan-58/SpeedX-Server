import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productValidations } from "./product.validation";
import { productController } from "./product.controller";
import auth from "../../middlewares/auth";

const router = Router()

router.post('/add-product',auth(['admin']), validateRequest(productValidations.createProductValidationSchema), productController.createProductIntoDb)

router.patch('/update-product/:id',auth(['admin']),validateRequest(productValidations.updateProductValidationSchema),productController.updateProductIntoDb)

router.get('/get-all-products',productController.getAllProductsFromDb)
router.get('/get-product/:id',productController.getSingleProductsFromDb)
router.delete('/delete-product/:id',auth(['admin']),productController.deleteProductsFromDb)

export const productRoutes = router