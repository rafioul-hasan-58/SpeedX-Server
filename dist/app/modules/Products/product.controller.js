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
exports.productController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const product_service_1 = require("./product.service");
const createProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.createProduct(req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Product added successfully',
        statusCode: 201,
        data: result
    });
}));
const updateProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // console.log(req.file, 'file');
    const result = yield product_service_1.productServices.updateProduct(req.body, id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Product updated successfully',
        statusCode: 201,
        data: result
    });
}));
const removeImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.productServices.removeImage(id, req.body.image);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Image removed successfully',
        statusCode: 201,
        data: result
    });
}));
const getAllProducts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.getAllProducts(req.query);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Product retrived successfully',
        data: result.data,
        meta: result.meta
    });
}));
const getSingleProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.productServices.getSingleProduct(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Single product retrived successfully',
        statusCode: 201,
        data: result
    });
}));
const deleteProduct = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield product_service_1.productServices.deleteProduct(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Product deleted successfully',
        statusCode: 201,
        data: result
    });
}));
const getAvailableStocks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_service_1.productServices.getAvailableStocks();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Stocks retrived successfully',
        statusCode: 201,
        data: result
    });
}));
exports.productController = {
    createProduct,
    updateProduct,
    getAllProducts,
    getSingleProduct,
    deleteProduct,
    getAvailableStocks,
    removeImage
};
