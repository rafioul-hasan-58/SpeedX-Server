import { Request, Response } from "express"
import catchAsync from "../../utils/catchAsync"
import httpStatus from "http-status"
import { orderServices } from "./order.service"



const createOrderIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await orderServices.createOrderIntoDb(req.body)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Order Pressed successfully',
        statusCode: 201,
        data: result
    })
})

export const orderController={
    createOrderIntoDb
}