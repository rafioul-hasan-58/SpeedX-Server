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
exports.userServices = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const createUserIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.create(payload);
    return result;
});
const getProfileFromDb = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findOne({ email });
    return result;
});
const getAllUsersFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
const updateUserIntoDb = (payload, userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'The user could not found');
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'The user is Blocked');
    }
    if (file) {
        const imageName = `${payload === null || payload === void 0 ? void 0 : payload.email}${payload === null || payload === void 0 ? void 0 : payload.name}`;
        const path = file === null || file === void 0 ? void 0 : file.path;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, path);
        // console.log(secure_url,'image');
        payload.image = secure_url;
    }
    const result = yield user_model_1.User.findByIdAndUpdate(userId, payload);
    return result;
});
const deleteUserFromDb = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'The user could not found');
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'The user is Blocked');
    }
    const result = yield user_model_1.User.findByIdAndDelete(userId);
    return result;
});
exports.userServices = {
    createUserIntoDb,
    updateUserIntoDb,
    deleteUserFromDb,
    getProfileFromDb,
    getAllUsersFromDb
};
