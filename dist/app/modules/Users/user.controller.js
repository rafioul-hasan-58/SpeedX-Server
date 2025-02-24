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
const createUserIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.createUserIntoDb(req.body);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'User registerd successfully',
        statusCode: 201,
        data: result
    });
}));
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.params;
    const result = yield user_service_1.userServices.getProfileFromDb(email);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Profile retrived successfully',
        statusCode: 200,
        data: result
    });
}));
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getAllUsersFromDb();
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'All users retrived successfully',
        statusCode: 200,
        data: result
    });
}));
const updateUserIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // console.log(req.file,'file');
    const result = yield user_service_1.userServices.updateUserIntoDb(req.body, id, req.file);
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'User updated successfully',
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
exports.userController = {
    createUserIntoDb,
    updateUserIntoDb,
    deleteUserFromDb,
    getMyProfile,
    getAllUsers
};
