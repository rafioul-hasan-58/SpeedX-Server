"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productServices = void 0;
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const product_constant_1 = require("./product.constant");
const product_model_1 = require("./product.model");
const http_status_1 = __importDefault(require("http-status"));
const createProductIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.create(payload);
    return result;
});
const updateProductIntoDb = (payload, id) => __awaiter(void 0, void 0, void 0, function* () {
    const isProductExists = yield product_model_1.Product.findById(id);
    if (!isProductExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'The user could not found');
    }
    const result = yield product_model_1.Product.findByIdAndUpdate(id, payload);
    return result;
});
const getAllProductsFromDb = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const productQuery = new QueryBuilder_1.default(product_model_1.Product.find(), query)
        .filter()
        .search(product_constant_1.productSearchableFields);
    const result = yield productQuery.modelQuery;
    return result;
});
const getSingleProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findById(id);
    return result;
});
const deleteProductFromDb = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findByIdAndDelete(id);
    return result;
});
const getAvailableStocks = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.aggregate([
        {
            $group: {
                _id: '$brandName',
                totalStocks: { $sum: '$stocks' }
            }
        }
    ]);
    return result;
});
exports.productServices = {
    createProductIntoDb,
    updateProductIntoDb,
    getAllProductsFromDb,
    getSingleProductFromDb,
    deleteProductFromDb,
    getAvailableStocks
};
