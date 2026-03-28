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
exports.storeService = void 0;
const AppError_1 = __importDefault(require("../../errors/AppError"));
const user_model_1 = require("../Users/user.model");
const http_status_1 = __importDefault(require("http-status"));
const store_model_1 = require("./store.model");
const user_service_1 = require("../Users/user.service");
const createStore = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById({ _id: userId });
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found!");
    }
    const result = yield store_model_1.Store.create({
        owner: userId,
        storeName: payload.storeName,
        description: payload.description,
        address: payload.address,
        phone: payload.phone,
    });
    yield user_service_1.userServices.addSellerRole(userId);
    return result;
});
exports.storeService = {
    createStore
};
