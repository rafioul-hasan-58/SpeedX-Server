import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../Users/user.model";
import { IUserLogin } from "./auth.interface";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

const client = new OAuth2Client(config.google_client_id);

const googleLogin = async (body: { token: string }) => {
  const { token } = body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.google_client_id
  });
  const payload = ticket.getPayload();
  if (!payload) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid Google token payload");
  }
  const { name, email } = payload;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      name,
      email,
      password: crypto.randomBytes(6).toString('hex')
    })
  }
  if (user?.isBlocked) {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked')
  }
  const jwtPayload = {
    userId: user.id,
    email: user.email,
    fullName: user.fullName,
    activeRole: user.activeRole
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
  );

  return {
    accessToken
  }
}
const loginUser = async (payload: IUserLogin) => {
  const user = await User.findOne({ email: payload.email });
  // const user = await User.isUserExistsByEmail(payload.email)

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
    userId: user.id,
    fullName: user.fullName,
    email: user.email,
    activeRole: user.activeRole
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
  );

  return {
    accessToken,
    refreshToken
  }

}


const refreshToken = async (token: string) => {
  // checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);

  const { email } = decoded;

  // checking if the user is exist
  // const user = await User.isUserExistsByEmail(email);
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  // checking if the user is blocked
  const userStatus = user?.isBlocked;

  if (userStatus) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is blocked ! !');
  }


  const jwtPayload = {
    userId: user.id,
    email: user.email,
    activeRole: user.activeRole,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
  );

  return {
    accessToken,
  };
};

const changePassword = async (userId: string, password: { newPassword: string, oldPassword: string }) => {
  const { newPassword, oldPassword } = password;

  const user = await User.findById({ _id: userId });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found!");
  };
  if (!(await User.isPasswordMatched(oldPassword, user?.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password not matched')
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  return {
    message: "Password Changed!"
  }

}
export const authService = {
  loginUser,
  refreshToken,
  googleLogin,
  changePassword
}