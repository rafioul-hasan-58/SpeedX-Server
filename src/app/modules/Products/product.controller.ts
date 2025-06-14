import catchAsync from "../../utils/catchAsync"
import httpStatus from "http-status"
import { productServices } from "./product.service"
import { Request, Response } from "express"


const createProduct = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.createProduct(req.body)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product added successfully',
        statusCode: 201,
        data: result
    })
})
const updateProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    // console.log(req.file, 'file');
    const result = await productServices.updateProduct(req.body, id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product updated successfully',
        statusCode: 201,
        data: result
    })
})
const removeImage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await productServices.removeImage(id, req.body.image);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Image removed successfully',
        statusCode: 201,
        data: result
    })
})
const getAllProducts = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAllProducts(req.query)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product retrived successfully',
        data: result.data,
        meta: result.meta
    })
})
const getMyProducts = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.params
    const result = await productServices.getMyProducts(email);
    res.status(httpStatus.OK).json({
        success: true,
        message: 'My added products retrived successfully',
        statusCode: 201,
        data: result
    })
})
const getSingleProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await productServices.getSingleProduct(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Single product retrived successfully',
        statusCode: 201,
        data: result
    })
})
const deleteProduct = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params
    const result = await productServices.deleteProduct(id)
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Product deleted successfully',
        statusCode: 201,
        data: result
    })
})
const getAvailableStocks = catchAsync(async (req: Request, res: Response) => {
    const result = await productServices.getAvailableStocks()
    res.status(httpStatus.OK).json({
        success: true,
        message: 'Stocks retrived successfully',
        statusCode: 201,
        data: result
    })
})

export const productController = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    getAvailableStocks,
    removeImage,
    getMyProducts
}