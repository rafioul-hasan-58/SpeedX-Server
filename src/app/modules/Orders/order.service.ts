import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { Product } from "../Products/product.model";
import { User } from "../Users/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import httpStatus from 'http-status'
const createOrderIntoDb = async (payload: IOrder, user: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { product, quantity } = payload;
        // Find product
        const productInfo = await Product.findById(product).session(session);
        if (!productInfo) {
            throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
        }
        // Ensure enough stock is available
        if (productInfo.stocks < quantity) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Not enough stock available');
        }
        const totalPrice = Number(quantity * productInfo.price);
        const currentUser = await User.findOne({ email: user }).session(session);
        const buyer = currentUser?._id?.toString();
        // Decrease stock but only if enough is available
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: product, stocks: { $gte: quantity } }, // Ensures enough stock
            { $inc: { stocks: -quantity } },
            { new: true, session }
        );

        if (!updatedProduct) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Stock update failed, possibly due to insufficient stock');
        }
        // Create the order
        const result = await Order.create([{ ...payload, totalPrice, buyer }], { session });
        // Commit transaction
        await session.commitTransaction();
        session.endSession();
        return result;
    } catch (error) {
        // Rollback transaction if something goes wrong
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};


export const orderServices = {
    createOrderIntoDb
}