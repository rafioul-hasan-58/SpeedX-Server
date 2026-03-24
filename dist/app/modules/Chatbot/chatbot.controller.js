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
exports.chatbotController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const chatbot_service_1 = require("./chatbot.service");
const chat = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const { message } = req.body;
    const reply = yield chatbot_service_1.chatbotService.chat(userId, message);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Response generated successfully",
        data: { reply },
    });
}));
const getChatHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const history = yield chatbot_service_1.chatbotService.getChatHistory(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Chat history fetched successfully",
        data: history,
    });
}));
const clearChatHistory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    yield chatbot_service_1.chatbotService.clearChatHistory(userId);
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Chat history cleared successfully",
        data: null,
    });
}));
exports.chatbotController = {
    chat,
    getChatHistory,
    clearChatHistory,
};
