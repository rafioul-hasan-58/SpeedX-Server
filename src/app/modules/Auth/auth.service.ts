import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../Users/user.model";
import { IUserLogin } from "./auth.interface";
import httpStatus from "http-status";
import { createToken } from "./auth.utils";
const loginUser = async (payload: IUserLogin) => {
    const user = await User.isUserExistsByEmail(payload.email)

    // console.log((user._id).toString());
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found')
    }
    if (user?.isBlocked) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked')
    }

    if (!(await User.isPasswordMatched(payload?.password, user?.password))) {
        throw new AppError(httpStatus.FORBIDDEN, 'Password not matched')
    }

    const jwtPayload = {
        email: user.email,
        role: user.role,
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as string,
      );
      const refreshToken = createToken(
        jwtPayload,
        config.jwt_refresh_secret as string,
        config.jwt_refresh_expires_in as string,
      );

    return {
        accessToken,
        refreshToken
    }

}

export const authService = {
    loginUser
}