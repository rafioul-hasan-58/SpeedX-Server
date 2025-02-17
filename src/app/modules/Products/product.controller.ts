import catchAsync from "../../utils/catchAsync"
import httpStatus from "http-status"
import { productServices } from "./product.service"
import { Request, Response } from "express"


const createProductIntoDb = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.createProductIntoDb(req.body, req.file)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product added successfully',
        statusCode: 201,
        data: result
    })
})
const updateProductIntoDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    console.log(req.file, 'file');
    const result = await productServices.updateProductIntoDb(req.body, id, req.file)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product updated successfully',
        statusCode: 201,
        data: result
    })
})
const getAllProductsFromDb = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAllProductsFromDb(req.query)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'All Products retrived successfully',
        statusCode: 201,
        data: result
    })
})
const getSingleProductsFromDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await productServices.getSingleProductFromDb(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Single product retrived successfully',
        statusCode: 201,
        data: result
    })
})
const deleteProductsFromDb = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await productServices.deleteProductFromDb(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product deleted successfully',
        statusCode: 201,
        data: result
    })
})

export const productController = {
    createProductIntoDb,
    updateProductIntoDb,
    getAllProductsFromDb,
    getSingleProductsFromDb,
    deleteProductsFromDb
}