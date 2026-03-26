import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { userServices } from "./user.service";
import { getImageUrl } from "../../utils/s3/uploadFile";
import sendResponse from "../../utils/sendResponse";

const register = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.register(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User registered successfully",
        data: result,
    });
});

const myProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await userServices.myProfile(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile retrieved successfully",
        data: result,
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.getAllUsersFromDb();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "All users retrieved successfully",
        data: result,
    });
});

const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;

    if (req.file) {
        const profileImage = await getImageUrl(req.file as any);
        req.body.profileImage = profileImage;
    }

    const result = await userServices.updateProfile(req.body, userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Profile updated successfully",
        data: result,
    });
});

const deleteUserFromDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userServices.deleteUserFromDb(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "User deleted successfully",
        data: null,
    });
});

const addSellerRole = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await userServices.addSellerRole(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Seller role added successfully",
        data: result,
    });
});

const switchRole = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await userServices.switchRole(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Role switched successfully",
        data: result,
    });
});

export const userController = {
    register,
    updateProfile,
    deleteUserFromDb,
    myProfile,
    getAllUsers,
    addSellerRole,
    switchRole
};
