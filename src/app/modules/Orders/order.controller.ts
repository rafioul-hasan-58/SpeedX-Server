import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import httpStatus from "http-status"
import { orderServices } from "./order.service"



const createOrderIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await orderServices.createOrderIntoDb(req.body, req.user, req.ip!)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Order Pressed successfully',
        statusCode: 201,
        data: result
    })
})
const verifyPayment = catchAsync(async (req, res) => {
    const order = await orderServices.verifyPayment(req.query.order_id as string);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Order verified successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
const getAllOrders = catchAsync(async (req, res) => {
    const order = await orderServices.getAllOrders();
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Order retrived successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
const changeStatus = catchAsync(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    // console.log(status);
    const order = await orderServices.changeStatus(status, id);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Status updated successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});

const getTodaysSale = catchAsync(async (req, res) => {
    const order = await orderServices.getTodaysSale();
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Todays Sale calculated successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
const getTotalSale = catchAsync(async (req, res) => {
    const order = await orderServices.getTotalSale();
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Total Sale calculated successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
const getMyOrders = catchAsync(async (req, res) => {
    const { email } = req.user;
    const order = await orderServices.getMyOrders(email);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'My order retrived successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
const deleteOrder = catchAsync(async (req, res) => {
    const { id } = req.params
    const order = await orderServices.deleteOrder(id);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Order deleted successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
export const orderController = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTodaysSale,
    getMyOrders,
    changeStatus,
    deleteOrder,
    getTotalSale
}