import { Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productValidations } from "./product.validation";
import { productController } from "./product.controller";

const router = Router()

router.post('/add-product', validateRequest(productValidations.createProductValidationSchema), productController.createProductIntoDb)

router.patch('/update-product/:id',validateRequest(productValidations.updateProductValidationSchema),productController.updateProductIntoDb)

router.get('/get-all-products',productController.getAllProductsFromDb)
router.get('/get-product/:id',productController.getSingleProductsFromDb)
router.delete('/delete-product/:id',productController.deleteProductsFromDb)

export const productRoutes = router