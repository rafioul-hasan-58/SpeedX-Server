import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import jwt, { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status"
import AppError from "../errors/AppError"
import config from "../config"
import { User } from "../modules/Users/user.model"
const auth = (requiredRole: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if (!token) {
            throw new AppError(httpStatus.NOT_FOUND, "Token is not found")
        }

        const decoded = jwt.verify(token, config.jwt_access_secret as string) as JwtPayload;

        const { email, role } = decoded;

        // check if the user exists in the db
        const user = await User.isUserExistsByEmail(email);
        // console.log(user);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
        }
        // check if the user is blocked
        if (user.isBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
        }
        // check if the token issued before the password changed

        // check if the user role is allowed to access the route
        if (requiredRole && !requiredRole.includes(role)) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is not allowed to access this route !');
        }
        req.user = decoded as JwtPayload;
        next()
    })
}


export default auth;