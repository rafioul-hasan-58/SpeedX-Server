import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import httpStatus from "http-status"
import { orderServices } from "./order.service"



const createOrderIntoDb = catchAsync(async (req: Request, res: Response) => {
    // console.log(user);
    // console.log(req.body, req.user, req.ip);
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

const getTotalSale = catchAsync(async (req, res) => {
    const order = await orderServices.getTodaysSale();
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Total Sale calculated successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
const getMyOrders = catchAsync(async (req, res) => {
    const {email}=req.user
    const order = await orderServices.getMyOrders(email);
    // console.log(order);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'My order retrived successfully',
        statusCode: httpStatus.CREATED,
        data: order
    })
});
export const orderController = {
    createOrderIntoDb,
    verifyPayment,
    getAllOrders,
    getTotalSale,
    getMyOrders
}