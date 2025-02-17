import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../Users/user.model";
import { IUserLogin } from "./auth.interface";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
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
const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email} = decoded;

  // checking if the user is exist
  const user = await User.isUserExistsByEmail(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is blocked
  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }


  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};
export const authService = {
  loginUser,
  refreshToken
}