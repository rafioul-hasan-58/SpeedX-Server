import AppError from "../../errors/AppError";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status";
const createUserIntoDb = async (payload: IUser) => {
    const result = await User.create(payload);
    return result
}
const getProfileFromDb = async (email: string) => {
    const result = await User.findOne({ email })
    return result
}
const getAllUsersFromDb = async () => {
    const result = await User.find()
    return result
}
const updateUserIntoDb = async (payload: Partial<IUser>, userId: string, file: any) => {
    const isUserExists = await User.findById(userId)
    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user could not found')
    }
    if (isUserExists.isBlocked) {
        throw new AppError(httpStatus.BAD_REQUEST, 'The user is Blocked')
    }
    if (file) {
        const imageName = `${payload?.email}${payload?.name}`;
        const path = file?.path;
        const { secure_url } = await sendImageToCloudinary(imageName, path);
        // console.log(secure_url,'image');
        payload.image = secure_url as string
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
    getProfileFromDb,
    getAllUsersFromDb
}