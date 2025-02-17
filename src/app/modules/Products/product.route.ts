import { NextFunction, Request, Response, Router } from "express";
import validateRequest from "../../middlewares/validateRequest";
import { productValidations } from "./product.validation";
import { productController } from "./product.controller";
import auth from "../../middlewares/auth";
import { upload } from "../../utils/sendImageToCloudinary";

const router = Router()

router.post('/add-product', upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    }, validateRequest(productValidations.createProductValidationSchema), productController.createProductIntoDb)

router.patch('/update-product/:id', upload.single('file'),
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data);
        next();
    }, auth(['admin', 'customer']), validateRequest(productValidations.updateProductValidationSchema), productController.updateProductIntoDb)

router.get('/get-all-products', productController.getAllProductsFromDb)
router.get('/get-product/:id', productController.getSingleProductsFromDb)
router.delete('/delete-product/:id', auth(['admin', 'customer']), productController.deleteProductsFromDb)

export const productRoutes = router