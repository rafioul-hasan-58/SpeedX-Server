import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { storeService } from "./store.service";
import httpStatus from 'http-status'


const createStore = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.user;
    const result = await storeService.createStore(userId, req.body);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Store created successfully!",
        data: result,
    });
});


export const storeController = {
    createStore
}