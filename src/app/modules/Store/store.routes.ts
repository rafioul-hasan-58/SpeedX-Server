import { Router } from "express";
import { storeController } from "./store.controller";
import validateRequest from "../../middlewares/validateRequest";
import { storeValidations } from "./store.validation";
import auth from "../../middlewares/auth";


const router = Router();

router.post(
    "/create",
    auth(),
    validateRequest(storeValidations.storeValidationSchema),
    storeController.createStore
);



export const storeRoutes = router;