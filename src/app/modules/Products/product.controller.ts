import catchAsync from "../../utils/catchAsync";
import httpStatus from "http-status";
import { productServices } from "./product.service";
import { Request, Response } from "express";
import sendResponse from "../../utils/sendResponse";

const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.createProduct(req.body);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "Product added successfully",
        data: result,
    });
});

const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productServices.updateProduct(req.body, id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product updated successfully",
        data: result,
    });
});

const removeImage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productServices.removeImage(id, req.body.image);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Image removed successfully",
        data: result,
    });
});

const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAllProducts(req.query);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Products retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getMyProducts = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await productServices.getMyProducts(req.query, email);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "My products retrieved successfully",
        meta: result.meta,
        data: result.data,
    });
});

const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productServices.getSingleProduct(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product retrieved successfully",
        data: result,
    });
});

const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productServices.deleteProduct(id);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Product deleted successfully",
        data: result,
    });
});

const getAvailableStocks = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAvailableStocks();

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Available stocks retrieved successfully",
        data: result,
    });
});

export const productController = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    getAvailableStocks,
    removeImage,
    getMyProducts,
};
