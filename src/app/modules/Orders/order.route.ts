import { Router } from "express";
import { orderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidations } from "./order.validation";
import auth from "../../middlewares/auth";

const router = Router()

router.post('/add-order',auth(['customer']),validateRequest(orderValidations.createOrderValidationSchema), orderController.createOrderIntoDb)


export const orderRoutes = router