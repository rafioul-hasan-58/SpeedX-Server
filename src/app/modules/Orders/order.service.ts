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
        const { items } = payload;

        // validate all products
        const productIds = items.map((item) => item.product);
        const products = await Product.find({ _id: { $in: productIds } }).session(session);

        if (products.length !== items.length) {
            throw new AppError(httpStatus.NOT_FOUND, "One or more products not found");
        }

        let totalPrice = 0;

        for (const item of items) {
            const product = products.find(p => p._id.equals(item.product));
            if (!product) {
                throw new AppError(httpStatus.NOT_FOUND, `Product not found: ${item.product}`);
            }
            if (product.stocks < item.quantity) {
                throw new AppError(httpStatus.BAD_REQUEST, `Not enough stock for ${product.name}`);
            }
            totalPrice += item.quantity * product.price;
        }


        // Ensure enough stock is available

        const currentUser = await User.findOne({ email: user.email }).session(session);
        const buyer = currentUser?._id?.toString();

        // Decrease stock for each product
        for (const item of items) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product, stocks: { $gte: item.quantity } },
                { $inc: { stocks: -item.quantity } },
                { session }
            );

            if (!updated) {
                throw new AppError(httpStatus.BAD_REQUEST, `Failed to update stock for product ${item.product}`);
            }
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
// const createOrderIntoDb = async (payload: IOrder, user: any, client_ip: string) => {
//     const session = await mongoose.startSession();
//     session.startTransaction();
//     try {
//         const { product, quantity } = payload;

//         // Find product
//         const productInfo = await Product.findById(product).session(session);
//         if (!productInfo) {
//             throw new AppError(httpStatus.NOT_FOUND, 'Product not found');
//         }

//         // Ensure enough stock is available
//         if (productInfo.stocks < quantity) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Not enough stock available');
//         }

//         const totalPrice = Number(quantity * productInfo.price);
//         const currentUser = await User.findOne({ email: user.email }).session(session);
//         const buyer = currentUser?._id?.toString();

//         // Decrease stock but only if enough is available
//         const updatedProduct = await Product.findOneAndUpdate(
//             { _id: product, stocks: { $gte: quantity } }, // Ensures enough stock
//             { $inc: { stocks: -quantity } },
//             { new: true, session }
//         );

//         if (!updatedProduct) {
//             throw new AppError(httpStatus.BAD_REQUEST, 'Stock update failed, possibly due to insufficient stock');
//         }

//         // Create the order inside the transaction
//         let [order] = await Order.create([{ ...payload, totalPrice, buyer }], { session });

//         // Payment integration
//         const shurjopayPayload = {
//             amount: totalPrice,
//             order_id: order._id,
//             currency: "BDT",
//             customer_name: currentUser?.name,
//             customer_address: payload.address,
//             customer_email: currentUser?.email,
//             customer_phone: String(payload.contact),
//             customer_city: payload.address,
//             client_ip,
//         };

//         const payment = await orderUtils.makePaymentAsync(shurjopayPayload);

//         if (payment?.transactionStatus) {
//             await Order.findByIdAndUpdate(order._id, {
//                 transaction: {
//                     id: payment.sp_order_id,
//                     transactionStatus: payment.transactionStatus,
//                 },
//             }).session(session);
//         }

//         await session.commitTransaction();
//         session.endSession();

//         return { payment, order }
//     } catch (error) {
//         // Rollback transaction if something goes wrong
//         await session.abortTransaction();
//         session.endSession();
//         throw error;
//     }
// };
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

const getAllOrders = async (filters?: {
    email?: string,
    status?: string,
    page?: number,
    limit?: number
}) => {
    const query: any = {};

    if (filters?.email) {
        query.email = filters.email;
    }

    if (filters?.status) {
        query.status = filters.status;
    }

    const page = Number(filters?.page) || 1;
    const limit = Number(filters?.limit) || 6;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments(query); // total matching documents

    const orders = await Order.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }) // newest first
        .populate('items.product')
        .populate('buyer');

    return {
        data: orders,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};


const getMyOrders = async (email: string) => {
    const result = await Order.find({ email }).populate('items.product');
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
const getTotalSale = async () => {
    const orders = await Order.find()
    const totalSale = orders.reduce((acc, order) => acc + (order.totalPrice ?? 0), 0)
    const totalRevenue = Number(totalSale * 0.15)
    return {
        totalSale, totalRevenue
    }
}
const changeStatus = async (status: string, orderId: string) => {
    const result = await Order.findByIdAndUpdate(orderId, { status }, { new: true })
    return result
}
const deleteOrder = async (id: string) => {
    const result = await Order.findByIdAndDelete(id)
    return result
}

export const orderServices = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTodaysSale,
    getMyOrders,
    changeStatus,
    deleteOrder,
    getTotalSale
}