import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import { authService } from "./auth.service"
import config from "../../config"
import sendResponse from "../../utils/sendResponse"

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.loginUser(req.body)
    const { refreshToken, accessToken } = user

    res.cookie("refreshToken", refreshToken, {
        secure: config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
    })

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Login successful",
        data: { accessToken },
    })
})

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    const result = await authService.refreshToken(refreshToken)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Token refreshed successfully",
        data: result,
    })
})

const googleLogin = catchAsync(async (req: Request, res: Response) => {
    const result = await authService.googleLogin(req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Google login successful",
        data: result,
    })
})

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user
    const result = await authService.changePassword(userId, req.body)

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password updated successfully",
        data: result,
    })
})

export const authController = {
    loginUser,
    refreshToken,
    googleLogin,
    changePassword,
}
