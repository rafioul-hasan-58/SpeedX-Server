import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import { chatbotService } from "./chatbot.service";

const chat = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const { message } = req.body;

    const reply = await chatbotService.chat(userId, message);

    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "Response generated successfully",
        data: { reply },
    });
});

const getChatHistory = catchAsync(async (req, res) => {
    const userId = req.user.userId;

    const history = await chatbotService.getChatHistory(userId);

    res.status(httpStatus.OK).json({
        success: true,
        statusCode: httpStatus.OK,
        message: "Chat history fetched successfully",
        data: history,
    });
});

const clearChatHistory = catchAsync(async (req, res) => {
    const userId = req.user.userId;

    await chatbotService.clearChatHistory(userId);

    res.status(httpStatus.OK).json({
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