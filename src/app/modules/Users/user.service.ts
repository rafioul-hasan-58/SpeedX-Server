import AppError from "../../errors/AppError";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
const createUserIntoDb = async (payload: IUser) => {
    const result = await User.create(payload)
    return result
}
const getProfileFromDb = async (userId: string) => {
    const result = await User.findById(userId)
    return result
}
const updateUserIntoDb = async (payload: Partial<IUser>, userId: string) => {
    const isUserExists = await User.findById(userId)
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user could not found')
    }
    if (isUserExists.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The user is Blocked')
    }

    const result = await User.findByIdAndUpdate(userId, payload)
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

export const userServices = {
    createUserIntoDb,
    updateUserIntoDb,
    deleteUserFromDb,
    getProfileFromDb
}