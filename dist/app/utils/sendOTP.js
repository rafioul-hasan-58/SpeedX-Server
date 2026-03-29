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
exports.sendOTP = void 0;
const http_status_1 = __importDefault(require("http-status"));
const mail_service_1 = require("../mail/mail.service");
const AppError_1 = __importDefault(require("../errors/AppError"));
const otp_schema_1 = require("../modules/Auth/otp.schema");
const user_model_1 = require("../modules/Users/user.model");
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
const sendOTP = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Step 1: Generate OTP and expiry time
    const otpCode = generateOTP().toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry
    // Step 2: Upsert OTP (findOneAndUpdate with upsert mirrors Prisma's upsert)
    yield otp_schema_1.OTP.findOneAndUpdate({ userId }, {
        otpCode,
        otpExpiresAt,
    }, {
        upsert: true, // create if not exists
        new: true,
    });
    // Step 3: Fetch user
    const user = yield user_model_1.User.findById(userId).select("email");
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "User not found while sending OTP!");
    }
    // Step 4: Send OTP via email
    yield mail_service_1.mailService.sendEmail(user.email, otpCode, "Verify Your OTP within 10 Minutes");
    return {
        message: "OTP sent successfully",
        expiresAt: otpExpiresAt,
    };
});
exports.sendOTP = sendOTP;
