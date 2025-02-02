import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";

const router = Router()

router.post('/register', validateRequest(userValidations.userValidationSchema), userController.createUserIntoDb)
router.patch('/update/:id', validateRequest(userValidations.updateUserValidationSchema), userController.updateUserIntoDb)
router.delete('/delete/:id', userController.deleteUserFromDb)
router.get('/get-profile/:id', userController.getMyProfile)

export const userRoutes = router