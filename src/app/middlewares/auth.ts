import { NextFunction, Request, Response } from "express"
import catchAsync from "../utils/catchAsync"
import jwt, { JwtPayload } from "jsonwebtoken"
import httpStatus from "http-status"
import AppError from "../errors/AppError"
import config from "../config"
import { User } from "../modules/Users/user.model"
const auth = (requiredRole: string[]) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new AppError(httpStatus.UNAUTHORIZED, "Token is not found");
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            config.jwt_access_secret as string
        ) as JwtPayload;
        const { activeRole, userId, email } = decoded;
        console.log("email", email)

        // check if the user exists in the db
        const user = await User.findOne({ email });
        // console.log(user);
        if (!user) {
            throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
        }
        // check if the user is blocked
        if (user.isBlocked) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked !');
        }
        // check if the user role is allowed to access the route
        if (requiredRole && !requiredRole.includes(activeRole)) {
            throw new AppError(httpStatus.FORBIDDEN, 'This user is not allowed to access this route !');
        }
        req.user = decoded as JwtPayload;
        next()
    })
}


export default auth;