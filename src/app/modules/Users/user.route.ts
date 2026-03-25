import { Router } from "express";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidations } from "./user.validation";
import auth from "../../middlewares/auth";
import { uploadFile } from "../../utils/s3/uploadFile";
import { parseBodyData } from "../../middlewares/parseBody";
import { UserRole } from "./user.constant";

const router = Router()

router.post(
    '/register',
    validateRequest(userValidations.userValidationSchema),
    userController.register
);
router.get(
    '/get-all-users',
    userController.getAllUsers
);
router.patch(
    '/update-profile',
    auth(),
    uploadFile.uploadProfileImage,
    parseBodyData,
    validateRequest(userValidations.updateUserValidationSchema),
    userController.updateProfile
);
router.delete('/delete/:id', userController.deleteUserFromDb)
router.get(
    '/my-profile',
    auth(),
    userController.myProfile
);
router.post(
    "/add-role",
    auth(UserRole.CUSTOMER),
    userController.addSellerRole
);

export const userRoutes = router