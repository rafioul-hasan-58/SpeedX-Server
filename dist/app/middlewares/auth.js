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
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const config_1 = __importDefault(require("../config"));
const user_model_1 = require("../modules/Users/user.model");
const auth = (...requiredRole) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        // 1.Get token
        const token = req.headers.authorization;
        if (!token || !token.startsWith("Bearer ")) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "You are not authorized!");
        }
        const accessToken = token.split(" ")[1];
        if (!accessToken) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, "Invalid token format");
        }
        // 2.Decode token
        const verifiedUser = jsonwebtoken_1.default.verify(accessToken, config_1.default.jwt_access_secret);
        req.user = verifiedUser;
        const { email } = verifiedUser;
        // 3.Check if the user exists in the db
        const user = yield user_model_1.User.findOne({ email });
        if (!user) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'This user is not found !');
        }
        // 4.Check if the user is blocked
        if (user.isBlocked) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'This user is blocked !');
        }
        // 5.Check if the user role is allowed to access the route
        if (requiredRole.length > 0 && !requiredRole.includes(verifiedUser.activeRole)) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, "Forbidden, You are not authorized!");
        }
        next();
    }));
};
exports.default = auth;
