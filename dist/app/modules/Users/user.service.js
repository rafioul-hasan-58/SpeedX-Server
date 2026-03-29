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
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("../Auth/auth.utils");
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
const register = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findOne({ email: payload.email });
    if (isUserExists) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "User already exists!");
    }
    const user = yield user_model_1.User.create(payload);
    const jwtPayload = {
        userId: user.id,
        fullName: user.fullName,
        email: user.email,
        activeRole: user.activeRole
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        user,
        accessToken,
        refreshToken
    };
});
const myProfile = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById({ _id: userId });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "Profile not found!");
    }
    return result;
});
const getAllUsersFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find();
    return result;
});
const updateProfile = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield user_model_1.User.findById(userId);
    if (!isUserExists) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'The user could not found');
    }
    if (isUserExists.isBlocked) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'The user is Blocked');
    }
    const updatedPayload = Object.assign(Object.assign({}, payload), { profileImage: payload.profileImage });
    const result = yield user_model_1.User.findByIdAndUpdate(userId, updatedPayload, { new: true });
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
const addSellerRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById({ _id: userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (user === null || user === void 0 ? void 0 : user.roles.includes(user_constant_1.UserRole.SELLER)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You already have seller role!");
    }
    const result = yield user_model_1.User.updateOne({ _id: userId }, { $addToSet: { roles: user_constant_1.UserRole.SELLER } });
    return result;
});
const switchRole = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById({ _id: userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    let newRole = user.activeRole;
    switch (user.activeRole) {
        case user_constant_1.UserRole.CUSTOMER:
            if (!user.roles.includes(user_constant_1.UserRole.SELLER)) {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, "User does not have seller role!");
            }
            newRole = user_constant_1.UserRole.SELLER;
            break;
        case user_constant_1.UserRole.SELLER:
            newRole = user_constant_1.UserRole.CUSTOMER;
            break;
        default:
            break;
    }
    yield user_model_1.User.findByIdAndUpdate(userId, { activeRole: newRole }, { new: true });
    const jwtPayload = {
        userId: user.id,
        email: user.email,
        activeRole: newRole
    };
    const accessToken = (0, auth_utils_1.createToken)(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    return {
        message: "Role switched!",
        activeRole: newRole,
        accessToken
    };
});
const pendingSellerRequest = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.find({ isSellerRequest: true });
    return result;
});
const acceptSellerRequest = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById({ _id: userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    if (user === null || user === void 0 ? void 0 : user.roles.includes(user_constant_1.UserRole.SELLER)) {
        throw new AppError_1.default(http_status_1.default.CONFLICT, "You already have seller role!");
    }
    const result = yield user_model_1.User.updateOne({ _id: userId }, { $addToSet: { roles: user_constant_1.UserRole.SELLER } });
    return result;
});
exports.userServices = {
    register,
    updateProfile,
    deleteUserFromDb,
    myProfile,
    getAllUsersFromDb,
    addSellerRole,
    switchRole
};
