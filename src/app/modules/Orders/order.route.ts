import { Router } from "express";
import { orderController } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { orderValidations } from "./order.validation";
import auth from "../../middlewares/auth";

const router = Router()

router.post('/add-order', auth(['customer']), validateRequest(orderValidations.createOrderValidationSchema), orderController.createOrderIntoDb);
router.post('/verify-order',orderController.verifyPayment)
router.get('/get-all-orders',orderController.getAllOrders)
router.get('/get-today-sale',orderController.getTodaysSale)
router.get('/get-total-sale',orderController.getTotalSale)
router.get('/get-my-orders',auth(['customer']),orderController.getMyOrders);
router.patch('/change-status/:id',orderController.changeStatus)
router.delete('/delete-order/:id',orderController.deleteOrder)


export const orderRoutes = router