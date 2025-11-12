import config from "../../config";
import AppError from "../../errors/AppError";
import { User } from "../Users/user.model";
import { IUserLogin } from "./auth.interface";
import httpStatus from "http-status";
import { createToken, verifyToken } from "./auth.utils";
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';
const client = new OAuth2Client(config.google_client_id);

const googleLogin = async (body: { token: string }) => {
  const { token } = body;
  console.log(token);
  const tiket = await client.verifyIdToken({
    idToken: token,
    audience: config.google_client_id
  });
  const payload = tiket.getPayload();
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
    email: user.email,
    role: user.role
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
    role: user.role
  }
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
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
    config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
  );

  return {
    accessToken,
  };
};
export const authService = {
  loginUser,
  refreshToken,
  googleLogin
}