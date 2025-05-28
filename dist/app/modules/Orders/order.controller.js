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
exports.orderController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const order_service_1 = require("./order.service");
const createOrderIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield order_service_1.orderServices.createOrderIntoDb(req.body, req.user, req.ip);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Order Pressed successfully',
        statusCode: 201,
        data: result
    });
}));
const verifyPayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderServices.verifyPayment(req.query.order_id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Order verified successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
const getAllOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderServices.getAllOrders();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Order retrived successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
const changeStatus = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { status } = req.body;
    // console.log(status);
    const order = yield order_service_1.orderServices.changeStatus(status, id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Status updated successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
const getTodaysSale = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderServices.getTodaysSale();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Todays Sale calculated successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
const getTotalSale = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield order_service_1.orderServices.getTotalSale();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Total Sale calculated successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
const getMyOrders = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.user;
    const order = yield order_service_1.orderServices.getMyOrders(email);
    // console.log(order);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'My order retrived successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
const deleteOrder = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const order = yield order_service_1.orderServices.deleteOrder(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Order deleted successfully',
        statusCode: http_status_1.default.CREATED,
        data: order
    });
}));
exports.orderController = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTodaysSale,
    getMyOrders,
    changeStatus,
    deleteOrder,
    getTotalSale
};
