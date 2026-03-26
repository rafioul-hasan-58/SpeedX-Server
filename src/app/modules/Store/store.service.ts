import AppError from "../../errors/AppError";
import { User } from "../Users/user.model";
import { IStore } from "./store.interface";
import httpStatus from 'http-status'
import { Store } from "./store.model";
import { userServices } from "../Users/user.service";

const createStore = async (userId: string, payload: IStore) => {
    const user = await User.findById({ _id: userId });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found!")
    }
    const result = await Store.create({
        owner: userId,
        storeName: payload.storeName,
        description: payload.description,
        address: payload.address,
        phone: payload.phone,
    });
    await userServices.addSellerRole(userId);

    return result
};



export const storeService = {
    createStore
}