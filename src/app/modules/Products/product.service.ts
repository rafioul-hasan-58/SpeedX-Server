import QueryBuilder from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { productSearchableFields } from "./product.constant";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import httpStatus from "http-status";

const createProduct = async (payload: IProduct) => {
    const result = await Product.create(payload);
    return result
}
const updateProduct = async (payload: Partial<IProduct>, id: string) => {
    const isProductExists = await Product.findById(id)
    if (!isProductExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'The user could not found')
    }
    const result = await Product.findByIdAndUpdate(id, payload);
    return result
}
// const getAllProducts = async (query: Record<string, unknown>) => {
//     const page = Number(query.page) || 1;
//     const limit = Number(query.limit) || 8;
//     const skip = (page - 1) * limit;
//     const productQuery = new QueryBuilder(Product.find(), query)
//         .filter()
//         .search(productSearchableFields);

//     const result = await productQuery.modelQuery;

//     const total = await Product.countDocuments(productQuery.query);
//     productQuery.modelQuery = productQuery.modelQuery.skip(skip).limit(limit);
//     return {
//         data: result,
//         meta: {
//             total,
//             page,
//             limit
//         }
//     }
// }
const getAllProducts = async (query: Record<string, unknown>) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 8;
    const skip = (page - 1) * limit;

    // Build query with filters/search
    const productQuery = new QueryBuilder(Product.find(), query)
        .filter()
        .search(productSearchableFields);

    // Count total BEFORE pagination
    const total = await Product.countDocuments(productQuery.query);

    // Apply pagination NOW
    productQuery.modelQuery = productQuery.modelQuery.skip(skip).limit(limit);
    const totalPage = Math.ceil(total / limit);

    // Execute final paginated query
    const result = await productQuery.modelQuery;

    return {
        data: result,
        meta: {
            total,
            page,
            limit,
            totalPage
        },
    };
};

const getMyProducts = async (email: string) => {
    const result = await Product.find({ addedBy: email });
    return result
}
const getSingleProduct = async (id: string) => {
    const result = await Product.findById(id);
    return result
}
const deleteProduct = async (id: string) => {
    const result = await Product.findByIdAndDelete(id);
    return result
}
const getAvailableStocks = async () => {
    const result = await Product.aggregate([
        {
            $group: {
                _id: '$brandName',
                totalStocks: { $sum: '$stocks' }
            }
        }
    ])
    return result
}
const removeImage = async (id: string, image: string) => {
    const bike = await Product.findById(id);
    const finalImages = bike?.images?.filter((img) => img !== image);
    const result = await Product.findByIdAndUpdate(id, { images: finalImages },
        { new: true });
    return result;
}

export const productServices = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    getAvailableStocks,
    removeImage,
    getMyProducts
}