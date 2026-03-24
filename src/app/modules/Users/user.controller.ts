import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { userServices } from "./user.service";
import { getImageUrl } from "../../utils/s3/uploadFile";
const register = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.register(req.body)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'User registered successfully',
        statusCode: 201,
        data: result
    })
})
const myProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await userServices.myProfile(userId)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Profile retrieved successfully',
        statusCode: 200,
        data: result
    })
})
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.getAllUsersFromDb()
    res.status(httpStatus.OK).json({
        success: true,
        message: 'All users retrieved successfully',
        statusCode: 200,
        data: result
    })
})
const updateProfile = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    if (req.file) {
        const profileImage = await getImageUrl(req.file as any);
        req.body.profileImage = profileImage
    }
    const result = await userServices.updateProfile(req.body, userId)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Profile updated successfully',
        statusCode: httpStatus.OK,
        data: result
    })
});
const deleteUserFromDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await userServices.deleteUserFromDb(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'User deleted successfully',
        statusCode: httpStatus.OK,
        data: 'empty'
    })
})
const addSellerRole = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await userServices.addSellerRole(userId)
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: 'User role added successfully',
        data: result
    })
})

export const userController = {
    register,
    updateProfile,
    deleteUserFromDb,
    myProfile,
    getAllUsers,
    addSellerRole
}
