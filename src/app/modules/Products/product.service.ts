import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { sendImageToCloudinary } from "../../utils/sendImageToCloudinary";
import { productSearchableFields } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from "http-status";

const createProductIntoDb = async (payload: IProduct, file: any) => {
    if (file) {
        const imageName = `${payload?.model}${payload?.name}`;
        const path = file?.path;
        const { secure_url } = await sendImageToCloudinary(imageName, path);
        // console.log(secure_url,'image');
        payload.image = secure_url as string
    }
    const result = await Product.create(payload);
    return result
}
const updateProductIntoDb = async (payload: Partial<IProduct>, id: string, file: any) => {
    const isProductExists = await Product.findById(id)
    if (!isProductExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user could not found')
    }
    if (file) {
        const imageName = `${payload?.model}${payload?.name}`;
        const path = file?.path;
        const { secure_url } = await sendImageToCloudinary(imageName, path);
        // console.log(secure_url,'image');
        payload.image = secure_url as string
    }
    const result = await Product.findByIdAndUpdate(id, payload)
    return result
}
const getAllProductsFromDb = async (query: Record<string, unknown>) => {
    const productQuery = new QueryBuilder(Product.find(), query)
        .filter()
        .search(productSearchableFields)

    const result = await productQuery.modelQuery
    return result
}
const getSingleProductFromDb = async (id: string) => {
    const result = await Product.findById(id);
    return result
}
const deleteProductFromDb = async (id: string) => {
    const result = await Product.findByIdAndDelete(id)
    return result
}
export const productServices = {
    createProductIntoDb,
    updateProductIntoDb,
    getAllProductsFromDb,
    getSingleProductFromDb,
    deleteProductFromDb
}