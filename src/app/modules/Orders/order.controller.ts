import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { orderServices } from "./order.service";
import sendResponse from "../../utils/sendResponse";

const createOrderIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await orderServices.createOrderIntoDb(req.body, req.user, req.ip!);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Order placed successfully",
        data: result,
    });
});

const verifyPayment = catchAsync(async (req: Request, res: Response) => {
    const order = await orderServices.verifyPayment(req.query.order_id as string);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Payment verified successfully",
        data: order,
    });
});

const getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const order = await orderServices.getAllOrders(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Orders retrieved successfully",
        meta: order.meta,
        data: order.data,
    });
});

const getMyOrders = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.user;
    const order = await orderServices.getMyOrders(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My orders retrieved successfully",
        data: order,
    });
});

const changeStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const order = await orderServices.changeStatus(status, id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order status updated successfully",
        data: order,
    });
});

const getTodaysSale = catchAsync(async (req: Request, res: Response) => {
    const order = await orderServices.getTodaysSale();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Today's sales calculated successfully",
        data: order,
    });
});

const getTotalSale = catchAsync(async (req: Request, res: Response) => {
    const order = await orderServices.getTotalSale();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Total sales calculated successfully",
        data: order,
    });
});

const deleteOrder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const order = await orderServices.deleteOrder(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Order deleted successfully",
        data: order,
    });
});

export const orderController = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTodaysSale,
    getMyOrders,
    changeStatus,
    deleteOrder,
    getTotalSale,
};
