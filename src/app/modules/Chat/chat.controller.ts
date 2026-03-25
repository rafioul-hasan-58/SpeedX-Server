import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
// import { ChatService } from "./chat.service"; // Uncomment when service is ready

const createChatIntoDB = catchAsync(async (req, res) => {
    const { email } = req.user;
    console.log(req.user);

    // const result = await ChatService.createChatIntoDB(email, req.body);

    sendResponse(res, {
        success: true,
        statusCode: status.OK,
        message: "Chat sent successfully!",
        data: "" // replace with result when service is connected
    });
});

export const ChatController = {
    createChatIntoDB,
};
