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
exports.userController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("./user.service");
const uploadFile_1 = require("../../utils/s3/uploadFile");
const register = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.register(req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'User registered successfully',
        statusCode: 201,
        data: result
    });
}));
const myProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield user_service_1.userServices.myProfile(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Profile retrieved successfully',
        statusCode: 200,
        data: result
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getAllUsersFromDb();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'All users retrieved successfully',
        statusCode: 200,
        data: result
    });
}));
const updateProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    if (req.file) {
        const profileImage = yield (0, uploadFile_1.getImageUrl)(req.file);
        req.body.profileImage = profileImage;
    }
    const result = yield user_service_1.userServices.updateProfile(req.body, userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Profile updated successfully',
        statusCode: http_status_1.default.OK,
        data: result
    });
}));
const deleteUserFromDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield user_service_1.userServices.deleteUserFromDb(id);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'User deleted successfully',
        statusCode: http_status_1.default.OK,
        data: 'empty'
    });
}));
const addSellerRole = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.user;
    const result = yield user_service_1.userServices.addSellerRole(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User role added successfully',
        data: result
    });
}));
exports.userController = {
    register,
    updateProfile,
    deleteUserFromDb,
    myProfile,
    getAllUsers,
    addSellerRole
};
