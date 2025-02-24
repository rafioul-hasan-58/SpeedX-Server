"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderServices = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_model_1 = require("../Products/product.model");
const user_model_1 = require("../Users/user.model");
const order_model_1 = require("./order.model");
const http_status_1 = __importDefault(require("http-status"));
const order_utils_1 = require("./order.utils");
const createOrderIntoDb = (payload, user, client_ip) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const session = yield mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { product, quantity } = payload;
        // Find product
        const productInfo = yield product_model_1.Product.findById(product).session(session);
        if (!productInfo) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Product not found');
        }
        // Ensure enough stock is available
        if (productInfo.stocks < quantity) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Not enough stock available');
        }
        const totalPrice = Number(quantity * productInfo.price);
        const currentUser = yield user_model_1.User.findOne({ email: user.email }).session(session);
        // console.log(currentUser, 'currentuser');
        const buyer = (_a = currentUser === null || currentUser === void 0 ? void 0 : currentUser._id) === null || _a === void 0 ? void 0 : _a.toString();
        // Decrease stock but only if enough is available
        const updatedProduct = yield product_model_1.Product.findOneAndUpdate({ _id: product, stocks: { $gte: quantity } }, // Ensures enough stock
        { $inc: { stocks: -quantity } }, { new: true, session });
        if (!updatedProduct) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Stock update failed, possibly due to insufficient stock');
        }
        // Create the order inside the transaction
        let [order] = yield order_model_1.Order.create([Object.assign(Object.assign({}, payload), { totalPrice, buyer })], { session });
        // Payment integration
        const shurjopayPayload = {
            amount: totalPrice,
            order_id: order._id,
            currency: "BDT",
            customer_name: currentUser === null || currentUser === void 0 ? void 0 : currentUser.name,
            customer_address: payload.address,
            customer_email: currentUser === null || currentUser === void 0 ? void 0 : currentUser.email,
            customer_phone: String(payload.contact),
            customer_city: payload.address,
            client_ip,
        };
        const payment = yield order_utils_1.orderUtils.makePaymentAsync(shurjopayPayload);
        if (payment === null || payment === void 0 ? void 0 : payment.transactionStatus) {
            yield order_model_1.Order.findByIdAndUpdate(order._id, {
                transaction: {
                    id: payment.sp_order_id,
                    transactionStatus: payment.transactionStatus,
                },
            }).session(session);
        }
        yield session.commitTransaction();
        session.endSession();
        return { payment, order };
    }
    catch (error) {
        // Rollback transaction if something goes wrong
        yield session.abortTransaction();
        session.endSession();
        throw error;
    }
});
const verifyPayment = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    const verifiedPayment = yield order_utils_1.orderUtils.verifyPaymentAsync(order_id);
    if (verifiedPayment.length) {
        yield order_model_1.Order.findOneAndUpdate({
            "transaction.id": order_id,
        }, {
            "transaction.bank_status": verifiedPayment[0].bank_status,
            "transaction.sp_code": verifiedPayment[0].sp_code,
            "transaction.sp_message": verifiedPayment[0].sp_message,
            "transaction.transactionStatus": verifiedPayment[0].transaction_status,
            "transaction.method": verifiedPayment[0].method,
            "transaction.date_time": verifiedPayment[0].date_time,
            status: verifiedPayment[0].bank_status == "Success"
                ? "Paid"
                : verifiedPayment[0].bank_status == "Failed"
                    ? "Pending"
                    : verifiedPayment[0].bank_status == "Cancel"
                        ? "Cancelled"
                        : "",
        });
    }
    // console.log(verifiedPayment);
    return verifiedPayment;
});
const getAllOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find().populate('product');
    return result;
});
const getMyOrders = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.find({ email }).populate('product');
    // console.log(result);
    return result;
});
const getTodaysSale = () => __awaiter(void 0, void 0, void 0, function* () {
    const date = new Date();
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    const orders = yield order_model_1.Order.find({
        createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    const items = orders.length;
    const totalSale = orders.reduce((acc, order) => { var _a; return acc + ((_a = order.totalPrice) !== null && _a !== void 0 ? _a : 0); }, 0);
    // console.log(items, totalSale);
    return { totalSale, items };
});
const getTotalSale = () => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield order_model_1.Order.find();
    const totalSale = orders.reduce((acc, order) => { var _a; return acc + ((_a = order.totalPrice) !== null && _a !== void 0 ? _a : 0); }, 0);
    const totalRevenue = Number(totalSale * 0.15);
    return {
        totalSale, totalRevenue
    };
});
const changeStatus = (status, orderId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findByIdAndUpdate(orderId, { status }, { new: true });
    return result;
});
const deleteOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_model_1.Order.findByIdAndDelete(id);
    return result;
});
exports.orderServices = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTodaysSale,
    getMyOrders,
    changeStatus,
    deleteOrder,
    getTotalSale
};
