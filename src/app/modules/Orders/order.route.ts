import { Router } from "express";
import { orderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidations } from "./order.validation";

const router = Router()

router.post('/add-order',validateRequest(orderValidations.createOrderValidationSchema), orderController.createOrderIntoDb)


export const orderRoutes = router