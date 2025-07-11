import { Request, Response } from "express"
import httpStatus from "http-status"
import catchAsync from "../../utils/catchAsync"
import { authService } from "./auth.service"
import config from "../../config"

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const user = await authService.loginUser(req.body)
    const { refreshToken, accessToken } = user;
    res.cookie('refreshToken', refreshToken, {
        secure: config.NODE_ENV === 'production',
        httpOnly: true,
        sameSite: true,
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: "Login successful",
        data: {
            accessToken
        }
    })
})
const refreshToken = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    const result = await authService.refreshToken(refreshToken);

    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: "Login successful",
        data: result
    })
})
const googleLogin = catchAsync(async (req, res) => {
    const result = await authService.googleLogin(req.body);
    res.status(httpStatus.OK).json({
        success: true,
        statusCode: 200,
        message: "Google login successful",
        data: result
    })
})
export const authController = {
    loginUser,
    refreshToken,
    googleLogin
}