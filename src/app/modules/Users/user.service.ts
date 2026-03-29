import config from "../../config";
import AppError from "../../errors/AppError";
import { createToken } from "../Auth/auth.utils";
import { UserRole } from "./user.constant";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
const register = async (payload: IUser) => {
    const isUserExists = await User.findOne({ email: payload.email });
    if (isUserExists) {
        throw new AppError(httpStatus.CONFLICT, "User already exists!")
    }
    const user = await User.create(payload);
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
        user,
        accessToken,
        refreshToken
    }
}
const myProfile = async (userId: string) => {
    const result = await User.findById({ _id: userId });
    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, "Profile not found!")
    }
    return result
}
const getAllUsersFromDb = async () => {
    const result = await User.find()
    return result
}
const updateProfile = async (payload: Partial<IUser>, userId: string) => {
    const isUserExists = await User.findById(userId)
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user could not found')
    }
    if (isUserExists.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The user is Blocked')
    }
    const updatedPayload = {
        ...payload,
        profileImage: payload.profileImage
    }

    const result = await User.findByIdAndUpdate(userId, updatedPayload, { new: true })
    return result
}
const deleteUserFromDb = async (userId: string) => {
    const isUserExists = await User.findById(userId)
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user could not found')
    }
    if (isUserExists.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The user is Blocked')
    }

    const result = await User.findByIdAndDelete(userId)
    return result
}

const addSellerRole = async (userId: string) => {
    const user = await User.findById({ _id: userId });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    if (user?.roles.includes(UserRole.SELLER)) {
        throw new AppError(httpStatus.CONFLICT, "You already have seller role!")
    }
    const result = await User.updateOne({ _id: userId }, { $addToSet: { roles: UserRole.SELLER } })
    return result
};


const switchRole = async (userId: string) => {
    const user = await User.findById({ _id: userId });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }

    let newRole = user.activeRole;
    switch (user.activeRole) {
        case UserRole.CUSTOMER:
            if (!user.roles.includes(UserRole.SELLER)) {
                throw new AppError(httpStatus.FORBIDDEN, "User does not have seller role!");
            }
            newRole = UserRole.SELLER;
            break;
        case UserRole.SELLER:
            newRole = UserRole.CUSTOMER;
            break;
        default:
            break;
    }

    await User.findByIdAndUpdate(
        userId,
        { activeRole: newRole },
        { new: true }
    );
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        activeRole: newRole
    }
    const accessToken = createToken(
        jwtPayload,
        config.jwt_access_secret as string,
        config.jwt_access_expires_in as `${number}s` | `${number}m` | `${number}h` | `${number}d`
    );
    return {
        message: "Role switched!",
        activeRole: newRole,
        accessToken
    }
}
const pendingSellerRequest = async () => {
    const result = await User.find({ isSellerRequest: true })
    return result
}
const acceptSellerRequest = async (userId: string) => {
    const user = await User.findById({ _id: userId });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    if (user?.roles.includes(UserRole.SELLER)) {
        throw new AppError(httpStatus.CONFLICT, "You already have seller role!")
    }
    const result = await User.updateOne({ _id: userId }, { $addToSet: { roles: UserRole.SELLER } })
    return result
}
export const userServices = {
    register,
    updateProfile,
    deleteUserFromDb,
    myProfile,
    getAllUsersFromDb,
    addSellerRole,
    switchRole
}