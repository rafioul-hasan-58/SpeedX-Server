import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { chatbotService } from "./chatbot.service";
import sendResponse from "../../utils/sendResponse";

const chat = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { message } = req.body;

    const reply = await chatbotService.chat(userId, message);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Chat response generated successfully",
        data: { reply },
    });
});

const getChatHistory = catchAsync(async (req, res) => {
    const userId = req.user.userId;

    const history = await chatbotService.getChatHistory(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Chat history retrieved successfully",
        data: history,
    });
});

const clearChatHistory = catchAsync(async (req, res) => {
    const userId = req.user.userId;

    await chatbotService.clearChatHistory(userId);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Chat history cleared successfully",
        data: null,
    });
});

export const chatbotController = {
    chat,
    getChatHistory,
    clearChatHistory,
};
