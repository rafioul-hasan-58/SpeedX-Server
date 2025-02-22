import mongoose from "mongoose";
import AppError from "../../errors/AppError";
import { Product } from "../Products/product.model";
import { User } from "../Users/user.model";
import { IOrder } from "./order.interface";
import { Order } from "./order.model";
import httpStatus from 'http-status'
import { orderUtils } from "./order.utils";
const createOrderIntoDb = async (payload: IOrder, user: any, client_ip: string) => {
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
        const currentUser = await User.findOne({ email: user.email }).session(session);
        // console.log(currentUser, 'currentuser');
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

        // Create the order inside the transaction
        let [order] = await Order.create([{ ...payload, totalPrice, buyer }], { session });

        // Payment integration
        const shurjopayPayload = {
            amount: totalPrice,
            order_id: order._id,
            currency: "BDT",
            customer_name: currentUser?.name,
            customer_address: payload.address,
            customer_email: currentUser?.email,
            customer_phone: String(payload.contact),
            customer_city: payload.address,
            client_ip,
        };

        const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

        if (payment?.transactionStatus) {
            await Order.findByIdAndUpdate(order._id, {
                transaction: {
                    id: payment.sp_order_id,
                    transactionStatus: payment.transactionStatus,
                },
            }).session(session);
        }

        await session.commitTransaction();
        session.endSession();

        return { payment, order }
    } catch (error) {
        // Rollback transaction if something goes wrong
        await session.abortTransaction();
        session.endSession();
        throw error;
    }
};
const verifyPayment = async (order_id: string) => {
    const verifiedPayment = await orderUtils.verifyPaymentAsync(order_id);

    if (verifiedPayment.length) {
        await Order.findOneAndUpdate(
            {
                "transaction.id": order_id,
            },
            {
                "transaction.bank_status": verifiedPayment[0].bank_status,
                "transaction.sp_code": verifiedPayment[0].sp_code,
                "transaction.sp_message": verifiedPayment[0].sp_message,
                "transaction.transactionStatus": verifiedPayment[0].transaction_status,
                "transaction.method": verifiedPayment[0].method,
                "transaction.date_time": verifiedPayment[0].date_time,
                status:
                    verifiedPayment[0].bank_status == "Success"
                        ? "Paid"
                        : verifiedPayment[0].bank_status == "Failed"
                            ? "Pending"
                            : verifiedPayment[0].bank_status == "Cancel"
                                ? "Cancelled"
                                : "",
            }
        );
    }

    // console.log(verifiedPayment);

    return verifiedPayment;
};
const getAllOrders = async () => {
    const result = await Order.find().populate('product')
    return result
}

const getMyOrders = async (email: string) => {
    const result = await Order.find({ email }).populate('product')
    // console.log(result);
    return result
}
const getTodaysSale = async () => {
    const date = new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const orders = await Order.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    const items = orders.length
    const totalSale = orders.reduce((acc, order) => acc + (order.totalPrice ?? 0), 0)
    // console.log(items, totalSale);
    return { totalSale, items }
}

const changeStatus = async (status: string, orderId: string) => {
    console.log(status,'now',orderId);
    const result = await Order.findByIdAndUpdate(orderId, { status },{new:true})
    console.log(result);
    return result
}
const deleteOrder = async (id:string) => {
    const result = await Order.findByIdAndDelete(id)
    console.log(result);
    return result
}

export const orderServices = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTodaysSale,
    getMyOrders,
    changeStatus,
    deleteOrder
}