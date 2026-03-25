import AppError from "../../errors/AppError";
import { UserRole } from "./user.constant";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
const register = async (payload: IUser) => {
    const result = await User.create(payload);
    return result
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