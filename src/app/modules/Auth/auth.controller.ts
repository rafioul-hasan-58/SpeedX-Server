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
const verifyOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified successfully!",
        data: result,
    });
});
const verifyForgotOtp = catchAsync(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyForgotOtp(email, otp);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "OTP verified in forgot password!",
        data: result,
    });
});
const forgetPassword = catchAsync(async (req, res) => {
    const { email } = req.body;
    const result = await authService.forgotPassword(email);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: result.message,
        data: result,
    });
});
const resetPassword = catchAsync(async (req, res) => {
    const { newPassword, confirmPassword, email } = req.body;
    const result = await authService.resetPassword(
        email,
        newPassword,
        confirmPassword
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: result.message,
    });
});
const resendOtp = catchAsync(async (req, res) => {
    const { email } = req.body;

    const result = await authService.resendOtp(email);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        message: result.message,
    });
});


export const authController = {
    loginUser,
    refreshToken,
    googleLogin,
    changePassword,

    verifyOtp,
    verifyForgotOtp,
    forgetPassword,
    resetPassword,
    resendOtp
}
