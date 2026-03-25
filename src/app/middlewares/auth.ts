import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import jwt, { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status"
import AppError from "../errors/AppError"
import config from "../config"
import { User } from "../modules/Users/user.model"
const auth = (...requiredRole: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        // 1.Get token
        const token = req.headers.authorization;

        if (!token || !token.startsWith("Bearer ")) {
            throw new AppError(httpStatus.UNAUTHORIZED, "You are not authorized!");
        }
        const accessToken = token.split(" ")[1];
        if (!accessToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Invalid token format");
        }
        // 2.Decode token
        const verifiedUser = jwt.verify(
            accessToken,
            config.jwt_access_secret as string
        ) as JwtPayload;

        req.user = verifiedUser;

        const { email } = verifiedUser;

        // 3.Check if the user exists in the db
        const user = await User.findOne({ email });
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
        }
        // 4.Check if the user is blocked
        if (user.isBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
        }
        // 5.Check if the user role is allowed to access the route
        if (requiredRole.length > 0 && !requiredRole.includes(verifiedUser.activeRole)) {
            throw new AppError(httpStatus.FORBIDDEN, "Forbidden, You are not authorized!");
        }
        next()
    })
}


export default auth;