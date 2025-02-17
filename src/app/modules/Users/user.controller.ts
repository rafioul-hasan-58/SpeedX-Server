import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { userServices } from "./user.service";
const createUserIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.createUserIntoDb(req.body)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'User registerd successfully',
        statusCode: 201,
        data: result
    })
})
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.params
    const result = await userServices.getProfileFromDb(email)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Profile retrived successfully',
        statusCode: 200,
        data: result
    })
})
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await userServices.getAllUsersFromDb()
    res.status(httpStatus.OK).json({
        success: true,
        message: 'All users retrived successfully',
        statusCode: 200,
        data: result
    })
})
const updateUserIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(req.file,'file');
    const result = await userServices.updateUserIntoDb(req.body, id,req.file)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'User updated successfully',
        statusCode: httpStatus.OK,
        data: result
    })
})
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

export const userController = {
    createUserIntoDb,
    updateUserIntoDb,
    deleteUserFromDb,
    getMyProfile,
    getAllUsers
}
